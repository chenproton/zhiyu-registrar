'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  Trash2,
  BookOpen,
  Beaker,
  CheckCircle2,
  GraduationCap,
  Layers,
  Clock,
  Download,
  Send,
  UserPlus,
  Search,
  X,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  trainingPrograms,
  departments,
  grades,
  majors,
  faculty,
  type TrainingProgram,
  type CoursePlan,
  type PlanCourseEntry,
  type TeachingPlan,
} from '@/lib/mock-data'
import { useTeachingPlans } from '@/components/providers/teaching-plan-provider'

// ============================================
// 辅助：从培养方案生成教学计划
// ============================================
function buildPlanFromProgram(program: TrainingProgram): TeachingPlan {
  const allCourses: CoursePlan[] = []
  if (program.courses?.length) allCourses.push(...program.courses)
  if (program.practiceScenes?.length) allCourses.push(...program.practiceScenes)
  if (!allCourses.length && program.curriculum?.length) {
    allCourses.push(...program.curriculum)
  }

  const entries: PlanCourseEntry[] = []
  allCourses.forEach((course, idx) => {
    const isScene = course.courseType === '场景' || course.nature === '场景' || course.nature === '实践'
    const isPractice = course.nature === '实践' || isScene
    const baseVenue = isScene ? '校外基地' : isPractice ? '实训室' : '教室'

    if (isScene) {
      const sceneCount = 3 + ((course.code?.length ?? 0) % 3)
      const creditsPerScene = Math.round((course.credits / sceneCount) * 2) / 2
      const hoursPerScene = Math.max(1, Math.round(course.hours / sceneCount))

      for (let i = 0; i < sceneCount; i++) {
        const weekHours = Math.max(1, Math.ceil(hoursPerScene / 16))
        const endWeek = Math.min(16, Math.ceil(hoursPerScene / weekHours))
        entries.push({
          id: `pe-${program.id}-${idx}-${i}`,
          courseId: course.id,
          courseName: `${course.name}-相关实践场景名称${i + 1}`,
          courseCode: course.code,
          type: 'scene',
          nature: '场景' as PlanCourseEntry['nature'],
          credits: creditsPerScene,
          totalHours: hoursPerScene,
          semester: course.semester || 1,
          weekHours,
          startWeek: 1,
          endWeek,
          weekPattern: 'all',
          assignedClassIds: [],
          preferredFacultyIds: [],
          venueTypeRequired: baseVenue,
          syllabusId: `syl-placeholder-${course.id}`,
          status: 'planned',
        })
      }
    } else {
      const weekHours = Math.max(1, Math.ceil(course.hours / 16))
      const endWeek = Math.min(16, Math.ceil(course.hours / weekHours))
      entries.push({
        id: `pe-${program.id}-${idx}`,
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        type: isPractice ? 'practice' : 'theory',
        nature: course.nature as PlanCourseEntry['nature'],
        courseTypeLabel: course.courseTypeLabel || '',
        credits: course.credits,
        totalHours: course.hours,
        semester: course.semester || 1,
        weekHours,
        startWeek: 1,
        endWeek,
        weekPattern: 'all',
        assignedClassIds: [],
        preferredFacultyIds: [],
        venueTypeRequired: baseVenue,
        syllabusId: `syl-placeholder-${course.id}`,
        status: 'planned',
      })
    }
  })

  return {
    id: `plan-${program.id}`,
    programId: program.id,
    programName: program.name,
    majorId: program.majorId,
    entryYear: program.entryYear,
    totalSemesters: program.duration * 2,
    entries,
    status: 'draft',
    generatedAt: new Date().toISOString(),
  }
}

// 固定数据源：无论选什么专业，都使用同一个教学计划
const FIXED_PROGRAM = trainingPrograms.find((p) => p.id === 'tp1')!

