"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield, RefreshCw } from "lucide-react"

const integrations = [
  { id: "i1", name: "统一身份认证（SSO）", status: true },
  { id: "i2", name: "数字课程平台数据同步", status: true },
  { id: "i3", name: "人事系统师资同步", status: false },
  { id: "i4", name: "学工系统学生同步", status: true },
]

export default function IntegrationConfigPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">系统集成配置</h1>
          <p className="text-muted-foreground mt-1">配置与数字课程平台、人事、学工、认证中心等系统的接口</p>
        </div>
        <Button variant="outline"><RefreshCw className="h-4 w-4 mr-1" /> 刷新状态</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">系统对接开关</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge variant={item.status ? "default" : "secondary"}>{item.status ? "已启用" : "未启用"}</Badge>
                </div>
              </div>
              <Switch checked={item.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
