'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { TrainingProgram } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Save,
  Send,
  BookOpen,
  Briefcase,
  Target,
  Users,
  School,
  LayoutList,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
} from 'lucide-react'
import RichTextEditor from '@/components/ui/rich-text-editor'
import TabBasicInfo from './tabs/tab-basic-info'
import TabCareerOrientation from './tabs/tab-career-orientation'
import TabTrainingSpecs from './tabs/tab-training-specs'
import TabCurriculum from './tabs/tab-curriculum'
import TabFacultyTeam from './tabs/tab-faculty-team'
import TabTeachingConditions from './tabs/tab-teaching-conditions'

const fixedSections = [
  { id: 'basic', label: '基本信息', icon: BookOpen },
  { id: 'career', label: '职业面向', icon: Briefcase },
  { id: 'specs', label: '培养目标与规格', icon: Target },
  { id: 'curriculum', label: '教学进程总体安排', icon: LayoutList },
  { id: 'faculty', label: '师资队伍', icon: Users },
  { id: 'conditions', label: '教学条件', icon: School },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  pending: { label: '待审核', variant: 'outline' },
  published: { label: '已发布', variant: 'default' },
  deprecated: { label: '已停用', variant: 'destructive' },
}

function SectionCard({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <section
      id={`section-${id}`}
      className="scroll-mt-24 scroll-smooth"
    >
      <div className="flex items-center gap-2 mb-4 pb-2 border-b">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export default function ProgramEditForm({
  initialProgram,
  mode,
  onSave,
}: {
  initialProgram: TrainingProgram
  mode: 'new' | 'edit'
  onSave: (program: TrainingProgram) => void
}) {
  const router = useRouter()
  const [program, setProgram] = useState<TrainingProgram>(initialProgram)
  const [activeSection, setActiveSection] = useState('basic')
  const [saving, setSaving] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 自定义目录
  const [customSections, setCustomSections] = useState<{ id: string; title: string; content: string }[]>(
    program.customSections || []
  )
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [editSectionId, setEditSectionId] = useState<string | null>(null)
  const [editSectionTitle, setEditSectionTitle] = useState('')

  // 所有目录（固定+自定义）的排序状态
  const [orderedSectionIds, setOrderedSectionIds] = useState<string[]>([
    'basic', 'career', 'specs', 'curriculum', 'faculty', 'conditions',
    ...(program.customSections?.map((s) => s.id) || []),
  ])

  // 拖动排序
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // URL tab 参数 → 滚动到对应 section
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tabFromUrl = new URLSearchParams(window.location.search).get('tab')
      if (tabFromUrl && orderedSectionIds.includes(tabFromUrl)) {
        setTimeout(() => scrollToSection(tabFromUrl), 100)
      }
    }
  }, [scrollToSection, orderedSectionIds])

  // IntersectionObserver 监听当前可见 section
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) {
        const id = visible.target.id.replace('section-', '')
        setActiveSection(id)
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    orderedSectionIds.forEach((id) => {
      const el = document.getElementById(`section-${id}`)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [program, orderedSectionIds])

  const handleSave = (publish = false) => {
    if (!program.name || !program.code) {
      toast.error('请填写方案名称和编码')
      scrollToSection('basic')
      return
    }
    if (!program.majorId) {
      toast.error('请选择面向专业')
      scrollToSection('basic')
      return
    }
    setSaving(true)
    const toSave = publish
      ? { ...program, status: 'published' as const, customSections }
      : { ...program, customSections }
    onSave(toSave)
    toast.success(publish ? '方案已发布' : '草稿已保存')
    setSaving(false)
    router.push('/admin/programs')
  }

  const status = statusMap[program.status] || { label: program.status, variant: 'secondary' as const }

  const handleAddCustomSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error('请输入目录名称')
      return
    }
    const newId = `custom-${Date.now()}`
    const newSection = { id: newId, title: newSectionTitle.trim(), content: '' }
    setCustomSections((prev) => [...prev, newSection])
    setOrderedSectionIds((prev) => [...prev, newId])
    setNewSectionTitle('')
    setAddSectionOpen(false)
    toast.success('新增目录成功')
    setTimeout(() => scrollToSection(newId), 100)
  }

  const handleEditCustomSection = (id: string, title: string) => {
    setEditSectionId(id)
    setEditSectionTitle(title)
  }

  const handleSaveEditSection = () => {
    if (!editSectionTitle.trim()) {
      toast.error('目录名称不能为空')
      return
    }
    setCustomSections((prev) =>
      prev.map((s) => (s.id === editSectionId ? { ...s, title: editSectionTitle.trim() } : s))
    )
    setEditSectionId(null)
    setEditSectionTitle('')
    toast.success('目录名称已更新')
  }

  const handleDeleteCustomSection = (id: string) => {
    if (confirm('确定要删除该目录吗？')) {
      setCustomSections((prev) => prev.filter((s) => s.id !== id))
      setOrderedSectionIds((prev) => prev.filter((sid) => sid !== id))
      toast.success('目录已删除')
    }
  }

  const handleDragStart = (id: string) => {
    setDraggingId(id)
  }

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault()
    if (!draggingId || draggingId === overId) return
    setOrderedSectionIds((prev) => {
      const newOrder = [...prev]
      const dragIdx = newOrder.indexOf(draggingId)
      const overIdx = newOrder.indexOf(overId)
      if (dragIdx === -1 || overIdx === -1) return prev
      newOrder.splice(dragIdx, 1)
      newOrder.splice(overIdx, 0, draggingId)
      return newOrder
    })
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  const updateCustomSectionContent = (id: string, content: string) => {
    setCustomSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)))
  }

  return (
    <div className="space-y-0">
      {/* 顶部操作栏 */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/programs')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回列表
            </Button>
            <div>
              <h1 className="text-lg font-bold">
                {mode === 'new' ? '新建培养方案' : '编辑培养方案'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {program.name || '未命名方案'} · {program.code || '无编码'}
              </p>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.xmafkj.com/virtual_attach_file.vsb?afc=_M7QFknR-ZnRWVU9mQfnRCbnR7iL8UAYU4LaMzr7MlCZol-0gihFp2hmCIa0MkyaLkyPL1h2LzUPLRrVUlWRLzLiLNnVMlWkozNPMRNDLm6FoRLPU8U8nz6FMzfVozGJv2nto4OeoDXsCYhXptQ0g47aLmL0LzU4LSbw6218c', '_blank')}
            >
              预览
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-1" />
              保存草稿
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              <Send className="h-4 w-4 mr-1" />
              发布方案
            </Button>
          </div>
        </div>
      </div>

      {/* 主体：左侧导航 + 右侧内容 */}
      <div className="flex gap-6 pt-6">
        {/* 左侧目录导航 */}
        <aside className="sticky top-20 h-fit w-52 shrink-0 hidden lg:block space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">目录</p>
          {orderedSectionIds.map((id) => {
            const fixed = fixedSections.find((s) => s.id === id)
            const custom = customSections.find((s) => s.id === id)
            if (!fixed && !custom) return null
            const isActive = activeSection === id
            const isDragging = draggingId === id
            const label = fixed?.label || custom?.title || ''
            const Icon = fixed?.icon || GripVertical

            return (
              <div
                key={id}
                draggable
                onDragStart={() => handleDragStart(id)}
                onDragOver={(e) => handleDragOver(e, id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'group flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-colors cursor-move select-none',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isDragging && 'opacity-50'
                )}
              >
                <GripVertical className={cn(
                  'h-4 w-4 shrink-0 cursor-grab active:cursor-grabbing',
                  isActive ? 'text-primary' : 'text-muted-foreground/60'
                )} />
                <button
                  onClick={() => scrollToSection(id)}
                  className="flex-1 flex items-center gap-2 text-left truncate"
                >
                  {fixed && <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />}
                  <span className="truncate">{label}</span>
                </button>
                {custom && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => handleEditCustomSection(custom.id, custom.title)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-destructive"
                      onClick={() => handleDeleteCustomSection(custom.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
            onClick={() => { setNewSectionTitle(''); setAddSectionOpen(true) }}
          >
            <Plus className="h-4 w-4 mr-1" />
            新增目录
          </Button>
        </aside>

        {/* 右侧连续内容 */}
        <main className="flex-1 min-w-0 space-y-16 pb-20">
          {orderedSectionIds.map((id) => {
            const fixed = fixedSections.find((s) => s.id === id)
            const custom = customSections.find((s) => s.id === id)
            if (!fixed && !custom) return null

            if (id === 'curriculum') {
              return <TabCurriculum key={id} program={program} onChange={setProgram} showTitle />
            }

            if (fixed) {
              const tabMap: Record<string, React.ReactNode> = {
                basic: <TabBasicInfo program={program} onChange={setProgram} />,
                career: <TabCareerOrientation program={program} onChange={setProgram} />,
                specs: <TabTrainingSpecs program={program} onChange={setProgram} />,
                faculty: <TabFacultyTeam program={program} onChange={setProgram} />,
                conditions: <TabTeachingConditions program={program} onChange={setProgram} />,
              }
              return (
                <SectionCard key={id} id={id} title={fixed.label} icon={fixed.icon}>
                  {tabMap[id]}
                </SectionCard>
              )
            }

            return (
              <SectionCard key={id} id={id} title={custom!.title} icon={GripVertical}>
                <RichTextEditor
                  value={custom!.content}
                  onChange={(v) => updateCustomSectionContent(custom!.id, v)}
                  placeholder={`请在「${custom!.title}」中填写内容...`}
                />
              </SectionCard>
            )
          })}
        </main>
      </div>

      {/* 新增目录弹窗 */}
      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>新增目录</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="请输入目录名称"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSection() }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSectionOpen(false)}>取消</Button>
            <Button onClick={handleAddCustomSection}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑目录名称弹窗 */}
      <Dialog open={!!editSectionId} onOpenChange={(v) => { if (!v) setEditSectionId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>编辑目录名称</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="请输入目录名称"
              value={editSectionTitle}
              onChange={(e) => setEditSectionTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEditSection() }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSectionId(null)}>取消</Button>
            <Button onClick={handleSaveEditSection}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
