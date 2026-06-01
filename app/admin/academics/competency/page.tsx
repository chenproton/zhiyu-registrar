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
  Award,
  Search,
  Eye,
  CheckCircle2,
  Briefcase,
  Star,
  TrendingUp,
  Users,
  History,
  UserCheck,
  RotateCcw,
  BadgeCheck,
  XCircle,
} from 'lucide-react'
import { students, classes, majors, degreeRecognitions } from '@/lib/mock-data'
import { toast } from 'sonner'

const COMPETENCY_DOMAINS = [
  { key: 'industry', label: '行业与岗位认知', weight: 15 },
  { key: 'knowledge', label: '专业知识', weight: 25 },
  { key: 'skill', label: '专业技能', weight: 30 },
  { key: 'general', label: '通用能力', weight: 15 },
  { key: 'quality', label: '职业素养', weight: 15 },
]

const MOCK_SCENE_RATINGS = [
  { sceneName: '企业官网开发', taskName: 'Web前端综合实训', rating: 'B', score: 82 },
  { sceneName: '电商平台后端', taskName: 'API接口设计与测试', rating: 'A', score: 91 },
  { sceneName: '高并发系统', taskName: '数据库优化方案', rating: 'C', score: 75 },
]

function CompetencyLevelBadge({ level }: { level: string }) {
  const map: Record<string, { className: string; label: string }> = {
    初级: { className: 'bg-blue-100 text-blue-700 hover:bg-blue-200', label: '初级' },
    中级: { className: 'bg-amber-100 text-amber-700 hover:bg-amber-200', label: '中级' },
    高级: { className: 'bg-green-100 text-green-700 hover:bg-green-200', label: '高级' },
  }
  const config = map[level] || { className: 'bg-gray-100 text-gray-700', label: level }
  return <Badge className={config.className}>{config.label}</Badge>
}

function RatingBadge({ rating }: { rating: string }) {
  const map: Record<string, string> = {
    A: 'bg-green-600 text-white',
    B: 'bg-emerald-500 text-white',
    C: 'bg-amber-500 text-white',
    D: 'bg-orange-500 text-white',
    E: 'bg-red-500 text-white',
  }
  return <Badge className={map[rating] || 'bg-gray-500 text-white'}>{rating}</Badge>
}

const statusConfig: Record<string, { label: string; className: string }> = {
  '待审核': { label: '待审核', className: 'bg-amber-100 text-amber-700' },
  '已认定': { label: '已认定', className: 'bg-green-100 text-green-700' },
  '已驳回': { label: '已驳回', className: 'bg-red-100 text-red-700' },
}