// ============================================
// 内部页面组件
// ============================================
function PlanPage() {
  const searchParams = useSearchParams()
  const { teachingPlans, updateTeachingPlan } = useTeachingPlans()

  // ---- 选择器状态（默认：计算机科学与技术学院 / 2029级 / 软件工程 / 全部学期）----
  const [selectedDept, setSelectedDept] = useState<string>('d1')
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g2029')
  const [selectedMajorId, setSelectedMajorId] = useState<string>('m1')
  const [selectedSemester, setSelectedSemester] = useState<string>('1')

  // ---- 本地教学计划状态（固定数据）----
  const [localPlan, setLocalPlan] = useState<TeachingPlan | null>(null)
  const [planInitialized, setPlanInitialized] = useState(false)

  // ---- 添加课程弹窗状态 ----
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState<CoursePlan | null>(null)
  const [newEntryCredits, setNewEntryCredits] = useState<number>(0)
  const [newEntryHours, setNewEntryHours] = useState<number>(0)
  const [newEntrySemester, setNewEntrySemester] = useState<number>(1)

  // ---- 提交确认弹窗状态 ----
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

  // ---- 授课教师弹窗状态 ----
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false)
  const [selectedEntryForTeacher, setSelectedEntryForTeacher] = useState<string | null>(null)
  const [teacherFormType, setTeacherFormType] = useState<'校本师资' | '企业导师'>('校本师资')
  const [teacherFilterDeptId, setTeacherFilterDeptId] = useState<string | null>(null)
  const [teacherSearchText, setTeacherSearchText] = useState('')

  // ---- 从 URL 参数自动恢复院系/年级 ----
  useEffect(() => {
    const deptFromUrl = searchParams.get('dept')
    const gradeFromUrl = searchParams.get('grade')
    const majorFromUrl = searchParams.get('major')
    if (deptFromUrl) setSelectedDept(deptFromUrl)
    if (gradeFromUrl) setSelectedGradeId(gradeFromUrl)
    if (majorFromUrl) setSelectedMajorId(majorFromUrl)
  }, [searchParams])

  // ---- 初始化固定教学计划（只执行一次）----
  useEffect(() => {
    if (planInitialized) return
    // 始终从固定培养方案重新生成，确保与 mock-data 同步
    const freshPlan = buildPlanFromProgram(FIXED_PROGRAM)
    setLocalPlan(freshPlan)
    updateTeachingPlan(freshPlan)
    setPlanInitialized(true)
  }, [updateTeachingPlan, planInitialized])

  // ---- 联动计算 ----
  const matchedMajors = useMemo(() => {
    if (!selectedDept) return []
    return majors.filter((m) => m.departmentId === selectedDept)
  }, [selectedDept])

  const selectedMajor = useMemo(
    () => majors.find((m) => m.id === selectedMajorId) || null,
    [selectedMajorId]
  )

  // 根据选择匹配人培方案
  const matchedProgram = useMemo(() => {
    if (!selectedMajorId || !selectedGradeId) return null
    const gradeData = grades.find((g) => g.id === selectedGradeId)
    if (!gradeData) return null
    const exact = trainingPrograms.find(
      (tp) => tp.majorId === selectedMajorId && tp.entryYear === gradeData.entryYear
    )
    if (exact) return exact
    return trainingPrograms.find((tp) => tp.majorId === selectedMajorId) || null
  }, [selectedMajorId, selectedGradeId])

  const semesterOptions = useMemo(
    () => Array.from({ length: FIXED_PROGRAM.duration * 2 }, (_, i) => i + 1),
    []
  )

  // ---- 按学期筛选 entries ----
  const displayedEntries = useMemo(() => {
    if (!localPlan) return []
    if (selectedSemester === 'all') return localPlan.entries
    const sem = parseInt(selectedSemester)
    return localPlan.entries.filter((e) => e.semester === sem)
  }, [localPlan, selectedSemester])

  // ---- 统计 ----
  const stats = useMemo(() => {
    if (!localPlan) return { total: 0, credits: 0, hours: 0 }
    const total = displayedEntries.length
    const credits = displayedEntries.reduce((s, e) => s + (e.credits || 0), 0)
    const hours = displayedEntries.reduce((s, e) => s + (e.totalHours || 0), 0)
    return { total, credits, hours }
  }, [displayedEntries])

  // ---- 学期内学时统计 ----
  const semesterHoursStats = useMemo(() => {
    if (!localPlan || selectedSemester === 'all')
      return { sceneHours: 0, courseHours: 0 }
    let sceneHours = 0
    let courseHours = 0
    displayedEntries.forEach((e) => {
      if (e.type === 'scene') sceneHours += e.totalHours || 0
      else courseHours += e.totalHours || 0
    })
    return { sceneHours, courseHours }
  }, [displayedEntries, localPlan, selectedSemester])

  // ---- 学时统计 ----
  const programHoursStats = useMemo(() => {
    const allCourses: CoursePlan[] = []
    if (FIXED_PROGRAM.courses?.length) allCourses.push(...FIXED_PROGRAM.courses)
    if (FIXED_PROGRAM.practiceScenes?.length) allCourses.push(...FIXED_PROGRAM.practiceScenes)
    if (!allCourses.length && FIXED_PROGRAM.curriculum?.length) allCourses.push(...FIXED_PROGRAM.curriculum)

    let sceneHours = 0
    let courseHours = 0
    allCourses.forEach((c) => {
      const isScene = c.courseType === '场景' || c.nature === '场景' || c.nature === '实践'
      if (isScene) sceneHours += c.hours || 0
      else courseHours += c.hours || 0
    })
    return { sceneHours, courseHours }
  }, [])

  const actualHoursStats = useMemo(() => {
    if (!localPlan) return { sceneHours: 0, courseHours: 0 }
    let sceneHours = 0
    let courseHours = 0
    localPlan.entries.forEach((e) => {
      if (e.type === 'scene') sceneHours += e.totalHours || 0
      else courseHours += e.totalHours || 0
    })
    return { sceneHours, courseHours }
  }, [localPlan])

  // ---- 筛选教师/导师列表（按类型 + 院系 + 搜索）----
  const filteredFacultyForDialog = useMemo(() => {
    let list = teacherFormType === '校本师资'
      ? faculty
      : []
    if (teacherSearchText.trim()) {
      const term = teacherSearchText.trim().toLowerCase()
      list = list.filter(f =>
        f.name.toLowerCase().includes(term) ||
        f.employeeId.toLowerCase().includes(term) ||
        (f.positions || []).some(q => q.toLowerCase().includes(term))
      )
    }
    return list
  }, [teacherFormType, teacherFilterDeptId, teacherSearchText])

  // ---- 教师操作 ----
  const openTeacherDialog = (entryId: string) => {
    const entry = localPlan?.entries.find(e => e.id === entryId)
    setSelectedEntryForTeacher(entryId)
    setTeacherFormType(entry?.teacherType || '校本师资')
    setTeacherFilterDeptId(null)
    setTeacherSearchText('')
    setTeacherDialogOpen(true)
  }

  const handleSelectTeacher = (facultyId: string) => {
    if (!localPlan || !selectedEntryForTeacher) return
    const selectedFaculty = faculty.find(f => f.id === facultyId)
    if (!selectedFaculty) return
    updateEntry(selectedEntryForTeacher, {
      teacherId: facultyId,
      teacherName: selectedFaculty.name,
      teacherType: teacherFormType,
    })
    setTeacherDialogOpen(false)
    toast.success(`已指定授课教师：${selectedFaculty.name}`)
  }

  const handleClearTeacher = () => {
    if (!localPlan || !selectedEntryForTeacher) return
    updateEntry(selectedEntryForTeacher, {
      teacherId: undefined,
      teacherName: undefined,
      teacherType: undefined,
    })
    setTeacherDialogOpen(false)
    toast.success('已清除授课教师')
  }

  const handleTeacherTypeChange = (value: '校本师资' | '企业导师') => {
    setTeacherFormType(value)
    setTeacherFilterDeptId(null)
    setTeacherSearchText('')
  }

  // ---- 操作函数 ----
  const commitPlanUpdate = (nextPlan: TeachingPlan) => {
    setLocalPlan(nextPlan)
    updateTeachingPlan(nextPlan)
  }

  const updateEntry = (entryId: string, updates: Partial<PlanCourseEntry>) => {
    if (!localPlan) return
    const nextEntries = localPlan.entries.map((e) =>
      e.id === entryId ? { ...e, ...updates } : e
    )
    commitPlanUpdate({ ...localPlan, entries: nextEntries })
  }

  const removeEntry = (entryId: string) => {
    if (!localPlan) return
    const nextEntries = localPlan.entries.filter((e) => e.id !== entryId)
    commitPlanUpdate({ ...localPlan, entries: nextEntries })
    toast.success('已从教学计划中移除')
  }

  // ---- 添加课程（固定从 tp1 的课程池）----
  const availableCourses = useMemo(() => {
    if (!localPlan) return []
    const allCourses: CoursePlan[] = []
    if (FIXED_PROGRAM.courses?.length) allCourses.push(...FIXED_PROGRAM.courses)
    if (FIXED_PROGRAM.practiceScenes?.length)
      allCourses.push(...FIXED_PROGRAM.practiceScenes)
    if (!allCourses.length && FIXED_PROGRAM.curriculum?.length) {
      allCourses.push(...FIXED_PROGRAM.curriculum)
    }
    const existingIds = new Set(localPlan.entries.map((e) => e.courseId))
    return allCourses.filter((c) => !existingIds.has(c.id))
  }, [localPlan])

  const openAddDialog = () => {
    if (availableCourses.length === 0) {
      toast.info('人培方案中所有课程/岗位已加入教学计划')
      return
    }
    const first = availableCourses[0]
    setSelectedCourseToAdd(first)
    setNewEntryCredits(first.credits)
    setNewEntryHours(first.hours)
    setNewEntrySemester(first.semester || 1)
    setAddDialogOpen(true)
  }

  const handleCourseSelect = (courseId: string) => {
    const course = availableCourses.find((c) => c.id === courseId)
    if (!course) return
    setSelectedCourseToAdd(course)
    setNewEntryCredits(course.credits)
    setNewEntryHours(course.hours)
    setNewEntrySemester(course.semester || 1)
  }

  const confirmAdd = () => {
    if (!selectedCourseToAdd || !localPlan) return
    const course = selectedCourseToAdd
    const isScene = course.courseType === '场景' || course.nature === '场景'
    const isPractice = course.nature === '实践' || isScene
    const baseVenue = isScene ? '校外基地' : isPractice ? '实训室' : '教室'

    if (isScene) {
      const sceneCount = 3 + ((course.code?.length ?? 0) % 3)
      const creditsPerScene = Math.round((newEntryCredits / sceneCount) * 2) / 2
      const hoursPerScene = Math.max(1, Math.round(newEntryHours / sceneCount))
      const now = Date.now()
      const newEntries: PlanCourseEntry[] = Array.from({ length: sceneCount }, (_, i) => {
        const weekHours = Math.max(1, Math.ceil(hoursPerScene / 16))
        const endWeek = Math.min(16, Math.ceil(hoursPerScene / weekHours))
        return {
          id: `pe-fixed-${now}-${i}`,
          courseId: course.id,
          courseName: `${course.name}-相关实践场景名称${i + 1}`,
          courseCode: course.code,
          type: 'scene',
          nature: '场景' as PlanCourseEntry['nature'],
          credits: creditsPerScene,
          totalHours: hoursPerScene,
          semester: newEntrySemester,
          weekHours,
          startWeek: 1,
          endWeek,
          weekPattern: 'all',
          assignedClassIds: [],
          preferredFacultyIds: [],
          venueTypeRequired: baseVenue,
          syllabusId: `syl-placeholder-${course.id}`,
          status: 'planned',
        }
      })
      commitPlanUpdate({ ...localPlan, entries: [...localPlan.entries, ...newEntries] })
    } else {
      const weekHours = Math.max(1, Math.ceil(newEntryHours / 16))
      const endWeek = Math.min(16, Math.ceil(newEntryHours / weekHours))
      const newEntry: PlanCourseEntry = {
        id: `pe-fixed-${Date.now()}`,
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        type: isPractice ? 'practice' : 'theory',
        nature: course.nature as PlanCourseEntry['nature'],
        credits: newEntryCredits,
        totalHours: newEntryHours,
        semester: newEntrySemester,
        weekHours,
        startWeek: 1,
        endWeek,
        weekPattern: 'all',
        assignedClassIds: [],
        preferredFacultyIds: [],
        venueTypeRequired: baseVenue,
        syllabusId: `syl-placeholder-${course.id}`,
        status: 'planned',
      }
      commitPlanUpdate({ ...localPlan, entries: [...localPlan.entries, newEntry] })
    }

    setAddDialogOpen(false)
    toast.success(`已添加「${course.name}」到教学计划`)
  }

  // ---- 导出教学计划为 CSV ----
  const exportToCSV = () => {
    if (!localPlan) return
    const headers = ['课程/岗位名称', '课程代码', '类型', '性质', '学分', '总学时', '学期']
    const rows = localPlan.entries.map((e) => [
      e.courseName,
      e.courseCode,
      e.type === 'scene' ? '岗位' : e.type === 'practice' ? '实践' : '理论',
      e.nature === '场景' ? '岗位' : e.nature,
      String(e.credits),
      String(e.totalHours),
      `第${e.semester}学期`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const deptName = departments.find((d) => d.id === selectedDept)?.name || '院系'
    const gradeName = grades.find((g) => g.id === selectedGradeId)?.name || '年级'
    const majorName = selectedMajor?.name || '专业'
    link.download = `教学计划清单_${deptName}_${gradeName}_${majorName}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('教学计划清单已导出')
  }

  // ---- 提交教务确认 ----
  const handleSubmitConfirm = () => {
    setSubmitDialogOpen(false)
    toast.success('已将当前二级学院的教学计划提交教务办公室进行整体评估')
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div>
        <h1 className="text-2xl font-bold">教学计划管理</h1>
        <p className="text-muted-foreground text-sm mt-1">
          基于人培方案灵活配置课程/岗位的学分、学时与学期安排
        </p>
      </div>

      {/* 四级联动选择器：院系 + 年级 + 专业 + 学期 */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-1">
              <Label className="text-xs">选择院系</Label>
              <Select
                value={selectedDept}
                onValueChange={(v) => {
                  setSelectedDept(v)
                  setSelectedGradeId('')
                  setSelectedMajorId('')
                  setSelectedSemester('all')
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="请选择院系" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">选择年级</Label>
              <Select
                value={selectedGradeId}
                onValueChange={(v) => {
                  setSelectedGradeId(v)
                  setSelectedMajorId('')
                  setSelectedSemester('all')
                }}
                disabled={!selectedDept}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={selectedDept ? '请选择年级' : '先选院系'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">选择专业</Label>
              <Select
                value={selectedMajorId}
                onValueChange={(v) => {
                  setSelectedMajorId(v)
                  setSelectedSemester('all')
                }}
                disabled={!selectedGradeId || matchedMajors.length === 0}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue
                    placeholder={
                      !selectedGradeId
                        ? '先选年级'
                        : matchedMajors.length === 0
                          ? '无可用专业'
                          : '请选择专业'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {matchedMajors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">人培方案</Label>
              <div className="h-10 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm w-[280px]">
                {matchedProgram ? matchedProgram.name : '请先选择专业'}
              </div>
            </div>


          </div>
        </CardContent>
      </Card>

      {/* 主内容区 */}
      {localPlan && selectedMajorId ? (
        <div className="space-y-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* 标题 */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold whitespace-nowrap">
                  {selectedMajor?.name || '教学计划'}
                </h2>
                <span className="text-muted-foreground text-sm">
                  {selectedDept && departments.find((d) => d.id === selectedDept)?.name}
                  {' · '}
                  {selectedGradeId && grades.find((g) => g.id === selectedGradeId)?.name}
                </span>
              </div>

              {/* 学时指标 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card shadow-sm">
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-muted-foreground">人培总学时</span>
                    <span className="text-sm font-bold tabular-nums">
                      {programHoursStats.sceneHours + programHoursStats.courseHours}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground border-l pl-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      岗位 {programHoursStats.sceneHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      课程 {programHoursStats.courseHours}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card shadow-sm">
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-muted-foreground">实际总学时</span>
                    <span className="text-sm font-bold tabular-nums">
                      {actualHoursStats.sceneHours + actualHoursStats.courseHours}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground border-l pl-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      岗位 {actualHoursStats.sceneHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      课程 {actualHoursStats.courseHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={openAddDialog}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                从人培方案导入
              </Button>
              <Button size="sm" onClick={() => setSubmitDialogOpen(true)}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                提交教务
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                导出教学计划
              </Button>
            </div>
          </div>

          {/* 教学计划表格 */}
          <Card>
            <CardContent className="p-0">
              {/* 学期切换 Tabs */}
              <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-4">
                <Tabs value={selectedSemester} onValueChange={setSelectedSemester}>
                  <TabsList className="h-8">
                    {semesterOptions.map((s) => (
                      <TabsTrigger key={s} value={String(s)} className="text-xs px-3">
                        第{s}学期
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {selectedSemester !== 'all' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card shadow-sm border-l-4 border-l-emerald-400">
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] text-muted-foreground">
                        第{selectedSemester}学期学时
                      </span>
                      <span className="text-sm font-bold tabular-nums">
                        {semesterHoursStats.sceneHours + semesterHoursStats.courseHours}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground border-l pl-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        岗位 {semesterHoursStats.sceneHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        课程 {semesterHoursStats.courseHours}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-lg border mt-4 mx-4 mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>课程/岗位</TableHead>
                      <TableHead>代码</TableHead>
                      <TableHead>课程类型</TableHead>
                      <TableHead className="w-[100px]">学分</TableHead>
                      <TableHead className="w-[100px]">总学时</TableHead>
                      <TableHead className="w-[120px]">学期</TableHead>
                      <TableHead className="w-[120px]">授课教师</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedEntries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground py-8"
                        >
                          该学期暂无教学计划条目
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedEntries.map((entry) => (
                        <TableRow
                          key={entry.id}
                          className={
                            entry.type === 'scene' ? 'bg-purple-50/50' : undefined
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {entry.type === 'scene' && (
                                <Beaker className="h-4 w-4 text-purple-600" />
                              )}
                              {entry.courseName}
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] h-4 px-1',
                                  entry.type === 'scene'
                                    ? 'text-purple-600 border-purple-300'
                                    : 'text-blue-600 border-blue-300'
                                )}
                              >
                                {entry.type === 'scene' ? '岗位' : '课程'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {entry.courseCode}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {entry.type === 'scene' ? '' : (entry.courseTypeLabel || '')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.5}
                              value={entry.credits}
                              onChange={(e) =>
                                updateEntry(entry.id, {
                                  credits: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="h-8 w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              value={entry.totalHours}
                              onChange={(e) =>
                                updateEntry(entry.id, {
                                  totalHours: parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-8 w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(entry.semester)}
                              onValueChange={(v) =>
                                updateEntry(entry.id, {
                                  semester: parseInt(v),
                                })
                              }
                            >
                              <SelectTrigger className="h-8 w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {semesterOptions.map((s) => (
                                  <SelectItem key={s} value={String(s)}>
                                    第{s}学期
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-muted-foreground hover:text-foreground justify-start px-2 font-normal"
                              onClick={() => openTeacherDialog(entry.id)}
                            >
                              {entry.teacherName ? (
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  {entry.teacherName}
                                  <Badge variant="outline" className="text-[10px] h-4 px-1 ml-1">
                                    {entry.teacherType === '企业导师' ? '企业' : '校本'}
                                  </Badge>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <UserPlus className="h-3 w-3" />
                                  设置教师
                                </span>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12 mb-3 opacity-30" />
          <p>请先选择院系、年级、专业和学期</p>
        </div>
      )}

      {/* 添加课程弹窗 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>添加课程/岗位到教学计划</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择课程/岗位</Label>
              <Select
                value={selectedCourseToAdd?.id || ''}
                onValueChange={handleCourseSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code}) — {c.credits}学分/{c.hours}学时
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCourseToAdd && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>学分</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={newEntryCredits}
                    onChange={(e) =>
                      setNewEntryCredits(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>学时</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newEntryHours}
                    onChange={(e) =>
                      setNewEntryHours(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>学期</Label>
                  <Select
                    value={String(newEntrySemester)}
                    onValueChange={(v) => setNewEntrySemester(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          第{s}学期
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmAdd} disabled={!selectedCourseToAdd}>
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 提交教务确认弹窗 */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>提交教务</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            <p className="mb-2">
              您即将提交当前二级学院的教学计划至教务办公室进行整体评估。
            </p>
            <p>
              提交后，教学计划将进入审核流程，暂时无法继续编辑。请确认所有课程/岗位的学分、学时和学期安排均已核对无误。
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitConfirm}>
              <Send className="mr-2 h-4 w-4" />
              确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 授课教师设置弹窗 */}
      <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>设置授课教师</DialogTitle>
          </DialogHeader>

          {/* 教师类型 Tabs */}
          <Tabs value={teacherFormType} onValueChange={(v) => handleTeacherTypeChange(v as '校本师资' | '企业导师')}>
            <TabsList className="h-8 w-full max-w-xs">
              <TabsTrigger value="校本师资" className="text-xs flex-1">校本师资</TabsTrigger>
              <TabsTrigger value="企业导师" className="text-xs flex-1">企业导师</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4 items-start mt-3">
            {/* 左侧院系列表 */}
            <div className="w-44 shrink-0 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <Building2 className="h-3.5 w-3.5" />
                所属院系
              </div>
              <button
                onClick={() => setTeacherFilterDeptId(null)}
                className={cn(
                  'w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors',
                  teacherFilterDeptId === null
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                全部院系
              </button>
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setTeacherFilterDeptId(dept.id)}
                  className={cn(
                    'w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors truncate',
                    teacherFilterDeptId === dept.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {dept.name}
                </button>
              ))}
            </div>

            {/* 右侧搜索 + 教师列表 */}
            <div className="flex-1 space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={teacherFormType === '校本师资' ? '搜索教师姓名、工号、资质...' : '搜索企业导师姓名、公司、职位...'}
                  value={teacherSearchText}
                  onChange={(e) => setTeacherSearchText(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>

              <ScrollArea className="h-[280px] rounded-md border">
                {filteredFacultyForDialog.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    未找到匹配的{teacherFormType === '校本师资' ? '教师' : '企业导师'}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredFacultyForDialog.map((f) => {
                      const currentEntry = localPlan?.entries.find(e => e.id === selectedEntryForTeacher)
                      const isCurrent = currentEntry?.teacherId === f.id
                      return (
                        <button
                          key={f.id}
                          onClick={() => handleSelectTeacher(f.id)}
                          className={cn(
                            'w-full text-left px-3 py-2.5 transition-colors hover:bg-muted group',
                            isCurrent && 'bg-primary/5 border-l-2 border-l-primary'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={cn(
                                'text-sm font-medium truncate',
                                isCurrent && 'text-primary'
                              )}>
                                {f.name}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">{f.employeeId}</span>
                              {false && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 shrink-0">企业</Badge>
                              )}
                              {isCurrent && (
                                <span className="text-[10px] text-primary shrink-0">当前选择</span>
                              )}
                            </div>
                          </div>
                          {false && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {'—'}
                            </div>
                          )}
                          {f.positions && f.positions.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {f.positions.join('、')}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {(() => {
              const currentEntry = localPlan?.entries.find(e => e.id === selectedEntryForTeacher)
              return currentEntry?.teacherName ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleClearTeacher}
                >
                  <X className="h-3 w-3 mr-1" />
                  清除当前教师
                </Button>
              ) : <span />
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================
// 导出：包裹 Suspense
// ============================================
export default function TeachingPlansPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">加载中...</div>
      }
    >
      <PlanPage />
    </Suspense>
  )
}
