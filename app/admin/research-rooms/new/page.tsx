"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

const members = [
  { id: "u1", name: "张教授" },
  { id: "u2", name: "李教授" },
  { id: "u3", name: "王老师" },
  { id: "u4", name: "赵老师" },
]

export default function NewResearchRoomPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [leader, setLeader] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [description, setDescription] = useState("")

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("请输入教研室名称")
      return
    }
    if (!leader.trim()) {
      toast.error("请输入负责人")
      return
    }
    toast.success("虚拟教研室创建成功")
    router.push("/admin/research-rooms")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/research-rooms">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> 返回</Button>
          </Link>
          <h1 className="text-2xl font-semibold">创建虚拟教研室</h1>
        </div>
        <Button onClick={handleCreate}><Save className="h-4 w-4 mr-1" /> 创建</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">教研室信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>教研室名称</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入教研室名称" />
          </div>
          <div className="space-y-2">
            <Label>负责人</Label>
            <Input value={leader} onChange={(e) => setLeader(e.target.value)} placeholder="请输入负责人姓名" />
          </div>
          <div className="space-y-2">
            <Label>成员</Label>
            <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={selectedMembers.includes(m.id)}
                    onCheckedChange={(checked) =>
                      setSelectedMembers((prev) =>
                        checked ? [...prev, m.id] : prev.filter((id) => id !== m.id)
                      )
                    }
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>教研室简介</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="请输入教研室简介..." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
