'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building2,
  Layers,
  BarChart3,
  TrendingUp,
  GraduationCap,
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronUp,
  BookOpen,
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

const STATUS_LABELS: Record<TrainingProgram['status'], string> = {
  draft: '草稿',
  pending: '审批中',
  published: '已发布',
  deprecated: '已废止',
}

const STATUS_VARIANTS: Record<
  TrainingProgram['status'],
  { className: string }
> = {
  draft: { className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  pending: { className: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  published: { className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  deprecated: { className: 'bg-red-100 text-red-700 hover:bg-red-200' },
}

function getProgramTasks(program: TrainingProgram): Task[] {
  return tasks.filter((t) => {
    const cls = classes.find((c) => c.id === t.classId)
    const grade = grades.find((g) => g.id === cls?.gradeId)
    return cls?.majorId === program.majorId && grade?.entryYear === program.entryYear
  })
}

function getTaskProgramTaskRows(program: TrainingProgram) {
  const programTasks = getProgramTasks(program)
  return programTasks.map((task) => {
    const gradeStatus = task.gradeSummary?.overallStatus
    const ps = task.progressSummary
    return {
      task,
      gradeStatus,
      progressSummary: ps,
    }
  })
}

export default function ProgramProgressPage() {
  const router = useRouter()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)

  const allYears = useMemo(() => {
    const years = Array.from(new Set(trainingPrograms.map((p) => p.entryYear)))
    return years.sort((a, b) => b - a)
  }, [])

  const filteredPrograms = useMemo(() => {
    return trainingPrograms.filter((tp) => {
      if (selectedDeptId !== 'all') {
        const major = majors.find((m) => m.id === tp.majorId)
        if (major?.departmentId !== selectedDeptId) return false
      }
      if (selectedYear !== 'all' && tp.entryYear !== Number(selectedYear)) return false
      return true
    })
  }, [selectedDeptId, selectedYear])

  const programStats = useMemo(() => {
    return filteredPrograms.map((program) => {
      const major = majors.find((m) => m.id === program.majorId)
      const grade = grades.find((g) => g.entryYear === program.entryYear)
      const programTasksList = getProgramTasks(program)
      const taskCount = programTasksList.length

      const completionRates = programTasksList
        .map((t) => t.progressSummary?.completionRate)
        .filter((v): v is number => v !== undefined)
      const avgCompletionRate =
        completionRates.length > 0
          ? Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length)
          : 0

      const publishedCount = programTasksList.filter(
        (t) => t.gradeSummary?.overallStatus === 'published'
      ).length
      const evaluatingCount = programTasksList.filter(
        (t) => t.gradeSummary?.overallStatus === 'evaluating'
      ).length
      const avgGradeEvaluationRate =
        taskCount > 0
          ? Math.round(((publishedCount + evaluatingCount * 0.5) / taskCount) * 100)
          : 0

      return {
        program,
        majorName: major?.name || '-',
        gradeName: grade?.name || `${program.entryYear}级`,
        taskCount,
        avgCompletionRate,
        avgGradeEvaluationRate,
        publishedCount,
        evaluatingCount,
        totalTasks: taskCount,
      }
    })
  }, [filteredPrograms])

  const totalPrograms = filteredPrograms.length
  const totalTasks = useMemo(
    () => programStats.reduce((sum, s) => sum + s.taskCount, 0),
    [programStats]
  )
  const overallAvgCompletion = useMemo(() => {
    const rates = programStats.filter((s) => s.taskCount > 0).map((s) => s.avgCompletionRate)
    if (rates.length === 0) return 0
    return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
  }, [programStats])
  const overallGradeEvaluationRate = useMemo(() => {
    const rates = programStats.filter((s) => s.taskCount > 0).map((s) => s.avgGradeEvaluationRate)
    if (rates.length === 0) return 0
    return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
  }, [programStats])

  const deptProgramCounts = useMemo(() => {
    return departments.map((d) => {
      const deptMajors = majors.filter((m) => m.departmentId === d.id)
      const deptMajorIds = deptMajors.map((m) => m.id)
      const count = trainingPrograms.filter((tp) => deptMajorIds.includes(tp.majorId)).length
      return { dept: d, count }
    })
  }, [])

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧院系导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">二级学院/院系</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedDeptId('all')
              setSelectedYear('all')
              setSelectedProgramId(null)
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
              selectedDeptId === 'all'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            <span>全部院系</span>
            <span
              className={`text-xs ${
                selectedDeptId === 'all' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {trainingPrograms.length}
            </span>
          </button>
          {deptProgramCounts.map(({ dept, count }) => (
            <button
              key={dept.id}
              onClick={() => {
                setSelectedDeptId(dept.id)
                setSelectedYear('all')
                setSelectedProgramId(null)
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                selectedDeptId === dept.id
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <span>{dept.name}</span>
              <span
                className={`text-xs ${
                  selectedDeptId === dept.id
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {count}个方案
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">教学进度监控</h1>
            <p className="text-muted-foreground text-sm">
              共 {totalPrograms} 个培养方案 · 按培养方案维度追踪教学进度
            </p>
          </div>
        </div>

        {/* 年级筛选 */}
        <Tabs value={selectedYear} onValueChange={setSelectedYear}>
          <TabsList>
            <TabsTrigger value="all">全部年级</TabsTrigger>
            {allYears.map((y) => (
              <TabsTrigger key={y} value={String(y)}>
                {y}级
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">培养方案总数</p>
                <p className="text-2xl font-bold">{totalPrograms}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">任务总数</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div className="rounded-full p-2 bg-indigo-500">
                <Layers className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">平均课时完成率</p>
                <p className="text-2xl font-bold">{overallAvgCompletion}%</p>
              </div>
              <div className="rounded-full p-2 bg-emerald-500">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">平均成绩评定率</p>
                <p className="text-2xl font-bold">{overallGradeEvaluationRate}%</p>
              </div>
              <div className="rounded-full p-2 bg-purple-500">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 培养方案进度表格 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">培养方案进度列表</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>方案名称</TableHead>
                  <TableHead>专业 / 年级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>任务数量</TableHead>
                  <TableHead>课时完成率</TableHead>
                  <TableHead>成绩评定率</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programStats.map((stat) => {
                  const isExpanded = selectedProgramId === stat.program.id
                  const detailRows = isExpanded ? getTaskProgramTaskRows(stat.program) : []
                  return (
                    <>
                      <TableRow key={stat.program.id}>
                        <TableCell>
                          <div
                            className="font-medium text-sm cursor-pointer hover:underline hover:text-primary transition-colors"
                            onClick={() =>
                              setSelectedProgramId(isExpanded ? null : stat.program.id)
                            }
                          >
                            {stat.program.name}
                          </div>
                          <div className="text-xs text-muted-foreground">{stat.program.code}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{stat.majorName}</div>
                          <div className="text-xs text-muted-foreground">{stat.gradeName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={STATUS_VARIANTS[stat.program.status].className}
                          >
                            {STATUS_LABELS[stat.program.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{stat.taskCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-[140px]">
                            <Progress value={stat.avgCompletionRate} className="h-2" />
                            <span className="text-xs w-10">{stat.avgCompletionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-[140px]">
                            <Progress value={stat.avgGradeEvaluationRate} className="h-2" />
                            <span className="text-xs w-10">{stat.avgGradeEvaluationRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className="cursor-pointer text-xs"
                            onClick={() =>
                              setSelectedProgramId(isExpanded ? null : stat.program.id)
                            }
                          >
                            {isExpanded ? (
                              <>
                                收起明细 <ChevronUp className="h-3 w-3 ml-1" />
                              </>
                            ) : (
                              <>
                                查看明细 <ChevronDown className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${stat.program.id}-detail`}>
                          <TableCell colSpan={8} className="p-0">
                            <div className="bg-muted/40 px-4 py-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {stat.program.name} - 任务明细
                                </span>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>学习任务/编码</TableHead>
                                    <TableHead>类型</TableHead>
                                    <TableHead>班级</TableHead>
                                    <TableHead>教师</TableHead>
                                    <TableHead>学时进度</TableHead>
                                    <TableHead>预计学时</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {detailRows.map((row) => (
                                    <TableRow key={row.task.id}>
                                      <TableCell>
                                        <div className="font-medium text-sm">{row.task.courseName}</div>
                                        <div className="text-xs text-muted-foreground">{row.task.code}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="outline"
                                          className={
                                            row.task.type === 'scene'
                                              ? 'border-orange-300 text-orange-600 text-xs'
                                              : 'text-xs'
                                          }
                                        >
                                          {row.task.type === 'scene' ? '实践场景' : '课程'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-sm">{row.task.className}</TableCell>
                                      <TableCell className="text-sm">{row.task.facultyName}</TableCell>
                                      <TableCell>
                                        {row.progressSummary ? (
                                          <div className="flex items-center gap-2 w-[140px]">
                                            <Progress
                                              value={row.progressSummary.completionRate}
                                              className="h-2"
                                            />
                                            <span className="text-xs w-10">
                                              {row.progressSummary.completionRate}%
                                            </span>
                                          </div>
                                        ) : (
                                          '—'
                                        )}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {row.progressSummary ? `${row.progressSummary.completedHours ?? 0}/${row.progressSummary.plannedHours ?? 0}` : '—'}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Badge
                                          variant="outline"
                                          className="cursor-pointer text-xs"
                                          onClick={() =>
                                            router.push(
                                              `/admin/operations/tasks/${row.task.id}`
                                            )
                                          }
                                        >
                                          查看任务 <ChevronRight className="h-3 w-3 ml-1" />
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {detailRows.length === 0 && (
                                    <TableRow>
                                      <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground py-8"
                                      >
                                        暂无任务数据
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
                {programStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      暂无培养方案数据
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
