'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlatformTopNav } from '@/components/platform-shell'
import { registrarNavigationConfig } from '@/lib/navigation-config'
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  Award,
  TrendingUp,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Search,
  ArrowRight,
  Building2,
  School,
  UserCheck,
  LayoutDashboard,
  FileText,
  BarChart3,
  ChevronRight,
  Flame,
  Target,
  Megaphone,
} from 'lucide-react'
import {
  departments,
  majors,
  classes,
  faculty,
  students,
  venues,
  trainingPrograms,
  terms,
  calendarWeeks,
  tasks,
  teachingProgress,
  gradeRecords,
  courseAdjustments,
  teachingAchievements,
} from '@/lib/mock-data'

export default function LandingPage() {
  // ===== 统计数据 =====
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0)
  const activeStudents = students.filter((s) => s.status === '在籍').length
  const totalFaculty = faculty.length
  const enterpriseMentors = 0
  const totalDepartments = departments.length
  const totalMajors = majors.length
  const totalClasses = classes.length
  const totalVenues = venues.length
  const totalTasks = tasks.length

  const taskStats = {
    draft: tasks.filter((t) => t.status === 'draft').length,
    ready: tasks.filter((t) => t.status === 'ready').length,
    published: tasks.filter((t) => t.status === 'published').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    evaluating: tasks.filter((t) => t.status === 'evaluating').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    scene: tasks.filter((t) => t.type === 'scene').length,
  }

  const avgProgress = Math.round(
    tasks.reduce((sum, t) => sum + (t.progressSummary?.completionRate || 0), 0) /
      (tasks.filter((t) => t.progressSummary).length || 1)
  )

  const publishedPrograms = trainingPrograms.filter((p) => p.status === 'published').length
  const pendingPrograms = trainingPrograms.filter((p) => p.status === 'pending').length
  const draftPrograms = trainingPrograms.filter((p) => p.status === 'draft').length

  const pendingAdjustments = courseAdjustments.filter((a) => a.status === 'pending').length
  const pendingGrades = gradeRecords.filter((g) => g.status !== '已发布').length
  const pendingAchievements = teachingAchievements.filter((a) => a.status === '审批中' || a.status === '已提交').length

  const currentTerm = terms.find((t) => t.isCurrent)
  const currentWeek = calendarWeeks.find((w) => w.weekType === '教学周')

  // ===== 快捷入口 =====
  const quickEntries = [
    { label: '培养方案', href: '/admin/programs', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '排课中心', href: '/admin/operations/scheduling', icon: CalendarDays, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '学习任务', href: '/admin/operations/tasks', icon: Layers, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '成绩认定', href: '/admin/academics/grades', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '学生学籍', href: '/admin/organization/students', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: '教学资源', href: '/admin/organization/resources', icon: BookOpen, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  // ===== 核心指标 =====
  const coreStats = [
    { label: '院系数', value: totalDepartments, icon: Building2, change: '覆盖全校', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '专业数', value: totalMajors, icon: School, change: '本专科', color: 'text-green-600', bg: 'bg-green-50' },
    { label: '班级数', value: totalClasses, icon: LayoutDashboard, change: '行政班', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '在籍学生', value: totalStudents, icon: Users, change: `${activeStudents}人活跃`, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '专任教师', value: totalFaculty, icon: GraduationCap, change: `企业导师${enterpriseMentors}人`, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: '教学任务', value: totalTasks, icon: Layers, change: `${taskStats.scene}个场景教学`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  // ===== 任务状态分布 =====
  const taskStatusList = [
    { label: '草稿', count: taskStats.draft, color: 'bg-slate-500' },
    { label: '待就绪', count: taskStats.ready, color: 'bg-blue-500' },
    { label: '已发布', count: taskStats.published, color: 'bg-green-500' },
    { label: '进行中', count: taskStats.inProgress, color: 'bg-indigo-500' },
    { label: '评定中', count: taskStats.evaluating, color: 'bg-amber-500' },
    { label: '已完成', count: taskStats.completed, color: 'bg-emerald-500' },
    { label: '场景教学', count: taskStats.scene, color: 'bg-orange-500' },
  ]

  // ===== 预警/待办 =====
  const alerts = [
    ...(pendingAdjustments > 0
      ? [{ type: 'warning' as const, title: `调课申请待审批`, desc: `有 ${pendingAdjustments} 条调课/停课申请待处理`, icon: Clock }]
      : []),
    ...(pendingGrades > 0
      ? [{ type: 'warning' as const, title: `成绩认定待处理`, desc: `${pendingGrades} 条成绩记录待审核或发布`, icon: FileText }]
      : []),
    ...(pendingAchievements > 0
      ? [{ type: 'warning' as const, title: `教学成果审批中`, desc: `${pendingAchievements} 项成果申报待审批`, icon: Award }]
      : []),
    ...(draftPrograms > 0
      ? [{ type: 'danger' as const, title: `培养方案草稿`, desc: `${draftPrograms} 份培养方案仍处于草稿状态`, icon: AlertTriangle }]
      : []),
    { type: 'warning' as const, title: '教学进度滞后', desc: '软件工程2026级1班-数据结构进度62%，建议关注', icon: TrendingUp },
  ]

  // ===== 近期任务 =====
  const recentTasks = tasks
    .filter((t) => t.status === 'published' || t.status === 'in_progress')
    .slice(0, 5)

  // ===== 教学周 =====
  const teachingWeeks = calendarWeeks.filter((w) => w.weekType === '教学周').length
  const examWeeks = calendarWeeks.filter((w) => w.weekType === '考试周').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <PlatformTopNav config={registrarNavigationConfig} />

      <main className="mx-auto max-w-7xl px-4 py-6 pt-20 lg:px-8 space-y-6">
        {/* ==================== 页面标题 ==================== */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-slate-900">教务大厅</h1>
          <p className="text-sm text-slate-500">全校教学运行状态透视窗与公共服务入口</p>
        </div>

        {/* ==================== 置顶公告 ==================== */}
        <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Megaphone className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white">毕业生</Badge>
            <span className="text-sm font-medium text-slate-800">关于2026届毕业生毕业项目选课的通知</span>
            <span className="text-xs text-slate-500 hidden sm:inline">教务处 · 2026-05-20 · 截止：2026-06-10</span>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50">
            查看全部 <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* ==================== 快捷入口 ==================== */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {quickEntries.map((entry) => (
            <Link
              key={entry.label}
              href={entry.href}
              className="group flex flex-col items-center gap-2.5 rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-transparent"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${entry.bg} ${entry.color} transition-transform group-hover:scale-110`}>
                <entry.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-slate-700">{entry.label}</span>
            </Link>
          ))}
        </div>

        {/* ==================== 主内容：左侧 + 右侧 ==================== */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ========== 左侧 ========== */}
          <div className="space-y-6">
            {/* ----- 数据驾驶舱 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    教学运行数据驾驶舱
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      {currentTerm?.year} {currentTerm?.semester}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
                      <Link href="/admin">
                        进入后台 <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardDescription>基于 {totalTasks} 条教学任务实时聚合的关键指标</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {coreStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-slate-50 to-white p-3 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tracking-tight">
                        {stat.value}
                        <span className="ml-1 text-xs font-normal text-slate-500">{stat.change.split(' ')[0]}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">{stat.change}</div>
                    </div>
                  ))}
                </div>

                {/* 进度区域 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                    学期教学进度
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">任务发布率</span>
                        <span className="font-semibold text-slate-900">
                          {Math.round((taskStats.published / totalTasks) * 100)}%
                        </span>
                      </div>
                      <Progress value={Math.round((taskStats.published / totalTasks) * 100)} className="h-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">任务平均进度</span>
                        <span className="font-semibold text-slate-900">{avgProgress}%</span>
                      </div>
                      <Progress value={avgProgress} className="h-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">成绩认定进度</span>
                        <span className="font-semibold text-slate-900">76.2%</span>
                      </div>
                      <Progress value={76.2} className="h-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">教学评价参与率</span>
                        <span className="font-semibold text-slate-900">89.0%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ----- 任务状态分布 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  任务状态分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {taskStatusList.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-2.5 rounded-lg border p-2.5 transition-all hover:bg-slate-50"
                    >
                      <div className={`h-2 w-2 rounded-full ${s.color}`} />
                      <div>
                        <div className="text-lg font-bold leading-none text-slate-900">{s.count}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ----- 异常预警 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    异常预警雷达
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">
                    今日预警 {alerts.filter((a) => a.type === 'danger').length + alerts.filter((a) => a.type === 'warning').length} 条
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-lg border-l-4 p-3 transition-all hover:translate-x-0.5 ${
                        alert.type === 'danger'
                          ? 'border-l-rose-500 bg-rose-50/50'
                          : 'border-l-amber-500 bg-amber-50/50'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          alert.type === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        <alert.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800">{alert.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{alert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ----- 近期教学任务 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    近期教学任务
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
                    <Link href="/admin/operations/tasks">
                      查看全部 <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50/50">
                        <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">任务名称</th>
                        <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">授课教师</th>
                        <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">班级</th>
                        <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">进度</th>
                        <th className="px-3 py-2 text-left font-medium text-slate-500 text-xs">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.map((task) => (
                        <tr key={task.id} className="border-b last:border-b-0 hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 py-2.5 font-medium text-slate-800">{task.courseName}</td>
                          <td className="px-3 py-2.5 text-slate-600">{task.facultyName}</td>
                          <td className="px-3 py-2.5 text-slate-600">{task.className}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-blue-500"
                                  style={{ width: `${task.progressSummary?.completionRate || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">
                                {task.progressSummary?.completionRate || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-medium ${
                                task.status === 'published'
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : task.status === 'in_progress'
                                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-700'
                              }`}
                            >
                              {task.status === 'published' && '已发布'}
                              {task.status === 'in_progress' && '进行中'}
                              {task.status === 'draft' && '草稿'}
                              {task.status === 'ready' && '待就绪'}
                              {task.status === 'evaluating' && '评定中'}
                              {task.status === 'completed' && '已完成'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========== 右侧边栏 ========== */}
          <div className="space-y-6">
            {/* ----- 学期概览 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  学期概览
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">当前学期</span>
                  <span className="font-semibold text-slate-900">
                    {currentTerm?.year} {currentTerm?.semester}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">教学周数</span>
                  <span className="font-semibold text-slate-900">{teachingWeeks} 周</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">考试周数</span>
                  <span className="font-semibold text-slate-900">{examWeeks} 周</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">培养方案</span>
                  <span className="font-semibold text-slate-900">
                    {publishedPrograms} 已发布 / {pendingPrograms} 待审
                  </span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">近期事件</h4>
                  <div className="space-y-2">
                    {[
                      { title: '期中教学检查', time: '第8周', type: 'practice' },
                      { title: '期末考试周', time: '第17-18周', type: 'project' },
                      { title: '国庆节放假', time: '第5周', type: 'expert' },
                    ].map((evt, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50">
                        <div
                          className={`h-8 w-1 rounded-full ${
                            evt.type === 'practice'
                              ? 'bg-blue-500'
                              : evt.type === 'project'
                              ? 'bg-green-500'
                              : 'bg-purple-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800">{evt.title}</div>
                          <div className="text-xs text-slate-500">{evt.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ----- 教学资源占用 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-600" />
                    实训资源占用
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-normal text-green-600 border-green-200 bg-green-50">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    实时
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {venues.map((v) => {
                    const level = v.status === 'maintenance' ? 5 : v.status === 'disabled' ? 5 : Math.floor(Math.random() * 5)
                    const levelColors = [
                      'bg-slate-100 text-slate-400',
                      'bg-emerald-100 text-emerald-700',
                      'bg-teal-100 text-teal-700',
                      'bg-amber-100 text-amber-700',
                      'bg-orange-100 text-orange-700',
                      'bg-rose-500 text-white',
                    ]
                    return (
                      <div
                        key={v.id}
                        className={`flex aspect-square items-center justify-center rounded-md text-[10px] font-medium ${levelColors[level]}`}
                        title={`${v.name} - 容量${v.capacity}`}
                      >
                        {v.name.split(' ')[0]}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center justify-end gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-slate-100" />空闲</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-teal-100" />低</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-100" />中</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-orange-100" />高</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-500" />满载</span>
                </div>
              </CardContent>
            </Card>

            {/* ----- 待办事项 ----- */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  待办事项
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    `${taskStats.draft} 条任务处于草稿状态，待细分安排`,
                    `${taskStats.ready} 条任务待就绪，待发布`,
                    `${pendingPrograms} 份培养方案待审批`,
                    `${pendingGrades} 门课程成绩待院系审核`,
                    `2026 届毕业资格学历认定待启动`,
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ==================== 底部入口 ==================== */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
          <CardContent className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold">进入数字教务管理后台</h3>
              <p className="mt-1 text-sm text-slate-300">全面覆盖教学运行、学业认定、数据治理与成果管理</p>
            </div>
            <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                进入管理后台
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* ==================== 底部 ==================== */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-400 lg:px-8">
          数字教务平台 · 面向职业院校的教学管理与运行中枢
        </div>
      </footer>
    </div>
  )
}
