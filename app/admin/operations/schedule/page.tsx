'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Upload,
  Plus,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Settings2,
  Eye,
  FileSpreadsheet,
  X,
  FileText,
  Video,
  Link2,
  GraduationCap,
  BarChart3,
  MapPin,
  Pencil,
} from 'lucide-react'
import { tasks, classes, faculty, venues, type Task, type TaskStatus, type TaskType } from '@/lib/mock-data'

// ---- 状态映射 ----
const statusMap: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  ready: { label: '待就绪', variant: 'outline' },
  published: { label: '已发布', variant: 'default' },
  in_progress: { label: '进行中', variant: 'default' },
  evaluating: { label: '评定中', variant: 'outline' },
  completed: { label: '已完成', variant: 'default' },
  archived: { label: '已归档', variant: 'secondary' },
}

const typeMap: Record<TaskType, string> = {
  traditional: '传统教学',
  scene: '场景教学',
}

// ---- 统计卡片 ----
function StatCard({ title, count, icon: Icon, color }: { title: string; count: number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className={`rounded-full p-2 ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardContent>
    </Card>
  )
}

// ---- 课表网格 ----
const days = ['周一', '周二', '周三', '周四', '周五']
const periods = ['1-2节', '3-4节', '5-6节', '7-8节']

// 冲突检测：仅检测教师/场地/班级在同一时间段是否有冲突
function detectConflicts(
  task: Task,
  allTasks: Task[],
  newDayOfWeek?: number,
  newPeriod?: string,
  newVenueId?: string,
  newFacultyId?: string
) {
  const conflicts: { type: 'teacher' | 'venue' | 'class'; with: string; taskName: string }[] = []
  const targetDay = newDayOfWeek ?? task.dayOfWeek
  const targetPeriod = newPeriod ?? task.period
  const targetVenue = newVenueId ?? task.venueId
  const targetFaculty = newFacultyId ?? task.facultyId
  const targetClass = task.classId

  for (const t of allTasks) {
    if (t.id === task.id) continue
    if (t.dayOfWeek !== targetDay || t.period !== targetPeriod) continue

    if (t.facultyId === targetFaculty) {
      conflicts.push({ type: 'teacher', with: t.facultyName, taskName: t.courseName })
    }
    if (t.venueId === targetVenue) {
      conflicts.push({ type: 'venue', with: t.venueName, taskName: t.courseName })
    }
    if (t.classId === targetClass) {
      conflicts.push({ type: 'class', with: t.className, taskName: t.courseName })
    }
  }

  return conflicts
}

function ScheduleGrid({
  taskList,
  allTasks,
  onEditTask,
}: {
  taskList: Task[]
  allTasks: Task[]
  onEditTask: (task: Task) => void
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-6 bg-muted">
        <div className="p-3 text-sm font-medium border-r">节次 / 星期</div>
        {days.map((d) => (
          <div key={d} className="p-3 text-sm font-medium text-center border-r last:border-r-0">{d}</div>
        ))}
      </div>
      {periods.map((p) => (
        <div key={p} className="grid grid-cols-6 border-t">
          <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{p}</div>
          {[1, 2, 3, 4, 5].map((d) => {
            const task = taskList.find((e) => e.dayOfWeek === d && e.period === p)
            const conflicts = task ? detectConflicts(task, allTasks) : []
            const hasConflict = conflicts.length > 0
            return (
              <div key={d} className="p-2 border-r last:border-r-0 min-h-[80px]">
                {task && (
                  <button
                    onClick={() => onEditTask(task)}
                    className={`w-full text-left rounded p-2 text-xs space-y-1 transition-all hover:shadow-sm hover:scale-[1.02] cursor-pointer ${
                      hasConflict
                        ? 'bg-red-50 border border-red-200'
                        : task.type === 'scene'
                          ? 'bg-orange-50 border border-orange-100'
                          : 'bg-primary/5 border border-transparent'
                    }`}
                  >
                    <div className="font-medium truncate flex items-center justify-between">
                      {task.courseName}
                      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </div>
                    <div className="text-muted-foreground">{task.facultyName}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {task.venueName}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {task.type === 'scene' && (
                        <Badge variant="outline" className="text-[10px] h-4 border-orange-200 text-orange-600">
                          场景
                        </Badge>
                      )}
                      {hasConflict && (
                        <Badge variant="outline" className="text-[10px] h-4 border-red-200 text-red-600">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                          冲突
                        </Badge>
                      )}
                    </div>
                    {hasConflict && (
                      <div className="text-[10px] text-red-600 space-y-0.5">
                        {conflicts.map((c, i) => (
                          <div key={i}>
                            {c.type === 'teacher' && `教师冲突：${c.with}（${c.taskName}）`}
                            {c.type === 'venue' && `场地冲突：${c.with}（${c.taskName}）`}
                            {c.type === 'class' && `班级冲突：${c.with}（${c.taskName}）`}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ---- 新建任务对话框 ----
function CreateTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            新建任务
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>课程名称</Label>
                <Input placeholder="输入课程名称" />
              </div>
              <div className="space-y-2">
                <Label>课程编码</Label>
                <Input placeholder="输入课程编码" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>任务类型</Label>
                <Select defaultValue="traditional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">传统教学</SelectItem>
                    <SelectItem value="scene">场景教学</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>班级</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择班级" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>主讲教师</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择教师" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name} ({f.title})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>星期</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">周一</SelectItem>
                    <SelectItem value="2">周二</SelectItem>
                    <SelectItem value="3">周三</SelectItem>
                    <SelectItem value="4">周四</SelectItem>
                    <SelectItem value="5">周五</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>节次</Label>
                <Select defaultValue="1-2节">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2节">1-2节</SelectItem>
                    <SelectItem value="3-4节">3-4节</SelectItem>
                    <SelectItem value="5-6节">5-6节</SelectItem>
                    <SelectItem value="7-8节">7-8节</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>周次</Label>
                <Input defaultValue="1-16周" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>上课场地</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择场地" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>教学目标</Label>
              <Textarea placeholder="输入教学目标或任务说明..." rows={3} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>创建任务</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- 查看任务详情对话框 ----
function TaskDetailDialog({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  if (!task) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            任务详情 — {task.courseName}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 py-2">
            {/* 基本信息 */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{typeMap[task.type]}</div>
                  <div className="text-xs text-muted-foreground">任务类型</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{statusMap[task.status].label}</div>
                  <div className="text-xs text-muted-foreground">当前状态</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{task.className}</div>
                  <div className="text-xs text-muted-foreground">班级</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold">{task.facultyName}</div>
                  <div className="text-xs text-muted-foreground">主讲教师</div>
                </CardContent>
              </Card>
            </div>

            {/* 时空信息 */}
            <div className="space-y-2">
              <Label className="font-medium">上课安排</Label>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="border rounded-lg p-3">
                  <div className="text-muted-foreground">时间</div>
                  <div className="font-medium">周{task.dayOfWeek} {task.period}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-muted-foreground">周次</div>
                  <div className="font-medium">{task.weeks}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-muted-foreground">场地</div>
                  <div className="font-medium">{task.venueName}</div>
                </div>
              </div>
            </div>

            {/* 备课资源 */}
            {task.resources.length > 0 && (
              <div className="space-y-2">
                <Label className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  备课资源（{task.resources.length}个）
                </Label>
                <div className="space-y-2">
                  {task.resources.map((r) => (
                    <div key={r.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2">
                        {r.type === 'video' && <Video className="h-4 w-4 text-muted-foreground" />}
                        {r.type === 'ppt' && <FileText className="h-4 w-4 text-muted-foreground" />}
                        {r.type === 'textbook' && <BookOpen className="h-4 w-4 text-muted-foreground" />}
                        {r.type === 'link' && <Link2 className="h-4 w-4 text-muted-foreground" />}
                        {r.type === 'scene_link' && <GraduationCap className="h-4 w-4 text-muted-foreground" />}
                        <span>{r.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{r.isVisibleToStudents ? '学生可见' : '仅教师'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 进度 */}
            {task.progressSummary && (
              <div className="space-y-2">
                <Label className="font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  进度汇总
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">{task.progressSummary.completionRate}%</div>
                      <div className="text-xs text-muted-foreground">课时完成率</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">{task.progressSummary.studentAvgCompletion}%</div>
                      <div className="text-xs text-muted-foreground">学生平均完成率</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">{task.progressSummary.completedHours}/{task.progressSummary.plannedHours}</div>
                      <div className="text-xs text-muted-foreground">已完成课时</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 场景教学特有 */}
            {task.type === 'scene' && (
              <div className="space-y-2">
                <Label className="font-medium">场景教学信息</Label>
                <div className="text-sm space-y-2">
                  <div>场景平台ID：{task.externalPlatformId || <span className="text-orange-600">未关联</span>}</div>
                  <div>企业导师：{task.enterpriseMentorName || '—'}</div>
                  <div>工位/设备：{task.workStationName || '—'}</div>
                  {task.sceneSubTasks && task.sceneSubTasks.length > 0 && (
                    <div className="mt-2">
                      <div className="text-muted-foreground mb-1">子任务列表：</div>
                      <div className="space-y-2">
                        {task.sceneSubTasks.map((sub) => (
                          <div key={sub.id} className="border rounded-lg p-3">
                            <div className="font-medium">{sub.name}</div>
                            <div className="text-muted-foreground mt-1">
                              负责教师：{sub.facultyName || '—'} | 企业导师：{sub.enterpriseMentorName || '—'} | 完成率：{sub.progress?.completionRate || 0}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- 补充资源对话框 ----
function AddResourceDialog({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  const [resources, setResources] = useState<{ name: string; type: string }[]>([])
  if (!task) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            补充备课资源 — {task.courseName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">点击或拖拽上传资源</p>
            <p className="text-xs text-muted-foreground">支持 PDF、PPT、视频、文档格式</p>
          </div>

          <div className="space-y-2">
            <Label>资源类型</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择资源类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ppt">课件PPT</SelectItem>
                <SelectItem value="video">教学视频</SelectItem>
                <SelectItem value="document">文档资料</SelectItem>
                <SelectItem value="textbook">教材</SelectItem>
                <SelectItem value="link">外部链接</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>资源名称</Label>
            <Input placeholder="输入资源名称" />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="visible" />
            <Label htmlFor="visible" className="text-sm">对学生可见</Label>
          </div>

          {task.resources.length > 0 && (
            <div className="space-y-2">
              <Label>已有资源</Label>
              <div className="space-y-2">
                {task.resources.map((r) => (
                  <div key={r.id} className="flex items-center justify-between border rounded-lg p-2 text-sm">
                    <span>{r.name}</span>
                    <Badge variant="outline" className="text-xs">{r.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>添加资源</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- 场景教学细分安排对话框 ----
function SceneArrangementDialog({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  if (!task) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            场景教学细分安排 — {task.courseName}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-2">
            {/* 基本信息 */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">班级</Label>
                <p className="font-medium">{task.className}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">主讲教师</Label>
                <p className="font-medium">{task.facultyName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">时间</Label>
                <p className="font-medium">周{task.dayOfWeek} {task.period} / {task.weeks}</p>
              </div>
            </div>

            {/* 关联场景平台 */}
            <div className="space-y-2">
              <Label className="font-medium">① 关联场景平台</Label>
              <div className="flex items-center gap-2">
                <Input placeholder="输入场景平台场景ID" defaultValue={task.externalPlatformId || ''} className="max-w-sm" />
                <Button size="sm" variant="outline" onClick={() => toast.success('子任务同步成功')}>同步子任务</Button>
              </div>
              {!task.externalPlatformId && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  未关联场景平台，需关联后方可继续细分安排
                </p>
              )}
              {task.externalPlatformId && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  已关联场景平台 ID: {task.externalPlatformId}
                </p>
              )}
            </div>

            {/* 子任务列表 */}
            <div className="space-y-2">
              <Label className="font-medium">② 子任务师资关联</Label>
              {task.sceneSubTasks && task.sceneSubTasks.length > 0 ? (
                <div className="space-y-3">
                  {task.sceneSubTasks.map((sub) => (
                    <Card key={sub.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{sub.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {sub.status === 'completed' ? '已完成' : sub.status === 'in_progress' ? '进行中' : '计划中'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">负责教师</Label>
                            <Select defaultValue={sub.facultyId || ''}>
                              <SelectTrigger className="h-8 mt-1">
                                <SelectValue placeholder="选择教师" />
                              </SelectTrigger>
                              <SelectContent>
                                {faculty.map((f) => (
                                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">企业导师</Label>
                            <Select defaultValue={sub.enterpriseMentorId || ''}>
                              <SelectTrigger className="h-8 mt-1">
                                <SelectValue placeholder="选择企业导师" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">无</SelectItem>
                                {faculty.filter((f) => f.isEnterpriseMentor).map((f) => (
                                  <SelectItem key={f.id} value={f.id}>{f.name} ({f.enterpriseInfo?.company})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">参与方式</Label>
                            <Select defaultValue={sub.mentorParticipationType}>
                              <SelectTrigger className="h-8 mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full">全程</SelectItem>
                                <SelectItem value="partial">部分</SelectItem>
                                <SelectItem value="remote">远程</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">工位/设备</Label>
                            <Input className="h-8 mt-1" defaultValue={sub.workStationName || ''} placeholder="输入工位或设备" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground border rounded-lg p-4 text-center">
                  请先关联场景平台并同步子任务列表
                </div>
              )}
            </div>

            {/* 工位设备分配 */}
            <div className="space-y-2">
              <Label className="font-medium">③ 主任务工位/设备分配</Label>
              <div className="flex items-center gap-2">
                <Select defaultValue={task.workStationId || ''}>
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="选择工位/设备" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">不指定</SelectItem>
                    <SelectItem value="ws-001">网络工程实训工位A区</SelectItem>
                    <SelectItem value="ws-002">网络工程实训工位B区</SelectItem>
                    <SelectItem value="ws-003">软件开发实训工位</SelectItem>
                    <SelectItem value="ws-004">数控实训工位</SelectItem>
                    <SelectItem value="ws-005">仿真实训工位</SelectItem>
                    <SelectItem value="ws-006">设计工位A区</SelectItem>
                    <SelectItem value="ws-007">汽车维修实训工位</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 企业导师时段 */}
            <div className="space-y-2">
              <Label className="font-medium">④ 企业导师到场时段</Label>
              {task.enterpriseMentorId ? (
                <div className="text-sm">
                  <p>企业导师：{task.enterpriseMentorName}</p>
                  <div className="mt-2 space-y-2">
                    {(task.sceneSubTasks?.flatMap((s) => s.mentorTimeSlots || []) || []).map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{slot.date} {slot.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">未配置企业导师</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>保存并标记为就绪</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- 课表快速编辑弹窗 ----
function EditScheduleDialog({
  task,
  allTasks,
  open,
  onClose,
}: {
  task: Task | null
  allTasks: Task[]
  open: boolean
  onClose: () => void
}) {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1)
  const [period, setPeriod] = useState<string>('1-2节')
  const [venueId, setVenueId] = useState<string>('')
  const [facultyId, setFacultyId] = useState<string>('')

  useMemo(() => {
    if (task) {
      setDayOfWeek(task.dayOfWeek)
      setPeriod(task.period)
      setVenueId(task.venueId)
      setFacultyId(task.facultyId)
    }
  }, [task])

  if (!task) return null

  const conflicts = detectConflicts(task, allTasks, dayOfWeek, period, venueId, facultyId)
  const hasConflict = conflicts.length > 0

  const selectedVenue = venues.find((v) => v.id === venueId)
  const selectedFaculty = faculty.find((f) => f.id === facultyId)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            调整课表 — {task.courseName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="text-sm text-muted-foreground">
            班级：{task.className} | 当前：周{task.dayOfWeek} {task.period}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>星期</Label>
              <Select value={String(dayOfWeek)} onValueChange={(v) => setDayOfWeek(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">周一</SelectItem>
                  <SelectItem value="2">周二</SelectItem>
                  <SelectItem value="3">周三</SelectItem>
                  <SelectItem value="4">周四</SelectItem>
                  <SelectItem value="5">周五</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>节次</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2节">1-2节</SelectItem>
                  <SelectItem value="3-4节">3-4节</SelectItem>
                  <SelectItem value="5-6节">5-6节</SelectItem>
                  <SelectItem value="7-8节">7-8节</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>上课场地</Label>
            <Select value={venueId} onValueChange={setVenueId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {venues.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>主讲教师</Label>
            <Select value={facultyId} onValueChange={setFacultyId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name} ({f.title})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 冲突警告 */}
          {hasConflict && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                <AlertTriangle className="h-4 w-4" />
                检测到冲突（仍可保存）
              </div>
              <div className="text-xs text-red-600 space-y-1">
                {conflicts.map((c, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                    {c.type === 'teacher' && `教师「${c.with}」在同一时段有「${c.taskName}」`}
                    {c.type === 'venue' && `场地「${c.with}」在同一时段有「${c.taskName}」`}
                    {c.type === 'class' && `班级「${c.with}」在同一时段有「${c.taskName}」`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasConflict && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              当前安排无冲突
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button
            onClick={onClose}
            variant={hasConflict ? 'destructive' : 'default'}
            className="gap-1"
          >
            {hasConflict && <AlertTriangle className="h-4 w-4" />}
            {hasConflict ? '强制保存' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- 主页面 ----
export default function TaskOrchestrationPage() {
  const [activeTab, setActiveTab] = useState('list')
  const [filterType, setFilterType] = useState<'all' | TaskType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | TaskStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [sceneDialogOpen, setSceneDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false
      if (filterStatus !== 'all' && t.status !== filterStatus) return false
      if (searchQuery && !t.name.includes(searchQuery) && !t.courseName.includes(searchQuery)) return false
      return true
    })
  }, [filterType, filterStatus, searchQuery])

  const stats = useMemo(() => {
    return {
      draft: tasks.filter((t) => t.status === 'draft').length,
      ready: tasks.filter((t) => t.status === 'ready').length,
      published: tasks.filter((t) => t.status === 'published').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      evaluating: tasks.filter((t) => t.status === 'evaluating').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    }
  }, [])

  const handleSceneArrange = (task: Task) => {
    setSelectedTask(task)
    setSceneDialogOpen(true)
  }

  const handleViewDetail = (task: Task) => {
    setSelectedTask(task)
    setDetailDialogOpen(true)
  }

  const handleAddResource = (task: Task) => {
    setSelectedTask(task)
    setResourceDialogOpen(true)
  }

  const handleEditSchedule = (task: Task) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任务编排中心</h1>
          <p className="text-muted-foreground">以外部排课为起点，进行任务细分安排与发布</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={() => toast('导入排课Excel功能开发中')}>
            <FileSpreadsheet className="h-4 w-4" />
            导入排课Excel
          </Button>
          <Button className="gap-1" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            新建任务
          </Button>
        </div>
      </div>

      {/* 状态统计 */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="草稿" count={stats.draft} icon={BookOpen} color="bg-slate-500" />
        <StatCard title="待就绪" count={stats.ready} icon={Clock} color="bg-blue-500" />
        <StatCard title="已发布" count={stats.published} icon={Play} color="bg-green-500" />
        <StatCard title="进行中" count={stats.in_progress} icon={Layers} color="bg-indigo-500" />
        <StatCard title="评定中" count={stats.evaluating} icon={CheckCircle2} color="bg-amber-500" />
        <StatCard title="已完成" count={stats.completed} icon={CheckCircle2} color="bg-emerald-500" />
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">任务列表</TabsTrigger>
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="schedule">课表视图</TabsTrigger>
          <TabsTrigger value="scene">场景教学安排</TabsTrigger>
        </TabsList>

        {/* 任务列表 */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              placeholder="搜索课程或班级..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="任务类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="traditional">传统教学</SelectItem>
                <SelectItem value="scene">场景教学</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="任务状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="ready">待就绪</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="in_progress">进行中</SelectItem>
                <SelectItem value="evaluating">评定中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>任务编码</TableHead>
                    <TableHead>课程</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>教师</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{task.code}</TableCell>
                      <TableCell className="font-medium">{task.courseName}</TableCell>
                      <TableCell>{task.className}</TableCell>
                      <TableCell>{task.facultyName}</TableCell>
                      <TableCell>
                        <Badge variant={task.type === 'scene' ? 'outline' : 'secondary'} className={task.type === 'scene' ? 'border-orange-300 text-orange-600' : ''}>
                          {typeMap[task.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        周{task.dayOfWeek} {task.period}
                        <br />
                        {task.weeks}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[task.status].variant}>{statusMap[task.status].label}</Badge>
                      </TableCell>
                      <TableCell>
                        {task.progressSummary ? (
                          <div className="w-full max-w-[100px]">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{task.progressSummary.completionRate}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${task.progressSummary.completionRate}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {task.type === 'scene' && task.status === 'draft' && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSceneArrange(task)}>
                              <Settings2 className="h-3 w-3 mr-1" />
                              细分安排
                            </Button>
                          )}
                          {task.status === 'ready' && (
                            <Button size="sm" className="h-7 text-xs" onClick={() => toast.success('任务发布成功')}>
                              <Play className="h-3 w-3 mr-1" />
                              发布
                            </Button>
                          )}
                          {task.status === 'published' && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleViewDetail(task)}>
                              <Eye className="h-3 w-3 mr-1" />
                              查看
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 待处理任务 */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">待处理任务（草稿状态）</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>教师</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>需处理事项</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks
                    .filter((t) => t.status === 'draft')
                    .map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.className}</TableCell>
                        <TableCell>{task.facultyName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.type === 'scene' ? 'border-orange-300 text-orange-600' : ''}>
                            {typeMap[task.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.type === 'scene' && !task.externalPlatformId && (
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              需关联场景平台
                            </span>
                          )}
                          {task.type === 'traditional' && task.resources.length === 0 && (
                            <span className="text-xs text-muted-foreground">建议补充备课资源</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {task.type === 'scene' ? (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSceneArrange(task)}>
                              细分安排
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAddResource(task)}>
                              补充资源
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 课表视图 */}
        <TabsContent value="schedule" className="space-y-4">
          <Tabs defaultValue="class">
            <TabsList>
              <TabsTrigger value="class">按班级查看</TabsTrigger>
              <TabsTrigger value="teacher">按教师查看</TabsTrigger>
              <TabsTrigger value="venue">按场地查看</TabsTrigger>
            </TabsList>
            <TabsContent value="class" className="space-y-4">
              {classes.slice(0, 4).map((c) => (
                <Card key={c.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="font-medium flex items-center gap-2">
                      {c.name}
                      <Badge variant="outline" className="text-xs">{c.studentCount}人</Badge>
                    </div>
                    <ScheduleGrid taskList={tasks.filter((e) => e.classId === c.id)} allTasks={tasks} onEditTask={handleEditSchedule} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="teacher" className="space-y-4">
              {faculty.slice(0, 4).map((f) => (
                <Card key={f.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="font-medium">{f.name} ({f.title})</div>
                    <ScheduleGrid taskList={tasks.filter((e) => e.facultyId === f.id)} allTasks={tasks} onEditTask={handleEditSchedule} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="venue" className="space-y-4">
              {venues.slice(0, 4).map((v) => (
                <Card key={v.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="font-medium">{v.name}</div>
                    <ScheduleGrid taskList={tasks.filter((e) => e.venueId === v.id)} allTasks={tasks} onEditTask={handleEditSchedule} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* 场景教学安排 */}
        <TabsContent value="scene" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">场景教学细分安排一览</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>场景平台ID</TableHead>
                    <TableHead>子任务数</TableHead>
                    <TableHead>企业导师</TableHead>
                    <TableHead>工位/设备</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks
                    .filter((t) => t.type === 'scene')
                    .map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.courseName}</TableCell>
                        <TableCell>{task.className}</TableCell>
                        <TableCell>
                          {task.externalPlatformId ? (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                              {task.externalPlatformId}
                            </Badge>
                          ) : (
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              未关联
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{task.sceneSubTasks?.length || 0}</TableCell>
                        <TableCell>{task.enterpriseMentorName || '—'}</TableCell>
                        <TableCell>{task.workStationName || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={statusMap[task.status].variant}>{statusMap[task.status].label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSceneArrange(task)}>
                            <Settings2 className="h-3 w-3 mr-1" />
                            细分安排
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新建任务对话框 */}
      <CreateTaskDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />

      {/* 查看任务详情对话框 */}
      <TaskDetailDialog task={selectedTask} open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} />

      {/* 补充资源对话框 */}
      <AddResourceDialog task={selectedTask} open={resourceDialogOpen} onClose={() => setResourceDialogOpen(false)} />

      {/* 场景教学细分安排对话框 */}
      <SceneArrangementDialog
        task={selectedTask}
        open={sceneDialogOpen}
        onClose={() => setSceneDialogOpen(false)}
      />

      {/* 课表快速编辑弹窗 */}
      <EditScheduleDialog
        task={selectedTask}
        allTasks={tasks}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />
    </div>
  )
}
