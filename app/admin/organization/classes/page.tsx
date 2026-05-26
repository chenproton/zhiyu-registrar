'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Plus, Pencil } from 'lucide-react'
import { classes, majors, departments, grades, students } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function ClassesPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    department: 'all',
    major: 'all',
    grade: 'all',
  })
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
      if (filters.grade !== 'all' && c.gradeId !== filters.grade) return false
      return true
    })
  }, [search, filters])

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
    const major = majors.find((m) => m.id === c.majorId)
    setEditDept(major?.departmentId || '')
    setEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">班级管理</h1>
          <p className="text-muted-foreground">维护各专业下设班级信息</p>
        </div>
        <Button onClick={() => { setCreateDept(''); setCreateMajor(''); setCreateOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />新建班级
        </Button>
      </div>

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
              {
                key: 'grade',
                label: '全部年级',
                options: grades.map((g) => ({ value: g.id, label: g.name })),
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => {
              setFilters((p) => {
                const next = { ...p, [key]: value }
                // 切换院系时重置专业筛选
                if (key === 'department') next.major = 'all'
                return next
              })
            }}
            onClearFilters={() => { setSearch(''); setFilters({ department: 'all', major: 'all', grade: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>班级编码</TableHead>
                <TableHead>班级名称</TableHead>
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
                  <TableCell className="font-medium">{c.code}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{getDepartmentName(c.majorId)}</TableCell>
                  <TableCell>{getMajorName(c.majorId)}</TableCell>
                  <TableCell>{getGradeName(c.gradeId)}</TableCell>
                  <TableCell>{students.filter((s) => s.classId === c.id).length}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    暂无符合条件的班级
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新建班级弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建班级</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>班级编码</Label><Input placeholder="请输入班级编码" /></div>
              <div className="space-y-2"><Label>班级名称</Label><Input placeholder="请输入班级名称" /></div>
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
              <Select>
                <SelectTrigger><SelectValue placeholder="选择性质" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="行政班">行政班</SelectItem>
                  <SelectItem value="教学班">教学班</SelectItem>
                </SelectContent>
              </Select>
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
                <div className="space-y-2"><Label>班级编码</Label><Input defaultValue={selectedClass.code} /></div>
                <div className="space-y-2"><Label>班级名称</Label><Input defaultValue={selectedClass.name} /></div>
              </div>
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
                <Select defaultValue={selectedClass.type}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="行政班">行政班</SelectItem>
                    <SelectItem value="教学班">教学班</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
