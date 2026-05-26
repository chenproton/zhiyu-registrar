'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Pencil, Star, Users, Eye, Trash2 } from 'lucide-react'
import { evaluationTemplates as initialTemplates, type EvaluationTemplate } from '@/lib/mock-data'
import { toast } from 'sonner'

const subjectFilters = [
  { id: 'all', label: '全部模板' },
  { id: '学生评教', label: '学生评教' },
  { id: '内部评价', label: '内部评价' },
  { id: '专家评价', label: '专家评价' },
  { id: '企业评价', label: '企业评价' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  published: { label: '已发布', variant: 'default' },
  draft: { label: '草稿', variant: 'secondary' },
  disabled: { label: '已停用', variant: 'destructive' },
}

const emptyTemplate: EvaluationTemplate = {
  id: '',
  name: '',
  subject: '学生评教',
  dimensions: [],
  method: '打分制',
  status: 'draft',
}

export default function EvaluationTemplatesPage() {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>(initialTemplates)
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EvaluationTemplate>({ ...emptyTemplate })
  const [dimensionInput, setDimensionInput] = useState('')

  const filteredTemplates = useMemo(() => {
    if (selectedSubject === 'all') return templates
    return templates.filter((t) => t.subject === selectedSubject)
  }, [templates, selectedSubject])

  const openCreate = () => {
    setEditingTemplate({ ...emptyTemplate, id: `et-${Date.now()}` })
    setDimensionInput('')
    setCreateOpen(true)
  }

  const openEdit = (template: EvaluationTemplate) => {
    setEditingTemplate({ ...template })
    setDimensionInput(template.dimensions.join('、'))
    setEditOpen(true)
  }

  const handleSave = (isEdit: boolean) => {
    if (!editingTemplate.name.trim()) {
      toast.error('请输入模板名称')
      return
    }
    const dims = dimensionInput
      .split(/[、,，]/)
      .map((d) => d.trim())
      .filter((d) => d.length > 0)
    const toSave = { ...editingTemplate, dimensions: dims }
    if (isEdit) {
      setTemplates((prev) => prev.map((t) => (t.id === toSave.id ? toSave : t)))
      toast.success('模板已更新')
      setEditOpen(false)
    } else {
      setTemplates((prev) => [...prev, toSave])
      toast.success('模板已创建')
      setCreateOpen(false)
    }
  }

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    toast.success('模板已删除')
  }

  const handleToggleStatus = (template: EvaluationTemplate) => {
    const nextStatus = template.status === 'published' ? 'disabled' : 'published'
    setTemplates((prev) =>
      prev.map((t) => (t.id === template.id ? { ...t, status: nextStatus } : t))
    )
    toast.success(`模板已${nextStatus === 'published' ? '发布' : '停用'}`)
  }

  const renderForm = () => (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>模板名称</Label>
          <Input
            value={editingTemplate.name}
            onChange={(e) => setEditingTemplate((t) => ({ ...t, name: e.target.value }))}
            placeholder="如 期末学生评教模板"
          />
        </div>
        <div className="space-y-2">
          <Label>评价主体</Label>
          <Select
            value={editingTemplate.subject}
            onValueChange={(v) => setEditingTemplate((t) => ({ ...t, subject: v as EvaluationTemplate['subject'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="学生评教">学生评教</SelectItem>
              <SelectItem value="内部评价">内部评价</SelectItem>
              <SelectItem value="专家评价">专家评价</SelectItem>
              <SelectItem value="企业评价">企业评价</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>评价方式</Label>
          <Select
            value={editingTemplate.method}
            onValueChange={(v) => setEditingTemplate((t) => ({ ...t, method: v as EvaluationTemplate['method'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="打分制">打分制</SelectItem>
              <SelectItem value="等级制">等级制</SelectItem>
              <SelectItem value="问卷打分">问卷打分</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={editingTemplate.status}
            onValueChange={(v) => setEditingTemplate((t) => ({ ...t, status: v as EvaluationTemplate['status'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="disabled">已停用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>评价维度（用顿号、逗号或换行分隔）</Label>
        <Input
          value={dimensionInput}
          onChange={(e) => setDimensionInput(e.target.value)}
          placeholder="如 教学态度、教学内容、教学方法、教学效果"
        />
        <div className="flex flex-wrap gap-1">
          {dimensionInput
            .split(/[、,，]/)
            .map((d) => d.trim())
            .filter((d) => d.length > 0)
            .map((d) => (
              <Badge key={d} variant="outline" className="text-xs">
                {d}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧评价主体导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">评价主体</span>
        </div>
        <div className="space-y-1">
          {subjectFilters.map((sf) => {
            const count =
              sf.id === 'all'
                ? templates.length
                : templates.filter((t) => t.subject === sf.id).length
            return (
              <button
                key={sf.id}
                onClick={() => setSelectedSubject(sf.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                  selectedSubject === sf.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span>{sf.label}</span>
                <span
                  className={`text-xs ${
                    selectedSubject === sf.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务评价模板</h1>
            <p className="text-muted-foreground text-sm">
              共 {filteredTemplates.length} 个模板 · 配置教学质量评价维度与方式
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            新建模板
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">模板总数</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">已发布</p>
                <p className="text-2xl font-bold">{templates.filter((t) => t.status === 'published').length}</p>
              </div>
              <div className="rounded-full p-2 bg-green-500">
                <Star className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">草稿</p>
                <p className="text-2xl font-bold">{templates.filter((t) => t.status === 'draft').length}</p>
              </div>
              <div className="rounded-full p-2 bg-amber-500">
                <Pencil className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">已停用</p>
                <p className="text-2xl font-bold">{templates.filter((t) => t.status === 'disabled').length}</p>
              </div>
              <div className="rounded-full p-2 bg-gray-500">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模板名称</TableHead>
                  <TableHead>评价主体</TableHead>
                  <TableHead>评价维度</TableHead>
                  <TableHead>评价方式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((et) => (
                  <TableRow key={et.id}>
                    <TableCell className="font-medium">{et.name}</TableCell>
                    <TableCell>{et.subject}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {et.dimensions.map((d) => (
                          <Badge key={d} variant="outline" className="text-xs">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{et.method}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[et.status].variant}>{statusMap[et.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(et)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(et)}
                        >
                          {et.status === 'published' ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Star className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(et.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTemplates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      暂无评价模板
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 新建模板弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建评价模板</DialogTitle>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={() => handleSave(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑模板弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑评价模板</DialogTitle>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              取消
            </Button>
            <Button onClick={() => handleSave(true)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
