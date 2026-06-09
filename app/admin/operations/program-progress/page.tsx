'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import {
  Layers,
  BarChart3,
  GraduationCap,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  List,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

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

function calcProgramStat(program: TrainingProgram) {
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
}

const COLORS = ['#10b981', '#e5e7eb']
const GRADE_COLORS = ['#3b82f6', '#8b5cf6']

export default function ProgramProgressPage() {
  const [viewMode, setViewMode] = useState<'overall' | 'dept'>('overall')
  const [expandedMajors, setExpandedMajors] = useState<Set<string>>(new Set())
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set())
  const [deptNavOpen, setDeptNavOpen] = useState(true)

  const toggleMajorExpand = (majorId: string) => {
    setExpandedMajors((prev) => {
      const next = new Set(prev)
      if (next.has(majorId)) next.delete(majorId)
      else next.add(majorId)
      return next
    })
  }

  const toggleProgramExpand = (programId: string) => {
    setExpandedPrograms((prev) => {
      const next = new Set(prev)
      if (next.has(programId)) next.delete(programId)
      else next.add(programId)
      return next
    })
  }

  const scrollToDept = (deptId: string) => {
    const el = document.getElementById(`dept-section-${deptId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }



  const currentDeptId = 'd1'
  const currentDept = departments.find((d) => d.id === currentDeptId)!

  const deptTree = useMemo(() => {
    return departments.map((dept) => {
      const deptMajors = majors.filter((m) => m.departmentId === dept.id)
      const majorPrograms = deptMajors
        .map((major) => {
          const programs = trainingPrograms.filter((tp) => tp.majorId === major.id)
          const programStats = programs.map(calcProgramStat)
          return { major, programStats }
        })
        .filter((mp) => mp.programStats.length > 0)

      const allStats = majorPrograms.flatMap((mp) => mp.programStats)
      const totalPrograms = allStats.length
      const totalTasks = allStats.reduce((s, st) => s + st.taskCount, 0)
      const avgCompletion =
        allStats.length > 0
          ? Math.round(allStats.reduce((s, st) => s + st.avgCompletionRate, 0) / allStats.length)
          : 0
      const avgGradeEval =
        allStats.length > 0
          ? Math.round(allStats.reduce((s, st) => s + st.avgGradeEvaluationRate, 0) / allStats.length)
          : 0

      return {
        dept,
        majorPrograms,
        totalPrograms,
        totalTasks,
        avgCompletion,
        avgGradeEval,
      }
    }).filter((d) => d.majorPrograms.length > 0)
  }, [])

  const majorProgramList = useMemo(() => {
    const deptMajors = majors.filter((m) => m.departmentId === currentDeptId)
    return deptMajors
      .map((major) => {
        const programs = trainingPrograms.filter((tp) => tp.majorId === major.id)
        const programStats = programs.map(calcProgramStat)
        return { major, programStats }
      })
      .filter((mp) => mp.programStats.length > 0)
  }, [currentDeptId])

  const globalStats = useMemo(() => {
    const all = deptTree.flatMap((d) => d.majorPrograms.flatMap((mp) => mp.programStats))
    const totalPrograms = all.length
    const totalTasks = all.reduce((s, st) => s + st.taskCount, 0)
    const avgCompletion =
      all.length > 0
        ? Math.round(all.reduce((s, st) => s + st.avgCompletionRate, 0) / all.length)
        : 0
    const avgGradeEval =
      all.length > 0
        ? Math.round(all.reduce((s, st) => s + st.avgGradeEvaluationRate, 0) / all.length)
        : 0
    return { totalPrograms, totalTasks, avgCompletion, avgGradeEval }
  }, [deptTree])

  const deptStats = useMemo(() => {
    const all = majorProgramList.flatMap((mp) => mp.programStats)
    const totalPrograms = all.length
    const totalTasks = all.reduce((s, st) => s + st.taskCount, 0)
    const avgCompletion =
      all.length > 0
        ? Math.round(all.reduce((s, st) => s + st.avgCompletionRate, 0) / all.length)
        : 0
    const avgGradeEval =
      all.length > 0
        ? Math.round(all.reduce((s, st) => s + st.avgGradeEvaluationRate, 0) / all.length)
        : 0
    return { totalPrograms, totalTasks, avgCompletion, avgGradeEval }
  }, [majorProgramList])

  const stats = viewMode === 'overall' ? globalStats : deptStats

  // 为单个方案构建饼图数据
  const buildProgramPieData = (stat: ReturnType<typeof calcProgramStat>) => [
    { name: '已完成', value: stat.avgCompletionRate },
    { name: '未完成', value: 100 - stat.avgCompletionRate },
  ]
  const buildProgramGradePieData = (stat: ReturnType<typeof calcProgramStat>) => [
    { name: '已评定', value: stat.avgGradeEvaluationRate },
    { name: '未评定', value: 100 - stat.avgGradeEvaluationRate },
  ]

  const renderMajorCard = (major: typeof majors[0], programStats: ReturnType<typeof calcProgramStat>[]) => {
    const majorAvgCompletion =
      programStats.length > 0
        ? Math.round(programStats.reduce((s, st) => s + st.avgCompletionRate, 0) / programStats.length)
        : 0
    const majorAvgGradeEval =
      programStats.length > 0
        ? Math.round(programStats.reduce((s, st) => s + st.avgGradeEvaluationRate, 0) / programStats.length)
        : 0
    const isMajorExpanded = expandedMajors.has(major.id)

    return (
      <Card key={major.id} className="overflow-hidden">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{major.name}</CardTitle>
              <Badge variant="outline" className="text-xs">{programStats.length} 个方案</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>平均完成率 <strong className="text-emerald-600">{majorAvgCompletion}%</strong></span>
              <span>平均评定率 <strong className="text-blue-600">{majorAvgGradeEval}%</strong></span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4 space-y-4">
          {/* 每个人培方案的饼图 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {programStats.map((stat) => {
              const completionPie = buildProgramPieData(stat)
              const gradePie = buildProgramGradePieData(stat)
              return (
                <div key={stat.program.id}>
                  <div
                    className="rounded-lg border p-3 space-y-2 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => toggleMajorExpand(major.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate" title={stat.gradeName}>
                        {stat.gradeName}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${STATUS_VARIANTS[stat.program.status].className}`}
                      >
                        {STATUS_LABELS[stat.program.status]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.gradeName} · {stat.taskCount}个任务</div>
                    <div className="flex items-center gap-3">
                      {/* 完成率饼图 */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="h-[80px] w-[80px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={completionPie}
                                cx="50%"
                                cy="50%"
                                innerRadius={22}
                                outerRadius={36}
                                dataKey="value"
                                stroke="none"
                              >
                                {completionPie.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5">完成 {stat.avgCompletionRate}%</span>
                      </div>
                      {/* 评定率饼图 */}
                      <div className="flex-1 flex flex-col items-center">
                        <div className="h-[80px] w-[80px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={gradePie}
                                cx="50%"
                                cy="50%"
                                innerRadius={22}
                                outerRadius={36}
                                dataKey="value"
                                stroke="none"
                              >
                                {gradePie.map((entry, index) => (
                                  <Cell key={`cell-g-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5">评定 {stat.avgGradeEvaluationRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 展开后的方案列表 */}
          {isMajorExpanded && (
            <div className="border rounded-lg overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>方案名称</TableHead>
                    <TableHead className="w-24">年级</TableHead>
                    <TableHead className="w-20">任务数</TableHead>
                    <TableHead className="w-40">课时完成率</TableHead>
                    <TableHead className="w-40">成绩评定率</TableHead>
                    <TableHead className="w-20">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programStats.map((stat) => {
                    const isProgExpanded = expandedPrograms.has(stat.program.id)
                    const programTasks = getProgramTasks(stat.program)
                    return (
                      <>
                        <TableRow
                          key={stat.program.id}
                          className={cn(
                            'cursor-pointer hover:bg-muted/50 transition-colors',
                            isProgExpanded && 'bg-primary/5'
                          )}
                          onClick={() => toggleProgramExpand(stat.program.id)}
                        >
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              {isProgExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium text-sm">{stat.program.name}</TableCell>
                          <TableCell className="text-sm">{stat.gradeName}</TableCell>
                          <TableCell className="text-sm">{stat.taskCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={stat.avgCompletionRate} className="h-2 w-24" />
                              <span className="text-xs text-muted-foreground">{stat.avgCompletionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={stat.avgGradeEvaluationRate} className="h-2 w-24" />
                              <span className="text-xs text-muted-foreground">{stat.avgGradeEvaluationRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${STATUS_VARIANTS[stat.program.status].className}`}
                            >
                              {STATUS_LABELS[stat.program.status]}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        {/* 方案行展开后的任务列表 */}
                        {isProgExpanded && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={7} className="p-0">
                              <div className="px-4 py-3">
                                <div className="text-xs font-medium text-muted-foreground mb-2">教学任务列表（{programTasks.length}个）</div>
                                <div className="border rounded-md overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-muted/50">
                                        <TableHead className="text-[11px] h-8">任务名称</TableHead>
                                        <TableHead className="text-[11px] h-8 w-28">班级</TableHead>
                                        <TableHead className="text-[11px] h-8 w-24">教师</TableHead>
                                        <TableHead className="text-[11px] h-8 w-32">完成率</TableHead>
                                        <TableHead className="text-[11px] h-8 w-24">成绩状态</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {programTasks.length === 0 && (
                                        <TableRow>
                                          <TableCell colSpan={5} className="text-center text-muted-foreground text-xs py-4">暂无任务</TableCell>
                                        </TableRow>
                                      )}
                                      {programTasks.map((task) => (
                                        <TableRow key={task.id} className="hover:bg-background">
                                          <TableCell className="text-xs py-2">{task.name}</TableCell>
                                          <TableCell className="text-xs py-2 text-muted-foreground">{task.className}</TableCell>
                                          <TableCell className="text-xs py-2 text-muted-foreground">{task.facultyName}</TableCell>
                                          <TableCell className="py-2">
                                            <div className="flex items-center gap-2">
                                              <Progress value={task.progressSummary?.completionRate || 0} className="h-1.5 w-20" />
                                              <span className="text-[10px] text-muted-foreground">{task.progressSummary?.completionRate || 0}%</span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="py-2">
                                            {task.gradeSummary?.overallStatus ? (
                                              <Badge variant="outline" className="text-[10px]">
                                                {task.gradeSummary.overallStatus === 'published' ? '已发布' : task.gradeSummary.overallStatus === 'evaluating' ? '评定中' : '待评定'}
                                              </Badge>
                                            ) : (
                                              <span className="text-[10px] text-muted-foreground">-</span>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">教学进度监控</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {viewMode === 'overall'
              ? '全局查看所有院系 + 所有专业 + 所有年级的教学进度'
              : `${currentDept.name} — 查看本院系下所有专业 + 所有年级的教学进度`}
          </p>
        </div>
        <div className="flex items-center bg-muted rounded-lg p-1 gap-1">
          <Button
            variant={viewMode === 'overall' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('overall')}
          >
            <Building2 className="h-4 w-4 mr-1" />
            教务视角
          </Button>
          <Button
            variant={viewMode === 'dept' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('dept')}
          >
            <GraduationCap className="h-4 w-4 mr-1" />
            院系视角
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">培养方案总数</p>
              <p className="text-2xl font-bold">{stats.totalPrograms}</p>
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
              <p className="text-2xl font-bold">{stats.totalTasks}</p>
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
              <p className="text-2xl font-bold">{stats.avgCompletion}%</p>
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
              <p className="text-2xl font-bold">{stats.avgGradeEval}%</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表内容 */}
      {viewMode === 'overall' ? (
        <div className="space-y-6">
          {deptTree.map((deptNode) => (
            <div key={deptNode.dept.id} id={`dept-section-${deptNode.dept.id}`} className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{deptNode.dept.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{deptNode.totalPrograms} 个方案</Badge>
                  <Badge variant="outline" className="text-xs">{deptNode.totalTasks} 个任务</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                  <span>课时完成率 <strong className="text-emerald-600">{deptNode.avgCompletion}%</strong></span>
                  <span>成绩评定率 <strong className="text-blue-600">{deptNode.avgGradeEval}%</strong></span>
                </div>
              </div>
              <div className="grid gap-4">
                {deptNode.majorPrograms.map((mp) => renderMajorCard(mp.major, mp.programStats))}
              </div>
            </div>
          ))}

          {/* 浮动院系快速定位 */}
          <div className="fixed right-4 top-20 z-50">
            {deptNavOpen ? (
              <div className="bg-card border rounded-lg shadow-lg p-1.5 space-y-0.5 w-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between px-1 py-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">院系</span>
                  </div>
                  <button
                    onClick={() => setDeptNavOpen(false)}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="收起"
                  >
                    <PanelLeftClose className="h-3 w-3" />
                  </button>
                </div>
                {deptTree.map((deptNode) => (
                  <button
                    key={deptNode.dept.id}
                    onClick={() => scrollToDept(deptNode.dept.id)}
                    className="w-full text-left px-1 py-0.5 text-[11px] rounded transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground truncate"
                    title={deptNode.dept.name}
                  >
                    {deptNode.dept.name}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => setDeptNavOpen(true)}
                className="flex items-center justify-center w-8 h-8 bg-card border rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-muted text-muted-foreground hover:text-foreground"
                title="展开院系导航"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {majorProgramList.map((mp) => renderMajorCard(mp.major, mp.programStats))}
        </div>
      )}
    </div>
  )
}
