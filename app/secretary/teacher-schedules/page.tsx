'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Users, Clock, MapPin } from 'lucide-react'
import { faculty } from '@/lib/mock-data'
import { getTasksByFaculty, getDayLabel } from '@/lib/role-utils'

const days = ['周一', '周二', '周三', '周四', '周五']
const periods = ['上午 1', '上午 2', '上午 3', '上午 4', '下午 1', '下午 2', '下午 3', '下午 4']

export default function SecretaryTeacherSchedulesPage() {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(faculty[0]?.id || '')
  const tasksByFaculty = getTasksByFaculty()
  const selectedTasks = tasksByFaculty.get(selectedFacultyId) || []
  const selectedFacultyInfo = faculty.find((f) => f.id === selectedFacultyId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">教师课表</h1>
        <p className="text-muted-foreground mt-1">按教师查看个人课表安排</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              教师选择
            </CardTitle>
            <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
              <SelectTrigger className="w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} ({f.title})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedFacultyInfo && (
            <p className="text-sm text-muted-foreground">
              当前选中：{selectedFacultyInfo.name} · {selectedFacultyInfo.positions?.join('、') || ''}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-medium w-[100px]">节次</th>
                  {days.map((d) => (
                    <th key={d} className="p-3 text-center font-medium">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period} className="border-t">
                    <td className="p-3 text-muted-foreground bg-muted/20">{period}</td>
                    {[1, 2, 3, 4, 5].map((day) => {
                      const task = selectedTasks.find((t) => t.dayOfWeek === day && t.periods.includes(period))
                      return (
                        <td key={day} className="p-2 min-h-[80px] align-top border-l min-w-[120px]">
                          {task ? (
                            <div
                              className={cn(
                                'text-xs rounded px-2 py-1.5 space-y-0.5',
                                task.type === 'scene'
                                  ? 'bg-orange-50 border border-orange-100'
                                  : 'bg-blue-50 border border-blue-100'
                              )}
                            >
                              <div className="font-medium">{task.courseName}</div>
                              <div className="text-muted-foreground text-[10px]">{task.className}</div>
                              <div className="text-muted-foreground text-[10px] flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {task.venueName}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/20 text-xs">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 任务清单 */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">教学任务清单（{selectedTasks.length}项）</h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedTasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-3 text-sm flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    task.type === 'scene' ? 'bg-orange-400' : 'bg-blue-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{task.courseName}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.className} · {getDayLabel(task.dayOfWeek)} {task.periods.join('、')}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{task.venueName}</Badge>
                </div>
              ))}
            </div>
            {selectedTasks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">该教师暂无教学任务</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
