'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { ArrowLeft, Save, CheckCircle2, BookOpen, Beaker, Lightbulb, Puzzle, ClipboardList, Plus, X, FileText, Video, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { preparationTasks, type PreparationTask, type PreparationResource } from '@/lib/mock-data'

export default function TeacherPreparationDetailPage() {
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
        <Button variant="outline" className="mt-4" onClick={() => router.push('/teacher/preparation')}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回
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
    updateTask({ status: 'completed', progress: 100 })
    toast.success('备课已提交，状态更新为「已完成」')
  }

  // 检查清单
  const checklist = [
    { label: '已设定教学目标', passed: task.stages.pre.objectives.length > 0 && task.stages.pre.objectives.some((o) => o.trim()) },
    { label: '课前资源已准备', passed: task.stages.pre.resources.length > 0 },
    { label: '课堂活动已设计', passed: task.stages.in.activities.length > 0 },
    { label: '课后作业已布置', passed: task.stages.post.homework.trim().length > 0 },
  ]
  const completedCount = checklist.filter((c) => c.passed).length
  const allPassed = completedCount === checklist.length

  return (
    <div className="space-y-4 p-4">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/teacher/preparation')}>
            <ArrowLeft className="h-4 w-4 mr-1" />返回
          </Button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              {isScene ? <Beaker className="h-5 w-5 text-purple-600" /> : <BookOpen className="h-5 w-5 text-blue-600" />}
              {task.taskName}
              <Badge variant={isScene ? 'secondary' : 'outline'} className={isScene ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                {isScene ? '场景教学' : '传统教学'}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground">{task.courseName} · {task.className}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-1" />保存</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!allPassed}>
            <CheckCircle2 className="h-4 w-4 mr-1" />{allPassed ? '提交备课' : `待完成 ${checklist.length - completedCount} 项`}
          </Button>
        </div>
      </div>

      {/* 进度 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">备课进度</span>
            <span className="text-sm text-muted-foreground">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </CardContent>
      </Card>

      {/* 三阶段备课 */}
      <Tabs defaultValue="pre" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pre"><Lightbulb className="h-4 w-4 mr-1" />课前准备</TabsTrigger>
          <TabsTrigger value="in"><Puzzle className="h-4 w-4 mr-1" />课堂实施</TabsTrigger>
          <TabsTrigger value="post"><ClipboardList className="h-4 w-4 mr-1" />课后拓展</TabsTrigger>
        </TabsList>

        <TabsContent value="pre">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">教学目标</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={task.stages.pre.objectives.join('\n')} onChange={(e) => updateStages('pre', { objectives: e.target.value.split('\n').filter(Boolean) })} rows={4} placeholder="每行一个教学目标" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">导学方案</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={task.stages.pre.guidePlan} onChange={(e) => updateStages('pre', { guidePlan: e.target.value })} rows={4} placeholder="描述课前导学方案" />
              </CardContent>
            </Card>
            <PrepResourcesCard resources={task.stages.pre.resources} onChange={(resources) => updateStages('pre', { resources })} />
          </div>
        </TabsContent>

        <TabsContent value="in">
          <div className="space-y-4">
            <InActivitiesCard activities={task.stages.in.activities} onChange={(activities) => updateStages('in', { activities })} />
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">课堂讨论/测评要点</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={isScene ? task.stages.in.quizQuestions.join('\n') : task.stages.in.discussionTopics.join('\n')} onChange={(e) => updateStages('in', isScene ? { quizQuestions: e.target.value.split('\n').filter(Boolean) } : { discussionTopics: e.target.value.split('\n').filter(Boolean) })} rows={4} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="post">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">课后作业</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={task.stages.post.homework} onChange={(e) => updateStages('post', { homework: e.target.value })} rows={4} placeholder="描述课后作业要求" />
              </CardContent>
            </Card>
            <PostResourcesCard resources={task.stages.post.extensionResources} onChange={(extensionResources) => updateStages('post', { extensionResources })} />
          </div>
        </TabsContent>
      </Tabs>

      {/* 检查清单 */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">备课检查清单（已完成 {completedCount}/{checklist.length}）</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {checklist.map((item, i) => (
            <div key={i} className={cn('flex items-start gap-2 text-sm rounded-lg p-2 border', item.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200')}>
              {item.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <X className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
              <span className={item.passed ? 'text-emerald-700' : 'text-amber-700'}>{item.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// 课前资源卡片
function PrepResourcesCard({ resources, onChange }: { resources: PreparationResource[]; onChange: (r: PreparationResource[]) => void }) {
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<PreparationResource['type']>('document')

  const add = () => {
    if (!newName.trim()) return
    onChange([...resources, { id: `res-${Date.now()}`, name: newName.trim(), type: newType, stage: 'pre' }])
    setNewName('')
  }

  const remove = (id: string) => onChange(resources.filter((r) => r.id !== id))

  const icon = (type: string) => {
    switch (type) { case 'ppt': return <FileText className="h-4 w-4 text-orange-500" />; case 'video': return <Video className="h-4 w-4 text-red-500" />; case 'link': return <Link2 className="h-4 w-4 text-blue-500" />; default: return <FileText className="h-4 w-4 text-slate-500" />; }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">课前资源</CardTitle>
          <div className="flex items-center gap-2">
            <select value={newType} onChange={(e) => setNewType(e.target.value as PreparationResource['type'])} className="h-8 text-xs rounded border px-2">
              <option value="document">文档</option><option value="video">视频</option><option value="ppt">PPT</option><option value="link">链接</option>
            </select>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="资源名称，回车添加" className="h-8 text-xs w-40" onKeyDown={(e) => e.key === 'Enter' && add()} />
            <Button variant="outline" size="sm" className="h-8" onClick={add}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">暂无资源</p> : (
          <div className="space-y-2">
            {resources.map((res) => (
              <div key={res.id} className="flex items-center gap-3 rounded-lg border p-2">
                {icon(res.type)}
                <span className="text-sm flex-1">{res.name}</span>
                <Badge variant="outline" className="text-xs">{res.type}</Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(res.id)}><X className="h-3 w-3 text-red-500" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 课堂活动卡片
function InActivitiesCard({ activities, onChange }: { activities: any[]; onChange: (a: any[]) => void }) {
  const [newName, setNewName] = useState('')

  const add = () => {
    if (!newName.trim()) return
    onChange([...activities, { id: `act-${Date.now()}`, name: newName.trim(), type: 'discussion', description: '', duration: 15, stage: 'in' }])
    setNewName('')
  }

  const update = (idx: number, patch: any) => {
    const arr = [...activities]
    arr[idx] = { ...arr[idx], ...patch }
    onChange(arr)
  }

  const remove = (idx: number) => onChange(activities.filter((_, i) => i !== idx))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">课堂活动设计</CardTitle>
          <div className="flex gap-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="活动名称，回车添加" className="h-8 text-xs w-48" onKeyDown={(e) => e.key === 'Enter' && add()} />
            <Button variant="outline" size="sm" className="h-8" onClick={add}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">暂无活动</p> : (
          <div className="space-y-2">
            {activities.map((act, i) => (
              <div key={act.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Input value={act.name} onChange={(e) => update(i, { name: e.target.value })} className="h-7 text-sm font-medium w-48" />
                  <div className="flex items-center gap-2">
                    <Input type="number" value={act.duration} onChange={(e) => update(i, { duration: Number(e.target.value) })} className="h-7 text-xs w-16" />
                    <span className="text-xs text-muted-foreground">分钟</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(i)}><X className="h-3 w-3 text-red-500" /></Button>
                  </div>
                </div>
                <Textarea value={act.description} onChange={(e) => update(i, { description: e.target.value })} className="min-h-[40px] text-xs" placeholder="描述说明" rows={2} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 课后拓展资源
function PostResourcesCard({ resources, onChange }: { resources: PreparationResource[]; onChange: (r: PreparationResource[]) => void }) {
  const add = () => {
    onChange([...resources, { id: `res-${Date.now()}`, name: '新资源', type: 'link', stage: 'post' }])
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">拓展资源</CardTitle>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={add}><Plus className="h-3 w-3 mr-1" />添加</Button>
        </div>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">暂无拓展资源</p> : (
          <div className="space-y-2">
            {resources.map((res) => (
              <div key={res.id} className="flex items-center gap-3 rounded-lg border p-2">
                <Video className="h-4 w-4 text-red-500" />
                <Input value={res.name} onChange={(e) => onChange(resources.map((r) => r.id === res.id ? { ...r, name: e.target.value } : r))} className="h-7 text-sm flex-1" />
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onChange(resources.filter((r) => r.id !== res.id))}><X className="h-3 w-3 text-red-500" /></Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
