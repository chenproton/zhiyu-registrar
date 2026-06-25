'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  ClipboardList,
  BookOpen,
  Layers,
  Play,
  ClipboardCheck,
  ChevronRight,
  Search,
} from 'lucide-react'
import {
  tasks,
  departments,
  majors,
  classes,
  grades,
  type Task,
} from '@/lib/mock-data'

export default function CourseTasksPage() {
  // 顶部联动筛选
  const [selectedDept, setSelectedDept] = useState<string>('d1')
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g2026')
  const [selectedMajorId, setSelectedMajorId] = useState<string>('m1')
  const [selectedClassId, setSelectedClassId] = useState<string>('all')

  // 其他筛选
  const [filterType, setFilterType] = useState<'traditional' | 'scene' | 'mixed'>('mixed')
  const [filterFaculty, setFilterFaculty] = useState<string>('')

  // 联动选项
  const matchedMajors = useMemo(() => {
    if (!selectedDept) return []
    return majors.filter((m) => m.departmentId === selectedDept)
  }, [selectedDept])

  const matchedClasses = useMemo(() => {
    return classes.filter((c) => {
      if (c.majorId !== selectedMajorId) return false
      if (selectedGradeId && c.gradeId !== selectedGradeId) return false
      return true
    })
  }, [selectedMajorId, selectedGradeId])

  const selectedMajor = useMemo(
    () => majors.find((m) => m.id === selectedMajorId) || null,
    [selectedMajorId]
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const cls = classes.find((c) => c.id === t.classId)
      const major = majors.find((m) => m.id === cls?.majorId)

      // 院系
      if (selectedDept && major?.departmentId !== selectedDept) return false

      // 年级
      if (selectedGradeId && cls?.gradeId !== selectedGradeId) return false

      // 专业
      if (selectedMajorId && cls?.majorId !== selectedMajorId) return false

      // 班级
      if (selectedClassId !== 'all' && t.classId !== selectedClassId) return false

      // 课时类型
      if (filterType !== 'mixed' && t.type !== filterType) return false

      // 教师搜索
      if (filterFaculty.trim()) {
        const q = filterFaculty.trim().toLowerCase()
        if (!t.facultyName.toLowerCase().includes(q)) return false
      }

      return true
    })
  }, [selectedDept, selectedGradeId, selectedMajorId, selectedClassId, filterType, filterFaculty])

  // 统计卡片数据
  const totalTasks = filteredTasks.length
  const traditionalTasks = filteredTasks.filter((t) => t.type === 'traditional').length
  const sceneTasks = filteredTasks.filter((t) => t.type === 'scene').length
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress').length
  const evaluatingTasks = filteredTasks.filter((t) => t.status === 'evaluating').length

  const handleViewDetail = (taskId: string) => {
    window.location.href = `/admin/operations/tasks/${taskId}`
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div>
        <h1 className="text-2xl font-bold">开课任务管理</h1>
        <p className="text-muted-foreground text-sm mt-1">
          按院系、年级、专业、班级维度统一管理开课任务
        </p>
      </div>

      {/* 顶部联动筛选器：院系 + 年级 + 专业 + 班级 */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-1">
              <Label className="text-xs">选择院系</Label>
              <Select
                value={selectedDept}
                onValueChange={(v) => {
                  setSelectedDept(v)
                  setSelectedGradeId('')
                  setSelectedMajorId('')
                  setSelectedClassId('all')
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="请选择院系" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
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
                  setSelectedClassId('all')
                }}
                disabled={!selectedDept}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={selectedDept ? '请选择年级' : '先选院系'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
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
                  setSelectedClassId('all')
                }}
                disabled={!selectedGradeId || matchedMajors.length === 0}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue
                    placeholder={
                      !selectedGradeId
                        ? '先选年级'
                        : matchedMajors.length === 0
                          ? '无可用专业'
                          : '请选择专业'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {matchedMajors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">选择班级</Label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
                disabled={!selectedMajorId || matchedClasses.length === 0}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue
                    placeholder={
                      !selectedMajorId
                        ? '先选专业'
                        : matchedClasses.length === 0
                          ? '无可用班级'
                          : '全部班级'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部班级</SelectItem>
                  {matchedClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {selectedMajor?.name || '开课任务'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {selectedDept && departments.find((d) => d.id === selectedDept)?.name}
            {' · '}
            {selectedGradeId && grades.find((g) => g.id === selectedGradeId)?.name}
            {' · '}
            共 {filteredTasks.length} 个开课任务
          </p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">任务总数</p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">体系课任务数</p>
              <p className="text-2xl font-bold">{traditionalTasks}</p>
            </div>
            <div className="rounded-full p-2 bg-emerald-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">颗粒课任务数</p>
              <p className="text-2xl font-bold">{sceneTasks}</p>
            </div>
            <div className="rounded-full p-2 bg-orange-500">
              <Layers className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">进行中任务数</p>
              <p className="text-2xl font-bold">{inProgressTasks}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Play className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">待评定任务数</p>
              <p className="text-2xl font-bold">{evaluatingTasks}</p>
            </div>
            <div className="rounded-full p-2 bg-pink-500">
              <ClipboardCheck className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="任务类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mixed">混合课程</SelectItem>
            <SelectItem value="traditional">体系课</SelectItem>
            <SelectItem value="scene">颗粒课</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索教师"
            className="pl-8 w-[180px]"
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
          />
        </div>
      </div>

      {/* 任务列表表格 */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务/编码</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>班级</TableHead>
                <TableHead>教师</TableHead>
                <TableHead>学时进度</TableHead>
                <TableHead>预计学时</TableHead>
                <TableHead>成绩状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => {
                const ps = task.progressSummary
                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div
                        className="font-medium text-sm cursor-pointer hover:underline hover:text-primary transition-colors"
                        onClick={() => handleViewDetail(task.id)}
                      >
                        {task.courseName}
                      </div>
                      <div className="text-xs text-muted-foreground">{task.code}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          task.type === 'scene'
                            ? 'border-orange-300 text-orange-600 text-xs'
                            : 'text-xs'
                        }
                      >
                        {task.type === 'scene' ? '颗粒课' : '体系课'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{task.className}</TableCell>
                    <TableCell className="text-sm">{task.facultyName}</TableCell>
                    <TableCell>
                      {ps ? (
                        <div className="flex items-center gap-2 w-[140px]">
                          <Progress value={ps.completionRate} className="h-2 flex-1" />
                          <span className="text-xs w-10">{ps.completionRate}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ps ? `${ps.completedHours ?? 0}/${ps.plannedHours ?? 0}` : '—'}
                    </TableCell>
                    <TableCell>
                      {task.gradeSummary?.overallStatus === 'published' ? (
                        <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">已评定</Badge>
                      ) : task.gradeSummary?.overallStatus === 'evaluating' ? (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">评定中</Badge>
                      ) : task.gradeSummary?.overallStatus === 'pending' ? (
                        <Badge variant="outline" className="text-xs text-gray-500">未评定</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => handleViewDetail(task.id)}
                      >
                        查看详情 <ChevronRight className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                    暂无开课任务数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
