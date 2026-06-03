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
import { Plus, Users, GraduationCap, HardHat, Building2, Upload, Download, ShieldCheck } from 'lucide-react'
import { faculty, departments } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function FacultyPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ department: 'all', status: 'all' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<typeof faculty[0] | null>(null)

  const filtered = useMemo(() => {
    return faculty.filter((f) => {
      if (search) {
        const s = search.toLowerCase()
        if (!f.name.toLowerCase().includes(s) && !f.employeeId.toLowerCase().includes(s)) return false
      }
      if (filters.department !== 'all' && f.departmentId !== filters.department) return false
      if (filters.status !== 'all' && f.status !== filters.status) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">师资管理</h1>
          <p className="text-muted-foreground">维护教师档案、授课资格与企业导师信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('导入功能开发中')}>
            <Upload className="h-4 w-4 mr-2" />导入
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('导出功能开发中')}>
            <Download className="h-4 w-4 mr-2" />导出
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('批量授权功能开发中')}>
            <ShieldCheck className="h-4 w-4 mr-2" />批量授权
          </Button>
          <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />新建教师</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">教师总数</p>
              <p className="text-2xl font-bold">{faculty.length}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">企业导师</p>
              <p className="text-2xl font-bold">{faculty.filter((f) => f.isEnterpriseMentor).length}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <HardHat className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">在职教师</p>
              <p className="text-2xl font-bold">{faculty.filter((f) => f.status === '在职').length}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">涉及企业</p>
              <p className="text-2xl font-bold">{new Set(faculty.filter((f) => f.isEnterpriseMentor).map((f) => f.enterpriseInfo?.company).filter(Boolean)).size}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <Building2 className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索教师姓名或工号..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'department',
                label: '全部院系',
                options: departments.map((d) => ({ value: d.id, label: d.name })),
              },
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
            onClearFilters={() => { setSearch(''); setFilters({ department: 'all', status: 'all' }) }}
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
                <TableHead>性别</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>职称</TableHead>
                <TableHead>学历</TableHead>
                <TableHead>企业导师</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.employeeId}</TableCell>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.gender}</TableCell>
                  <TableCell>{departments.find((d) => d.id === f.departmentId)?.name}</TableCell>
                  <TableCell>{f.title}</TableCell>
                  <TableCell>{f.education}</TableCell>
                  <TableCell>
                    {f.isEnterpriseMentor ? (
                      <div className="space-y-0.5">
                        <Badge variant="default" className="text-xs">是</Badge>
                        {f.enterpriseInfo && (
                          <div className="text-[10px] text-muted-foreground">
                            {f.enterpriseInfo.company} · {f.enterpriseInfo.field}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={f.status === '在职' ? 'default' : 'secondary'}>{f.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedFaculty(f); setEditOpen(true) }}>编辑</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
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

      {/* 新建教师弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新建教师</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>工号</Label><Input placeholder="请输入工号" /></div>
              <div className="space-y-2"><Label>姓名</Label><Input placeholder="请输入姓名" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>性别</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择性别" /></SelectTrigger><SelectContent><SelectItem value="男">男</SelectItem><SelectItem value="女">女</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>所属院系</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择院系" /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>职称</Label><Input placeholder="如 副教授" /></div>
              <div className="space-y-2"><Label>学历</Label><Input placeholder="如 博士" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>企业导师</Label>
                <Select><SelectTrigger><SelectValue placeholder="是否企业导师" /></SelectTrigger><SelectContent><SelectItem value="true">是</SelectItem><SelectItem value="false">否</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>状态</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger><SelectContent><SelectItem value="在职">在职</SelectItem><SelectItem value="离职">离职</SelectItem><SelectItem value="外聘">外聘</SelectItem></SelectContent></Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新建教师成功'); setCreateOpen(false) }}>保存</Button>
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
                <div className="space-y-2"><Label>性别</Label>
                  <Select defaultValue={selectedFaculty.gender}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="男">男</SelectItem><SelectItem value="女">女</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>所属院系</Label>
                  <Select defaultValue={selectedFaculty.departmentId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>职称</Label><Input defaultValue={selectedFaculty.title} /></div>
                <div className="space-y-2"><Label>学历</Label><Input defaultValue={selectedFaculty.education} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>企业导师</Label>
                  <Select defaultValue={String(selectedFaculty.isEnterpriseMentor)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="true">是</SelectItem><SelectItem value="false">否</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>状态</Label>
                  <Select defaultValue={selectedFaculty.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="在职">在职</SelectItem><SelectItem value="离职">离职</SelectItem><SelectItem value="外聘">外聘</SelectItem></SelectContent></Select>
                </div>
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
