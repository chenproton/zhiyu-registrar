'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { FileCheck, CheckCircle2, XCircle, CalendarDays, MapPin, User } from 'lucide-react'
import { getAllAdjustmentRequests, getDayLabel } from '@/lib/role-utils'
import { adjustmentRequests, type AdjustmentRequest } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const typeLabels: Record<string, string> = {
  change_time: '调时间',
  change_venue: '调场地',
  substitute: '代课',
  cancel: '停课',
  makeup: '补课',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '待审批', color: 'bg-amber-100 text-amber-700' },
  secretary_approved: { label: '已通过', color: 'bg-emerald-100 text-emerald-700' },
  admin_approved: { label: '已通过', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '已驳回', color: 'bg-red-100 text-red-700' },
}

export default function SecretaryAdjustmentsPage() {
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const allRequests = getAllAdjustmentRequests()
  const pendingRequests = allRequests.filter((r) => r.status === 'pending')
  const displayList = tab === 'pending' ? pendingRequests : allRequests

  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<AdjustmentRequest | null>(null)
  const [reviewRemark, setReviewRemark] = useState('')

  const openReview = (req: AdjustmentRequest) => {
    setReviewTarget(req)
    setReviewRemark('')
    setReviewOpen(true)
  }

  const handleApprove = () => {
    if (!reviewTarget) return
    const idx = adjustmentRequests.findIndex((r) => r.id === reviewTarget.id)
    if (idx >= 0) {
      adjustmentRequests[idx].status = 'secretary_approved'
      adjustmentRequests[idx].reviewedAt = new Date().toISOString().slice(0, 10)
      adjustmentRequests[idx].reviewerName = '张秘书'
      adjustmentRequests[idx].reviewRemark = reviewRemark
    }
    toast.success('已通过该调课申请')
    setReviewOpen(false)
  }

  const handleReject = () => {
    if (!reviewTarget) return
    const idx = adjustmentRequests.findIndex((r) => r.id === reviewTarget.id)
    if (idx >= 0) {
      adjustmentRequests[idx].status = 'rejected'
      adjustmentRequests[idx].reviewedAt = new Date().toISOString().slice(0, 10)
      adjustmentRequests[idx].reviewerName = '张秘书'
      adjustmentRequests[idx].reviewRemark = reviewRemark
    }
    toast.success('已驳回该调课申请')
    setReviewOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">调课审批</h1>
        <p className="text-muted-foreground mt-1">审批教师提交的调课、代课、停课等申请</p>
      </div>

      {/* 标签切换 */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={tab === 'pending' ? 'default' : 'outline'}
          onClick={() => setTab('pending')}
        >
          待审批 ({pendingRequests.length})
        </Button>
        <Button
          size="sm"
          variant={tab === 'all' ? 'default' : 'outline'}
          onClick={() => setTab('all')}
        >
          全部 ({allRequests.length})
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            调课申请列表
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayList.map((req) => {
            const st = statusLabels[req.status] || { label: req.status, color: 'bg-gray-100 text-gray-700' }
            const canReview = req.status === 'pending' && tab === 'pending'
            return (
              <div key={req.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{typeLabels[req.type]}</Badge>
                    <span className="font-medium">{req.courseName}</span>
                    <span className="text-sm text-muted-foreground">{req.className}</span>
                    <Badge className={cn(st.color)}>{st.label}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">申请：{req.createdAt}</div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{req.facultyName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">原安排</div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.originalInfo.dayOfWeek ? getDayLabel(req.originalInfo.dayOfWeek) : '-'}
                      {req.originalInfo.periods?.join('、')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.originalInfo.venueName || '-'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">调整后</div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.newInfo.dayOfWeek ? getDayLabel(req.newInfo.dayOfWeek) : '-'}
                      {req.newInfo.periods?.join('、')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.newInfo.venueName || '-'}
                    </div>
                  </div>
                </div>

                <div className="text-sm bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">申请理由：</span>{req.reason}
                </div>

                {req.reviewRemark && (
                  <div className="text-sm text-muted-foreground bg-blue-50 rounded p-2">
                    审批意见：{req.reviewRemark}
                  </div>
                )}

                {canReview && (
                  <div className="flex items-center gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openReview(req)}>
                      审批
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
          {displayList.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {tab === 'pending' ? '暂无待审批的调课申请' : '暂无调课申请'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 审批弹窗 */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>审批调课申请</DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{typeLabels[reviewTarget.type]}</Badge>
                <span className="font-medium">{reviewTarget.courseName}</span>
              </div>
              <div>申请人：{reviewTarget.facultyName}</div>
              <div className="bg-muted/50 rounded p-2">
                <span className="text-muted-foreground">理由：</span>{reviewTarget.reason}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">审批意见</label>
                <Textarea
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                  placeholder="输入审批意见（可选）"
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-1" />
              驳回
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
