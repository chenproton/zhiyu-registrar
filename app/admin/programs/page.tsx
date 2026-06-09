'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FolderKanban,
  GitBranch,
  LayoutList,
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
  SlidersHorizontal,
  ArrowUpFromLine,
  Send,
  Download,
} from 'lucide-react'
import { ProgramList } from './_components/program-list'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { usePrograms } from './_components/program-context'
import { majors, departments } from '@/lib/mock-data'
import type { TrainingProgram } from '@/lib/mock-data'
import { toast } from 'sonner'

const CURRENT_USER = '当前用户'

type TabType = 'my' | 'collab' | 'public'
type ViewMode = 'list' | 'group'

// 模拟批次数据（按年级+专业维度）
function getMockBatches() {
  const batches: { id: string; name: string; entryYear: number; majorId: string }[] = []
  const years = [2026, 2025, 2024, 2023]
  years.forEach((year) => {
    majors.forEach((major) => {
      batches.push({
        id: `batch-${year}-${major.id}`,
        name: `${year}级${major.name}批次`,
        entryYear: year,
        majorId: major.id,
      })
    })
  })
  return batches
}

export default function ProgramsPage() {
  const router = useRouter()
  const { programs, deleteProgram, updateProgram, addProgram } = usePrograms()

  const [activeTab, setActiveTab] = useState<TabType>('my')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['2026', '2025', '2024', '2023'])

  // Dialogs
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  // 邀请共建弹窗
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteProgram, setInviteProgram] = useState<TrainingProgram | null>(null)
  const [inviteName, setInviteName] = useState('')

  // 克隆弹窗
  const [isCloneSourceDialogOpen, setIsCloneSourceDialogOpen] = useState(false)
  const [cloneSearchQuery, setCloneSearchQuery] = useState('')
  const [cloneSelectedDept, setCloneSelectedDept] = useState<string | null>(null)
  const [cloneSelectedMajor, setCloneSelectedMajor] = useState<string | null>(null)

  // 公共人培方案库（用于克隆来源）
  const publicPrograms = useMemo(() => {
    return programs.filter((p) => p.status === 'published')
  }, [programs])

  const cloneFilteredPrograms = useMemo(() => {
    let result = publicPrograms
    if (cloneSearchQuery.trim()) {
      const q = cloneSearchQuery.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      )
    }
    if (cloneSelectedDept) {
      const deptMajorIds = majors.filter((m) => m.departmentId === cloneSelectedDept).map((m) => m.id)
      result = result.filter((p) => deptMajorIds.includes(p.majorId))
    }
    if (cloneSelectedMajor) {
      result = result.filter((p) => p.majorId === cloneSelectedMajor)
    }
    return result
  }, [publicPrograms, cloneSearchQuery, cloneSelectedDept, cloneSelectedMajor])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const tabFilteredPrograms = useMemo(() => {
    switch (activeTab) {
      case 'my':
        return programs.filter((p) => p.creator === CURRENT_USER || !p.creator)
      case 'collab':
        return programs.filter((p) => p.collaborators && p.collaborators.length > 0)
      case 'public':
      default:
        return programs.filter((p) => p.status === 'published')
    }
  }, [programs, activeTab])

  const filteredPrograms = useMemo(() => {
    let result = tabFilteredPrograms
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      )
    }
    if (selectedYear) {
      result = result.filter((p) => p.entryYear === Number(selectedYear))
    }
    if (selectedStatus) {
      result = result.filter((p) => p.status === selectedStatus)
    }
    if (selectedMajorId) {
      result = result.filter((p) => p.majorId === selectedMajorId)
    }
    return result
  }, [tabFilteredPrograms, searchQuery, selectedYear, selectedStatus, selectedMajorId])

  const stats = useMemo(() => {
    const total = filteredPrograms.length
    const draft = filteredPrograms.filter((p) => p.status === 'draft').length
    const pending = filteredPrograms.filter((p) => p.status === 'pending').length
    const published = filteredPrograms.filter((p) => p.status === 'published').length
    const deprecated = filteredPrograms.filter((p) => p.status === 'deprecated').length
    return { total, draft, pending, published, deprecated }
  }, [filteredPrograms])

  // 分组数据（按年级分组）
  const programsByYear = useMemo(() => {
    if (viewMode !== 'group') return null
    const groups: Record<string, TrainingProgram[]> = {}
    filteredPrograms.forEach((p) => {
      if (!groups[p.entryYear]) groups[p.entryYear] = []
      groups[p.entryYear].push(p)
    })
    return groups
  }, [filteredPrograms, viewMode])

  const handleSelectId = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((sid) => sid !== id)))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredPrograms.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const hasSelected = selectedIds.length > 0

  const handleBatchDelete = () => {
    selectedIds.forEach((id) => deleteProgram(id))
    setSelectedIds([])
    toast.success(`已删除 ${selectedIds.length} 个方案`)
  }

  const handleDelete = (program: TrainingProgram) => {
    if (confirm(`确定要删除人培方案「${program.name}」吗？`)) {
      deleteProgram(program.id)
      toast.success('删除成功')
    }
  }

  const handleEdit = (program: TrainingProgram) => {
    router.push(`/admin/programs/${program.id}/edit`)
  }

  const handleInvite = (program: TrainingProgram) => {
    setInviteProgram(program)
    setInviteName('')
    setInviteOpen(true)
  }

  const confirmClone = (program: TrainingProgram) => {
    const newId = `tp${Date.now()}`
    const cloned: TrainingProgram = {
      ...program,
      id: newId,
      code: `${program.code}-CLONE`,
      name: `${program.name}（克隆）`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      creator: CURRENT_USER,
      collaborators: [],
    }
    addProgram(cloned)
    toast.success(`已成功克隆「${program.name}」到「我的人培方案」`)
  }

  const handleClone = (program: TrainingProgram) => {
    confirmClone(program)
  }

  const handleCloneFromPublic = (program: TrainingProgram) => {
    setIsCloneSourceDialogOpen(false)
    confirmClone(program)
  }

  const handleSubmitApproval = (program: TrainingProgram) => {
    updateProgram({ ...program, status: 'pending' })
    toast.success('已提交审批')
  }

  const handleWithdrawApproval = (program: TrainingProgram) => {
    updateProgram({ ...program, status: 'draft' })
    toast.success('已撤回审批')
  }

  const handleWithdrawPublish = (program: TrainingProgram) => {
    updateProgram({ ...program, status: 'draft' })
    toast.success('已撤回发布')
  }

  const handleExport = (program: TrainingProgram) => {
    toast.success(`正在导出「${program.name}」...`)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedYear(null)
    setSelectedStatus(null)
    setSelectedMajorId(null)
  }

  const openCreate = () => {
    router.push('/admin/programs/new')
  }

  // 所有不重复的入学年份
  const allYears = useMemo(() => {
    const years = Array.from(new Set(programs.map((p) => p.entryYear)))
    return years.sort((a, b) => b - a)
  }, [programs])

  return (
    <div className="space-y-6">
      {/* ===== Part 1: Top Title Card ===== */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">人培方案管理</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                维护人才培养方案信息、课程计划、实践场景等人培资源
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <GitBranch className="mr-2 h-4 w-4" />
                配置审批流程
              </Button>

              <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FolderKanban className="mr-2 h-4 w-4" />
                    配置批次分组
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <div>
                      <DialogTitle>批次分组管理</DialogTitle>
                      <DialogDescription>管理人培方案批次分组</DialogDescription>
                    </div>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <div className="rounded-lg border overflow-hidden">
                      <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 border-b">
                        <div>分组名称</div>
                        <div>年级</div>
                        <div>专业</div>
                      </div>
                      {getMockBatches().slice(0, 12).map((batch) => {
                        const major = majors.find((m) => m.id === batch.majorId)
                        return (
                          <div key={batch.id} className="grid grid-cols-3 gap-4 px-4 py-2 text-sm border-b last:border-0">
                            <div className="font-medium">{batch.name}</div>
                            <div className="text-gray-500">{batch.entryYear}级</div>
                            <div>
                              <Badge variant="outline" className="text-xs">
                                {major?.name || '-'}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>关闭</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={() => setIsCloneSourceDialogOpen(true)}>
                <Copy className="mr-2 h-4 w-4" />
                克隆人培方案
              </Button>

              <Button variant="outline" size="sm" onClick={() => router.push('/admin/programs/import')}>
                <Upload className="mr-2 h-4 w-4" />
                导入人培方案
              </Button>

              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                新建人培方案
              </Button>
            </div>
          </div>

          {/* Stats dashboard - hidden in public tab */}
          {activeTab !== 'public' && (
            <div className="grid grid-cols-5 gap-3 mt-3">
              <Card className="border-slate-200 shadow-sm w-full">
                <CardContent className="px-3 py-[3px] flex items-center justify-between">
                  <div className="leading-none">
                    <p className="text-xs text-slate-500 leading-none">方案总数</p>
                    <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.total}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                    <SlidersHorizontal className="h-3 w-3 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm w-full">
                <CardContent className="px-3 py-[3px] flex items-center justify-between">
                  <div className="leading-none">
                    <p className="text-xs text-slate-500 leading-none">草稿</p>
                    <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.draft}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center">
                    <RotateCcw className="h-3 w-3 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm w-full">
                <CardContent className="px-3 py-[3px] flex items-center justify-between">
                  <div className="leading-none">
                    <p className="text-xs text-slate-500 leading-none">审批中</p>
                    <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.pending}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-yellow-50 flex items-center justify-center">
                    <GitBranch className="h-3 w-3 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm w-full">
                <CardContent className="px-3 py-[3px] flex items-center justify-between">
                  <div className="leading-none">
                    <p className="text-xs text-slate-500 leading-none">已发布</p>
                    <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.published}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center">
                    <ArrowUpFromLine className="h-3 w-3 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm w-full">
                <CardContent className="px-3 py-[3px] flex items-center justify-between">
                  <div className="leading-none">
                    <p className="text-xs text-slate-500 leading-none">已废弃</p>
                    <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.deprecated}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center">
                    <X className="h-3 w-3 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Part 2: View Switch Area ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as TabType); setSelectedIds([]); }}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="my" className="w-full">我的人培方案</TabsTrigger>
            <TabsTrigger value="collab" className="w-full">共建人培方案</TabsTrigger>
            <TabsTrigger value="public" className="w-full">公共人培方案库</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors",
              viewMode === 'list' ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <LayoutList className="h-3.5 w-3.5" />
            资源列表
          </button>
          <button
            onClick={() => setViewMode('group')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors",
              viewMode === 'group' ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <ListFilter className="h-3.5 w-3.5" />
            批次分组
          </button>
        </div>
      </div>

      {/* ===== Part 3: Data List Area ===== */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          {/* Search + Filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 w-full">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索方案名称 / 编码"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-sm flex-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedYear || '__all__'} onValueChange={(v) => setSelectedYear(v === '__all__' ? null : v)}>
                <SelectTrigger className="h-9 text-sm w-36">
                  <SelectValue placeholder="按年级筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全部年级</SelectItem>
                  {allYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}级</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMajorId || '__all__'} onValueChange={(v) => setSelectedMajorId(v === '__all__' ? null : v)}>
                <SelectTrigger className="h-9 text-sm w-40">
                  <SelectValue placeholder="按专业筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全部专业</SelectItem>
                  {majors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus || '__all__'} onValueChange={(v) => setSelectedStatus(v === '__all__' ? null : v)}>
                <SelectTrigger className="h-9 text-sm w-32">
                  <SelectValue placeholder="按状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全部状态</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="pending">审批中</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="deprecated">已废弃</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={handleResetFilters}>
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              重置
            </Button>
          </div>

          {/* Quick actions - linked with checkboxes */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className={cn("text-xs mr-1", hasSelected ? "text-slate-700 font-medium" : "text-slate-400")}>
              {hasSelected ? `已选择 ${selectedIds.length} 项：` : "请选择方案："}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled={!hasSelected} onClick={handleBatchDelete}>
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        </CardContent>

        {/* Program list - merged into the same Card */}
        {filteredPrograms.length > 0 && viewMode !== 'group' && (
          <CardContent className="pt-0">
            <ProgramList
              programs={filteredPrograms}
              majors={majors}
              selectedIds={selectedIds}
              onSelectId={handleSelectId}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onInvite={handleInvite}
              onDelete={handleDelete}
              onClone={handleClone}
              onSubmitApproval={handleSubmitApproval}
              onWithdrawApproval={handleWithdrawApproval}
              onWithdrawPublish={handleWithdrawPublish}
              onExport={handleExport}
              className="border-0 rounded-none"
            />
          </CardContent>
        )}
      </Card>

      {/* Program list - group view remains outside the card */}
      {filteredPrograms.length > 0 && viewMode === 'group' && programsByYear && (
        <div className="space-y-4">
          {Object.entries(programsByYear)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([year, yearPrograms]) => {
              const isExpanded = expandedGroups.includes(year)

              return (
                <Collapsible key={year} open={isExpanded} onOpenChange={() => toggleGroup(year)}>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <CollapsibleTrigger asChild>
                      <div className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-800">{year}级</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {yearPrograms.length} 个方案
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 pt-0">
                        <ProgramList
                          programs={yearPrograms}
                          majors={majors}
                          selectedIds={selectedIds}
                          onSelectId={handleSelectId}
                          onSelectAll={handleSelectAll}
                          onEdit={handleEdit}
                          onInvite={handleInvite}
                          onDelete={handleDelete}
                          onClone={handleClone}
                          onSubmitApproval={handleSubmitApproval}
                          onWithdrawApproval={handleWithdrawApproval}
                          onWithdrawPublish={handleWithdrawPublish}
                          onExport={handleExport}
                        />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
        </div>
      )}

      {filteredPrograms.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-slate-700">暂无方案</h3>
          <p className="mb-4 text-sm text-slate-500">当前筛选条件下没有人培方案数据</p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新建人培方案
          </Button>
        </div>
      )}

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导入人培方案</DialogTitle>
            <DialogDescription>上传 Excel 或 CSV 文件批量导入人培方案数据</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                拖拽文件到此处，或点击选择文件
              </p>
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/programs/import')}>前往导入页面</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 邀请共建弹窗 */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>邀请共建 — {inviteProgram?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>被邀请人姓名</Label>
              <Input
                placeholder="请输入被邀请人姓名"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>取消</Button>
            <Button onClick={() => {
              if (!inviteName.trim()) {
                toast.error('请输入被邀请人姓名')
                return
              }
              if (inviteProgram) {
                updateProgram({
                  ...inviteProgram,
                  collaborators: [...(inviteProgram.collaborators || []), inviteName.trim()],
                })
              }
              toast.success(`已成功邀请 ${inviteName.trim()} 共建该方案`)
              setInviteOpen(false)
            }}>确认邀请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 克隆来源弹窗 — 公共人培方案库 */}
      <Dialog open={isCloneSourceDialogOpen} onOpenChange={setIsCloneSourceDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>克隆人培方案</DialogTitle>
            <DialogDescription>从公共人培方案库中选择一个方案进行整体克隆</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索方案名称 / 编码"
                  value={cloneSearchQuery}
                  onChange={(e) => setCloneSearchQuery(e.target.value)}
                  className="h-9 text-sm pl-9"
                />
              </div>
              <Select value={cloneSelectedDept || '__all__'} onValueChange={(v) => { setCloneSelectedDept(v === '__all__' ? null : v); setCloneSelectedMajor(null) }}>
                <SelectTrigger className="h-9 text-sm w-36">
                  <SelectValue placeholder="全部院系" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全部院系</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cloneSelectedMajor || '__all__'} onValueChange={(v) => setCloneSelectedMajor(v === '__all__' ? null : v)}>
                <SelectTrigger className="h-9 text-sm w-36">
                  <SelectValue placeholder="全部专业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全部专业</SelectItem>
                  {majors.filter((m) => !cloneSelectedDept || m.departmentId === cloneSelectedDept).map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {cloneFilteredPrograms.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                公共人培方案库中暂无符合条件的方案
              </div>
            ) : (
              <div className="space-y-2">
                {cloneFilteredPrograms.map((program) => {
                  const major = majors.find((m) => m.id === program.majorId)
                  return (
                    <div
                      key={program.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{program.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {program.code} · {major?.name || '-'} · {program.entryYear}级 · {program.duration}年/{program.level}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs ml-4 shrink-0"
                        onClick={() => handleCloneFromPublic(program)}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        克隆
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloneSourceDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
