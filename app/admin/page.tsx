'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Beaker,
  HardHat,
  AlertCircle,
} from 'lucide-react'
import { tasks, preparationTasks, courseLaunchRecords } from '@/lib/mock-data'

export default function AdminDashboardPage() {
  const taskStats = {
    total: tasks.length,
    draft: tasks.filter((t) => t.status === 'draft').length,
    ready: tasks.filter((t) => t.status === 'ready').length,
    published: tasks.filter((t) => t.status === 'published').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    evaluating: tasks.filter((t) => t.status === 'evaluating').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    scene: tasks.filter((t) => t.type === 'scene').length,
    traditional: tasks.filter((t) => t.type === 'traditional').length,
  }

  const sceneMentorCount = new Set(
    tasks
      .filter((t) => t.type === 'scene')
      .flatMap((t) => t.sceneSubTasks?.map((s) => s.enterpriseMentorId) || [])
      .filter(Boolean)
  ).size

  const avgProgress = Math.round(
    tasks.reduce((sum, t) => sum + (t.progressSummary?.completionRate || 0), 0) /
      (tasks.filter((t) => t.progressSummary).length || 1)
  )

  const pendingPrep = preparationTasks.filter((p) => p.status !== 'completed').length
  const pendingLaunch = courseLaunchRecords.filter((r) => r.launchStatus === 'ready').length

  const stats = [
    { title: '在籍学生', value: '3,248', icon: Users, change: '+120 本学期', color: 'bg-blue-500' },
    { title: '专任教师', value: '186', icon: GraduationCap, change: '+8 本学期', color: 'bg-green-500' },
    { title: '教学任务', value: String(taskStats.total), icon: Layers, change: `${taskStats.scene}个场景教学`, color: 'bg-indigo-500' },
    { title: '已发布任务', value: String(taskStats.published), icon: CalendarDays, change: '正常运行', color: 'bg-amber-500' },
    { title: '待认定成绩', value: '1,205', icon: TrendingUp, change: '待处理', color: 'bg-red-500' },
    { title: '教学成果', value: '28', icon: Award, change: '本年申报', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">平台总览</h1>
        <p className="text-muted-foreground">数字教务平台运行概况与关键指标（以学习任务为最小单元）</p>
      </div>

      {/* 核心统计 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full p-1.5 ${stat.color}`}>
                <stat.icon className="h-3.5 w-3.5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 双轨统计：学历体系 + 能力体系 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-blue-700">
              <BookOpen className="h-5 w-5" />
              学历体系 · 传统课程教学
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{taskStats.traditional}</div>
                <div className="text-xs text-muted-foreground">传统课程任务</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{Math.round((taskStats.traditional / taskStats.total) * 100)}%</div>
                <div className="text-xs text-muted-foreground">占比</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{avgProgress}%</div>
                <div className="text-xs text-muted-foreground">平均进度</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>任务发布率</span>
              <span className="font-medium">{Math.round((taskStats.published / taskStats.total) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((taskStats.published / taskStats.total) * 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-purple-700">
              <Beaker className="h-5 w-5" />
              能力体系 · 场景教学
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">{taskStats.scene}</div>
                <div className="text-xs text-muted-foreground">场景教学任务</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">{sceneMentorCount}</div>
                <div className="text-xs text-muted-foreground">企业导师参与</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {tasks.filter((t) => t.type === 'scene').reduce((sum, t) => sum + (t.sceneSubTasks?.length || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">子任务总数</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>场景任务完成率</span>
              <span className="font-medium">
                {(() => {
                  const sceneTasks = tasks.filter((t) => t.type === 'scene')
                  const completed = sceneTasks.filter((t) => t.status === 'completed').length
                  return sceneTasks.length > 0 ? Math.round((completed / sceneTasks.length) * 100) : 0
                })()}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(() => {
                const sceneTasks = tasks.filter((t) => t.type === 'scene')
                const completed = sceneTasks.filter((t) => t.status === 'completed').length
                return sceneTasks.length > 0 ? Math.round((completed / sceneTasks.length) * 100) : 0
              })()}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 待办事项 + 运行状态 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              待办事项提醒
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { text: `${pendingPrep} 个备课任务待完成`, urgent: pendingPrep > 0 },
              { text: `${pendingLaunch} 门课程待开课确认`, urgent: pendingLaunch > 0 },
              { text: `${taskStats.draft} 条任务处于草稿状态，待细分安排`, urgent: taskStats.draft > 0 },
              { text: `${taskStats.ready} 条任务待就绪，待发布`, urgent: taskStats.ready > 0 },
              { text: '软件工程专业 2026 级培养方案待审批', urgent: false },
              { text: '3 门课程成绩待院系审核', urgent: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.urgent ? 'bg-red-500' : 'bg-primary'}`} />
                <span className={item.urgent ? 'text-red-700 font-medium' : ''}>{item.text}</span>
                {item.urgent && <Badge variant="outline" className="text-[10px] h-5 border-red-300 text-red-600 ml-auto">紧急</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">本学期教学运行状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>任务平均进度</span>
              <span className="font-medium">{avgProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${avgProgress}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>成绩认定进度</span>
              <span className="font-medium">76.2%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '76.2%' }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>教学评价参与率</span>
              <span className="font-medium">89.0%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '89%' }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>备课完成率</span>
              <span className="font-medium">
                {preparationTasks.length > 0 ? Math.round((preparationTasks.filter((p) => p.status === 'completed').length / preparationTasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${preparationTasks.length > 0 ? Math.round((preparationTasks.filter((p) => p.status === 'completed').length / preparationTasks.length) * 100) : 0}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务状态分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">任务状态分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: '草稿', count: taskStats.draft, icon: Clock, color: 'bg-slate-500' },
              { label: '待就绪', count: taskStats.ready, icon: CalendarDays, color: 'bg-blue-500' },
              { label: '已发布', count: taskStats.published, icon: CheckCircle2, color: 'bg-green-500' },
              { label: '进行中', count: taskStats.inProgress, icon: Layers, color: 'bg-indigo-500' },
              { label: '评定中', count: taskStats.evaluating, icon: TrendingUp, color: 'bg-amber-500' },
              { label: '已完成', count: taskStats.completed, icon: Award, color: 'bg-emerald-500' },
              { label: '传统教学', count: taskStats.traditional, icon: BookOpen, color: 'bg-sky-500' },
              { label: '场景教学', count: taskStats.scene, icon: Beaker, color: 'bg-purple-500' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`rounded-full p-2 ${s.color}`}>
                  <s.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold">{s.count}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
