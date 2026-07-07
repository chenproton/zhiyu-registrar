'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FilterBar } from '@/components/shared/filter-bar'
import { Plus, Upload, Download, Lock, FolderTree, ChevronRight, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { faculty, facultyRoles, departments, majors } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const allPositions = ['院长', '副院长', '系主任', '副系主任', '教研室主任', '专业负责人', '教授', '副教授', '讲师', '助教', '实验员', '行政人员', '企业导师', '研究员']

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState([...faculty])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<typeof faculty[0] | null>(null)
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
  const [deptPopoverOpen, setDeptPopoverOpen] = useState(false)
  const [editDeptPopoverOpen, setEditDeptPopoverOpen] = useState(false)
  const [formDepartmentId, setFormDepartmentId] = useState('')
  const [editDepartmentId, setEditDepartmentId] = useState('')
  const [formEmployeeId, setFormEmployeeId] = useState('')
  const [formName, setFormName] = useState('')
  const [formPassword, setFormPassword] = useState('')

  const deptTree = useMemo(() => departments.map(d => ({
    ...d,
    majors: majors.filter(m => m.departmentId === d.id)
  })), [])

  const filtered = useMemo(() => {
    return facultyList.filter((f) => {
      if (search) {
        const s = search.toLowerCase()
        if (!f.name.toLowerCase().includes(s) && !f.employeeId.toLowerCase().includes(s)) return false
      }
      if (filters.status !== 'all' && f.status !== filters.status) return false
      if (selectedDeptId && f.departmentId !== selectedDeptId) return false
      return true
    })
  }, [search, filters, facultyList, selectedDeptId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">师资管理</h1>
          <p className="text-muted-foreground">维护教师档案与角色职位信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('导入功能使用现有组件样式即可')}>
            <Upload className="h-4 w-4 mr-2" />导入
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('导出功能使用现有组件样式即可')}>
            <Download className="h-4 w-4 mr-2" />导出
          </Button>

          <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />新建教师</Button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <Card className="w-64 shrink-0">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
              <FolderTree className="h-4 w-4" />组织架构
            </h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedDeptId(null)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors',
                    selectedDeptId === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  全部教职工
                </button>
                {departments.map((dept) => (
                  <DeptTreeNode
                    key={dept.id}
                    deptId={dept.id}
                    deptName={dept.name}
                    selected={selectedDeptId === dept.id}
                    onSelect={setSelectedDeptId}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <FilterBar
                searchPlaceholder="搜索教师姓名或工号..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                  {
                    key: 'status',
                    label: '全部状态',
                    options: [
                      { value: '在职', label: '在职' },
                      { value: '离职', label: '离职' },
                      { value: '外聘', label: '外聘' },
                    ],
                  },
                ]}
                filterValues={filters}
                onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
                onClearFilters={() => { setSearch(''); setFilters({ status: 'all' }); setSelectedDeptId(null) }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>工号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>所属部门</TableHead>
                    <TableHead>关联角色</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.employeeId}</TableCell>
                      <TableCell>{f.name}</TableCell>
                      <TableCell>{departments.find((d) => d.id === f.departmentId)?.name || '—'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {f.roles?.map((r) => (
                            <Badge key={r} variant="outline" className="text-[10px]">{r}</Badge>
                          )) || <span className="text-muted-foreground text-xs">—</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {f.positions && f.positions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {f.positions.map((p, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">{p}</Badge>
                            ))}
                          </div>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={f.status === '在职' ? 'default' : 'secondary'}>{f.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedFaculty(f); setEditDepartmentId(f.departmentId); setEditOpen(true) }}>编辑</Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setFacultyList((prev) => prev.map((item) => item.id === f.id ? { ...item, password: '123456' } : item))
                            toast.success(`已重置 ${f.name} 的密码`)
                          }}>
                            <Lock className="h-3.5 w-3.5 mr-1" />重置密码
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 新建教师弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新建教师</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>工号 <span className="text-destructive">*</span></Label><Input value={formEmployeeId} onChange={(e) => setFormEmployeeId(e.target.value)} placeholder="请输入工号" required /></div>
              <div className="space-y-2"><Label>姓名 <span className="text-destructive">*</span></Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="请输入姓名" required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>密码</Label><Input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="请输入密码" /></div>
              <div className="space-y-2">
                <Label>所属部门 <span className="text-destructive">*</span></Label>
                <Popover open={deptPopoverOpen} onOpenChange={setDeptPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                      {formDepartmentId ? (departments.find(d=>d.id===formDepartmentId)?.name || '—') : '选择组织节点...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px] p-2">
                    <ScrollArea className="h-64">
                      <button
                        onClick={() => { setFormDepartmentId(''); setDeptPopoverOpen(false) }}
                        className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted mb-1"
                      >
                        清空选择
                      </button>
                      {deptTree.map(dept => (
                        <DeptTreeItem
                          key={dept.id}
                          dept={dept}
                          selectedId={formDepartmentId}
                          onSelect={(id) => { setFormDepartmentId(id); setDeptPopoverOpen(false) }}
                        />
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label>关联角色（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {facultyRoles.map((role) => (
                  <label key={role} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" className="h-3.5 w-3.5" />
                    <span className="text-xs">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>职位（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {allPositions.map((pos) => (
                  <label key={pos} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" className="h-3.5 w-3.5" />
                    <span className="text-xs">{pos}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger><SelectContent><SelectItem value="在职">在职</SelectItem><SelectItem value="离职">离职</SelectItem><SelectItem value="外聘">外聘</SelectItem></SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => {
              if (!formEmployeeId.trim()) { toast.error('请输入工号'); return }
              if (!formName.trim()) { toast.error('请输入姓名'); return }
              if (!formDepartmentId) { toast.error('请选择所属部门'); return }
              setFacultyList((prev) => [...prev, {
                id: `f${Date.now()}`,
                employeeId: formEmployeeId.trim(),
                name: formName.trim(),
                password: formPassword || '123456',
                departmentId: formDepartmentId,
                roles: [],
                positions: [],
                status: '在职',
              }])
              toast.success('新建教师成功')
              setFormEmployeeId('')
              setFormName('')
              setFormPassword('')
              setFormDepartmentId('')
              setCreateOpen(false)
            }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑教师弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑教师 — {selectedFaculty?.name}</DialogTitle></DialogHeader>
          {selectedFaculty && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>工号</Label><Input defaultValue={selectedFaculty.employeeId} /></div>
                <div className="space-y-2"><Label>姓名</Label><Input defaultValue={selectedFaculty.name} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>密码</Label><Input type="password" defaultValue={selectedFaculty.password} /></div>
              <div className="space-y-2">
                <Label>所属部门</Label>
                <Popover open={editDeptPopoverOpen} onOpenChange={setEditDeptPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                      {editDepartmentId ? (departments.find(d=>d.id===editDepartmentId)?.name || '—') : '选择组织节点...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px] p-2">
                    <ScrollArea className="h-64">
                      <button
                        onClick={() => { setEditDepartmentId(''); setEditDeptPopoverOpen(false) }}
                        className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted mb-1"
                      >
                        清空选择
                      </button>
                      {deptTree.map(dept => (
                        <DeptTreeItem
                          key={dept.id}
                          dept={dept}
                          selectedId={editDepartmentId}
                          onSelect={(id) => { setEditDepartmentId(id); setEditDeptPopoverOpen(false) }}
                        />
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
              <div className="space-y-2">
                <Label>关联角色（可多选）</Label>
                <div className="flex flex-wrap gap-2">
                  {facultyRoles.map((role) => (
                    <label key={role} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-muted transition-colors">
                      <input type="checkbox" className="h-3.5 w-3.5" defaultChecked={selectedFaculty.roles?.includes(role)} />
                      <span className="text-xs">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>职位（可多选）</Label>
                <div className="flex flex-wrap gap-2">
                  {allPositions.map((pos) => (
                    <label key={pos} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-muted transition-colors">
                      <input type="checkbox" className="h-3.5 w-3.5" defaultChecked={selectedFaculty.positions?.includes(pos)} />
                      <span className="text-xs">{pos}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select defaultValue={selectedFaculty.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="在职">在职</SelectItem><SelectItem value="离职">离职</SelectItem><SelectItem value="外聘">外聘</SelectItem></SelectContent></Select>
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

function DeptTreeNode({ deptId, deptName, selected, onSelect }: { deptId: string; deptName: string; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(deptId)}
      className={cn(
        'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors',
        selected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      )}
    >
      {deptName}
    </button>
  )
}

function DeptTreeItem({ dept, selectedId, onSelect }: { dept: { id: string; name: string; majors: { id: string; name: string }[] }; selectedId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const isSelected = selectedId === dept.id
  return (
    <div>
      <div className="flex items-center">
        {dept.majors.length > 0 && (
          <button onClick={() => setOpen(!open)} className="p-0.5 hover:bg-muted rounded">
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        )}
        <button
          onClick={() => onSelect(dept.id)}
          className={cn(
            'flex-1 text-left px-2 py-1.5 text-sm rounded-md transition-colors',
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          )}
        >
          <FolderTree className="h-3.5 w-3.5 inline mr-1.5" />
          {dept.name}
        </button>
      </div>
      {open && dept.majors.length > 0 && (
        <div className="ml-5 border-l border-border pl-3 space-y-0.5">
          {dept.majors.map(major => (
            <button
              key={major.id}
              onClick={() => onSelect(dept.id)}
              className={cn(
                'w-full text-left px-2 py-1 text-xs rounded-md transition-colors text-muted-foreground',
                selectedId === dept.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {major.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
