'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  ClipboardList,
  BookOpen,
  Beaker,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Edit3,
  Users,
  Building2,
  GraduationCap,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  preparationTasks,
  tasks,
  faculty,
  trainingPrograms,
  departments,
  majors,
  grades,
  classes,
  type PreparationTask,
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

export default function PreparationPage() {
  const router = useRouter()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

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

  const currentProgram = useMemo(() => {
    if (selectedProgramId === 'all') return null
    return trainingPrograms.find((p) => p.id === selectedProgramId)
  }, [selectedProgramId])

  const programFacultyIds = useMemo(() => {
    if (!currentProgram) return new Set<string>()
    const programTasks = tasks.filter((t) => {
      const cls = classes.find((c) => c.id === t.classId)
      const grade = grades.find((g) => g.id === cls?.gradeId)
      return cls?.majorId === currentProgram.majorId && grade?.entryYear === currentProgram.entryYear
    })
    return new Set(programTasks.map((t) => t.facultyId))
  }, [currentProgram])

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
    if (selectedFacultyId !== 'all') {
      list = list.filter((t) => t.facultyId === selectedFacultyId)
    }
    if (activeTab !== 'all') {
      list = list.filter((t) => {
        const prep = preparationTasks.find((p) => p.taskId === t.id)
        const status = prep?.status || 'none'
        return status === activeTab
      })
    }
    if (typeFilter !== 'all') {
      list = list.filter((t) => t.type === typeFilter)
    }
    return list
  }, [selectedProgramId, selectedFacultyId, activeTab, typeFilter])

  const getPrepInfo = (taskId: string) => {
    const prep = preparationTasks.find((p) => p.taskId === taskId)
    if (!prep) return { status: 'none' as const, label: '未开始', progress: 0, color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock, prepTask: null as PreparationTask | null }
    const config = statusConfig[prep.status]
    return { status: prep.status, label: config.label, progress: prep.progress, color: config.color, icon: config.icon, prepTask: prep }
  }

  const stats = useMemo(() => {
    const total = filteredTasks.length
    const none = filteredTasks.filter((t) => !preparationTasks.find((p) => p.taskId === t.id)).length
    const pending = filteredTasks.filter((t) => preparationTasks.find((p) => p.taskId === t.id && p.status === 'pending')).length
    const inProgress = filteredTasks.filter((t) => preparationTasks.find((p) => p.taskId === t.id && p.status === 'in_progress')).length
    const completed = filteredTasks.filter((t) => preparationTasks.find((p) => p.taskId === t.id && p.status === 'completed')).length
    return { total, none, pending, inProgress, completed }
  }, [filteredTasks])

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    none: { label: '未开始', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    pending: { label: '待备课', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    in_progress: { label: '备课中', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Edit3 },
    completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧方案导航 */}
      <div className="w-60 shrink-0">
        <Card className="h-full flex flex-col py-0">
          <CardContent className="px-3 pb-3 pt-3 flex-1 overflow-y-auto space-y-2">
            <div className="text-sm font-semibold">筛选条件</div>
            {/* 院系 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">院系</label>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={selectedDeptId === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => { setSelectedDeptId('all'); setSelectedProgramId('all') }}
                >全部</Badge>
                {departments.map((d) => (
                  <Badge
                    key={d.id}
                    variant={selectedDeptId === d.id ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => { setSelectedDeptId(d.id); setSelectedProgramId('all') }}
                  >{d.name}</Badge>
                ))}
              </div>
            </div>
            {/* 年级 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">年级</label>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={selectedYear === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedYear('all')}
                >全部</Badge>
                {grades.map((g) => (
                  <Badge
                    key={g.id}
                    variant={selectedYear === String(g.entryYear) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedYear(String(g.entryYear))}
                  >{g.entryYear}级</Badge>
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
                <button
                  className={cn('w-full text-left px-2 py-1 rounded text-xs transition-colors', selectedProgramId === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')}
                  onClick={() => setSelectedProgramId('all')}
                >全部方案</button>
                {deptPrograms.map((p) => (
                  <button
                    key={p.id}
                    className={cn('w-full text-left px-2 py-1 rounded text-xs transition-colors truncate', selectedProgramId === p.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')}
                    onClick={() => setSelectedProgramId(p.id)}
                  >{p.name}</button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              备课管理
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentProgram ? currentProgram.name : '全部方案'} · 统一管理课程备课与场景备课任务
            </p>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-blue-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">学习任务数</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-muted-foreground">未开始</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.none}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-muted-foreground">待备课</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-muted-foreground">备课中</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-muted-foreground">已完成</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* 教师筛选 + 类型/状态筛选 */}
        <div className="flex flex-col gap-3">
          {/* 教师筛选 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground shrink-0">教师：</span>
            <button
              className={cn('px-3 py-1.5 text-sm rounded-md transition-colors border', selectedFacultyId === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-muted hover:border-primary/50')}
              onClick={() => setSelectedFacultyId('all')}
            >全部教师</button>
            {faculty
              .filter((f) => selectedProgramId === 'all' || programFacultyIds.has(f.id))
              .map((f) => (
                <button
                  key={f.id}
                  className={cn('px-3 py-1.5 text-sm rounded-md transition-colors border', selectedFacultyId === f.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-muted hover:border-primary/50')}
                  onClick={() => setSelectedFacultyId(f.id)}
                >
                  {f.name}
                </button>
              ))}
          </div>
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">全部状态</TabsTrigger>
                <TabsTrigger value="none">未开始</TabsTrigger>
                <TabsTrigger value="pending">待备课</TabsTrigger>
                <TabsTrigger value="in_progress">备课中</TabsTrigger>
                <TabsTrigger value="completed">已完成</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                className={cn('px-3 py-1.5 text-sm rounded-md transition-colors', typeFilter === 'all' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}
                onClick={() => setTypeFilter('all')}
              >全部类型</button>
              <button
                className={cn('px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1', typeFilter === 'traditional' ? 'bg-background shadow-sm font-medium text-blue-600' : 'text-muted-foreground hover:text-foreground')}
                onClick={() => setTypeFilter('traditional')}
              ><BookOpen className="h-3.5 w-3.5" />传统</button>
              <button
                className={cn('px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1', typeFilter === 'scene' ? 'bg-background shadow-sm font-medium text-purple-600' : 'text-muted-foreground hover:text-foreground')}
                onClick={() => setTypeFilter('scene')}
              ><Beaker className="h-3.5 w-3.5" />场景</button>
            </div>
          </div>
        </div>

        {/* 学习任务列表 */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学习任务</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>班级</TableHead>
                  <TableHead>教师</TableHead>
                  <TableHead>备课进度</TableHead>
                  <TableHead>备课状态</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const prepInfo = getPrepInfo(task.id)
                  const StatusIcon = prepInfo.icon
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {task.type === 'scene' ? <Beaker className="h-4 w-4 text-purple-600" /> : <BookOpen className="h-4 w-4 text-blue-600" />}
                          {task.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {task.type === 'scene' ? '场景' : '课程'}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.className}</TableCell>
                      <TableCell>{task.facultyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 w-[140px]">
                          <Progress value={prepInfo.progress} className="h-2 flex-1" />
                          <span className="text-xs w-10">{prepInfo.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge className={cn('text-xs', prepInfo.color)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {prepInfo.label}
                          </Badge>
                          {prepInfo.prepTask && prepInfo.status !== 'completed' && <MissingItemsBadge task={prepInfo.prepTask} />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            if (prepInfo.prepTask) {
                              router.push(`/admin/operations/preparation/${prepInfo.prepTask.id}`)
                            } else {
                              toast.info('该学习任务尚未开始备课')
                            }
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => {
                            if (prepInfo.prepTask) {
                              router.push(`/admin/operations/preparation/${prepInfo.prepTask.id}`)
                            } else {
                              toast.info('该学习任务尚未开始备课')
                            }
                          }}>
                            {prepInfo.status === 'completed' ? '查看' : '备课'}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      暂无学习任务
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

function MissingItemsBadge({ task }: { task: PreparationTask }) {
  const missing: string[] = []
  const s = task.stages

  if (!s.pre.objectives.some((o) => o.trim())) missing.push('缺教学目标')
  if (s.pre.resources.length === 0) missing.push('缺课前资源')
  if (s.in.activities.length === 0) missing.push('缺课堂活动')
  if (!s.post.homework.trim() && s.post.extensionResources.length === 0) missing.push('缺课后拓展')

  if (task.taskType === 'scene') {
    const sp = task.scenePrep
    if (!sp || sp.subTaskPreparations.length === 0) missing.push('缺子任务')
    else {
      if (sp.subTaskPreparations.some((sub) => !sub.safetyRequirements)) missing.push('缺安全要求')
    }
  } else {
    const cp = task.coursePrep
    if (!cp || cp.knowledgePointIds.length === 0) missing.push('缺知识点')
  }

  if (missing.length === 0) return null

  return (
    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
      <AlertCircle className="h-3 w-3 mr-1" />
      {missing.slice(0, 2).join('、')}{missing.length > 2 ? `等${missing.length}项` : ''}
    </Badge>
  )
}
