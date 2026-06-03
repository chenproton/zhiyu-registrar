'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ClipboardList, ChevronRight, BookOpen, Clock, Eye } from 'lucide-react'
import { getTeacherPreparationTasks } from '@/lib/role-utils'
import { cn } from '@/lib/utils'

export default function TeacherPreparationPage() {
  const router = useRouter()
  const myPreps = getTeacherPreparationTasks()

  const statusConfig: Record<string, { label: string; color: string; badge: string }> = {
    pending: { label: '未开始', color: 'text-gray-500', badge: 'bg-gray-100 text-gray-700' },
    in_progress: { label: '进行中', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    submitted: { label: '已提交', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    completed: { label: '已完成', color: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  }

  const stats = {
    total: myPreps.length,
    completed: myPreps.filter((p) => p.status === 'completed').length,
    inProgress: myPreps.filter((p) => p.status === 'in_progress').length,
    notStarted: myPreps.filter((p) => p.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">备课中心</h1>
        <p className="text-muted-foreground mt-1">管理个人备课任务与进度</p>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">备课任务总数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">已完成</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-muted-foreground">进行中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-500">{stats.notStarted}</div>
            <div className="text-xs text-muted-foreground">未开始</div>
          </CardContent>
        </Card>
      </div>

      {/* 备课列表 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            备课任务列表
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myPreps.map((prep) => {
            const cfg = statusConfig[prep.status] || statusConfig.not_started
            return (
              <div
                key={prep.id}
                className="rounded-lg border p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{prep.taskName}</div>
                      <div className="text-xs text-muted-foreground">
                        {prep.courseName} · {prep.className}
                      </div>
                    </div>
                  </div>
                  <Badge className={cn(cfg.badge)}>{cfg.label}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>类型：{prep.taskType === 'scene' ? '场景教学' : '传统教学'}</span>
                  </div>
                  <div>阶段完成度：</div>
                </div>

                <div className="flex items-center gap-3">
                  <Progress value={prep.progress} className="flex-1 h-2" />
                  <span className={cn('text-sm font-medium shrink-0', cfg.color)}>{prep.progress}%</span>
                  <Button variant="ghost" size="sm" className="shrink-0 h-7" onClick={() => router.push(`/teacher/preparation/${prep.id}`)}>
                    <Eye className="h-3.5 w-3.5 mr-1" />详情
                  </Button>
                </div>
              </div>
            )
          })}
          {myPreps.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无备课任务</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
