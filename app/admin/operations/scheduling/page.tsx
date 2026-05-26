'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ClassScheduleTab from './_components/class-schedule-tab'
import CourseManagementTab from './_components/course-management-tab'
import TeachingPlanTab from './_components/teaching-plan-tab'
import TaskOrchestrationTab from './_components/task-orchestration-tab'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
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
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  Sun,
  Moon,
  Utensils,
  BookOpen,
  Users,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileSpreadsheet,
  Play,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  Eye,
  MapPin,
  Layers,
  BarChart3,
  Download,
  Search,
  X,
} from 'lucide-react'
import {
  classSchedules,
  classes,
  faculty,
  venues,
  departments,
  majors,
  grades,
  coursePool,
  teachingPlans,
  trainingPrograms,
  tasks,
  type Task,
  type ClassSchedule,
  type ClassPeriod,
  type CourseAssignment,
  courseAssignments,
} from '@/lib/mock-data'

// ============================================
// 步骤导航组件
// ============================================
const steps = [
  { id: 'schedule', label: '班级作息', icon: Clock },
  { id: 'courses', label: '课程管理', icon: BookOpen },
  { id: 'plan', label: '教学计划', icon: Layers },
  { id: 'orchestration', label: '任务编排', icon: Settings2 },
  { id: 'export', label: '课表导出', icon: Download },
]

