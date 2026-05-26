'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Play, Square, Trash2, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { evaluationActivities as initialActivities, evaluationTemplates, terms, type EvaluationActivity } from '@/lib/mock-data'
import { toast } from 'sonner'

const statusFilters = [
  { id: 'all', label: '全部活动', icon: Calendar },
  { id: 'active', label: '进行中', icon: Play },
  { id: 'not_started', label: '未开始', icon: Clock },
  { id: 'ended', label: '已结束', icon: CheckCircle2 },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  active: { label: '进行中', variant: 'default' },
  ended: { label: '已结束', variant: 'secondary' },
  not_started: { label: '未开始', variant: 'outline' },
}

const emptyActivity: EvaluationActivity = {
  id: '',
  name: '',
  termId: '',
  templateId: '',
  scope: '',
  startTime: '',
  endTime: '',
  status: 'not_started',
}

export default function EvaluationActivitiesPage() {
  const [activities, setActivities] = useState<EvaluationActivity[]>(initialActivities)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const [createOpen, setCreateOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<EvaluationActivity>({ ...emptyActivity })

  const filteredActivities = useMemo(() => {
    if (selectedStatus === 'all') return activities
    return activities.filter((a) => a.status === selectedStatus)
  }, [activities, selectedStatus])

  const openCreate = () => {
    setEditingActivity({
      ...emptyActivity,
      id: `ea-${Date.now()}`,
      termId: terms[0]?.id || '',
      templateId: evaluationTemplates[0]?.id || '',
    })
    setCreateOpen(true)
  }

  const handleCreate = () => {
    if (!editingActivity.name.trim()) {
      toast.error('请输入活动名称')
      return
    }
    if (!editingActivity.termId || !editingActivity.templateId) {
      toast.error('请选择学期和评价模板')
      return
    }
    setActivities((prev) => [...prev, editingActivity])
    toast.success('评价活动已创建')
    setCreateOpen(false)
  }

  const handleToggleStatus = (activity: EvaluationActivity) => {
    let nextStatus: EvaluationActivity['status']
    if (activity.status === 'not_started') nextStatus = 'active'
    else if (activity.status === 'active') nextStatus = 'ended'
    else nextStatus = 'not_started'

    setActivities((prev) =>
      prev.map((a) => (a.id === activity.id ? { ...a, status: nextStatus } : a))
    )
    toast.success(`活动已${nextStatus === 'active' ? '开始' : nextStatus === 'ended' ? '结束' : '重置'}`)
  }

  const handleDelete = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
    toast.success('活动已删除')
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧状态导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">活动状态</span>
        </div>
        <div className="space-y-1">
          {statusFilters.map((sf) => {
            const count =
              sf.id === 'all'
                ? activities.length
                : activities.filter((a) => a.status === sf.id).length
            return (
              <button
                key={sf.id}
                onClick={() => setSelectedStatus(sf.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                  selectedStatus === sf.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <sf.icon className="h-4 w-4" />
                  {sf.label}
                </span>
                <span
                  className={`text-xs ${
                    selectedStatus === sf.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 px-2 mb-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">学期</span>
          </div>
          <div className="space-y-1 px-2">
            {terms.map((t) => {
              const count = activities.filter((a) => a.termId === t.id).length
              return (
                <div key={t.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-muted-foreground">
                    {t.year} {t.semester}
                  </span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务评价活动</h1>
            <p className="text-muted-foreground text-sm">
              共 {filteredActivities.length} 个活动 · 创建与管理教学质量评价活动
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            新建活动
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">活动总数</p>
                <p className="text-2xl font-bold">{activities.length}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-2xl font-bold">{activities.filter((a) => a.status === 'active').length}</p>
              </div>
              <div className="rounded-full p-2 bg-green-500">
                <Play className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">未开始</p>
                <p className="text-2xl font-bold">{activities.filter((a) => a.status === 'not_started').length}</p>
              </div>
              <div className="rounded-full p-2 bg-amber-500">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">已结束</p>
                <p className="text-2xl font-bold">{activities.filter((a) => a.status === 'ended').length}</p>
              </div>
              <div className="rounded-full p-2 bg-gray-500">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活动名称</TableHead>
                  <TableHead>学期</TableHead>
                  <TableHead>评价模板</TableHead>
                  <TableHead>评价范围</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((ea) => (
                  <TableRow key={ea.id}>
                    <TableCell className="font-medium">{ea.name}</TableCell>
                    <TableCell>
                      {terms.find((t) => t.id === ea.termId)?.year}{' '}
                      {terms.find((t) => t.id === ea.termId)?.semester}
                    </TableCell>
                    <TableCell>
                      {evaluationTemplates.find((et) => et.id === ea.templateId)?.name || '—'}
                    </TableCell>
                    <TableCell>{ea.scope}</TableCell>
                    <TableCell>
                      {ea.startTime} ~ {ea.endTime}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[ea.status].variant}>{statusMap[ea.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(ea)}
                          title={
                            ea.status === 'not_started'
                              ? '开始活动'
                              : ea.status === 'active'
                                ? '结束活动'
                                : '重置活动'
                          }
                        >
                          {ea.status === 'active' ? (
                            <Square className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Play className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(ea.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      暂无评价活动
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 新建活动弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建评价活动</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>活动名称</Label>
              <Input
                value={editingActivity.name}
                onChange={(e) => setEditingActivity((a) => ({ ...a, name: e.target.value }))}
                placeholder="如 2026-2027第一学期期末学生评教"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>学期</Label>
                <Select
                  value={editingActivity.termId}
                  onValueChange={(v) => setEditingActivity((a) => ({ ...a, termId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择学期" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.year} {t.semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>评价模板</Label>
                <Select
                  value={editingActivity.templateId}
                  onValueChange={(v) => setEditingActivity((a) => ({ ...a, templateId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择模板" />
                  </SelectTrigger>
                  <SelectContent>
                    {evaluationTemplates.map((et) => (
                      <SelectItem key={et.id} value={et.id}>
                        {et.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>评价范围</Label>
              <Input
                value={editingActivity.scope}
                onChange={(e) => setEditingActivity((a) => ({ ...a, scope: e.target.value }))}
                placeholder="如 全校 / 计算机学院 / 2026级"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始时间</Label>
                <Input
                  type="date"
                  value={editingActivity.startTime}
                  onChange={(e) => setEditingActivity((a) => ({ ...a, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>结束时间</Label>
                <Input
                  type="date"
                  value={editingActivity.endTime}
                  onChange={(e) => setEditingActivity((a) => ({ ...a, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
