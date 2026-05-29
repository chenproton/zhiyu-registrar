'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  CheckCircle,
  XCircle,
  Search,
  GraduationCap,
  Users,
  AlertCircle,
  Eye,
  History,
  UserCheck,
  RotateCcw,
  Cpu,
  FileCheck,
} from 'lucide-react'
import { degreeRecognitions, students, trainingPrograms, classes, majors } from '@/lib/mock-data'
import type { DegreeRecognition } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function DegreesPage() {
  const [records, setRecords] = useState<DegreeRecognition[]>(degreeRecognitions)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [auditDialog, setAuditDialog] = useState<{ open: boolean; record?: DegreeRecognition }>({ open: false })
  const [comment, setComment] = useState('')
  const [auditResult, setAuditResult] = useState<'pass' | 'reject' | 'return'>('pass')

  const filtered = useMemo(() => {
    return records.filter((dr) => {
      const stu = students.find((s) => s.id === dr.studentId)
      if (!search) return true
      const q = search.toLowerCase()
      return stu?.name.toLowerCase().includes(q) || stu?.studentId.toLowerCase().includes(q)
    })
  }, [records, search])

  const stats = useMemo(() => {
    const total = records.length
    const qualified = records.filter((dr) => dr.degreeStatus === '符合毕业条件').length
    const unqualified = total - qualified
    return { total, qualified, unqualified }
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

  function runPreAudit() {
    toast.success('系统预审核完成，已更新认定状态')
  }

  function handleBatchAudit() {
    const selected = records.filter((r) => selectedIds.has(r.id))
    let count = 0
    selected.forEach((r) => {
      if (r.degreeStatus !== '符合毕业条件') {
        setRecords((prev) =>
          prev.map((rec) =>
            rec.id === r.id
              ? {
                  ...rec,
                  degreeStatus: auditResult === 'pass' ? '符合毕业条件' : rec.degreeStatus,
                  auditHistory: [
                    ...rec.auditHistory,
                    {
                      step: rec.auditHistory.length + 1,
                      role: '教务处复审',
                      action: auditResult === 'pass' ? '审核通过' : auditResult === 'reject' ? '审核不通过' : '退回',
                      operator: '李处长',
                      date: new Date().toISOString().slice(0, 10),
                      comment: comment || undefined,
                    },
                  ],
                }
              : rec
          )
        )
        count++
      }
    })
    setSelectedIds(new Set())
    toast.success(`批量审核完成，共处理 ${count} 条记录`)
    setComment('')
  }

  function handleSingleAudit(record: DegreeRecognition) {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === record.id
          ? {
              ...rec,
              degreeStatus: auditResult === 'pass' ? '符合毕业条件' : rec.degreeStatus,
              auditHistory: [
                ...rec.auditHistory,
                {
                  step: rec.auditHistory.length + 1,
                  role: '教务处复审',
                  action: auditResult === 'pass' ? '审核通过' : auditResult === 'reject' ? '审核不通过' : '退回',
                  operator: '李处长',
                  date: new Date().toISOString().slice(0, 10),
                  comment: comment || undefined,
                },
              ],
            }
          : rec
      )
    )
    setAuditDialog({ open: false })
    setComment('')
    setAuditResult('pass')
    toast.success(auditResult === 'pass' ? '审核通过，已更新毕业条件状态' : auditResult === 'reject' ? '审核不通过' : '已退回')
  }

  function getMissingItems(dr: DegreeRecognition) {
    const prog = trainingPrograms.find((p) => p.id === dr.programId)
    const items: string[] = []
    const creditRate = Math.round((dr.totalCredits / (prog?.totalCredits || 1)) * 100)
    const requiredRate = Math.round((dr.requiredPassed / dr.requiredTotal) * 100)
    if (creditRate < 100) items.push(`学分未达标（${dr.totalCredits}/${prog?.totalCredits}）`)
    if (requiredRate < 100) items.push(`必修课未全部合格（${dr.requiredPassed}/${dr.requiredTotal}）`)
    if (dr.graduationDesignStatus !== '合格') items.push('毕业设计未通过')
    if (dr.attendanceRate < 80) items.push(`出勤率低于80%（${dr.attendanceRate}%）`)
    if (dr.scenePassed < dr.sceneTotal) items.push(`实践场景未全部达标（${dr.scenePassed}/${dr.sceneTotal}）`)
    return items
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学历认定</h1>
          <p className="text-muted-foreground">学分修满、毕业资格与学历认定审核全流程</p>
        </div>
        <Button variant="outline" onClick={runPreAudit}>
          <Cpu className="h-4 w-4 mr-2" />一键预审核
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">认定总数</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">符合毕业条件</p>
              <p className="text-2xl font-bold text-green-600">{stats.qualified}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">不符合条件</p>
              <p className="text-2xl font-bold text-red-500">{stats.unqualified}</p>
            </div>
            <div className="rounded-full p-2 bg-red-500">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索学生姓名或学号..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 批量操作栏 */}
      {someSelected && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-800 font-medium">已选择 {selectedIds.size} 条记录</span>
          <div className="flex-1" />
          <Button size="sm" variant="outline" onClick={() => handleBatchAudit()}>
            <UserCheck className="h-3.5 w-3.5 mr-1" />批量审核
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />取消选择
          </Button>
        </div>
      )}

      {/* 学历认定列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">学历认定审核列表</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="全选" />
                </TableHead>
                <TableHead>学生</TableHead>
                <TableHead>培养方案</TableHead>
                <TableHead>学分完成率</TableHead>
                <TableHead>必修课合格率</TableHead>
                <TableHead>毕设状态</TableHead>
                <TableHead>出勤率</TableHead>
                <TableHead>实践场景</TableHead>
                <TableHead>认定结果</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((dr) => {
                const stu = students.find((s) => s.id === dr.studentId)
                const prog = trainingPrograms.find((p) => p.id === dr.programId)
                const cls = classes.find((c) => c.id === stu?.classId)
                const major = majors.find((m) => m.id === stu?.majorId)
                const creditRate = Math.round((dr.totalCredits / (prog?.totalCredits || 1)) * 100)
                const requiredRate = Math.round((dr.requiredPassed / dr.requiredTotal) * 100)
                const missing = getMissingItems(dr)
                return (
                  <TableRow key={dr.id}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(dr.id)} onCheckedChange={() => toggleSelect(dr.id)} aria-label={`选择 ${stu?.name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{stu?.name}</div>
                      <div className="text-xs text-muted-foreground">{stu?.studentId}</div>
                      <div className="text-xs text-muted-foreground">{cls?.name} · {major?.name}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{prog?.name || '-'}</div>
                      <div className="text-xs text-muted-foreground">{prog?.code}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-[120px]">
                        <Progress value={creditRate} className="h-2 flex-1" />
                        <span className="text-xs w-10">{creditRate}%</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{dr.totalCredits}/{prog?.totalCredits} 学分</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-[120px]">
                        <Progress value={requiredRate} className="h-2 flex-1" />
                        <span className="text-xs w-10">{requiredRate}%</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{dr.requiredPassed}/{dr.requiredTotal} 门合格</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={dr.graduationDesignStatus === '合格' ? 'default' : 'destructive'} className="text-xs">
                        {dr.graduationDesignStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className={dr.attendanceRate >= 80 ? 'text-green-600' : 'text-red-500'}>
                        {dr.attendanceRate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {dr.scenePassed}/{dr.sceneTotal} 达标
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={dr.degreeStatus === '符合毕业条件' ? 'default' : 'destructive'}
                        className={dr.degreeStatus === '符合毕业条件' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {dr.degreeStatus}
                      </Badge>
                      {missing.length > 0 && (
                        <div className="text-[10px] text-red-500 mt-0.5">缺{missing.length}项</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setAuditDialog({ open: true, record: dr })}>
                          <Eye className="h-3.5 w-3.5 mr-1" />详情/审核
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 审核详情 Dialog */}
      <Dialog open={auditDialog.open} onOpenChange={(open) => { if (!open) { setAuditDialog({ open: false }); setComment(''); setAuditResult('pass') } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              学历认定审核
            </DialogTitle>
          </DialogHeader>
          {auditDialog.record && (
            <div className="space-y-5 py-2">
              {(() => {
                const dr = auditDialog.record!
                const stu = students.find((s) => s.id === dr.studentId)
                const prog = trainingPrograms.find((p) => p.id === dr.programId)
                const creditRate = Math.round((dr.totalCredits / (prog?.totalCredits || 1)) * 100)
                const requiredRate = Math.round((dr.requiredPassed / dr.requiredTotal) * 100)
                const missing = getMissingItems(dr)
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">学生</div>
                        <div className="font-medium">{stu?.name} ({stu?.studentId})</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">培养方案</div>
                        <div className="font-medium">{prog?.name}</div>
                      </div>
                    </div>

                    {/* 系统预审核报告 */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Cpu className="h-4 w-4 text-blue-600" />
                        系统预审核报告
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Card className={creditRate >= 100 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold">{creditRate}%</div>
                            <div className="text-xs text-muted-foreground">学分完成率</div>
                          </CardContent>
                        </Card>
                        <Card className={requiredRate >= 100 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold">{requiredRate}%</div>
                            <div className="text-xs text-muted-foreground">必修课合格率</div>
                          </CardContent>
                        </Card>
                        <Card className={dr.graduationDesignStatus === '合格' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold">{dr.graduationDesignStatus}</div>
                            <div className="text-xs text-muted-foreground">毕业设计</div>
                          </CardContent>
                        </Card>
                        <Card className={dr.attendanceRate >= 80 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                          <CardContent className="p-3 text-center">
                            <div className="text-lg font-bold">{dr.attendanceRate}%</div>
                            <div className="text-xs text-muted-foreground">出勤率</div>
                          </CardContent>
                        </Card>
                      </div>
                      {missing.length > 0 ? (
                        <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
                          <div className="font-medium mb-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />不符合毕业条件，缺失项：</div>
                          <ul className="list-disc list-inside space-y-0.5">
                            {missing.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">系统预审核通过，符合毕业条件</span>
                        </div>
                      )}
                    </div>

                    {/* 审核历史 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <History className="h-4 w-4" />
                        审核流程记录
                      </div>
                      <div className="space-y-2">
                        {dr.auditHistory.map((ah, idx) => (
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

                    {/* 审核操作 */}
                    <div className="space-y-3 border-t pt-4">
                      <Label>审核结论</Label>
                      <RadioGroup value={auditResult} onValueChange={(v) => setAuditResult(v as any)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pass" id="dpass" />
                          <Label htmlFor="dpass" className="text-green-700 cursor-pointer">审核通过</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="return" id="dreturn" />
                          <Label htmlFor="dreturn" className="text-amber-700 cursor-pointer">退回补材料</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reject" id="dreject" />
                          <Label htmlFor="dreject" className="text-red-700 cursor-pointer">审核不通过</Label>
                        </div>
                      </RadioGroup>
                      <div className="space-y-2">
                        <Label>审核意见</Label>
                        <Textarea placeholder="请输入审核意见..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button variant="outline" onClick={() => { setAuditDialog({ open: false }); setComment(''); setAuditResult('pass') }}>取消</Button>
                      <Button onClick={() => handleSingleAudit(dr)}>
                        <UserCheck className="h-4 w-4 mr-1" />提交审核
                      </Button>
                    </DialogFooter>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
