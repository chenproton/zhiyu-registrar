'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { toast } from 'sonner'
import {
  ArrowLeft, Save, CheckCircle2, BookOpen, Beaker, Lightbulb, Puzzle,
  ClipboardList, Plus, X, Monitor, ChevronDown, ChevronRight,
  HardHat, Wrench, Users, Link2, FileText, Video, ExternalLink,
  CheckSquare, AlertCircle, Clock, Shield, Award, Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { preparationTasks, type PreparationTask, type PreparationResource, type PreparationActivity } from '@/lib/mock-data'

export default function PreparationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const prepId = params.id as string

  const originalTask = preparationTasks.find((p) => p.id === prepId)
  const [task, setTask] = useState<PreparationTask | undefined>(originalTask)

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">未找到备课任务</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/operations/preparation')}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回列表
        </Button>
      </div>
    )
  }

  const isScene = task.taskType === 'scene'

  const updateTask = (patch: Partial<PreparationTask>) => {
    setTask((prev) => prev ? { ...prev, ...patch } : prev)
  }

  const updateStages = (stage: 'pre' | 'in' | 'post', patch: any) => {
    setTask((prev) => prev ? {
      ...prev,
      stages: { ...prev.stages, [stage]: { ...prev.stages[stage], ...patch } }
    } : prev)
  }

  const handleSave = () => {
    toast.success('备课内容保存成功！')
  }

  const handleSubmit = () => {
    toast.success('备课已提交，任务状态更新为「已完成」')
  }

  const checklist = computeChecklist(task)
  const completedCount = checklist.filter((c) => c.passed).length
  const totalCount = checklist.length
  const allPassed = completedCount === totalCount

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* 左侧主内容区 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden">
        {/* 顶部 */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/operations/preparation')}>
              <ArrowLeft className="h-4 w-4 mr-1" />返回
            </Button>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                {isScene
                  ? <Beaker className="h-5 w-5 text-purple-600" />
                  : <BookOpen className="h-5 w-5 text-blue-600" />}
                {task.taskName}
                <Badge variant={isScene ? 'secondary' : 'outline'} className={isScene ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                  {isScene ? '场景教学' : '传统教学'}
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                {task.courseName} · {task.className} · 教师：{task.facultyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />保存
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!allPassed}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {allPassed ? '提交备课' : `待完成 ${totalCount - completedCount} 项`}
            </Button>
          </div>
        </div>

        {/* 场景/课程特有信息区 */}
        {isScene
          ? <ScenePrepPanel task={task} updateTask={updateTask} />
          : <CoursePrepPanel task={task} updateTask={updateTask} />}

        {/* 三阶段备课 */}
        <div className="flex-1 min-h-0">
          <Tabs defaultValue="pre" className="h-full flex flex-col">
            <TabsList className="w-full justify-start shrink-0">
              <TabsTrigger value="pre" className="flex-1 gap-1">
                <Lightbulb className="h-4 w-4" />课前准备
              </TabsTrigger>
              <TabsTrigger value="in" className="flex-1 gap-1">
                <Puzzle className="h-4 w-4" />课堂实施
              </TabsTrigger>
              <TabsTrigger value="post" className="flex-1 gap-1">
                <ClipboardList className="h-4 w-4" />课后拓展
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1 mt-2">
              <TabsContent value="pre" className="space-y-3 m-0">
                <PrepStagePanel
                  stage={task.stages.pre}
                  onChange={(patch) => updateStages('pre', patch)}
                  isScene={isScene}
                />
              </TabsContent>
              <TabsContent value="in" className="space-y-3 m-0">
                <InStagePanel
                  stage={task.stages.in}
                  onChange={(patch) => updateStages('in', patch)}
                  isScene={isScene}
                />
              </TabsContent>
              <TabsContent value="post" className="space-y-3 m-0">
                <PostStagePanel
                  stage={task.stages.post}
                  onChange={(patch) => updateStages('post', patch)}
                  isScene={isScene}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* 右侧备课检查清单 */}
      <div className="w-72 shrink-0">
        <Card className="sticky top-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              备课检查清单
            </CardTitle>
            <CardDescription>
              已完成 {completedCount}/{totalCount} 项
            </CardDescription>
            <Progress value={(completedCount / totalCount) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className={cn(
                'flex items-start gap-2 text-sm rounded-lg p-2 border',
                item.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
              )}>
                {item.passed
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  : <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
                <span className={item.passed ? 'text-emerald-700' : 'text-amber-700'}>{item.label}</span>
              </div>
            ))}
            {allPassed && (
              <div className="text-center py-2 text-sm text-emerald-600 font-medium bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                备课检查全部通过，可以提交
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============ 备课检查清单计算 ============
function computeChecklist(task: PreparationTask): { label: string; passed: boolean }[] {
  const s = task.stages
  const common = [
    { label: '已设定教学目标', passed: s.pre.objectives.length > 0 && s.pre.objectives.some((o) => o.trim()) },
    { label: '课前资源已准备', passed: s.pre.resources.length > 0 },
    { label: '课堂活动已设计', passed: s.in.activities.length > 0 },
    { label: '课后作业/拓展已布置', passed: s.post.homework.trim().length > 0 || s.post.extensionResources.length > 0 },
  ]

  if (task.taskType === 'scene') {
    const sp = task.scenePrep
    const subs = sp?.subTaskPreparations || []
    return [
      ...common,
      { label: '已关联实践场景平台', passed: !!sp?.externalPlatformId?.trim() },
      { label: '子任务已拆分（至少1项）', passed: subs.length > 0 },
      { label: '每个子任务有描述', passed: subs.length > 0 && subs.every((s) => s.description?.trim()) },
      { label: '子任务能力点已映射', passed: subs.length > 0 && subs.every((s) => s.abilityPointIds.length > 0) },
      { label: '评价量规已配置', passed: subs.length > 0 && subs.every((s) => s.evaluationRubricId?.trim()) },
      { label: '工位/设备已配置', passed: subs.length > 0 && subs.some((s) => s.workstationId?.trim() || s.equipmentChecklist.length > 0) },
      { label: '安全要求已设定', passed: subs.length > 0 && subs.every((s) => s.safetyRequirements?.trim()) },
      { label: '企业导师排程已安排', passed: subs.length > 0 && subs.every((s) => s.mentorSchedule?.participationType && s.mentorSchedule?.timeSlot) },
    ]
  }

  const cp = task.coursePrep
  return [
    ...common,
    { label: '课程平台已关联', passed: !!cp?.externalPlatformId?.trim() },
    { label: '知识点映射已完成', passed: !!cp && cp.knowledgePointIds.length > 0 },
    { label: '大纲章节已映射', passed: !!cp && cp.syllabusChapterMapping.length > 0 },
  ]
}

// ============ 场景备课特有面板 ============
function ScenePrepPanel({ task, updateTask }: { task: PreparationTask; updateTask: (p: Partial<PreparationTask>) => void }) {
  const sp = task.scenePrep || { subTaskPreparations: [] }
  const [newSubTaskName, setNewSubTaskName] = useState('')
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  const addSubTask = () => {
    if (!newSubTaskName.trim()) return
    const newSub = {
      subTaskId: `sub-${Date.now()}`,
      subTaskName: newSubTaskName.trim(),
      description: '',
      abilityPointIds: [],
      evaluationRubricId: '',
      equipmentChecklist: [],
      safetyRequirements: '',
      enterpriseMentorNotes: '',
    }
    updateTask({
      scenePrep: { ...sp, subTaskPreparations: [...sp.subTaskPreparations, newSub] },
    })
    setNewSubTaskName('')
    setExpandedIdx(sp.subTaskPreparations.length)
  }

  const updateSubTask = (idx: number, patch: any) => {
    const arr = [...sp.subTaskPreparations]
    arr[idx] = { ...arr[idx], ...patch }
    updateTask({ scenePrep: { ...sp, subTaskPreparations: arr } })
  }

  const removeSubTask = (idx: number) => {
    const arr = sp.subTaskPreparations.filter((_, i) => i !== idx)
    updateTask({ scenePrep: { ...sp, subTaskPreparations: arr } })
  }

  const addEquipment = (idx: number, item: string) => {
    const sub = sp.subTaskPreparations[idx]
    if (!item.trim() || sub.equipmentChecklist.includes(item.trim())) return
    updateSubTask(idx, { equipmentChecklist: [...sub.equipmentChecklist, item.trim()] })
  }

  const removeEquipment = (idx: number, item: string) => {
    const sub = sp.subTaskPreparations[idx]
    updateSubTask(idx, { equipmentChecklist: sub.equipmentChecklist.filter((e) => e !== item) })
  }

  return (
    <Card className="shrink-0 border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-purple-700">
            <Beaker className="h-4 w-4" />场景教学细分安排
          </CardTitle>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-purple-500" />
            <Input
              value={sp.externalPlatformId || ''}
              onChange={(e) => updateTask({ scenePrep: { ...sp, externalPlatformId: e.target.value } })}
              placeholder="场景平台ID"
              className="h-7 text-xs w-40"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sp.subTaskPreparations.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-2">暂无子任务，请从下方添加</div>
        )}
        <div className="space-y-2">
          {sp.subTaskPreparations.map((sub, i) => (
            <Collapsible
              key={sub.subTaskId}
              open={expandedIdx === i}
              onOpenChange={(open) => setExpandedIdx(open ? i : null)}
            >
              <div className="rounded-lg border bg-white">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-purple-50/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {expandedIdx === i ? <ChevronDown className="h-4 w-4 text-purple-500" /> : <ChevronRight className="h-4 w-4 text-purple-500" />}
                      <span className="text-sm font-medium">{sub.subTaskName}</span>
                      {sub.mentorSchedule && (
                        <Badge variant="outline" className="text-[10px] h-5 border-purple-300 text-purple-600">
                          <Users className="h-3 w-3 mr-0.5" />
                          {sub.mentorSchedule.participationType === 'onsite' ? '现场' : sub.mentorSchedule.participationType === 'remote' ? '远程' : '异步'}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); removeSubTask(i) }}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-3 border-t pt-3">
                    {/* 子任务描述 */}
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />子任务描述
                      </Label>
                      <Textarea
                        value={sub.description || ''}
                        onChange={(e) => updateSubTask(i, { description: e.target.value })}
                        className="min-h-[40px] text-xs mt-1"
                        placeholder="描述子任务的具体内容、步骤和学生产出要求"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Monitor className="h-3 w-3" />工位/区域
                        </Label>
                        <Input
                          value={sub.workstationId || ''}
                          onChange={(e) => updateSubTask(i, { workstationId: e.target.value })}
                          className="h-8 text-xs mt-1"
                          placeholder="如 A01-A10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Award className="h-3 w-3" />评价量规ID
                        </Label>
                        <Input
                          value={sub.evaluationRubricId || ''}
                          onChange={(e) => updateSubTask(i, { evaluationRubricId: e.target.value })}
                          className="h-8 text-xs mt-1"
                          placeholder="如 er-001"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Layers className="h-3 w-3" />能力点映射
                      </Label>
                      <Input
                        value={sub.abilityPointIds.join(', ')}
                        onChange={(e) => updateSubTask(i, { abilityPointIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                        className="h-8 text-xs mt-1"
                        placeholder="用逗号分隔能力点ID"
                      />
                    </div>

                    {/* 设备清单 */}
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Wrench className="h-3 w-3" />设备清单
                      </Label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {sub.equipmentChecklist.map((item) => (
                          <Badge key={item} variant="outline" className="gap-1 text-xs h-6">
                            {item}
                            <button onClick={() => removeEquipment(i, item)}><X className="h-3 w-3 text-red-500" /></button>
                          </Badge>
                        ))}
                        <EquipmentTagInput onAdd={(v) => addEquipment(i, v)} />
                      </div>
                    </div>

                    {/* 安全要求 */}
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />安全要求
                      </Label>
                      <Textarea
                        value={sub.safetyRequirements}
                        onChange={(e) => updateSubTask(i, { safetyRequirements: e.target.value })}
                        className="min-h-[40px] text-xs mt-1"
                        placeholder="描述安全操作规范和注意事项"
                        rows={2}
                      />
                    </div>

                    {/* 企业导师排程 */}
                    <div className="rounded-lg border border-purple-100 bg-purple-50/30 p-3 space-y-2">
                      <Label className="text-xs text-purple-700 font-medium flex items-center gap-1">
                        <HardHat className="h-3 w-3" />企业导师排程
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground">参与类型</span>
                          <select
                            value={sub.mentorSchedule?.participationType || ''}
                            onChange={(e) => updateSubTask(i, {
                              mentorSchedule: {
                                ...(sub.mentorSchedule || { timeSlot: '' }),
                                participationType: e.target.value as 'onsite' | 'remote' | 'async',
                              }
                            })}
                            className="h-8 text-xs w-full rounded border px-2 mt-0.5"
                          >
                            <option value="">请选择</option>
                            <option value="onsite">现场指导</option>
                            <option value="remote">远程连线</option>
                            <option value="async">异步评审</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">时间窗口</span>
                          <Input
                            value={sub.mentorSchedule?.timeSlot || ''}
                            onChange={(e) => updateSubTask(i, {
                              mentorSchedule: {
                                ...(sub.mentorSchedule || { participationType: 'onsite' }),
                                timeSlot: e.target.value,
                              }
                            })}
                            className="h-8 text-xs mt-0.5"
                            placeholder="如 第3-4节"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">导师备注</span>
                        <Input
                          value={sub.enterpriseMentorNotes}
                          onChange={(e) => updateSubTask(i, { enterpriseMentorNotes: e.target.value })}
                          className="h-8 text-xs mt-0.5"
                          placeholder="导师重点关注事项、特殊要求等"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSubTaskName}
            onChange={(e) => setNewSubTaskName(e.target.value)}
            placeholder="输入子任务名称，回车添加"
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addSubTask()}
          />
          <Button variant="outline" size="sm" className="h-8" onClick={addSubTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EquipmentTagInput({ onAdd }: { onAdd: (v: string) => void }) {
  const [val, setVal] = useState('')
  return (
    <div className="flex items-center gap-1">
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="添加设备"
        className="h-6 text-xs w-24 px-1.5 py-0"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onAdd(val)
            setVal('')
          }
        }}
      />
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { onAdd(val); setVal('') }}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}

// ============ 课程备课特有面板 ============
function CoursePrepPanel({ task, updateTask }: { task: PreparationTask; updateTask: (p: Partial<PreparationTask>) => void }) {
  const cp = task.coursePrep || { knowledgePointIds: [], syllabusChapterMapping: [] }

  return (
    <Card className="shrink-0 border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
            <BookOpen className="h-4 w-4" />课程备课信息
          </CardTitle>
          <div className="flex items-center gap-2">
            <Link2 className="h-3.5 w-3.5 text-blue-500" />
            <Input
              value={cp.externalPlatformId || ''}
              onChange={(e) => updateTask({ coursePrep: { ...cp, externalPlatformId: e.target.value } })}
              placeholder="课程平台ID，用于进度同步"
              className="h-7 text-xs w-48"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">关联知识点（逗号分隔）</Label>
            <Input
              value={cp.knowledgePointIds.join(', ')}
              onChange={(e) => updateTask({ coursePrep: { ...cp, knowledgePointIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })}
              className="h-8 text-xs mt-1"
              placeholder="如 KP001, KP002"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">关联教材/参考书</Label>
            <Input
              className="h-8 text-xs mt-1"
              placeholder="可选，如《C程序设计》第3版"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">大纲章节映射</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {cp.syllabusChapterMapping.map((m, i) => (
              <Badge key={i} variant="outline" className="gap-1">
                第{m.sessionIndex}次课 → 章节{m.chapterId}
                <button onClick={() => {
                  const arr = cp.syllabusChapterMapping.filter((_, idx) => idx !== i)
                  updateTask({ coursePrep: { ...cp, syllabusChapterMapping: arr } })
                }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
              const arr = [...cp.syllabusChapterMapping, { chapterId: '', sessionIndex: cp.syllabusChapterMapping.length + 1 }]
              updateTask({ coursePrep: { ...cp, syllabusChapterMapping: arr } })
            }}>
              <Plus className="h-3 w-3 mr-1" />添加映射
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============ 课前准备面板 ============
function PrepStagePanel({ stage, onChange, isScene }: { stage: any; onChange: (p: any) => void; isScene: boolean }) {
  const [newResName, setNewResName] = useState('')
  const [newResType, setNewResType] = useState<PreparationResource['type']>('document')

  const addResource = () => {
    if (!newResName.trim()) return
    const res: PreparationResource = {
      id: `res-${Date.now()}`,
      name: newResName.trim(),
      type: newResType,
      stage: 'pre',
    }
    onChange({ resources: [...stage.resources, res] })
    setNewResName('')
  }

  const removeResource = (id: string) => {
    onChange({ resources: stage.resources.filter((r: PreparationResource) => r.id !== id) })
  }

  const resourceTypeIcon = (type: PreparationResource['type']) => {
    switch (type) {
      case 'ppt': return <FileText className="h-4 w-4 text-orange-500" />
      case 'video': return <Video className="h-4 w-4 text-red-500" />
      case 'link': return <Link2 className="h-4 w-4 text-blue-500" />
      case 'scene_link': return <Beaker className="h-4 w-4 text-purple-500" />
      default: return <FileText className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-3 pb-2">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">教学目标</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={stage.objectives.join('\n')}
            onChange={(e) => onChange({ objectives: e.target.value.split('\n').filter(Boolean) })}
            rows={3}
            placeholder={isScene ? '每行一个任务目标（知识、技能、素养）' : '每行一个教学目标（知识目标、能力目标、素养目标）'}
          />
          {!isScene && (
            <div className="flex gap-2 mt-2">
              {['知识', '能力', '素养'].map((dim) => (
                <Badge key={dim} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() => {
                    const newObj = stage.objectives.includes(`${dim}目标：`) ? stage.objectives : [...stage.objectives, `${dim}目标：`]
                    onChange({ objectives: newObj })
                  }}>
                  + {dim}目标
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">导学方案</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={stage.guidePlan}
            onChange={(e) => onChange({ guidePlan: e.target.value })}
            rows={4}
            placeholder={isScene ? '描述场景导入方式和角色设定' : '描述课前导学方案'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">课前资源</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={newResType}
                onChange={(e) => setNewResType(e.target.value as PreparationResource['type'])}
                className="h-8 text-xs rounded border px-2"
              >
                <option value="document">文档</option>
                <option value="video">视频</option>
                <option value="ppt">PPT</option>
                <option value="link">链接</option>
                {isScene && <option value="scene_link">场景链接</option>}
              </select>
              <Input
                value={newResName}
                onChange={(e) => setNewResName(e.target.value)}
                placeholder="资源名称，回车添加"
                className="h-8 text-xs w-40"
                onKeyDown={(e) => e.key === 'Enter' && addResource()}
              />
              <Button variant="outline" size="sm" className="h-8" onClick={addResource}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stage.resources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">暂无资源，请添加</p>
          ) : (
            <div className="space-y-2">
              {stage.resources.map((res: PreparationResource) => (
                <div key={res.id} className="flex items-center gap-3 rounded-lg border p-2">
                  {resourceTypeIcon(res.type)}
                  <span className="text-sm flex-1">{res.name}</span>
                  <Badge variant="outline" className="text-xs">{res.type}</Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeResource(res.id)}>
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ============ 课堂实施面板 ============
function InStagePanel({ stage, onChange, isScene }: { stage: any; onChange: (p: any) => void; isScene: boolean }) {
  const [newActName, setNewActName] = useState('')

  const addActivity = () => {
    if (!newActName.trim()) return
    const act: PreparationActivity = {
      id: `act-${Date.now()}`,
      name: newActName.trim(),
      type: isScene ? 'practice' : 'discussion',
      description: '',
      duration: 15,
      stage: 'in',
    }
    onChange({ activities: [...stage.activities, act] })
    setNewActName('')
  }

  const updateActivity = (idx: number, patch: any) => {
    const arr = [...stage.activities]
    arr[idx] = { ...arr[idx], ...patch }
    onChange({ activities: arr })
  }

  const removeActivity = (idx: number) => {
    onChange({ activities: stage.activities.filter((_: any, i: number) => i !== idx) })
  }

  return (
    <div className="space-y-3 pb-2">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">课堂{isScene ? '任务' : '活动'}设计</CardTitle>
            <div className="flex gap-2">
              <Input
                value={newActName}
                onChange={(e) => setNewActName(e.target.value)}
                placeholder={`${isScene ? '任务' : '活动'}名称，回车添加`}
                className="h-8 text-xs w-48"
                onKeyDown={(e) => e.key === 'Enter' && addActivity()}
              />
              <Button variant="outline" size="sm" className="h-8" onClick={addActivity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stage.activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">暂无{isScene ? '任务' : '活动'}，请添加</p>
          ) : (
            <div className="space-y-2">
              {stage.activities.map((act: PreparationActivity, i: number) => (
                <div key={act.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={act.name}
                      onChange={(e) => updateActivity(i, { name: e.target.value })}
                      className="h-7 text-sm font-medium w-48"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={act.duration}
                        onChange={(e) => updateActivity(i, { duration: Number(e.target.value) })}
                        className="h-7 text-xs w-16"
                      />
                      <span className="text-xs text-muted-foreground">分钟</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeActivity(i)}>
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={act.description}
                    onChange={(e) => updateActivity(i, { description: e.target.value })}
                    className="min-h-[40px] text-xs"
                    placeholder="描述说明"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">课堂资源</CardTitle></CardHeader>
        <CardContent>
          {stage.coursewareResources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">暂无课件</p>
          ) : (
            <div className="space-y-2">
              {stage.coursewareResources.map((res: PreparationResource) => (
                <div key={res.id} className="flex items-center gap-3 rounded-lg border p-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span className="text-sm flex-1">{res.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">{isScene ? '测评要点' : '讨论话题'}</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={isScene ? stage.quizQuestions.join('\n') : stage.discussionTopics.join('\n')}
            onChange={(e) => onChange(isScene ? { quizQuestions: e.target.value.split('\n').filter(Boolean) } : { discussionTopics: e.target.value.split('\n').filter(Boolean) })}
            rows={3}
            placeholder={isScene ? '每行一个测评要点或评价维度' : '每行一个讨论话题'}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// ============ 课后拓展面板 ============
function PostStagePanel({ stage, onChange, isScene }: { stage: any; onChange: (p: any) => void; isScene: boolean }) {
  return (
    <div className="space-y-3 pb-2">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">课后{isScene ? '复盘' : '作业'}</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={stage.homework}
            onChange={(e) => onChange({ homework: e.target.value })}
            rows={4}
            placeholder={isScene ? '描述场景任务完成后的复盘要求和能力评价方式' : '描述课后作业要求'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">拓展资源</CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
              const res: PreparationResource = {
                id: `res-${Date.now()}`,
                name: '新资源',
                type: 'link',
                stage: 'post',
              }
              onChange({ extensionResources: [...stage.extensionResources, res] })
            }}>
              <Plus className="h-3 w-3 mr-1" />添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stage.extensionResources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">暂无拓展资源</p>
          ) : (
            <div className="space-y-2">
              {stage.extensionResources.map((res: PreparationResource) => (
                <div key={res.id} className="flex items-center gap-3 rounded-lg border p-2">
                  <Video className="h-4 w-4 text-red-500" />
                  <Input
                    value={res.name}
                    onChange={(e) => {
                      const arr = stage.extensionResources.map((r: PreparationResource) => r.id === res.id ? { ...r, name: e.target.value } : r)
                      onChange({ extensionResources: arr })
                    }}
                    className="h-7 text-sm flex-1"
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    const arr = stage.extensionResources.filter((r: PreparationResource) => r.id !== res.id)
                    onChange({ extensionResources: arr })
                  }}>
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
