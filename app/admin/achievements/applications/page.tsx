'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Eye, X, Award, BookOpen, Beaker } from 'lucide-react'
import { teachingAchievements as initialAchievements, departments, type TeachingAchievement, type AchievementType } from '@/lib/mock-data'
import { toast } from 'sonner'

const achievementTypes: AchievementType[] = ['教学改革', '教材建设', '课程建设', '教学竞赛', '优秀毕设', '其他']

export default function AchievementsApplicationsPage() {
  const [achievements, setAchievements] = useState<TeachingAchievement[]>(initialAchievements)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<TeachingAchievement | null>(null)

  // Form state
  const [form, setForm] = useState({
    name: '',
    type: '教学改革' as AchievementType,
    applicantName: '',
    departmentId: '',
    content: '',
    isBenchmark: false,
  })

  const handleApply = () => {
    if (!form.name.trim() || !form.applicantName.trim() || !form.departmentId) {
      toast.error('请填写完整信息')
      return
    }
    const newAchievement: TeachingAchievement = {
      id: `ta-${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      applicantName: form.applicantName.trim(),
      departmentId: form.departmentId,
      content: form.content.trim(),
      status: '已提交',
      isBenchmark: form.isBenchmark,
    }
    setAchievements((prev) => [newAchievement, ...prev])
    setApplyDialogOpen(false)
    setForm({ name: '', type: '教学改革', applicantName: '', departmentId: '', content: '', isBenchmark: false })
    toast.success('成果申报提交成功，已进入审批流程')
  }

  const handleDelete = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id))
    toast.success('申报记录已删除')
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case '已通过': return 'default'
      case '已驳回': return 'destructive'
      case '审批中': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">成果申报</h1>
          <p className="text-muted-foreground">教师教学成果申报入口</p>
        </div>
        <Button onClick={() => setApplyDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          申报成果
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">申报总数</p>
              <p className="text-2xl font-bold">{achievements.length}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已通过</p>
              <p className="text-2xl font-bold">{achievements.filter((a) => a.status === '已通过').length}</p>
            </div>
            <div className="rounded-full p-2 bg-emerald-500">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">审批中</p>
              <p className="text-2xl font-bold">{achievements.filter((a) => a.status === '审批中').length}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">标杆案例</p>
              <p className="text-2xl font-bold">{achievements.filter((a) => a.isBenchmark).length}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Beaker className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>成果名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>申报人</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.map((ta) => (
                <TableRow key={ta.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {ta.name}
                      {ta.isBenchmark && <Badge variant="outline" className="text-[10px] h-5 border-purple-300 text-purple-600">标杆</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{ta.type}</TableCell>
                  <TableCell>{ta.applicantName}</TableCell>
                  <TableCell>{departments.find((d) => d.id === ta.departmentId)?.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(ta.status)}>
                      {ta.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7" onClick={() => { setSelectedAchievement(ta); setDetailDialogOpen(true) }}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        查看
                      </Button>
                      {(ta.status === '草稿' || ta.status === '已提交') && (
                        <Button variant="ghost" size="sm" className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(ta.id)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {achievements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    暂无申报记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 申报弹窗 */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              申报教学成果
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>成果名称</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="请输入成果名称" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>成果类型</Label>
                <Select value={form.type} onValueChange={(v) => setForm((prev) => ({ ...prev, type: v as AchievementType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {achievementTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>申报人</Label>
                <Input value={form.applicantName} onChange={(e) => setForm((prev) => ({ ...prev, applicantName: e.target.value }))} placeholder="请输入姓名" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>所属院系</Label>
              <Select value={form.departmentId} onValueChange={(v) => setForm((prev) => ({ ...prev, departmentId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择院系" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>成果内容描述</Label>
              <Textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} placeholder="请描述成果的主要内容、创新点和应用价值..." rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="benchmark" checked={form.isBenchmark} onCheckedChange={(v) => setForm((prev) => ({ ...prev, isBenchmark: v as boolean }))} />
              <Label htmlFor="benchmark">申报为标杆案例</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>取消</Button>
            <Button onClick={handleApply}>提交申报</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情弹窗 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>成果详情</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <div className="space-y-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">成果名称</span>
                <span className="font-medium">{selectedAchievement.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">类型</span>
                <Badge variant="outline">{selectedAchievement.type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">申报人</span>
                <span>{selectedAchievement.applicantName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">所属院系</span>
                <span>{departments.find((d) => d.id === selectedAchievement.departmentId)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">状态</span>
                <Badge variant={statusVariant(selectedAchievement.status)}>{selectedAchievement.status}</Badge>
              </div>
              {selectedAchievement.isBenchmark && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">标杆案例</span>
                  <Badge variant="outline" className="border-purple-300 text-purple-600">是</Badge>
                </div>
              )}
              <div className="pt-2 border-t">
                <span className="text-muted-foreground block mb-1">成果内容</span>
                <p className="text-sm leading-relaxed">{selectedAchievement.content}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
