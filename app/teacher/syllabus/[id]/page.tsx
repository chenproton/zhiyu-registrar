'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { ArrowLeft, Save, BookOpen, Beaker, CheckCircle2, Plus, Trash2, Target, ListChecks, FileText, Award, Library } from 'lucide-react'
import { cn } from '@/lib/utils'
import { syllabuses, sceneSyllabuses, teachingPlansV2, type Syllabus, type SceneSyllabus, type SyllabusObjective, type SyllabusChapter } from '@/lib/mock-data'
import { currentTeacher } from '@/lib/current-user'

export default function TeacherSyllabusEditPage() {
  const router = useRouter()
  const params = useParams()
  const syllabusId = params.id as string

  const originalSyllabus = syllabuses.find((s) => s.id === syllabusId) || sceneSyllabuses.find((s) => s.id === syllabusId)
  const isScene = originalSyllabus?.type === 'scene'

  const [syllabus, setSyllabus] = useState<Syllabus | SceneSyllabus | undefined>(originalSyllabus)

  if (!syllabus) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">未找到课程与能力目标</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/teacher/syllabus')}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回
        </Button>
      </div>
    )
  }

  const updateField = <K extends keyof Syllabus>(field: K, value: Syllabus[K]) => {
    setSyllabus((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const addObjective = () => {
    const newObj: SyllabusObjective = { id: `obj-${Date.now()}`, dimension: '知识', content: '', level: '掌握' }
    setSyllabus((prev) => prev ? { ...prev, objectives: [...prev.objectives, newObj] } : prev)
  }

  const updateObjective = (id: string, field: keyof SyllabusObjective, value: string) => {
    setSyllabus((prev) => prev ? { ...prev, objectives: prev.objectives.map((o) => o.id === id ? { ...o, [field]: value } : o) } : prev)
  }

  const removeObjective = (id: string) => {
    setSyllabus((prev) => prev ? { ...prev, objectives: prev.objectives.filter((o) => o.id !== id) } : prev)
  }

  const addChapter = () => {
    const newCh: SyllabusChapter = {
      id: `ch-${Date.now()}`, name: '', hours: 2, theoryHours: 2, practiceHours: 0,
      content: '', teachingMethod: '讲授', keyPoints: '', difficultPoints: '', semester: 1,
    }
    setSyllabus((prev) => prev ? { ...prev, chapters: [...prev.chapters, newCh] } : prev)
  }

  const updateChapter = (id: string, field: keyof SyllabusChapter, value: any) => {
    setSyllabus((prev) => prev ? { ...prev, chapters: prev.chapters.map((c) => c.id === id ? { ...c, [field]: value } : c) } : prev)
  }

  const removeChapter = (id: string) => {
    setSyllabus((prev) => prev ? { ...prev, chapters: prev.chapters.filter((c) => c.id !== id) } : prev)
  }

  const handleSave = () => {
    toast.success('课程与能力目标保存成功！')
  }

  const statusLabel: Record<string, string> = { draft: '草稿', generated: '已生成', editing: '编辑中', finalized: '已定稿' }

  // Group chapters by semester
  const defaultSemester = useMemo(() => {
    const plan = teachingPlansV2.find((p) => p.programId === syllabus.programId)
    const entry = plan?.entries.find((e) => e.courseId === syllabus.courseId)
    return entry?.semester || 1
  }, [syllabus.programId, syllabus.courseId])

  const semesterGroups = useMemo(() => {
    const groups = new Map<number, SyllabusChapter[]>()
    syllabus.chapters.forEach((ch) => {
      const sem = ch.semester || defaultSemester
      const list = groups.get(sem) || []
      list.push(ch)
      groups.set(sem, list)
    })
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0])
  }, [syllabus.chapters, defaultSemester])

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/teacher/syllabus')}>
            <ArrowLeft className="h-4 w-4 mr-1" />返回
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {isScene ? <Beaker className="h-5 w-5 text-purple-600" /> : <BookOpen className="h-5 w-5 text-blue-600" />}
              {syllabus.courseName} · 课程与能力目标编辑
            </h1>
            <p className="text-sm text-muted-foreground">
              代码：{syllabus.courseCode} · {syllabus.credits}学分 · {syllabus.totalHours}学时
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{statusLabel[syllabus.status]}</Badge>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />保存
          </Button>
        </div>
      </div>

      <Tabs defaultValue="objectives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="objectives"><Target className="h-4 w-4 mr-1" />教学目标</TabsTrigger>
          <TabsTrigger value="chapters"><ListChecks className="h-4 w-4 mr-1" />教学内容</TabsTrigger>
          <TabsTrigger value="methods"><FileText className="h-4 w-4 mr-1" />教学方法与考核</TabsTrigger>
          <TabsTrigger value="materials"><Library className="h-4 w-4 mr-1" />教材资料</TabsTrigger>
        </TabsList>

        {/* 教学目标 */}
        <TabsContent value="objectives">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">教学目标（知识/能力/素养）</CardTitle>
                <Button size="sm" variant="outline" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-1" />添加目标
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {syllabus.objectives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">暂无教学目标</div>
              ) : (
                <div className="space-y-3">
                  {syllabus.objectives.map((obj) => (
                    <div key={obj.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <Badge variant="outline" className={cn('shrink-0', obj.dimension === '知识' && 'text-blue-600 border-blue-300', obj.dimension === '能力' && 'text-amber-600 border-amber-300', obj.dimension === '素养' && 'text-emerald-600 border-emerald-300')}>{obj.dimension}</Badge>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <select value={obj.dimension} onChange={(e) => updateObjective(obj.id, 'dimension', e.target.value)} className="h-8 rounded-md border px-2 text-sm">
                          <option value="知识">知识</option><option value="能力">能力</option><option value="素养">素养</option>
                        </select>
                        <select value={obj.level} onChange={(e) => updateObjective(obj.id, 'level', e.target.value)} className="h-8 rounded-md border px-2 text-sm">
                          <option value="了解">了解</option><option value="理解">理解</option><option value="掌握">掌握</option><option value="熟练">熟练</option><option value="精通">精通</option>
                        </select>
                        <Textarea value={obj.content} onChange={(e) => updateObjective(obj.id, 'content', e.target.value)} placeholder="目标内容" className="col-span-2 min-h-[60px]" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeObjective(obj.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 教学内容 */}
        <TabsContent value="chapters">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">教学内容与学时分配</CardTitle>
                <Button size="sm" variant="outline" onClick={addChapter}>
                  <Plus className="h-4 w-4 mr-1" />添加章节
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {syllabus.chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">暂无章节</div>
              ) : (
                <div className="space-y-6">
                  {semesterGroups.map(([sem, chapters]) => (
                    <div key={sem}>
                      <div className="text-sm font-medium mb-2">第{sem}学期 ({chapters.length}章)</div>
                      <div className="space-y-2">
                        {chapters.map((ch, index) => (
                          <div key={ch.id} className="rounded-lg border p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground w-8">{index + 1}</span>
                              <Input value={ch.name} onChange={(e) => updateChapter(ch.id, 'name', e.target.value)} className="h-8 flex-1" placeholder="章节名称" />
                              <Input type="number" value={ch.semester || defaultSemester} onChange={(e) => updateChapter(ch.id, 'semester', parseInt(e.target.value) || 1)} className="h-8 w-20" placeholder="学期" />
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeChapter(ch.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-2 ml-8">
                              <Input type="number" value={ch.hours} onChange={(e) => updateChapter(ch.id, 'hours', parseInt(e.target.value) || 0)} className="h-8" placeholder="总学时" />
                              <Input type="number" value={ch.theoryHours} onChange={(e) => updateChapter(ch.id, 'theoryHours', parseInt(e.target.value) || 0)} className="h-8" placeholder="理论" />
                              <Input type="number" value={ch.practiceHours} onChange={(e) => updateChapter(ch.id, 'practiceHours', parseInt(e.target.value) || 0)} className="h-8" placeholder="实践" />
                              <Input value={ch.content} onChange={(e) => updateChapter(ch.id, 'content', e.target.value)} className="h-8" placeholder="内容摘要" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 教学方法 */}
        <TabsContent value="methods">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">教学方法与要求</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={syllabus.teachingMethods} onChange={(e) => updateField('teachingMethods', e.target.value)} rows={6} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">考核方式</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={syllabus.assessmentMethod} onChange={(e) => updateField('assessmentMethod', e.target.value)} rows={3} />
                <div className="grid grid-cols-4 gap-3">
                  {(['usual', 'midterm', 'final', 'practice'] as const).map((key) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs text-muted-foreground">{key === 'usual' ? '平时' : key === 'midterm' ? '期中' : key === 'final' ? '期末' : '实践'}</label>
                      <Input type="number" value={syllabus.assessmentWeight[key]} onChange={(e) => updateField('assessmentWeight', { ...syllabus.assessmentWeight, [key]: parseInt(e.target.value) || 0 })} className="h-8" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 教材 */}
        <TabsContent value="materials">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">推荐教材</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={syllabus.textbooks.join('\n')} onChange={(e) => updateField('textbooks', e.target.value.split('\n').filter(Boolean))} rows={8} placeholder="每行一本教材" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">参考资料</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={syllabus.references.join('\n')} onChange={(e) => updateField('references', e.target.value.split('\n').filter(Boolean))} rows={8} placeholder="每行一本参考书" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
