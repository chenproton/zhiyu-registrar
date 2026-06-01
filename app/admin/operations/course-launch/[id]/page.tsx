'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Rocket,
  BookOpen,
  Beaker,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  Play,
  Eye,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { courseLaunchRecords, type CourseLaunchRecord } from '@/lib/mock-data'

export default function CourseLaunchDetailPage() {
  const router = useRouter()
  const params = useParams()
  const launchId = params.id as string

  const record = courseLaunchRecords.find((r) => r.id === launchId)
  const [launchStatus, setLaunchStatus] = useState(record?.launchStatus || 'ready')

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Rocket className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">未找到开课记录</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/operations/course-launch')}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回列表
        </Button>
      </div>
    )
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    ready: { label: '待开课', color: 'bg-amber-100 text-amber-700', icon: Clock },
    launching: { label: '开课中', color: 'bg-blue-100 text-blue-700', icon: Play },
    launched: { label: '已开课', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    withdrawn: { label: '已撤回', color: 'bg-slate-100 text-slate-700', icon: RotateCcw },
    ended: { label: '已结课', color: 'bg-purple-100 text-purple-700', icon: GraduationCap },
  }

  const status = statusConfig[launchStatus]
  const StatusIcon = status.icon

  const handleLaunch = () => {
    setLaunchStatus('launched')
    toast.success('开课成功！学生端已可见。')
  }

  const handleWithdraw = () => {
    setLaunchStatus('withdrawn')
    toast.success('已撤回开课。')
  }

  const handleEnd = () => {
    setLaunchStatus('ended')
    toast.success('课程已结束。')
  }

  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/operations/course-launch')}>
            <ArrowLeft className="h-4 w-4 mr-1" />返回
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {record.taskType === 'scene' ? <Beaker className="h-5 w-5 text-purple-600" /> : <BookOpen className="h-5 w-5 text-blue-600" />}
              {record.taskName} · 开课详情
            </h1>
          </div>
        </div>
        <Badge className={cn('text-sm', status.color)}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      {/* 状态时间线 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">开课状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {['ready', 'launching', 'launched', 'ended'].map((step, index) => {
              const stepConfig = statusConfig[step]
              const StepIcon = stepConfig.icon
              const isActive = ['ready', 'launching', 'launched', 'ended'].indexOf(launchStatus) >= index
              const isCurrent = launchStatus === step
              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2',
                      isCurrent ? 'border-primary bg-primary text-primary-foreground' :
                      isActive ? 'border-emerald-500 bg-emerald-50 text-emerald-600' :
                      'border-muted-foreground/30 text-muted-foreground'
                    )}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={cn('mt-1 text-xs', isCurrent ? 'text-primary font-medium' : 'text-muted-foreground')}>
                      {stepConfig.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={cn('mx-2 h-0.5 flex-1', isActive ? 'bg-emerald-500' : 'bg-muted')} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">任务信息</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">课程/场景：</span>{record.courseName}</p>
            <p><span className="text-muted-foreground">班级：</span>{record.className}</p>
            <p><span className="text-muted-foreground">教师：</span>{record.facultyName}</p>
            <p><span className="text-muted-foreground">上课时间：</span>周{['日', '一', '二', '三', '四', '五', '六'][record.dayOfWeek]} 第{record.periods.join('-')}节</p>
            <p><span className="text-muted-foreground">上课周次：</span>{record.weeks}</p>
            <p><span className="text-muted-foreground">上课场地：</span>{record.venueName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">开课检查清单</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={record.checklist.prepCompleted} />
              备课已完成
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={record.checklist.venueConfirmed} />
              场地已确认
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={record.checklist.studentsNotified} />
              学生已通知
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={record.checklist.materialsReady} />
              教学资料已准备
            </label>
            {record.taskType === 'scene' && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={record.checklist.equipmentChecked} />
                设备已检查
              </label>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">快捷操作</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {launchStatus === 'ready' && (
              <Button onClick={handleLaunch}>
                <Play className="h-4 w-4 mr-1" />确认开课
              </Button>
            )}
            {launchStatus === 'launched' && (
              <>
                <Button variant="outline" onClick={handleWithdraw}>
                  <RotateCcw className="h-4 w-4 mr-1" />撤回开课
                </Button>
                <Button onClick={handleEnd}>
                  <GraduationCap className="h-4 w-4 mr-1" />结束课程
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => router.push(`/admin/operations/tasks/${record.taskId}`)}>
              <Eye className="h-4 w-4 mr-1" />查看任务详情
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => router.push('/admin/operations/course-launch')}>
          <ArrowRight className="h-4 w-4 mr-1 rotate-180" />返回列表
        </Button>
        <Button onClick={() => router.push('/admin/operations/tasks')}>
          前往学习任务中心<ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
