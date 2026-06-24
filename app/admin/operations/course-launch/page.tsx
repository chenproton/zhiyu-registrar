'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Rocket,
  BookOpen,
  Beaker,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Play,
  RotateCcw,
  GraduationCap,
  ShieldCheck,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  courseLaunchRecords,
  tasks,
  trainingPrograms,
  departments,
  majors,
  grades,
  classes,
  type CourseLaunchRecord,
  type Task,
} from '@/lib/mock-data'

function getProgramIdForClass(classId: string) {
  const cls = classes.find((c) => c.id === classId)
  if (!cls) return null
  const grade = grades.find((g) => g.id === cls.gradeId)
  if (!grade) return null
  const program = trainingPrograms.find((p) => p.majorId === cls.majorId && p.entryYear === grade.entryYear)
  return program?.id || null
}

export default function CourseLaunchPage() {
  const router = useRouter()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMajorId, setSelectedMajorId] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<CourseLaunchRecord | null>(null)
  const [records, setRecords] = useState<CourseLaunchRecord[]>(courseLaunchRecords)

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

  const currentProgram = useMemo(() => {
    if (selectedProgramId === 'all') return null
    return trainingPrograms.find((p) => p.id === selectedProgramId)
  }, [selectedProgramId])

  const filteredTasks = useMemo(() => {
    let list = [...tasks]
    if (selectedProgramId !== 'all') {
      const program = trainingPrograms.find((p) => p.id === selectedProgramId)
      if (program) {
        list = list.filter((t) => {
          const cls = classes.find((c) => c.id === t.classId)
          const grade = grades.find((g) => g.id === cls?.gradeId)
          return cls?.majorId === program.majorId && grade?.entryYear === program.entryYear
        })
      }
    }
    if (activeTab !== 'all') {
      list = list.filter((t) => {
        const rec = courseLaunchRecords.find((r) => r.taskId === t.id)
        const status = rec?.launchStatus || 'ready'
        return status === activeTab
      })
    }
    return list
  }, [selectedProgramId, activeTab])

  const getLaunchInfo = (taskId: string) => {
    const rec = courseLaunchRecords.find((r) => r.taskId === taskId)
    if (!rec) return { status: 'ready' as const, label: '待开课', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock, record: null as CourseLaunchRecord | null }
    const config = statusConfig[rec.launchStatus]
    return { status: rec.launchStatus, label: config.label, color: config.color, icon: config.icon, record: rec }
  }

  const stats = useMemo(() => {
    const total = filteredTasks.length
    const ready = filteredTasks.filter((t) => !courseLaunchRecords.find((r) => r.taskId === t.id) || courseLaunchRecords.find((r) => r.taskId === t.id && r.launchStatus === 'ready')).length
    const launched = filteredTasks.filter((t) => courseLaunchRecords.find((r) => r.taskId === t.id && r.launchStatus === 'launched')).length
    const ended = filteredTasks.filter((t) => courseLaunchRecords.find((r) => r.taskId === t.id && r.launchStatus === 'ended')).length
    return { total, ready, launched, ended }
  }, [filteredTasks])

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    ready: { label: '待开课', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
    launching: { label: '开课中', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Play },
    launched: { label: '已开课', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
    withdrawn: { label: '已撤回', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: RotateCcw },
    ended: { label: '已结课', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: GraduationCap },
  }

  const openLaunchDialog = (record: CourseLaunchRecord) => {
    setSelectedRecord(record)
    setLaunchDialogOpen(true)
  }

  const handleLaunch = () => {
    if (!selectedRecord) return
    // 更新记录状态为已开课
    setRecords((prev) => prev.map((r) => r.id === selectedRecord.id ? { ...r, launchStatus: 'launched', launchedAt: new Date().toISOString() } : r))
    toast.success('开课成功！学生端已可见。')
    setLaunchDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            开课管理
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {currentProgram ? currentProgram.name : '全部方案'} · 围绕学习任务进行开课确认、发布与监控
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

      {/* 统计 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-blue-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">学习任务数</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-muted-foreground">待开课</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.ready}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-muted-foreground">已开课</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.launched}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">已结课</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.ended}</p>
            </CardContent>
          </Card>
        </div>

        {/* 状态筛选 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="ready">待开课</TabsTrigger>
            <TabsTrigger value="launched">已开课</TabsTrigger>
            <TabsTrigger value="ended">已结课</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 开课记录表格 */}
        <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>学习任务</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>班级</TableHead>
                <TableHead>教师</TableHead>
                <TableHead>上课时间</TableHead>
                <TableHead>备课状态</TableHead>
                <TableHead>开课状态</TableHead>
                <TableHead className="w-32">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                const launchInfo = getLaunchInfo(task.id)
                const StatusIcon = launchInfo.icon
                const rec = launchInfo.record
                const launchCheck = rec ? computeLaunchChecklist(rec) : []
                const allReady = launchCheck.length > 0 && launchCheck.every((c) => c.passed)
                const prepRec = courseLaunchRecords.find((r) => r.taskId === task.id)
                const prepStatus = prepRec?.prepStatus || 'pending'
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {task.type === 'hybrid' ? <BookOpen className="h-4 w-4 text-purple-600" /> :
                         task.type === 'scene' ? <Beaker className="h-4 w-4 text-purple-600" /> :
                         <BookOpen className="h-4 w-4 text-blue-600" />}
                        {task.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${task.type === 'hybrid' ? 'bg-purple-50 text-purple-600 border-purple-200' : ''}`}>
                        {task.type === 'hybrid' ? '混合式' : task.type === 'scene' ? '场景' : '课程'}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.className}</TableCell>
                    <TableCell>{task.facultyName}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        周{['日', '一', '二', '三', '四', '五', '六'][task.dayOfWeek]}
                        第{task.periods.join('-')}节
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs',
                        prepStatus === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                      )}>
                        {prepStatus === 'completed' ? '已完成' : prepStatus === 'in_progress' ? '备课中' : '待备课'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', launchInfo.color)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {launchInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          if (rec) {
                            router.push(`/admin/operations/course-launch/${rec.id}`)
                          } else {
                            toast.info('该学习任务尚未创建开课记录')
                          }
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {launchInfo.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              if (rec) {
                                openLaunchDialog(rec)
                              } else {
                                toast.info('该学习任务尚未创建开课记录')
                              }
                            }}
                            variant={allReady ? 'default' : 'outline'}
                            className={allReady ? '' : 'text-amber-600 border-amber-300 hover:bg-amber-50'}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {allReady ? '开课' : '检查'}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无学习任务
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 开课确认弹窗 - 带检查引擎 */}
      <Dialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              开课确认
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && <LaunchCheckDialogContent record={selectedRecord} onLaunch={handleLaunch} onCancel={() => setLaunchDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============ 预开课检查引擎 ============

interface CheckItem {
  label: string
  passed: boolean
  icon: React.ReactNode
}

function computeLaunchChecklist(record: CourseLaunchRecord): CheckItem[] {
  const c = record.checklist
  const isScene = record.taskType === 'scene'
  const isHybrid = record.taskType === 'hybrid'

  const common: CheckItem[] = [
    {
      label: '备课已完成',
      passed: c.prepCompleted,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    },
    {
      label: '场地已确认',
      passed: c.venueConfirmed,
      icon: <ShieldCheck className="h-4 w-4 text-blue-600" />,
    },
    {
      label: '学生已通知',
      passed: c.studentsNotified,
      icon: <Users className="h-4 w-4 text-indigo-600" />,
    },
    {
      label: '教学资料已准备',
      passed: c.materialsReady,
      icon: <BookOpen className="h-4 w-4 text-orange-600" />,
    },
  ]

  if (isHybrid) {
    return [
      ...common,
      {
        label: '线上平台/课程链接已配置',
        passed: !!c.equipmentChecked,
        icon: <BookOpen className="h-4 w-4 text-purple-600" />,
      },
      {
        label: '线下实践任务已绑定',
        passed: !!c.equipmentChecked,
        icon: <Beaker className="h-4 w-4 text-fuchsia-600" />,
      },
    ]
  }

  if (isScene) {
    return [
      ...common,
      {
        label: '工位/设备已检查',
        passed: !!c.equipmentChecked,
        icon: <Wrench className="h-4 w-4 text-purple-600" />,
      },
      {
        label: '企业导师已确认',
        passed: !!c.equipmentChecked, // 复用设备检查作为导师确认标记（mock简化）
        icon: <Beaker className="h-4 w-4 text-fuchsia-600" />,
      },
    ]
  }

  return common
}

function LaunchCheckDialogContent({
  record,
  onLaunch,
  onCancel,
}: {
  record: CourseLaunchRecord
  onLaunch: () => void
  onCancel: () => void
}) {
  const checklist = useMemo(() => computeLaunchChecklist(record), [record])
  const passedCount = checklist.filter((c) => c.passed).length
  const totalCount = checklist.length
  const allPassed = passedCount === totalCount

  return (
    <div className="space-y-4 py-2">
      {/* 基本信息 */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              {record.taskType === 'hybrid' ? <BookOpen className="h-4 w-4 text-purple-600" /> :
               record.taskType === 'scene' ? <Beaker className="h-4 w-4 text-purple-600" /> :
               <BookOpen className="h-4 w-4 text-blue-600" />}
              <span className="font-medium">{record.taskName}</span>
              <Badge variant="outline" className="text-[10px] h-5">
                {record.taskType === 'hybrid' ? '混合式教学' : record.taskType === 'scene' ? '场景教学' : '传统教学'}
              </Badge>
            </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <p><span className="text-muted-foreground/70">班级：</span>{record.className}</p>
          <p><span className="text-muted-foreground/70">教师：</span>{record.facultyName}</p>
          <p><span className="text-muted-foreground/70">时间：</span>周{['日', '一', '二', '三', '四', '五', '六'][record.dayOfWeek]} 第{record.periods.join('-')}节</p>
          <p><span className="text-muted-foreground/70">场地：</span>{record.venueName}</p>
        </div>
      </div>

      {/* 检查清单 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">开课检查清单：</p>
          <span className={cn('text-xs font-medium', allPassed ? 'text-emerald-600' : 'text-amber-600')}>
            {passedCount}/{totalCount} 项通过
          </span>
        </div>
        <Progress value={(passedCount / totalCount) * 100} className="h-2" />
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-2 text-sm rounded-lg p-2.5 border',
                item.passed
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-amber-50 border-amber-200'
              )}
            >
              {item.passed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-amber-600 shrink-0" />
              )}
              <span className={cn('flex-1', item.passed ? 'text-emerald-700' : 'text-amber-700')}>
                {item.label}
              </span>
              {!item.passed && <Badge variant="outline" className="text-[10px] h-5 text-amber-600 border-amber-300">待完成</Badge>}
            </div>
          ))}
        </div>
      </div>

      {/* 警告提示 */}
      {!allPassed && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">尚有 {totalCount - passedCount} 项检查未通过</p>
            <p className="mt-0.5 opacity-80">
              {record.taskType === 'hybrid'
                ? '混合式课程开课需要确保线上资源、线下场地与实践任务全部就绪'
                : record.taskType === 'scene'
                ? '场景教学开课需要确保设备、导师、场地全部就绪'
                : '建议完成全部检查项后再开课，确保教学质量'}
            </p>
          </div>
        </div>
      )}

      {allPassed && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">全部检查通过，可以开课</p>
            <p className="mt-0.5 opacity-80">开课后学生端将立即看到课程/场景信息</p>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={onLaunch} disabled={!allPassed}>
          <Play className="h-4 w-4 mr-1" />
          {allPassed ? '确认开课' : `待完成 ${totalCount - passedCount} 项`}
        </Button>
      </DialogFooter>
    </div>
  )
}
