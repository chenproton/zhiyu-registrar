'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Send,
  CheckCircle,
  Eye,
  BarChart3,
  GraduationCap,
  ClipboardList,
  FilePlus,
  ArrowRight,
  History,
  UserCheck,
  XCircle,
  RotateCcw,
} from 'lucide-react'
import { gradeRecords, students, terms } from '@/lib/mock-data'
import type { GradeRecord, ApplyType, GradeStatus } from '@/lib/mock-data'
import { toast } from 'sonner'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className?: string }> = {
  '待确认': { label: '待确认', variant: 'secondary' },
  '待审核': { label: '待审核', variant: 'outline', className: 'border-amber-300 text-amber-600' },
  '待认定': { label: '待认定', variant: 'outline', className: 'border-blue-300 text-blue-600' },
  '已认定': { label: '已认定', variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
  '已发布': { label: '已发布', variant: 'default', className: 'bg-purple-600 hover:bg-purple-700' },
}

const applyTypeColors: Record<string, string> = {
  '课程替代': 'bg-blue-100 text-blue-700',
  '校外成绩认定': 'bg-emerald-100 text-emerald-700',
  '补考': 'bg-amber-100 text-amber-700',
  '重修': 'bg-orange-100 text-orange-700',
  '学分兑换': 'bg-indigo-100 text-indigo-700',
  '缓考': 'bg-gray-100 text-gray-700',
}

type ActionType = 'confirm' | 'submitAudit' | 'audit' | 'recognize' | 'publish' | 'view' | 'add'

export default function GradesPage() {
  const [records, setRecords] = useState<GradeRecord[]>(gradeRecords)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: ActionType; record?: GradeRecord }>({ open: false, type: 'view' })
  const [comment, setComment] = useState('')
  const [auditResult, setAuditResult] = useState<'pass' | 'reject' | 'return'>('pass')
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const filtered = useMemo(() => {
    return records.filter((g) => {
      const stu = students.find((s) => s.id === g.studentId)
      if (search) {
        const term = search.toLowerCase()
        if (!stu?.name.toLowerCase().includes(term) && !g.courseName.toLowerCase().includes(term) && !stu?.studentId.toLowerCase().includes(term)) return false
      }
      if (statusFilter !== 'all' && g.status !== statusFilter) return false
      if (typeFilter !== 'all' && g.applyType !== typeFilter) return false
      return true
    })
  }, [records, search, statusFilter, typeFilter])

  const stats = useMemo(() => {
    const total = records.length
    const pendingConfirm = records.filter((g) => g.status === '待确认').length
    const pendingAudit = records.filter((g) => g.status === '待审核').length
    const pendingRecognize = records.filter((g) => g.status === '待认定').length
    const recognized = records.filter((g) => g.status === '已认定').length
    const published = records.filter((g) => g.status === '已发布').length
    return { total, pendingConfirm, pendingAudit, pendingRecognize, recognized, published }
  }, [records])

  const allSelected = filtered.length > 0 && filtered.every((g) => selectedIds.has(g.id))
  const someSelected = filtered.some((g) => selectedIds.has(g.id))

  function toggleSelectAll() {
    if (allSelected) {
      const next = new Set(selectedIds)
      filtered.forEach((g) => next.delete(g.id))
      setSelectedIds(next)
    } else {
      const next = new Set(selectedIds)
      filtered.forEach((g) => next.add(g.id))
      setSelectedIds(next)
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function getCurrentRole(record: GradeRecord) {
    if (record.status === '待确认') return '教学秘书确认'
    if (record.status === '待审核') return '学院/教务处审核'
    if (record.status === '待认定') return '教务处认定'
    if (record.status === '已认定') return '教务处发布'
    return '—'
  }

  function updateRecordStatus(id: string, newStatus: GradeStatus, action: string, operator: string, commentText?: string) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              auditHistory: [
                ...r.auditHistory,
                {
                  step: r.auditHistory.length + 1,
                  role: operator,
                  action: action as any,
                  operator,
                  date: new Date().toISOString().slice(0, 10),
                  comment: commentText,
                },
              ],
            }
          : r
      )
    )
  }

  function handleBatchAction(action: ActionType) {
    const selected = records.filter((r) => selectedIds.has(r.id))
    let count = 0
    selected.forEach((r) => {
      if (action === 'confirm' && r.status === '待确认') {
        updateRecordStatus(r.id, '待审核', '确认', '教学秘书', comment)
        count++
      }
      if (action === 'submitAudit' && r.status === '待审核') {
        updateRecordStatus(r.id, '待认定', '送审', '教学秘书', comment)
        count++
      }
      if (action === 'audit' && r.status === '待认定' && auditResult === 'pass') {
        updateRecordStatus(r.id, '已认定', '审核通过', '学院审核', comment)
        count++
      }
      if (action === 'audit' && r.status === '待认定' && auditResult === 'reject') {
        updateRecordStatus(r.id, '待确认', '审核不通过', '学院审核', comment)
        count++
      }
      if (action === 'audit' && r.status === '待认定' && auditResult === 'return') {
        updateRecordStatus(r.id, '待审核', '退回', '学院审核', comment)
        count++
      }
      if (action === 'batchRecognize' && r.status === '待认定') {
        updateRecordStatus(r.id, '已认定', '认定', '教务处', '批量认定')
        count++
      }
      if (action === 'recognize' && r.status === '已认定') {
        updateRecordStatus(r.id, '已发布', '发布', '教务处', comment)
        count++
      }
    })
    setSelectedIds(new Set())
    toast.success(`批量操作完成，共处理 ${count} 条记录`)
    setComment('')
  }

  function handleSingleAction(record: GradeRecord, action: ActionType) {
    if (action === 'confirm' && record.status === '待确认') {
      updateRecordStatus(record.id, '待审核', '确认', '教学秘书', comment)
      toast.success('成绩已确认，进入待审核状态')
    }
    if (action === 'submitAudit' && record.status === '待审核') {
      updateRecordStatus(record.id, '待认定', '送审', '教学秘书', comment)
      toast.success('成绩已送审，进入待认定状态')
    }
    if (action === 'audit' && record.status === '待认定') {
      if (auditResult === 'pass') {
        updateRecordStatus(record.id, '已认定', '审核通过', '学院审核', comment)
        toast.success('审核通过，成绩已认定')
      } else if (auditResult === 'reject') {
        updateRecordStatus(record.id, '待确认', '审核不通过', '学院审核', comment)
        toast.success('审核不通过，已退回待确认')
      } else {
        updateRecordStatus(record.id, '待审核', '退回', '学院审核', comment)
        toast.success('已退回至待审核状态')
      }
    }
    if (action === 'recognize' && record.status === '已认定') {
      updateRecordStatus(record.id, '已发布', '发布', '教务处', comment)
      toast.success('成绩已发布')
    }
    if (action === 'publish' && record.status === '已认定') {
      updateRecordStatus(record.id, '已发布', '发布', '教务处', comment)
      toast.success('成绩已发布')
    }
    setActionDialog({ open: false, type: 'view' })
    setComment('')
    setAuditResult('pass')
  }

  const statusButtons = [
    { key: 'all', label: '全部', count: stats.total },
    { key: '待确认', label: '待确认', count: stats.pendingConfirm },
    { key: '待审核', label: '待审核', count: stats.pendingAudit },
    { key: '待认定', label: '待认定', count: stats.pendingRecognize },
    { key: '已认定', label: '已认定', count: stats.recognized },
    { key: '已发布', label: '已发布', count: stats.published },
  ]

  const applyTypes: ApplyType[] = ['课程替代', '校外成绩认定', '补考', '重修', '学分兑换', '缓考']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">成绩认定</h1>
          <p className="text-muted-foreground">成绩同步、确认、审核、认定与发布全流程管理</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <FilePlus className="h-4 w-4 mr-2" />新增认定申请
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">成绩记录总数</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">待确认/审核</p>
              <p className="text-2xl font-bold">{stats.pendingConfirm + stats.pendingAudit}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">待认定</p>
              <p className="text-2xl font-bold">{stats.pendingRecognize}</p>
            </div>
            <div className="rounded-full p-2 bg-indigo-500">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已认定</p>
              <p className="text-2xl font-bold">{stats.recognized}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已发布</p>
              <p className="text-2xl font-bold">{stats.published}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选 + 搜索 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {statusButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setStatusFilter(btn.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  statusFilter === btn.key
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {btn.label}
                <span className="ml-1 text-[10px] opacity-70">({btn.count})</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索学生姓名、学号或课程..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="认定类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {applyTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作栏 */}
      {someSelected && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-800 font-medium">已选择 {selectedIds.size} 条记录</span>
          <div className="flex-1" />
          {filtered.some((r) => selectedIds.has(r.id) && r.status === '待确认') && (
            <Button size="sm" variant="outline" onClick={() => handleBatchAction('confirm')}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" />批量确认
            </Button>
          )}
          {filtered.some((r) => selectedIds.has(r.id) && r.status === '待审核') && (
            <Button size="sm" variant="outline" onClick={() => handleBatchAction('submitAudit')}>
              <Send className="h-3.5 w-3.5 mr-1" />批量送审
            </Button>
          )}
          {filtered.some((r) => selectedIds.has(r.id) && r.status === '待认定') && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleBatchAction('audit')}>
                <UserCheck className="h-3.5 w-3.5 mr-1" />批量审核
              </Button>
              <Button size="sm" variant="default" onClick={() => handleBatchAction('batchRecognize')}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />批量认定
              </Button>
            </>
          )}
          {filtered.some((r) => selectedIds.has(r.id) && r.status === '已认定') && (
            <Button size="sm" variant="outline" onClick={() => handleBatchAction('recognize')}>
              <Send className="h-3.5 w-3.5 mr-1" />批量发布
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />取消选择
          </Button>
        </div>
      )}

      {/* 成绩表格 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">成绩认定记录</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="全选" />
                </TableHead>
                <TableHead>学生</TableHead>
                <TableHead>认定类型</TableHead>
                <TableHead>课程映射</TableHead>
                <TableHead>原始/认定成绩</TableHead>
                <TableHead>学分/绩点</TableHead>
                <TableHead>申请日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>当前环节</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((g) => {
                const stu = students.find((s) => s.id === g.studentId)
                const sConfig = statusMap[g.status]
                const term = terms.find((t) => t.id === g.termId)
                return (
                  <TableRow key={g.id}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(g.id)} onCheckedChange={() => toggleSelect(g.id)} aria-label={`选择 ${stu?.name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{stu?.name}</div>
                      <div className="text-xs text-muted-foreground">{stu?.studentId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${applyTypeColors[g.applyType] || ''}`}>{g.applyType}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {g.originalCourse && g.targetCourse ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground truncate max-w-[80px]">{g.originalCourse}</span>
                          <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[80px]">{g.targetCourse}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{g.courseName}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{g.rawScore} / <span className="font-medium">{g.recognizedScore}</span></div>
                      <div className="text-[10px] text-muted-foreground">{g.gradeType}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{g.credits}学分</div>
                      <div className="text-[10px] text-muted-foreground">GPA {g.gpa.toFixed(2)}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{g.applyDate}</TableCell>
                    <TableCell>
                      <Badge variant={sConfig.variant} className={sConfig.className}>{sConfig.label}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{getCurrentRole(g)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setComment(''); setActionDialog({ open: true, type: 'view', record: g }) }}>
                          <Eye className="h-3.5 w-3.5 mr-1" />详情
                        </Button>
                        {g.status === '待确认' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setComment(''); setActionDialog({ open: true, type: 'confirm', record: g }) }}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-600" />确认
                          </Button>
                        )}
                        {g.status === '待审核' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setComment(''); setActionDialog({ open: true, type: 'submitAudit', record: g }) }}>
                            <Send className="h-3.5 w-3.5 mr-1 text-amber-600" />送审
                          </Button>
                        )}
                        {g.status === '待认定' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setComment(''); setAuditResult('pass'); setActionDialog({ open: true, type: 'audit', record: g }) }}>
                            <UserCheck className="h-3.5 w-3.5 mr-1 text-blue-600" />审核
                          </Button>
                        )}
                        {g.status === '已认定' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setComment(''); setActionDialog({ open: true, type: 'publish', record: g }) }}>
                            <Send className="h-3.5 w-3.5 mr-1 text-purple-600" />发布
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">暂无数据</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 操作/详情 Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => { if (!open) { setActionDialog({ open: false, type: 'view' }); setComment(''); setAuditResult('pass') } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.type === 'view' && <Eye className="h-5 w-5" />}
              {actionDialog.type === 'confirm' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {actionDialog.type === 'submitAudit' && <Send className="h-5 w-5 text-amber-600" />}
              {actionDialog.type === 'audit' && <UserCheck className="h-5 w-5 text-blue-600" />}
              {actionDialog.type === 'publish' && <Send className="h-5 w-5 text-purple-600" />}
              {actionDialog.type === 'view' && '成绩认定详情'}
              {actionDialog.type === 'confirm' && '成绩确认'}
              {actionDialog.type === 'submitAudit' && '成绩送审'}
              {actionDialog.type === 'audit' && '成绩审核'}
              {actionDialog.type === 'publish' && '成绩发布'}
            </DialogTitle>
          </DialogHeader>
          {actionDialog.record && (
            <div className="space-y-5 py-2">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(() => {
                  const stu = students.find((s) => s.id === actionDialog.record!.studentId)
                  const term = terms.find((t) => t.id === actionDialog.record!.termId)
                  return (
                    <>
                      <div className="space-y-0.5">
                        <div className="text-xs text-muted-foreground">学生</div>
                        <div className="text-sm font-medium">{stu?.name} <span className="text-muted-foreground font-normal">({stu?.studentId})</span></div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-muted-foreground">学期</div>
                        <div className="text-sm font-medium">{term?.year} {term?.semester}</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-muted-foreground">认定类型</div>
                        <Badge className={`text-[10px] ${applyTypeColors[actionDialog.record!.applyType] || ''}`}>{actionDialog.record!.applyType}</Badge>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-muted-foreground">成绩类型</div>
                        <div className="text-sm font-medium">{actionDialog.record!.gradeType}</div>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* 课程映射与成绩 */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="text-sm font-medium">课程与成绩信息</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">目标课程</div>
                    <div className="font-medium">{actionDialog.record.courseName}</div>
                  </div>
                  {actionDialog.record.originalCourse && (
                    <div>
                      <div className="text-xs text-muted-foreground">原课程</div>
                      <div className="font-medium">{actionDialog.record.originalCourse}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground">原始成绩 / 认定成绩</div>
                    <div className="font-medium">{actionDialog.record.rawScore} / {actionDialog.record.recognizedScore}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">学分 / 绩点</div>
                    <div className="font-medium">{actionDialog.record.credits}学分 / GPA {actionDialog.record.gpa.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* 审核历史 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <History className="h-4 w-4" />
                  审核流程记录
                </div>
                <div className="space-y-2">
                  {actionDialog.record.auditHistory.map((ah, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{ah.step}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{ah.role}</span>
                          <Badge variant="outline" className="text-[10px]">{ah.action}</Badge>
                          <span className="text-xs text-muted-foreground">{ah.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">操作人：{ah.operator}</div>
                        {ah.comment && <div className="text-xs mt-0.5 text-gray-600 bg-gray-50 rounded px-2 py-1">{ah.comment}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作区域 */}
              {actionDialog.type !== 'view' && (
                <div className="space-y-3 border-t pt-4">
                  {actionDialog.type === 'audit' && (
                    <div className="space-y-3">
                      <Label>审核结论</Label>
                      <RadioGroup value={auditResult} onValueChange={(v) => setAuditResult(v as any)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pass" id="pass" />
                          <Label htmlFor="pass" className="text-green-700 cursor-pointer">审核通过</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="return" id="return" />
                          <Label htmlFor="return" className="text-amber-700 cursor-pointer">退回修改</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reject" id="reject" />
                          <Label htmlFor="reject" className="text-red-700 cursor-pointer">审核不通过</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>
                      {actionDialog.type === 'confirm' && '确认意见'}
                      {actionDialog.type === 'submitAudit' && '送审备注'}
                      {actionDialog.type === 'audit' && '审核意见'}
                      {actionDialog.type === 'publish' && '发布备注'}
                    </Label>
                    <Textarea
                      placeholder="请输入意见或备注..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => { setActionDialog({ open: false, type: 'view' }); setComment(''); setAuditResult('pass') }}>
                  {actionDialog.type === 'view' ? '关闭' : '取消'}
                </Button>
                {actionDialog.type !== 'view' && (
                  <Button onClick={() => handleSingleAction(actionDialog.record!, actionDialog.type)}>
                    {actionDialog.type === 'confirm' && <CheckCircle className="h-4 w-4 mr-1" />}
                    {actionDialog.type === 'submitAudit' && <Send className="h-4 w-4 mr-1" />}
                    {actionDialog.type === 'audit' && <UserCheck className="h-4 w-4 mr-1" />}
                    {actionDialog.type === 'publish' && <Send className="h-4 w-4 mr-1" />}
                    {actionDialog.type === 'confirm' && '确认'}
                    {actionDialog.type === 'submitAudit' && '确认送审'}
                    {actionDialog.type === 'audit' && '提交审核'}
                    {actionDialog.type === 'publish' && '确认发布'}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 新增认定申请 Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePlus className="h-5 w-5" />
              新增成绩认定申请
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>认定类型</Label>
              <Select defaultValue="课程替代">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {applyTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>学生</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择学生" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.studentId})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>学期</Label>
                <Select defaultValue="t2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.year} {t.semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>原课程（选填）</Label>
                <Input placeholder="已修课程名称" />
              </div>
              <div className="space-y-2">
                <Label>目标课程</Label>
                <Input placeholder="认定课程名称" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>成绩类型</Label>
                <Select defaultValue="总评">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['平时', '期中', '期末', '实践', '总评', '补考', '重修'].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>原始成绩</Label>
                <Input type="number" placeholder="0-100" />
              </div>
              <div className="space-y-2">
                <Label>认定成绩</Label>
                <Input type="number" placeholder="0-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>申请备注</Label>
              <Textarea placeholder="请填写认定原因或备注..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('认定申请已提交'); setAddDialogOpen(false) }}>提交申请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
