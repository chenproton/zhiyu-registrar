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
import { Plus } from 'lucide-react'
import { majors, departments } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function MajorsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ department: 'all', level: 'all' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState<typeof majors[0] | null>(null)
  const [majorList, setMajorList] = useState(majors)

  // create form
  const [cName, setCName] = useState('')
  const [cCode, setCCode] = useState('')
  const [cDept, setCDept] = useState('')
  const [cLevel, setCLevel] = useState('高职高专')
  const [cDuration, setCDuration] = useState('3')
  const [cStatus, setCStatus] = useState('active')

  // edit form
  const [eName, setEName] = useState('')
  const [eCode, setECode] = useState('')
  const [eDept, setEDept] = useState('')
  const [eLevel, setELevel] = useState('高职高专')
  const [eDuration, setEDuration] = useState('3')
  const [eStatus, setEStatus] = useState('active')

  const filtered = useMemo(() => {
    return majorList.filter((m) => {
      if (search) {
        const s = search.toLowerCase()
        if (!m.name.toLowerCase().includes(s) && !m.code.toLowerCase().includes(s)) return false
      }
      if (filters.department !== 'all' && m.departmentId !== filters.department) return false
      if (filters.level !== 'all' && m.level !== filters.level) return false
      return true
    })
  }, [search, filters, majorList])

  const openCreate = () => {
    setCName('')
    setCCode('')
    setCDept(departments[0]?.id || '')
    setCLevel('高职高专')
    setCDuration('3')
    setCStatus('active')
    setCreateOpen(true)
  }

  const handleCreate = () => {
    if (!cName.trim() || !cCode.trim() || !cDept) {
      toast.error('请填写完整信息')
      return
    }
    setMajorList((prev) => [...prev, {
      id: `major-${Date.now()}`,
      name: cName.trim(),
      code: cCode.trim(),
      departmentId: cDept,
      level: cLevel,
      duration: Number(cDuration),
      status: cStatus as 'active' | 'inactive',
    }])
    toast.success('新建专业成功')
    setCreateOpen(false)
  }

  const openEdit = (m: typeof majors[0]) => {
    setSelectedMajor(m)
    setEName(m.name)
    setECode(m.code)
    setEDept(m.departmentId)
    setELevel(m.level)
    setEDuration(String(m.duration))
    setEStatus(m.status)
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedMajor || !eName.trim() || !eCode.trim() || !eDept) {
      toast.error('请填写完整信息')
      return
    }
    setMajorList((prev) => prev.map((m) => m.id === selectedMajor.id ? {
      ...m,
      name: eName.trim(),
      code: eCode.trim(),
      departmentId: eDept,
      level: eLevel,
      duration: Number(eDuration),
      status: eStatus as 'active' | 'inactive',
    } : m))
    toast.success('保存成功')
    setEditOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">专业管理</h1>
          <p className="text-muted-foreground">维护各院系下设专业信息</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />新建专业</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索专业名称或代码..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'department',
                label: '全部院系',
                options: departments.map((d) => ({ value: d.id, label: d.name })),
              },
              {
                key: 'level',
                label: '全部层次',
                options: [
                  { value: '中专', label: '中专' },
                  { value: '高职高专', label: '高职高专' },
                  { value: '本科', label: '本科' },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
            onClearFilters={() => { setSearch(''); setFilters({ department: 'all', level: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>专业名称</TableHead>
                <TableHead>专业代码</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>培养层次</TableHead>
                <TableHead>学制</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m, idx) => (
                <TableRow key={m.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.code}</TableCell>
                  <TableCell>{departments.find((d) => d.id === m.departmentId)?.name}</TableCell>
                  <TableCell>{m.level}</TableCell>
                  <TableCell>{m.duration}年</TableCell>
                  <TableCell>
                    <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                      {m.status === 'active' ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(m)}>编辑</Button>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* 新建专业弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新建专业</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>专业名称</Label><Input placeholder="请输入专业名称" value={cName} onChange={(e) => setCName(e.target.value)} /></div>
              <div className="space-y-2"><Label>专业代码</Label><Input placeholder="请输入专业代码" value={cCode} onChange={(e) => setCCode(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>所属院系</Label>
                <Select value={cDept} onValueChange={setCDept}><SelectTrigger><SelectValue placeholder="选择院系" /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>培养层次</Label>
                <Select value={cLevel} onValueChange={setCLevel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="中专">中专</SelectItem><SelectItem value="高职高专">高职高专</SelectItem><SelectItem value="本科">本科</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>学制（年）</Label><Input type="number" value={cDuration} onChange={(e) => setCDuration(e.target.value)} placeholder="如 3" /></div>
              <div className="space-y-2"><Label>状态</Label>
                <Select value={cStatus} onValueChange={setCStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">启用</SelectItem><SelectItem value="inactive">禁用</SelectItem></SelectContent></Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑专业弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑专业 — {selectedMajor?.name}</DialogTitle></DialogHeader>
          {selectedMajor && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>专业名称</Label><Input value={eName} onChange={(e) => setEName(e.target.value)} /></div>
                <div className="space-y-2"><Label>专业代码</Label><Input value={eCode} onChange={(e) => setECode(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>所属院系</Label>
                  <Select value={eDept} onValueChange={setEDept}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>培养层次</Label>
                  <Select value={eLevel} onValueChange={setELevel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="中专">中专</SelectItem><SelectItem value="高职高专">高职高专</SelectItem><SelectItem value="本科">本科</SelectItem></SelectContent></Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>学制（年）</Label><Input type="number" value={eDuration} onChange={(e) => setEDuration(e.target.value)} /></div>
                <div className="space-y-2"><Label>状态</Label>
                  <Select value={eStatus} onValueChange={setEStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">启用</SelectItem><SelectItem value="inactive">禁用</SelectItem></SelectContent></Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
