'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  FileSpreadsheet,
  Pencil,
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  classes,
  faculty,
  venues,
  grades,
  tasks,
  courseAssignments,
  trainingPrograms,
  curriculumCoursePool,
  curriculumPracticePool,
  allPeriods,
  type Task,
} from '@/lib/mock-data'

const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

function isSceneTask(task: Task) {
  return task.type === 'scene' || task.externalPlatformType === 'scene'
}

function isHybridTask(task: Task) {
  return task.type === 'hybrid'
}

function taskBadge(task: Task) {
  if (isHybridTask(task)) {
    return { label: '混合式', className: 'border-purple-300 text-purple-600 bg-purple-50' }
  }
  if (isSceneTask(task)) {
    return { label: '实践场景', className: 'border-orange-300 text-orange-600 bg-orange-50' }
  }
  return { label: '课程', className: 'border-blue-300 text-blue-600 bg-blue-50' }
}

// ==================== Conflict Detection ====================
function periodsOverlap(a: string[], b: string[]) {
  return a.some((p) => b.includes(p))
}

function detectConflicts(
  task: Task,
  allTasks: Task[],
  newDayOfWeek?: number,
  newPeriods?: string[],
  newVenueId?: string,
  newFacultyId?: string
) {
  const conflicts: { type: 'teacher' | 'venue' | 'class'; with: string; taskName: string }[] = []
  const targetDay = newDayOfWeek ?? task.dayOfWeek
  const targetPeriods = newPeriods ?? task.periods
  const targetVenue = newVenueId ?? task.venueId
  const targetFaculty = newFacultyId ?? task.facultyId
  const targetClass = task.classId

  for (const t of allTasks) {
    if (t.id === task.id) continue
    if (t.dayOfWeek !== targetDay || !periodsOverlap(t.periods, targetPeriods)) continue

    if (t.facultyId === targetFaculty) {
      conflicts.push({ type: 'teacher', with: t.facultyName, taskName: t.courseName })
    }
    if (t.venueId === targetVenue) {
      conflicts.push({ type: 'venue', with: t.venueName, taskName: t.courseName })
    }
    if (t.classId === targetClass) {
      conflicts.push({ type: 'class', with: t.className, taskName: t.courseName })
    }
  }
  return conflicts
}

