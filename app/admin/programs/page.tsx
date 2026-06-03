'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Pencil, Trash2, Eye, FileText, Users, UserPlus, ArrowRight, Copy, Upload, Sparkles, CalendarDays } from 'lucide-react'
import { usePrograms } from './_components/program-context'
import { useSyllabuses } from '@/components/providers/syllabus-provider'
import { useTeachingPlans } from '@/components/providers/teaching-plan-provider'
import { majors, departments, grades, curriculumCoursePool, curriculumPracticePool, tasks, classes, faculty, venues, allPeriods } from '@/lib/mock-data'
import type { TrainingProgram, CoursePlan } from '@/lib/mock-data'
import { toast } from 'sonner'

const emptyProgram: TrainingProgram = {
  id: '',
  name: '',
  code: '',
  majorId: '',
  entryYear: 2026,
  level: '本科',
  duration: 4,
  totalCredits: 0,
  requiredCredits: 0,
  electiveCredits: 0,
  practiceCredits: 0,
  courses: [],
  practiceScenes: [],
  startDate: '',
  endDate: '',
  creator: '',
  collaborators: [],
  createdAt: '',
}

function getDefaultCoursesForMajor(majorId: string): CoursePlan[] {
  // Return a basic set of default courses based on major
  // For now, use a simple mapping with courses from the pool
  const commonCourses: CoursePlan[] = [
    { id: `c-${Date.now()}-1`, name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
    { id: `c-${Date.now()}-2`, name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
    { id: `c-${Date.now()}-3`, name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
    { id: `c-${Date.now()}-4`, name: '企业认知实习', code: 'PRAC001', credits: 2, hours: 32, semester: 3, nature: '实践', assessment: '报告', version: 'v1.0' },
  ]
  return commonCourses
}

export default function ProgramsPage() {
  const router = useRouter()
  const { programs, deleteProgram, addProgram, updateProgram } = usePrograms()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // 邀请共建弹窗
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteProgram, setInviteProgram] = useState<TrainingProgram | null>(null)
  const [inviteName, setInviteName] = useState('')

  // 当前选中院系下的专业列表
  const deptMajors = useMemo(() => {
    if (selectedDeptId === 'all') return majors
    return majors.filter((m) => m.departmentId === selectedDeptId)
  }, [selectedDeptId])

  const selectedDeptName = selectedDeptId === 'all'
    ? '全部院系'
    : (departments.find((d) => d.id === selectedDeptId)?.name || '')

  // 所有不重复的入学年份
  const allYears = useMemo(() => {
    const years = Array.from(new Set(programs.map((p) => p.entryYear)))
    return years.sort((a, b) => b - a)
  }, [programs])

  // 过滤后的培养方案
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const major = majors.find((m) => m.id === p.majorId)
      if (selectedDeptId !== 'all' && major?.departmentId !== selectedDeptId) return false
      if (selectedYear !== 'all' && p.entryYear !== Number(selectedYear)) return false
      return true
    })
  }, [programs, selectedDeptId, selectedYear])

  const openCreate = () => {
    router.push('/admin/programs/new')
  }

  const openEdit = (program: TrainingProgram) => {
    router.push(`/admin/programs/${program.id}/edit`)
  }

  const handleDelete = (programId: string) => {
    deleteProgram(programId)
    toast.success('删除成功')
  }

  const { syllabuses, sceneSyllabuses, addSyllabus, addSceneSyllabus } = useSyllabuses()
  const { teachingPlans, addTeachingPlan } = useTeachingPlans()

  // 克隆弹窗
  const [cloneOpen, setCloneOpen] = useState(false)
  const [cloneProgram, setCloneProgram] = useState<TrainingProgram | null>(null)
  const [cloneSyllabus, setCloneSyllabus] = useState(false)
  const [clonePlan, setClonePlan] = useState(false)
  const [cloneSchedule, setCloneSchedule] = useState(false)

  const openClone = (program: TrainingProgram) => {
    setCloneProgram(program)
    setCloneSyllabus(false)
    setClonePlan(false)
    setCloneSchedule(false)
    setCloneOpen(true)
  }

  const confirmClone = () => {
    if (!cloneProgram) return
    const newId = `tp${Date.now()}`
    const cloned: TrainingProgram = {
      ...cloneProgram,
      id: newId,
      code: `${cloneProgram.code}-CLONE`,
      name: `${cloneProgram.name}（克隆）`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      creator: '当前用户',
      collaborators: [],
    }
    addProgram(cloned)

    let msg = '方案克隆成功'

    // 克隆教学大纲
    if (cloneSyllabus) {
      const allSyls = [...syllabuses, ...sceneSyllabuses].filter((s) => s.programId === cloneProgram.id)
      allSyls.forEach((syl) => {
        const newSyl = { ...syl, id: `syl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, programId: newId }
        if (syl.type === 'scene') {
          addSceneSyllabus(newSyl as any)
        } else {
          addSyllabus(newSyl as any)
        }
      })
      msg += `，课程与能力目标 ${allSyls.length} 份`
    }

    // 克隆教学计划
    if (clonePlan) {
      const plans = teachingPlans.filter((p) => p.programId === cloneProgram.id)
      plans.forEach((plan) => {
        const newPlan = {
          ...plan,
          id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          programId: newId,
          programName: cloned.name,
          entries: plan.entries.map((e) => ({ ...e, id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` })),
        }
        addTeachingPlan(newPlan)
      })
      msg += `，教学计划 ${plans.length} 份`
    }

    // 克隆排班排课（tasks）
    if (cloneSchedule) {
      const programClasses = classes.filter((c) => {
        const grade = grades.find((g) => g.id === c.gradeId)
        return c.majorId === cloneProgram.majorId && grade?.entryYear === cloneProgram.entryYear
      })
      const classIds = new Set(programClasses.map((c) => c.id))
      const relatedTasks = tasks.filter((t) => classIds.has(t.classId))
      relatedTasks.forEach((task) => {
        const newTask = {
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          name: `${task.name}（克隆）`,
        }
        tasks.push(newTask as any)
      })
      msg += `，排课任务 ${relatedTasks.length} 条`
    }

    toast.success(msg)
    setCloneOpen(false)
    setCloneProgram(null)
  }

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto pr-2 space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">人培方案管理</h1>
          <p className="text-muted-foreground text-sm">
            {selectedDeptName} · 共 {filteredPrograms.length} 个培养方案
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/programs/import')}>
            <Upload className="h-4 w-4 mr-2" />
            导入方案
          </Button>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />新建方案</Button>
        </div>
      </div>

      {/* 筛选栏 */}
      <Card className="py-0">
        <CardContent className="px-3 pb-3 pt-3 space-y-2">
          <div className="text-sm font-semibold">筛选条件</div>
          {/* 院系 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">院系</label>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={selectedDeptId === 'all' ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => { setSelectedDeptId('all'); setExpandedId(null) }}
              >全部</Badge>
              {departments.map((d) => (
                <Badge
                  key={d.id}
                  variant={selectedDeptId === d.id ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => { setSelectedDeptId(d.id); setExpandedId(null) }}
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
              {allYears.map((y) => (
                <Badge
                  key={y}
                  variant={selectedYear === String(y) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedYear(String(y))}
                >{y}级</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 培养方案卡片列表 */}
      <div className="space-y-4">
          {filteredPrograms.map((tp) => {
            const major = majors.find((m) => m.id === tp.majorId)
            return (
              <Card key={tp.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {tp.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        方案编码：{tp.code} · 适用专业：{major?.name} · {tp.entryYear}级入学
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const stepLabels = ['已生成大纲', '已生成计划', '已排班排课']
                        const stepColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700']
                        const hash = tp.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
                        const stepIdx = hash % 3
                        return (
                          <>
                            <Badge variant="outline" className={`text-xs ${stepColors[stepIdx]}`}>
                              执行步骤：{stepLabels[stepIdx]}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => router.push(`/admin/operations/syllabus?programId=${tp.id}`)}
                            >
                              <Sparkles className="h-3 w-3" /> 生成大纲
                            </Button>
                          </>
                        )
                      })()}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(tp)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openClone(tp)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setInviteProgram(tp); setInviteName(''); setInviteOpen(true) }}>
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(tp.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">课程总学分</p>
                      <p className="font-medium">{tp.totalCredits}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">课程必修学分</p>
                      <p className="font-medium">{tp.requiredCredits}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">课程选修学分</p>
                      <p className="font-medium">{tp.electiveCredits}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">实践场景学分</p>
                      <p className="font-medium">{tp.practiceScenes.reduce((s, c) => s + c.credits, 0)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>创建人：{tp.creator || '—'}</span>
                    </div>
                    {tp.collaborators && tp.collaborators.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>共建人：{tp.collaborators.join('、')}</span>
                      </div>
                    )}
                    <div>
                      <span>创建时间：{tp.createdAt || '—'}</span>
                    </div>
                    {tp.startDate && tp.endDate && (
                      <div>
                        <span>有效期：{tp.startDate} 至 {tp.endDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === tp.id ? null : tp.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedId === tp.id ? '收起课程计划' : '查看课程计划'}
                    </Button>
                  </div>

                  {expandedId === tp.id && (
                    <div className="space-y-4">
                      <Tabs defaultValue="courses">
                        <TabsList>
                          <TabsTrigger value="courses">课程计划</TabsTrigger>
                          <TabsTrigger value="practice">实践场景</TabsTrigger>
                          <TabsTrigger value="combined">综合课表</TabsTrigger>
                        </TabsList>

                        <TabsContent value="courses" className="space-y-4 mt-4">
                          {/* Existing course table + timetable */}
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>课程编码</TableHead>
                                  <TableHead>课程名称</TableHead>
                                  <TableHead>学分</TableHead>
                                  <TableHead>学时</TableHead>
                                  <TableHead>学期</TableHead>
                                  <TableHead>课程性质</TableHead>
                                  <TableHead>考核方式</TableHead>
                                  <TableHead>版本号</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tp.courses.map((c) => (
                                  <TableRow key={c.id}>
                                    <TableCell>{c.code}</TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{c.credits}</TableCell>
                                    <TableCell>{c.hours}</TableCell>
                                    <TableCell>第{c.semester}学期</TableCell>
                                    <TableCell><Badge variant="outline">{c.nature}</Badge></TableCell>
                                    <TableCell>{c.assessment}</TableCell>
                                    <TableCell>{c.version}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                        </TabsContent>

                        <TabsContent value="practice" className="space-y-4 mt-4">
                          {/* Practice scenes table + timetable */}
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>场景编码</TableHead>
                                  <TableHead>场景名称</TableHead>
                                  <TableHead>学分</TableHead>
                                  <TableHead>学时</TableHead>
                                  <TableHead>学期</TableHead>
                                  <TableHead>性质</TableHead>
                                  <TableHead>考核方式</TableHead>
                                  <TableHead>版本号</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tp.practiceScenes.map((c) => (
                                  <TableRow key={c.id}>
                                    <TableCell>{c.code}</TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{c.credits}</TableCell>
                                    <TableCell>{c.hours}</TableCell>
                                    <TableCell>第{c.semester}学期</TableCell>
                                    <TableCell><Badge variant="outline" className="border-orange-300 text-orange-600">{c.nature}</Badge></TableCell>
                                    <TableCell>{c.assessment}</TableCell>
                                    <TableCell>{c.version}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                        </TabsContent>

                        <TabsContent value="combined" className="space-y-4 mt-4">
                          <ProgramScheduleView program={tp} />
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {filteredPrograms.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                该院系下暂无培养方案
              </CardContent>
            </Card>
          )}
      </div>

      {/* 邀请共建弹窗 */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>邀请共建 — {inviteProgram?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>被邀请人姓名</Label>
              <Input
                placeholder="请输入被邀请人姓名"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>取消</Button>
            <Button onClick={() => {
              if (!inviteName.trim()) {
                toast.error('请输入被邀请人姓名')
                return
              }
              if (inviteProgram) {
                updateProgram({
                  ...inviteProgram,
                  collaborators: [...(inviteProgram.collaborators || []), inviteName.trim()],
                })
              }
              toast.success(`已成功邀请 ${inviteName.trim()} 共建该方案`)
              setInviteOpen(false)
            }}>确认邀请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 克隆方案弹窗 */}
      <Dialog open={cloneOpen} onOpenChange={setCloneOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>克隆方案 — {cloneProgram?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">请选择要一并克隆的关联数据：</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={cloneSyllabus} onCheckedChange={(v) => setCloneSyllabus(!!v)} />
                <div>
                  <div className="text-sm font-medium">课程与能力目标</div>
                  <div className="text-xs text-muted-foreground">复制该方案下所有课程/场景的课程与能力目标</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={clonePlan} onCheckedChange={(v) => setClonePlan(!!v)} />
                <div>
                  <div className="text-sm font-medium">教学计划</div>
                  <div className="text-xs text-muted-foreground">复制该方案下所有学期的教学计划</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={cloneSchedule} onCheckedChange={(v) => setCloneSchedule(!!v)} />
                <div>
                  <div className="text-sm font-medium">排班排课数据</div>
                  <div className="text-xs text-muted-foreground">复制该方案对应班级的排课任务</div>
                </div>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloneOpen(false)}>取消</Button>
            <Button onClick={confirmClone}>确认克隆</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProgramScheduleView({ program }: { program: TrainingProgram }) {
  const [exportType, setExportType] = useState<'class' | 'teacher' | 'venue'>('class')
  const [showVersion, setShowVersion] = useState(false)

  const exportTypes = [
    { id: 'class', label: '班级课表' },
    { id: 'teacher', label: '教师课表' },
    { id: 'venue', label: '场地课表' },
  ]
  const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const days = [1, 2, 3, 4, 5, 6, 7]
  const periods = allPeriods

  // 找到该培养方案对应的年级和班级
  const programGrade = grades.find((g) => g.entryYear === program.entryYear)
  const programClasses = classes.filter((c) => c.gradeId === programGrade?.id)
  const classIds = programClasses.map((c) => c.id)

  // 筛选相关任务
  const programTasks = tasks.filter((t) => classIds.includes(t.classId))

  const renderPeriodTable = (
    items: { id: string; name: string }[],
    getTasks: (id: string) => typeof programTasks,
    nameLabel: string
  ) => (
    <div className="border rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full border-collapse text-sm min-w-[600px]">
        <thead>
          <tr className="bg-muted">
            <th className="border p-3 text-left font-medium w-[140px]">{nameLabel}</th>
            <th className="border p-3 text-center font-medium w-[72px]">节次</th>
            {days.map((d) => (
              <th key={d} className="border p-3 text-center font-medium">
                {dayLabels[d - 1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const itemTasks = getTasks(item.id)
            return periods.map((period, idx) => (
              <tr key={`${item.id}-${period}`} className="border-t">
                {idx === 0 && (
                  <td
                    rowSpan={periods.length}
                    className="border p-3 font-medium align-middle text-center bg-muted/20"
                  >
                    {item.name}
                  </td>
                )}
                <td className="border p-2 text-center text-muted-foreground text-xs bg-muted/10">
                  {period}
                </td>
                {days.map((day) => {
                  const task = itemTasks.find(
                    (t) => t.dayOfWeek === day && t.periods.includes(period)
                  )
                  return (
                    <td key={day} className="border p-2 min-w-[120px] align-top">
                      {task ? (
                        <div
                          className={cn(
                            'text-xs rounded px-2 py-1 space-y-0.5',
                            task.type === 'scene'
                              ? 'bg-orange-50 border border-orange-100'
                              : 'bg-blue-50 border border-blue-100'
                          )}
                        >
                          <div className="font-medium truncate">{task.courseName}</div>
                          {showVersion && (
                            <div className="text-[10px] text-blue-600">{task.courseVersion}</div>
                          )}
                          <div className="text-muted-foreground">{task.facultyName}</div>
                          <div className="text-muted-foreground text-[10px]">
                            {task.venueName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/20 text-xs">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))
          })}
        </tbody>
      </table>
    </div>
  )

  // 班级课表
  const classItems = programClasses.map((c) => ({ id: c.id, name: c.name }))
  const classTable = renderPeriodTable(
    classItems,
    (id) => programTasks.filter((t) => t.classId === id),
    '班级名称'
  )

  // 教师课表
  const teacherIds = Array.from(new Set(programTasks.map((t) => t.facultyId)))
  const teacherItems = faculty
    .filter((f) => teacherIds.includes(f.id))
    .map((f) => ({ id: f.id, name: `${f.name} (${f.title})` }))
  const teacherTable = renderPeriodTable(
    teacherItems,
    (id) => programTasks.filter((t) => t.facultyId === id),
    '教师名称'
  )

  // 场地课表
  const venueIds = Array.from(new Set(programTasks.map((t) => t.venueId)))
  const venueItems = venues
    .filter((v) => venueIds.includes(v.id))
    .map((v) => ({ id: v.id, name: v.name }))
  const venueTable = renderPeriodTable(
    venueItems,
    (id) => programTasks.filter((t) => t.venueId === id),
    '场地名称'
  )

  const currentTable =
    {
      class: classTable,
      teacher: teacherTable,
      venue: venueTable,
    }[exportType] || classTable

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">课表类型：</span>
          {exportTypes.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={exportType === t.id ? 'default' : 'outline'}
              onClick={() => setExportType(t.id as typeof exportType)}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id={`show-version-${program.id}`}
            checked={showVersion}
            onCheckedChange={setShowVersion}
          />
          <Label htmlFor={`show-version-${program.id}`} className="text-sm font-medium cursor-pointer">
            显示版本号
          </Label>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {exportTypes.find((t) => t.id === exportType)?.label}预览
          </CardTitle>
        </CardHeader>
        <CardContent>{currentTable}</CardContent>
      </Card>
    </div>
  )
}

function ProgramTimetable({
  courses,
  title = '课表视图',
  cardClassName = '',
  showType = false,
}: {
  courses: CoursePlan[]
  title?: string
  cardClassName?: string
  showType?: boolean
}) {
  const semesterGroups = useMemo(() => {
    const groups: Record<number, CoursePlan[]> = {}
    courses.forEach(c => {
      if (!groups[c.semester]) groups[c.semester] = []
      groups[c.semester].push(c)
    })
    return groups
  }, [courses])

  if (courses.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 border rounded-lg">
        暂无课程
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="space-y-3">
        {Object.entries(semesterGroups)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([semester, semCourses]) => (
            <Card key={semester} className="mb-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">第{semester}学期</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {semCourses.map(c => (
                    <div key={c.id} className={`border rounded-lg p-3 space-y-1 ${cardClassName} ${showType ? (c.code.startsWith('PRAC') ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50') : ''}`}>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.code}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">{c.nature}</Badge>
                        <span className="text-muted-foreground">{c.credits}学分</span>
                      </div>
                      {showType && (
                        <Badge variant="secondary" className="text-[10px]">
                          {c.code.startsWith('PRAC') ? '实践场景' : '课程'}
                        </Badge>
                      )}
                      <div className="text-xs text-blue-600">版本: {c.version}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
