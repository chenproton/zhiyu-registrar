'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  Eye,
  ChevronRight,
  Activity,
  BarChart3,
} from 'lucide-react'
import {
  tasks,
  classes,
  departments,
  majors,
  grades,
  trainingPrograms,
  type Task,
} from '@/lib/mock-data'

type AnomalySeverity = 'critical' | 'warning' | 'info'

type AnomalyType =
  | 'grade_missing'
  | 'progress_lag'
  | 'evaluation_incomplete'
  | 'attendance_abnormal'
  | 'platform_unlinked'
  | 'overdue_unarchived'
  | 'class_not_held'

interface Anomaly {
  id: string
  taskId: string
  taskName: string
  className: string
  facultyName: string
  type: AnomalyType
  severity: AnomalySeverity
  description: string
  detectedAt: string
}

const typeConfig: Record<
  AnomalyType | 'all',
  { label: string; severity: AnomalySeverity }
> = {
  all: { label: '全部异常', severity: 'critical' },
  grade_missing: { label: '成绩无法收集', severity: 'critical' },
  progress_lag: { label: '进度严重滞后', severity: 'critical' },
  evaluation_incomplete: { label: '测评未完成', severity: 'warning' },
  attendance_abnormal: { label: '缺勤异常', severity: 'warning' },
  class_not_held: { label: '课堂未开展', severity: 'warning' },
  platform_unlinked: { label: '未关联平台', severity: 'info' },
  overdue_unarchived: { label: '超期未归档', severity: 'info' },
}

const filterKeys: (AnomalyType | 'all')[] = [
  'all',
  'grade_missing',
  'progress_lag',
  'evaluation_incomplete',
  'attendance_abnormal',
  'class_not_held',
  'platform_unlinked',
  'overdue_unarchived',
]

function detectAnomalies(task: Task): Anomaly[] {
  const results: Anomaly[] = []
  const detectedAt = task.updatedAt || new Date().toISOString()

  // 1. 成绩数据无法收集
  if (
    task.externalPlatformId &&
    (!task.studentGrades || task.studentGrades.length === 0)
  ) {
    results.push({
      id: `${task.id}-grade_missing`,
      taskId: task.id,
      taskName: task.name,
      className: task.className,
      facultyName: task.facultyName,
      type: 'grade_missing',
      severity: 'critical',
      description: '已关联外部平台但成绩数据未回流',
      detectedAt,
    })
  }

  // 2. 测评未完成
  if (
    task.status === 'evaluating' &&
    task.gradeSummary?.components?.some(
      (c) => c.recordCount < c.totalStudents
    )
  ) {
    results.push({
      id: `${task.id}-evaluation_incomplete`,
      taskId: task.id,
      taskName: task.name,
      className: task.className,
      facultyName: task.facultyName,
      type: 'evaluation_incomplete',
      severity: 'warning',
      description: '成绩评定中但部分学生成绩未录入',
      detectedAt,
    })
  }

  // 3. 进度严重滞后
  if (
    task.progressSummary &&
    (task.progressSummary.completionRate < 50 ||
      task.progressSummary.studentAvgCompletion < 50)
  ) {
    results.push({
      id: `${task.id}-progress_lag`,
      taskId: task.id,
      taskName: task.name,
      className: task.className,
      facultyName: task.facultyName,
      type: 'progress_lag',
      severity: 'critical',
      description: '课时完成率或学生完成率低于50%',
      detectedAt,
    })
  }

  // 4. 课堂缺勤异常
  if (task.classSessions && task.classSessions.length > 0) {
    const heldSessions = task.classSessions
      .filter((s) => s.status === 'held')
      .sort((a, b) => b.sessionNumber - a.sessionNumber)
      .slice(0, 3)

    if (heldSessions.length > 0) {
      const cls = classes.find((c) => c.id === task.classId)
      const studentCount = cls?.studentCount ?? 0
      if (studentCount > 0) {
        const avgRate =
          heldSessions.reduce(
            (sum, s) => sum + s.attendanceCount / studentCount,
            0
          ) / heldSessions.length

        if (avgRate < 0.8) {
          results.push({
            id: `${task.id}-attendance_abnormal`,
            taskId: task.id,
            taskName: task.name,
            className: task.className,
            facultyName: task.facultyName,
            type: 'attendance_abnormal',
            severity: 'warning',
            description: '近期课堂出勤率偏低',
            detectedAt,
          })
        }
      }
    }
  }

  // 5. 未关联教学平台
  if (
    task.status !== 'draft' &&
    task.type === 'scene' &&
    !task.externalPlatformId
  ) {
    results.push({
      id: `${task.id}-platform_unlinked`,
      taskId: task.id,
      taskName: task.name,
      className: task.className,
      facultyName: task.facultyName,
      type: 'platform_unlinked',
      severity: 'info',
      description: '场景教学任务未关联实践场景平台',
      detectedAt,
    })
  }

  // 6. 超期未归档
  if (task.status === 'completed' && task.completedAt) {
    const completedDate = new Date(task.completedAt)
    const now = new Date()
    const diffDays =
      (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays > 14) {
      results.push({
        id: `${task.id}-overdue_unarchived`,
        taskId: task.id,
        taskName: task.name,
        className: task.className,
        facultyName: task.facultyName,
        type: 'overdue_unarchived',
        severity: 'info',
        description: '任务已完成超过14天仍未归档',
        detectedAt,
      })
    }
  }

  // 7. 课堂未开展
  if (
    (task.status === 'in_progress' || task.status === 'evaluating') &&
    (!task.classSessions || task.classSessions.length === 0)
  ) {
    results.push({
      id: `${task.id}-class_not_held`,
      taskId: task.id,
      taskName: task.name,
      className: task.className,
      facultyName: task.facultyName,
      type: 'class_not_held',
      severity: 'warning',
      description: '任务已进行但没有任何课堂记录',
      detectedAt,
    })
  }

  return results
}

