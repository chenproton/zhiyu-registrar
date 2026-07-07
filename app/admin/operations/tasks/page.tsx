'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ClipboardList,
  BookOpen,
  Layers,
  Play,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  Search,
  GraduationCap,
} from 'lucide-react'
import {
  tasks,
  departments,
  majors,
  classes,
  grades,
  trainingPrograms,
  type Task,
  type TrainingProgram,
} from '@/lib/mock-data'

// 随机绑定：预计算每个培养方案分配到的任务（Fisher-Yates 打乱后均匀分配）
const programTaskMap = (() => {
  const map = new Map<string, Task[]>()
  const shuffled = [...tasks]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const chunkSize = Math.max(3, Math.ceil(shuffled.length / trainingPrograms.length))
  trainingPrograms.forEach((program, idx) => {
    const start = idx * chunkSize
    const end = Math.min(start + chunkSize, shuffled.length)
    map.set(program.id, shuffled.slice(start, end))
  })
  return map
})()

function getProgramTasks(program: TrainingProgram): Task[] {
  return programTaskMap.get(program.id) ?? []
}

export default function TasksDashboardPage() {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [filterType, setFilterType] = useState<'traditional' | 'scene' | 'mixed'>('mixed')
  const [filterDept, setFilterDept] = useState<string>('all')
  const [filterMajor, setFilterMajor] = useState<string>('all')
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterFaculty, setFilterFaculty] = useState<string>('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const selectedProgram = useMemo(() => {
    if (selectedProgramId === 'all') return null
    return trainingPrograms.find((p) => p.id === selectedProgramId) ?? null
  }, [selectedProgramId])

  const programTaskIds = useMemo(() => {
    if (!selectedProgram) return new Set<string>()
    return new Set(getProgramTasks(selectedProgram).map((t) => t.id))
  }, [selectedProgram])

  const deptPrograms = useMemo(() => {
    let list = trainingPrograms
    if (selectedDeptId !== 'all') {
      const deptMajorIds = majors.filter((m) => m.departmentId === selectedDeptId).map((m) => m.id)
      list = list.filter((p) => deptMajorIds.includes(p.majorId))
    }
    if (selectedYear !== 'all') {
      list = list.filter((p) => String(p.entryYear) === selectedYear)
    }
    return list
  }, [selectedDeptId, selectedYear])

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 左侧培养方案筛选
      if (selectedProgramId !== 'all' && !programTaskIds.has(t.id)) return false

      // 课时类型
      if (filterType !== 'mixed' && t.type !== filterType) return false

      // 班级
      if (filterClass !== 'all' && t.classId !== filterClass) return false

      // 专业
      const cls = classes.find((c) => c.id === t.classId)
      if (filterMajor !== 'all' && cls?.majorId !== filterMajor) return false

      // 院系
      if (filterDept !== 'all') {
        const major = majors.find((m) => m.id === cls?.majorId)
        if (major?.departmentId !== filterDept) return false
      }

      // 教师搜索
      if (filterFaculty.trim()) {
        const q = filterFaculty.trim().toLowerCase()
        if (!t.facultyName.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [selectedProgramId, programTaskIds, filterType, filterDept, filterMajor, filterClass, filterFaculty])

  // 统计卡片数据
  const totalTasks = filteredTasks.length
  const traditionalTasks = filteredTasks.filter((t) => t.type === 'traditional').length
  const sceneTasks = filteredTasks.filter((t) => t.type === 'scene').length
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress').length
  const evaluatingTasks = filteredTasks.filter((t) => t.status === 'evaluating').length

  const handleViewDetail = (taskId: string) => {
    window.location.href = `/admin/operations/tasks/${taskId}`
  }

  // 左侧培养方案列表：按院系 -> 年级 -> 方案 三级组织
  const deptYearPrograms = useMemo(() => {
    return departments
      .map((dept) => {
        const programs = trainingPrograms.filter((tp) => {
          const major = majors.find((m) => m.id === tp.majorId)
          return major?.departmentId === dept.id
        })
        // 按年级聚合
        const yearMap = new Map<number, TrainingProgram[]>()
        programs.forEach((p) => {
          if (!yearMap.has(p.entryYear)) yearMap.set(p.entryYear, [])
          yearMap.get(p.entryYear)!.push(p)
        })
        const years = Array.from(yearMap.entries())
          .sort((a, b) => b[0] - a[0]) // 年级降序
        return { dept, years }
      })
      .filter((d) => d.years.length > 0)
  }, [])

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧筛选 */}
      <div className="w-60 shrink-0">
        <Card className="h-full flex flex-col py-0">
          <CardContent className="px-3 pb-3 pt-3 flex-1 overflow-y-auto space-y-2">
            <div className="text-sm font-semibold">筛选条件</div>
            {/* 院系 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">院系</label>
              <div className="flex flex-wrap gap-1">
                <Badge variant={selectedDeptId === 'all' ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => { setSelectedDeptId('all'); setSelectedProgramId('all') }}>全部</Badge>
                {departments.map((d) => (
                  <Badge key={d.id} variant={selectedDeptId === d.id ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => { setSelectedDeptId(d.id); setSelectedProgramId('all') }}>{d.name}</Badge>
                ))}
              </div>
            </div>
            {/* 年级 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">年级</label>
              <div className="flex flex-wrap gap-1">
                <Badge variant={selectedYear === 'all' ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => setSelectedYear('all')}>全部</Badge>
                {grades.map((g) => (
                  <Badge key={g.id} variant={selectedYear === String(g.entryYear) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => setSelectedYear(String(g.entryYear))}>{g.entryYear}级</Badge>
                ))}
              </div>
            </div>
            {/* 人培方案 — 筛选结果 */}
            <div className="border-t pt-2 mt-0.5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-muted-foreground">人培方案</label>
                <span className="text-[10px] text-muted-foreground">
                  {selectedDeptId !== 'all' || selectedYear !== 'all' ? `筛选结果 · ${deptPrograms.length}个` : `${deptPrograms.length}个`}
                </span>
              </div>
              <div className="space-y-0.5">
                <button className={cn('w-full text-left px-2 py-1 rounded text-xs transition-colors', selectedProgramId === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')} onClick={() => setSelectedProgramId('all')}>全部方案</button>
                {deptPrograms.map((p) => (
                  <button key={p.id} className={cn('w-full text-left px-2 py-1 rounded text-xs transition-colors truncate', selectedProgramId === p.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')} onClick={() => setSelectedProgramId(p.id)}>{p.name}</button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        {/* 标题区 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">课时中心</h1>
            <p className="text-muted-foreground text-sm">
              {selectedProgram
                ? `${selectedProgram.name} · 共 ${filteredTasks.length} 个课时`
                : `共 ${filteredTasks.length} 个课时 · 以课时为单元统一管理教学运行`}
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">课时总数</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <ClipboardList className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">体系课课时数</p>
                <p className="text-2xl font-bold">{traditionalTasks}</p>
              </div>
              <div className="rounded-full p-2 bg-emerald-500">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">颗粒课课时数</p>
                <p className="text-2xl font-bold">{sceneTasks}</p>
              </div>
              <div className="rounded-full p-2 bg-orange-500">
                <Layers className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">进行中课时数</p>
                <p className="text-2xl font-bold">{inProgressTasks}</p>
              </div>
              <div className="rounded-full p-2 bg-purple-500">
                <Play className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">待评定课时数</p>
                <p className="text-2xl font-bold">{evaluatingTasks}</p>
              </div>
              <div className="rounded-full p-2 bg-pink-500">
                <ClipboardCheck className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="课时类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mixed">混合课程</SelectItem>
              <SelectItem value="traditional">体系课</SelectItem>
              <SelectItem value="scene">颗粒课</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterDept}
            onValueChange={(v) => {
              setFilterDept(v)
              setFilterMajor('all')
              setFilterClass('all')
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="院系" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部院系</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterMajor}
            onValueChange={(v) => {
              setFilterMajor(v)
              setFilterClass('all')
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="专业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部专业</SelectItem>
              {majors
                .filter((m) => filterDept === 'all' || m.departmentId === filterDept)
                .map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="班级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部班级</SelectItem>
              {classes
                .filter((c) => filterMajor === 'all' || c.majorId === filterMajor)
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索教师"
              className="pl-8 w-[180px]"
              value={filterFaculty}
              onChange={(e) => setFilterFaculty(e.target.value)}
            />
          </div>
        </div>

        {/* 任务列表表格 */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>课时/编码</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead>教师</TableHead>
                  <TableHead>学时进度</TableHead>
                  <TableHead>预计学时</TableHead>
                  <TableHead>成绩状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const ps = task.progressSummary
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div
                          className="font-medium text-sm cursor-pointer hover:underline hover:text-primary transition-colors"
                          onClick={() => handleViewDetail(task.id)}
                        >
                          {task.courseName}
                        </div>
                        <div className="text-xs text-muted-foreground">{task.code}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            task.type === 'scene'
                              ? 'border-orange-300 text-orange-600 text-xs'
                              : 'text-xs'
                          }
                        >
                          {task.type === 'scene' ? '颗粒课' : '体系课'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{task.className}</TableCell>
                      <TableCell className="text-sm">{task.facultyName}</TableCell>
                      <TableCell>
                        {ps ? (
                          <div className="flex items-center gap-2 w-[140px]">
                            <Progress value={ps.completionRate} className="h-2 flex-1" />
                            <span className="text-xs w-10">{ps.completionRate}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ps ? `${ps.completedHours ?? 0}/${ps.plannedHours ?? 0}` : '—'}
                      </TableCell>
                      <TableCell>
                        {task.gradeSummary?.overallStatus === 'published' ? (
                          <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">已评定</Badge>
                        ) : task.gradeSummary?.overallStatus === 'evaluating' ? (
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">评定中</Badge>
                        ) : task.gradeSummary?.overallStatus === 'pending' ? (
                          <Badge variant="outline" className="text-xs text-gray-500">未评定</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => handleViewDetail(task.id)}
                        >
                          查看详情 <ChevronRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      暂无课时数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
