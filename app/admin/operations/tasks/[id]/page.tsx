'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Download,
  Search,
  CheckCircle2,
  Circle,
  FileText,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Rocket,
  Archive,
  Send,
  PenTool,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  tasks,
  classes,
  students,
  venues,
  taskChangeLogs,
  preparationTasks,
  type Task,
  type TaskClassSession,
  type TaskStudentGrade,
  type TaskStatus,
  type TaskResource,
  type SceneSubTask,
  type TaskProgressSummary,
  type TaskGradeSummary,
  type TaskEvaluationConfig,
} from '@/lib/mock-data'
import EvaluationConfigContent from './_components/evaluation-config-dialog'
import RichTextEditor from './_components/rich-text-editor'
import StudentGradesPanel from './_components/student-grades-panel'
import ClassroomManagementPanel from './_components/classroom-management-panel'
import SceneSubTasksPanel from './_components/scene-subtasks-panel'

const statusOrder: TaskStatus[] = ['draft', 'ready', 'published', 'in_progress', 'evaluating', 'completed', 'archived']

const statusLabelMap: Record<TaskStatus, string> = {
  draft: '草稿',
  ready: '待发布',
  published: '已发布',
  in_progress: '进行中',
  evaluating: '考核中',
  completed: '已完成',
  archived: '已归档',
}

const statusBadgeVariant = (status: TaskStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'published':
    case 'in_progress':
      return 'secondary'
    case 'evaluating':
      return 'default'
    case 'archived':
      return 'outline'
    case 'draft':
    case 'ready':
      return 'secondary'
    default:
      return 'secondary'
  }
}

const dayOfWeekLabel = (d: number) => {
  const map = ['日', '一', '二', '三', '四', '五', '六']
  return `周${map[d] || d}`
}

const gradeComponentLabel: Record<string, string> = {
  usual: '平时',
  midterm: '期中',
  final: '期末',
  practice: '实践',
  total: '总评',
  makeup: '补考',
  retake: '重修',
}

const gradeComponentStatusLabel: Record<string, string> = {
  pending: '待录入',
  confirmed: '已确认',
  audited: '已审核',
  recognized: '已认定',
  published: '已发布',
}

const resourceTypeLabel: Record<string, string> = {
  textbook: '教材',
  ppt: '课件',
  video: '视频',
  link: '链接',
  document: '文档',
  scene_link: '场景链接',
}

function getTaskStudentList(task: Task) {
  const cls = classes.find((c) => c.id === task.classId)
  if (!cls) return []
  return students.filter((s) => s.classId === cls.id && s.status === '在籍')
}

function getStudentAttendance(studentId: string, sessions: TaskClassSession[]) {
  const attended = sessions.filter((s) => s.status === 'held' && !s.absentStudentIds.includes(studentId))
  const lastDate = attended.length > 0 ? attended.sort((a, b) => b.actualDate!.localeCompare(a.actualDate!))[0].actualDate : undefined
  return { count: attended.length, lastDate }
}

function getStudentProgress(studentId: string, _task: Task) {
  // 模拟进度数据
  const hash = studentId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return Math.min(100, Math.max(10, (hash % 95) + 5))
}

