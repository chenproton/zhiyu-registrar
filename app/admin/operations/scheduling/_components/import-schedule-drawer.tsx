'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
  Upload,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  BookOpen,
  Users,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { classes, coursePool, faculty, type Task, type Venue } from '@/lib/mock-data'

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

interface ImportScheduleDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venues: Venue[]
  venueTypes: string[]
  periods: string[]
  onImported?: (tasks: Task[]) => void
}

const MOCK_HEADERS = [
  '课程名称',
  '教学班',
  '主讲教师',
  '星期',
  '节次',
  '周次',
  '场地',
  '课程性质',
]

const MOCK_EXTERNAL_VENUES = ['A101', 'B201', 'C101']
const MOCK_EXTERNAL_PERIODS = ['1-2节', '3-4节', '5-6节']

const CLASS_POOL = classes.filter((c) => c.gradeId === 'g2026').slice(0, 3)
const TEACHER_POOL = faculty.slice(0, 5)

const MOCK_COURSES = [
  '计算机网络技术',
  'Web前端开发',
  'Java程序设计',
  '数据库原理与应用',
  'Linux操作系统',
  '网络综合布线',
  'Python程序设计',
  '信息安全技术',
  '云计算基础',
  '物联网概论',
]

export default function ImportScheduleDrawer({
  open,
  onOpenChange,
  venues,
  periods,
  onImported,
}: ImportScheduleDrawerProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<unknown[][]>([])

  const [courseCol, setCourseCol] = useState('')
  const [classCol, setClassCol] = useState('')
  const [teacherCol, setTeacherCol] = useState('')
  const [dayCol, setDayCol] = useState('')
  const [periodCol, setPeriodCol] = useState('')
  const [weeksCol, setWeeksCol] = useState('')
  const [venueCol, setVenueCol] = useState('')
  const [natureCol, setNatureCol] = useState('')

  const [venueMapping, setVenueMapping] = useState<Record<string, string>>({})
  const [periodMapping, setPeriodMapping] = useState<Record<string, string[]>>({})
  const [courseMapping, setCourseMapping] = useState<Record<string, string>>({})
  const [classMapping, setClassMapping] = useState<Record<string, string>>({})
  const [teacherMapping, setTeacherMapping] = useState<Record<string, string>>({})

  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])

  // 模拟各课程版本号（演示用）
  const courseVersionOptions = useMemo(() => {
    const pool: Record<string, string[]> = {}
    coursePool.forEach((c, i) => {
      const count = (i % 4) + 1 // 每个课程 1-4 个版本
      pool[c.id] = Array.from({ length: count }, (_, j) => {
        const major = Math.floor(j / 2) + 1
        const minor = j % 2
        return `${major}.${minor}`
      })
    })
    return pool
  }, [])

  const [courseVersions, setCourseVersions] = useState<Record<string, string>>({})

  const detectColumn = (targetHeaders: string[], candidates: string[]) => {
    for (const h of targetHeaders) {
      const lower = h.toLowerCase()
      if (candidates.some((c) => lower.includes(c))) return h
    }
    return ''
  }

  const buildAutoMapping = (currentVenues: Venue[], currentPeriods: string[]) => {
    const venueNext: Record<string, string> = {}
    MOCK_EXTERNAL_VENUES.forEach((val, idx) => {
      const matched = currentVenues[idx % currentVenues.length]
      if (matched) venueNext[val] = matched.id
    })

    const periodNext: Record<string, string[]> = {}
    MOCK_EXTERNAL_PERIODS.forEach((val, idx) => {
      const start = idx * 2 + 1
      periodNext[val] = currentPeriods.slice(start, start + 2)
    })

    const courseNext: Record<string, string> = {}
    MOCK_COURSES.forEach((val, idx) => {
      const matched = coursePool[idx % coursePool.length]
      if (matched) courseNext[val] = matched.id
    })

    const classNext: Record<string, string> = {}
    CLASS_POOL.forEach((cls) => {
      classNext[cls.name] = cls.id
    })

    const teacherNext: Record<string, string> = {}
    TEACHER_POOL.forEach((fac) => {
      teacherNext[fac.name] = fac.id
    })

    return { venueNext, periodNext, courseNext, classNext, teacherNext }
  }

  const buildMockRows = (): unknown[][] => {
    return Array.from({ length: 10 }).map((_, idx) => {
      const cls = CLASS_POOL[idx % CLASS_POOL.length]
      const fac = TEACHER_POOL[idx % TEACHER_POOL.length]
      const day = (idx % 5) + 1
      const period = MOCK_EXTERNAL_PERIODS[idx % MOCK_EXTERNAL_PERIODS.length]
      const venue = MOCK_EXTERNAL_VENUES[idx % MOCK_EXTERNAL_VENUES.length]
      const nature = idx % 3 === 0 ? '场景' : '传统'
      return [
        MOCK_COURSES[idx % MOCK_COURSES.length],
        cls.name,
        fac.name,
        `${day}`,
        period,
        '1-16周',
        venue,
        nature,
      ]
    })
  }

  const handleUpload = async (file: File) => {
    // 演示系统：不读取真实 Excel，使用 mock 数据保证演示流程可继续
    const mockHeaders = MOCK_HEADERS
    const mockRows = buildMockRows()
    const { venueNext, periodNext, courseNext, classNext, teacherNext } =
      buildAutoMapping(venues, periods)

    setFileName(file.name)
    setHeaders(mockHeaders)
    setRows(mockRows)
    setParsedRows([])

    setCourseCol(detectColumn(mockHeaders, ['课程名', '课程名称', 'course']))
    setClassCol(detectColumn(mockHeaders, ['班级', '教学班', 'class']))
    setTeacherCol(detectColumn(mockHeaders, ['教师', '主讲教师', 'teacher', '老师']))
    setDayCol(detectColumn(mockHeaders, ['星期', '周几', '星期几', 'day']))
    setPeriodCol(detectColumn(mockHeaders, ['节次', '时段', 'period']))
    setWeeksCol(detectColumn(mockHeaders, ['周次', '周数', 'weeks']))
    setVenueCol(detectColumn(mockHeaders, ['场地', '教室', 'venue', 'room']))
    setNatureCol(detectColumn(mockHeaders, ['课程性质', '类型', 'nature', '性质']))

    setVenueMapping(venueNext)
    setPeriodMapping(periodNext)
    setCourseMapping(courseNext)
    setClassMapping(classNext)
    setTeacherMapping(teacherNext)

    toast.success(`已解析 ${file.name}，共 ${mockRows.length} 行（演示数据）`)
  }

  // 列选择或映射变化后自动重新解析预览
  useEffect(() => {
    if (rows.length === 0) return
    setParsedRows(generateParsedRows())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, headers, courseCol, classCol, teacherCol, dayCol, periodCol, weeksCol, venueCol, natureCol, venueMapping, periodMapping, courseMapping, classMapping, teacherMapping])

  const extractUniqueValues = (column: string) => {
    const idx = headers.indexOf(column)
    if (idx < 0) return []
    const values = new Set<string>()
    rows.forEach((row) => {
      const val = row[idx]
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        values.add(String(val).trim())
      }
    })
    return Array.from(values)
  }

  const externalCourseValues = useMemo(
    () => (courseCol ? extractUniqueValues(courseCol) : []),
    [courseCol, headers, rows]
  )
  const externalClassValues = useMemo(
    () => (classCol ? extractUniqueValues(classCol) : []),
    [classCol, headers, rows]
  )
  const externalTeacherValues = useMemo(
    () => (teacherCol ? extractUniqueValues(teacherCol) : []),
    [teacherCol, headers, rows]
  )
  const externalVenueValues = useMemo(
    () => (venueCol ? extractUniqueValues(venueCol) : []),
    [venueCol, headers, rows]
  )
  const externalPeriodValues = useMemo(
    () => (periodCol ? extractUniqueValues(periodCol) : []),
    [periodCol, headers, rows]
  )

  const unmappedCourses = useMemo(
    () => externalCourseValues.filter((v) => !courseMapping[v]),
    [externalCourseValues, courseMapping]
  )
  const unmappedClasses = useMemo(
    () => externalClassValues.filter((v) => !classMapping[v]),
    [externalClassValues, classMapping]
  )
  const unmappedTeachers = useMemo(
    () => externalTeacherValues.filter((v) => !teacherMapping[v]),
    [externalTeacherValues, teacherMapping]
  )
  const unmappedVenues = useMemo(
    () => externalVenueValues.filter((v) => !venueMapping[v]),
    [externalVenueValues, venueMapping]
  )
  const unmappedPeriods = useMemo(
    () =>
      externalPeriodValues.filter(
        (v) => (periodMapping[v] || []).length === 0
      ),
    [externalPeriodValues, periodMapping]
  )

  const courseMapById = useMemo(() => {
    const map = new Map<string, (typeof coursePool)[number]>()
    coursePool.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  const classMapById = useMemo(() => {
    const map = new Map<string, (typeof classes)[number]>()
    classes.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  const teacherMapById = useMemo(() => {
    const map = new Map<string, (typeof faculty)[number]>()
    faculty.forEach((f) => map.set(f.id, f))
    return map
  }, [])

  const venueMapById = useMemo(() => {
    const map = new Map<string, Venue>()
    venues.forEach((v) => map.set(v.id, v))
    return map
  }, [venues])

  const courseReverseMap = useMemo(() => {
    const map = new Map<string, string>()
    Object.entries(courseMapping).forEach(([ext, sysId]) => map.set(sysId, ext))
    return map
  }, [courseMapping])

  const classReverseMap = useMemo(() => {
    const map = new Map<string, string>()
    Object.entries(classMapping).forEach(([ext, sysId]) => map.set(sysId, ext))
    return map
  }, [classMapping])

  const teacherReverseMap = useMemo(() => {
    const map = new Map<string, string>()
    Object.entries(teacherMapping).forEach(([ext, sysId]) => map.set(sysId, ext))
    return map
  }, [teacherMapping])

  const venueReverseMap = useMemo(() => {
    const map = new Map<string, string>()
    Object.entries(venueMapping).forEach(([ext, sysId]) => map.set(sysId, ext))
    return map
  }, [venueMapping])

  const periodReverseMap = useMemo(() => {
    const map = new Map<string, string[]>()
    Object.entries(periodMapping).forEach(([ext, sysPeriods]) => {
      sysPeriods.forEach((p) => {
        const existing = map.get(p) || []
        map.set(p, [...existing, ext])
      })
    })
    return map
  }, [periodMapping])

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

  const generateParsedRows = (
    sourceRows: unknown[][] = rows,
    currentVenueMapping: Record<string, string> = venueMapping,
    currentPeriodMapping: Record<string, string[]> = periodMapping
  ): ParsedRow[] => {
    const getValue = (row: unknown[], col: string) => {
      const idx = headers.indexOf(col)
      if (idx < 0) return ''
      const val = row[idx]
      return val === undefined || val === null ? '' : String(val).trim()
    }

    const result: ParsedRow[] = []
    sourceRows.forEach((row, idx) => {
      const externalCourse = getValue(row, courseCol)
      const externalClass = getValue(row, classCol)
      const externalTeacher = getValue(row, teacherCol)
      const dayRaw = getValue(row, dayCol)
      const periodRaw = getValue(row, periodCol)
      const weeksRaw = getValue(row, weeksCol)
      const venueRaw = getValue(row, venueCol)
      const natureRaw = getValue(row, natureCol)

      if (!externalCourse && !externalClass && !externalTeacher) return

      const courseId = courseMapping[externalCourse]
      const course = courseMapById.get(courseId)
      const courseName = course?.name || externalCourse || '-'

      const classId = classMapping[externalClass]
      const cls = classMapById.get(classId)
      const className = cls?.name || externalClass || '-'

      const facultyId = teacherMapping[externalTeacher]
      const fac = teacherMapById.get(facultyId)
      const teacherName = fac?.name || externalTeacher || '-'

      const dayOfWeek = dayToNumber(dayRaw)
      const mappedPeriods = currentPeriodMapping[periodRaw] || []
      const venueId = currentVenueMapping[venueRaw]
      const venue = venues.find((v) => v.id === venueId)

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
        courseName,
        className,
        teacherName,
        dayOfWeek,
        periods: mappedPeriods,
        weeks: weeksRaw ? (weeksRaw.endsWith('周') ? weeksRaw : `${weeksRaw}周`) : '-',
        venueName: venue?.name || venueRaw || '-',
        type: parseNature(natureRaw),
        classId: cls?.id,
        facultyId: fac?.id,
        venueId,
        venueUnmapped: !!venueRaw && !venueId,
        periodUnmapped: !!periodRaw && mappedPeriods.length === 0,
        invalidReason: reasons.length > 0 ? reasons.join('；') : undefined,
      })
    })
    return result
  }

  const parseRows = () => {
    setParsedRows(generateParsedRows())
  }

  const validRows = parsedRows.filter(
    (r) => !r.venueUnmapped && !r.periodUnmapped && !r.invalidReason
  )

  const handleImport = () => {
    const generated: Task[] = validRows.map((r, i) => {
      const cls = classes.find((c) => c.id === r.classId)!
      const fac = faculty.find((f) => f.id === r.facultyId)!
      const venue = venues.find((v) => v.id === r.venueId)!
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
    onImported?.(generated)
    toast.success(`成功导入 ${generated.length} 条排课记录`)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-hidden flex flex-col">
        <SheetHeader className="pb-6 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            导入外部课表
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full pr-6">
          <div className="space-y-6 pb-6 px-2">
            {/* 上传 */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    id="drawer-excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      handleUpload(file)
                      e.target.value = ''
                    }}
                  />
                  <label htmlFor="drawer-excel-upload">
                    <Button asChild size="sm">
                      <span className="cursor-pointer">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        {fileName ? '重新上传' : '上传 Excel'}
                      </span>
                    </Button>
                  </label>
                  {fileName && (
                    <span className="text-sm text-muted-foreground">
                      {fileName}（{rows.length} 行）
                    </span>
                  )}
                </div>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      列字段对应
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">当前系统</span>
                      <span className="text-xs font-semibold text-muted-foreground">Excel 识别结果</span>
                    </div>
                    {[
                      { label: '课程名', value: courseCol, onChange: setCourseCol },
                      { label: '班级', value: classCol, onChange: setClassCol },
                      { label: '教师', value: teacherCol, onChange: setTeacherCol },
                      { label: '星期', value: dayCol, onChange: setDayCol },
                      { label: '节次', value: periodCol, onChange: setPeriodCol },
                      { label: '周次', value: weeksCol, onChange: setWeeksCol },
                      { label: '场地', value: venueCol, onChange: setVenueCol },
                      { label: '课程性质', value: natureCol, onChange: setNatureCol },
                    ].map((col) => {
                      const hasHeaders = headers.length > 0
                      return (
                        <div
                          key={col.label}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">系统字段：{col.label}</div>
                            {!hasHeaders ? (
                              <Badge
                                variant="outline"
                                className="gap-1 text-muted-foreground text-[10px]"
                              >
                                请导入表格进行配置
                              </Badge>
                            ) : col.value ? (
                              <Badge
                                variant="outline"
                                className="gap-1 text-green-600 border-green-300 text-[10px]"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                已映射到「{col.value}」
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="gap-1 text-red-600 border-red-300 text-[10px]"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                未映射
                              </Badge>
                            )}
                          </div>
                          <Select
                            value={col.value}
                            onValueChange={col.onChange}
                            disabled={!hasHeaders}
                          >
                            <SelectTrigger className="w-[200px] h-9 text-xs">
                              <SelectValue placeholder={hasHeaders ? '选择 Excel 列' : '无可用列'} />
                            </SelectTrigger>
                            <SelectContent>
                              {headers.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {headers.length > 0 && (
              <>
                {/* 课程名称对齐 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                       关联系统已有场景
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">当前系统</span>
                      <span className="text-xs font-semibold text-muted-foreground">选择版本号</span>
                    </div>
                    {coursePool.length === 0 ? (
                      <p className="text-sm text-muted-foreground">暂无系统课程数据</p>
                    ) : (
                      coursePool.map((course) => {
                        const ver = courseVersions[course.id] || ''
                        const versions = courseVersionOptions[course.id] || []
                        return (
                          <div
                            key={course.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{course.name}</div>
                              {ver ? (
                                <Badge variant="outline" className="gap-1 text-green-600 border-green-300 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  版本 {ver}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300 text-[10px]">
                                  未选择版本
                                </Badge>
                              )}
                            </div>
                            <Select
                              value={ver}
                              onValueChange={(v) => setCourseVersions((prev) => ({ ...prev, [course.id]: v }))}
                            >
                              <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="选择版本" />
                              </SelectTrigger>
                              <SelectContent>
                                {versions.map((v) => (
                                  <SelectItem key={v} value={v}>v{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                {/* 班级对齐 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-600" />
                      班级对齐
                      {unmappedClasses.length > 0 && (
                        <Badge variant="secondary" className="text-amber-600">
                          待完成 {unmappedClasses.length}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">当前系统</span>
                      <span className="text-xs font-semibold text-muted-foreground">Excel 识别结果</span>
                    </div>
                    {classes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">暂无系统班级数据</p>
                    ) : (
                      classes.map((cls) => {
                        const extVal = classReverseMap.get(cls.id) || ''
                        return (
                          <div
                            key={cls.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{cls.name}</div>
                              {extVal ? (
                                <Badge variant="outline" className="gap-1 text-green-600 border-green-300 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  已映射
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-red-600 border-red-300 text-[10px]">
                                  <AlertTriangle className="h-3 w-3" />
                                  未映射
                                </Badge>
                              )}
                            </div>
                            <Select
                              value={extVal}
                              onValueChange={(val) =>
                                setClassMapping((prev) => {
                                  const next = { ...prev }
                                  Object.keys(next).forEach((k) => { if (next[k] === cls.id) delete next[k] })
                                  if (val) next[val] = cls.id
                                  return next
                                })
                              }
                            >
                              <SelectTrigger className="w-[220px] h-9 text-xs">
                                <SelectValue placeholder="请选择" />
                              </SelectTrigger>
                              <SelectContent>
                                {externalClassValues.map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                {/* 教师对齐 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4 text-violet-600" />
                      教师对齐
                      {unmappedTeachers.length > 0 && (
                        <Badge variant="secondary" className="text-amber-600">
                          待完成 {unmappedTeachers.length}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">当前系统</span>
                      <span className="text-xs font-semibold text-muted-foreground">Excel 识别结果</span>
                    </div>
                    {faculty.length === 0 ? (
                      <p className="text-sm text-muted-foreground">暂无系统教师数据</p>
                    ) : (
                      faculty.map((teacher) => {
                        const extVal = teacherReverseMap.get(teacher.id) || ''
                        return (
                          <div
                            key={teacher.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{teacher.name}</div>
                              {extVal ? (
                                <Badge variant="outline" className="gap-1 text-green-600 border-green-300 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  已映射
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-red-600 border-red-300 text-[10px]">
                                  <AlertTriangle className="h-3 w-3" />
                                  未映射
                                </Badge>
                              )}
                            </div>
                            <Select
                              value={extVal}
                              onValueChange={(val) =>
                                setTeacherMapping((prev) => {
                                  const next = { ...prev }
                                  Object.keys(next).forEach((k) => { if (next[k] === teacher.id) delete next[k] })
                                  if (val) next[val] = teacher.id
                                  return next
                                })
                              }
                            >
                              <SelectTrigger className="w-[220px] h-9 text-xs">
                                <SelectValue placeholder="请选择" />
                              </SelectTrigger>
                              <SelectContent>
                                {externalTeacherValues.map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                {/* 场地对齐 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      场地对齐
                      {unmappedVenues.length > 0 && (
                        <Badge variant="secondary" className="text-amber-600">
                          待完成 {unmappedVenues.length}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">当前系统</span>
                      <span className="text-xs font-semibold text-muted-foreground">Excel 识别结果</span>
                    </div>
                    {venues.length === 0 ? (
                      <p className="text-sm text-muted-foreground">暂无系统场地数据</p>
                    ) : (
                      venues.map((venue) => {
                        const extVal = venueReverseMap.get(venue.id) || ''
                        return (
                          <div
                            key={venue.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{venue.name}</div>
                              {extVal ? (
                                <Badge variant="outline" className="gap-1 text-green-600 border-green-300 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  已映射
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-red-600 border-red-300 text-[10px]">
                                  <AlertTriangle className="h-3 w-3" />
                                  未映射
                                </Badge>
                              )}
                            </div>
                            <Select
                              value={extVal}
                              onValueChange={(val) =>
                                setVenueMapping((prev) => {
                                  const next = { ...prev }
                                  Object.keys(next).forEach((k) => { if (next[k] === venue.id) delete next[k] })
                                  if (val) next[val] = venue.id
                                  return next
                                })
                              }
                            >
                              <SelectTrigger className="w-[220px] h-9 text-xs">
                                <SelectValue placeholder="请选择" />
                              </SelectTrigger>
                              <SelectContent>
                                {externalVenueValues.map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                {/* 节次对齐 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      节次对齐
                      {unmappedPeriods.length > 0 && (
                        <Badge variant="secondary" className="text-amber-600">
                          待完成 {unmappedPeriods.length}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">当前系统</span>
                      <span className="text-xs font-semibold text-muted-foreground">Excel 识别结果</span>
                    </div>
                    {periods.length === 0 ? (
                      <p className="text-sm text-muted-foreground">暂无系统节次数据</p>
                    ) : (
                      periods.map((p) => {
                        const extVals = periodReverseMap.get(p) || []
                        const mappedExt = extVals.length > 0 ? extVals[0] : ''
                        return (
                          <div
                            key={p}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{p}</div>
                              {mappedExt ? (
                                <Badge variant="outline" className="gap-1 text-green-600 border-green-300 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  已映射
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-red-600 border-red-300 text-[10px]">
                                  <AlertTriangle className="h-3 w-3" />
                                  未映射
                                </Badge>
                              )}
                            </div>
                            <Select
                              value={mappedExt}
                              onValueChange={(val) =>
                                setPeriodMapping((prev) => {
                                  const next = { ...prev }
                                  Object.keys(next).forEach((k) => {
                                    next[k] = next[k].filter((x) => x !== p)
                                    if (next[k].length === 0) delete next[k]
                                  })
                                  if (val) next[val] = [...(next[val] || []), p]
                                  return next
                                })
                              }
                            >
                              <SelectTrigger className="w-[220px] h-9 text-xs">
                                <SelectValue placeholder="请选择" />
                              </SelectTrigger>
                              <SelectContent>
                                {externalPeriodValues.map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={parseRows}>
                    解析预览
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    全部对齐完成后才能导入
                  </span>
                </div>

                {parsedRows.length > 0 && (
                  <Card>
                    <CardHeader className="pb-4">
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
                    <CardContent className="p-6 pt-0 space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">行</TableHead>
                              <TableHead>课程</TableHead>
                              <TableHead>班级</TableHead>
                              <TableHead>教师</TableHead>
                              <TableHead>星期</TableHead>
                              <TableHead>节次</TableHead>
                              <TableHead>场地</TableHead>
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
                                  <TableCell>{r.venueName}</TableCell>
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

                      <div className="flex justify-end">
                        <Button
                          disabled={validRows.length === 0 || unmappedVenues.length > 0 || unmappedPeriods.length > 0}
                          onClick={handleImport}
                        >
                          确认导入（{validRows.length} 条）
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
