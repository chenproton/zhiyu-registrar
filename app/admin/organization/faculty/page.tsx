'use client'

import { useState, useMemo, useRef } from 'react'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FilterBar } from '@/components/shared/filter-bar'
import { Plus, Users, GraduationCap, HardHat, Building2, Upload, Download, Trash2, Paperclip, Lock, ChevronRight, ChevronDown, FolderTree, Check, X } from 'lucide-react'
import { faculty, departments, facultyRoles } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const allPositions = ['院长', '副院长', '系主任', '副系主任', '教研室主任', '专业负责人', '教授', '副教授', '讲师', '助教', '实验员', '行政人员', '企业导师', '研究员']
const allTeachingQualifications = ['程序设计', '数据结构', '人工智能', '机器学习', '网络技术', '网络安全', '机械设计', 'CAD/CAM', '会计学', '财务管理', '平面设计', 'UI设计', '前端开发', 'Web设计', '市场营销', '电子商务', '数控技术', '3D打印', '汽车维修', '新能源汽车']

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState([...faculty])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ department: 'all', status: 'all' })
  const [facultyTab, setFacultyTab] = useState<'all' | 'teacher' | 'mentor'>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<typeof faculty[0] | null>(null)
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)

  // 补充协议管理弹窗
  const [agreementOpen, setAgreementOpen] = useState(false)
  const [agreementFaculty, setAgreementFaculty] = useState<typeof faculty[0] | null>(null)
  const [newAgreementName, setNewAgreementName] = useState('')
  const [newAgreementCompany, setNewAgreementCompany] = useState('')
  const [newAgreementStart, setNewAgreementStart] = useState('')
  const [newAgreementEnd, setNewAgreementEnd] = useState('')
  const [agreementFiles, setAgreementFiles] = useState<{ name: string; size: number }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    return facultyList.filter((f) => {
      if (search) {
        const s = search.toLowerCase()
        if (!f.name.toLowerCase().includes(s) && !f.employeeId.toLowerCase().includes(s)) return false
      }
      if (filters.department !== 'all' && f.departmentId !== filters.department) return false
      if (filters.status !== 'all' && f.status !== filters.status) return false
      if (facultyTab === 'teacher' && f.isEnterpriseMentor) return false
      if (facultyTab === 'mentor' && !f.isEnterpriseMentor) return false
      if (selectedDeptId && f.departmentId !== selectedDeptId) return false
      return true
    })
  }, [search, filters, facultyTab, facultyList, selectedDeptId])

  const stats = useMemo(() => {
    const all = facultyList.length
    const mentors = facultyList.filter((f) => f.isEnterpriseMentor).length
    const active = facultyList.filter((f) => f.status === '在职').length
    const companies = new Set(facultyList.filter((f) => f.isEnterpriseMentor).map((f) => f.enterpriseInfo?.company).filter(Boolean)).size
    return { all, mentors, active, companies }
  }, [])

  const handleAddAgreement = () => {
    if (!agreementFaculty) return
    if (!newAgreementName.trim() || !newAgreementCompany.trim() || !newAgreementStart || !newAgreementEnd) {
      toast.error('请填写完整的协议信息')
      return
    }
    toast.success('添加补充协议成功')
    setNewAgreementName('')
    setNewAgreementCompany('')
    setNewAgreementStart('')
    setNewAgreementEnd('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">师资管理</h1>
          <p className="text-muted-foreground">维护教师档案、授课资格与企业导师信息</p>
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

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">教师总数</p>
              <p className="text-2xl font-bold">{stats.all}</p>
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
              <p className="text-2xl font-bold">{stats.mentors}</p>
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
              <p className="text-2xl font-bold">{stats.active}</p>
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
              <p className="text-2xl font-bold">{stats.companies}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <Building2 className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-start">
        {/* 左侧组织架构树 */}
        <Card className="w-64 shrink-0">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
              <FolderTree className="h-4 w-4 text-primary" />组织架构
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
                {departments.map(dept => (
                  <DeptTreeNode
                    key={dept.id}
                    dept={dept}
                    selectedDeptId={selectedDeptId}
                    onSelectDept={setSelectedDeptId}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 右侧内容 */}
        <div className="flex-1 space-y-4">
      <Tabs value={facultyTab} onValueChange={(v) => setFacultyTab(v as 'all' | 'teacher' | 'mentor')}>
        <TabsList>
          <TabsTrigger value="all">全部师资</TabsTrigger>
          <TabsTrigger value="teacher">普通教师</TabsTrigger>
          <TabsTrigger value="mentor">企业导师</TabsTrigger>
        </TabsList>
      </Tabs>

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
                <TableHead>所属院系</TableHead>
                <TableHead>关联角色</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>授课资格</TableHead>
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
                  <TableCell>{departments.find((d) => d.id === f.departmentId)?.name}</TableCell>
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
                    {f.teachingQualifications.length > 0
                      ? `${f.teachingQualifications.slice(0, 2).join('、')}${f.teachingQualifications.length > 2 ? ` 等${f.teachingQualifications.length}项` : ''}`
                      : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    {f.isEnterpriseMentor ? <Badge className="text-[10px]">是</Badge> : <Badge variant="secondary" className="text-[10px]">否</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={f.status === '在职' ? 'default' : 'secondary'}>{f.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedFaculty(f); setEditOpen(true) }}>编辑</Button>
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
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
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
              <div className="space-y-2"><Label>工号</Label><Input placeholder="请输入工号" /></div>
              <div className="space-y-2"><Label>姓名</Label><Input placeholder="请输入姓名" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>密码</Label><Input type="password" placeholder="请输入密码" /></div>
              <div className="space-y-2"><Label>所属院系</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择院系" /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select>
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
              <Label>授课资格（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {allTeachingQualifications.map((qual) => (
                  <label key={qual} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-muted transition-colors">
                    <input type="checkbox" className="h-3.5 w-3.5" />
                    <span className="text-xs">{qual}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border rounded-md bg-muted/30">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4" />
                <span className="text-sm font-medium">企业导师</span>
              </label>
              <div className="flex-1 grid grid-cols-4 gap-2">
                <Input placeholder="企业名称" className="h-8 text-sm" />
                <Input placeholder="职位" className="h-8 text-sm" />
                <Input type="number" placeholder="年限" className="h-8 text-sm" />
                <Input placeholder="领域" className="h-8 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger><SelectContent><SelectItem value="在职">在职</SelectItem><SelectItem value="离职">离职</SelectItem><SelectItem value="外聘">外聘</SelectItem></SelectContent></Select>
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
                <div className="space-y-2"><Label>密码</Label><Input type="password" defaultValue={selectedFaculty.password} /></div>
                <div className="space-y-2"><Label>所属院系</Label>
                  <Select defaultValue={selectedFaculty.departmentId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select>
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
                <Label>授课资格（可多选）</Label>
                <div className="flex flex-wrap gap-2">
                  {allTeachingQualifications.map((qual) => (
                    <label key={qual} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-muted transition-colors">
                      <input type="checkbox" className="h-3.5 w-3.5" defaultChecked={selectedFaculty.teachingQualifications?.includes(qual)} />
                      <span className="text-xs">{qual}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 border rounded-md bg-muted/30">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4" defaultChecked={selectedFaculty.isEnterpriseMentor} />
                  <span className="text-sm font-medium">企业导师</span>
                </label>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <Input placeholder="企业名称" defaultValue={selectedFaculty.enterpriseInfo?.company} className="h-8 text-sm" />
                  <Input placeholder="职位" defaultValue={selectedFaculty.enterpriseInfo?.position} className="h-8 text-sm" />
                  <Input type="number" placeholder="年限" defaultValue={selectedFaculty.enterpriseInfo?.years} className="h-8 text-sm" />
                  <Input placeholder="领域" defaultValue={selectedFaculty.enterpriseInfo?.field} className="h-8 text-sm" />
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

      {/* 补充协议管理弹窗 */}
      <Dialog open={agreementOpen} onOpenChange={setAgreementOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>补充协议管理 — {agreementFaculty?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {agreementFaculty?.agreements && agreementFaculty.agreements.length > 0 ? (
              <div className="space-y-2">
                {agreementFaculty.agreements.map((ag) => (
                  <div key={ag.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">{ag.name}</div>
                      <div className="text-xs text-muted-foreground">{ag.company} · {ag.startDate} 至 {ag.endDate}</div>
                    </div>
                    <Badge variant={ag.status === '有效' ? 'default' : 'secondary'}>{ag.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4 text-sm">暂无补充协议</div>
            )}
            <div className="border-t pt-4 space-y-3">
              <div className="text-sm font-medium">新增协议</div>
              <div className="space-y-2"><Label>协议名称</Label><Input value={newAgreementName} onChange={(e) => setNewAgreementName(e.target.value)} placeholder="请输入协议名称" /></div>
              <div className="space-y-2"><Label>合作企业</Label><Input value={newAgreementCompany} onChange={(e) => setNewAgreementCompany(e.target.value)} placeholder="请输入合作企业" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>开始日期</Label><Input type="date" value={newAgreementStart} onChange={(e) => setNewAgreementStart(e.target.value)} /></div>
                <div className="space-y-2"><Label>结束日期</Label><Input type="date" value={newAgreementEnd} onChange={(e) => setNewAgreementEnd(e.target.value)} /></div>
              </div>

              {/* 附件上传 */}
              <div className="space-y-2">
                <Label>附件</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length === 0) return
                    const newFiles = files.map((f) => ({ name: f.name, size: f.size }))
                    setAgreementFiles((prev) => [...prev, ...newFiles])
                    toast.success(`已添加 ${files.length} 个附件`)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  本地上传附件
                </Button>
                {agreementFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {agreementFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-2.5 py-1.5 rounded-md border text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate" title={file.name}>{file.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => setAgreementFiles((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={handleAddAgreement}>添加协议</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgreementOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DeptTreeNode({
  dept,
  selectedDeptId,
  onSelectDept,
}: {
  dept: { id: string; name: string }
  selectedDeptId: string | null
  onSelectDept: (id: string | null) => void
}) {
  return (
    <button
      onClick={() => onSelectDept(dept.id)}
      className={cn(
        'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5',
        selectedDeptId === dept.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
      )}
    >
      <FolderTree className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{dept.name}</span>
    </button>
  )
}
