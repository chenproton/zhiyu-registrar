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
import { AlertTriangle, CheckCircle2, Clock, MapPin, Users, Shield, BarChart3, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnomalyItem {
  id: string
  type: 'conflict' | 'absence' | 'delay' | 'venue_issue'
  title: string
  description: string
  courseName: string
  className: string
  facultyName: string
  status: 'open' | 'processing' | 'resolved'
  createdAt: string
  resolvedAt?: string
  handlerRemark?: string
  handlerName?: string
}

const initialAnomalies: AnomalyItem[] = [
  {
    id: 'ano-001', type: 'conflict', title: '场地冲突',
    description: '周建国与吴晓敏的课程在同一时间使用了教学楼A-301',
    courseName: '程序设计基础 / 数据结构', className: '软件工程2026级1班',
    facultyName: '周建国 / 吴晓敏', status: 'open', createdAt: '2026-05-30',
  },
  {
    id: 'ano-002', type: 'delay', title: '教学进度滞后',
    description: '汽车构造课程完成学时仅为计划的62.5%，需要关注',
    courseName: '汽车构造', className: '汽车工程2026级1班',
    facultyName: '刘建国', status: 'processing', createdAt: '2026-05-28',
    handlerRemark: '已联系教师，要求加快进度',
    handlerName: '张秘书',
  },
  {
    id: 'ano-003', type: 'venue_issue', title: '场地设备故障',
    description: '教学楼B-205投影仪故障，影响高等数学课程',
    courseName: '高等数学', className: '软件工程2026级1班',
    facultyName: '周建国', status: 'resolved', createdAt: '2026-05-25',
    resolvedAt: '2026-05-26', handlerRemark: '已报修并更换教室',
    handlerName: '张秘书',
  },
  {
    id: 'ano-004', type: 'absence', title: '教师缺勤预警',
    description: '设计基础课程近两周出勤记录异常偏低',
    courseName: '设计基础', className: '平面设计2026级1班',
    facultyName: '赵丽华', status: 'open', createdAt: '2026-06-01',
  },
]

const typeConfig: Record<string, { label: string; icon: typeof AlertTriangle; color: string }> = {
  conflict: { label: '冲突', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  absence: { label: '缺勤', icon: Users, color: 'text-amber-600 bg-amber-50' },
  delay: { label: '滞后', icon: Clock, color: 'text-orange-600 bg-orange-50' },
  venue_issue: { label: '场地', icon: MapPin, color: 'text-blue-600 bg-blue-50' },
}

const statusConfig: Record<string, { label: string; badge: string }> = {
  open: { label: '待处理', badge: 'bg-red-100 text-red-700' },
  processing: { label: '处理中', badge: 'bg-amber-100 text-amber-700' },
  resolved: { label: '已解决', badge: 'bg-emerald-100 text-emerald-700' },
}

export default function SecretaryAnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(initialAnomalies)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const [handleOpen, setHandleOpen] = useState(false)
  const [handleTarget, setHandleTarget] = useState<AnomalyItem | null>(null)
  const [handleRemark, setHandleRemark] = useState('')
  const [handleAction, setHandleAction] = useState<'processing' | 'resolved'>('resolved')

  const filtered = anomalies.filter((a) => {
    if (filter === 'open') return a.status !== 'resolved'
    if (filter === 'resolved') return a.status === 'resolved'
    return true
  }).filter((a) => {
    if (typeFilter === 'all') return true
    return a.type === typeFilter
  })

  const stats = {
    total: anomalies.length,
    open: anomalies.filter((a) => a.status === 'open').length,
    processing: anomalies.filter((a) => a.status === 'processing').length,
    resolved: anomalies.filter((a) => a.status === 'resolved').length,
  }

  const openHandle = (ano: AnomalyItem, action: 'processing' | 'resolved') => {
    setHandleTarget(ano)
    setHandleAction(action)
    setHandleRemark('')
    setHandleOpen(true)
  }

  const confirmHandle = () => {
    if (!handleTarget) return
    setAnomalies((prev) => prev.map((a) => a.id === handleTarget.id ? {
      ...a,
      status: handleAction,
      resolvedAt: handleAction === 'resolved' ? new Date().toISOString().slice(0, 10) : a.resolvedAt,
      handlerRemark: handleRemark,
      handlerName: '张秘书',
    } : a))
    toast.success(handleAction === 'resolved' ? '已标记为已解决' : '已标记为处理中')
    setHandleOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">异常监控</h1>
        <p className="text-muted-foreground mt-1">查看和处理教学运行中的异常情况</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs text-muted-foreground">异常总数</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-red-600">{stats.open}</div><div className="text-xs text-muted-foreground">待处理</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-amber-600">{stats.processing}</div><div className="text-xs text-muted-foreground">处理中</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div><div className="text-xs text-muted-foreground">已解决</div></CardContent></Card>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>全部</Button>
          <Button size="sm" variant={filter === 'open' ? 'default' : 'outline'} onClick={() => setFilter('open')}>待处理</Button>
          <Button size="sm" variant={filter === 'resolved' ? 'default' : 'outline'} onClick={() => setFilter('resolved')}>已解决</Button>
        </div>
        <div className="h-6 w-px bg-border mx-1" />
        <div className="flex items-center gap-1">
          {['all', 'conflict', 'delay', 'venue_issue', 'absence'].map((t) => (
            <Button key={t} size="sm" variant={typeFilter === t ? 'secondary' : 'outline'} onClick={() => setTypeFilter(t)}>
              {t === 'all' ? '所有类型' : typeConfig[t]?.label || t}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />异常列表
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((ano) => {
            const tc = typeConfig[ano.type] || typeConfig.conflict
            const sc = statusConfig[ano.status] || statusConfig.open
            const Icon = tc.icon
            const isOpen = ano.status === 'open'
            const isProcessing = ano.status === 'processing'
            return (
              <div key={ano.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', tc.color.split(' ').slice(1).join(' '))}>
                      <Icon className={cn('h-4 w-4', tc.color.split(' ')[0])} />
                    </div>
                    <div>
                      <div className="font-medium">{ano.title}</div>
                      <div className="text-xs text-muted-foreground">{ano.courseName} · {ano.className}</div>
                    </div>
                  </div>
                  <Badge className={cn(sc.badge)}>{sc.label}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">{ano.description}</div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />{ano.facultyName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />{ano.createdAt}
                    {ano.resolvedAt && <><CheckCircle2 className="h-3 w-3 text-emerald-500" />解决于 {ano.resolvedAt}</>}
                  </div>
                </div>

                {ano.handlerRemark && (
                  <div className="text-xs bg-blue-50 rounded p-2 flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-blue-700 font-medium">{ano.handlerName}：</span>
                      <span className="text-blue-600">{ano.handlerRemark}</span>
                    </div>
                  </div>
                )}

                {(isOpen || isProcessing) && (
                  <div className="flex items-center gap-2 justify-end">
                    {isOpen && (
                      <Button size="sm" variant="outline" onClick={() => openHandle(ano, 'processing')}>
                        <Shield className="h-3.5 w-3.5 mr-1" />标记处理中
                      </Button>
                    )}
                    <Button size="sm" onClick={() => openHandle(ano, 'resolved')}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />标记已解决
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
              <span>暂无异常记录</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 处理弹窗 */}
      <Dialog open={handleOpen} onOpenChange={setHandleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{handleAction === 'resolved' ? '标记异常为已解决' : '标记异常为处理中'}</DialogTitle>
          </DialogHeader>
          {handleTarget && (
            <div className="space-y-3">
              <div className="text-sm"><span className="font-medium">{handleTarget.title}</span> · {handleTarget.courseName}</div>
              <div className="space-y-1">
                <label className="text-sm font-medium">处理说明</label>
                <Textarea value={handleRemark} onChange={(e) => setHandleRemark(e.target.value)} placeholder="输入处理说明..." rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setHandleOpen(false)}>取消</Button>
            <Button onClick={confirmHandle}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
