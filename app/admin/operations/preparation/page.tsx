'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  ClipboardList,
  BookOpen,
  Beaker,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Edit3,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { preparationTasks, faculty, type PreparationTask } from '@/lib/mock-data'

export default function PreparationPage() {
  const router = useRouter()
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredTasks = useMemo(() => {
    let list = preparationTasks
    if (selectedFacultyId !== 'all') {
      list = list.filter((t) => t.facultyId === selectedFacultyId)
    }
    if (activeTab !== 'all') {
      list = list.filter((t) => t.status === activeTab)
    }
    if (typeFilter !== 'all') {
      list = list.filter((t) => t.taskType === typeFilter)
    }
    return list
  }, [selectedFacultyId, activeTab, typeFilter])

  const stats = useMemo(() => {
    const total = preparationTasks.length
    const pending = preparationTasks.filter((t) => t.status === 'pending').length
    const inProgress = preparationTasks.filter((t) => t.status === 'in_progress').length
    const completed = preparationTasks.filter((t) => t.status === 'completed').length
    return { total, pending, inProgress, completed }
  }, [])

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: '待备课', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Clock },
    in_progress: { label: '备课中', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Edit3 },
    completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* 左侧筛选 */}
      <div className="w-64 shrink-0 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              教师筛选
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              className={cn('w-full text-left px-2 py-1.5 rounded text-sm transition-colors', selectedFacultyId === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')}
              onClick={() => setSelectedFacultyId('all')}
            >全部教师</button>
            {faculty.map((f) => (
              <button key={f.id} className={cn('w-full text-left px-2 py-1.5 rounded text-sm transition-colors', selectedFacultyId === f.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')}
                onClick={() => setSelectedFacultyId(f.id)}>{f.name} ({f.title})</button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 主内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              备课中心
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              统一管理课程备课与场景备课任务
            </p>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-blue-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">备课总数</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-muted-foreground">待备课</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-muted-foreground">备课中</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-muted-foreground">已完成</span>
              </div>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* 类型 + 状态筛选 */}
        <div className="flex items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">全部状态</TabsTrigger>
              <TabsTrigger value="pending">待备课</TabsTrigger>
              <TabsTrigger value="in_progress">备课中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              className={cn('px-3 py-1.5 text-sm rounded-md transition-colors', typeFilter === 'all' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}
              onClick={() => setTypeFilter('all')}
            >全部类型</button>
            <button
              className={cn('px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1', typeFilter === 'traditional' ? 'bg-background shadow-sm font-medium text-blue-600' : 'text-muted-foreground hover:text-foreground')}
              onClick={() => setTypeFilter('traditional')}
            ><BookOpen className="h-3.5 w-3.5" />传统教学</button>
            <button
              className={cn('px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1', typeFilter === 'scene' ? 'bg-background shadow-sm font-medium text-purple-600' : 'text-muted-foreground hover:text-foreground')}
              onClick={() => setTypeFilter('scene')}
            ><Beaker className="h-3.5 w-3.5" />场景教学</button>
          </div>
        </div>

        {/* 备课任务列表 */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const status = statusConfig[task.status]
            const StatusIcon = status.icon
            return (
              <Card key={task.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-muted', task.taskType === 'scene' ? 'text-purple-600' : 'text-blue-600')}>
                        {task.taskType === 'scene' ? <Beaker className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{task.taskName}</h3>
                          <Badge className={cn('text-xs', status.color)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                          {task.taskType === 'scene' ? (
                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">场景</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">传统</Badge>
                          )}
                          {task.status !== 'completed' && <MissingItemsBadge task={task} />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {task.courseName} · {task.className} · 教师：{task.facultyName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <Progress value={task.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right mt-1">{task.progress}%</p>
                      </div>
                      <Button size="sm" onClick={() => router.push(`/admin/operations/preparation/${task.id}`)}>
                        {task.status === 'completed' ? '查看' : '备课'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-3 opacity-30" />
              <p>暂无备课任务</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MissingItemsBadge({ task }: { task: PreparationTask }) {
  const missing: string[] = []
  const s = task.stages

  if (!s.pre.objectives.some((o) => o.trim())) missing.push('缺教学目标')
  if (s.pre.resources.length === 0) missing.push('缺课前资源')
  if (s.in.activities.length === 0) missing.push('缺课堂活动')
  if (!s.post.homework.trim() && s.post.extensionResources.length === 0) missing.push('缺课后拓展')

  if (task.taskType === 'scene') {
    const sp = task.scenePrep
    if (!sp || sp.subTaskPreparations.length === 0) missing.push('缺子任务')
    else {
      if (sp.subTaskPreparations.some((sub) => !sub.safetyRequirements)) missing.push('缺安全要求')
    }
  } else {
    const cp = task.coursePrep
    if (!cp || cp.knowledgePointIds.length === 0) missing.push('缺知识点')
  }

  if (missing.length === 0) return null

  return (
    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
      <AlertCircle className="h-3 w-3 mr-1" />
      {missing.slice(0, 2).join('、')}{missing.length > 2 ? `等${missing.length}项` : ''}
    </Badge>
  )
}
