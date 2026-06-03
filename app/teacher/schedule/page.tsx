'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getTeacherTasks, getDayLabel } from '@/lib/role-utils'
import { Clock, MapPin, BookOpen, Users, FileText, CalendarDays, ArrowRight } from 'lucide-react'
import type { Task } from '@/lib/mock-data'

const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const allPeriods = ['上午 1', '上午 2', '上午 3', '上午 4', '下午 1', '下午 2', '下午 3', '下午 4', '晚上 1', '晚上 2']

export default function TeacherSchedulePage() {
  const router = useRouter()
  const myTasks = getTeacherTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const goToAdjustment = (task: Task) => {
    setDialogOpen(false)
    router.push(`/teacher/adjustments`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">我的课表</h1>
        <p className="text-muted-foreground mt-1">查看个人教学任务安排，点击课程查看详情或申请调课</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            本学期课表（点击课程查看详情）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 bg-muted">
              <div className="p-3 text-sm font-medium border-r">节次 / 星期</div>
              {days.map((d) => (
                <div key={d} className="p-3 text-sm font-medium text-center border-r last:border-r-0">
                  {d}
                </div>
              ))}
            </div>
            {allPeriods.map((period) => (
              <div key={period} className="grid grid-cols-6 border-t">
                <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{period}</div>
                {[1, 2, 3, 4, 5].map((day) => {
                  const task = myTasks.find((t) => t.dayOfWeek === day && t.periods.includes(period))
                  return (
                    <div
                      key={day}
                      className={cn(
                        'p-2 border-r last:border-r-0 min-h-[90px]',
                        !task && 'bg-muted/20'
                      )}
                    >
                      {task ? (
                        <button
                          onClick={() => openTaskDetail(task)}
                          className={cn(
                            'w-full text-left rounded p-2 text-xs space-y-1 transition-all hover:shadow-sm cursor-pointer',
                            task.type === 'scene'
                              ? 'bg-orange-50 border border-orange-100 hover:border-orange-300'
                              : 'bg-primary/5 border border-transparent hover:border-primary/30'
                          )}
                        >
                          <div className="font-medium truncate">{task.courseName}</div>
                          <div className="text-muted-foreground">{task.className}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {task.venueName}
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {task.type === 'scene' && (
                              <Badge variant="outline" className="text-[10px] h-4 border-orange-200 text-orange-600">
                                场景
                              </Badge>
                            )}
                          </div>
                        </button>
                      ) : (
                        <div className="w-full h-full min-h-[60px] rounded flex items-center justify-center text-muted-foreground/20">
                          -
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">教学任务清单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-lg border p-3 text-sm hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => openTaskDetail(task)}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  task.status === 'active' ? 'bg-emerald-500' :
                  task.status === 'draft' ? 'bg-amber-500' :
                  task.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{task.courseName}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">
                    {task.className} · {getDayLabel(task.dayOfWeek)} {task.periods.join('、')} · {task.weeks}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{task.venueName}</Badge>
                  <Badge variant={task.type === 'scene' ? 'secondary' : 'outline'} className="text-xs">
                    {task.type === 'scene' ? '场景教学' : '传统教学'}
                  </Badge>
                </div>
              </div>
            ))}
            {myTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">暂无教学任务</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 课程详情弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              课程详情
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-lg font-semibold">{selectedTask.courseName}</div>
                <div className="text-sm text-muted-foreground">{selectedTask.className}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    上课时间
                  </div>
                  <div className="font-medium">
                    {getDayLabel(selectedTask.dayOfWeek)} {selectedTask.periods.join('、')}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    上课场地
                  </div>
                  <div className="font-medium">{selectedTask.venueName}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    周次
                  </div>
                  <div className="font-medium">{selectedTask.weeks}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Users className="h-3.5 w-3.5" />
                    教学类型
                  </div>
                  <div className="font-medium">
                    {selectedTask.type === 'scene' ? '场景教学' : '传统教学'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => goToAdjustment(selectedTask)}>
                  <FileText className="h-4 w-4 mr-1" />
                  申请调课
                </Button>
                <Button className="flex-1" onClick={() => { setDialogOpen(false); router.push('/teacher/adjustments') }}>
                  查看调课记录 <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
