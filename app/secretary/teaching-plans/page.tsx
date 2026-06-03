'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Eye } from 'lucide-react'
import { teachingPlansV2 } from '@/lib/mock-data'

export default function SecretaryTeachingPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">教学计划</h1>
        <p className="text-muted-foreground mt-1">查看全校教学计划安排（只读）</p>
      </div>

      <div className="space-y-4">
        {teachingPlansV2.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                </div>
                <Badge variant="outline">{plan.entries.length} 门课程</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                学期：{plan.semesterCount}个学期 · 适用年级：{plan.targetGrade}
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">课程名称</th>
                      <th className="text-left p-3 font-medium">代码</th>
                      <th className="text-center p-3 font-medium">学期</th>
                      <th className="text-center p-3 font-medium">周学时</th>
                      <th className="text-center p-3 font-medium">周数</th>
                      <th className="text-center p-3 font-medium">类型</th>
                      <th className="text-center p-3 font-medium">考核</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.entries.map((entry) => (
                      <tr key={entry.id} className="border-t">
                        <td className="p-3 font-medium">{entry.courseName}</td>
                        <td className="p-3 text-muted-foreground">{entry.courseCode}</td>
                        <td className="p-3 text-center">第{entry.semester}学期</td>
                        <td className="p-3 text-center">{entry.hoursPerWeek}</td>
                        <td className="p-3 text-center">{entry.weeks}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">
                            {entry.type === 'theory' ? '理论' : entry.type === 'practice' ? '实践' : '一体化'}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className="text-xs">
                            {entry.assessment === 'exam' ? '考试' : '考查'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
