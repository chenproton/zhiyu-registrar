'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { teachingProgress } from '@/lib/mock-data'

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">教学进度监控</h1>
        <p className="text-muted-foreground">汇聚课程平台与场景平台进度数据，仅做展示</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">监控课程总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachingProgress.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均课时完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teachingProgress.reduce((sum, p) => sum + (p.completedHours / p.plannedHours) * 100, 0) / teachingProgress.length)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">学生平均完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teachingProgress.reduce((sum, p) => sum + p.studentAvgCompletion, 0) / teachingProgress.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>课程名称</TableHead>
                <TableHead>授课班级</TableHead>
                <TableHead>授课教师</TableHead>
                <TableHead>计划课时</TableHead>
                <TableHead>已完成课时</TableHead>
                <TableHead>课时完成率</TableHead>
                <TableHead>学生平均完成率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachingProgress.map((p) => {
                const rate = Math.round((p.completedHours / p.plannedHours) * 100)
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.courseName}</TableCell>
                    <TableCell>{p.classId}</TableCell>
                    <TableCell>{p.facultyName}</TableCell>
                    <TableCell>{p.plannedHours}</TableCell>
                    <TableCell>{p.completedHours}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 w-[160px]">
                        <Progress value={rate} className="h-2" />
                        <span className="text-xs w-10">{rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.studentAvgCompletion >= 80 ? 'default' : p.studentAvgCompletion >= 60 ? 'secondary' : 'destructive'}>
                        {p.studentAvgCompletion}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
