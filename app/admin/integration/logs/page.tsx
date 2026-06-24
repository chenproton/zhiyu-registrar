"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

const logs = [
  { id: "l1", system: "数字课程平台", action: "教学班数据同步", time: "2027-03-20 02:00", status: "success" },
  { id: "l2", system: "人事系统", action: "师资信息同步", time: "2027-03-20 01:30", status: "failed" },
  { id: "l3", system: "学工系统", action: "学生学籍同步", time: "2027-03-19 02:00", status: "success" },
]

export default function IntegrationLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">数据同步日志</h1>
        <p className="text-muted-foreground mt-1">查看各系统间数据同步任务执行记录</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">同步记录</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>对接系统</TableHead>
                <TableHead>同步内容</TableHead>
                <TableHead>执行时间</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.system}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "success" ? "default" : "destructive"}>
                      {log.status === "success" ? "成功" : "失败"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
