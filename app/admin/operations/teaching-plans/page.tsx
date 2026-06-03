'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Beaker,
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
  trainingPrograms,
  departments,
  majors,
  grades,
  type TeachingPlan,
} from '@/lib/mock-data'
import { useTeachingPlans } from '@/components/providers/teaching-plan-provider'

function TeachingPlansPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { teachingPlans, generatePlanFromProgram } = useTeachingPlans()
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')

  const [generateOpen, setGenerateOpen] = useState(false)
  const [generatingProgram, setGeneratingProgram] = useState<any>(null)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

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

  const programPlans = useMemo(() => {
    if (!currentProgram) return teachingPlans
    return teachingPlans.filter((p) => p.programId === currentProgram.id)
  }, [currentProgram, teachingPlans])

  const currentPlan = programPlans[0]

  const stats = useMemo(() => {
    if (!currentPlan) return { total: 0, confirmed: 0, scheduled: 0, pending: 0, scene: 0 }
    const total = currentPlan.entries.length
    const confirmed = currentPlan.entries.filter((e) => e.status === 'confirmed' || e.status === 'scheduled').length
    const scheduled = currentPlan.entries.filter((e) => e.status === 'scheduled').length
    const scene = currentPlan.entries.filter((e) => e.type === 'scene').length
    return { total, confirmed, scheduled, pending: total - confirmed, scene }
  }, [currentPlan])

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

  const openGenerate = (program: any) => {
    setGeneratingProgram(program)
    setGenerateProgress(0)
    setGenerateOpen(true)
  }

  const startGenerate = () => {
    if (!generatingProgram) return
    setIsGenerating(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 12
      if (progress > 100) progress = 100
      setGenerateProgress(Math.min(progress, 100))
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          const plan = generatePlanFromProgram(generatingProgram)
          setIsGenerating(false)
          setGenerateOpen(false)
          if (plan) {
            toast.success(`教学计划生成成功！共 ${plan.entries.length} 门课程/场景`)
          } else {
            toast.info('该培养方案的教学计划已存在')
          }
        }, 500)
      }
    }, 200)
  }

  const semesterGroups = useMemo(() => {
    if (!currentPlan) return []
    const groups = new Map<number, typeof currentPlan.entries>()
    currentPlan.entries.forEach((entry) => {
      const list = groups.get(entry.semester) || []
      list.push(entry)
      groups.set(entry.semester, list)
    })
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0])
  }, [currentPlan])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              教学计划管理
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentProgram ? currentProgram.name : '全部方案'}
              {currentPlan && ` · ${currentPlan.totalSemesters}个学期 · ${stats.total}门课程/场景`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentProgram && (
              <Button variant="outline" onClick={() => router.push(`/admin/operations/syllabus?programId=${currentProgram.id}`)}>
                <BookOpen className="mr-2 h-4 w-4" />
                查看大纲
              </Button>
            )}
            {currentProgram && (
              <Button variant="outline" onClick={() => router.push(`/admin/operations/scheduling?programId=${currentProgram.id}`)}>
                <ArrowRight className="mr-2 h-4 w-4" />
                前往排课
              </Button>
            )}
            {currentProgram && (
              <Button onClick={() => openGenerate(currentProgram)}>
                <Sparkles className="mr-2 h-4 w-4" />
                生成教学计划
              </Button>
            )}
          </div>
        </div>

        {/* 统计 */}
        {currentPlan && (
          <div className="grid grid-cols-5 gap-4">
            <Card className="bg-blue-50/50">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">课程总数</span>
                </div>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="bg-fuchsia-50/50">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-fuchsia-600" />
                  <span className="text-sm text-muted-foreground">场景课程</span>
                </div>
                <p className="text-2xl font-bold mt-1">{stats.scene}</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/50">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-muted-foreground">待确认</span>
                </div>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50/50">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-muted-foreground">已确认</span>
                </div>
                <p className="text-2xl font-bold mt-1">{stats.confirmed}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50/50">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-muted-foreground">已排课</span>
                </div>
                <p className="text-2xl font-bold mt-1">{stats.scheduled}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 计划内容 */}
        {currentPlan ? (
          <div className="space-y-6">
            {semesterGroups.map(([semester, entries]) => (
              <Card key={semester}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    第{semester}学期
                    <Badge variant="outline" className="text-xs">{entries.length} 门</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>课程/场景</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>性质</TableHead>
                          <TableHead>学分</TableHead>
                          <TableHead>总学时</TableHead>
                          <TableHead>周学时</TableHead>
                          <TableHead>起止周</TableHead>
                          <TableHead>周次模式</TableHead>
                          <TableHead>场地</TableHead>
                          <TableHead>状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id} className={entry.type === 'scene' ? 'bg-purple-50/50' : undefined}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {entry.type === 'scene' && <Beaker className="h-4 w-4 text-purple-600" />}
                                {entry.courseName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn('text-xs',
                                entry.type === 'scene' ? 'text-purple-600 border-purple-300' :
                                entry.type === 'practice' ? 'text-amber-600 border-amber-300' : 'text-blue-600 border-blue-300'
                              )}>
                                {entry.type === 'scene' ? '场景' : entry.type === 'practice' ? '实践' : '理论'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.nature === '必修' ? 'default' : 'secondary'} className="text-xs">{entry.nature}</Badge>
                            </TableCell>
                            <TableCell>{entry.credits}</TableCell>
                            <TableCell>{entry.totalHours}</TableCell>
                            <TableCell>{entry.weekHours}</TableCell>
                            <TableCell>{entry.startWeek}-{entry.endWeek}周</TableCell>
                            <TableCell>
                              {entry.weekPattern === 'all' && '全周'}
                              {entry.weekPattern === 'odd' && '单周'}
                              {entry.weekPattern === 'even' && '双周'}
                              {entry.weekPattern === 'intensive' && '集中'}
                            </TableCell>
                            <TableCell>{entry.venueTypeRequired}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn('text-xs', entry.status === 'scheduled' ? 'text-emerald-600' : 'text-amber-600')}>
                                {entry.status === 'scheduled' ? '已排课' : entry.status === 'confirmed' ? '已确认' : '计划中'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
            <p>请选择人培方案并生成教学计划</p>
          </div>
        )}
      </div>

      {/* 生成弹窗 */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              生成教学计划
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              为「{generatingProgram?.name}」基于课程与能力目标自动生成教学计划
            </p>
            {isGenerating ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>正在生成教学计划...</span>
                  <span className="text-muted-foreground">{generateProgress.toFixed(0)}%</span>
                </div>
                <Progress value={generateProgress} className="h-2" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• 根据学分自动计算总学时...</p>
                  <p>• 按学期分配课程...</p>
                  <p>• 分配周学时与起止周次...</p>
                  <p>• 配置场地类型需求...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <p className="font-medium">生成规则说明：</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li>学分 × 16周 = 总学时（默认）</li>
                  <li>理论课每周 2-4 学时，均匀分布</li>
                  <li>实践/场景课集中安排在学期末</li>
                  <li>自动匹配场地类型需求</li>
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            {!isGenerating && (
              <>
                <Button variant="outline" onClick={() => setGenerateOpen(false)}>取消</Button>
                <Button onClick={startGenerate}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  开始生成
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function TeachingPlansPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">加载中...</div>}>
      <TeachingPlansPageInner />
    </Suspense>
  )
}
