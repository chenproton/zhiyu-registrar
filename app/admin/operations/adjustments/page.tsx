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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Clock,
  Calendar,
  User,
  Settings,
  AlertTriangle,
  History,
  Plus,
} from 'lucide-react'
import { taskChangeLogs as initialLogs, tasks, classes, departments, majors, grades, trainingPrograms, type TaskChangeLog } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const changeTypeMap: Record<TaskChangeLog['changeType'], { label: string; icon: React.ElementType }> = {
  time: { label: '时间变更', icon: Clock },
  venue: { label: '场地变更', icon: Calendar },
  faculty: { label: '教师变更', icon: User },
  mentor: { label: '企业导师变更', icon: User },
  workstation: { label: '工位/设备变更', icon: Settings },
  subtask: { label: '子任务调整', icon: Settings },
  cancel: { label: '停课', icon: AlertTriangle },
  makeup: { label: '补课', icon: Calendar },
}

const statusMap = {
  pending: { label: '待审批', variant: 'outline' as const },
  approved: { label: '已通过', variant: 'default' as const },
  rejected: { label: '已驳回', variant: 'destructive' as const },
}

export default function TaskSchedulingPage() {
  const [logs, setLogs] = useState<TaskChangeLog[]>(initialLogs)

  // 发起变更弹窗
  const [dialogOpen, setDialogOpen] = useState(false)
  const [changeType, setChangeType] = useState<TaskChangeLog['changeType']>('time')
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [reason, setReason] = useState('')

  // 左侧筛选
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all')

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

  const filteredLogs = useMemo(() => {
    if (selectedProgramId === 'all') return logs
    const program = trainingPrograms.find((p) => p.id === selectedProgramId)
    if (!program) return logs
    const relatedTaskIds = new Set(
      tasks
        .filter((t) => {
          const cls = classes.find((c) => c.id === t.classId)
          const grade = grades.find((g) => g.id === cls?.gradeId)
          return cls?.majorId === program.majorId && grade?.entryYear === program.entryYear
        })
        .map((t) => t.id)
    )
    return logs.filter((l) => relatedTaskIds.has(l.taskId))
  }, [logs, selectedProgramId])

  const pendingCount = filteredLogs.filter((l) => l.status === 'pending').length
  const approvedCount = filteredLogs.filter((l) => l.status === 'approved').length
  const rejectedCount = filteredLogs.filter((l) => l.status === 'rejected').length

  const handleApprove = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? { ...l, status: 'approved' as const, approver: '当前用户', approvedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    )
    toast.success('审批已通过')
  }

  const handleReject = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? { ...l, status: 'rejected' as const, approver: '当前用户', approvedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    )
    toast.success('已驳回申请')
  }

  const handleCreate = () => {
    if (!selectedTaskId) {
      toast.error('请选择要变更的任务')
      return
    }
    const task = tasks.find((t) => t.id === selectedTaskId)
    const newLog: TaskChangeLog = {
      id: `tcl-${Date.now()}`,
      taskId: selectedTaskId,
      changeType,
      courseVersion: task?.courseVersion,
      oldValue: {},
      newValue: { changeType },
      reason: reason || '无',
      applicant: '当前用户',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLogs((prev) => [newLog, ...prev])
    toast.success(`已向「${task?.courseName || '选定任务'}」发起${changeTypeMap[changeType].label}申请`)
    setDialogOpen(false)
    setSelectedTaskId('')
    setReason('')
  }

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
                <Badge variant={selectedDeptId === 'all' ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => { setSelectedDeptId('all'); setSelectedProgramId('all') }}>全部</Badge>
                {departments.map((d) => (
                  <Badge key={d.id} variant={selectedDeptId === d.id ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => { setSelectedDeptId(d.id); setSelectedProgramId('all') }}>{d.name}</Badge>
                ))}
              </div>
            </div>
            {/* 年级 */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">年级</label>
              <div className="flex flex-wrap gap-1">
                <Badge variant={selectedYear === 'all' ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => setSelectedYear('all')}>全部</Badge>
                {grades.map((g) => (
                  <Badge key={g.id} variant={selectedYear === String(g.entryYear) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => setSelectedYear(String(g.entryYear))}>{g.entryYear}级</Badge>
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
                <button className={cn('w-full text-left px-2 py-1 rounded text-xs transition-colors', selectedProgramId === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')} onClick={() => setSelectedProgramId('all')}>全部方案</button>
                {deptPrograms.map((p) => (
                  <button key={p.id} className={cn('w-full text-left px-2 py-1 rounded text-xs transition-colors truncate', selectedProgramId === p.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')} onClick={() => setSelectedProgramId(p.id)}>{p.name}</button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务调度</h1>
            <p className="text-muted-foreground">对任务实例进行时间、人员、场地、资源的变更调度</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            发起变更申请
          </Button>
        </div>

        {/* 统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">待审批</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">本月已通过</p>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已驳回</p>
              <p className="text-2xl font-bold">{rejectedCount}</p>
            </div>
            <div className="rounded-full p-2 bg-red-500">
              <XCircle className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">影响任务数</p>
              <p className="text-2xl font-bold">{new Set(filteredLogs.map((l) => l.taskId)).size}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <History className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 变更记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">变更申请记录</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>变更类型</TableHead>
                <TableHead>任务</TableHead>
                <TableHead>版本号</TableHead>
                <TableHead>变更内容</TableHead>
                <TableHead>申请人</TableHead>
                <TableHead>原因</TableHead>
                <TableHead>审批状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const task = tasks.find((t) => t.id === log.taskId)
                const typeInfo = changeTypeMap[log.changeType]
                const TypeIcon = typeInfo.icon
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{task?.courseName}</div>
                      <div className="text-xs text-muted-foreground">{task?.className}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.courseVersion || '—'}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        {Object.entries(log.newValue).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="line-through text-red-400">{String(log.oldValue[key] ?? '—')}</span>
                            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                            <span className="text-green-600">{String(value ?? '—')}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{log.applicant}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs">{log.reason}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[log.status].variant}>{statusMap[log.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {log.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 h-8 w-8"
                              onClick={() => handleApprove(log.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 h-8 w-8"
                              onClick={() => handleReject(log.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {log.status === 'approved' && (
                          <span className="text-xs text-muted-foreground">{log.approver}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                    暂无变更申请记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      </div>

      {/* 发起变更申请对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>发起任务变更申请</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择任务</Label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择要变更的任务" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTaskId && (
              <div className="space-y-1">
                <Label className="text-muted-foreground">课程信息</Label>
                <div className="text-sm font-medium">
                  {(() => {
                    const t = tasks.find((x) => x.id === selectedTaskId)
                    return t ? `${t.courseName}${t.courseVersion ? `（${t.courseVersion}）` : ''}` : '—'
                  })()}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>变更类型</Label>
              <Select value={changeType} onValueChange={(v) => setChangeType(v as TaskChangeLog['changeType'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">时间变更</SelectItem>
                  <SelectItem value="venue">场地变更</SelectItem>
                  <SelectItem value="faculty">教师变更</SelectItem>
                  <SelectItem value="mentor">企业导师变更</SelectItem>
                  <SelectItem value="workstation">工位/设备变更</SelectItem>
                  <SelectItem value="subtask">子任务调整</SelectItem>
                  <SelectItem value="cancel">停课</SelectItem>
                  <SelectItem value="makeup">补课</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>变更原因</Label>
              <Textarea placeholder="请说明变更原因..." value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            {changeType === 'cancel' && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">停课需配置补课计划</p>
                  <p className="text-xs text-red-600 mt-1">请在审批通过后，及时创建补课任务，否则系统将标记红色警告。</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleCreate}>提交申请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
