'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CalendarDays,
  BookOpen,
  ClipboardList,
  BarChart3,
  FileText,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { getTeacherTasks, getTeacherPreparationTasks, getTeacherTeachingProgress, getTeacherInfo, getDayLabel } from '@/lib/role-utils'
import { currentTeacher } from '@/lib/current-user'
import { cn } from '@/lib/utils'

export default function TeacherDashboardPage() {
  const router = useRouter()
  const teacherInfo = getTeacherInfo()
  const myTasks = getTeacherTasks()
  const myPreps = getTeacherPreparationTasks()
  const myProgress = getTeacherTeachingProgress()

  // 本周课时统计
  const weeklyStats = useMemo(() => {
    const total = myTasks.length
    const completed = myPreps.filter((p) => p.status === 'completed').length
    const pending = myPreps.filter((p) => p.status === 'not_started').length
    const progressCount = myProgress.filter((p) => p.completedHours < p.plannedHours).length
    return { total, completed, pending, progressCount }
  }, [myTasks, myPreps, myProgress])

  // 本周课表（按天分组）
  const weekSchedule = useMemo(() => {
    const map = new Map<number, typeof myTasks>()
    myTasks.forEach((t) => {
      const list = map.get(t.dayOfWeek) || []
      list.push(t)
      map.set(t.dayOfWeek, list)
    })
    return map
  }, [myTasks])

  const weekDays = [1, 2, 3, 4, 5]

  const quickActions = [
    { id: 'schedule', label: '我的课表', icon: CalendarDays, href: '/teacher/schedule', color: 'text-blue-600 bg-blue-50' },
    { id: 'syllabus', label: '课程与能力目标', icon: BookOpen, href: '/teacher/syllabus', color: 'text-emerald-600 bg-emerald-50' },
    { id: 'preparation', label: '备课中心', icon: ClipboardList, href: '/teacher/preparation', color: 'text-amber-600 bg-amber-50' },
    { id: 'progress', label: '教学进度', icon: BarChart3, href: '/teacher/progress', color: 'text-purple-600 bg-purple-50' },
    { id: 'adjustments', label: '调课申请', icon: FileText, href: '/teacher/adjustments', color: 'text-rose-600 bg-rose-50' },
  ]

  return (
    <div className="space-y-6">
      {/* 欢迎区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">教师工作台</h1>
          <p className="text-muted-foreground mt-1">
            欢迎回来，{currentTeacher.name} {teacherInfo?.title} · {teacherInfo?.teachingQualifications.join('、')}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          工号：{teacherInfo?.employeeId}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyStats.total}</div>
              <div className="text-xs text-muted-foreground">本周教学任务</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyStats.completed}</div>
              <div className="text-xs text-muted-foreground">已完成备课</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyStats.pending}</div>
              <div className="text-xs text-muted-foreground">待备课任务</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyStats.progressCount}</div>
              <div className="text-xs text-muted-foreground">待填报进度</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 本周课表 */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                本周课表
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/teacher/schedule')}>
                查看全部 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {weekDays.map((day) => {
                const dayTasks = weekSchedule.get(day) || []
                return (
                  <div key={day} className="space-y-2">
                    <div className="text-sm font-medium text-center pb-2 border-b">{getDayLabel(day)}</div>
                    {dayTasks.length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center py-4">无课程</div>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            'rounded-lg border p-2.5 text-xs space-y-1 cursor-pointer hover:shadow-sm transition-all',
                            task.type === 'scene'
                              ? 'bg-orange-50 border-orange-100'
                              : 'bg-primary/5 border-transparent'
                          )}
                          onClick={() => router.push('/teacher/schedule')}
                        >
                          <div className="font-medium truncate">{task.courseName}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.periods.join('、')}
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {task.venueName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[10px] h-4">
                              {task.className}
                            </Badge>
                            {task.type === 'scene' && (
                              <Badge variant="outline" className="text-[10px] h-4 border-orange-200 text-orange-600">
                                场景
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 + 待办 */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">快捷入口</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-11"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', action.color.split(' ').slice(1).join(' '))}>
                      <Icon className={cn('h-4 w-4', action.color.split(' ')[0])} />
                    </div>
                    <span className="text-sm">{action.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">教学进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myProgress.slice(0, 4).map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{p.courseName}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {p.completedHours}/{p.plannedHours}学时
                    </span>
                  </div>
                  <Progress value={(p.completedHours / p.plannedHours) * 100} className="h-2" />
                </div>
              ))}
              {myProgress.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-2">暂无教学进度数据</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
