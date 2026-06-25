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

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings2,
} from 'lucide-react'
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

function weekRangeIncludes(weeksStr: string, week: number): boolean {
  const match = weeksStr.match(/(\d+)-(\d+)周/)
  if (!match) return false
  const start = parseInt(match[1], 10)
  const end = parseInt(match[2], 10)
  return week >= start && week <= end
}

function findVenueConflict(
  currentTask: Task,
  allTasks: Task[],
  venueId: string,
  week: number,
  dayOfWeek: number,
  period: string
): Task | null {
  return (
    allTasks.find((t) => {
      if (t.id === currentTask.id) return false
      if (t.venueId !== venueId) return false
      if (t.dayOfWeek !== dayOfWeek) return false
      if (!t.periods.includes(period)) return false
      return weekRangeIncludes(t.weeks, week)
    }) || null
  )
}

function isSceneTask(task: Task) {
  return task.type === 'scene' || task.externalPlatformType === 'scene'
}

// ==================== Schedule Grid ====================
function ScheduleGrid({
  taskList,
  onEditTask,
  onCreateTask,
}: {
  taskList: Task[]
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
                      scene
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
                      {scene && (
                        <Badge variant="outline" className="text-[10px] h-4 border-orange-300 text-orange-600">
                          岗位
                        </Badge>
                      )}
                      {!scene && (
                        <Badge variant="outline" className="text-[10px] h-4 border-blue-300 text-blue-600">
                          课程
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
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  label: string
  disabled?: boolean
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

  const trigger = (
    <Button
      variant="outline"
      disabled={disabled}
      className={cn(
        'w-full justify-between font-normal bg-background hover:bg-accent',
        disabled && 'cursor-not-allowed opacity-60 hover:bg-background'
      )}
    >
      <span className={cn('truncate', !selected && 'text-muted-foreground')}>
        {selected ? selected.label : placeholder}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
    </Button>
  )

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {disabled ? (
        trigger
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {trigger}
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
      )}
    </div>
  )
}

// ==================== New Task Dialog ====================
function NewTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [taskType, setTaskType] = useState<'course' | 'practice'>('course')
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

  const practiceOptions = useMemo(
    () =>
      curriculumPracticePool.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.code})`,
      })),
    []
  )

  const selectedItemVersion = useMemo(() => {
    const pool = taskType === 'course' ? curriculumCoursePool : curriculumPracticePool
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
                  <span className="text-sm">岗位</span>
                </label>
              </div>
            </div>

            {/* 关联课程/岗位 */}
            <SearchableSelect
              label={`关联${taskType === 'course' ? '课程' : '岗位'}`}
              value={linkedItemId}
              onChange={setLinkedItemId}
              options={taskType === 'course' ? courseOptions : practiceOptions}
              placeholder={`请选择${taskType === 'course' ? '课程' : '岗位'}`}
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

// ==================== View Dialog ====================
function EditTaskDialog({
  open,
  onClose,
  task,
  allTasks,
  onAdjust,
}: {
  open: boolean
  onClose: () => void
  task: Task | null
  allTasks: Task[]
  onAdjust: (removedTaskId: string, newTask: Task) => void
}) {
  const [adjustOpen, setAdjustOpen] = useState(false)

  useEffect(() => {
    if (!open) setAdjustOpen(false)
  }, [open])

  if (!task) return null

  const isScene = isSceneTask(task)

  const viewRows = [
    { label: '课时类型', value: <Badge variant={isScene ? 'outline' : 'default'} className={cn('text-xs h-5', isScene && 'border-orange-300 text-orange-600')}>{isScene ? '岗位' : '课程'}</Badge> },
    { label: `关联${isScene ? '岗位' : '课程'}`, value: (isScene
      ? curriculumPracticePool.find((p) => p.id === task.externalPlatformId)?.name
      : trainingPrograms[0]?.courses.find((c) => c.id === task.externalPlatformId)?.name) ?? task.courseName },
    { label: '参与班级', value: classes.find((c) => c.id === task.classId)?.name ?? task.className },
    { label: '任课教师', value: (() => {
      const f = faculty.find((x) => x.id === task.facultyId)
      return f ? `${f.name} (${f.title})` : task.facultyName
    })() },
    { label: '时间', value: `${days[task.dayOfWeek - 1] ?? `周${task.dayOfWeek}`} ${task.periods.join('、')}` },
    { label: '上课场地', value: venues.find((v) => v.id === task.venueId)?.name ?? task.venueName },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              查看课时 — {task.courseName}
            </DialogTitle>
          </DialogHeader>

          <div className="border rounded-lg overflow-hidden text-sm">
            {viewRows.map((row, idx) => (
              <div
                key={row.label}
                className={cn(
                  'grid grid-cols-[88px_1fr] items-center',
                  idx < viewRows.length - 1 && 'border-b'
                )}
              >
                <div className="bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground h-full flex items-center">
                  {row.label}
                </div>
                <div className="px-3 py-2">{row.value}</div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setAdjustOpen(true)}>
              排课调整
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdjustTaskDialog
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        task={task}
        allTasks={allTasks}
        onConfirm={(removedTaskId, newTask) => {
          onAdjust(removedTaskId, newTask)
          setAdjustOpen(false)
          onClose()
        }}
      />
    </>
  )
}

// ==================== Adjust Dialog ====================
function findPositionConflict(
  currentTask: Task,
  allTasks: Task[],
  venueId: string,
  week: number,
  dayOfWeek: number,
  period: string
): { type: 'venue' | 'teacher' | 'class'; with: string; taskName: string } | null {
  return (
    allTasks
      .filter((t) => {
        if (t.id === currentTask.id) return false
        if (t.dayOfWeek !== dayOfWeek) return false
        if (!t.periods.includes(period)) return false
        if (!weekRangeIncludes(t.weeks, week)) return false
        return t.venueId === venueId || t.facultyId === currentTask.facultyId || t.classId === currentTask.classId
      })
      .map((t) => {
        if (t.venueId === venueId) return { type: 'venue' as const, with: t.venueName, taskName: t.courseName }
        if (t.facultyId === currentTask.facultyId) return { type: 'teacher' as const, with: t.facultyName, taskName: t.courseName }
        return { type: 'class' as const, with: t.className, taskName: t.courseName }
      })[0] || null
  )
}

function AdjustTaskDialog({
  open,
  onClose,
  task,
  allTasks,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  task: Task
  allTasks: Task[]
  onConfirm: (removedTaskId: string, newTask: Task) => void
}) {
  const [venueId, setVenueId] = useState(task.venueId)
  const [week, setWeek] = useState(1)
  const [dayOfWeek, setDayOfWeek] = useState(task.dayOfWeek)
  const [period, setPeriod] = useState(task.periods[0] || allPeriods[0])

  useEffect(() => {
    if (open) {
      setVenueId(task.venueId)
      setWeek(1)
      setDayOfWeek(task.dayOfWeek)
      setPeriod(task.periods[0] || allPeriods[0])
    }
  }, [open, task])

  const selectedVenue = venues.find((v) => v.id === venueId)

  const venueItems = useMemo(
    () =>
      venues.map((v) => ({
        id: v.id,
        label: v.name,
        badge: `${allTasks.filter((t) => t.venueId === v.id && weekRangeIncludes(t.weeks, week)).length}节`,
      })),
    [allTasks, week]
  )

  const venueTasks = useMemo(
    () => allTasks.filter((t) => t.venueId === venueId && weekRangeIncludes(t.weeks, week)),
    [allTasks, venueId, week]
  )

  const conflict = useMemo(
    () => findPositionConflict(task, allTasks, venueId, week, dayOfWeek, period),
    [task, allTasks, venueId, week, dayOfWeek, period]
  )

  const isCurrentPosition =
    venueId === task.venueId && dayOfWeek === task.dayOfWeek && period === task.periods[0] && weekRangeIncludes(task.weeks, week)

  const handleCellClick = (d: number, p: string, occupied: boolean) => {
    if (occupied) return
    setDayOfWeek(d)
    setPeriod(p)
  }

  const handleConfirm = () => {
    if (conflict) {
      const typeLabel = { venue: '场地', teacher: '教师', class: '班级' }[conflict.type]
      toast.error(`目标日期与${typeLabel}已有 ${conflict.taskName} 排课安排，请重新选择`)
      return
    }
    const newTask: Task = {
      ...task,
      id: `task-adjusted-${Date.now()}`,
      venueId,
      venueName: selectedVenue?.name || task.venueName,
      dayOfWeek,
      periods: [period],
      weeks: `${week}-${week}周`,
    }
    onConfirm(task.id, newTask)
    toast.success('排课调整成功')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            排课调整 — 选择目标场地与时段
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex gap-4 px-6 pb-2 overflow-hidden">
          {/* 场地列表 */}
          <div className="w-[220px] border rounded-lg bg-muted/20 flex flex-col shrink-0 min-h-0">
            <div className="p-3 border-b font-medium text-sm">场地列表</div>
            <ScrollArea className="flex-1">
              {venueItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setVenueId(item.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 text-sm transition-colors border-l-2',
                    venueId === item.id
                      ? 'bg-primary/10 text-primary border-l-primary font-medium'
                      : 'text-muted-foreground border-l-transparent hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{item.label}</span>
                    {item.badge && <span className="text-xs text-muted-foreground shrink-0">{item.badge}</span>}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* 场地课表 */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-foreground">{selectedVenue?.name}</span>
                <span className="text-xs">({selectedVenue?.type} · 容量{selectedVenue?.capacity}人)</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={week <= 1}
                  onClick={() => setWeek((w) => Math.max(1, w - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium min-w-[72px] text-center">第{week}周</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={week >= 16}
                  onClick={() => setWeek((w) => Math.min(16, w + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 border rounded-lg">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-8 bg-muted sticky top-0 z-10">
                  <div className="p-2 text-sm font-medium border-r">节次 / 星期</div>
                  {days.map((d) => (
                    <div key={d} className="p-2 text-sm font-medium text-center border-r last:border-r-0">
                      {d}
                    </div>
                  ))}
                </div>
                {allPeriods.map((p) => (
                  <div key={p} className="grid grid-cols-8 border-t">
                    <div className="p-2 text-xs text-muted-foreground border-r bg-muted/30 flex items-center">{p}</div>
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                      const cellTask = venueTasks.find((t) => t.dayOfWeek === d && t.periods.includes(p))
                      const isSelected = dayOfWeek === d && period === p && !cellTask
                      const isCurrent = isCurrentPosition && task.dayOfWeek === d && task.periods.includes(p)
                      const cellConflict = !cellTask
                        ? findPositionConflict(task, allTasks, venueId, week, d, p)
                        : null
                      return (
                        <div
                          key={d}
                          className={cn(
                            'p-1.5 border-r last:border-r-0 min-h-[72px]',
                            !cellTask && 'bg-muted/20'
                          )}
                        >
                          {cellTask ? (
                            <div
                              className={cn(
                                'w-full h-full rounded p-2 text-xs space-y-1',
                                isSceneTask(cellTask)
                                  ? 'bg-orange-50 border border-orange-200'
                                  : 'bg-blue-50 border border-blue-200',
                                isCurrent && 'ring-2 ring-primary'
                              )}
                            >
                              <div className="font-medium truncate">{cellTask.courseName}</div>
                              <div className="text-[10px] text-muted-foreground">{cellTask.facultyName}</div>
                              <div className="text-[10px] text-muted-foreground">{cellTask.className}</div>
                              {isCurrent && (
                                <Badge variant="outline" className="text-[10px] h-4 border-primary text-primary">
                                  当前
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleCellClick(d, p, false)}
                              className={cn(
                                'w-full h-full min-h-[56px] rounded border border-dashed flex flex-col items-center justify-center gap-1 transition-all',
                                isSelected
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : cellConflict
                                    ? 'border-red-300 bg-red-50/50 text-red-500 hover:bg-red-50'
                                    : 'border-muted-foreground/20 text-muted-foreground/40 hover:border-primary/40 hover:text-primary/60'
                              )}
                            >
                              {isSelected ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="text-[10px]">已选择</span>
                                </>
                              ) : cellConflict ? (
                                <>
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="text-[10px]">冲突</span>
                                </>
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border border-dashed border-primary bg-primary/10" />
                <span>已选目标位置</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border border-dashed border-red-300 bg-red-50" />
                <span>与教师/班级/场地冲突</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" />
                <span>已有课程</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-orange-50 border border-orange-200" />
                <span>已有岗位</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm min-w-0">
              <span className="text-muted-foreground">已选择位置：</span>
              <span className="font-medium break-words">
                第{week}周 · {days[dayOfWeek - 1]} · {period} · {selectedVenue?.name}
              </span>
              {conflict && (
                <span className="ml-3 text-xs text-red-600">
                  与{conflict.type === 'venue' ? '场地' : conflict.type === 'teacher' ? '教师' : '班级'}“{conflict.with}”的 {conflict.taskName} 冲突
                </span>
              )}
              {isCurrentPosition && !conflict && (
                <span className="ml-3 text-xs text-primary">当前课程已处于该位置</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button onClick={handleConfirm} disabled={!!conflict || isCurrentPosition}>
                确认调整
              </Button>
            </div>
          </div>
        </div>
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
  // 固定按场地查看，不再切换视图
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'venue'>('venue')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState('')
  const [selectedVenueId, setSelectedVenueId] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks)
  const totalWeeks = 16

  const gradeData = grades.find((g) => g.id === selectedGrade)
  const gradeClassIds = useMemo(
    () => (gradeData ? classes.filter((c) => c.gradeId === selectedGrade).map((c) => c.id) : []),
    [gradeData, selectedGrade]
  )
  const filteredTasks = useMemo(() => {
    const matched = localTasks.filter((t) => gradeClassIds.includes(t.classId))
    // Stable pseudo-random shuffle so courses and scenes are scattered visually
    const hash = (str: string) => {
      let h = 0
      for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0
      }
      return h
    }
    return [...matched].sort((a, b) => hash(a.id) - hash(b.id))
  }, [gradeClassIds, localTasks])

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

  const handleAdjustTask = (removedTaskId: string, newTask: Task) => {
    setLocalTasks((prev) => [...prev.filter((t) => t.id !== removedTaskId), newTask])
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
            onEditTask={handleEditTask}
            onCreateTask={() => setNewTaskDialogOpen(true)}
          />
        </div>
      </div>

      {/* 新建任务弹窗 */}
      <NewTaskDialog open={newTaskDialogOpen} onClose={() => setNewTaskDialogOpen(false)} />

      {/* 编辑弹窗 */}
      <EditTaskDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        task={selectedTask}
        allTasks={localTasks}
        onAdjust={handleAdjustTask}
      />
    </div>
  )
}
