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
import { Plus, Pencil, Trash2, Eye, FileText, Building2, Users, UserPlus, ArrowRight, Copy } from 'lucide-react'
import { usePrograms } from './_components/program-context'
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

  const handleClone = (program: TrainingProgram) => {
    const cloned: TrainingProgram = {
      ...program,
      id: `tp${Date.now()}`,
      code: `${program.code}-CLONE`,
      name: `${program.name}（克隆）`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      creator: '当前用户',
      collaborators: [],
    }
    addProgram(cloned)
    toast.success('克隆成功')
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧院系导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">二级学院/院系</span>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedDeptId('all')
              setSelectedYear('all')
              setExpandedId(null)
            }}
            className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
              selectedDeptId === 'all'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            <span>全部院系</span>
            <span
              className={`text-xs ${
                selectedDeptId === 'all' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {programs.length}个方案
            </span>
          </button>
          {departments.map((d) => {
            const count = programs.filter((p) => {
              const major = majors.find((m) => m.id === p.majorId)
              return major?.departmentId === d.id
            }).length
            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDeptId(d.id)
                  setSelectedYear('all')
                  setExpandedId(null)
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                  selectedDeptId === d.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span>{d.name}</span>
                <span
                  className={`text-xs ${
                    selectedDeptId === d.id
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {count}个方案
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">人培方案管理</h1>
            <p className="text-muted-foreground text-sm">
              {selectedDeptName} · 共 {filteredPrograms.length} 个培养方案
            </p>
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />新建方案</Button>
        </div>

        {/* 年级筛选 */}
        <Tabs value={selectedYear} onValueChange={setSelectedYear}>
          <TabsList>
            <TabsTrigger value="all">全部年级</TabsTrigger>
            {allYears.map((y) => (
              <TabsTrigger key={y} value={String(y)}>{y}级</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
                        const programClasses = classes.filter((c) => {
                          const grade = grades.find((g) => g.id === c.gradeId)
                          return c.majorId === tp.majorId && grade?.entryYear === tp.entryYear
                        })
                        const hasScheduled = tasks.some((t) => programClasses.some((c) => c.id === t.classId))
                        return (
                          <>
                            <Badge variant={hasScheduled ? 'default' : 'secondary'} className="text-xs">
                              是否已排课：{hasScheduled ? '是' : '否'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => window.location.href = `/admin/operations/scheduling?programId=${tp.id}`}
                            >
                              前往排课 <ArrowRight className="h-3 w-3" />
                            </Button>
                          </>
                        )
                      })()}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(tp)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleClone(tp)}>
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
