'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Clock, MapPin, Users, Search, Filter, X } from 'lucide-react'
import { tasks, classes, venues, faculty } from '@/lib/mock-data'

const days = ['周一', '周二', '周三', '周四', '周五']
const periods = ['上午 1', '上午 2', '上午 3', '上午 4', '下午 1', '下午 2', '下午 3', '下午 4']

export default function SecretarySchedulingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [facultyFilter, setFacultyFilter] = useState<string>('all')
  const [classFilter, setClassFilter] = useState<string>('all')

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!t.courseName.toLowerCase().includes(q) &&
            !t.className.toLowerCase().includes(q) &&
            !t.facultyName.toLowerCase().includes(q) &&
            !t.venueName.toLowerCase().includes(q)) {
          return false
        }
      }
      if (facultyFilter !== 'all' && t.facultyId !== facultyFilter) return false
      if (classFilter !== 'all' && t.classId !== classFilter) return false
      return true
    })
  }, [searchQuery, facultyFilter, classFilter])

  const hasFilters = searchQuery || facultyFilter !== 'all' || classFilter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setFacultyFilter('all')
    setClassFilter('all')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">排课查看</h1>
        <p className="text-muted-foreground mt-1">查看全校排课情况，支持按教师/班级/课程搜索筛选</p>
      </div>

      {/* 筛选工具栏 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="搜索课程/教师/班级/场地..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="h-9 text-sm rounded-md border px-2"
              >
                <option value="all">全部教师</option>
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="h-9 text-sm rounded-md border px-2"
              >
                <option value="all">全部班级</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {hasFilters && (
                <Button variant="ghost" size="sm" className="h-9 px-2" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {hasFilters && (
            <div className="mt-2 text-xs text-muted-foreground">
              筛选结果：{filteredTasks.length} 条任务
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">全校课表总览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
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
                      const dayTasks = filteredTasks.filter((t) => t.dayOfWeek === day && t.periods.includes(period))
                      return (
                        <td key={day} className="p-2 min-h-[80px] align-top border-l">
                          <div className="space-y-1">
                            {dayTasks.map((task) => (
                              <div
                                key={task.id}
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
                                  <MapPin className="h-3 w-3" />{task.venueName}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 筛选结果列表 */}
      {filteredTasks.length > 0 && hasFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">筛选结果列表（{filteredTasks.length}项）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', task.type === 'scene' ? 'bg-orange-400' : 'bg-blue-400')} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{task.courseName}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.className} · {task.facultyName} · {task.venueName}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{days[task.dayOfWeek - 1]} {task.periods.join('、')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 统计 */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{tasks.length}</div><div className="text-xs text-muted-foreground">总教学任务</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{classes.length}</div><div className="text-xs text-muted-foreground">班级数</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{faculty.length}</div><div className="text-xs text-muted-foreground">任课教师</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">{venues.length}</div><div className="text-xs text-muted-foreground">教学场地</div></CardContent></Card>
      </div>
    </div>
  )
}
