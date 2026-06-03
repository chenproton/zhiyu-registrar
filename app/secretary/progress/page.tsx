'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { BarChart3, AlertTriangle, CheckCircle2, Users, Bell, MessageSquare } from 'lucide-react'
import { getAllTeachingProgress } from '@/lib/role-utils'
import { cn } from '@/lib/utils'

export default function SecretaryProgressPage() {
  const allProgress = getAllTeachingProgress()
  const [filter, setFilter] = useState<'all' | 'lagging' | 'completed'>('all')
  const [urgencyMap, setUrgencyMap] = useState<Record<string, boolean>>({})

  const filtered = allProgress.filter((p) => {
    const percent = p.completedHours / p.plannedHours
    if (filter === 'lagging') return percent < 0.5
    if (filter === 'completed') return percent >= 1
    return true
  })

  const completedCount = allProgress.filter((p) => p.completedHours >= p.plannedHours).length
  const normalCount = allProgress.filter((p) => { const r = p.completedHours / p.plannedHours; return r >= 0.5 && r < 1 }).length
  const lowCount = allProgress.filter((p) => p.completedHours / p.plannedHours < 0.5).length

  const handleRemind = (id: string, facultyName: string, courseName: string) => {
    setUrgencyMap((prev) => ({ ...prev, [id]: true }))
    toast.success(`已向 ${facultyName}（${courseName}）发送催办通知`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">进度监控</h1>
        <p className="text-muted-foreground mt-1">监控全校教师的教学进度填报情况，对滞后课程发送催办</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{allProgress.length}</div><div className="text-xs text-muted-foreground">总课程数</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-600">{completedCount}</div><div className="text-xs text-muted-foreground">已完成</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-blue-600">{normalCount}</div><div className="text-xs text-muted-foreground">进行中</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-rose-600">{lowCount}</div><div className="text-xs text-muted-foreground">进度滞后</div></CardContent></Card>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>全部</Button>
        <Button size="sm" variant={filter === 'lagging' ? 'default' : 'outline'} onClick={() => setFilter('lagging')}>
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />进度滞后
        </Button>
        <Button size="sm" variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />已完成
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />教学进度明细
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filtered.map((p) => {
              const percent = Math.round((p.completedHours / p.plannedHours) * 100)
              const status = percent >= 100 ? 'completed' : percent >= 50 ? 'normal' : 'low'
              const isUrgent = status === 'low' && !urgencyMap[p.id]
              return (
                <div key={p.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.courseName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Users className="h-3 w-3" />教师：{p.facultyName} · 班级：{p.classId}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'completed' ? (
                        <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3 w-3 mr-1" />已完成</Badge>
                      ) : status === 'low' ? (
                        <Badge className="bg-rose-100 text-rose-700"><AlertTriangle className="h-3 w-3 mr-1" />滞后</Badge>
                      ) : (
                        <Badge variant="outline">进行中</Badge>
                      )}
                      {isUrgent && (
                        <Button size="sm" variant="outline" className="h-7 text-xs border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => handleRemind(p.id, p.facultyName, p.courseName)}>
                          <Bell className="h-3 w-3 mr-1" />催办
                        </Button>
                      )}
                      {urgencyMap[p.id] && (
                        <Badge variant="outline" className="text-xs h-7 border-blue-200 text-blue-600">
                          <MessageSquare className="h-3 w-3 mr-1" />已催办
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold">{p.plannedHours}</div>
                      <div className="text-xs text-muted-foreground">计划学时</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold">{p.completedHours}</div>
                      <div className="text-xs text-muted-foreground">已完成学时</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold">{p.studentAvgCompletion}%</div>
                      <div className="text-xs text-muted-foreground">学生平均完成率</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">教学进度</span>
                      <span className={cn('font-medium', status === 'completed' ? 'text-emerald-600' : status === 'low' ? 'text-rose-600' : 'text-blue-600')}>{percent}%</span>
                    </div>
                    <Progress value={percent} className={cn('h-2', status === 'low' && '[&>div]:bg-rose-500')} />
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">暂无教学进度数据</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
