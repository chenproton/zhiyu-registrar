'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { FileText, Plus, Clock, MapPin, CalendarDays, User, CheckCircle2, XCircle } from 'lucide-react'
import { getTeacherAdjustmentRequests, getDayLabel } from '@/lib/role-utils'
import { currentTeacher } from '@/lib/current-user'
import { adjustmentRequests } from '@/lib/mock-data'
import type { AdjustmentType } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const typeLabels: Record<AdjustmentType, string> = {
  change_time: '调时间',
  change_venue: '调场地',
  substitute: '代课',
  cancel: '停课',
  makeup: '补课',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '待审批', color: 'bg-amber-100 text-amber-700' },
  secretary_approved: { label: '秘书已通过', color: 'bg-blue-100 text-blue-700' },
  admin_approved: { label: '已通过', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '已驳回', color: 'bg-red-100 text-red-700' },
}

export default function TeacherAdjustmentsPage() {
  const myRequests = getTeacherAdjustmentRequests()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    courseName: '',
    className: '',
    type: 'change_time' as AdjustmentType,
    reason: '',
    originalDay: '',
    originalPeriods: '',
    originalVenue: '',
    newDay: '',
    newPeriods: '',
    newVenue: '',
  })

  const handleSubmit = () => {
    const newRequest = {
      id: `adj-${Date.now()}`,
      facultyId: currentTeacher.id,
      facultyName: currentTeacher.name,
      courseName: form.courseName,
      className: form.className,
      type: form.type,
      status: 'pending' as const,
      reason: form.reason,
      originalInfo: {
        dayOfWeek: form.originalDay ? parseInt(form.originalDay) : undefined,
        periods: form.originalPeriods ? form.originalPeriods.split('、') : undefined,
        venueName: form.originalVenue || undefined,
      },
      newInfo: {
        dayOfWeek: form.newDay ? parseInt(form.newDay) : undefined,
        periods: form.newPeriods ? form.newPeriods.split('、') : undefined,
        venueName: form.newVenue || undefined,
      },
      createdAt: new Date().toISOString().slice(0, 10),
    }
    adjustmentRequests.unshift(newRequest)
    toast.success('调课申请已提交')
    setDialogOpen(false)
    setForm({
      courseName: '', className: '', type: 'change_time', reason: '',
      originalDay: '', originalPeriods: '', originalVenue: '',
      newDay: '', newPeriods: '', newVenue: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">调课申请</h1>
          <p className="text-muted-foreground mt-1">发起调课、停课、代课等申请</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          新建申请
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            我的申请记录
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myRequests.map((req) => {
            const st = statusLabels[req.status] || { label: req.status, color: 'bg-gray-100 text-gray-700' }
            return (
              <div key={req.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{typeLabels[req.type]}</Badge>
                    <span className="font-medium">{req.courseName}</span>
                    <span className="text-sm text-muted-foreground">{req.className}</span>
                  </div>
                  <Badge className={cn(st.color)}>{st.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">原安排</div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.originalInfo.dayOfWeek ? getDayLabel(req.originalInfo.dayOfWeek) : '-'}
                      {req.originalInfo.periods?.join('、')}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.originalInfo.venueName || '-'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">调整后</div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.newInfo.dayOfWeek ? getDayLabel(req.newInfo.dayOfWeek) : '-'}
                      {req.newInfo.periods?.join('、')}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.newInfo.venueName || '-'}
                    </div>
                  </div>
                </div>

                <div className="text-sm bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">申请理由：</span>{req.reason}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    申请时间：{req.createdAt}
                  </div>
                  {req.reviewedAt && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {req.reviewerName} · {req.reviewedAt}
                    </div>
                  )}
                </div>

                {req.reviewRemark && (
                  <div className="text-xs text-muted-foreground bg-blue-50 rounded p-2">
                    审批意见：{req.reviewRemark}
                  </div>
                )}
              </div>
            )
          })}
          {myRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无调课申请</div>
          )}
        </CardContent>
      </Card>

      {/* 新建申请弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建调课申请</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">课程名称</label>
                <Input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} placeholder="输入课程名称" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">班级</label>
                <Input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="输入班级名称" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">申请类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as AdjustmentType })}
                className="w-full h-9 rounded-md border px-2 text-sm"
              >
                <option value="change_time">调时间</option>
                <option value="change_venue">调场地</option>
                <option value="substitute">代课</option>
                <option value="cancel">停课</option>
                <option value="makeup">补课</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">申请理由</label>
              <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="请输入调课理由..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">原星期（1-7）</label>
                <Input value={form.originalDay} onChange={(e) => setForm({ ...form, originalDay: e.target.value })} placeholder="如：1" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">原节次</label>
                <Input value={form.originalPeriods} onChange={(e) => setForm({ ...form, originalPeriods: e.target.value })} placeholder="如：上午 1、上午 2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">新星期（1-7）</label>
                <Input value={form.newDay} onChange={(e) => setForm({ ...form, newDay: e.target.value })} placeholder="如：5" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">新节次</label>
                <Input value={form.newPeriods} onChange={(e) => setForm({ ...form, newPeriods: e.target.value })} placeholder="如：上午 1、上午 2" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>提交申请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
