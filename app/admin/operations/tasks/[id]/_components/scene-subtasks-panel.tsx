'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Beaker,
  ChevronDown,
  ChevronRight,
  Wrench,
  Users,
  Clock,
  MapPin,
  HardHat,
  Award,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { SceneSubTask } from '@/lib/mock-data'

interface SceneSubTasksPanelProps {
  subTasks: SceneSubTask[]
  onUpdate?: (subTasks: SceneSubTask[]) => void
  readOnly?: boolean
}

export default function SceneSubTasksPanel({ subTasks, onUpdate, readOnly = false }: SceneSubTasksPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(subTasks[0]?.id || null)
  const [editingProgress, setEditingProgress] = useState<Record<string, boolean>>({})

  const updateSubTask = (id: string, patch: Partial<SceneSubTask>) => {
    if (!onUpdate || readOnly) return
    const updated = subTasks.map((s) => (s.id === id ? { ...s, ...patch } : s))
    onUpdate(updated)
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    planned: { label: '计划中', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Circle },
    in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Play },
    completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  }

  const mentorTypeLabel: Record<string, string> = {
    full: '全程参与',
    partial: '部分参与',
    remote: '远程指导',
  }

  const mentorTypeColor: Record<string, string> = {
    full: 'bg-purple-100 text-purple-700 border-purple-300',
    partial: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    remote: 'bg-sky-100 text-sky-700 border-sky-300',
  }

  return (
    <Card className="border-purple-200 bg-purple-50/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-purple-700">
            <Beaker className="h-5 w-5" />
            场景子任务
            <Badge variant="outline" className="text-xs ml-1">{subTasks.length} 项</Badge>
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            已完成 {subTasks.filter((s) => s.status === 'completed').length}/{subTasks.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {subTasks.map((sub) => {
          const cfg = statusConfig[sub.status] || statusConfig.planned
          const StatusIcon = cfg.icon
          const isExpanded = expandedId === sub.id
          const isEditingProgress = editingProgress[sub.id]

          return (
            <Collapsible
              key={sub.id}
              open={isExpanded}
              onOpenChange={(open) => setExpandedId(open ? sub.id : null)}
            >
              <div className="rounded-lg border bg-white overflow-hidden">
                {/* Header */}
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-50/30 transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-purple-500 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-purple-500 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{sub.name}</span>
                        <Badge variant="outline" className={cn('text-[10px] h-5', cfg.color)}>
                          <StatusIcon className="h-3 w-3 mr-0.5" />
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Users className="h-3 w-3" />
                          {sub.facultyName || '未分配'}
                        </span>
                        {sub.enterpriseMentorName && (
                          <span className="flex items-center gap-0.5">
                            <HardHat className="h-3 w-3" />
                            {sub.enterpriseMentorName}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {sub.workStationName || sub.workStationId || '未分配'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {sub.progress && (
                        <div className="flex items-center gap-2 w-32">
                          <Progress value={sub.progress.completionRate} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-8 text-right">{sub.progress.completionRate}%</span>
                        </div>
                      )}
                      {!readOnly && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {sub.status === 'planned' && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { updateSubTask(sub.id, { status: 'in_progress' }); toast.success('子任务已标记为进行中') }}>
                              <Play className="h-3 w-3 mr-0.5" />开始
                            </Button>
                          )}
                          {sub.status === 'in_progress' && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { updateSubTask(sub.id, { status: 'completed' }); toast.success('子任务已标记为完成') }}>
                              <CheckCircle2 className="h-3 w-3 mr-0.5" />完成
                            </Button>
                          )}
                          {sub.status === 'completed' && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { updateSubTask(sub.id, { status: 'in_progress' }); toast.success('子任务已重置为进行中') }}>
                              <RotateCcw className="h-3 w-3 mr-0.5" />重置
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Expanded Content */}
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-2 border-t space-y-3">
                    {/* 基本信息网格 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-0.5 flex items-center gap-1">
                          <Users className="h-3 w-3" />负责教师
                        </p>
                        <p className="font-medium">{sub.facultyName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5 flex items-center gap-1">
                          <HardHat className="h-3 w-3" />企业导师
                        </p>
                        <p className="font-medium">{sub.enterpriseMentorName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />工位/区域
                        </p>
                        <p className="font-medium">{sub.workStationName || sub.workStationId || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-0.5 flex items-center gap-1">
                          <Award className="h-3 w-3" />场景平台任务
                        </p>
                        <p className="font-medium">{sub.scenePlatformTaskId}</p>
                      </div>
                    </div>

                    {/* 导师参与类型 */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">导师参与方式：</span>
                      <Badge variant="outline" className={cn('text-[10px] h-5', mentorTypeColor[sub.mentorParticipationType])}>
                        {mentorTypeLabel[sub.mentorParticipationType]}
                      </Badge>
                    </div>

                    {/* 时间窗口 */}
                    {sub.mentorTimeSlots && sub.mentorTimeSlots.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />导师排程
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.mentorTimeSlots.map((slot, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] h-5 border-purple-200 text-purple-600">
                              {slot.date} {slot.period}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 设备清单 */}
                    {sub.equipmentList && sub.equipmentList.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Wrench className="h-3 w-3" />设备清单
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.equipmentList.map((item) => (
                            <Badge key={item} variant="secondary" className="text-[10px] h-5 bg-slate-100">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 进度编辑 */}
                    {sub.status === 'in_progress' && !readOnly && (
                      <div className="flex items-center gap-3 rounded-lg bg-blue-50/50 border border-blue-100 p-2">
                        <span className="text-xs text-blue-700 font-medium">更新进度：</span>
                        {isEditingProgress ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              defaultValue={sub.progress?.completionRate || 0}
                              className="h-7 text-xs w-20"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = Number((e.target as HTMLInputElement).value)
                                  updateSubTask(sub.id, {
                                    progress: {
                                      completionRate: Math.min(100, Math.max(0, val)),
                                      syncAt: new Date().toISOString(),
                                    },
                                  })
                                  setEditingProgress((prev) => ({ ...prev, [sub.id]: false }))
                                  toast.success('进度已更新')
                                }
                              }}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-blue-600"
                            onClick={() => setEditingProgress((prev) => ({ ...prev, [sub.id]: true }))}
                          >
                            编辑进度
                          </Button>
                        )}
                      </div>
                    )}

                    {/* 同步时间 */}
                    {sub.progress?.syncAt && (
                      <p className="text-[10px] text-muted-foreground text-right">
                        上次同步: {new Date(sub.progress.syncAt).toLocaleString('zh-CN')}
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )
        })}
      </CardContent>
    </Card>
  )
}
