'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Upload, Users, BookOpen, GraduationCap, X, FileSpreadsheet, Beaker } from 'lucide-react'
import { courseAssignments as initialAssignments, coursePool, classes, faculty } from '@/lib/mock-data'
import type { CourseAssignment } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CourseAssignmentsPage() {
  const [assignments, setAssignments] = useState<CourseAssignment[]>(initialAssignments)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<CourseAssignment | null>(null)
  const [filterClass, setFilterClass] = useState<string>('all')

  // Create form state
  const [createForm, setCreateForm] = useState<Partial<CourseAssignment>>({
    classId: '',
    courseName: '',
    courseCode: '',
    facultyId: '',
    hoursPerWeek: 4,
    weekPattern: 'all',
    isSplit: false,
  })

  // Import state
  const [importText, setImportText] = useState('')
  const [importPreview, setImportPreview] = useState<CourseAssignment[]>([])

  const filtered = assignments.filter((ca) => {
    if (filterClass !== 'all' && ca.classId !== filterClass) return false
    return true
  })

  const handleEdit = (assignment: CourseAssignment) => {
    setSelectedAssignment(assignment)
    setEditDialogOpen(true)
  }

  const handleCreate = () => {
    if (!createForm.classId || !createForm.courseName || !createForm.facultyId) {
      toast.error('请填写完整信息')
      return
    }
    const newAssignment: CourseAssignment = {
      id: `ca-${Date.now()}`,
      classId: createForm.classId!,
      courseName: createForm.courseName!,
      courseCode: createForm.courseCode || '',
      facultyId: createForm.facultyId!,
      hoursPerWeek: createForm.hoursPerWeek || 4,
      weekPattern: (createForm.weekPattern as 'all' | 'odd' | 'even') || 'all',
      isSplit: createForm.isSplit || false,
    }
    setAssignments((prev) => [...prev, newAssignment])
    setCreateDialogOpen(false)
    setCreateForm({ classId: '', courseName: '', courseCode: '', facultyId: '', hoursPerWeek: 4, weekPattern: 'all', isSplit: false })
    toast.success('任课关系创建成功')
  }

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    toast.success('任课关系已删除')
  }

  const handleParseImport = () => {
    if (!importText.trim()) {
      toast.error('请输入导入数据')
      return
    }
    // Simulate parsing CSV-like text: 班级,课程,教师,周课时,周次模式
    const lines = importText.trim().split('\n').filter((l) => l.trim())
    const parsed: CourseAssignment[] = []
    lines.forEach((line, i) => {
      const parts = line.split(/[,，\t]/).map((s) => s.trim())
      if (parts.length >= 3) {
        const cls = classes.find((c) => c.name === parts[0])
        const fac = faculty.find((f) => f.name === parts[2])
        const course = coursePool.find((c) => c.name === parts[1])
        parsed.push({
          id: `import-${Date.now()}-${i}`,
          classId: cls?.id || parts[0],
          courseName: parts[1],
          courseCode: course?.code || '',
          facultyId: fac?.id || parts[2],
          hoursPerWeek: Number(parts[3]) || 4,
          weekPattern: (parts[4] === '单周' ? 'odd' : parts[4] === '双周' ? 'even' : 'all') as 'all' | 'odd' | 'even',
          isSplit: false,
        })
      }
    })
    setImportPreview(parsed)
    toast.success(`解析成功，共 ${parsed.length} 条记录`)
  }

  const handleConfirmImport = () => {
    if (importPreview.length === 0) {
      toast.error('请先解析数据')
      return
    }
    setAssignments((prev) => [...prev, ...importPreview])
    setImportDialogOpen(false)
    setImportText('')
    setImportPreview([])
    toast.success(`成功导入 ${importPreview.length} 条任课关系`)
  }

  const getCourseType = (courseName: string) => {
    const course = coursePool.find((c) => c.name === courseName)
    return course?.type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任课关系管理</h1>
          <p className="text-muted-foreground">管理班级-课程-教师的任课绑定关系，支持分层教学配置</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            批量导入
          </Button>
          <Button className="gap-1" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            新增任课
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">任课记录</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">涉及班级</p>
              <p className="text-2xl font-bold">{new Set(assignments.map((c) => c.classId)).size}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">任课教师</p>
              <p className="text-2xl font-bold">{new Set(assignments.map((c) => c.facultyId)).size}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">场景课程</p>
              <p className="text-2xl font-bold">{assignments.filter((a) => getCourseType(a.courseName) === '场景').length}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Beaker className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="筛选班级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部班级</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>班级</TableHead>
                <TableHead>课程</TableHead>
                <TableHead>课程编码</TableHead>
                <TableHead>主讲教师</TableHead>
                <TableHead>周课时</TableHead>
                <TableHead>周次模式</TableHead>
                <TableHead>分层教学</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ca) => {
                const cls = classes.find((c) => c.id === ca.classId)
                const fac = faculty.find((f) => f.id === ca.facultyId)
                const courseType = getCourseType(ca.courseName)
                return (
                  <TableRow key={ca.id} className={courseType === '场景' ? 'bg-purple-50/30' : undefined}>
                    <TableCell className="font-medium">{cls?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {courseType === '场景' && <Beaker className="h-3.5 w-3.5 text-purple-600" />}
                        {ca.courseName}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{ca.courseCode}</TableCell>
                    <TableCell>{fac?.name} ({fac?.title})</TableCell>
                    <TableCell>{ca.hoursPerWeek}节</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {ca.weekPattern === 'all' ? '每周' : ca.weekPattern === 'odd' ? '单周' : '双周'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ca.isSplit ? (
                        <Badge variant="secondary" className="text-xs">{ca.splitClasses?.length}个分层班</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => handleEdit(ca)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          编辑
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(ca.id)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无任课记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增任课弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增任课关系</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>班级</Label>
                <Select value={createForm.classId} onValueChange={(v) => setCreateForm((prev) => ({ ...prev, classId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择班级" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>课程</Label>
                <Select
                  value={createForm.courseName}
                  onValueChange={(v) => {
                    const course = coursePool.find((c) => c.name === v)
                    setCreateForm((prev) => ({ ...prev, courseName: v, courseCode: course?.code || '', hoursPerWeek: course?.defaultHours || 4 }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择课程" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursePool.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        <div className="flex items-center gap-2">
                          {c.type === '场景' && <Beaker className="h-3 w-3 text-purple-600" />}
                          {c.name}
                          <span className="text-muted-foreground text-xs">({c.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>主讲教师</Label>
                <Select value={createForm.facultyId} onValueChange={(v) => setCreateForm((prev) => ({ ...prev, facultyId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择教师" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name} ({f.title})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>周课时</Label>
                <Input type="number" value={createForm.hoursPerWeek} onChange={(e) => setCreateForm((prev) => ({ ...prev, hoursPerWeek: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>周次模式</Label>
                <Select value={createForm.weekPattern} onValueChange={(v) => setCreateForm((prev) => ({ ...prev, weekPattern: v as 'all' | 'odd' | 'even' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">每周</SelectItem>
                    <SelectItem value="odd">单周</SelectItem>
                    <SelectItem value="even">双周</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 h-full pt-6">
                <Checkbox id="create-split" checked={createForm.isSplit} onCheckedChange={(v) => setCreateForm((prev) => ({ ...prev, isSplit: v as boolean }))} />
                <Label htmlFor="create-split">启用分层教学</Label>
              </div>
            </div>
            {createForm.courseName && (
              <div className={cn('rounded-lg border p-2 text-xs', getCourseType(createForm.courseName) === '场景' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-blue-50 border-blue-200 text-blue-700')}>
                课程类型: {getCourseType(createForm.courseName) === '场景' ? '场景教学' : getCourseType(createForm.courseName) === '实践' ? '实践课' : '理论课'}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>取消</Button>
            <Button onClick={handleCreate}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量导入弹窗 */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              批量导入任课关系
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">数据格式说明</p>
              <p>每行一条记录，字段用逗号/制表符分隔：</p>
              <p className="font-mono bg-white border rounded px-2 py-1">班级名称, 课程名称, 教师姓名, 周课时, 周次模式</p>
              <p>示例：</p>
              <p className="font-mono bg-white border rounded px-2 py-1">软件工程2026级1班, 程序设计基础, 周建国, 4, 每周</p>
            </div>
            <div className="space-y-2">
              <Label>粘贴数据</Label>
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="在此粘贴Excel数据..."
                rows={6}
              />
              <Button variant="outline" size="sm" onClick={handleParseImport}>
                <Upload className="h-3.5 w-3.5 mr-1" />
                解析数据
              </Button>
            </div>
            {importPreview.length > 0 && (
              <div className="space-y-2">
                <Label>预览 ({importPreview.length} 条)</Label>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">班级</TableHead>
                        <TableHead className="text-xs">课程</TableHead>
                        <TableHead className="text-xs">教师</TableHead>
                        <TableHead className="text-xs">周课时</TableHead>
                        <TableHead className="text-xs">周次模式</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importPreview.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs">{classes.find((c) => c.id === item.classId)?.name || item.classId}</TableCell>
                          <TableCell className="text-xs">{item.courseName}</TableCell>
                          <TableCell className="text-xs">{faculty.find((f) => f.id === item.facultyId)?.name || item.facultyId}</TableCell>
                          <TableCell className="text-xs">{item.hoursPerWeek}</TableCell>
                          <TableCell className="text-xs">{item.weekPattern === 'all' ? '每周' : item.weekPattern === 'odd' ? '单周' : '双周'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setImportDialogOpen(false); setImportText(''); setImportPreview([]) }}>取消</Button>
            <Button onClick={handleConfirmImport} disabled={importPreview.length === 0}>
              确认导入 ({importPreview.length} 条)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑任课关系弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑任课关系 — {selectedAssignment?.courseName}</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>班级</Label>
                  <Select defaultValue={selectedAssignment.classId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>主讲教师</Label>
                  <Select defaultValue={selectedAssignment.facultyId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.name} ({f.title})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>周课时</Label>
                  <Input type="number" defaultValue={selectedAssignment.hoursPerWeek} />
                </div>
                <div className="space-y-2">
                  <Label>周次模式</Label>
                  <Select defaultValue={selectedAssignment.weekPattern}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">每周</SelectItem>
                      <SelectItem value="odd">单周</SelectItem>
                      <SelectItem value="even">双周</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="split" checked={selectedAssignment.isSplit} />
                <Label htmlFor="split">启用分层教学</Label>
              </div>
              {selectedAssignment.isSplit && selectedAssignment.splitClasses && (
                <div className="space-y-2">
                  <Label>分层教学班配置</Label>
                  {selectedAssignment.splitClasses.map((sc, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <Input defaultValue={sc.name} placeholder="分层班名称" />
                      <Select defaultValue={sc.facultyId}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择教师" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculty.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={() => setEditDialogOpen(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