function SeverityBadge({ severity }: { severity: AnomalySeverity }) {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive" className="text-xs">严重</Badge>
    case 'warning':
      return (
        <Badge
          variant="outline"
          className="text-xs border-amber-400 text-amber-600 bg-amber-50"
        >
          警告
        </Badge>
      )
    case 'info':
      return (
        <Badge
          variant="outline"
          className="text-xs border-blue-400 text-blue-600 bg-blue-50"
        >
          提示
        </Badge>
      )
  }
}

function TypeBadge({ type }: { type: AnomalyType }) {
  const config = typeConfig[type]
  switch (config.severity) {
    case 'critical':
      return (
        <Badge variant="destructive" className="text-xs">
          {config.label}
        </Badge>
      )
    case 'warning':
      return (
        <Badge
          variant="outline"
          className="text-xs border-amber-400 text-amber-600 bg-amber-50"
        >
          {config.label}
        </Badge>
      )
    case 'info':
      return (
        <Badge
          variant="outline"
          className="text-xs border-blue-400 text-blue-600 bg-blue-50"
        >
          {config.label}
        </Badge>
      )
  }
}

export default function AnomaliesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<AnomalyType | 'all'>('all')
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMajorId, setSelectedMajorId] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')

  const deptPrograms = useMemo(() => {
    let list = trainingPrograms
    if (selectedDeptId !== 'all') {
      const deptMajorIds = majors.filter((m) => m.departmentId === selectedDeptId).map((m) => m.id)
      list = list.filter((p) => deptMajorIds.includes(p.majorId))
    }
    if (selectedMajorId !== 'all') {
      list = list.filter((p) => p.majorId === selectedMajorId)
    }
    if (selectedYear !== 'all') {
      list = list.filter((p) => String(p.entryYear) === selectedYear)
    }
    return list
  }, [selectedDeptId, selectedMajorId, selectedYear])

  const allAnomalies = useMemo(() => {
    const anomalies: Anomaly[] = []
    for (const task of tasks) {
      anomalies.push(...detectAnomalies(task))
    }
    return anomalies
  }, [])

  const filteredAnomalies = useMemo(() => {
    let result = allAnomalies
    if (selectedType !== 'all') {
      result = result.filter((a) => a.type === selectedType)
    }
    if (selectedProgramId !== 'all') {
      const program = trainingPrograms.find((p) => p.id === selectedProgramId)
      if (program) {
        const relatedTaskIds = new Set(
          tasks
            .filter((t) => {
              const cls = classes.find((c) => c.id === t.classId)
              const grade = grades.find((g) => g.id === cls?.gradeId)
              return cls?.majorId === program.majorId && grade?.entryYear === program.entryYear
            })
            .map((t) => t.id)
        )
        result = result.filter((a) => relatedTaskIds.has(a.taskId))
      }
    }
    return result
  }, [allAnomalies, selectedType, selectedProgramId])

  const totalCount = allAnomalies.length
  const criticalCount = allAnomalies.filter((a) => a.severity === 'critical').length
  const warningCount = allAnomalies.filter((a) => a.severity === 'warning').length
  const infoCount = allAnomalies.filter((a) => a.severity === 'info').length

  const handleViewTask = (taskId: string) => {
    router.push(`/admin/operations/tasks/${taskId}`)
  }

  const getFilterCount = (key: AnomalyType | 'all') => {
    if (key === 'all') return totalCount
    return allAnomalies.filter((a) => a.type === key).length
  }

  return (
    <div className="space-y-6">
      {/* 标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">异常监控</h1>
          <p className="text-muted-foreground text-sm">
            共 {filteredAnomalies.length} 条异常 · 自动识别教学运行中的风险点
          </p>
        </div>
      </div>

      {/* 顶部筛选栏 */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>院系</Label>
            <Select
              value={selectedDeptId}
              onValueChange={(v) => {
                setSelectedDeptId(v)
                setSelectedMajorId('all')
                setSelectedProgramId('all')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="全部院系" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部院系</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>年级</Label>
            <Select
              value={selectedYear}
              onValueChange={(v) => {
                setSelectedYear(v)
                setSelectedProgramId('all')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="全部年级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部年级</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={String(g.entryYear)}>{g.entryYear}级</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>专业</Label>
            <Select
              value={selectedMajorId}
              onValueChange={(v) => {
                setSelectedMajorId(v)
                setSelectedProgramId('all')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="全部专业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部专业</SelectItem>
                {majors
                  .filter((m) => selectedDeptId === 'all' || m.departmentId === selectedDeptId)
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>人培方案</Label>
            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="全部方案" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部方案</SelectItem>
                {deptPrograms.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 异常类型筛选 */}
        <div className="flex flex-wrap gap-1">
          {filterKeys.map((key) => {
            const count = getFilterCount(key)
            const config = typeConfig[key]
            const isActive = selectedType === key
            return (
              <Badge
                key={key}
                variant={isActive ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedType(key)}
              >
                {config.label} · {count}
              </Badge>
            )
          })}
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">异常总数</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <div className="rounded-full p-2 bg-slate-500">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">严重异常数</p>
                <p className="text-2xl font-bold">{criticalCount}</p>
              </div>
              <div className="rounded-full p-2 bg-red-500">
                <ShieldAlert className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">警告异常数</p>
                <p className="text-2xl font-bold">{warningCount}</p>
              </div>
              <div className="rounded-full p-2 bg-amber-500">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">提示异常数</p>
                <p className="text-2xl font-bold">{infoCount}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <Info className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 异常列表表格 */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>异常类型</TableHead>
                  <TableHead>严重程度</TableHead>
                  <TableHead>任务名称</TableHead>
                  <TableHead>教师</TableHead>
                  <TableHead>异常描述</TableHead>
                  <TableHead>发现时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnomalies.map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell>
                      <TypeBadge type={anomaly.type} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={anomaly.severity} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {anomaly.taskName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {anomaly.className}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {anomaly.facultyName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {anomaly.description}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(anomaly.detectedAt).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="cursor-pointer text-xs"
                        onClick={() => handleViewTask(anomaly.taskId)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        查看任务 <ChevronRight className="h-3 w-3 ml-1" />
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAnomalies.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-16"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
                        <span className="text-lg">🎉 未发现异常，教学运行正常</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}
