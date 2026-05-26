'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PenLine, Archive, CheckCircle2, BarChart3, MessageSquare, Star, Clock, ClipboardList } from 'lucide-react'
import { tasks as initialTasks, type Task } from '@/lib/mock-data'
import { toast } from 'sonner'

const statusFilters = [
  { id: 'pending', label: '待复盘', icon: Clock },
  { id: 'reviewed', label: '已复盘', icon: CheckCircle2 },
  { id: 'archived', label: '已归档', icon: Archive },
]

export default function TaskReviewPage() {
  const [taskList, setTaskList] = useState<Task[]>(initialTasks)
  const [selectedStatus, setSelectedStatus] = useState<string>('pending')

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // 复盘表单
  const [teachingReflection, setTeachingReflection] = useState('')
  const [problemsFound, setProblemsFound] = useState('')
  const [improvementMeasures, setImprovementMeasures] = useState('')
  const [studentFeedbackSummary, setStudentFeedbackSummary] = useState('')

  const pendingTasks = useMemo(
    () => taskList.filter((t) => t.status === 'completed' && !t.review?.facultyReview),
    [taskList]
  )
  const reviewedTasks = useMemo(
    () => taskList.filter((t) => t.status === 'completed' && !!t.review?.facultyReview),
    [taskList]
  )
  const archivedTasks = useMemo(() => taskList.filter((t) => t.status === 'archived'), [taskList])

  const displayedTasks =
    selectedStatus === 'pending'
      ? pendingTasks
      : selectedStatus === 'reviewed'
        ? reviewedTasks
        : archivedTasks

  const handleWriteReview = (task: Task) => {
    setSelectedTask(task)
    setTeachingReflection(task.review?.facultyReview?.teachingReflection || '')
    setProblemsFound(task.review?.facultyReview?.problemsFound?.join('\n') || '')
    setImprovementMeasures(task.review?.facultyReview?.improvementMeasures?.join('\n') || '')
    setStudentFeedbackSummary(task.review?.facultyReview?.studentFeedbackSummary || '')
    setDialogOpen(true)
  }

  const handleSubmitReview = () => {
    if (!selectedTask) return
    if (!teachingReflection.trim()) {
      toast.error('请填写教学反思')
      return
    }
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              review: {
                ...(t.review || { taskId: t.id }),
                facultyReview: {
                  teachingReflection: teachingReflection.trim(),
                  problemsFound: problemsFound
                    .split('\n')
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0),
                  improvementMeasures: improvementMeasures
                    .split('\n')
                    .map((m) => m.trim())
                    .filter((m) => m.length > 0),
                  studentFeedbackSummary: studentFeedbackSummary.trim(),
                  createdAt: new Date().toISOString().split('T')[0],
                },
              },
            }
          : t
      )
    )
    toast.success('复盘已提交')
    setDialogOpen(false)
  }

  const handleArchive = () => {
    if (!selectedTask) return
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, status: 'archived', archivedAt: new Date().toISOString().split('T')[0] }
          : t
      )
    )
    toast.success('任务已归档')
    setDialogOpen(false)
  }

  const isViewMode = selectedTask?.review?.facultyReview !== undefined

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧状态导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">复盘状态</span>
        </div>
        <div className="space-y-1">
          {statusFilters.map((sf) => {
            const count =
              sf.id === 'pending'
                ? pendingTasks.length
                : sf.id === 'reviewed'
                  ? reviewedTasks.length
                  : archivedTasks.length
            return (
              <button
                key={sf.id}
                onClick={() => setSelectedStatus(sf.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                  selectedStatus === sf.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <sf.icon className="h-4 w-4" />
                  {sf.label}
                </span>
                <span
                  className={`text-xs ${
                    selectedStatus === sf.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务复盘</h1>
            <p className="text-muted-foreground text-sm">
              共 {displayedTasks.length} 个任务 · 课后教学反思与复盘归档
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">待复盘</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>
              <div className="rounded-full p-2 bg-amber-500">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">已复盘</p>
                <p className="text-2xl font-bold">{reviewedTasks.length}</p>
              </div>
              <div className="rounded-full p-2 bg-green-500">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">已归档</p>
                <p className="text-2xl font-bold">{archivedTasks.length}</p>
              </div>
              <div className="rounded-full p-2 bg-gray-500">
                <Archive className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 内容区 */}
        {selectedStatus === 'pending' && (
          <>
            {pendingTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>暂无待复盘任务</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{task.courseName}</h3>
                          <p className="text-sm text-muted-foreground">{task.className}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={task.type === 'scene' ? 'border-orange-300 text-orange-600' : ''}
                        >
                          {task.type === 'scene' ? '场景教学' : '传统教学'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">教师：</span>
                          <span>{task.facultyName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">成绩状态：</span>
                          <span>
                            {task.gradeSummary?.overallStatus === 'published' ? '已发布' : '评定中'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">课程版本：</span>
                          <span>{task.courseVersion || '—'}</span>
                        </div>
                      </div>
                      {task.progressSummary && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">学生完成率：</span>
                          <span className="font-medium">{task.progressSummary.studentAvgCompletion}%</span>
                        </div>
                      )}
                      <Button className="w-full gap-1" onClick={() => handleWriteReview(task)}>
                        <PenLine className="h-4 w-4" />
                        撰写复盘
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {selectedStatus !== 'pending' && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>教师</TableHead>
                    <TableHead>课程版本</TableHead>
                    <TableHead>评价快照</TableHead>
                    <TableHead>复盘状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.courseName}</TableCell>
                      <TableCell>{task.className}</TableCell>
                      <TableCell>{task.facultyName}</TableCell>
                      <TableCell>{task.courseVersion || '—'}</TableCell>
                      <TableCell>
                        {task.review?.evaluationSnapshot ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span>{task.review.evaluationSnapshot.avgScore.toFixed(2)}</span>
                            <span className="text-muted-foreground">
                              ({task.review.evaluationSnapshot.participantCount}人)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.status === 'archived' ? 'default' : 'outline'}>
                          {task.status === 'archived' ? '已归档' : '已复盘'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleWriteReview(task)}>
                          {task.status === 'archived' ? '查看' : '查看/归档'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {displayedTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                        {selectedStatus === 'reviewed' ? (
                          <>
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <p>暂无已复盘任务</p>
                          </>
                        ) : (
                          <>
                            <Archive className="h-8 w-8 mx-auto mb-2" />
                            <p>暂无归档任务</p>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 复盘撰写/查看对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              {isViewMode ? '查看复盘' : '撰写复盘'} — {selectedTask?.courseName}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedTask && (
              <div className="space-y-5 py-2">
                {/* 数据辅助 */}
                <div className="grid grid-cols-4 gap-3">
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">
                        {selectedTask.progressSummary?.studentAvgCompletion || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">学生完成率</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">
                        {selectedTask.progressSummary?.completionRate || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">课时完成率</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">
                        {selectedTask.review?.evaluationSnapshot?.avgScore.toFixed(2) || '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">评价均分</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">
                        {selectedTask.courseVersion || '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">课程版本</div>
                    </CardContent>
                  </Card>
                </div>

                {/* 教学反思 */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    教学反思
                  </Label>
                  <Textarea
                    placeholder="总结本次任务的教学过程、亮点与不足..."
                    value={teachingReflection}
                    onChange={(e) => setTeachingReflection(e.target.value)}
                    rows={4}
                    readOnly={isViewMode && selectedTask.status === 'archived'}
                  />
                </div>

                {/* 发现问题 */}
                <div className="space-y-2">
                  <Label>发现问题（每行一条）</Label>
                  <Textarea
                    placeholder="列出教学过程中发现的问题..."
                    value={problemsFound}
                    onChange={(e) => setProblemsFound(e.target.value)}
                    rows={3}
                    readOnly={isViewMode && selectedTask.status === 'archived'}
                  />
                </div>

                {/* 改进措施 */}
                <div className="space-y-2">
                  <Label>改进措施（每行一条）</Label>
                  <Textarea
                    placeholder="针对问题提出改进措施..."
                    value={improvementMeasures}
                    onChange={(e) => setImprovementMeasures(e.target.value)}
                    rows={3}
                    readOnly={isViewMode && selectedTask.status === 'archived'}
                  />
                </div>

                {/* 学生反馈摘要 */}
                <div className="space-y-2">
                  <Label>学生反馈摘要</Label>
                  <Textarea
                    placeholder="汇总学生对本任务的主要反馈..."
                    value={studentFeedbackSummary}
                    onChange={(e) => setStudentFeedbackSummary(e.target.value)}
                    rows={3}
                    readOnly={isViewMode && selectedTask.status === 'archived'}
                  />
                </div>

                {/* 子任务复盘（场景教学） */}
                {selectedTask.type === 'scene' && selectedTask.sceneSubTasks && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      子任务复盘参考
                    </Label>
                    <div className="space-y-2">
                      {selectedTask.sceneSubTasks.map((sub) => (
                        <div key={sub.id} className="border rounded-lg p-3 text-sm">
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-muted-foreground mt-1">
                            完成率: {sub.progress?.completionRate || 0}% | 负责教师: {sub.facultyName || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            {!isViewMode && (
              <Button onClick={handleSubmitReview}>提交复盘</Button>
            )}
            {isViewMode && selectedTask?.status !== 'archived' && (
              <Button variant="secondary" onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-1" />
                归档任务
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
