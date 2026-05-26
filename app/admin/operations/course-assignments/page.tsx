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
import { Plus, Pencil, Upload, Users, BookOpen, GraduationCap } from 'lucide-react'
import { courseAssignments, classes, faculty, majors, departments } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function CourseAssignmentsPage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<typeof courseAssignments[0] | null>(null)
  const [filterClass, setFilterClass] = useState<string>('all')

  const filtered = courseAssignments.filter((ca) => {
    if (filterClass !== 'all' && ca.classId !== filterClass) return false
    return true
  })

  const handleEdit = (assignment: typeof courseAssignments[0]) => {
    setSelectedAssignment(assignment)
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任课关系管理</h1>
          <p className="text-muted-foreground">管理班级-课程-教师的任课绑定关系，支持分层教学配置</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={() => toast('批量导入功能开发中')}>
            <Upload className="h-4 w-4" />
            批量导入
          </Button>
          <Button className="gap-1" onClick={() => toast('新增任课功能开发中')}>
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
              <p className="text-2xl font-bold">{courseAssignments.length}</p>
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
              <p className="text-2xl font-bold">{new Set(courseAssignments.map((c) => c.classId)).size}</p>
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
              <p className="text-2xl font-bold">{new Set(courseAssignments.map((c) => c.facultyId)).size}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">分层教学班</p>
              <p className="text-2xl font-bold">{courseAssignments.filter((c) => c.isSplit).length}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Users className="h-4 w-4 text-white" />
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
                return (
                  <TableRow key={ca.id}>
                    <TableCell className="font-medium">{cls?.name}</TableCell>
                    <TableCell>{ca.courseName}</TableCell>
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
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => handleEdit(ca)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        编辑
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
