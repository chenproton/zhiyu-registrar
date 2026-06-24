'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTeacherTasks } from '@/lib/role-utils'
import { BookOpen, MapPin, Clock, Users, CalendarDays } from 'lucide-react'
import type { Task } from '@/lib/mock-data'

function taskTypeName(task: Task) {
  if (task.type === 'hybrid') return '混合式教学'
  if (task.type === 'scene') return '场景教学'
  return '传统教学'
}

function taskTypeBadge(task: Task) {
  if (task.type === 'hybrid') return { label: '混合式', className: 'bg-purple-50 text-purple-600 border-purple-200' }
  if (task.type === 'scene') return { label: '场景', className: 'bg-orange-50 text-orange-600 border-orange-200' }
  return { label: '传统', className: 'bg-blue-50 text-blue-600 border-blue-200' }
}

export default function TeacherCourseAssignmentsPage() {
  const myTasks = getTeacherTasks()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">授课任务查询</h1>
        <p className="text-muted-foreground mt-1">查看本学期承担的授课任务及教学班信息</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{myTasks.length}</div>
            <div className="text-xs text-muted-foreground">授课任务总数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{myTasks.filter((t) => t.type === 'hybrid').length}</div>
            <div className="text-xs text-muted-foreground">混合式课程</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{myTasks.filter((t) => t.type === 'scene').length}</div>
            <div className="text-xs text-muted-foreground">场景教学</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{myTasks.filter((t) => t.type === 'normal').length}</div>
            <div className="text-xs text-muted-foreground">传统教学</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            授课任务清单
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myTasks.map((task) => {
            const badge = taskTypeBadge(task)
            return (
              <div
                key={task.id}
                className="rounded-lg border p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-base">{task.courseName}</div>
                  <Badge variant="outline" className={badge.className}>
                    {badge.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{task.className}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{task.venueName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>第 {task.weeks} 周</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task.periods.join('、')}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  教学类型：{taskTypeName(task)}
                </div>
              </div>
            )
          })}
          {myTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无授课任务</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
