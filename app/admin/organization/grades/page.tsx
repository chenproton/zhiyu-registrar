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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { grades, classes } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<typeof grades[0] | null>(null)
  const [activeTab, setActiveTab] = useState('在校')

  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      if (searchQuery && !g.name.includes(searchQuery) && !String(g.entryYear).includes(searchQuery)) return false
      if (activeTab && g.status !== activeTab) return false
      return true
    })
  }, [searchQuery, activeTab])

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
          <h1 className="text-2xl font-bold">年级（届别）管理</h1>
          <p className="text-muted-foreground">管理通用年级（届别）信息，各专业的班级通过年级进行关联</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-1" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            新增年级
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="在校">在校</TabsTrigger>
          <TabsTrigger value="毕业">毕业</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
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
                    <TableHead className="w-10"></TableHead>
                    <TableHead>年级名称</TableHead>
                    <TableHead>入学年份</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>关联班级数</TableHead>
                    <TableHead>学生数</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade, idx) => {
                    const stats = getGradeStats(grade.id)
                    return (
                      <TableRow key={grade.id}>
                        <TableCell>{idx + 1}</TableCell>
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
                            <Button size="sm" variant="ghost" className="h-7" onClick={() => handleEdit(grade)}>编辑</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => toast.success('删除成功')}>删除</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredGrades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">暂无数据</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
