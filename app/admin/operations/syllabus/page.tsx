'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
import {
  trainingPrograms,
  syllabuses,
  sceneSyllabuses,
  departments,
  majors,
  grades,
  type TrainingProgram,
  type Syllabus,
  type SceneSyllabus,
} from '@/lib/mock-data'

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

export default function SyllabusPage() {
  const router = useRouter()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')

  // 生成弹窗
  const [generateOpen, setGenerateOpen] = useState(false)
  const [generatingProgram, setGeneratingProgram] = useState<TrainingProgram | null>(null)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generateLogsVisible, setGenerateLogsVisible] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

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
  }, [])

  // 当前方案下的大纲
  const programSyllabuses = useMemo(() => {
    if (!currentProgram) return []
    const courseIds = [
      ...currentProgram.courses.map((c) => c.id),
      ...currentProgram.practiceScenes.map((p) => p.id),
    ]
    return allSyllabuses.filter((s) => courseIds.includes(s.courseId) || s.programId === currentProgram.id)
  }, [currentProgram, allSyllabuses])

  // 未生成大纲的课程
  const ungeneratedCourses = useMemo(() => {
    if (!currentProgram) return []
    const existingIds = new Set(programSyllabuses.map((s) => s.courseId))
    return [
      ...currentProgram.courses.filter((c) => !existingIds.has(c.id)).map((c) => ({ ...c, type: 'theory' as const })),
      ...currentProgram.practiceScenes.filter((p) => !existingIds.has(p.id)).map((p) => ({ ...p, type: 'scene' as const })),
    ]
  }, [currentProgram, programSyllabuses])

  // 统计
  const stats = useMemo(() => {
    const total = currentProgram ? currentProgram.courses.length + currentProgram.practiceScenes.length : allSyllabuses.length
    const generated = programSyllabuses.length || allSyllabuses.filter((s) => s.status !== 'draft').length
    const finalized = programSyllabuses.filter((s) => s.status === 'finalized').length || allSyllabuses.filter((s) => s.status === 'finalized').length
    return { total, generated, finalized, pending: total - generated }
  }, [currentProgram, programSyllabuses, allSyllabuses])

  // 打开生成弹窗
  const openGenerate = (program: TrainingProgram) => {
    setGeneratingProgram(program)
    setSelectedCourses([])
    setGenerateProgress(0)
    setGenerateLogsVisible([])
    setGenerateOpen(true)
  }

  // Mock生成
  const startGenerate = () => {
    if (selectedCourses.length === 0) {
      toast.error('请至少选择一门课程')
      return
    }
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
          setIsGenerating(false)
          setGenerateOpen(false)
          toast.success(`成功生成 ${selectedCourses.length} 份教学大纲！`)
        }, 500)
      }
    }, 250)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* 左侧筛选 */}
      <div className="w-64 shrink-0 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">筛选条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">院系</label>
              <ScrollArea className="h-48">
                <div className="space-y-1">
                  <button
                    className={cn(
                      'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                      selectedDeptId === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                    )}
                    onClick={() => { setSelectedDeptId('all'); setSelectedProgramId('all') }}
                  >
                    全部院系
                  </button>
                  {departments.map((d) => (
                    <button
                      key={d.id}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                        selectedDeptId === d.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                      )}
                      onClick={() => { setSelectedDeptId(d.id); setSelectedProgramId('all') }}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">年级</label>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={selectedYear === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedYear('all')}
                >
                  全部
                </Badge>
                {grades.map((g) => (
                  <Badge
                    key={g.id}
                    variant={selectedYear === String(g.entryYear) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedYear(String(g.entryYear))}
                  >
                    {g.entryYear}级
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">人培方案</label>
              <ScrollArea className="h-48">
                <div className="space-y-1">
                  <button
                    className={cn(
                      'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                      selectedProgramId === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                    )}
                    onClick={() => setSelectedProgramId('all')}
                  >
                    全部方案
                  </button>
                  {deptPrograms.map((p) => (
                    <button
                      key={p.id}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded text-sm transition-colors truncate',
                        selectedProgramId === p.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                      )}
                      onClick={() => setSelectedProgramId(p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              教学大纲管理
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentProgram ? currentProgram.name : '全部方案'} · 
              共 {stats.total} 门课程/场景，已生成 {stats.generated} 份大纲
            </p>
          </div>
          {currentProgram && ungeneratedCourses.length > 0 && (
            <Button onClick={() => openGenerate(currentProgram)}>
              <Sparkles className="mr-2 h-4 w-4" />
              生成教学大纲
            </Button>
          )}
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

        {/* 未生成提示 */}
        {currentProgram && ungeneratedCourses.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              当前方案还有 {ungeneratedCourses.length} 门课程/场景未生成教学大纲，建议尽快生成
            </span>
            <Button size="sm" variant="outline" className="ml-auto h-7" onClick={() => openGenerate(currentProgram)}>
              立即生成
            </Button>
          </div>
        )}

        {/* 大纲列表 */}
        <div className="space-y-3">
          {/* 已生成的大纲 */}
          {(currentProgram ? programSyllabuses : allSyllabuses).map((syl) => {
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

                  {/* 快捷信息 */}
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
                    <div>
                      版本：{syl.version}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* 未生成的课程 */}
          {currentProgram && ungeneratedCourses.map((course) => {
            const typeInfo = typeMap[course.type] || typeMap.theory
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
                          <Badge variant="outline" className="text-xs text-slate-500">
                            未生成
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          代码：{course.code} · {course.credits}学分 · {course.hours}学时 · 第{course.semester}学期
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openGenerate(currentProgram)}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      生成大纲
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {(currentProgram ? programSyllabuses : allSyllabuses).length === 0 &&
            (!currentProgram || ungeneratedCourses.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-3 opacity-30" />
              <p>暂无教学大纲</p>
              <p className="text-sm">请先选择人培方案并生成教学大纲</p>
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
              生成教学大纲
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              为「{generatingProgram?.name}」生成教学大纲，基于课程信息自动匹配模板
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
