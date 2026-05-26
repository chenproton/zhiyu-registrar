'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Layers, Clock, Cloud, ChevronRight, Filter } from 'lucide-react'
import { tasks, departments, majors, classes, type Task } from '@/lib/mock-data'

export default function TaskProgressDashboardPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'traditional' | 'scene'>('all')
  const [filterDept, setFilterDept] = useState<string>('all')
  const [filterMajor, setFilterMajor] = useState<string>('all')
  const [filterClass, setFilterClass] = useState<string>('all')

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false
      const cls = classes.find((c) => c.id === t.classId)
      if (filterClass !== 'all' && t.classId !== filterClass) return false
      if (filterMajor !== 'all' && cls?.majorId !== filterMajor) return false
      if (filterDept !== 'all') {
        const major = majors.find((m) => m.id === cls?.majorId)
        if (major?.departmentId !== filterDept) return false
      }
      return true
    })
  }, [filterType, filterDept, filterMajor, filterClass])

  const avgCompletion = Math.round(
    filteredTasks.reduce((sum, t) => sum + (t.progressSummary?.completionRate || 0), 0) /
      (filteredTasks.filter((t) => t.progressSummary).length || 1)
  )

  const avgStudentCompletion = Math.round(
    filteredTasks.reduce((sum, t) => sum + (t.progressSummary?.studentAvgCompletion || 0), 0) /
      (filteredTasks.filter((t) => t.progressSummary).length || 1)
  )

  // 按维度汇总
  const dimensionSummary = useMemo(() => {
    if (filterClass !== 'all') return null
    if (filterMajor !== 'all') {
      // 按班级汇总
      const relatedClasses = classes.filter((c) => c.majorId === filterMajor)
      return relatedClasses.map((c) => {
        const classTasks = tasks.filter((t) => t.classId === c.id)
        const avg = Math.round(classTasks.reduce((s, t) => s + (t.progressSummary?.completionRate || 0), 0) / (classTasks.length || 1))
        return { name: c.name, value: avg, count: classTasks.length }
      })
    }
    if (filterDept !== 'all') {
      // 按专业汇总
      const relatedMajors = majors.filter((m) => m.departmentId === filterDept)
      return relatedMajors.map((m) => {
        const majorClasses = classes.filter((c) => c.majorId === m.id)
        const classIds = majorClasses.map((c) => c.id)
        const majorTasks = tasks.filter((t) => classIds.includes(t.classId))
        const avg = Math.round(majorTasks.reduce((s, t) => s + (t.progressSummary?.completionRate || 0), 0) / (majorTasks.length || 1))
        return { name: m.name, value: avg, count: majorTasks.length }
      })
    }
    // 按院系汇总
    return departments.map((d) => {
      const deptMajors = majors.filter((m) => m.departmentId === d.id)
      const deptClasses = classes.filter((c) => deptMajors.some((m) => m.id === c.majorId))
      const classIds = deptClasses.map((c) => c.id)
      const deptTasks = tasks.filter((t) => classIds.includes(t.classId))
      const avg = Math.round(deptTasks.reduce((s, t) => s + (t.progressSummary?.completionRate || 0), 0) / (deptTasks.length || 1))
      return { name: d.name, value: avg, count: deptTasks.length }
    })
  }, [filterDept, filterMajor, filterClass])

  const handleViewDetail = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">任务进度看板</h1>
        <p className="text-muted-foreground">按任务维度汇聚进度数据，支持按院系/专业/班级穿透</p>
      </div>

      {/* 统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">监控任务总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均课时完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">学生平均完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStudentCompletion}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">场景教学任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTasks.filter((t) => t.type === 'scene').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="任务类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部任务</SelectItem>
            <SelectItem value="traditional">传统教学</SelectItem>
            <SelectItem value="scene">场景教学</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterDept} onValueChange={(v) => { setFilterDept(v); setFilterMajor('all'); setFilterClass('all') }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="按院系筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部院系</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterMajor} onValueChange={(v) => { setFilterMajor(v); setFilterClass('all') }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="按专业筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部专业</SelectItem>
            {majors.filter((m) => filterDept === 'all' || m.departmentId === filterDept).map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="按班级筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部班级</SelectItem>
            {classes.filter((c) => filterMajor === 'all' || c.majorId === filterMajor).map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 维度汇总 */}
      {dimensionSummary && dimensionSummary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {filterMajor !== 'all' ? '班级维度汇总' : filterDept !== 'all' ? '专业维度汇总' : '院系维度汇总'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dimensionSummary.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm truncate">{item.name}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <Progress value={item.value} className="h-2 flex-1" />
                    <span className="text-xs w-10">{item.value}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground w-16 text-right">{item.count}个任务</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 进度列表 */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>教师</TableHead>
                <TableHead>班级</TableHead>
                <TableHead>计划/已完成课时</TableHead>
                <TableHead>课时完成率</TableHead>
                <TableHead>学生完成率</TableHead>
                <TableHead>数据来源</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                const ps = task.progressSummary
                const rate = ps ? ps.completionRate : 0
                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{task.courseName}</div>
                      <div className="text-xs text-muted-foreground">{task.className}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={task.type === 'scene' ? 'border-orange-300 text-orange-600 text-xs' : 'text-xs'}>
                        {task.type === 'scene' ? '场景教学' : '传统教学'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{task.facultyName}</TableCell>
                    <TableCell className="text-sm">{task.className}</TableCell>
                    <TableCell className="text-sm">
                      {ps ? `${ps.plannedHours} / ${ps.completedHours}` : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-[140px]">
                        <Progress value={rate} className="h-2" />
                        <span className="text-xs w-10">{rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ps ? (
                        <Badge variant={ps.studentAvgCompletion >= 80 ? 'default' : ps.studentAvgCompletion >= 60 ? 'secondary' : 'destructive'} className="text-xs">
                          {ps.studentAvgCompletion}%
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      {ps ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Cloud className="h-3 w-3" />
                          {ps.dataSource === 'course_platform' ? '课程平台' : ps.dataSource === 'scene_platform' ? '场景平台' : '混合'}
                        </div>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="cursor-pointer text-xs" onClick={() => handleViewDetail(task)}>
                        查看详情 <ChevronRight className="h-3 w-3 ml-1" />
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 任务详情穿透对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              任务进度详情 — {selectedTask?.courseName}
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{selectedTask.progressSummary?.completionRate || 0}%</div>
                    <div className="text-xs text-muted-foreground">课时完成率</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{selectedTask.progressSummary?.studentAvgCompletion || 0}%</div>
                    <div className="text-xs text-muted-foreground">学生平均完成率</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{selectedTask.progressSummary?.completedStudentCount || 0}/{selectedTask.progressSummary?.studentCount || 0}</div>
                    <div className="text-xs text-muted-foreground">已完成学生数</div>
                  </CardContent>
                </Card>
              </div>

              {/* 子任务进度（仅场景教学） */}
              {selectedTask.type === 'scene' && selectedTask.sceneSubTasks && selectedTask.sceneSubTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    子任务进度
                  </h4>
                  <div className="space-y-3">
                    {selectedTask.sceneSubTasks.map((sub) => (
                      <div key={sub.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{sub.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {sub.status === 'completed' ? '已完成' : sub.status === 'in_progress' ? '进行中' : '计划中'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={sub.progress?.completionRate || 0} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-10">{sub.progress?.completionRate || 0}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                          <div>负责教师: {sub.facultyName || '—'}</div>
                          <div>企业导师: {sub.enterpriseMentorName || '—'}</div>
                          <div>工位: {sub.workStationName || '—'}</div>
                          <div>参与方式: {sub.mentorParticipationType === 'full' ? '全程' : sub.mentorParticipationType === 'partial' ? '部分' : '远程'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 同步信息 */}
              {selectedTask.progressSummary && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                  <Clock className="h-3 w-3" />
                  上次同步: {selectedTask.progressSummary.lastSyncAt}
                  <Cloud className="h-3 w-3 ml-2" />
                  来源: {selectedTask.progressSummary.dataSource === 'course_platform' ? '数字课程服务平台' : selectedTask.progressSummary.dataSource === 'scene_platform' ? '实践场景学习平台' : '多平台混合'}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
