'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Pencil, Trash2, GraduationCap, Users, BookOpen, Search } from 'lucide-react'
import { grades, classes } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<typeof grades[0] | null>(null)

  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      if (searchQuery && !g.name.includes(searchQuery) && !String(g.entryYear).includes(searchQuery)) return false
      return true
    })
  }, [searchQuery])

  // 统计信息通过 classes 关联计算
  const stats = useMemo(() => {
    const totalClasses = grades.reduce((sum, g) => sum + classes.filter((c) => c.gradeId === g.id).length, 0)
    const totalStudents = grades.reduce((sum, g) => {
      const gradeClasses = classes.filter((c) => c.gradeId === g.id)
      return sum + gradeClasses.reduce((s, c) => s + c.studentCount, 0)
    }, 0)
    return {
      total: grades.length,
      active: grades.filter((g) => g.status === '在校').length,
      graduated: grades.filter((g) => g.status === '毕业').length,
      totalClasses,
      totalStudents,
    }
  }, [])

  const handleEdit = (grade: typeof grades[0]) => {
    setSelectedGrade(grade)
    setEditDialogOpen(true)
  }

  const getGradeStats = (gradeId: string) => {
    const gradeClasses = classes.filter((c) => c.gradeId === gradeId)
    return {
      classCount: gradeClasses.length,
      studentCount: gradeClasses.reduce((sum, c) => sum + c.studentCount, 0),
    }
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">年级/届别管理</h1>
          <p className="text-muted-foreground">管理通用年级（届别）信息，各专业的班级通过年级进行关联</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-1" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            新增年级
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">年级总数</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">在校年级</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已毕业</p>
              <p className="text-2xl font-bold">{stats.graduated}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">关联班级</p>
              <p className="text-2xl font-bold">{stats.totalClasses}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">学生总数</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="rounded-full p-2 bg-indigo-500">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 年级表格 */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">年级列表</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="搜索年级名称或入学年份..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[220px] h-8 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>年级名称</TableHead>
                <TableHead>入学年份</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>关联班级数</TableHead>
                <TableHead>学生数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => {
                const stats = getGradeStats(grade.id)
                return (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.name}</TableCell>
                    <TableCell>{grade.entryYear}</TableCell>
                    <TableCell>
                      <Badge
                        variant={grade.status === '在校' ? 'default' : grade.status === '毕业' ? 'secondary' : 'outline'}
                      >
                        {grade.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{stats.classCount}</TableCell>
                    <TableCell>{stats.studentCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => handleEdit(grade)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          编辑
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => toast.success('删除成功')}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredGrades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">暂无数据</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增年级弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新增年级</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>年级名称</Label><Input placeholder="如 2026级" /></div>
              <div className="space-y-2"><Label>入学年份</Label><Input type="number" placeholder="如 2026" /></div>
            </div>
            <div className="space-y-2"><Label>状态</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger><SelectContent><SelectItem value="在校">在校</SelectItem><SelectItem value="毕业">毕业</SelectItem><SelectItem value="结业">结业</SelectItem></SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新增年级成功'); setCreateDialogOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑年级 — {selectedGrade?.name}</DialogTitle>
          </DialogHeader>
          {selectedGrade && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>年级名称</Label>
                  <Input defaultValue={selectedGrade.name} />
                </div>
                <div className="space-y-2">
                  <Label>入学年份</Label>
                  <Input type="number" defaultValue={selectedGrade.entryYear} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select defaultValue={selectedGrade.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="在校">在校</SelectItem>
                    <SelectItem value="毕业">毕业</SelectItem>
                    <SelectItem value="结业">结业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
