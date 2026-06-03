'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  BookOpen,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Edit3,
  Eye,
  Layers,
  GraduationCap,
  Beaker,
  Wrench,
  List,
  CalendarDays,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  trainingPrograms,
  departments,
  majors,
  grades,
  type TrainingProgram,
  type Syllabus,
  type SceneSyllabus,
  type CoursePlan,
} from '@/lib/mock-data'
import { useSyllabuses } from '@/components/providers/syllabus-provider'

// ============================================
// 状态样式
// ============================================
const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: '草稿', color: 'bg-slate-100 text-slate-700', icon: FileText },
  generated: { label: '已生成', color: 'bg-blue-100 text-blue-700', icon: Sparkles },
  editing: { label: '编辑中', color: 'bg-amber-100 text-amber-700', icon: Edit3 },
  finalized: { label: '已定稿', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
}

const typeMap: Record<string, { label: string; icon: any; color: string }> = {
  theory: { label: '理论课', icon: BookOpen, color: 'text-blue-600' },
  practice: { label: '实践课', icon: Wrench, color: 'text-amber-600' },
  scene: { label: '场景课', icon: Beaker, color: 'text-purple-600' },
}

// ============================================
// Mock生成日志
// ============================================
const generateLogs = [
  '分析课程性质与模板匹配...',
  '匹配到「理论课」模板',
  '根据64学时自动拆分为7个章节...',
  '生成教学目标（知识/能力/素养三维度）...',
  '生成考核方式与权重...',
  '关联推荐教材...',
  '大纲生成完成',
]

// 获取培养方案下所有课程（优先 curriculum，回退 courses/practiceScenes）
function getProgramAllCourses(program: TrainingProgram) {
  if (program.curriculum) {
    const { publicBasic, professional } = program.curriculum
    return [
      ...publicBasic.required,
      ...publicBasic.limitedElective,
      ...publicBasic.freeElective,
      ...professional.basic,
      ...professional.core,
      ...professional.extended,
      ...professional.practice,
    ]
  }
  return [...program.courses, ...program.practiceScenes]
}

// 获取课程分类：优先从 curriculum 查找，否则基于 courseId 哈希随机分配
function getCourseCategory(program: TrainingProgram | undefined, courseId: string) {
  if (program?.curriculum) {
    const { publicBasic, professional } = program.curriculum
    if (publicBasic.required.some((c) => c.id === courseId)) return { level1: 'public', level2: 'required' }
    if (publicBasic.limitedElective.some((c) => c.id === courseId)) return { level1: 'public', level2: 'elective' }
    if (publicBasic.freeElective.some((c) => c.id === courseId)) return { level1: 'public', level2: 'elective' }
    if (professional.basic.some((c) => c.id === courseId)) return { level1: 'professional', level2: 'required' }
    if (professional.core.some((c) => c.id === courseId)) return { level1: 'professional', level2: 'required' }
    if (professional.extended.some((c) => c.id === courseId)) return { level1: 'professional', level2: 'elective' }
    if (professional.practice.some((c) => c.id === courseId)) return { level1: 'professional', level2: 'required' }
  }
  const hash = courseId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const level1 = hash % 2 === 0 ? 'public' : 'professional'
  const level2 = hash % 3 === 0 ? 'elective' : 'required'
  return { level1, level2 }
}

function SyllabusPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { syllabuses, sceneSyllabuses, generateSyllabusesFromProgram } = useSyllabuses()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')

  // 二级筛选
  const [filterCategory, setFilterCategory] = useState<'all' | 'public' | 'professional'>('all')
  const [filterNature, setFilterNature] = useState<'all' | 'required' | 'elective'>('all')

  // 生成弹窗
  const [generateOpen, setGenerateOpen] = useState(false)
  const [generatingProgram, setGeneratingProgram] = useState<TrainingProgram | null>(null)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generateLogsVisible, setGenerateLogsVisible] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // 从 URL 参数自动选中培养方案
  useEffect(() => {
    const programIdFromUrl = searchParams.get('programId')
    if (programIdFromUrl) {
      const program = trainingPrograms.find((p) => p.id === programIdFromUrl)
      if (program) {
        const major = majors.find((m) => m.id === program.majorId)
        if (major) {
          setSelectedDeptId(major.departmentId)
        }
        setSelectedYear(String(program.entryYear))
        setSelectedProgramId(programIdFromUrl)
      }
    }
  }, [searchParams])

  // 筛选逻辑
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

  // 合并所有大纲（普通+场景）
  const allSyllabuses = useMemo(() => {
    const plain: (Syllabus | SceneSyllabus)[] = [...syllabuses]
    const scenes: (Syllabus | SceneSyllabus)[] = [...sceneSyllabuses]
    return [...plain, ...scenes]
  }, [syllabuses, sceneSyllabuses])

  // 当前方案下的所有课程
  const programAllCourses = useMemo(() => {
    if (!currentProgram) return []
    return getProgramAllCourses(currentProgram)
  }, [currentProgram])

  // 当前方案下的大纲
  const programSyllabuses = useMemo(() => {
    if (!currentProgram) return []
    const courseIds = programAllCourses.map((c) => c.id)
    return allSyllabuses.filter((s) => courseIds.includes(s.courseId) || s.programId === currentProgram.id)
  }, [currentProgram, programAllCourses, allSyllabuses])

  // 未生成大纲的课程
  const ungeneratedCourses = useMemo(() => {
    if (!currentProgram) return []
    const existingIds = new Set(programSyllabuses.map((s) => s.courseId))
    return programAllCourses
      .filter((c) => !existingIds.has(c.id))
      .map((c) => ({ ...c, type: (c.nature === '实践' || c.nature === '场景' ? 'scene' : 'theory') as 'theory' | 'scene' }))
  }, [currentProgram, programAllCourses, programSyllabuses])

  // 统计
  const stats = useMemo(() => {
    const total = currentProgram ? programAllCourses.length : allSyllabuses.length
    const generated = programSyllabuses.length || allSyllabuses.filter((s) => s.status !== 'draft').length
    const finalized = programSyllabuses.filter((s) => s.status === 'finalized').length || allSyllabuses.filter((s) => s.status === 'finalized').length
    return { total, generated, finalized, pending: total - generated }
  }, [currentProgram, programAllCourses, programSyllabuses, allSyllabuses])

  // 基于二级筛选过滤后的大纲和未生成课程
  const filteredSyllabuses = useMemo(() => {
    const source = currentProgram ? programSyllabuses : allSyllabuses
    return source.filter((syl) => {
      const program = trainingPrograms.find((p) => p.id === syl.programId)
      const cat = getCourseCategory(program, syl.courseId)
      if (filterCategory !== 'all' && cat.level1 !== filterCategory) return false
      if (filterNature !== 'all' && cat.level2 !== filterNature) return false
      return true
    })
  }, [currentProgram, programSyllabuses, allSyllabuses, filterCategory, filterNature])

  const filteredUngenerated = useMemo(() => {
    if (!currentProgram) return []
    return ungeneratedCourses.filter((course) => {
      const cat = getCourseCategory(currentProgram, course.id)
      if (filterCategory !== 'all' && cat.level1 !== filterCategory) return false
      if (filterNature !== 'all' && cat.level2 !== filterNature) return false
      return true
    })
  }, [currentProgram, ungeneratedCourses, filterCategory, filterNature])

  // 打开生成弹窗
  const openGenerate = (program: TrainingProgram) => {
    setGeneratingProgram(program)
    setSelectedCourses([])
    setGenerateProgress(0)
    setGenerateLogsVisible([])
    setGenerateOpen(true)
  }

  // 真实生成：从培养方案构造大纲并写入 provider
  const startGenerate = () => {
    if (selectedCourses.length === 0) {
      toast.error('请至少选择一门课程')
      return
    }
    if (!generatingProgram) return

    setIsGenerating(true)
    setGenerateProgress(0)
    let progress = 0
    let logIdx = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 100) progress = 100
      setGenerateProgress(Math.min(progress, 100))
      if (logIdx < generateLogs.length && Math.random() > 0.4) {
        setGenerateLogsVisible((prev) => [...prev, generateLogs[logIdx]])
        logIdx++
      }
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          const result = generateSyllabusesFromProgram(generatingProgram, selectedCourses)
          setIsGenerating(false)
          setGenerateOpen(false)
          setSelectedCourses([])
          if (result.added > 0) {
            toast.success(`成功生成 ${result.added} 份课程与能力目标！${result.skipped > 0 ? `（跳过 ${result.skipped} 门已存在）` : ''}`)
          } else {
            toast.info('所选课程大纲已存在，未生成新内容')
          }
        }, 500)
      }
    }, 250)
  }

  // 渲染单个大纲卡片
  const renderSyllabusCard = (syl: Syllabus | SceneSyllabus) => {
    const typeInfo = typeMap[syl.type]
    const statusInfo = statusMap[syl.status]
    const TypeIcon = typeInfo.icon
    const StatusIcon = statusInfo.icon
    const isScene = syl.type === 'scene'
    return (
      <Card key={syl.id} className="hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-muted', typeInfo.color)}>
                <TypeIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{syl.courseName}</h3>
                  <Badge className={cn('text-xs', statusInfo.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                  {isScene && (
                    <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                      场景课
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  代码：{syl.courseCode} · {syl.credits}学分 · {syl.totalHours}学时
                  {isScene && ` · 岗位：${(syl as SceneSyllabus).mappedPositionName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/operations/syllabus/${syl.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                查看
              </Button>
              <Button
                size="sm"
                onClick={() => router.push(`/admin/operations/syllabus/${syl.id}?edit=1`)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                编辑
              </Button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-4 text-xs text-muted-foreground border-t pt-3">
            <div>
              <span className="text-foreground font-medium">{syl.chapters.length}</span> 个章节
            </div>
            <div>
              <span className="text-foreground font-medium">{syl.objectives.length}</span> 个教学目标
            </div>
            <div>
              <span className="text-foreground font-medium">{syl.theoryHours}</span> 理论 /
              <span className="text-foreground font-medium">{syl.practiceHours}</span> 实践
            </div>
            <div>版本：{syl.version}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 渲染未生成课程卡片
  const renderUngeneratedCard = (course: CoursePlan & { type?: string }) => {
    const courseType = course.type || (course.nature === '实践' || course.nature === '场景' ? 'scene' : 'theory')
    const typeInfo = typeMap[courseType] || typeMap.theory
    const TypeIcon = typeInfo.icon
    return (
      <Card key={course.id} className="border-dashed opacity-70">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-muted', typeInfo.color)}>
                <TypeIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{course.name}</h3>
                  <Badge variant="outline" className="text-xs text-slate-500">未生成</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  代码：{course.code} · {course.credits}学分 · {course.hours}学时 · 第{course.semester}学期
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentProgram && openGenerate(currentProgram)}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              生成大纲
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 渲染分类区域
  const renderCategory = (
    title: string,
    data: { syllabuses: (Syllabus | SceneSyllabus)[]; ungenerated: CoursePlan[] },
    color: string
  ) => {
    const total = data.syllabuses.length + data.ungenerated.length
    if (total === 0) return null
    return (
      <div className="space-y-2">
        <h4 className={cn('text-sm font-medium flex items-center gap-1', color)}>
          <List className="h-3.5 w-3.5" />
          {title}
          <span className="text-xs font-normal text-muted-foreground">({total}门 · 已生成{data.syllabuses.length}门)</span>
        </h4>
        <div className="space-y-2">
          {data.syllabuses.map(renderSyllabusCard)}
          {data.ungenerated.map(renderUngeneratedCard)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧筛选 */}
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
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              课程与能力目标管理
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentProgram ? currentProgram.name : '全部方案'} · 
              共 {stats.total} 门课程/场景，已生成 {stats.generated} 份大纲
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentProgram && (
              <Button variant="outline" onClick={() => router.push(`/admin/operations/teaching-plans?programId=${currentProgram.id}`)}>
                <CalendarDays className="mr-2 h-4 w-4" />
                前往制定教学计划
              </Button>
            )}
            {currentProgram && ungeneratedCourses.length > 0 && (
              <Button onClick={() => openGenerate(currentProgram)}>
                <Sparkles className="mr-2 h-4 w-4" />
                生成课程与能力目标
              </Button>
            )}
          </div>
        </div>

        {/* 统计卡 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-blue-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">课程/场景总数</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-muted-foreground">待生成</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">已生成</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.generated}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-muted-foreground">已定稿</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.finalized}</p>
            </CardContent>
          </Card>
        </div>

        {/* 二级筛选 */}
        <Card className="py-0">
          <CardContent className="px-3 pb-3 pt-3 space-y-2">
            <div className="text-sm font-semibold">课程筛选</div>
            {/* 第一级：课程类别 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">课程类别</label>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={filterCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterCategory('all')}
                >全部</Badge>
                <Badge
                  variant={filterCategory === 'public' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterCategory('public')}
                >公共基础课程</Badge>
                <Badge
                  variant={filterCategory === 'professional' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterCategory('professional')}
                >专业课程</Badge>
              </div>
            </div>
            {/* 第二级：课程性质 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">课程性质</label>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={filterNature === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterNature('all')}
                >全部</Badge>
                <Badge
                  variant={filterNature === 'required' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterNature('required')}
                >必选</Badge>
                <Badge
                  variant={filterNature === 'elective' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterNature('elective')}
                >选修</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 未生成提示 */}
        {currentProgram && filteredUngenerated.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              当前筛选下还有 {filteredUngenerated.length} 门课程/场景未生成课程与能力目标，建议尽快生成
            </span>
            <Button size="sm" variant="outline" className="ml-auto h-7" onClick={() => openGenerate(currentProgram)}>
              立即生成
            </Button>
          </div>
        )}

        {/* 大纲列表 */}
        <div className="space-y-3">
          {/* 已生成的大纲 */}
          {(currentProgram ? filteredSyllabuses : allSyllabuses).map(renderSyllabusCard)}
          {/* 未生成的课程 */}
          {currentProgram && filteredUngenerated.map(renderUngeneratedCard)}
          {(currentProgram ? filteredSyllabuses : allSyllabuses).length === 0 &&
            (!currentProgram || filteredUngenerated.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-3 opacity-30" />
              <p>暂无课程与能力目标</p>
              <p className="text-sm">请先选择人培方案并生成课程与能力目标</p>
            </div>
          )}
        </div>
      </div>

      {/* 生成弹窗 */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              生成课程与能力目标
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              为「{generatingProgram?.name}」生成课程与能力目标，基于课程信息自动匹配模板
            </p>

            {isGenerating ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>正在生成...</span>
                  <span className="text-muted-foreground">{generateProgress.toFixed(0)}%</span>
                </div>
                <Progress value={generateProgress} className="h-2" />
                <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                  {generateLogsVisible.map((log, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{log}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-sm font-medium">选择要生成的课程/场景：</p>
                {ungeneratedCourses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCourses((prev) =>
                          checked
                            ? [...prev, course.id]
                            : prev.filter((id) => id !== course.id)
                        )
                      }}
                    />
                    <span className="text-sm flex-1">{course.name}</span>
                    <Badge variant="outline" className="text-xs">{course.nature}</Badge>
                  </label>
                ))}
                {ungeneratedCourses.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    所有课程/场景已生成大纲
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            {!isGenerating && (
              <>
                <Button variant="outline" onClick={() => setGenerateOpen(false)}>
                  取消
                </Button>
                <Button onClick={startGenerate} disabled={selectedCourses.length === 0}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  开始生成 ({selectedCourses.length})
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SyllabusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">加载中...</div>}>
      <SyllabusPageInner />
    </Suspense>
  )
}
