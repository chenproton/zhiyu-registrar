'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
import { departments as initialDepartments, majors, classes, students, faculty } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function DepartmentsPage() {
  const [deptData, setDeptData] = useState(() => [...initialDepartments])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<typeof deptData[0] | null>(null)

  // 新建表单状态
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active')

  // 编辑表单状态
  const [editCode, setEditCode] = useState('')
  const [editName, setEditName] = useState('')
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active')

  const filtered = useMemo(() => {
    return deptData.filter((d) => {
      if (search) {
        const s = search.toLowerCase()
        if (!d.name.toLowerCase().includes(s) && !d.code.toLowerCase().includes(s)) return false
      }
      if (filters.status !== 'all' && d.status !== filters.status) return false
      return true
    })
  }, [search, filters, deptData])

  const getStats = (deptId: string) => {
    const majorCount = majors.filter((m) => m.departmentId === deptId).length
    const majorIds = majors.filter((m) => m.departmentId === deptId).map((m) => m.id)
    const classCount = classes.filter((c) => majorIds.includes(c.majorId)).length
    const studentCount = students.filter((s) => s.departmentId === deptId).length
    const facultyCount = faculty.filter((f) => f.departmentId === deptId).length
    return { majorCount, classCount, studentCount, facultyCount }
  }

  const toggleStatus = (id: string) => {
    setDeptData((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'active' ? 'inactive' : 'active'
          toast.success(nextStatus === 'active' ? '已启用该院系' : '已禁用该院系')
          return { ...d, status: nextStatus }
        }
        return d
      })
    )
  }

  const handleCreate = () => {
    if (!newCode.trim() || !newName.trim()) {
      toast.error('请填写完整的院系信息')
      return
    }
    const newDept = {
      id: `d${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      type: '教学院系',
      leader: '',
      status: newStatus,
    }
    setDeptData((prev) => [...prev, newDept])
    toast.success('新建院系成功')
    setNewCode('')
    setNewName('')
    setNewStatus('active')
    setCreateOpen(false)
  }

  const openEdit = (d: typeof deptData[0]) => {
    setSelectedDept(d)
    setEditCode(d.code)
    setEditName(d.name)
    setEditStatus(d.status)
    setEditOpen(true)
  }

  const handleEdit = () => {
    if (!selectedDept) return
    if (!editCode.trim() || !editName.trim()) {
      toast.error('请填写完整的院系信息')
      return
    }
    setDeptData((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id
          ? { ...d, code: editCode.trim(), name: editName.trim(), status: editStatus }
          : d
      )
    )
    toast.success('保存成功')
    setEditOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">院系管理</h1>
          <p className="text-muted-foreground">维护学校组织架构中的院系信息</p>
        </div>
        <Button onClick={() => { setNewCode(''); setNewName(''); setNewStatus('active'); setCreateOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />新建院系
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索院系名称或编码..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'status',
                label: '全部状态',
                options: [
                  { value: 'active', label: '启用' },
                  { value: 'inactive', label: '禁用' },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
            onClearFilters={() => { setSearch(''); setFilters({ status: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>院系编码</TableHead>
                <TableHead>院系名称</TableHead>
                <TableHead>专业数量</TableHead>
                <TableHead>班级数</TableHead>
                <TableHead>学生数</TableHead>
                <TableHead>教师数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => {
                const stats = getStats(d.id)
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.code}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{stats.majorCount}</TableCell>
                    <TableCell>{stats.classCount}</TableCell>
                    <TableCell>{stats.studentCount}</TableCell>
                    <TableCell>{stats.facultyCount}</TableCell>
                    <TableCell>
                      <Badge variant={d.status === 'active' ? 'default' : 'secondary'}>
                        {d.status === 'active' ? '启用' : '禁用'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus(d.id)}>
                          {d.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新建院系弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新建院系</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>院系编码</Label><Input placeholder="请输入院系编码" value={newCode} onChange={(e) => setNewCode(e.target.value)} /></div>
              <div className="space-y-2"><Label>院系名称</Label><Input placeholder="请输入院系名称" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as 'active' | 'inactive')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="inactive">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑院系弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑院系 — {selectedDept?.name}</DialogTitle></DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>院系编码</Label><Input value={editCode} onChange={(e) => setEditCode(e.target.value)} /></div>
                <div className="space-y-2"><Label>院系名称</Label><Input value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select value={editStatus} onValueChange={(v) => setEditStatus(v as 'active' | 'inactive')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
