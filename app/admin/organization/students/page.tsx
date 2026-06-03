'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Plus, ChevronsUpDown, Check, Users, GraduationCap, BookOpen, UserMinus, UserCheck, Upload, Download, Award, ChevronRight, ChevronDown } from 'lucide-react'
import { students, classes, majors, departments, grades } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const statusColor: Record<string, string> = {
  '在籍': 'default',
  '休学': 'secondary',
  '退学': 'destructive',
  '毕业': 'default',
  '结业': 'secondary',
}

function StudentsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all', major: 'all' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)

  // 从 URL 读取 classId
  useEffect(() => {
    const classIdFromUrl = searchParams.get('classId')
    if (classIdFromUrl) {
      setSelectedClassId(classIdFromUrl)
    }
  }, [searchParams])

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
      if (selectedClassId && s.classId !== selectedClassId) return false
      return true
    })
  }, [search, filters, selectedClassId])

  const stats = useMemo(() => ({
    total: students.length,
    enrolled: students.filter(s => s.status === '在籍').length,
    suspended: students.filter(s => s.status === '休学').length,
    graduated: students.filter(s => s.status === '毕业').length,
    dropped: students.filter(s => s.status === '退学').length,
  }), [])

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

  // 组织架构树数据
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
            grades: gradeIds.map(gid => {
              const grade = grades.find(g => g.id === gid)!
              return {
                ...grade,
                classes: majorClasses.filter(c => c.gradeId === gid)
              }
            })
          }
        })
      }
    })
  }, [])

  const handleImport = () => toast.success('导入功能开发中')
  const handleExport = () => toast.success('导出功能开发中')
  const handleBatchGraduate = () => toast.success('批量毕业功能开发中')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学生管理</h1>
          <p className="text-muted-foreground">管理学生基础信息与学籍数据</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />导入
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />导出
          </Button>
          <Button variant="outline" size="sm" onClick={handleBatchGraduate}>
            <Award className="h-4 w-4 mr-2" />批量毕业
          </Button>
          <Button onClick={() => { setCreateClassId(''); setCreateOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />新生录入
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
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
              <p className="text-sm text-muted-foreground">在籍人数</p>
              <p className="text-2xl font-bold">{stats.enrolled}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">休学人数</p>
              <p className="text-2xl font-bold">{stats.suspended}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">毕业人数</p>
              <p className="text-2xl font-bold">{stats.graduated}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">退学人数</p>
              <p className="text-2xl font-bold">{stats.dropped}</p>
            </div>
            <div className="rounded-full p-2 bg-red-500">
              <UserMinus className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-start">
        {/* 左侧组织架构树 */}
        <Card className="w-64 shrink-0">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">组织架构</h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedClassId(null); router.push('/admin/organization/students') }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors',
                    selectedClassId === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  全部学生
                </button>
                {treeData.map(dept => (
                  <DeptNode
                    key={dept.id}
                    dept={dept}
                    selectedClassId={selectedClassId}
                    onSelectClass={(id) => { setSelectedClassId(id); if (!id) router.push('/admin/organization/students') }}
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
                searchPlaceholder="搜索学生姓名或学号..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                  {
                    key: 'status',
                    label: '全部状态',
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
                    <TableHead>状态</TableHead>
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
                          <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>编辑</Button>
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
        </div>
      </div>

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
              <div className="space-y-2"><Label>状态</Label>
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
                <div className="space-y-2"><Label>状态</Label>
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
    </div>
  )
}

export default function StudentsPage() {
  return (
    <Suspense fallback={null}>
      <StudentsPageContent />
    </Suspense>
  )
}

// 树形组件
function DeptNode({ dept, selectedClassId, onSelectClass }: { dept: any, selectedClassId: string | null, onSelectClass: (id: string | null) => void }) {
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
            <MajorNode key={major.id} major={major} selectedClassId={selectedClassId} onSelectClass={onSelectClass} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function MajorNode({ major, selectedClassId, onSelectClass }: { major: any, selectedClassId: string | null, onSelectClass: (id: string | null) => void }) {
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
        <div className="ml-4 space-y-1">
          {major.grades.map((grade: any) => (
            <GradeNode key={grade.id} grade={grade} selectedClassId={selectedClassId} onSelectClass={onSelectClass} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function GradeNode({ grade, selectedClassId, onSelectClass }: { grade: any, selectedClassId: string | null, onSelectClass: (id: string | null) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors">
          {open ? <ChevronDown className="h-3.5 w-3.5 mr-1 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 mr-1 shrink-0" />}
          <span className="truncate">{grade.name}</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 space-y-0.5">
          {grade.classes.map((cls: any) => (
            <button
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={cn(
                'w-full text-left px-2 py-1 text-xs rounded-md transition-colors truncate',
                selectedClassId === cls.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
