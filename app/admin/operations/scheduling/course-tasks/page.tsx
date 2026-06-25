'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  tasks,
  departments,
  majors,
  classes,
  grades,
} from '@/lib/mock-data'

export default function CourseTasksPage() {
  // 顶部联动筛选
  const [selectedDept, setSelectedDept] = useState<string>('d1')
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g2026')
  const [selectedMajorId, setSelectedMajorId] = useState<string>('m1')
  const [selectedClassId, setSelectedClassId] = useState<string>('all')

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

      return true
    })
  }, [selectedDept, selectedGradeId, selectedMajorId, selectedClassId])

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

      {/* 任务列表表格 */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>课时/编码</TableHead>
                <TableHead>班级</TableHead>
                <TableHead>教师</TableHead>
                <TableHead>预计学时</TableHead>
                <TableHead>是否已开课</TableHead>
                <TableHead>开课时间</TableHead>
                <TableHead>关联混合课名称</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task, index) => {
                const ps = task.progressSummary
                const isOpened = ['published', 'in_progress', 'evaluating', 'completed'].includes(task.status)
                const openDate = isOpened
                  ? `2025 年 3 月 ${3 + (index % 28)} 日`
                  : '—'
                const mixedCourseName = `${task.courseName}混合课程`
                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{task.courseName}</div>
                      <div className="text-xs text-muted-foreground">{task.code}</div>
                    </TableCell>
                    <TableCell className="text-sm">{task.className}</TableCell>
                    <TableCell className="text-sm">{task.facultyName}</TableCell>
                    <TableCell className="text-sm">
                      {ps ? `${ps.plannedHours ?? 0}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          isOpened
                            ? 'border-green-300 text-green-600'
                            : 'border-gray-300 text-gray-500'
                        )}
                      >
                        {isOpened ? '是' : '否'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{openDate}</TableCell>
                    <TableCell className="text-sm">{mixedCourseName}</TableCell>
                  </TableRow>
                )
              })}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
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
