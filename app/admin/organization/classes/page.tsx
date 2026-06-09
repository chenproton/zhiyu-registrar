'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
import { FilterBar } from '@/components/shared/filter-bar'
import { Plus, ChevronRight, ChevronDown } from 'lucide-react'
import { classes, majors, departments, grades, students } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ClassesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    department: 'all',
    major: 'all',
  })
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null)
  const [treeFilter, setTreeFilter] = useState<'all' | 'teaching'>('all')
  const [editType, setEditType] = useState<'行政班' | '教学班（如订单班）'>('行政班')

  // 新建弹窗
  const [typeSelectOpen, setTypeSelectOpen] = useState(false)
  const [createType, setCreateType] = useState<'行政班' | '教学班（如订单班）'>('行政班')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<typeof classes[0] | null>(null)

  // 弹窗内联动的院系/专业选择
  const [createDept, setCreateDept] = useState('')
  const [createMajor, setCreateMajor] = useState('')
  const [editDept, setEditDept] = useState('')

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      if (search) {
        const s = search.toLowerCase()
        if (!c.name.toLowerCase().includes(s) && !c.code.toLowerCase().includes(s)) return false
      }
      const major = majors.find((m) => m.id === c.majorId)
      if (filters.department !== 'all' && major?.departmentId !== filters.department) return false
      if (filters.major !== 'all' && c.majorId !== filters.major) return false
      if (selectedGradeId && c.gradeId !== selectedGradeId) return false
      if (treeFilter === 'teaching' && c.type !== '教学班（如订单班）') return false
      return true
    })
  }, [search, filters, selectedGradeId, treeFilter])

  const majorOptions = useMemo(() => {
    if (filters.department !== 'all') {
      return majors.filter((m) => m.departmentId === filters.department)
    }
    return majors
  }, [filters.department])

  const getDepartmentName = (majorId: string) => {
    const major = majors.find((m) => m.id === majorId)
    const dept = departments.find((d) => d.id === major?.departmentId)
    return dept?.name || '-'
  }

  const getMajorName = (majorId: string) => {
    return majors.find((m) => m.id === majorId)?.name || '-'
  }

  const getGradeName = (gradeId: string) => {
    return grades.find((g) => g.id === gradeId)?.name || '-'
  }

  const openEdit = (c: typeof classes[0]) => {
    setSelectedClass(c)
    setEditType(c.type)
    const major = majors.find((m) => m.id === c.majorId)
    setEditDept(major?.departmentId || '')
    setEditOpen(true)
  }

  const handleStudentClick = (classId: string) => {
    router.push(`/admin/organization/students?classId=${classId}`)
  }

  // 组织架构树数据（院系 → 专业 → 年级）
  const treeData = useMemo(() => {
    return departments.map(dept => {
      const deptMajors = majors.filter(m => m.departmentId === dept.id)
      return {
        ...dept,
        majors: deptMajors.map(major => {
          const majorClasses = classes.filter(c => c.majorId === major.id)
          const gradeIds = [...new Set(majorClasses.map(c => c.gradeId))]
          return {
            ...major,
            grades: gradeIds.map(gid => grades.find(g => g.id === gid)!).filter(Boolean)
          }
        })
      }
    })
  }, [])

  const handleStartCreate = () => {
    setCreateType('行政班')
    setCreateDept('')
    setCreateMajor('')
    setTypeSelectOpen(true)
  }

  const handleTypeConfirm = () => {
    setTypeSelectOpen(false)
    setCreateOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">班级管理</h1>
          <p className="text-muted-foreground">维护各专业下设班级信息</p>
        </div>
        <Button onClick={handleStartCreate}>
          <Plus className="h-4 w-4 mr-2" />新建班级
        </Button>
      </div>

      <div className="flex gap-4 items-start">
        {/* 左侧组织架构树 */}
        <Card className="w-64 shrink-0">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">组织架构</h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedGradeId(null); setTreeFilter('all') }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors',
                    selectedGradeId === null && treeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  全部班级
                </button>
                <button
                  onClick={() => { setSelectedGradeId(null); setTreeFilter('teaching') }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors',
                    selectedGradeId === null && treeFilter === 'teaching' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  教学班
                </button>
                {treeData.map(dept => (
                  <DeptNode
                    key={dept.id}
                    dept={dept}
                    selectedGradeId={selectedGradeId}
                    onSelectGrade={setSelectedGradeId}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 右侧内容 */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <FilterBar
                searchPlaceholder="搜索班级名称或编码..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                  {
                    key: 'department',
                    label: '全部院系',
                    options: departments.map((d) => ({ value: d.id, label: d.name })),
                  },
                  {
                    key: 'major',
                    label: '全部专业',
                    options: majorOptions.map((m) => ({ value: m.id, label: m.name })),
                  },
                ]}
                filterValues={filters}
                onFilterChange={(key, value) => {
                  setFilters((p) => {
                    const next = { ...p, [key]: value }
                    if (key === 'department') next.major = 'all'
                    return next
                  })
                }}
                onClearFilters={() => { setSearch(''); setFilters({ department: 'all', major: 'all' }) }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>班级名称</TableHead>
                    <TableHead>班级编码</TableHead>
                    <TableHead>所属院系</TableHead>
                    <TableHead>所属专业</TableHead>
                    <TableHead>所属年级</TableHead>
                    <TableHead>学生数</TableHead>
                    <TableHead>班级性质</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.code}</TableCell>
                      <TableCell>{getDepartmentName(c.majorId)}</TableCell>
                      <TableCell>{getMajorName(c.majorId)}</TableCell>
                      <TableCell>{getGradeName(c.gradeId)}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 font-bold text-blue-600 hover:underline"
                          onClick={() => handleStudentClick(c.id)}
                        >
                          {students.filter((s) => s.classId === c.id).length}
                        </Button>
                      </TableCell>
                      <TableCell>{c.type}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>编辑</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        暂无符合条件的班级
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 第一步：选择班级性质 */}
      <Dialog open={typeSelectOpen} onOpenChange={setTypeSelectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>新建班级</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-3 block">选择班级性质</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setCreateType('行政班'); handleTypeConfirm() }}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 transition-colors hover:bg-muted',
                  createType === '行政班' ? 'border-primary bg-primary/5' : 'border-muted'
                )}
              >
                <div className="text-lg font-semibold">行政班</div>
                <div className="text-xs text-muted-foreground">常规行政班级</div>
              </button>
              <button
                onClick={() => { setCreateType('教学班（如订单班）'); handleTypeConfirm() }}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 transition-colors hover:bg-muted',
                  createType === '教学班（如订单班）' ? 'border-primary bg-primary/5' : 'border-muted'
                )}
              >
                <div className="text-lg font-semibold">教学班</div>
                <div className="text-xs text-muted-foreground">如订单班等</div>
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTypeSelectOpen(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 第二步：行政班 → 完整表单 */}
      <Dialog open={createOpen && createType === '行政班'} onOpenChange={(open) => { if (!open) setCreateOpen(false) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建行政班</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>班级名称</Label><Input placeholder="请输入班级名称" /></div>
              <div className="space-y-2"><Label>班级编码</Label><Input placeholder="请输入班级编码" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>所属院系</Label>
                <Select value={createDept} onValueChange={(v) => { setCreateDept(v); setCreateMajor('') }}>
                  <SelectTrigger><SelectValue placeholder="选择院系" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>所属专业</Label>
                <Select value={createMajor} onValueChange={setCreateMajor} disabled={!createDept}>
                  <SelectTrigger><SelectValue placeholder={createDept ? '选择专业' : '请先选择院系'} /></SelectTrigger>
                  <SelectContent>
                    {majors.filter((m) => m.departmentId === createDept).map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>所属年级</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择年级" /></SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>班级性质</Label>
                <Input value="行政班" readOnly className="bg-muted" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新建班级成功'); setCreateOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 第二步：教学班 → 精简表单 */}
      <Dialog open={createOpen && createType === '教学班（如订单班）'} onOpenChange={(open) => { if (!open) setCreateOpen(false) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建教学班（如订单班）</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>班级名称</Label><Input placeholder="请输入班级名称" /></div>
              <div className="space-y-2"><Label>班级编码</Label><Input placeholder="请输入班级编码" /></div>
            </div>
            <div className="space-y-2">
              <Label>班级性质</Label>
              <Input value="教学班（如订单班）" readOnly className="bg-muted" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新建班级成功'); setCreateOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑班级弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑班级 — {selectedClass?.name}</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>班级名称</Label><Input defaultValue={selectedClass.name} /></div>
                <div className="space-y-2"><Label>班级编码</Label><Input defaultValue={selectedClass.code} /></div>
              </div>
              {editType === '行政班' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>所属院系</Label>
                    <Select value={editDept} onValueChange={(v) => { setEditDept(v) }}>
                      <SelectTrigger><SelectValue placeholder="选择院系" /></SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>所属专业</Label>
                    <Select defaultValue={selectedClass.majorId} disabled={!editDept}>
                      <SelectTrigger><SelectValue placeholder={editDept ? '选择专业' : '请先选择院系'} /></SelectTrigger>
                      <SelectContent>
                        {majors.filter((m) => m.departmentId === editDept).map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {editType === '行政班' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>所属年级</Label>
                    <Select defaultValue={selectedClass.gradeId}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {grades.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>班级性质</Label>
                    <Select value={editType} onValueChange={(v) => setEditType(v as '行政班' | '教学班（如订单班）')}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="行政班">行政班</SelectItem>
                        <SelectItem value="教学班（如订单班）">教学班（如订单班）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {editType === '教学班（如订单班）' && (
                <div className="space-y-2">
                  <Label>班级性质</Label>
                  <Select value={editType} onValueChange={(v) => setEditType(v as '行政班' | '教学班（如订单班）')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="行政班">行政班</SelectItem>
                      <SelectItem value="教学班（如订单班）">教学班（如订单班）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('保存成功'); setEditOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 树形组件（院系 → 专业 → 年级）
function DeptNode({ dept, selectedGradeId, onSelectGrade }: { dept: any, selectedGradeId: string | null, onSelectGrade: (id: string | null) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors">
          {open ? <ChevronDown className="h-3.5 w-3.5 mr-1 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 mr-1 shrink-0" />}
          <span className="truncate">{dept.name}</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 space-y-1">
          {dept.majors.map((major: any) => (
            <MajorNode key={major.id} major={major} selectedGradeId={selectedGradeId} onSelectGrade={onSelectGrade} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function MajorNode({ major, selectedGradeId, onSelectGrade }: { major: any, selectedGradeId: string | null, onSelectGrade: (id: string | null) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors">
          {open ? <ChevronDown className="h-3.5 w-3.5 mr-1 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 mr-1 shrink-0" />}
          <span className="truncate">{major.name}</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 space-y-0.5">
          {major.grades.map((grade: any) => (
            <button
              key={grade.id}
              onClick={() => onSelectGrade(grade.id)}
              className={cn(
                'w-full text-left px-2 py-1 text-xs rounded-md transition-colors truncate',
                selectedGradeId === grade.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              {grade.name}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
