'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle } from 'lucide-react'
import { degreeRecognitions, students, trainingPrograms } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function DegreesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学历认定</h1>
          <p className="text-muted-foreground">毕业资格学历认定审核（人工审核为主）</p>
        </div>
      </div>

      <div className="grid gap-4">
        {degreeRecognitions.map((dr) => {
          const stu = students.find((s) => s.id === dr.studentId)
          const prog = trainingPrograms.find((p) => p.id === dr.programId)
          const creditRate = Math.round((dr.totalCredits / (prog?.totalCredits || 1)) * 100)
          const requiredRate = Math.round((dr.requiredPassed / dr.requiredTotal) * 100)

          return (
            <Card key={dr.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-medium text-lg">{stu?.name} ({stu?.studentId})</div>
                    <div className="text-sm text-muted-foreground">{prog?.name}</div>
                  </div>
                  <Badge variant={dr.degreeStatus === '符合毕业条件' ? 'default' : 'destructive'}>
                    {dr.degreeStatus}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">学分完成率</div>
                    <div className="flex items-center gap-2">
                      <Progress value={creditRate} className="h-2 flex-1" />
                      <span className="text-xs w-10">{creditRate}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{dr.totalCredits} / {prog?.totalCredits} 学分</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">必修课合格率</div>
                    <div className="flex items-center gap-2">
                      <Progress value={requiredRate} className="h-2 flex-1" />
                      <span className="text-xs w-10">{requiredRate}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{dr.requiredPassed} / {dr.requiredTotal} 门合格</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">毕设状态</div>
                    <Badge variant={dr.graduationDesignStatus === '合格' ? 'default' : 'destructive'}>
                      {dr.graduationDesignStatus}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">出勤率</div>
                    <div className="text-sm font-medium">{dr.attendanceRate}%</div>
                  </div>
                </div>

                {dr.degreeStatus !== '符合毕业条件' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                    缺失条件提示：学分未达标 / 必修课不合格 / 毕设未通过
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" className="gap-1" onClick={() => toast.success('审核通过')}><CheckCircle className="h-4 w-4" />审核通过</Button>
                  <Button size="sm" variant="outline" className="gap-1 text-red-600" onClick={() => toast.error('不符合条件')}><XCircle className="h-4 w-4" />不符合条件</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
