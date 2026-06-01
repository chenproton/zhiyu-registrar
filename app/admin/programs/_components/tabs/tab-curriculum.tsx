'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrainingProgram, CoursePlan } from '@/lib/mock-data'
import { Plus, Trash2 } from 'lucide-react'

const emptyCourse = (): CoursePlan => ({
  id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '',
  code: '',
  credits: 0,
  hours: 0,
  semester: 1,
  nature: '必修',
  assessment: '考试',
  version: 'v1.0',
})

function CourseTable({
  title,
  courses,
  color,
  onChange,
}: {
  title: string
  courses: CoursePlan[]
  color: string
  onChange: (courses: CoursePlan[]) => void
}) {
  const update = (i: number, patch: Partial<CoursePlan>) => {
    const arr = [...courses]
    arr[i] = { ...arr[i], ...patch }
    onChange(arr)
  }

  return (
    <div className="space-y-2">
      <h4 className={`text-sm font-medium ${color}`}>{title} ({courses.length}门)</h4>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">课程代码</TableHead>
              <TableHead>课程名称</TableHead>
              <TableHead className="w-16">学分</TableHead>
              <TableHead className="w-16">学时</TableHead>
              <TableHead className="w-20">学期</TableHead>
              <TableHead className="w-20">性质</TableHead>
              <TableHead className="w-20">考核</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c, i) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Input
                    value={c.code}
                    onChange={(e) => update(i, { code: e.target.value })}
                    className="h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={c.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    className="h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={c.credits}
                    onChange={(e) => update(i, { credits: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={c.hours}
                    onChange={(e) => update(i, { hours: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={String(c.semester)}
                    onValueChange={(v) => update(i, { semester: Number(v) })}
                  >
                    <SelectTrigger className="h-8 text-xs w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((s) => (
                        <SelectItem key={s} value={String(s)}>第{s}学期</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={c.nature}
                    onValueChange={(v) => update(i, { nature: v as CoursePlan['nature'] })}
                  >
                    <SelectTrigger className="h-8 text-xs w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="必修">必修</SelectItem>
                      <SelectItem value="选修">选修</SelectItem>
                      <SelectItem value="实践">实践</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={c.assessment}
                    onValueChange={(v) => update(i, { assessment: v as CoursePlan['assessment'] })}
                  >
                    <SelectTrigger className="h-8 text-xs w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="考试">考试</SelectItem>
                      <SelectItem value="考查">考查</SelectItem>
                      <SelectItem value="论文">论文</SelectItem>
                      <SelectItem value="作品">作品</SelectItem>
                      <SelectItem value="场景测评">场景测评</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onChange(courses.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...courses, emptyCourse()])}
      >
        <Plus className="h-4 w-4 mr-1" /> 添加课程
      </Button>
    </div>
  )
}

export default function TabCurriculum({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const curriculum = program.curriculum || {
    publicBasic: { required: [], limitedElective: [], freeElective: [] },
    professional: { basic: [], core: [], extended: [], practice: [] },
  }

  const updateCurriculum = (patch: Partial<typeof curriculum>) => {
    onChange({ ...program, curriculum: { ...curriculum, ...patch } })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-blue-700">公共基础课程</h3>
        <CourseTable
          title="必修"
          courses={curriculum.publicBasic.required}
          color="text-blue-700"
          onChange={(v) => updateCurriculum({ publicBasic: { ...curriculum.publicBasic, required: v } })}
        />
        <CourseTable
          title="限选"
          courses={curriculum.publicBasic.limitedElective}
          color="text-blue-600"
          onChange={(v) => updateCurriculum({ publicBasic: { ...curriculum.publicBasic, limitedElective: v } })}
        />
        <CourseTable
          title="任选"
          courses={curriculum.publicBasic.freeElective}
          color="text-blue-500"
          onChange={(v) => updateCurriculum({ publicBasic: { ...curriculum.publicBasic, freeElective: v } })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-purple-700">专业课程</h3>
        <CourseTable
          title="专业基础"
          courses={curriculum.professional.basic}
          color="text-purple-700"
          onChange={(v) => updateCurriculum({ professional: { ...curriculum.professional, basic: v } })}
        />
        <CourseTable
          title="专业核心"
          courses={curriculum.professional.core}
          color="text-purple-600"
          onChange={(v) => updateCurriculum({ professional: { ...curriculum.professional, core: v } })}
        />
        <CourseTable
          title="专业拓展"
          courses={curriculum.professional.extended}
          color="text-purple-500"
          onChange={(v) => updateCurriculum({ professional: { ...curriculum.professional, extended: v } })}
        />
        <CourseTable
          title="专业实践"
          courses={curriculum.professional.practice}
          color="text-amber-600"
          onChange={(v) => updateCurriculum({ professional: { ...curriculum.professional, practice: v } })}
        />
      </div>
    </div>
  )
}
