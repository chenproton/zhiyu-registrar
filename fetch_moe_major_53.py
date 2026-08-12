#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
高等职业教育专科专业设置备案结果抓取脚本
来源: https://zwfw.moe.gov.cn/zyyxzy/
说明: 专业代码固定为 53, 依次遍历各省份(从接口动态获取), 翻页拉取全部数据, 保存为 JSON
"""

import json
import os
import time
import urllib.parse
import urllib.request

API_BASE = "https://zwfw.moe.gov.cn/eduSearch/api"
MAJOR_CODE = "53"
YEAR = "2025"
PAGE_SIZE = 50
REQUEST_INTERVAL = 1.5
MAX_RETRIES = 5
OUTPUT_FILE = "major_53_province.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Referer": "https://zwfw.moe.gov.cn/zyyxzy/result.html",
}


def http_get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_page(province_code, page):
    params = {
        "majorCode": MAJOR_CODE,
        "province": province_code,
        "year": YEAR,
        "page": page,
        "pageSize": PAGE_SIZE,
    }
    url = f"{API_BASE}/major-register?" + urllib.parse.urlencode(params)
    for attempt in range(MAX_RETRIES):
        try:
            resp = http_get(url)
            if resp.get("success"):
                return resp
            print(f"  接口返回失败(page={page}): {resp.get('msg')}")
        except Exception as exc:
            print(f"  请求异常(page={page}, 第{attempt + 1}次): {exc}")
        time.sleep(2 * (attempt + 1))
    return None


def fetch_provinces():
    data = http_get(f"{API_BASE}/provinces")
    if not data.get("success"):
        raise RuntimeError(f"获取省份列表失败: {data}")
    return data["data"]


def fetch_province(province, existing=None):
    code, name = province["code"], province["name"]
    if existing is not None and existing.get("total") == existing.get("count") and existing.get("count", -1) >= 0:
        print(f"[{name}] 已抓取完整({existing['count']}条), 跳过")
        return existing["records"], existing["total"]
    print(f"[{name}] 开始抓取..." + (f"(续抓, 已有{existing['count']}条)" if existing else ""))
    records = []
    page = 1
    total = 0
    while True:
        resp = fetch_page(code, page)
        if resp is None:
            print(f"  [{name}] 第{page}页重试后仍失败, 该页数据缺失")
            break
        items = resp["data"]["list"] or []
        records.extend(items)
        total = int(resp["data"]["total"])
        total_pages = (total + PAGE_SIZE - 1) // PAGE_SIZE
        print(f"  第{page}/{total_pages}页, 累计 {len(records)}/{total} 条")
        if page >= total_pages:
            break
        page += 1
        time.sleep(REQUEST_INTERVAL)
    return records, total


def main():
    provinces = fetch_provinces()
    print(f"共获取 {len(provinces)} 个省级单位")

    result = None
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, encoding="utf-8") as f:
            result = json.load(f)
        print(f"检测到已有结果文件, 断点续抓: {OUTPUT_FILE}")
    if result is None or result.get("year") != YEAR or result.get("majorCode") != MAJOR_CODE:
        result = {
            "majorCode": MAJOR_CODE,
            "year": YEAR,
            "source": "https://zwfw.moe.gov.cn/zyyxzy/",
            "provinces": [],
        }

    done = {p["code"]: p for p in result["provinces"]}
    for idx, province in enumerate(provinces, 1):
        existing = done.get(province["code"])
        records, total = fetch_province(province, existing)
        result["provinces"] = [p for p in result["provinces"] if p["code"] != province["code"]]
        result["provinces"].append({
            "code": province["code"],
            "name": province["name"],
            "total": total,
            "count": len(records),
            "records": records,
        })
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"[{province['name']}] 完成, 共 {len(records)} 条 ({idx}/{len(provinces)})\n")
        time.sleep(REQUEST_INTERVAL)

    incomplete = [p for p in result["provinces"] if p["count"] != p["total"]]
    if incomplete:
        print("以下省份数据不完整, 可再次运行本脚本续抓:")
        for p in incomplete:
            print(f"  {p['name']}: {p['count']}/{p['total']}")
    print(f"抓取完成, 已保存到 {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
