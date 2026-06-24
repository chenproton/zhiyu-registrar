"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare } from "lucide-react"

const rooms = [
  { id: "r1", name: "Web前端开发虚拟教研室", leader: "张教授", members: 12, topics: 5, status: "active" },
  { id: "r2", name: "软件工程基础虚拟教研室", leader: "李教授", members: 8, topics: 3, status: "active" },
]

export default function ResearchRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">虚拟教研室</h1>
          <p className="text-muted-foreground mt-1">跨校/跨专业教师在线教研协作空间</p>
        </div>
        <Link href="/admin/research-rooms/new">
          <Button><Users className="h-4 w-4 mr-1" /> 创建教研室</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">教研室列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">负责人：{room.leader} · 成员 {room.members} 人 · 教研主题 {room.topics} 个</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">{room.status === "active" ? "进行中" : "已归档"}</Badge>
                <Link href={`/admin/research-rooms/${room.id}`}>
                  <Button variant="outline" size="sm">进入</Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
