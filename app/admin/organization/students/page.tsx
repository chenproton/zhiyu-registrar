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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FilterBar } from '@/components/shared/filter-bar'
import { Plus, Pencil, ChevronsUpDown, Check } from 'lucide-react'
import { students, classes, majors, departments, statusChanges } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusColor: Record<string, string> = {
  '在籍': 'default',
  '休学': 'secondary',
  '退学': 'destructive',
  '毕业': 'default',
  '结业': 'secondary',
}

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState('info')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all', major: 'all' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)

  // 学籍异动弹窗
  const [changeOpen, setChangeOpen] = useState(false)
  const [changeStudentOpen, setChangeStudentOpen] = useState(false)
  const [changeStudentId, setChangeStudentId] = useState('')

  // 班级 Combobox
  const [createClassOpen, setCreateClassOpen] = useState(false)
  const [editClassOpen, setEditClassOpen] = useState(false)
  const [createClassId, setCreateClassId] = useState('')
  const [editClassId, setEditClassId] = useState('')

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const term = search.toLowerCase()
        if (!s.name.toLowerCase().includes(term) && !s.studentId.toLowerCase().includes(term)) return false
      }
      if (filters.status !== 'all' && s.status !== filters.status) return false
      if (filters.major !== 'all' && s.majorId !== filters.major) return false
      return true
    })
  }, [search, filters])

  const getClassInfo = (classId: string) => {
    const cls = classes.find((c) => c.id === classId)
    const major = cls ? majors.find((m) => m.id === cls.majorId) : null
    const dept = major ? departments.find((d) => d.id === major.departmentId) : null
    return { cls, major, dept }
  }

  const createClassInfo = getClassInfo(createClassId)
  const editClassInfo = getClassInfo(editClassId || selectedStudent?.classId || '')

  const openEdit = (s: typeof students[0]) => {
    setSelectedStudent(s)
    setEditClassId(s.classId)
    setEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学生学籍管理</h1>
          <p className="text-muted-foreground">管理学生基础信息、学历与学籍异动</p>
        </div>
        {activeTab === 'info' ? (
          <Button onClick={() => { setCreateClassId(''); setCreateOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />新生录入
          </Button>
        ) : (
          <Button onClick={() => setChangeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />学籍异动
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">学生信息管理</TabsTrigger>
          <TabsTrigger value="changes">学籍异动管理</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <FilterBar
                searchPlaceholder="搜索学生姓名或学号..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                  {
                    key: 'status',
                    label: '全部学籍状态',
                    options: [
                      { value: '在籍', label: '在籍' },
                      { value: '休学', label: '休学' },
                      { value: '退学', label: '退学' },
                      { value: '毕业', label: '毕业' },
                      { value: '结业', label: '结业' },
                    ],
                  },
                  {
                    key: 'major',
                    label: '全部专业',
                    options: majors.map((m) => ({ value: m.id, label: m.name })),
                  },
                ]}
                filterValues={filters}
                onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
                onClearFilters={() => { setSearch(''); setFilters({ status: 'all', major: 'all' }) }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>学号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>所属院系</TableHead>
                    <TableHead>专业</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>学历层次</TableHead>
                    <TableHead>学位</TableHead>
                    <TableHead>学籍状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => {
                    const info = getClassInfo(s.classId)
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.studentId}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.gender}</TableCell>
                        <TableCell>{info.dept?.name || '—'}</TableCell>
                        <TableCell>{info.major?.name || '—'}</TableCell>
                        <TableCell>{info.cls?.name || '—'}</TableCell>
                        <TableCell>{s.educationLevel}</TableCell>
                        <TableCell>{s.degreeType || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={statusColor[s.status] as any}>{s.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredStudents.length === 0 && (
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
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>异动类型</TableHead>
                    <TableHead>学生学号</TableHead>
                    <TableHead>学生姓名</TableHead>
                    <TableHead>原状态/值</TableHead>
                    <TableHead>新状态/值</TableHead>
                    <TableHead>异动日期</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>审批人</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusChanges.map((sc) => {
                    const stu = students.find((s) => s.id === sc.studentId)
                    return (
                      <TableRow key={sc.id}>
                        <TableCell><Badge>{sc.type}</Badge></TableCell>
                        <TableCell>{stu?.studentId}</TableCell>
                        <TableCell>{stu?.name}</TableCell>
                        <TableCell>{sc.fromValue || '—'}</TableCell>
                        <TableCell>{sc.toValue || '—'}</TableCell>
                        <TableCell>{sc.date}</TableCell>
                        <TableCell>{sc.reason}</TableCell>
                        <TableCell>{sc.approver}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新生录入弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新生录入</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>学号</Label><Input placeholder="请输入学号" /></div>
              <div className="space-y-2"><Label>姓名</Label><Input placeholder="请输入姓名" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>性别</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择性别" /></SelectTrigger><SelectContent><SelectItem value="男">男</SelectItem><SelectItem value="女">女</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>学籍状态</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger><SelectContent><SelectItem value="在籍">在籍</SelectItem><SelectItem value="休学">休学</SelectItem><SelectItem value="退学">退学</SelectItem><SelectItem value="毕业">毕业</SelectItem><SelectItem value="结业">结业</SelectItem></SelectContent></Select>
              </div>
            </div>
            {/* 班级选择 - 可搜索 */}
            <div className="space-y-2">
              <Label>所属班级</Label>
              <Popover open={createClassOpen} onOpenChange={setCreateClassOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={createClassOpen} className="w-full justify-between font-normal">
                    {createClassInfo.cls ? `${createClassInfo.cls.name} (${createClassInfo.major?.name})` : '搜索并选择班级...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-0">
                  <Command>
                    <CommandInput placeholder="搜索班级名称或编码..." />
                    <CommandList>
                      <CommandEmpty>未找到班级</CommandEmpty>
                      <CommandGroup>
                        {classes.map((c) => {
                          const m = majors.find((mj) => mj.id === c.majorId)
                          return (
                            <CommandItem
                              key={c.id}
                              value={`${c.name} ${c.code} ${m?.name || ''}`}
                              onSelect={() => {
                                setCreateClassId(c.id)
                                setCreateClassOpen(false)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', createClassId === c.id ? 'opacity-100' : 'opacity-0')} />
                              <div className="flex flex-col">
                                <span>{c.name}</span>
                                <span className="text-xs text-muted-foreground">{m?.name} · {c.code}</span>
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* 院系和专业只读显示 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>所属院系</Label>
                <Input value={createClassInfo.dept?.name || '—'} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>所属专业</Label>
                <Input value={createClassInfo.major?.name || '—'} readOnly className="bg-muted" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>学历层次</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择学历" /></SelectTrigger><SelectContent><SelectItem value="中专">中专</SelectItem><SelectItem value="大专">大专</SelectItem><SelectItem value="本科">本科</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>学位</Label>
                <Select><SelectTrigger><SelectValue placeholder="选择学位" /></SelectTrigger><SelectContent><SelectItem value="学士">学士</SelectItem><SelectItem value="无">无</SelectItem></SelectContent></Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新生录入成功'); setCreateOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑学生弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑学生 — {selectedStudent?.name}</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>学号</Label><Input defaultValue={selectedStudent.studentId} /></div>
                <div className="space-y-2"><Label>姓名</Label><Input defaultValue={selectedStudent.name} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>性别</Label>
                  <Select defaultValue={selectedStudent.gender}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="男">男</SelectItem><SelectItem value="女">女</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>学籍状态</Label>
                  <Select defaultValue={selectedStudent.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="在籍">在籍</SelectItem><SelectItem value="休学">休学</SelectItem><SelectItem value="退学">退学</SelectItem><SelectItem value="毕业">毕业</SelectItem><SelectItem value="结业">结业</SelectItem></SelectContent></Select>
                </div>
              </div>
              {/* 班级选择 - 可搜索 */}
              <div className="space-y-2">
                <Label>所属班级</Label>
                <Popover open={editClassOpen} onOpenChange={setEditClassOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={editClassOpen} className="w-full justify-between font-normal">
                      {editClassInfo.cls ? `${editClassInfo.cls.name} (${editClassInfo.major?.name})` : '搜索并选择班级...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] p-0">
                    <Command>
                      <CommandInput placeholder="搜索班级名称或编码..." />
                      <CommandList>
                        <CommandEmpty>未找到班级</CommandEmpty>
                        <CommandGroup>
                          {classes.map((c) => {
                            const m = majors.find((mj) => mj.id === c.majorId)
                            return (
                              <CommandItem
                                key={c.id}
                                value={`${c.name} ${c.code} ${m?.name || ''}`}
                                onSelect={() => {
                                  setEditClassId(c.id)
                                  setEditClassOpen(false)
                                }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', editClassId === c.id ? 'opacity-100' : 'opacity-0')} />
                                <div className="flex flex-col">
                                  <span>{c.name}</span>
                                  <span className="text-xs text-muted-foreground">{m?.name} · {c.code}</span>
                                </div>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {/* 院系和专业只读显示 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>所属院系</Label>
                  <Input value={editClassInfo.dept?.name || '—'} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>所属专业</Label>
                  <Input value={editClassInfo.major?.name || '—'} readOnly className="bg-muted" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>学历层次</Label>
                  <Select defaultValue={selectedStudent.educationLevel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="中专">中专</SelectItem><SelectItem value="大专">大专</SelectItem><SelectItem value="本科">本科</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>学位</Label>
                  <Select defaultValue={selectedStudent.degreeType || '无'}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="学士">学士</SelectItem><SelectItem value="无">无</SelectItem></SelectContent></Select>
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

      {/* 学籍异动录入弹窗 */}
      <Dialog open={changeOpen} onOpenChange={setChangeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>学籍异动录入</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>学生</Label>
              <Popover open={changeStudentOpen} onOpenChange={setChangeStudentOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={changeStudentOpen} className="w-full justify-between font-normal">
                    {changeStudentId ? (() => {
                      const s = students.find((st) => st.id === changeStudentId)
                      return s ? `${s.studentId} · ${s.name}` : '搜索并选择学生...'
                    })() : '搜索并选择学生...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-0">
                  <Command>
                    <CommandInput placeholder="搜索学号或姓名..." />
                    <CommandList>
                      <CommandEmpty>未找到学生</CommandEmpty>
                      <CommandGroup>
                        {students.map((s) => (
                          <CommandItem
                            key={s.id}
                            value={`${s.studentId} ${s.name}`}
                            onSelect={() => {
                              setChangeStudentId(s.id)
                              setChangeStudentOpen(false)
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', changeStudentId === s.id ? 'opacity-100' : 'opacity-0')} />
                            <div className="flex flex-col">
                              <span>{s.name}</span>
                              <span className="text-xs text-muted-foreground">{s.studentId} · {majors.find((m) => m.id === s.majorId)?.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>异动类型</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="转专业">转专业</SelectItem>
                    <SelectItem value="休学">休学</SelectItem>
                    <SelectItem value="复学">复学</SelectItem>
                    <SelectItem value="退学">退学</SelectItem>
                    <SelectItem value="留级">留级</SelectItem>
                    <SelectItem value="毕业">毕业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>异动日期</Label><Input type="date" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>原状态/值</Label><Input placeholder="如：在籍" /></div>
              <div className="space-y-2"><Label>新状态/值</Label><Input placeholder="如：休学" /></div>
            </div>
            <div className="space-y-2"><Label>原因</Label><Input placeholder="请输入异动原因" /></div>
            <div className="space-y-2"><Label>审批人</Label><Input placeholder="如：教务处" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('学籍异动录入成功'); setChangeOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
