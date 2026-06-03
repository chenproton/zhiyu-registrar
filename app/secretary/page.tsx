'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ClipboardList,
  Users,
  BookOpen,
  AlertTriangle,
  FileCheck,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import {
  getAllTasks,
  getAllPreparationTasks,
  getAllTeachingProgress,
  getPendingAdjustmentRequests,
  getSecretaryDepartmentFaculty,
} from '@/lib/role-utils'
import { currentSecretary } from '@/lib/current-user'
import { cn } from '@/lib/utils'

export default function SecretaryDashboardPage() {
  const router = useRouter()
  const allTasks = getAllTasks()
  const allPreps = getAllPreparationTasks()
  const allProgress = getAllTeachingProgress()
  const pendingAdjustments = getPendingAdjustmentRequests()
  const deptFaculty = getSecretaryDepartmentFaculty()

  // 统计
  const stats = {
    teacherCount: deptFaculty.length,
    courseCount: allTasks.length,
    pendingApproval: pendingAdjustments.length,
    lowProgressCount: allProgress.filter((p) => p.completedHours / p.plannedHours < 0.5).length,
  }

  // 备课完成率
  const prepCompletionRate = allPreps.length > 0
    ? Math.round((allPreps.filter((p) => p.status === 'completed').length / allPreps.length) * 100)
    : 0

  // 进度填报率
  const progressFillRate = allProgress.length > 0
    ? Math.round((allProgress.filter((p) => p.completedHours > 0).length / allProgress.length) * 100)
    : 0

  const quickActions = [
    { id: 'adjustments', label: '调课审批', icon: FileCheck, href: '/secretary/adjustments', count: stats.pendingApproval, color: 'text-amber-600 bg-amber-50' },
    { id: 'progress', label: '进度监控', icon: BarChart3, href: '/secretary/progress', color: 'text-blue-600 bg-blue-50' },
    { id: 'anomalies', label: '异常监控', icon: AlertTriangle, href: '/secretary/anomalies', color: 'text-rose-600 bg-rose-50' },
    { id: 'scheduling', label: '排课查看', icon: ClipboardList, href: '/secretary/scheduling', color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">教学秘书台</h1>
        <p className="text-muted-foreground mt-1">
          欢迎，{currentSecretary.name} · 所属院系教学运行概览
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.teacherCount}</div>
              <div className="text-xs text-muted-foreground">本院系教师</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.courseCount}</div>
              <div className="text-xs text-muted-foreground">教学任务数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
              <div className="text-xs text-muted-foreground">待审批调课</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.lowProgressCount}</div>
              <div className="text-xs text-muted-foreground">进度滞后课程</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 运行指标 */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">教学运行指标</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>备课完成率</span>
                <span className="font-medium">{prepCompletionRate}%</span>
              </div>
              <Progress value={prepCompletionRate} className="h-2.5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>教学进度填报率</span>
                <span className="font-medium">{progressFillRate}%</span>
              </div>
              <Progress value={progressFillRate} className="h-2.5" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <div className="text-xl font-bold">{allPreps.length}</div>
                <div className="text-xs text-muted-foreground">备课任务总数</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <div className="text-xl font-bold">{allProgress.length}</div>
                <div className="text-xs text-muted-foreground">进度记录数</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <div className="text-xl font-bold">{pendingAdjustments.length}</div>
                <div className="text-xs text-muted-foreground">待处理申请</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">快捷入口</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11"
                  onClick={() => router.push(action.href)}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', action.color.split(' ').slice(1).join(' '))}>
                    <Icon className={cn('h-4 w-4', action.color.split(' ')[0])} />
                  </div>
                  <span className="text-sm">{action.label}</span>
                  {'count' in action && action.count !== undefined && action.count > 0 && (
                    <Badge variant="destructive" className="ml-auto h-5 text-[10px]">{action.count}</Badge>
                  )}
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* 待审批调课 */}
      {pendingAdjustments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">待审批调课申请</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/secretary/adjustments')}>
                查看全部 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingAdjustments.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{req.facultyName}</Badge>
                    <span className="font-medium">{req.courseName}</span>
                    <span className="text-muted-foreground">{req.className}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">{req.createdAt}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