// ==================== Schedule Grid ====================
function ScheduleGrid({
  taskList,
  allTasks,
  onEditTask,
  onCreateTask,
}: {
  taskList: Task[]
  allTasks: Task[]
  onEditTask: (task: Task) => void
  onCreateTask?: () => void
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 bg-muted">
        <div className="p-3 text-sm font-medium border-r">节次 / 星期</div>
        {days.map((d) => (
          <div key={d} className="p-3 text-sm font-medium text-center border-r last:border-r-0">
            {d}
          </div>
        ))}
      </div>
      {allPeriods.map((p) => (
        <div key={p} className="grid grid-cols-8 border-t">
          <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{p}</div>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => {
            const task = taskList.find((e) => e.dayOfWeek === d && e.periods.includes(p))
            const conflicts = task ? detectConflicts(task, allTasks) : []
            const hasConflict = conflicts.length > 0
            const scene = task ? isSceneTask(task) : false
            return (
              <div
                key={d}
                className={cn(
                  'p-2 border-r last:border-r-0 min-h-[80px]',
                  !task && 'bg-muted/20'
                )}
              >
                {task ? (
                  <button
                    onClick={() => onEditTask(task)}
                    className={cn(
                      'w-full text-left rounded p-2 text-xs space-y-1 transition-all hover:shadow-sm hover:scale-[1.02] cursor-pointer',
                      hasConflict
                        ? 'bg-red-50 border border-red-200'
                        : isHybridTask(task)
                          ? 'bg-purple-50 border border-purple-200'
                          : scene
                            ? 'bg-orange-50 border border-orange-200'
                            : 'bg-blue-50 border border-blue-200'
                    )}
                  >
                    <div className="font-medium truncate">{task.courseName}</div>
                    <div className="text-[10px] text-muted-foreground">{task.courseVersion}</div>
                    <div className="text-muted-foreground">{task.facultyName}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {task.venueName}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {
                        (() => {
                          const badge = taskBadge(task)
                          return (
                            <Badge variant="outline" className={`text-[10px] h-4 ${badge.className}`}>
                              {badge.label}
                            </Badge>
                          )
                        })()
                      }
                      {hasConflict && (
                        <Badge variant="outline" className="text-[10px] h-4 border-red-200 text-red-600">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                          冲突
                        </Badge>
                      )}
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => onCreateTask?.()}
                    className="w-full h-full min-h-[60px] rounded border border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground/30 hover:border-primary/40 hover:text-primary/60 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ==================== Course Staging Area ====================
function CourseStagingArea() {
  const [stagingTab, setStagingTab] = useState<'pending' | 'completed' | 'over'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  const scheduledHoursMap = useMemo(() => {
    const map = new Map<string, number>()
    tasks.forEach((t) => {
      const key = `${t.classId}-${t.courseName}`
      map.set(key, (map.get(key) || 0) + 2)
    })
    return map
  }, [])

  const pendingItems = useMemo(() => {
    const items: { classId: string; className: string; courseName: string; plannedHours: number; scheduledHours: number }[] = []
    courseAssignments.forEach((ca) => {
      const key = `${ca.classId}-${ca.courseName}`
      const scheduled = scheduledHoursMap.get(key) || 0
      if (scheduled === 0) {
        const cls = classes.find((c) => c.id === ca.classId)
        items.push({
          classId: ca.classId,
          className: cls?.name || ca.classId,
          courseName: ca.courseName,
          plannedHours: ca.hoursPerWeek,
          scheduledHours: 0,
        })
      }
    })
    return items.filter((i) => !searchQuery || i.className.includes(searchQuery) || i.courseName.includes(searchQuery))
  }, [scheduledHoursMap, searchQuery])

  const completedItems = useMemo(() => {
    const items: { classId: string; className: string; courseName: string; plannedHours: number; scheduledHours: number }[] = []
    courseAssignments.forEach((ca) => {
      const key = `${ca.classId}-${ca.courseName}`
      const scheduled = scheduledHoursMap.get(key) || 0
      if (scheduled >= ca.hoursPerWeek) {
        const cls = classes.find((c) => c.id === ca.classId)
        items.push({
          classId: ca.classId,
          className: cls?.name || ca.classId,
          courseName: ca.courseName,
          plannedHours: ca.hoursPerWeek,
          scheduledHours: scheduled,
        })
      }
    })
    return items.filter((i) => !searchQuery || i.className.includes(searchQuery) || i.courseName.includes(searchQuery))
  }, [scheduledHoursMap, searchQuery])

  const overItems = useMemo(() => {
    const items: { classId: string; className: string; courseName: string; plannedHours: number; scheduledHours: number }[] = []
    courseAssignments.forEach((ca) => {
      const key = `${ca.classId}-${ca.courseName}`
      const scheduled = scheduledHoursMap.get(key) || 0
      if (scheduled > ca.hoursPerWeek) {
        const cls = classes.find((c) => c.id === ca.classId)
        items.push({
          classId: ca.classId,
          className: cls?.name || ca.classId,
          courseName: ca.courseName,
          plannedHours: ca.hoursPerWeek,
          scheduledHours: scheduled,
        })
      }
    })
    return items.filter((i) => !searchQuery || i.className.includes(searchQuery) || i.courseName.includes(searchQuery))
  }, [scheduledHoursMap, searchQuery])

  const currentItems = stagingTab === 'pending' ? pendingItems : stagingTab === 'completed' ? completedItems : overItems

  return (
    <div className="border rounded-lg bg-muted/20">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">课程暂放区</span>
          <span className="text-xs text-muted-foreground">拖拽向上放置课程</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="搜索教学班"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[180px] text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 pt-3">
        <button
          onClick={() => setStagingTab('pending')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-t-lg border-t border-x transition-colors',
            stagingTab === 'pending'
              ? 'bg-background text-primary border-border'
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          )}
        >
          待排教学班 ({pendingItems.length})
        </button>
        <button
          onClick={() => setStagingTab('completed')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-t-lg border-t border-x transition-colors',
            stagingTab === 'completed'
              ? 'bg-background text-primary border-border'
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          )}
        >
          已排完教学班 ({completedItems.length})
        </button>
        <button
          onClick={() => setStagingTab('over')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-t-lg border-t border-x transition-colors',
            stagingTab === 'over'
              ? 'bg-background text-primary border-border'
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          )}
        >
          超课时教学班 ({overItems.length})
        </button>
      </div>

      <div className="px-4 pb-4 bg-background border-t">
        {currentItems.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {stagingTab === 'pending' && '暂无需排课的教学班'}
            {stagingTab === 'completed' && '暂无已排完的教学班'}
            {stagingTab === 'over' && '暂无超课时的教学班'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 py-3">
            {currentItems.map((item, idx) => (
              <div
                key={`${item.classId}-${item.courseName}-${idx}`}
                className={cn(
                  'border rounded-lg p-2.5 text-xs cursor-pointer hover:shadow-sm transition-all',
                  stagingTab === 'pending' && 'bg-blue-50 border-blue-100 hover:border-blue-300',
                  stagingTab === 'completed' && 'bg-green-50 border-green-100 hover:border-green-300',
                  stagingTab === 'over' && 'bg-red-50 border-red-100 hover:border-red-300'
                )}
              >
                <div className="font-medium truncate">{item.courseName}</div>
                <div className="text-muted-foreground mt-0.5">{item.className}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <Badge variant="outline" className="text-[10px] h-4">
                    {stagingTab === 'pending' && `待排 ${item.plannedHours}节`}
                    {stagingTab === 'completed' && `已排 ${item.scheduledHours}/${item.plannedHours}节`}
                    {stagingTab === 'over' && `超排 ${item.scheduledHours}/${item.plannedHours}节`}
                  </Badge>
                  {stagingTab === 'pending' && <Plus className="h-3 w-3 text-blue-500" />}
                  {stagingTab === 'completed' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                  {stagingTab === 'over' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== Searchable Select ====================
function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  )

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal bg-background hover:bg-accent"
          >
            <span className={cn('truncate', !selected && 'text-muted-foreground')}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>
          <ScrollArea className="h-[200px]">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                无匹配结果
              </div>
            ) : (
              <div className="p-1">
                {filtered.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      'w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors',
                      value === o.value
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ==================== New Task Dialog ====================
function NewTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [taskType, setTaskType] = useState<'course' | 'practice' | 'hybrid'>('course')
  const [linkedItemId, setLinkedItemId] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState('')
  const [selectedDay, setSelectedDay] = useState('1')
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedVenueId, setSelectedVenueId] = useState('')

  const courseOptions = useMemo(
    () =>
      (trainingPrograms[0]?.courses ?? []).map((c) => ({
        value: c.id,
        label: `${c.name} (${c.code})`,
      })),
    []
  )

  const hybridOptions = useMemo(
    () =>
      (trainingPrograms[0]?.courses ?? []).filter((c) => c.nature === '混合式' || c.isHybrid).map((c) => ({
        value: c.id,
        label: `${c.name} (${c.code})`,
      })),
    []
  )

  const practiceOptions = useMemo(
    () =>
      curriculumPracticePool.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.code})`,
      })),
    []
  )

  const selectedItemVersion = useMemo(() => {
    const pool = taskType === 'course' ? curriculumCoursePool : taskType === 'hybrid' ? [] : curriculumPracticePool
    return pool.find((p) => p.id === linkedItemId)?.version
  }, [taskType, linkedItemId])

  const classOptions = useMemo(
    () => classes.map((c) => ({ value: c.id, label: c.name })),
    []
  )

  const facultyOptions = useMemo(
    () =>
      faculty.map((f) => ({
        value: f.id,
        label: `${f.name} (${f.title})`,
      })),
    []
  )

  const venueOptions = useMemo(
    () => venues.map((v) => ({ value: v.id, label: v.name })),
    []
  )

  // Reset linked item when task type changes
  useMemo(() => {
    setLinkedItemId('')
  }, [taskType])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            新建任务
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 py-2">
            {/* 任务类型 */}
            <div className="space-y-2">
              <Label>任务类型</Label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taskType"
                    checked={taskType === 'course'}
                    onChange={() => setTaskType('course')}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm">课程</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taskType"
                    checked={taskType === 'practice'}
                    onChange={() => setTaskType('practice')}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm">实践场景</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taskType"
                    checked={taskType === 'hybrid'}
                    onChange={() => setTaskType('hybrid')}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm">混合式课程</span>
                </label>
              </div>
            </div>

            {/* 关联课程/实践场景 */}
            <SearchableSelect
              label={`关联${taskType === 'course' ? '课程' : taskType === 'hybrid' ? '混合式课程' : '实践场景'}`}
              value={linkedItemId}
              onChange={setLinkedItemId}
              options={taskType === 'course' ? courseOptions : taskType === 'hybrid' ? hybridOptions : practiceOptions}
              placeholder={`请选择${taskType === 'course' ? '课程' : taskType === 'hybrid' ? '混合式课程' : '实践场景'}`}
            />
            {selectedItemVersion && (
              <div className="text-xs text-muted-foreground mt-1">
                版本号: <span className="font-medium text-foreground">{selectedItemVersion}</span>
              </div>
            )}

            {/* 参与班级 */}
            <SearchableSelect
              label="参与班级"
              value={selectedClassId}
              onChange={setSelectedClassId}
              options={classOptions}
              placeholder="请选择班级"
            />

            {/* 任课教师 */}
            <SearchableSelect
              label="任课教师"
              value={selectedFacultyId}
              onChange={setSelectedFacultyId}
              options={facultyOptions}
              placeholder="请选择教师"
            />

            {/* 节次 - 二级联动 */}
            <div className="space-y-2">
              <Label>星期</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">周一</SelectItem>
                  <SelectItem value="2">周二</SelectItem>
                  <SelectItem value="3">周三</SelectItem>
                  <SelectItem value="4">周四</SelectItem>
                  <SelectItem value="5">周五</SelectItem>
                  <SelectItem value="6">周六</SelectItem>
                  <SelectItem value="7">周日</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>节次（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {allPeriods.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPeriods((prev) =>
                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                      )
                    }}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-md border transition-colors',
                      selectedPeriods.includes(p)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 上课场地 */}
            <SearchableSelect
              label="上课场地"
              value={selectedVenueId}
              onChange={setSelectedVenueId}
              options={venueOptions}
              placeholder="请选择场地"
            />
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={() => {
              onClose()
              toast.success('任务创建成功')
            }}
          >
            创建任务
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== Edit Dialog ====================
function EditTaskDialog({
  open,
  onClose,
  task,
}: {
  open: boolean
  onClose: () => void
  task: Task | null
}) {
  const [taskType, setTaskType] = useState<'course' | 'practice' | 'hybrid'>('course')
  const [linkedItemId, setLinkedItemId] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState('')
  const [selectedDay, setSelectedDay] = useState('1')
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedVenueId, setSelectedVenueId] = useState('')

  const courseOptions = useMemo(
    () =>
      (trainingPrograms[0]?.courses ?? []).map((c) => ({
        value: c.id,
        label: `${c.name} (${c.code})`,
      })),
    []
  )

  const hybridOptions = useMemo(
    () =>
      (trainingPrograms[0]?.courses ?? []).filter((c) => c.nature === '混合式' || c.isHybrid).map((c) => ({
        value: c.id,
        label: `${c.name} (${c.code})`,
      })),
    []
  )

  const practiceOptions = useMemo(
    () =>
      curriculumPracticePool.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.code})`,
      })),
    []
  )

  const classOptions = useMemo(
    () => classes.map((c) => ({ value: c.id, label: c.name })),
    []
  )

  const facultyOptions = useMemo(
    () =>
      faculty.map((f) => ({
        value: f.id,
        label: `${f.name} (${f.title})`,
      })),
    []
  )

  const venueOptions = useMemo(
    () => venues.map((v) => ({ value: v.id, label: v.name })),
    []
  )

  // Reset state when task changes
  useMemo(() => {
    if (task) {
      const isScene = isSceneTask(task)
      const isHybrid = isHybridTask(task)
      setTaskType(isHybrid ? 'hybrid' : isScene ? 'practice' : 'course')
      setLinkedItemId(task.externalPlatformId ?? '')
      setSelectedClassId(task.classId)
      setSelectedFacultyId(task.facultyId)
      setSelectedDay(String(task.dayOfWeek))
      setSelectedPeriods(task.periods)
      setSelectedVenueId(task.venueId)
    }
  }, [task])

  const conflicts = task
    ? detectConflicts(
        task,
        tasks,
        Number(selectedDay),
        selectedPeriods,
        selectedVenueId,
        selectedFacultyId
      )
    : []
  const hasConflict = conflicts.length > 0

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            编辑任务 — {task.courseName}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 py-2">
            {/* 任务类型 */}
            <div className="space-y-2">
              <Label>任务类型</Label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editTaskType"
                    checked={taskType === 'course'}
                    onChange={() => setTaskType('course')}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm">课程</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editTaskType"
                    checked={taskType === 'practice'}
                    onChange={() => setTaskType('practice')}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm">实践场景</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="editTaskType"
                    checked={taskType === 'hybrid'}
                    onChange={() => setTaskType('hybrid')}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="text-sm">混合式课程</span>
                </label>
              </div>
            </div>

            {/* 关联课程/实践场景 */}
            <SearchableSelect
              label={`关联${taskType === 'course' ? '课程' : taskType === 'hybrid' ? '混合式课程' : '实践场景'}`}
              value={linkedItemId}
              onChange={setLinkedItemId}
              options={taskType === 'course' ? courseOptions : taskType === 'hybrid' ? hybridOptions : practiceOptions}
              placeholder={`请选择${taskType === 'course' ? '课程' : taskType === 'hybrid' ? '混合式课程' : '实践场景'}`}
            />

            {/* 课程版本号 */}
            <div className="space-y-2">
              <Label>课程版本号</Label>
              <Input value={task.courseVersion || '—'} readOnly className="bg-muted text-muted-foreground" />
            </div>

            {/* 参与班级 */}
            <SearchableSelect
              label="参与班级"
              value={selectedClassId}
              onChange={setSelectedClassId}
              options={classOptions}
              placeholder="请选择班级"
            />

            {/* 任课教师 */}
            <SearchableSelect
              label="任课教师"
              value={selectedFacultyId}
              onChange={setSelectedFacultyId}
              options={facultyOptions}
              placeholder="请选择教师"
            />

            {/* 节次 - 二级联动 */}
            <div className="space-y-2">
              <Label>星期</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">周一</SelectItem>
                  <SelectItem value="2">周二</SelectItem>
                  <SelectItem value="3">周三</SelectItem>
                  <SelectItem value="4">周四</SelectItem>
                  <SelectItem value="5">周五</SelectItem>
                  <SelectItem value="6">周六</SelectItem>
                  <SelectItem value="7">周日</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>节次（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {allPeriods.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPeriods((prev) =>
                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                      )
                    }}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-md border transition-colors',
                      selectedPeriods.includes(p)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 上课场地 */}
            <SearchableSelect
              label="上课场地"
              value={selectedVenueId}
              onChange={setSelectedVenueId}
              options={venueOptions}
              placeholder="请选择场地"
            />

            {/* 冲突检测 */}
            {hasConflict ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  检测到冲突（仍可保存）
                </div>
                <div className="text-xs text-red-600 space-y-1">
                  {conflicts.map((c, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                      {c.type === 'teacher' && `教师「${c.with}」在同一时段有「${c.taskName}」`}
                      {c.type === 'venue' && `场地「${c.with}」在同一时段有「${c.taskName}」`}
                      {c.type === 'class' && `班级「${c.with}」在同一时段有「${c.taskName}」`}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                当前安排无冲突
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={() => {
              onClose()
              toast.success('保存成功')
            }}
            variant={hasConflict ? 'destructive' : 'default'}
            className="gap-1"
          >
            {hasConflict && <AlertTriangle className="h-4 w-4" />}
            {hasConflict ? '强制保存' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== Sidebar Nav ====================
function SidebarNav({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string
  items: { id: string; label: string; badge?: string }[]
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="w-[220px] border rounded-lg bg-muted/20 flex flex-col shrink-0 h-fit max-h-[calc(100vh-240px)]">
      <div className="p-3 border-b font-medium text-sm">{title}</div>
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground text-center">暂无数据</div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors border-l-2',
                selected === item.id
                  ? 'bg-primary/10 text-primary border-l-primary font-medium'
                  : 'text-muted-foreground border-l-transparent hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-xs text-muted-foreground shrink-0">{item.badge}</span>
                )}
              </div>
            </button>
          ))
        )}
      </ScrollArea>
    </div>
  )
}

// ==================== Main Component ====================
export default function TaskOrchestrationTab({ selectedGrade }: { selectedGrade: string }) {
  // subTab removed, only timetable view remains
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'venue'>('class')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState('')
  const [selectedVenueId, setSelectedVenueId] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const totalWeeks = 16

  const gradeData = grades.find((g) => g.id === selectedGrade)
  const gradeClassIds = useMemo(
    () => (gradeData ? classes.filter((c) => c.gradeId === selectedGrade).map((c) => c.id) : []),
    [gradeData, selectedGrade]
  )
  const filteredTasks = useMemo(
    () => tasks.filter((t) => gradeClassIds.includes(t.classId)),
    [gradeClassIds]
  )

  // Auto-select first item when grade actually changes
  const prevGradeRef = useRef(selectedGrade)
  useEffect(() => {
    if (prevGradeRef.current === selectedGrade) return
    prevGradeRef.current = selectedGrade
    const firstClass = classes.find((c) => gradeClassIds.includes(c.id))
    if (firstClass) setSelectedClassId(firstClass.id)
    const firstFaculty = faculty.find((f) => filteredTasks.some((t) => t.facultyId === f.id))
    if (firstFaculty) setSelectedFacultyId(firstFaculty.id)
    const firstVenue = venues.find((v) => filteredTasks.some((t) => t.venueId === v.id))
    if (firstVenue) setSelectedVenueId(firstVenue.id)
  }, [selectedGrade, gradeClassIds, filteredTasks])

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  // Sidebar items with task counts
  const classItems = useMemo(
    () =>
      classes
        .filter((c) => gradeClassIds.includes(c.id))
        .map((c) => ({
          id: c.id,
          label: c.name,
          badge: `${filteredTasks.filter((t) => t.classId === c.id).length}节`,
        })),
    [gradeClassIds, filteredTasks]
  )

  const facultyItems = useMemo(
    () =>
      faculty
        .filter((f) => filteredTasks.some((t) => t.facultyId === f.id))
        .map((f) => ({
          id: f.id,
          label: `${f.name} (${f.title})`,
          badge: `${filteredTasks.filter((t) => t.facultyId === f.id).length}节`,
        })),
    [filteredTasks]
  )

  const venueItems = useMemo(
    () =>
      venues
        .filter((v) => filteredTasks.some((t) => t.venueId === v.id))
        .map((v) => ({
          id: v.id,
          label: v.name,
          badge: `${filteredTasks.filter((t) => t.venueId === v.id).length}节`,
        })),
    [filteredTasks]
  )

  // Auto-select first item when viewMode changes or current selection becomes invalid
  useEffect(() => {
    if (viewMode === 'class' && classItems.length > 0) {
      const valid = classItems.some((c) => c.id === selectedClassId)
      if (!valid) setSelectedClassId(classItems[0].id)
    } else if (viewMode === 'teacher' && facultyItems.length > 0) {
      const valid = facultyItems.some((f) => f.id === selectedFacultyId)
      if (!valid) setSelectedFacultyId(facultyItems[0].id)
    } else if (viewMode === 'venue' && venueItems.length > 0) {
      const valid = venueItems.some((v) => v.id === selectedVenueId)
      if (!valid) setSelectedVenueId(venueItems[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, classItems, facultyItems, venueItems])

  // Current selected tasks and title
  const currentTasks = useMemo(() => {
    if (viewMode === 'class') return filteredTasks.filter((t) => t.classId === selectedClassId)
    if (viewMode === 'teacher') return filteredTasks.filter((t) => t.facultyId === selectedFacultyId)
    return filteredTasks.filter((t) => t.venueId === selectedVenueId)
  }, [viewMode, filteredTasks, selectedClassId, selectedFacultyId, selectedVenueId])

  const currentTitle = useMemo(() => {
    if (viewMode === 'class') {
      const c = classes.find((x) => x.id === selectedClassId)
      return c ? `${c.name} (${c.studentCount}人)` : ''
    }
    if (viewMode === 'teacher') {
      const f = faculty.find((x) => x.id === selectedFacultyId)
      return f ? `${f.name} (${f.title})` : ''
    }
    const v = venues.find((x) => x.id === selectedVenueId)
    return v ? v.name : ''
  }, [viewMode, selectedClassId, selectedFacultyId, selectedVenueId])

  const sidebarProps = useMemo(() => {
    if (viewMode === 'class')
      return {
        title: '班级列表',
        items: classItems,
        selected: selectedClassId,
        onSelect: setSelectedClassId,
      }
    if (viewMode === 'teacher')
      return {
        title: '教师列表',
        items: facultyItems,
        selected: selectedFacultyId,
        onSelect: setSelectedFacultyId,
      }
    return {
      title: '场地列表',
      items: venueItems,
      selected: selectedVenueId,
      onSelect: setSelectedVenueId,
    }
  }, [viewMode, classItems, facultyItems, venueItems, selectedClassId, selectedFacultyId, selectedVenueId])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as 'class' | 'teacher' | 'venue')}
        >
          <TabsList>
            <TabsTrigger value="class">按班级查看</TabsTrigger>
            <TabsTrigger value="teacher">按教师查看</TabsTrigger>
            <TabsTrigger value="venue">按场地查看</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={() => toast.success('模板下载中...')}>
            <Download className="h-4 w-4" />
            下载模板
          </Button>
          <Button variant="outline" className="gap-1" onClick={() => setImportDialogOpen(true)}>
            <FileSpreadsheet className="h-4 w-4" />
            导入排课Excel
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <SidebarNav {...sidebarProps} />
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            {currentTitle && (
              <div className="font-medium text-sm text-muted-foreground">
                {currentTitle}
              </div>
            )}
            {/* 周次切换 */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentWeek <= 1}
                onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium min-w-[72px] text-center">
                第{currentWeek}周
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentWeek >= totalWeeks}
                onClick={() => setCurrentWeek((w) => Math.min(totalWeeks, w + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScheduleGrid
            taskList={currentTasks}
            allTasks={filteredTasks}
            onEditTask={handleEditTask}
            onCreateTask={() => setNewTaskDialogOpen(true)}
          />
        </div>
      </div>

      {/* 新建任务弹窗 */}
      <NewTaskDialog open={newTaskDialogOpen} onClose={() => setNewTaskDialogOpen(false)} />
      <ImportTaskDialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} />

      {/* 编辑弹窗 */}
      <EditTaskDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        task={selectedTask}
      />
    </div>
  )
}


// ==================== Import Task Dialog ====================
function ImportTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState('')
  const [previewCount, setPreviewCount] = useState(0)

  const handleParse = () => {
    if (!text.trim()) {
      toast.error('请输入数据')
      return
    }
    const lines = text.trim().split('\n').filter((l) => l.trim())
    setPreviewCount(lines.length)
    toast.success(`解析成功，共 ${lines.length} 条记录`)
  }

  const handleConfirm = () => {
    if (previewCount === 0) {
      toast.error('请先解析数据')
      return
    }
    toast.success(`成功导入 ${previewCount} 条排课记录`)
    onClose()
    setText('')
    setPreviewCount(0)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            导入排课Excel
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">数据格式</p>
            <p>每行一条排课记录，字段用逗号分隔：</p>
            <p className="font-mono bg-white border rounded px-2 py-1">班级名称, 课程名称, 教师姓名, 星期, 节次, 周次, 场地</p>
            <p>示例：</p>
            <p className="font-mono bg-white border rounded px-2 py-1">软件工程2026级1班, 程序设计基础, 周建国, 周一, 1-2, 1-16, 计算机楼A101</p>
          </div>
          <div className="space-y-2">
            <Label>粘贴Excel数据</Label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="在此粘贴排课数据..." rows={8} />
            <Button variant="outline" size="sm" onClick={handleParse}>
              <Upload className="h-3.5 w-3.5 mr-1" />
              解析数据
            </Button>
          </div>
          {previewCount > 0 && (
            <div className="rounded-lg border bg-green-50 p-2 text-xs text-green-700">
              已解析 {previewCount} 条记录，点击确认导入
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); setText(''); setPreviewCount(0) }}>取消</Button>
          <Button onClick={handleConfirm} disabled={previewCount === 0}>确认导入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
