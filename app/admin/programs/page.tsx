'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Eye, FileText, Building2, Users, UserPlus } from 'lucide-react'
import { trainingPrograms as initialPrograms, majors, departments, grades } from '@/lib/mock-data'
import type { TrainingProgram } from '@/lib/mock-data'
import { toast } from 'sonner'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  pending: { label: '审批中', variant: 'outline' },
  published: { label: '已发布', variant: 'default' },
  deprecated: { label: '已废止', variant: 'destructive' },
}

const emptyProgram: TrainingProgram = {
  id: '',
  name: '',
  code: '',
  majorId: '',
  entryYear: 2026,
  level: '本科',
  duration: 4,
  totalCredits: 0,
  requiredCredits: 0,
  electiveCredits: 0,
  practiceCredits: 0,
  courses: [],
  status: 'draft',
  startDate: '',
  endDate: '',
  creator: '',
  collaborators: [],
  createdAt: '',
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms)
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || '')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<TrainingProgram>({ ...emptyProgram })

  // 邀请共建弹窗
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteProgram, setInviteProgram] = useState<TrainingProgram | null>(null)
  const [inviteName, setInviteName] = useState('')

  // 当前选中院系下的专业列表
  const deptMajors = useMemo(() => {
    return majors.filter((m) => m.departmentId === selectedDeptId)
  }, [selectedDeptId])

  const selectedDeptName = departments.find((d) => d.id === selectedDeptId)?.name || ''

  // 所有不重复的入学年份
  const allYears = useMemo(() => {
    const years = Array.from(new Set(programs.map((p) => p.entryYear)))
    return years.sort((a, b) => b - a)
  }, [programs])

  // 过滤后的培养方案
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const major = majors.find((m) => m.id === p.majorId)
      if (major?.departmentId !== selectedDeptId) return false
      if (selectedYear !== 'all' && p.entryYear !== Number(selectedYear)) return false
      return true
    })
  }, [programs, selectedDeptId, selectedYear])

  const openCreate = () => {
    const defaultMajor = deptMajors[0]
    const defaultYear = selectedYear !== 'all' ? Number(selectedYear) : (allYears[0] || 2026)
    setEditingProgram({
      ...emptyProgram,
      id: `tp${Date.now()}`,
      majorId: defaultMajor?.id || '',
      entryYear: defaultYear,
      creator: '当前用户',
      createdAt: new Date().toISOString().split('T')[0],
    })
    setCreateOpen(true)
  }

  const openEdit = (program: TrainingProgram) => {
    setEditingProgram({ ...program })
    setEditOpen(true)
  }

  const handleDelete = (programId: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== programId))
    toast.success('删除成功')
  }

  const handleSaveCreate = () => {
    if (!editingProgram.name || !editingProgram.code) {
      toast.error('请填写完整信息')
      return
    }
    setPrograms((prev) => [...prev, editingProgram])
    toast.success('新建方案成功')
    setCreateOpen(false)
  }

  const handleSaveEdit = () => {
    if (!editingProgram.name || !editingProgram.code) {
      toast.error('请填写完整信息')
      return
    }
    setPrograms((prev) => prev.map((p) => (p.id === editingProgram.id ? editingProgram : p)))
    toast.success('保存成功')
    setEditOpen(false)
  }

  const renderProgramForm = (isEdit: boolean) => {
    const gradeName = grades.find((g) => g.entryYear === editingProgram.entryYear)?.name || `${editingProgram.entryYear}级`

    return (
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>方案名称</Label>
            <Input
              value={editingProgram.name}
              onChange={(e) => setEditingProgram((p) => ({ ...p, name: e.target.value }))}
              placeholder="如 2026级软件工程专业人才培养方案"
            />
          </div>
          <div className="space-y-2">
            <Label>方案编码</Label>
            <Input
              value={editingProgram.code}
              onChange={(e) => setEditingProgram((p) => ({ ...p, code: e.target.value }))}
              placeholder="如 TP-SE-2026"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>所属院系</Label>
            <Input value={selectedDeptName} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>适用年级</Label>
            <Input value={gradeName} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>面向专业</Label>
            <Select
              value={editingProgram.majorId}
              onValueChange={(v) => setEditingProgram((p) => ({ ...p, majorId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择专业" />
              </SelectTrigger>
              <SelectContent>
                {deptMajors.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>总学分</Label>
            <Input
              type="number"
              value={editingProgram.totalCredits}
              onChange={(e) => setEditingProgram((p) => ({ ...p, totalCredits: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>必修学分</Label>
            <Input
              type="number"
              value={editingProgram.requiredCredits}
              onChange={(e) => setEditingProgram((p) => ({ ...p, requiredCredits: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>选修学分</Label>
            <Input
              type="number"
              value={editingProgram.electiveCredits}
              onChange={(e) => setEditingProgram((p) => ({ ...p, electiveCredits: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>实践学分</Label>
            <Input
              type="number"
              value={editingProgram.practiceCredits}
              onChange={(e) => setEditingProgram((p) => ({ ...p, practiceCredits: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>方案开始时间</Label>
            <Input
              type="date"
              value={editingProgram.startDate || ''}
              onChange={(e) => setEditingProgram((p) => ({ ...p, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>方案结束时间</Label>
            <Input
              type="date"
              value={editingProgram.endDate || ''}
              onChange={(e) => setEditingProgram((p) => ({ ...p, endDate: e.target.value }))}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧院系导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">二级学院/院系</span>
        </div>
        <div className="space-y-1">
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDeptId(d.id)
                setSelectedYear('all')
                setExpandedId(null)
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                selectedDeptId === d.id
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{d.name}</span>
                <span className={`text-xs ${selectedDeptId === d.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {majors.filter((m) => m.departmentId === d.id).length}个专业
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">培养方案管理</h1>
            <p className="text-muted-foreground text-sm">
              {selectedDeptName} · 共 {filteredPrograms.length} 个培养方案
            </p>
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />新建方案</Button>
        </div>

        {/* 年级筛选 */}
        <Tabs value={selectedYear} onValueChange={setSelectedYear}>
          <TabsList>
            <TabsTrigger value="all">全部年级</TabsTrigger>
            {allYears.map((y) => (
              <TabsTrigger key={y} value={String(y)}>{y}级</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 培养方案卡片列表 */}
        <div className="space-y-4">
          {filteredPrograms.map((tp) => {
            const major = majors.find((m) => m.id === tp.majorId)
            return (
              <Card key={tp.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {tp.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        方案编码：{tp.code} · 适用专业：{major?.name} · {tp.entryYear}级入学
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusMap[tp.status].variant}>{statusMap[tp.status].label}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(tp)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setInviteProgram(tp); setInviteName(''); setInviteOpen(true) }}>
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(tp.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">总学分</p>
                      <p className="font-medium">{tp.totalCredits}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">必修学分</p>
                      <p className="font-medium">{tp.requiredCredits}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">选修学分</p>
                      <p className="font-medium">{tp.electiveCredits}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">实践学分</p>
                      <p className="font-medium">{tp.practiceCredits}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>创建人：{tp.creator || '—'}</span>
                    </div>
                    {tp.collaborators && tp.collaborators.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>共建人：{tp.collaborators.join('、')}</span>
                      </div>
                    )}
                    <div>
                      <span>创建时间：{tp.createdAt || '—'}</span>
                    </div>
                    {tp.startDate && tp.endDate && (
                      <div>
                        <span>有效期：{tp.startDate} 至 {tp.endDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === tp.id ? null : tp.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedId === tp.id ? '收起课程计划' : '查看课程计划'}
                    </Button>
                  </div>

                  {expandedId === tp.id && (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>课程编码</TableHead>
                            <TableHead>课程名称</TableHead>
                            <TableHead>学分</TableHead>
                            <TableHead>学时</TableHead>
                            <TableHead>学期</TableHead>
                            <TableHead>课程性质</TableHead>
                            <TableHead>考核方式</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tp.courses.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>{c.code}</TableCell>
                              <TableCell>{c.name}</TableCell>
                              <TableCell>{c.credits}</TableCell>
                              <TableCell>{c.hours}</TableCell>
                              <TableCell>第{c.semester}学期</TableCell>
                              <TableCell><Badge variant="outline">{c.nature}</Badge></TableCell>
                              <TableCell>{c.assessment}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {filteredPrograms.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                该院系下暂无培养方案
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 新建方案弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建培养方案</DialogTitle>
          </DialogHeader>
          {renderProgramForm(false)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={handleSaveCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑方案弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑培养方案</DialogTitle>
          </DialogHeader>
          {renderProgramForm(true)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 邀请共建弹窗 */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>邀请共建 — {inviteProgram?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>被邀请人姓名</Label>
              <Input
                placeholder="请输入被邀请人姓名"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>取消</Button>
            <Button onClick={() => {
              if (!inviteName.trim()) {
                toast.error('请输入被邀请人姓名')
                return
              }
              if (inviteProgram) {
                setPrograms((prev) => prev.map((p) =>
                  p.id === inviteProgram.id
                    ? { ...p, collaborators: [...(p.collaborators || []), inviteName.trim()] }
                    : p
                ))
              }
              toast.success(`已成功邀请 ${inviteName.trim()} 共建该方案`)
              setInviteOpen(false)
            }}>确认邀请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
