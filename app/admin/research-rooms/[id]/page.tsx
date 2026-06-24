"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, Users, Calendar, Send } from "lucide-react"
import { toast } from "sonner"

const rooms: Record<string, { name: string; leader: string; members: number; topics: number; status: string; description: string }> = {
  r1: {
    name: "Web前端开发虚拟教研室",
    leader: "张教授",
    members: 12,
    topics: 5,
    status: "active",
    description: "聚焦Web前端开发课程建设与教学改革，定期开展集体备课、教学研讨与资源共享。",
  },
  r2: {
    name: "软件工程基础虚拟教研室",
    leader: "李教授",
    members: 8,
    topics: 3,
    status: "active",
    description: "软件工程基础课程虚拟教研室，推动课程思政与项目化教学改革。",
  },
}

export default function ResearchRoomDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const room = rooms[id] || rooms["r1"]

  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTopic, setActiveTopic] = useState("")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Record<string, string[]>>({
    "混合式教学改革研讨": ["张教授：建议增加课前微课预习环节。", "李老师：同意，可以结合项目化教学。"],
    "课程思政案例设计": [],
    "期末考核方案制定": [],
  })

  const openDiscuss = (topic: string) => {
    setActiveTopic(topic)
    setComment("")
    setDialogOpen(true)
  }

  const handleSend = () => {
    if (!comment.trim()) {
      toast.error("请输入研讨内容")
      return
    }
    setComments((prev) => ({
      ...prev,
      [activeTopic]: [...(prev[activeTopic] || []), `我：${comment}`],
    }))
    toast.success("研讨发言已提交")
    setComment("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/research-rooms">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
        </Link>
        <h1 className="text-2xl font-semibold">{room.name}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">{room.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6 flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">成员</p>
                  <p className="text-xl font-bold">{room.members} 人</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">教研主题</p>
                  <p className="text-xl font-bold">{room.topics} 个</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">状态</p>
                  <p className="text-xl font-bold">{room.status === "active" ? "进行中" : "已归档"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">教研主题</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["混合式教学改革研讨", "课程思政案例设计", "期末考核方案制定"].map((topic, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm">{topic}</span>
                {comments[topic]?.length > 0 && <Badge variant="outline">{comments[topic].length} 条发言</Badge>}
              </div>
              <Button variant="outline" size="sm" onClick={() => openDiscuss(topic)}>参与研讨</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" /> {activeTopic}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments[activeTopic]?.length > 0 ? (
                comments[activeTopic].map((c, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg text-sm">{c}</div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">暂无研讨内容，快来发表第一条发言吧</p>
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请输入研讨内容..."
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleSend} className="self-end">
                <Send className="h-4 w-4 mr-1" /> 发送
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