function getStudentLastAccess(studentId: string, _task: Task) {
  const hash = studentId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const daysAgo = hash % 14
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export default function TaskDetailPage() {
  const params = useParams()
  const id = params.id as string

  const originalTask = useMemo(() => tasks.find((t) => t.id === id), [id])
  const [task, setTask] = useState<Task | undefined>(originalTask)

  const [activeTab, setActiveTab] = useState('basic')
  const [prepStage, setPrepStage] = useState<'pre' | 'in' | 'post'>('pre')
  const [searchStudent, setSearchStudent] = useState('')
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [recordDialogOpen, setRecordDialogOpen] = useState(false)
  const [recordingSession, setRecordingSession] = useState<TaskClassSession | null>(null)
  const [recordForm, setRecordForm] = useState({ actualDate: '', topic: '', attendanceCount: 0, absentStudentIds: [] as string[], notes: '' })

  const [reviewForm, setReviewForm] = useState({ teachingReflection: '', problemsFound: '', improvementMeasures: '', studentFeedbackSummary: '' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const [gradeWorkflowStep, setGradeWorkflowStep] = useState<'confirm' | 'audit' | 'publish'>('confirm')

  const [evalConfig, setEvalConfig] = useState<TaskEvaluationConfig | undefined>(task?.evaluationConfig)

  useEffect(() => {
    setTask(originalTask)
    setEvalConfig(originalTask?.evaluationConfig)
  }, [originalTask])

  if (!task) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium">任务不存在</p>
          <p className="text-sm text-muted-foreground">未找到 ID 为 {id} 的教学任务</p>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(task.status)

  const classStudents = useMemo(() => getTaskStudentList(task), [task])
  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return classStudents
    return classStudents.filter((s) => s.name.includes(searchStudent.trim()))
  }, [classStudents, searchStudent])

  const sessions = task.classSessions || []
  const resources = task.resources || []
  const studentGrades = task.studentGrades || []
  const gradeSummary = task.gradeSummary

  const handleOpenRecord = (session: TaskClassSession) => {
    setRecordingSession(session)
    setRecordForm({
      actualDate: session.scheduledDate,
      topic: session.topic || '',
      attendanceCount: classStudents.length,
      absentStudentIds: [],
      notes: '',
    })
    setRecordDialogOpen(true)
  }

  const handleSaveRecord = () => {
    toast.success('课堂记录已保存（模拟）')
    setRecordDialogOpen(false)
  }

  const handleGradeWorkflow = () => {
    if (gradeWorkflowStep === 'confirm') {
      setGradeWorkflowStep('audit')
      toast.success('成绩已确认，进入审核阶段')
    } else if (gradeWorkflowStep === 'audit') {
      setGradeWorkflowStep('publish')
      toast.success('成绩已审核通过，进入发布阶段')
    } else if (gradeWorkflowStep === 'publish') {
      toast.success('成绩已发布')
    }
  }

  const handleSubmitReview = () => {
    setReviewSubmitted(true)
    toast.success('复盘已提交')
  }

  // ============ 任务状态流转 ============
  const prepTask = useMemo(() => preparationTasks.find((p) => p.taskId === task?.id), [task?.id])

  const checkBasicInfo = () => {
    if (!task) return false
    return !!(task.name && task.courseName && task.className && task.facultyName && task.dayOfWeek !== undefined && task.venueName)
  }

  const checkPrepCompleted = () => {
    return !!prepTask && prepTask.status === 'completed'
  }

  const checkAllSessionsHeld = () => {
    if (!task?.classSessions) return false
    return task.classSessions.length > 0 && task.classSessions.every((s) => s.status === 'held')
  }

  const checkGradesPublished = () => {
    return task?.gradeSummary?.overallStatus === 'published'
  }

  const checkSceneSubTasksReady = () => {
    if (task?.type !== 'scene') return true
    const subs = task.sceneSubTasks || []
    return subs.length > 0 && subs.every((s) => s.status !== 'planned')
  }

  const statusChecks: Record<TaskStatus, { label: string; check: () => boolean; hint: string }[]> = {
    draft: [{ label: '基本信息完整', check: checkBasicInfo, hint: '请完善任务基本信息' }],
    ready: [
      { label: '备课已完成', check: checkPrepCompleted, hint: '请先完成备课' },
      ...(task?.type === 'scene' ? [{ label: '子任务已就绪', check: checkSceneSubTasksReady, hint: '请确认所有子任务已非计划中状态' }] : []),
    ],
    published: [],
    in_progress: [{ label: '全部课堂已上完', check: checkAllSessionsHeld, hint: '请先完成所有课堂记录' }],
    evaluating: [{ label: '成绩已发布', check: checkGradesPublished, hint: '请先发布学生成绩' }],
    completed: [],
    archived: [],
  }

  const statusTransitions: Record<TaskStatus, { next: TaskStatus; label: string; icon: any }[]> = {
    draft: [{ next: 'ready', label: '准备就绪', icon: CheckCircle2 }],
    ready: [{ next: 'published', label: '发布任务', icon: Rocket }],
    published: [],
    in_progress: [{ next: 'evaluating', label: '进入考核', icon: PenTool }],
    evaluating: [{ next: 'completed', label: '完成任务', icon: CheckCircle2 }],
    completed: [{ next: 'archived', label: '归档', icon: Archive }],
    archived: [],
  }

  const handleStatusTransition = (nextStatus: TaskStatus) => {
    if (!task) return
    const checks = statusChecks[task.status]
    const failed = checks.filter((c) => !c.check())
    if (failed.length > 0) {
      toast.error(`状态流转失败：${failed.map((f) => f.hint).join('；')}`)
      return
    }
    setTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString().split('T')[0] })
    toast.success(`任务状态已更新为「${statusLabelMap[nextStatus]}」`)
  }

  const handleWithdraw = () => {
    if (!task) return
    setTask({ ...task, status: 'draft', updatedAt: new Date().toISOString().split('T')[0] })
    toast.success('任务已撤回至草稿状态')
  }

  const currentChecks = task ? statusChecks[task.status] : []
  const allChecksPassed = currentChecks.every((c) => c.check())

  const taskChangeLogsForTask = taskChangeLogs.filter((l) => l.taskId === task.id)

  const getScoreCell = (grade: TaskStudentGrade, type: string) => {
    const comp = grade.components.find((c) => c.type === type)
    if (!comp || comp.status === 'pending') {
      return <span className="text-muted-foreground text-xs">待发布</span>
    }
    return <span className="text-sm">{comp.score}/{comp.maxScore}</span>
  }

  const getTotalCell = (grade: TaskStudentGrade) => {
    if (grade.totalStatus === 'pending' || grade.totalScore === undefined) {
      return <span className="text-muted-foreground text-xs">待发布</span>
    }
    return <span className="text-sm font-medium">{grade.totalScore}</span>
  }

  const isTaskCompleted = task.status === 'completed' || task.status === 'archived'
  const canWriteReview = isTaskCompleted

  return (
    <div className="space-y-6">
      {/* 面包屑 + 标题 */}
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/operations/tasks">教学任务中心</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>任务详情</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">{task.code}</div>
            <h1 className="text-2xl font-bold">{task.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusBadgeVariant(task.status)} className="text-sm px-3 py-1">
              {statusLabelMap[task.status]}
            </Badge>
            {/* 状态流转按钮 */}
            {statusTransitions[task.status]?.map((t) => {
              const TransitionIcon = t.icon
              const canTransition = allChecksPassed
              return (
                <Button
                  key={t.next}
                  size="sm"
                  onClick={() => handleStatusTransition(t.next)}
                  className="gap-1"
                  disabled={!canTransition}
                  variant={canTransition ? 'default' : 'outline'}
                >
                  <TransitionIcon className="h-4 w-4" />
                  {canTransition ? t.label : `待检查 ${currentChecks.length - currentChecks.filter((c) => c.check()).length} 项`}
                </Button>
              )
            })}

          </div>
        </div>

        {/* 状态流转条件检查 */}
        {currentChecks.length > 0 && (
          <div className={cn(
            'flex items-center gap-3 rounded-lg border p-2.5 text-xs',
            allChecksPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
          )}>
            {allChecksPassed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{allChecksPassed ? '全部前置条件已满足，可以进行状态流转' : '前置条件检查：'}</span>
              {!allChecksPassed && currentChecks.map((c, i) => (
                <span key={i} className={cn('flex items-center gap-1', c.check() ? 'text-emerald-600' : 'text-amber-600')}>
                  {c.check() ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 任务信息网格卡片 */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full p-2 bg-blue-100">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">课程/场景</p>
                <p className="text-sm font-medium">{task.courseName}</p>
                {task.courseVersion && <p className="text-xs text-muted-foreground">版本 {task.courseVersion}</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full p-2 bg-green-100">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">班级</p>
                <p className="text-sm font-medium">{task.className}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full p-2 bg-amber-100">
                <GraduationCap className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">主讲教师</p>
                <p className="text-sm font-medium">{task.facultyName}</p>
                {task.enterpriseMentorName && (
                  <p className="text-xs text-muted-foreground">企业导师: {task.enterpriseMentorName}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full p-2 bg-purple-100">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">上课时间</p>
                <p className="text-sm font-medium">{dayOfWeekLabel(task.dayOfWeek)} {task.periods.join('、')}</p>
                <p className="text-xs text-muted-foreground">{task.weeks}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-full p-2 bg-red-100">
                <MapPin className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">场地</p>
                <p className="text-sm font-medium">{task.venueName}</p>
              </div>
            </CardContent>
          </Card>
          {task.workStationName && (
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full p-2 bg-indigo-100">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">工位</p>
                  <p className="text-sm font-medium">{task.workStationName}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">任务信息</TabsTrigger>
          <TabsTrigger value="session">任务备课</TabsTrigger>
          <TabsTrigger value="classroom">上课管理</TabsTrigger>
          <TabsTrigger value="evaluation">测评配置</TabsTrigger>
          <TabsTrigger value="grades">学生成绩</TabsTrigger>
          <TabsTrigger value="review">任务复盘</TabsTrigger>
        </TabsList>

        {/* Tab 1: 任务信息 */}
        <TabsContent value="basic" className="space-y-4">
          {/* 关联课程信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">关联课程/实践场景</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">类型</p>
                  <p className="font-medium">
                    {task.externalPlatformType === 'course'
                      ? '课程'
                      : task.externalPlatformType === 'scene'
                        ? '实践场景'
                        : task.type === 'traditional'
                          ? '课程'
                          : task.type === 'scene'
                            ? '实践场景'
                            : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">名称</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{task.courseName}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => toast('跳转查看（模拟）')}>
                      跳转查看
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">资源代码</p>
                  <p className="font-medium">{task.courseCode || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">版本号</p>
                  <p className="font-medium">{task.courseVersion || '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">任务属性</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">任务编码</p>
                  <p className="font-medium">{task.code}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">当前状态</p>
                  <p className="font-medium">{statusLabelMap[task.status]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">班级</p>
                  <p className="font-medium">{task.className}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">主讲教师</p>
                  <p className="font-medium">{task.facultyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">上课时间</p>
                  <p className="font-medium">{dayOfWeekLabel(task.dayOfWeek)} {task.periods.join('、')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">周次</p>
                  <p className="font-medium">{task.weeks}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">场地</p>
                  <p className="font-medium">{task.venueName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">创建时间</p>
                  <p className="font-medium">{task.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">更新时间</p>
                  <p className="font-medium">{task.updatedAt}</p>
                </div>
                {task.publishedAt && (
                  <div>
                    <p className="text-muted-foreground text-xs">发布时间</p>
                    <p className="font-medium">{task.publishedAt}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {task.sceneSubTasks && task.sceneSubTasks.length > 0 && (
            <SceneSubTasksPanel
              subTasks={task.sceneSubTasks}
              onUpdate={(updated) => setTask((prev) => prev ? { ...prev, sceneSubTasks: updated } : prev)}
            />
          )}

          {taskChangeLogsForTask.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">变更记录</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>变更类型</TableHead>
                      <TableHead>原因</TableHead>
                      <TableHead>申请人</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskChangeLogsForTask.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">{log.changeType}</TableCell>
                        <TableCell className="text-sm">{log.reason}</TableCell>
                        <TableCell className="text-sm">{log.applicant}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === 'approved' ? 'default' : log.status === 'rejected' ? 'destructive' : 'secondary'} className="text-xs">
                            {log.status === 'approved' ? '已批准' : log.status === 'rejected' ? '已拒绝' : '待审批'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: 任务备课 */}
        <TabsContent value="session" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => window.open('http://111.170.170.202:3006/teacher/schedule', '_blank')}>
              前往备课
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">备课内容</CardTitle>
                <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-0.5">
                  <button
                    onClick={() => setPrepStage('pre')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      prepStage === 'pre' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    课前环节
                  </button>
                  <button
                    onClick={() => setPrepStage('in')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      prepStage === 'in' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    课中环节
                  </button>
                  <button
                    onClick={() => setPrepStage('post')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      prepStage === 'post' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    课后环节
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {prepStage === 'pre' && (
                <>
                  {/* 教学目标 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                      <h3 className="text-sm font-semibold">教学目标</h3>
                    </div>
                    {task.prepContent?.pre?.objectives ? (
                      <div className="text-sm whitespace-pre-wrap">{task.prepContent.pre.objectives}</div>
                    ) : task.objectives && task.objectives.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {task.objectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无教学目标</div>
                    )}
                  </div>

                  {/* 导学教案 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                      <h3 className="text-sm font-semibold">导学教案</h3>
                    </div>
                    {task.prepContent?.pre?.guidePlan ? (
                      <div className="text-sm whitespace-pre-wrap">{task.prepContent.pre.guidePlan}</div>
                    ) : task.syllabus ? (
                      <div className="text-sm whitespace-pre-wrap">{task.syllabus}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无导学教案</div>
                    )}
                  </div>

                  {/* 课前预习 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
                      <h3 className="text-sm font-semibold">课前预习</h3>
                    </div>
                    {task.prepContent?.pre?.previewQuestions && task.prepContent.pre.previewQuestions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {task.prepContent.pre.previewQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无预习题目</div>
                    )}
                  </div>
                </>
              )}

              {prepStage === 'in' && (
                <>
                  {/* 课件资源 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                      <h3 className="text-sm font-semibold">课件资源</h3>
                    </div>
                    {task.prepContent?.in?.coursewareResources && task.prepContent.in.coursewareResources.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {task.prepContent.in.coursewareResources.map((r) => (
                          <Badge key={r.id} variant="secondary" className="text-xs">{r.name}</Badge>
                        ))}
                      </div>
                    ) : task.resources && task.resources.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {task.resources.map((r) => (
                          <Badge key={r.id} variant="secondary" className="text-xs">{r.name}</Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无课件资源</div>
                    )}
                  </div>

                  {/* 随堂测验 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                      <h3 className="text-sm font-semibold">随堂测验</h3>
                    </div>
                    {task.prepContent?.in?.quizQuestions && task.prepContent.in.quizQuestions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {task.prepContent.in.quizQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无随堂测试题目</div>
                    )}
                  </div>

                  {/* 互动讨论 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />
                      <h3 className="text-sm font-semibold">互动讨论</h3>
                    </div>
                    {task.prepContent?.in?.discussionTopics && task.prepContent.in.discussionTopics.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {task.prepContent.in.discussionTopics.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无讨论话题</div>
                    )}
                  </div>
                </>
              )}

              {prepStage === 'post' && (
                <>
                  {/* 课后作业 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                      <h3 className="text-sm font-semibold">课后作业</h3>
                    </div>
                    {task.prepContent?.post?.homework ? (
                      <div className="text-sm whitespace-pre-wrap">{task.prepContent.post.homework}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无课后作业</div>
                    )}
                  </div>

                  {/* 课后测验 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                      <h3 className="text-sm font-semibold">课后测验</h3>
                    </div>
                    {task.prepContent?.post?.quizQuestions && task.prepContent.post.quizQuestions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {task.prepContent.post.quizQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无课后测验题目</div>
                    )}
                  </div>

                  {/* 课后拓展 */}
                  <div className="rounded-xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                      <h3 className="text-sm font-semibold">课后拓展</h3>
                    </div>
                    {task.prepContent?.post?.extensionResources && task.prepContent.post.extensionResources.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {task.prepContent.post.extensionResources.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">暂无课后拓展资料</div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">备课资源</CardTitle>
            </CardHeader>
            <CardContent>
              {resources.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无备课资源</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>资源名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>上传者</TableHead>
                      <TableHead>上传时间</TableHead>
                      <TableHead>学生可见</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-sm font-medium">{r.name}</TableCell>
                        <TableCell className="text-sm">{resourceTypeLabel[r.type] || r.type}</TableCell>
                        <TableCell className="text-sm">{r.uploadBy}</TableCell>
                        <TableCell className="text-sm">{r.uploadedAt}</TableCell>
                        <TableCell>
                          {r.isVisibleToStudents ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => toast('预览资源（模拟）')}>
                              <Eye className="h-3 w-3 mr-1" />
                              预览
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toast('下载资源（模拟）')}>
                              <Download className="h-3 w-3 mr-1" />
                              下载
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 上课管理 */}
        <TabsContent value="classroom" className="space-y-4">
          <ClassroomManagementPanel />
        </TabsContent>

        {/* Tab 4: 测评配置 */}
        <TabsContent value="evaluation" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {evalConfig ? (
                <EvaluationConfigContent
                  config={evalConfig}
                  onChange={(newConfig) => setEvalConfig(newConfig)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">暂未配置测评方式</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: 学生成绩 */}
        <TabsContent value="grades" className="space-y-4">
          <StudentGradesPanel />
        </TabsContent>

        {/* Tab 6: 任务复盘 */}
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">任务复盘</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RichTextEditor
                placeholder="请在此自由输入任务复盘内容，可包括教学反思、发现问题、改进措施、学生反馈等..."
                value={reviewForm.teachingReflection}
                onChange={(html) => setReviewForm((prev) => ({ ...prev, teachingReflection: html }))}
                minHeight={280}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitReview}>保存</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>



      {/* 记录课堂 Dialog */}
      <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>记录课堂</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>实际上课日期</Label>
              <Input
                type="date"
                value={recordForm.actualDate}
                onChange={(e) => setRecordForm((prev) => ({ ...prev, actualDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>主题</Label>
              <Input
                value={recordForm.topic}
                onChange={(e) => setRecordForm((prev) => ({ ...prev, topic: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>签到人数</Label>
              <Input
                type="number"
                value={recordForm.attendanceCount}
                onChange={(e) => setRecordForm((prev) => ({ ...prev, attendanceCount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>缺勤学生</Label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {classStudents.map((s) => {
                  const checked = recordForm.absentStudentIds.includes(s.id)
                  return (
                    <label key={s.id} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setRecordForm((prev) => ({
                            ...prev,
                            absentStudentIds: checked
                              ? prev.absentStudentIds.filter((id) => id !== s.id)
                              : [...prev.absentStudentIds, s.id],
                          }))
                        }}
                        className="h-3.5 w-3.5"
                      />
                      {s.name}
                    </label>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>课堂小结</Label>
              <Textarea
                value={recordForm.notes}
                onChange={(e) => setRecordForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveRecord}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