export default function CompetencyPage() {
  const [studentList, setStudentList] = useState(students)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; student?: typeof students[0] }>({ open: false })
  const [auditDialog, setAuditDialog] = useState<{ open: boolean; student?: typeof students[0] }>({ open: false })
  const [comment, setComment] = useState('')
  const [auditResult, setAuditResult] = useState<'pass' | 'reject'>('pass')
  const [badgeDialog, setBadgeDialog] = useState<{ open: boolean; student?: typeof students[0] }>({ open: false })

  const filteredStudents = useMemo(() => {
    return studentList.filter((s) => {
      if (!search) return true
      const q = search.toLowerCase()
      const matchSearch = s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
      if (!matchSearch) return false
      if (statusFilter !== 'all') {
        if (statusFilter === '未认定') return !s.abilityRecognition
        return s.abilityRecognition?.status === statusFilter
      }
      return true
    })
  }, [studentList, search, statusFilter])

  const stats = useMemo(() => {
    const withRecognition = studentList.filter((s) => s.abilityRecognition)
    const pending = withRecognition.filter((s) => s.abilityRecognition?.status === '待审核').length
    const certified = withRecognition.filter((s) => s.abilityRecognition?.status === '已认定').length
    const rejected = withRecognition.filter((s) => s.abilityRecognition?.status === '已驳回').length
    const scenePassedCount = studentList.filter((s) => {
      const dr = degreeRecognitions.find((d) => d.studentId === s.id)
      return dr ? dr.scenePassed >= dr.sceneTotal : false
    }).length
    return {
      total: studentList.length,
      pending,
      certified,
      rejected,
      advancedCount: withRecognition.filter((s) => s.abilityRecognition?.competencyLevel === '高级').length,
      scenePassedCount,
    }
  }, [studentList])

  const allSelected = filteredStudents.length > 0 && filteredStudents.every((s) => selectedIds.has(s.id))
  const someSelected = filteredStudents.some((s) => selectedIds.has(s.id))

  function toggleSelectAll() {
    if (allSelected) {
      const next = new Set(selectedIds)
      filteredStudents.forEach((s) => next.delete(s.id))
      setSelectedIds(next)
    } else {
      const next = new Set(selectedIds)
      filteredStudents.forEach((s) => next.add(s.id))
      setSelectedIds(next)
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function handleBatchAudit() {
    const selected = studentList.filter((s) => selectedIds.has(s.id))
    let count = 0
    selected.forEach((s) => {
      if (s.abilityRecognition && s.abilityRecognition.status === '待审核') {
        setStudentList((prev) =>
          prev.map((stu) =>
            stu.id === s.id
              ? {
                  ...stu,
                  abilityRecognition: {
                    ...stu.abilityRecognition!,
                    status: auditResult === 'pass' ? '已认定' : '已驳回',
                  },
                }
              : stu
          )
        )
        count++
      }
    })
    setSelectedIds(new Set())
    toast.success(`批量审核完成，共处理 ${count} 条记录`)
    setComment('')
  }

  function handleBatchRecognize() {
    const selected = studentList.filter((s) => selectedIds.has(s.id))
    let count = 0
    selected.forEach((s) => {
      if (s.abilityRecognition && s.abilityRecognition.status === '待审核') {
        setStudentList((prev) =>
          prev.map((stu) =>
            stu.id === s.id
              ? {
                  ...stu,
                  abilityRecognition: {
                    ...stu.abilityRecognition!,
                    status: '已认定',
                  },
                }
              : stu
          )
        )
        count++
      }
    })
    setSelectedIds(new Set())
    toast.success(`批量认定完成，共处理 ${count} 条记录`)
  }

  function handleSingleAudit(student: typeof students[0]) {
    setStudentList((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              abilityRecognition: s.abilityRecognition
                ? { ...s.abilityRecognition, status: auditResult === 'pass' ? '已认定' : '已驳回' }
                : s.abilityRecognition,
            }
          : s
      )
    )
    setAuditDialog({ open: false })
    setComment('')
    setAuditResult('pass')
    toast.success(auditResult === 'pass' ? '能力认定审核通过' : '能力认定已驳回')
  }

  function issueBadge(student: typeof students[0], badgeName: string) {
    toast.success(`已为 ${student.name} 颁发「${badgeName}」徽章`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">能力认定</h1>
          <p className="text-muted-foreground">基于实践场景与岗位胜任力的学生能力等级认证</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">学生总数</p>
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
              <p className="text-sm text-muted-foreground">待审核</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已认定</p>
              <p className="text-2xl font-bold text-green-600">{stats.certified}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已驳回</p>
              <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
            </div>
            <div className="rounded-full p-2 bg-red-500">
              <XCircle className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">高级认定</p>
              <p className="text-2xl font-bold">{stats.advancedCount}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Star className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">场景达标</p>
              <p className="text-2xl font-bold">{stats.scenePassedCount}</p>
            </div>
            <div className="rounded-full p-2 bg-fuchsia-500">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选 + 搜索 */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'all', label: '全部', count: stats.total },
              { key: '待审核', label: '待审核', count: stats.pending },
              { key: '已认定', label: '已认定', count: stats.certified },
              { key: '已驳回', label: '已驳回', count: stats.rejected },
              { key: '未认定', label: '未认定', count: stats.total - stats.pending - stats.certified - stats.rejected },
            ].map((btn) => (
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
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索学生姓名或学号..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 批量操作栏 */}
      {someSelected && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-800 font-medium">已选择 {selectedIds.size} 条记录</span>
          <div className="flex-1" />
          <Button size="sm" variant="outline" onClick={() => handleBatchAudit()}>
            <UserCheck className="h-3.5 w-3.5 mr-1" />批量审核
          </Button>
          <Button size="sm" variant="default" onClick={() => handleBatchRecognize()}>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />批量认定
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />取消选择
          </Button>
        </div>
      )}

      {/* 学生列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">学生能力认定列表</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="全选" />
                </TableHead>
                <TableHead>学生</TableHead>
                <TableHead>专业/班级</TableHead>
                <TableHead>能力等级</TableHead>
                <TableHead>已认证/总技能</TableHead>
                <TableHead>学分达标</TableHead>
                <TableHead>场景达标</TableHead>
                <TableHead>认定状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => {
                const major = majors.find((m) => m.id === s.majorId)
                const cls = classes.find((c) => c.id === s.classId)
                const ar = s.abilityRecognition
                const dr = degreeRecognitions.find((d) => d.studentId === s.id)
                const creditOk = dr ? dr.totalCredits >= (dr.requiredCredits || 0) : false
                const sceneOk = dr ? dr.scenePassed >= dr.sceneTotal : false
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Checkbox checked={selectedIds.has(s.id)} onCheckedChange={() => toggleSelect(s.id)} aria-label={`选择 ${s.name}`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.studentId}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{major?.name || '-'}</div>
                      <div className="text-xs text-muted-foreground">{cls?.name || '-'}</div>
                    </TableCell>
                    <TableCell>
                      {ar ? (
                        <CompetencyLevelBadge level={ar.competencyLevel} />
                      ) : (
                        <Badge variant="outline" className="text-xs">未认定</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ar ? `${ar.certifiedSkills} / ${ar.totalSkills}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${creditOk ? 'text-green-600 border-green-300' : 'text-red-500 border-red-300'}`}>
                        {creditOk ? '达标' : '未达标'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${sceneOk ? 'text-green-600 border-green-300' : 'text-red-500 border-red-300'}`}>
                        {dr ? `${dr.scenePassed}/${dr.sceneTotal}` : '—'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ar ? (
                        <Badge className={statusConfig[ar.status]?.className || 'bg-gray-100'}>{ar.status}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">未认定</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setDetailDialog({ open: true, student: s })}>
                          <Eye className="h-3.5 w-3.5 mr-1" />详情
                        </Button>
                        {ar?.status === '待审核' && (
                          <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => { setComment(''); setAuditResult('pass'); setAuditDialog({ open: true, student: s }) }}>
                            <UserCheck className="h-3.5 w-3.5 mr-1" />审核
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setBadgeDialog({ open: true, student: s })}>
                          <BadgeCheck className="h-3.5 w-3.5 mr-1" />徽章
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 学生能力详情 Dialog */}
      <Dialog open={detailDialog.open} onOpenChange={(open) => !open && setDetailDialog({ open: false })}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              能力认定详情 — {detailDialog.student?.name}
            </DialogTitle>
          </DialogHeader>
          {detailDialog.student && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-4 gap-3">
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{detailDialog.student.abilityRecognition?.competencyLevel || '—'}</div>
                    <div className="text-xs text-muted-foreground">能力等级</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{detailDialog.student.abilityRecognition?.certifiedSkills || 0}</div>
                    <div className="text-xs text-muted-foreground">已认证技能</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{detailDialog.student.abilityRecognition?.totalSkills || 0}</div>
                    <div className="text-xs text-muted-foreground">总技能项</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{detailDialog.student.gpa.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">学业绩点</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">能力领域评定</h3>
                <div className="space-y-2">
                  {COMPETENCY_DOMAINS.map((domain) => {
                    const val = 60 + Math.floor(Math.random() * 40)
                    const rating = val >= 90 ? 'A' : val >= 80 ? 'B' : val >= 70 ? 'C' : 'D'
                    return (
                      <div key={domain.key} className="flex items-center gap-3">
                        <span className="text-xs w-28 shrink-0">{domain.label}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-0.5">
                            <span className="text-gray-500">权重 {domain.weight}%</span>
                            <span className="font-medium">{val}分</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${val}%` }} />
                          </div>
                        </div>
                        <RatingBadge rating={rating} />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">实践场景评级</h3>
                <div className="space-y-2">
                  {MOCK_SCENE_RATINGS.map((scene, i) => (
                    <div key={i} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <div className="text-sm font-medium">{scene.sceneName}</div>
                        <div className="text-xs text-muted-foreground">{scene.taskName}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{scene.score}分</span>
                        <RatingBadge rating={scene.rating} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {detailDialog.student.abilityPortfolio && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">能力档案袋</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {detailDialog.student.abilityPortfolio.certificates?.map((c, i) => (
                      <div key={i} className="border rounded-lg p-2.5 text-xs">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-muted-foreground">{c.issuer} · {c.date}</div>
                      </div>
                    ))}
                    {detailDialog.student.abilityPortfolio.skillBadges?.map((b, i) => (
                      <div key={`badge-${i}`} className="border rounded-lg p-2.5 text-xs">
                        <div className="font-medium">{b.name}</div>
                        <div className="text-muted-foreground">{b.level} · {b.issuer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailDialog({ open: false })}>关闭</Button>
                {detailDialog.student.abilityRecognition?.status === '待审核' && (
                  <Button onClick={() => { setDetailDialog({ open: false }); setAuditDialog({ open: true, student: detailDialog.student }) }}>
                    <UserCheck className="h-4 w-4 mr-1" />去审核
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 审核 Dialog */}
      <Dialog open={auditDialog.open} onOpenChange={(open) => { if (!open) { setAuditDialog({ open: false }); setComment(''); setAuditResult('pass') } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              能力认定审核 — {auditDialog.student?.name}
            </DialogTitle>
          </DialogHeader>
          {auditDialog.student && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{auditDialog.student.abilityRecognition?.competencyLevel || '—'}</div>
                    <div className="text-xs text-muted-foreground">能力等级</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{auditDialog.student.abilityRecognition?.certifiedSkills || 0}</div>
                    <div className="text-xs text-muted-foreground">已认证技能</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">{auditDialog.student.gpa.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">学业绩点</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <Label>审核结论</Label>
                <RadioGroup value={auditResult} onValueChange={(v) => setAuditResult(v as any)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pass" id="cpass" />
                    <Label htmlFor="cpass" className="text-green-700 cursor-pointer">审核通过</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reject" id="creject" />
                    <Label htmlFor="creject" className="text-red-700 cursor-pointer">审核不通过</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>审核意见</Label>
                <Textarea placeholder="请输入审核意见..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => { setAuditDialog({ open: false }); setComment(''); setAuditResult('pass') }}>取消</Button>
                <Button onClick={() => handleSingleAudit(auditDialog.student!)}>
                  <UserCheck className="h-4 w-4 mr-1" />提交审核
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 徽章管理 Dialog */}
      <Dialog open={badgeDialog.open} onOpenChange={(open) => !open && setBadgeDialog({ open: false })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              技能徽章管理 — {badgeDialog.student?.name}
            </DialogTitle>
          </DialogHeader>
          {badgeDialog.student && (
            <div className="space-y-4 py-2">
              <div className="text-sm text-muted-foreground">当前已获得徽章：</div>
              <div className="space-y-2">
                {badgeDialog.student.abilityPortfolio?.skillBadges?.map((b, i) => (
                  <div key={i} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="text-sm font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.level} · {b.issuer}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">已颁发</Badge>
                  </div>
                )) || <div className="text-sm text-muted-foreground">暂无徽章</div>}
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="text-sm font-medium">颁发新徽章</div>
                <div className="grid grid-cols-2 gap-2">
                  {['Python编程', '数据分析', '项目管理', '团队协作', '前端开发', '后端开发'].map((name) => (
                    <Button key={name} variant="outline" size="sm" onClick={() => issueBadge(badgeDialog.student!, name)}>
                      <Award className="h-3.5 w-3.5 mr-1" />{name}
                    </Button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBadgeDialog({ open: false })}>关闭</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
