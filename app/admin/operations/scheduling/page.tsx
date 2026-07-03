'use client'

import { useState, useMemo, useEffect } from 'react'
import * as XLSX from 'xlsx'
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
import VenuePeriodAlignmentTab, { type AlignmentState } from './_components/venue-period-alignment-tab'
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
  allPeriods,
  type Task,
  type ClassSchedule,
  type ClassPeriod,
  type CourseAssignment,
  courseAssignments,
  venueTypes as initialVenueTypes,
} from '@/lib/mock-data'

// ============================================
// 步骤导航组件
// ============================================
const steps = [
  { id: 'schedule', label: '教学节次配置', icon: Clock },
  { id: 'align', label: '场地节次对齐', icon: MapPin },
  { id: 'import', label: '导入排课结果', icon: FileSpreadsheet },
  { id: 'custom', label: '自定义排课', icon: Settings2 },
  { id: 'export', label: '课表同步推送', icon: Download },
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
      {allPeriods.map((p) => (
        <div key={p} className="grid grid-cols-6 border-t">
          <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{p}</div>
          {[1, 2, 3, 4, 5].map((d) => {
            const task = taskList.find((e) => e.dayOfWeek === d && e.periods.includes(p))
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
                          岗位
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
                    <SelectItem value="scene">岗位教学</SelectItem>
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
// Step 2: 导入排课结果
// ============================================
interface ParsedRow {
  rowIndex: number
  courseName: string
  className: string
  teacherName: string
  dayOfWeek: number
  periods: string[]
  weeks: string
  venueName: string
  type: Task['type']
  classId?: string
  facultyId?: string
  venueId?: string
  venueUnmapped: boolean
  periodUnmapped: boolean
  invalidReason?: string
}

function ImportScheduleTab({
  alignment,
  onImported,
  onRequestAlignment,
}: {
  alignment: AlignmentState
  onImported?: (tasks: Task[]) => void
  onRequestAlignment?: () => void
}) {
  const [imported, setImported] = useState(false)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])

  const excel = alignment.excel
  const headers = excel?.headers || []
  const rows = excel?.rows || []

  const [courseCol, setCourseCol] = useState('')
  const [classCol, setClassCol] = useState('')
  const [teacherCol, setTeacherCol] = useState('')
  const [dayCol, setDayCol] = useState('')
  const [periodCol, setPeriodCol] = useState(excel?.periodColumn || '')
  const [weeksCol, setWeeksCol] = useState('')
  const [venueCol, setVenueCol] = useState(excel?.venueColumn || '')
  const [natureCol, setNatureCol] = useState('')

  const detectColumn = (candidates: string[]) => {
    for (const h of headers) {
      const lower = h.toLowerCase()
      if (candidates.some((c) => lower.includes(c))) return h
    }
    return ''
  }

  useEffect(() => {
    if (!excel) {
      setParsedRows([])
      return
    }
    setCourseCol(detectColumn(['课程名', '课程名称', 'course']))
    setClassCol(detectColumn(['班级', '教学班', 'class']))
    setTeacherCol(detectColumn(['教师', '主讲教师', 'teacher', '老师']))
    setDayCol(detectColumn(['星期', '周几', '星期几', 'day']))
    setWeeksCol(detectColumn(['周次', '周数', 'weeks']))
    setNatureCol(detectColumn(['课程性质', '类型', 'nature', '性质']))
    setPeriodCol(excel.periodColumn || '')
    setVenueCol(excel.venueColumn || '')
    setParsedRows([])
  }, [excel])

  const dayToNumber = (val: string): number => {
    const map: Record<string, number> = {
      周一: 1, 星期二: 2, 周二: 2, 星期三: 3, 周三: 3,
      星期四: 4, 周四: 4, 星期五: 5, 周五: 5, 星期六: 6, 周六: 6,
      星期日: 7, 周日: 7, 星期天: 7,
    }
    const num = Number(val)
    if (!isNaN(num) && num >= 1 && num <= 7) return num
    return map[val.trim()] || 0
  }

  const parseNature = (val: string): Task['type'] => {
    const v = String(val || '').trim()
    if (v.includes('场景')) return 'scene'
    if (v.includes('实践') || v.includes('实验') || v.includes('实训')) return 'scene'
    return 'traditional'
  }

  const parseRows = () => {
    const getValue = (row: unknown[], col: string) => {
      const idx = headers.indexOf(col)
      if (idx < 0) return ''
      const val = row[idx]
      return val === undefined || val === null ? '' : String(val).trim()
    }

    const result: ParsedRow[] = []
    rows.forEach((row, idx) => {
      const courseName = getValue(row, courseCol)
      const className = getValue(row, classCol)
      const teacherName = getValue(row, teacherCol)
      const dayRaw = getValue(row, dayCol)
      const periodRaw = getValue(row, periodCol)
      const weeksRaw = getValue(row, weeksCol)
      const venueRaw = getValue(row, venueCol)
      const natureRaw = getValue(row, natureCol)

      if (!courseName && !className && !teacherName) return

      const dayOfWeek = dayToNumber(dayRaw)
      const periods = alignment.periodMapping[periodRaw] || []
      const venueId = alignment.venueMapping[venueRaw]
      const venue = alignment.venues.find((v) => v.id === venueId)
      const cls = classes.find((c) => c.name === className)
      const fac = faculty.find((f) => f.name === teacherName)

      const reasons: string[] = []
      if (!courseName) reasons.push('缺少课程名')
      if (!className) reasons.push('缺少班级')
      if (!teacherName) reasons.push('缺少教师')
      if (dayOfWeek === 0) reasons.push('星期无法识别')
      if (!weeksRaw) reasons.push('缺少周次')
      if (!cls) reasons.push(`班级未匹配: ${className}`)
      if (!fac) reasons.push(`教师未匹配: ${teacherName}`)

      result.push({
        rowIndex: idx + 2,
        courseName: courseName || '-',
        className: className || '-',
        teacherName: teacherName || '-',
        dayOfWeek,
        periods,
        weeks: weeksRaw ? (weeksRaw.endsWith('周') ? weeksRaw : `${weeksRaw}周`) : '-',
        venueName: venue?.name || venueRaw || '-',
        type: parseNature(natureRaw),
        classId: cls?.id,
        facultyId: fac?.id,
        venueId,
        venueUnmapped: !!venueRaw && !venueId,
        periodUnmapped: !!periodRaw && periods.length === 0,
        invalidReason: reasons.length > 0 ? reasons.join('；') : undefined,
      })
    })
    setParsedRows(result)
  }

  const validRows = parsedRows.filter(
    (r) => !r.venueUnmapped && !r.periodUnmapped && !r.invalidReason
  )

  const handleImport = () => {
    const generated: Task[] = validRows.map((r, i) => {
      const cls = classes.find((c) => c.id === r.classId)!
      const fac = faculty.find((f) => f.id === r.facultyId)!
      const venue = alignment.venues.find((v) => v.id === r.venueId)!
      return {
        id: `imported-${Date.now()}-${i}`,
        code: `T-${cls.code}-${Date.now()}-${i}`,
        name: `${cls.name}-${r.courseName}`,
        type: r.type,
        source: 'imported',
        status: 'draft',
        termId: 't1',
        courseName: r.courseName,
        classId: cls.id,
        className: cls.name,
        facultyId: fac.id,
        facultyName: fac.name,
        dayOfWeek: r.dayOfWeek,
        periods: r.periods,
        weeks: r.weeks,
        venueId: venue.id,
        venueName: venue.name,
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task
    })
    setImported(true)
    onImported?.(generated)
    toast.success(`成功导入 ${generated.length} 条排课记录`)
  }

  if (!excel) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              导入排课结果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-700 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">尚未上传排课 Excel</p>
                <p className="mt-1">请先在“场地节次对齐”步骤上传外部排课 Excel 并完成场地/节次映射。</p>
              </div>
            </div>
            <Button onClick={onRequestAlignment}>返回“场地节次对齐”</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            导入排课结果
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            数据来自对齐步骤上传的 <strong>{excel.fileName}</strong>（{rows.length} 行）。
            请确认其余列映射，系统将使用已保存的场地/节次对齐规则自动转换。
          </p>
          {imported && (
            <div className="rounded-lg border bg-green-50 p-4 text-sm text-green-700 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">导入成功</p>
                <p className="text-green-600 mt-1">请点击下方步骤导航的“下一步”，进入“自定义排课”继续调整。</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">列映射</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '课程名', value: courseCol, onChange: setCourseCol },
              { label: '班级', value: classCol, onChange: setClassCol },
              { label: '教师', value: teacherCol, onChange: setTeacherCol },
              { label: '星期', value: dayCol, onChange: setDayCol },
              { label: '节次（已对齐）', value: periodCol, onChange: setPeriodCol, disabled: true },
              { label: '周次', value: weeksCol, onChange: setWeeksCol },
              { label: '场地（已对齐）', value: venueCol, onChange: setVenueCol, disabled: true },
              { label: '课程性质', value: natureCol, onChange: setNatureCol },
            ].map((col) => (
              <div key={col.label} className="space-y-1.5">
                <Label className="text-xs">{col.label}</Label>
                <Select
                  value={col.value}
                  onValueChange={col.onChange}
                  disabled={col.disabled}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="选择列" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">不导入</SelectItem>
                    {headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button size="sm" onClick={parseRows}>
              解析预览
            </Button>
            <span className="text-xs text-muted-foreground">
              将根据“场地节次对齐”中的映射规则转换场地和节次
            </span>
          </div>
        </CardContent>
      </Card>

      {parsedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>导入预览</span>
              <div className="flex items-center gap-2 text-sm font-normal">
                <Badge variant="outline" className="text-green-600 border-green-300">
                  可导入 {validRows.length}
                </Badge>
                <Badge variant="outline" className="text-red-600 border-red-300">
                  异常 {parsedRows.length - validRows.length}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">行号</TableHead>
                    <TableHead>课程</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>教师</TableHead>
                    <TableHead>星期</TableHead>
                    <TableHead>节次</TableHead>
                    <TableHead>周次</TableHead>
                    <TableHead>场地</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((r) => {
                    const ok = !r.venueUnmapped && !r.periodUnmapped && !r.invalidReason
                    return (
                      <TableRow key={r.rowIndex}>
                        <TableCell className="text-xs text-muted-foreground">{r.rowIndex}</TableCell>
                        <TableCell>{r.courseName}</TableCell>
                        <TableCell>{r.className}</TableCell>
                        <TableCell>{r.teacherName}</TableCell>
                        <TableCell>{r.dayOfWeek > 0 ? ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'][r.dayOfWeek] : '-'}</TableCell>
                        <TableCell>{r.periods.join('、') || '-'}</TableCell>
                        <TableCell>{r.weeks}</TableCell>
                        <TableCell>{r.venueName}</TableCell>
                        <TableCell>{r.type === 'scene' ? '场景' : '传统'}</TableCell>
                        <TableCell>
                          {ok ? (
                            <Badge variant="outline" className="text-green-600 border-green-300">正常</Badge>
                          ) : (
                            <div className="space-y-1">
                              {r.venueUnmapped && <Badge variant="outline" className="text-red-600 border-red-300">场地未映射</Badge>}
                              {r.periodUnmapped && <Badge variant="outline" className="text-red-600 border-red-300">节次未映射</Badge>}
                              {r.invalidReason && <span className="text-xs text-red-600 block">{r.invalidReason}</span>}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {parsedRows.some((r) => r.venueUnmapped || r.periodUnmapped) && (
              <div className="rounded-lg border bg-amber-50 p-3 text-sm text-amber-700 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <p className="font-medium">存在未映射的场地或节次</p>
                  <p>请先返回“场地节次对齐”步骤补充映射规则。</p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                disabled={validRows.length === 0}
                onClick={handleImport}
              >
                确认导入（{validRows.length} 条）
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ============================================
// Step 4: 课表导出
// ============================================
function ExportTab({ selectedGrade }: { selectedGrade: string }) {
  const [exportType, setExportType] = useState('class')
  const [selectedDay, setSelectedDay] = useState<string>('all')
  const [showVersion, setShowVersion] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)
  const totalWeeks = 16

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
  const periods = allPeriods

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
                          {t.periods.join('、')} · {t.facultyName} · {t.venueName}
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
                    (t) => t.dayOfWeek === day && t.periods.includes(period)
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
        <div className="flex items-center gap-3 ml-auto">
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
          {/* 星期下拉 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">星期：</span>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {dayLabels.map((label, idx) => (
                  <SelectItem key={String(idx + 1)} value={String(idx + 1)}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 ml-2">
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
            <Button className="gap-1" onClick={() => toast('已生成开课任务表')}>
              <Download className="h-4 w-4" />
              生成开课任务表
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
function getProgramIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('programId')
}

export default function SchedulingCenterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [alignmentState, setAlignmentState] = useState<AlignmentState>({
    venues,
    venueTypes: initialVenueTypes,
    venueMapping: {},
    periodMapping: {},
  })
  const [importedTasks, setImportedTasks] = useState<Task[]>([])
  // 默认：计算机科学与技术学院 / 2029级 / 软件工程 / 全部学期
  const [selectedDept, setSelectedDept] = useState<string>('d1')
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g2029')
  const [selectedMajorId, setSelectedMajorId] = useState<string>('m1')
  const [selectedSemester, setSelectedSemester] = useState<string>('all')

  // 根据专业自动匹配培养方案（模拟对应关系）
  const matchedProgram = useMemo(() => {
    if (!selectedMajorId) return null
    const major = majors.find((m) => m.id === selectedMajorId)
    if (!major) return null
    const gradeData = grades.find((g) => g.id === selectedGradeId)
    return trainingPrograms.find((tp) => {
      return tp.majorId === selectedMajorId && (!gradeData || tp.entryYear === gradeData.entryYear)
    }) || trainingPrograms.find((tp) => tp.majorId === selectedMajorId) || null
  }, [selectedMajorId, selectedGradeId])

  const selectedGrade = useMemo(() => {
    return matchedProgram ? grades.find((g) => g.entryYear === matchedProgram.entryYear)?.id || '' : ''
  }, [matchedProgram])

  // 院系过滤专业
  const matchedMajors = useMemo(() => {
    if (!selectedDept) return []
    return majors.filter((m) => m.departmentId === selectedDept)
  }, [selectedDept])

  // 学期选项
  const semesterOptions = useMemo(() => {
    if (!matchedProgram) return []
    return Array.from({ length: matchedProgram.duration * 2 }, (_, i) => i + 1)
  }, [matchedProgram])

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">排课课表管理</h1>
          <p className="text-muted-foreground">排课课表管理：从节次配置到课表同步推送的统一工作区</p>
        </div>
        {matchedProgram && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('外部排课系统对接功能正在开发中')}>
              外部排课系统对接
            </Button>
          </div>
        )}
      </div>

      {/* 院系/年级/专业/学期联动选择器 */}
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
                  setSelectedMajorId('')
                  setSelectedSemester('all')
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
                  setSelectedMajorId('')
                  setSelectedSemester('all')
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
              <Label className="text-xs">选择专业</Label>
              <Select
                value={selectedMajorId}
                onValueChange={(v) => {
                  setSelectedMajorId(v)
                  setSelectedSemester('all')
                }}
                disabled={!selectedGradeId || matchedMajors.length === 0}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder={
                    !selectedGradeId
                      ? '先选年级'
                      : matchedMajors.length === 0
                        ? '无可用专业'
                        : '请选择专业'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {matchedMajors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">选择学期</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
                disabled={!selectedMajorId}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="全部学期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部学期</SelectItem>
                  {semesterOptions.map((s) => (
                    <SelectItem key={s} value={String(s)}>第{s}学期</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 步骤导航 */}
      {matchedProgram && (
        <StepNav currentStep={currentStep} onStepChange={setCurrentStep} />
      )}

      {/* 步骤内容 */}
      <div className="min-h-[400px]">
        {!matchedProgram ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <GraduationCap className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">请先选择院系、年级和专业</p>
            <p className="text-sm mt-1">依次选择院系、年级、专业和学期后开始排课</p>
          </div>
        ) : (
          <>
            {currentStep === 0 && <ClassScheduleTab />}
            {currentStep === 1 && <VenuePeriodAlignmentTab onChange={setAlignmentState} />}
            {currentStep === 2 && <ImportScheduleTab alignment={alignmentState} onImported={setImportedTasks} onRequestAlignment={() => setCurrentStep(1)} />}
            {currentStep === 3 && <TaskOrchestrationTab selectedGrade={selectedGrade} importedTasks={importedTasks} />}
            {currentStep === 4 && <ExportTab selectedGrade={selectedGrade} />}
          </>
        )}
      </div>
    </div>
  )
}
