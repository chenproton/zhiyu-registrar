'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Save,
  BookOpen,
  Beaker,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Target,
  ListChecks,
  FileText,
  Award,
  Library,
  Upload,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { syllabuses, sceneSyllabuses, positions, teachingPlansV2, trainingPrograms, type Syllabus, type SceneSyllabus, type SyllabusObjective, type SyllabusChapter } from '@/lib/mock-data'
import PositionSearchSelect from '@/components/shared/position-search-select'

export default function SyllabusDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === '1'
  const syllabusId = params.id as string

  const originalSyllabus = syllabuses.find((s) => s.id === syllabusId) || sceneSyllabuses.find((s) => s.id === syllabusId)
  const isScene = originalSyllabus?.type === 'scene'

  const [syllabus, setSyllabus] = useState<Syllabus | SceneSyllabus | undefined>(originalSyllabus)
  const [editMode, setEditMode] = useState(isEditMode)
  const [activeSection, setActiveSection] = useState('objectives')
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(`section-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const navItems = useMemo(() => {
    const items = [
      { id: 'objectives', label: '教学目标', icon: Target },
      { id: 'chapters', label: '教学内容', icon: ListChecks },
      { id: 'methods', label: '教学方法与考核', icon: FileText },
      { id: 'materials', label: '教材资料', icon: Library },
    ]
    if (isScene) items.push({ id: 'scene', label: '场景任务链', icon: Beaker })
    return items
  }, [isScene])

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) {
        const id = visible.target.id.replace('section-', '')
        setActiveSection(id)
      }
    }
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })
    const ids = ['objectives', 'chapters', 'methods', 'materials']
    if (isScene) ids.push('scene')
    ids.forEach((id) => {
      const el = document.getElementById(`section-${id}`)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [isScene, syllabus])

  // 从 trainingPrograms 查找关联的人培方案，计算学期列表
  const linkedProgram = useMemo(() => {
    if (!syllabus) return null
    return trainingPrograms.find((p) => p.id === syllabus.programId)
  }, [syllabus?.programId])

  // 根据人培方案的基本信息自动计算学期列表
  const semesterItems = useMemo(() => {
    if (!linkedProgram) return []
    const startDate = linkedProgram.startDate
    const duration = linkedProgram.duration
    if (!startDate || !duration) return []
    const startYear = new Date(startDate).getFullYear()
    const items: { semester: number; label: string }[] = []
    for (let i = 0; i < duration; i++) {
      const year = startYear + i
      items.push({ semester: i * 2 + 1, label: `${year}年第一学期` })
      items.push({ semester: i * 2 + 2, label: `${year}年第二学期` })
    }
    return items
  }, [linkedProgram])

  const allSemesters = useMemo(() => semesterItems.map((s) => s.semester), [semesterItems])

  const defaultSemester = allSemesters[0] || 1

  const [activeSemester, setActiveSemester] = useState<number>(defaultSemester)

  // 当学期列表变化时，确保 activeSemester 有效
  useEffect(() => {
    if (allSemesters.length > 0 && !allSemesters.includes(activeSemester)) {
      setActiveSemester(allSemesters[0])
    }
  }, [allSemesters, activeSemester])

  if (!syllabus) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">未找到课程与能力目标</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/operations/syllabus')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    )
  }

  const sceneSyl = isScene ? (syllabus as SceneSyllabus) : null

  const updateField = <K extends keyof Syllabus>(field: K, value: Syllabus[K]) => {
    setSyllabus((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const updateSceneField = <K extends keyof SceneSyllabus>(field: K, value: SceneSyllabus[K]) => {
    setSyllabus((prev) => {
      if (!prev || prev.type !== 'scene') return prev
      return { ...prev, [field]: value } as SceneSyllabus
    })
  }

  const handlePositionChange = (positionIds: string[]) => {
    const posId = positionIds[0] || ''
    const pos = positions.find((p) => p.id === posId)
    updateSceneField('mappedPositionId', posId)
    updateSceneField('mappedPositionName', pos?.name || '')
  }

  const addObjective = () => {
    const newObj: SyllabusObjective = {
      id: `obj-${Date.now()}`,
      dimension: '知识',
      content: '',
      level: '掌握',
    }
    setSyllabus((prev) => prev ? { ...prev, objectives: [...prev.objectives, newObj] } : prev)
  }

  const updateObjective = (id: string, field: keyof SyllabusObjective, value: string) => {
    setSyllabus((prev) => prev ? {
      ...prev,
      objectives: prev.objectives.map((o) => o.id === id ? { ...o, [field]: value } : o),
    } : prev)
  }

  const removeObjective = (id: string) => {
    setSyllabus((prev) => prev ? {
      ...prev,
      objectives: prev.objectives.filter((o) => o.id !== id),
    } : prev)
  }

  const addChapter = () => {
    const newCh: SyllabusChapter = {
      id: `ch-${Date.now()}`,
      name: '',
      hours: 2,
      theoryHours: 2,
      practiceHours: 0,
      content: '',
      teachingMethod: '讲授',
      keyPoints: '',
      difficultPoints: '',
      semester: activeSemester,
    }
    setSyllabus((prev) => prev ? { ...prev, chapters: [...prev.chapters, newCh] } : prev)
  }

  const updateChapter = (id: string, field: keyof SyllabusChapter, value: any) => {
    setSyllabus((prev) => prev ? {
      ...prev,
      chapters: prev.chapters.map((c) => c.id === id ? { ...c, [field]: value } : c),
    } : prev)
  }

  const removeChapter = (id: string) => {
    setSyllabus((prev) => prev ? {
      ...prev,
      chapters: prev.chapters.filter((c) => c.id !== id),
    } : prev)
  }

  const handleSave = () => {
    toast.success('课程与能力目标保存成功！')
    setEditMode(false)
  }

  const handleFinalize = () => {
    updateField('status', 'finalized')
    toast.success('课程与能力目标已定稿！')
  }

  const statusLabel = {
    draft: '草稿',
    generated: '已生成',
    editing: '编辑中',
    finalized: '已定稿',
  }[syllabus.status]

  return (
    <div className="space-y-4 p-4">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b -mx-4 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/programs/${syllabus.programId}/edit?tab=curriculum`)}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                {isScene ? <Beaker className="h-5 w-5 text-purple-600" /> : <BookOpen className="h-5 w-5 text-blue-600" />}
                {syllabus.courseName} · 课程与能力目标
              </h1>
              <p className="text-sm text-muted-foreground">
                代码：{syllabus.courseCode} · {syllabus.credits}学分 · {syllabus.totalHours}学时
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={syllabus.status === 'finalized' ? 'default' : 'outline'}
              className={cn(
                syllabus.status === 'finalized' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
              )}
            >
              {syllabus.status === 'finalized' && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {statusLabel}
            </Badge>
            {editMode ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                  取消
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  编辑
                </Button>
                {syllabus.status !== 'finalized' && (
                  <Button size="sm" variant="default" onClick={handleFinalize}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    定稿
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 场景大纲特有信息 */}
      {sceneSyl && (
        <Card className="bg-purple-50/50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-800 font-medium mb-2">
              <Beaker className="h-4 w-4" />
              场景大纲信息
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm items-start">
              <div>
                <span className="text-muted-foreground block mb-1.5">对标岗位：</span>
                {editMode ? (
                  <PositionSearchSelect
                    value={sceneSyl.mappedPositionId ? [sceneSyl.mappedPositionId] : []}
                    onChange={handlePositionChange}
                    multiple={false}
                    placeholder="选择对标岗位"
                  />
                ) : (
                  <span className="font-medium">{sceneSyl.mappedPositionName}</span>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">工作站类型：</span>
                <span className="font-medium">{sceneSyl.workstationType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">企业导师：</span>
                <span className="font-medium">{sceneSyl.enterpriseMentorRequired ? '需要' : '不需要'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 瀑布流文档内容 */}
      <div className="flex gap-6">
        {/* 左侧目录导航 */}
        <aside className="sticky top-20 h-fit w-44 shrink-0 hidden lg:block space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">目录</p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </aside>

        {/* 右侧连续内容 */}
        <main className="flex-1 min-w-0 space-y-12 pb-16">

          <section id="section-objectives" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">教学目标</h2>
            </div>
            <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  教学目标（基于 KSA 目标）
                  <a
                    href="https://www.jiangshitai.com/f/145567.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-normal"
                  >
                    查看介绍
                  </a>
                </CardTitle>
                {editMode && (
                  <Button size="sm" variant="outline" onClick={addObjective}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加目标
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {syllabus.objectives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无教学目标，{editMode ? '请点击上方按钮添加' : '请进入编辑模式添加'}
                </div>
              ) : (
                <div className="space-y-3">
                  {syllabus.objectives.map((obj) => (
                    <div key={obj.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0',
                          obj.dimension === '知识' && 'text-blue-600 border-blue-300',
                          obj.dimension === '能力' && 'text-amber-600 border-amber-300',
                          obj.dimension === '素养' && 'text-emerald-600 border-emerald-300',
                        )}
                      >
                        {obj.dimension}
                      </Badge>
                      {editMode ? (
                        <div className="flex-1 space-y-3">
                          <select
                            value={obj.dimension}
                            onChange={(e) => updateObjective(obj.id, 'dimension', e.target.value)}
                            className="h-8 rounded-md border px-2 text-sm"
                          >
                            <option value="知识">知识</option>
                            <option value="能力">能力</option>
                            <option value="素养">素养</option>
                          </select>
                          <select
                            value={obj.level}
                            onChange={(e) => updateObjective(obj.id, 'level', e.target.value)}
                            className="h-8 rounded-md border px-2 text-sm"
                          >
                            <option value="了解">了解</option>
                            <option value="理解">理解</option>
                            <option value="掌握">掌握</option>
                            <option value="熟练">熟练</option>
                            <option value="精通">精通</option>
                          </select>
                          <RichTextEditor
                            value={obj.content}
                            onChange={(v) => updateObjective(obj.id, 'content', v)}
                            placeholder="目标内容"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p className="text-sm">{obj.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">掌握程度：{obj.level}</p>
                        </div>
                      )}
                      {editMode && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive shrink-0"
                          onClick={() => removeObjective(obj.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </section>

          <section id="section-chapters" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">教学内容</h2>
            </div>
            <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">教学内容与学时分配</CardTitle>
                {editMode && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success('导入功能使用现有组件样式即可')}>
                      <Upload className="h-4 w-4 mr-1" />
                      导入
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success('导出功能使用现有组件样式即可')}>
                      <Download className="h-4 w-4 mr-1" />
                      导出
                    </Button>
                    <Button size="sm" variant="outline" onClick={addChapter}>
                      <Plus className="h-4 w-4 mr-1" />
                      添加节点
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {syllabus.chapters.length === 0 && semesterItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无节点内容
                </div>
              ) : (
                <SemesterChapterView
                  syllabus={syllabus}
                  editMode={editMode}
                  activeSemester={activeSemester}
                  onSemesterChange={setActiveSemester}
                  defaultSemester={defaultSemester}
                  semesterItems={semesterItems}
                  updateChapter={updateChapter}
                  removeChapter={removeChapter}
                />
              )}
            </CardContent>
          </Card>
          </section>

          <section id="section-methods" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">教学方法与考核</h2>
            </div>
            <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  教学方法与要求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>主要教学方法</Label>
                  {editMode ? (
                    <RichTextEditor
                      value={syllabus.teachingMethods}
                      onChange={(v) => updateField('teachingMethods', v)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground rounded-lg border p-3">
                      {syllabus.teachingMethods}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  考核方式与成绩评定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>考核方式说明</Label>
                  {editMode ? (
                    <RichTextEditor
                      value={syllabus.assessmentMethod}
                      onChange={(v) => updateField('assessmentMethod', v)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground rounded-lg border p-3">
                      {syllabus.assessmentMethod}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>成绩权重分配</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {(['usual', 'midterm', 'final', 'practice'] as const).map((key) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          {key === 'usual' && '平时成绩'}
                          {key === 'midterm' && '期中'}
                          {key === 'final' && '期末'}
                          {key === 'practice' && '实践'}
                        </Label>
                        {editMode ? (
                          <Input
                            type="number"
                            value={syllabus.assessmentWeight[key]}
                            onChange={(e) => updateField('assessmentWeight', {
                              ...syllabus.assessmentWeight,
                              [key]: parseInt(e.target.value) || 0,
                            })}
                            className="h-8"
                          />
                        ) : (
                          <p className="text-lg font-medium">{syllabus.assessmentWeight[key]}%</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </section>

          <section id="section-materials" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <Library className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">教材资料</h2>
            </div>
            <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">推荐教材</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {editMode ? (
                  <RichTextEditor
                    value={syllabus.textbooks.join('\n')}
                    onChange={(v) => updateField('textbooks', v.split('\n').filter(Boolean))}
                    placeholder="每行一本教材"
                  />
                ) : (
                  <ul className="space-y-2">
                    {syllabus.textbooks.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">参考资料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {editMode ? (
                  <RichTextEditor
                    value={syllabus.references.join('\n')}
                    onChange={(v) => updateField('references', v.split('\n').filter(Boolean))}
                    placeholder="每行一本参考书"
                  />
                ) : (
                  <ul className="space-y-2">
                    {syllabus.references.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Library className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
          </section>

          {sceneSyl && (
            <section id="section-scene" className="scroll-mt-24">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                <Beaker className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">场景任务链</h2>
              </div>
              <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">场景任务链配置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">顺序</TableHead>
                          <TableHead>任务名称</TableHead>
                          <TableHead className="w-20">学时</TableHead>
                          <TableHead>关联能力点</TableHead>
                          <TableHead>评价规则</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sceneSyl.taskChain.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.order}</TableCell>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>{task.hours}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {task.mappedAbilityIds.map((aid) => (
                                  <Badge key={aid} variant="outline" className="text-xs">{aid}</Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">{task.evaluationRuleId}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>评价量规</Label>
                      <p className="text-sm text-muted-foreground rounded-lg border p-3">
                        {sceneSyl.evaluationRubric}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>设备清单</Label>
                      <div className="flex flex-wrap gap-1">
                        {sceneSyl.equipmentList.map((eq) => (
                          <Badge key={eq} variant="outline" className="text-xs">{eq}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </section>
          )}

        </main>
      </div>
      {/* 底部操作 */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          版本：{syllabus.version} · 最后更新：{syllabus.updatedAt}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/operations/teaching-plans?programId=' + syllabus.programId)}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            生成教学计划
          </Button>
          <Button
            variant="default"
            onClick={() => router.push('/admin/operations/scheduling?programId=' + syllabus.programId)}
          >
            前往排课
            <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// 按学期分组的章节展示组件
function SemesterChapterView({
  syllabus,
  editMode,
  activeSemester,
  onSemesterChange,
  defaultSemester,
  semesterItems,
  updateChapter,
  removeChapter,
}: {
  syllabus: Syllabus | SceneSyllabus
  editMode: boolean
  activeSemester: number
  onSemesterChange: (sem: number) => void
  defaultSemester: number
  semesterItems: { semester: number; label: string }[]
  updateChapter: (id: string, field: keyof SyllabusChapter, value: any) => void
  removeChapter: (id: string) => void
}) {
  const semesterGroups = useMemo(() => {
    const groups = new Map<number, SyllabusChapter[]>()
    syllabus.chapters.forEach((ch) => {
      const sem = ch.semester || defaultSemester
      const list = groups.get(sem) || []
      list.push(ch)
      groups.set(sem, list)
    })
    return groups
  }, [syllabus.chapters, defaultSemester])

  if (semesterItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>未关联有效的人培方案学期信息</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={String(activeSemester)} onValueChange={(v) => onSemesterChange(Number(v))} className="w-full">
        <TabsList>
          {semesterItems.map((item) => (
            <TabsTrigger key={item.semester} value={String(item.semester)}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {semesterItems.map((item) => {
          const chapters = semesterGroups.get(item.semester) || []
          return (
            <TabsContent key={item.semester} value={String(item.semester)} className="mt-4 space-y-4">
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground rounded-lg border border-dashed">
                  该学期暂无节点，点击上方"添加节点"按钮添加
                </div>
              ) : (
                <>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">序号</TableHead>
                          <TableHead>节点名称（单元/模块/章节/项目）</TableHead>
                          <TableHead className="w-20">总学时</TableHead>
                          <TableHead className="w-20">理论</TableHead>
                          <TableHead className="w-20">实践</TableHead>
                          <TableHead>教学内容</TableHead>
                          {editMode && <TableHead className="w-16">操作</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chapters.map((ch, index) => (
                          <TableRow key={ch.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {editMode ? (
                                <Input
                                  value={ch.name}
                                  onChange={(e) => updateChapter(ch.id, 'name', e.target.value)}
                                  className="h-8"
                                />
                              ) : (
                                <span className="font-medium">{ch.name}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editMode ? (
                                <Input
                                  type="number"
                                  value={ch.hours}
                                  onChange={(e) => updateChapter(ch.id, 'hours', parseInt(e.target.value) || 0)}
                                  className="h-8 w-16"
                                />
                              ) : (
                                ch.hours
                              )}
                            </TableCell>
                            <TableCell>
                              {editMode ? (
                                <Input
                                  type="number"
                                  value={ch.theoryHours}
                                  onChange={(e) => updateChapter(ch.id, 'theoryHours', parseInt(e.target.value) || 0)}
                                  className="h-8 w-16"
                                />
                              ) : (
                                ch.theoryHours
                              )}
                            </TableCell>
                            <TableCell>
                              {editMode ? (
                                <Input
                                  type="number"
                                  value={ch.practiceHours}
                                  onChange={(e) => updateChapter(ch.id, 'practiceHours', parseInt(e.target.value) || 0)}
                                  className="h-8 w-16"
                                />
                              ) : (
                                ch.practiceHours
                              )}
                            </TableCell>
                            <TableCell>
                              {editMode ? (
                                <Input
                                  value={ch.content}
                                  onChange={(e) => updateChapter(ch.id, 'content', e.target.value)}
                                  className="h-8"
                                  placeholder="教学内容摘要"
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">{ch.content}</span>
                              )}
                            </TableCell>
                            {editMode && (
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => removeChapter(ch.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-4 text-sm text-muted-foreground">
                    <span>总学时：<strong className="text-foreground">{chapters.reduce((s, c) => s + c.hours, 0)}</strong></span>
                    <span>理论：<strong className="text-foreground">{chapters.reduce((s, c) => s + c.theoryHours, 0)}</strong></span>
                    <span>实践：<strong className="text-foreground">{chapters.reduce((s, c) => s + c.practiceHours, 0)}</strong></span>
                  </div>
                </>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