function StepNav({
  currentStep,
  onStepChange,
}: {
  currentStep: number
  onStepChange: (step: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepChange(index)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : isCompleted
                    ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                    : 'bg-background text-muted-foreground border-muted hover:border-muted-foreground/30'
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  isActive
                    ? 'bg-white text-primary'
                    : isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// Step 2: 课程管理
// ============================================
// ============================================
// Step 4: 教师安排
// ============================================
// ============================================
// Step 4: 任务编排
// ============================================
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const periods = ['1-2节', '3-4节', '5-6节', '7-8节']

function detectConflicts(
  task: Task,
  allTasks: Task[],
  newDayOfWeek?: number,
  newPeriod?: string,
  newVenueId?: string,
  newFacultyId?: string
) {
  const conflicts: { type: 'teacher' | 'venue' | 'class'; with: string; taskName: string }[] = []
  const targetDay = newDayOfWeek ?? task.dayOfWeek
  const targetPeriod = newPeriod ?? task.period
  const targetVenue = newVenueId ?? task.venueId
  const targetFaculty = newFacultyId ?? task.facultyId
  const targetClass = task.classId

  for (const t of allTasks) {
    if (t.id === task.id) continue
    if (t.dayOfWeek !== targetDay || t.period !== targetPeriod) continue

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

function ScheduleGrid({
  taskList,
  allTasks,
  onEditTask,
}: {
  taskList: Task[]
  allTasks: Task[]
  onEditTask: (task: Task) => void
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-6 bg-muted">
        <div className="p-3 text-sm font-medium border-r">节次 / 星期</div>
        {days.map((d) => (
          <div key={d} className="p-3 text-sm font-medium text-center border-r last:border-r-0">
            {d}
          </div>
        ))}
      </div>
      {periods.map((p) => (
        <div key={p} className="grid grid-cols-6 border-t">
          <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{p}</div>
          {[1, 2, 3, 4, 5].map((d) => {
            const task = taskList.find((e) => e.dayOfWeek === d && e.period === p)
            const conflicts = task ? detectConflicts(task, allTasks) : []
            const hasConflict = conflicts.length > 0
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
                        : task.type === 'scene'
                          ? 'bg-orange-50 border border-orange-100'
                          : 'bg-primary/5 border border-transparent'
                    )}
                  >
                    <div className="font-medium truncate">{task.courseName}</div>
                    <div className="text-muted-foreground">{task.facultyName}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {task.venueName}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {task.type === 'scene' && (
                        <Badge variant="outline" className="text-[10px] h-4 border-orange-200 text-orange-600">
                          场景
                        </Badge>
                      )}
                      {hasConflict && (
                        <Badge variant="outline" className="text-[10px] h-4 border-red-200 text-red-600">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                          冲突
                        </Badge>
                      )}
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-full min-h-[60px] rounded border border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground/30">
                    <Plus className="h-4 w-4" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ---- 课程暂放区组件 ----
function CourseStagingArea() {
  const [stagingTab, setStagingTab] = useState<'pending' | 'completed' | 'over'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  // 计算各班级各课程的已排课时
  const scheduledHoursMap = useMemo(() => {
    const map = new Map<string, number>() // key: `${classId}-${courseName}`
    tasks.forEach((t) => {
      const key = `${t.classId}-${t.courseName}`
      // 每个任务占2节课（假设1-2节等是2课时）
      map.set(key, (map.get(key) || 0) + 2)
    })
    return map
  }, [])

  // 待排：有教学计划但还没有任何任务的班级-课程
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

  // 已排完：已排课时 >= 计划课时
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

  // 超课时：已排课时 > 计划课时
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
      {/* 暂放区头部 */}
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

      {/* 分类标签 */}
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

      {/* 内容区 */}
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

// ---- 新建任务弹窗 ----
function NewTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            新建任务
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>课程名称</Label>
                <Input placeholder="输入课程名称" />
              </div>
              <div className="space-y-2">
                <Label>课程编码</Label>
                <Input placeholder="输入课程编码" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>任务类型</Label>
                <Select defaultValue="traditional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">传统教学</SelectItem>
                    <SelectItem value="scene">场景教学</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>班级</Label>
                <Select>
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
            </div>
            <div className="space-y-2">
              <Label>主讲教师</Label>
              <Select>
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>星期</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">周一</SelectItem>
                    <SelectItem value="2">周二</SelectItem>
                    <SelectItem value="3">周三</SelectItem>
                    <SelectItem value="4">周四</SelectItem>
                    <SelectItem value="5">周五</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>节次</Label>
                <Select defaultValue="1-2节">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2节">1-2节</SelectItem>
                    <SelectItem value="3-4节">3-4节</SelectItem>
                    <SelectItem value="5-6节">5-6节</SelectItem>
                    <SelectItem value="7-8节">7-8节</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>周次</Label>
                <Input defaultValue="1-16周" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>上课场地</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择场地" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>教学目标</Label>
              <Textarea placeholder="输入教学目标或任务说明..." rows={3} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>创建任务</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Step 5: 课表导出
// ============================================
function ExportTab({ selectedGrade }: { selectedGrade: string }) {
  const [exportType, setExportType] = useState('class')
  const [selectedDay, setSelectedDay] = useState<string>('all')
  const [showVersion, setShowVersion] = useState(false)

  const gradeData = grades.find((g) => g.id === selectedGrade)
  const gradeClasses = gradeData
    ? classes.filter((c) => c.gradeId === selectedGrade)
    : []
  const gradeClassIds = gradeClasses.map((c) => c.id)
  const gradeTasks = tasks.filter((t) => gradeClassIds.includes(t.classId))

  const exportTypes = [
    { id: 'class', label: '班级课表' },
    { id: 'teacher', label: '教师课表' },
    { id: 'venue', label: '教室课表' },
  ]

  const dayOptions = ['all', '1', '2', '3', '4', '5', '6', '7']
  const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const periods = ['1-2节', '3-4节', '5-6节', '7-8节']

  const days = selectedDay === 'all' ? [1, 2, 3, 4, 5, 6, 7] : [Number(selectedDay)]

  // ---- 总课表：按班级聚合，每天显示所有课程 ----
  const totalTable = (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="grid bg-muted"
        style={{ gridTemplateColumns: `140px repeat(${days.length}, 1fr)` }}
      >
        <div className="p-3 text-sm font-medium border-r">班级</div>
        {days.map((d) => (
          <div
            key={d}
            className="p-3 text-sm font-medium text-center border-r last:border-r-0"
          >
            {dayLabels[d - 1]}
          </div>
        ))}
      </div>
      {gradeClasses.map((cls) => {
        const clsTasks = gradeTasks.filter((t) => t.classId === cls.id)
        return (
          <div
            key={cls.id}
            className="grid border-t"
            style={{ gridTemplateColumns: `140px repeat(${days.length}, 1fr)` }}
          >
            <div className="p-3 text-sm font-medium border-r bg-muted/20">{cls.name}</div>
            {days.map((d) => {
              const dayTasks = clsTasks.filter((t) => t.dayOfWeek === d)
              return (
                <div key={d} className="p-2 border-r last:border-r-0 min-h-[60px]">
                  <div className="space-y-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className={cn(
                          'text-xs rounded px-2 py-1 space-y-0.5',
                          t.type === 'scene'
                            ? 'bg-orange-50 border border-orange-100'
                            : 'bg-blue-50 border border-blue-100'
                        )}
                      >
                        <div className="font-medium">{t.courseName}</div>
                        <div className="text-muted-foreground text-[10px]">
                          {t.period} · {t.facultyName} · {t.venueName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )

  // ---- 周期课表（班级/教师/场地共用）----
  const renderPeriodTable = (
    items: { id: string; name: string }[],
    getTasks: (id: string) => typeof tasks,
    nameLabel: string
  ) => (
    <div className="border rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full border-collapse text-sm min-w-[600px]">
        <thead>
          <tr className="bg-muted">
            <th className="border p-3 text-left font-medium w-[140px]">{nameLabel}</th>
            <th className="border p-3 text-center font-medium w-[72px]">节次</th>
            {days.map((d) => (
              <th key={d} className="border p-3 text-center font-medium">
                {dayLabels[d - 1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const itemTasks = getTasks(item.id)
            return periods.map((period, idx) => (
              <tr key={`${item.id}-${period}`} className="border-t">
                {idx === 0 && (
                  <td
                    rowSpan={periods.length}
                    className="border p-3 font-medium align-middle text-center bg-muted/20"
                  >
                    {item.name}
                  </td>
                )}
                <td className="border p-2 text-center text-muted-foreground text-xs bg-muted/10">
                  {period}
                </td>
                {days.map((day) => {
                  const task = itemTasks.find(
                    (t) => t.dayOfWeek === day && t.period === period
                  )
                  return (
                    <td key={day} className="border p-2 min-w-[120px] align-top">
                      {task ? (
                        <div
                          className={cn(
                            'text-xs rounded px-2 py-1 space-y-0.5',
                            task.type === 'scene'
                              ? 'bg-orange-50 border border-orange-100'
                              : 'bg-blue-50 border border-blue-100'
                          )}
                        >
                          <div className="font-medium truncate">{task.courseName}</div>
                          {showVersion && (
                            <div className="text-[10px] text-blue-600">{task.courseVersion}</div>
                          )}
                          <div className="text-muted-foreground">{task.facultyName}</div>
                          <div className="text-muted-foreground text-[10px]">
                            {task.venueName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/20 text-xs">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))
          })}
        </tbody>
      </table>
    </div>
  )

  // 班级课表
  const classItems = gradeClasses.map((c) => ({ id: c.id, name: c.name }))
  const classTable = renderPeriodTable(
    classItems,
    (id) => gradeTasks.filter((t) => t.classId === id),
    '班级名称'
  )

  // 教师课表
  const teacherItems = faculty
    .filter((f) => gradeTasks.some((t) => t.facultyId === f.id))
    .map((f) => ({ id: f.id, name: `${f.name} (${f.title})` }))
  const teacherTable = renderPeriodTable(
    teacherItems,
    (id) => gradeTasks.filter((t) => t.facultyId === id),
    '教师名称'
  )

  // 场地课表
  const venueItems = venues
    .filter((v) => gradeTasks.some((t) => t.venueId === v.id))
    .map((v) => ({ id: v.id, name: v.name }))
  const venueTable = renderPeriodTable(
    venueItems,
    (id) => gradeTasks.filter((t) => t.venueId === id),
    '场地名称'
  )

  const currentTable =
    {
      class: classTable,
      teacher: teacherTable,
      venue: venueTable,
    }[exportType] || classTable

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">课表类型：</span>
          {exportTypes.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={exportType === t.id ? 'default' : 'outline'}
              onClick={() => setExportType(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium">星期：</span>
          {dayOptions.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={selectedDay === d ? 'default' : 'outline'}
              onClick={() => setSelectedDay(d)}
            >
              {d === 'all' ? '全部' : `周${dayLabels[Number(d) - 1].replace('周', '')}`}
            </Button>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <Switch
              id="show-version"
              checked={showVersion}
              onCheckedChange={setShowVersion}
            />
            <Label htmlFor="show-version" className="text-sm font-medium cursor-pointer">
              显示版本号
            </Label>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {exportTypes.find((t) => t.id === exportType)?.label}预览
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="输入名称查询" className="w-[200px]" />
            <Button className="gap-1" onClick={() => toast('导出Excel成功')}>
              <Download className="h-4 w-4" />
              导出Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>{currentTable}</CardContent>
      </Card>
    </div>
  )
}

// ============================================
// 主页面
// ============================================
export default function SchedulingCenterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDept, setSelectedDept] = useState<string>('')
  const [selectedGradeId, setSelectedGradeId] = useState<string>('')
  const [selectedProgramId, setSelectedProgramId] = useState<string>('')

  const selectedProgram = trainingPrograms.find((tp) => tp.id === selectedProgramId)
  const selectedGrade = selectedProgram
    ? grades.find((g) => g.entryYear === selectedProgram.entryYear)?.id || ''
    : ''

  // 根据当前选中的院系和年级过滤培养方案
  const matchedPrograms = useMemo(() => {
    if (!selectedDept || !selectedGradeId) return []
    const gradeData = grades.find((g) => g.id === selectedGradeId)
    if (!gradeData) return []
    return trainingPrograms.filter((tp) => {
      const major = majors.find((m) => m.id === tp.majorId)
      return major?.departmentId === selectedDept && tp.entryYear === gradeData.entryYear
    })
  }, [selectedDept, selectedGradeId])

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">排课中心</h1>
          <p className="text-muted-foreground">排课全流程管理：从班级作息到课表导出的统一工作区</p>
        </div>
        {selectedProgram && (
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button size="sm" onClick={() => setCurrentStep(currentStep + 1)}>
                下一步
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 院系/年级/培养方案联动选择器 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-1">
              <Label className="text-xs">选择院系</Label>
              <Select
                value={selectedDept}
                onValueChange={(v) => {
                  setSelectedDept(v)
                  setSelectedGradeId('')
                  setSelectedProgramId('')
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="请选择院系" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">选择年级</Label>
              <Select
                value={selectedGradeId}
                onValueChange={(v) => {
                  setSelectedGradeId(v)
                  setSelectedProgramId('')
                }}
                disabled={!selectedDept}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={selectedDept ? '请选择年级' : '先选院系'} />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">选择培养方案</Label>
              <Select
                value={selectedProgramId}
                onValueChange={setSelectedProgramId}
                disabled={!selectedGradeId || matchedPrograms.length === 0}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder={
                    !selectedGradeId
                      ? '先选年级'
                      : matchedPrograms.length === 0
                        ? '无可用方案'
                        : '请选择培养方案'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {matchedPrograms.map((tp) => (
                    <SelectItem key={tp.id} value={tp.id}>{tp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 步骤导航 */}
      {selectedProgram && (
        <StepNav currentStep={currentStep} onStepChange={setCurrentStep} />
      )}

      {/* 步骤内容 */}
      <div className="min-h-[400px]">
        {!selectedProgram ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <GraduationCap className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">请先选择培养方案</p>
            <p className="text-sm mt-1">依次选择院系、年级和培养方案后开始排课</p>
          </div>
        ) : (
          <>
            {currentStep === 0 && <ClassScheduleTab />}
            {currentStep === 1 && <CourseManagementTab selectedGrade={selectedGrade} />}
            {currentStep === 2 && <TeachingPlanTab selectedDept={selectedDept} selectedGrade={selectedGrade} />}
            {currentStep === 3 && <TaskOrchestrationTab selectedGrade={selectedGrade} />}
            {currentStep === 4 && <ExportTab selectedGrade={selectedGrade} />}
          </>
        )}
      </div>
    </div>
  )
}
