'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { TrainingProgram, CoursePlan } from '@/lib/mock-data'
import { positions } from '@/lib/mock-data'

function CourseGroupTable({ title, courses }: { title: string; courses: CoursePlan[] }) {
  if (courses.length === 0) return null
  return (
    <div className="mb-2">
      <p className="text-xs text-muted-foreground mb-1">{title} ({courses.length}门)</p>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">课程代码</TableHead>
              <TableHead>课程名称</TableHead>
              <TableHead className="w-16">学分</TableHead>
              <TableHead className="w-16">学时</TableHead>
              <TableHead className="w-16">学期</TableHead>
              <TableHead className="w-16">考核</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.code}</TableCell>
                <TableCell className="font-medium text-sm">{c.name}</TableCell>
                <TableCell>{c.credits}</TableCell>
                <TableCell>{c.hours}</TableCell>
                <TableCell>第{c.semester}学期</TableCell>
                <TableCell>{c.assessment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function FullProgramView({ program }: { program: TrainingProgram }) {
  const curriculum = program.curriculum || []

  // 按 courseTypeLabel 分组
  const groups = useMemo(() => {
    const map = new Map<string, CoursePlan[]>()
    for (const c of curriculum) {
      const label = c.courseTypeLabel || '未分类'
      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(c)
    }
    return Array.from(map.entries()).map(([title, items]) => ({ title, items }))
  }, [curriculum])

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">专业代码</p>
            <p className="text-lg font-bold">{program.majorCode}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">学制</p>
            <p className="text-lg font-bold">{program.duration}年</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">层次</p>
            <p className="text-lg font-bold">{program.level}</p>
          </CardContent>
        </Card>
      </div>

      {/* 职业面向 */}
      {program.careerOrientation && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">职业面向</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">专业大类 / 类</p>
                <p>
                  {program.careerOrientation.professionalCategory.name} ({program.careerOrientation.professionalCategory.code}) / {program.careerOrientation.professionalSubcategory.name} ({program.careerOrientation.professionalSubcategory.code})
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">对应行业</p>
                <p>{program.careerOrientation.correspondingIndustries.join('、')}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">主要职业</p>
              <div className="flex flex-wrap gap-2">
                {program.careerOrientation.mainOccupations.map((o) => (
                  <Badge key={o.code} variant="secondary">{o.name}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">主要岗位</p>
              <div className="flex flex-wrap gap-2">
                {program.careerOrientation.mainPositions.map((pid) => {
                  const pos = positions.find((p) => p.id === pid)
                  return pos ? <Badge key={pid} variant="outline">{pos.name}</Badge> : null
                })}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">职业资格证书</p>
              <div className="flex flex-wrap gap-2">
                {program.careerOrientation.vocationalCertificates.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-emerald-700 border-emerald-200">{cert}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 培养目标 */}
      {program.trainingObjectives && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">培养目标</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{program.trainingObjectives}</p>
          </CardContent>
        </Card>
      )}

      {/* 培养规格 */}
      {program.trainingSpecifications && program.trainingSpecifications.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">培养规格</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-decimal list-inside space-y-1 text-sm leading-relaxed">
              {program.trainingSpecifications.map((spec) => (
                <li key={spec.id}>{spec.content}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 课程设置 */}
      {curriculum.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">课程设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups.map(
              (g) => g.items.length > 0 && <CourseGroupTable key={g.title} title={g.title} courses={g.items} />
            )}
          </CardContent>
        </Card>
      )}

      {/* 学时学分统计 */}
      {program.creditHours && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">学时学分统计</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-muted-foreground text-xs">总学分</p>
                <p className="text-lg font-bold">{program.creditHours.totalCredits}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-muted-foreground text-xs">总学时</p>
                <p className="text-lg font-bold">{program.creditHours.totalHours}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-muted-foreground text-xs">理论学时</p>
                <p className="text-lg font-bold">{program.creditHours.theoryHours}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-muted-foreground text-xs">实践学时</p>
                <p className="text-lg font-bold">{program.creditHours.practiceHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 师资队伍 */}
      {program.facultyTeam && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">师资队伍</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">团队结构</p>
              <p>{program.facultyTeam.structure}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">专业带头人要求</p>
              <p>{program.facultyTeam.leaderRequirements}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">专任教师要求</p>
              <p>{program.facultyTeam.fullTimeRequirements}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">兼职教师要求</p>
              <p>{program.facultyTeam.partTimeRequirements}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 教学条件 */}
      {program.teachingConditions && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">教学条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">教室要求</p>
              <p>{program.teachingConditions.classroomRequirements}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">实训场所</p>
              <p>{program.teachingConditions.trainingVenueRequirements}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">实习场所</p>
              <p>{program.teachingConditions.internshipVenueRequirements}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">教材要求</p>
              <p>{program.teachingConditions.textbookRequirements}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
