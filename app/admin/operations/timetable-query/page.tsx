'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Clock, Users } from 'lucide-react'
import { getAllTasks, getDayLabel } from '@/lib/role-utils'

const days = ['周一', '周二', '周三', '周四', '周五']
const periods = ['上午 1', '上午 2', '上午 3', '上午 4', '下午 1', '下午 2', '下午 3', '下午 4']

export default function TimetableQueryPage() {
  const tasks = getAllTasks()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">课表查询</h1>
        <p className="text-muted-foreground mt-1">查询全校官方教学班课表、上课周次、节次及教室资源</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            全校课表总览
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
            {periods.map((period) => (
              <div key={period} className="grid grid-cols-6 border-t">
                <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{period}</div>
                {[1, 2, 3, 4, 5].map((day) => {
                  const task = tasks.find((t) => t.dayOfWeek === day && t.periods.includes(period))
                  return (
                    <div key={day} className="p-2 border-r last:border-r-0 min-h-[80px] text-xs">
                      {task ? (
                        <div className="rounded bg-primary/5 p-2 space-y-1">
                          <div className="font-medium truncate">{task.courseName}</div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {task.venueName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[10px] h-4">
                              {task.type === 'hybrid' ? '混合式' : task.type === 'scene' ? '场景' : '传统'}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full min-h-[50px] rounded flex items-center justify-center text-muted-foreground/20">-</div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">教学班明细</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 rounded-lg border p-3 text-sm hover:bg-muted/30 transition-colors">
              <div className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{task.courseName}</div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  {task.className} · {getDayLabel(task.dayOfWeek)} {task.periods.join('、')} · {task.weeks}
                </div>
              </div>
              <Badge variant="outline" className="text-xs">{task.venueName}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
