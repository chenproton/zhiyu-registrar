'use client'

import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PenLine, Archive, CheckCircle2, BarChart3, MessageSquare, Star } from 'lucide-react'
import { tasks, type Task } from '@/lib/mock-data'

export default function TaskReviewPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const pendingTasks = tasks.filter((t) => t.status === 'completed' && !t.review?.facultyReview)
  const archivedTasks = tasks.filter((t) => t.status === 'archived' || (t.status === 'completed' && !!t.review?.facultyReview))

  const handleWriteReview = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">任务复盘</h1>
        <p className="text-muted-foreground">课后教学反思与复盘归档，形成教学改进闭环</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            待复盘任务
            <Badge variant="secondary" className="ml-2 text-xs">{pendingTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="archived">
            复盘档案
            <Badge variant="secondary" className="ml-2 text-xs">{archivedTasks.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* 待复盘 */}
        <TabsContent value="pending" className="space-y-4">
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
                      <Badge variant="outline" className={task.type === 'scene' ? 'border-orange-300 text-orange-600' : ''}>
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
                        <span>{task.gradeSummary?.overallStatus === 'published' ? '已发布' : '评定中'}</span>
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
        </TabsContent>

        {/* 复盘档案 */}
        <TabsContent value="archived" className="space-y-4">
          {archivedTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Archive className="h-8 w-8 mx-auto mb-2" />
                <p>暂无复盘档案</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>任务</TableHead>
                      <TableHead>班级</TableHead>
                      <TableHead>教师</TableHead>
                      <TableHead>评价快照</TableHead>
                      <TableHead>复盘状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.courseName}</TableCell>
                        <TableCell>{task.className}</TableCell>
                        <TableCell>{task.facultyName}</TableCell>
                        <TableCell>
                          {task.review?.evaluationSnapshot ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 text-amber-500" />
                              <span>{task.review.evaluationSnapshot.avgScore.toFixed(2)}</span>
                              <span className="text-muted-foreground">({task.review.evaluationSnapshot.participantCount}人)</span>
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
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 复盘撰写对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              {selectedTask?.review?.facultyReview ? '查看复盘' : '撰写复盘'} — {selectedTask?.courseName}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedTask && (
              <div className="space-y-5 py-2">
                {/* 数据辅助 */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">{selectedTask.progressSummary?.studentAvgCompletion || 0}%</div>
                      <div className="text-xs text-muted-foreground">学生完成率</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className="text-lg font-bold">{selectedTask.progressSummary?.completionRate || 0}%</div>
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
                </div>

                {/* 教学反思 */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    教学反思
                  </Label>
                  <Textarea
                    placeholder="总结本次任务的教学过程、亮点与不足..."
                    defaultValue={selectedTask.review?.facultyReview?.teachingReflection || ''}
                    rows={4}
                  />
                </div>

                {/* 发现问题 */}
                <div className="space-y-2">
                  <Label>发现问题</Label>
                  <Textarea
                    placeholder="列出教学过程中发现的问题..."
                    defaultValue={selectedTask.review?.facultyReview?.problemsFound?.join('\n') || ''}
                    rows={3}
                  />
                </div>

                {/* 改进措施 */}
                <div className="space-y-2">
                  <Label>改进措施</Label>
                  <Textarea
                    placeholder="针对问题提出改进措施..."
                    defaultValue={selectedTask.review?.facultyReview?.improvementMeasures?.join('\n') || ''}
                    rows={3}
                  />
                </div>

                {/* 学生反馈摘要 */}
                <div className="space-y-2">
                  <Label>学生反馈摘要</Label>
                  <Textarea
                    placeholder="汇总学生对本任务的主要反馈..."
                    defaultValue={selectedTask.review?.facultyReview?.studentFeedbackSummary || ''}
                    rows={3}
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            {!selectedTask?.review?.facultyReview && (
              <Button onClick={() => setDialogOpen(false)}>提交复盘</Button>
            )}
            {selectedTask?.review?.facultyReview && selectedTask.status !== 'archived' && (
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
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
