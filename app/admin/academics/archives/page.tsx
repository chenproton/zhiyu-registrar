'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Award, Clock, CalendarDays } from 'lucide-react'
import { students, gradeRecords, statusChanges, classes, majors } from '@/lib/mock-data'

export default function ArchivesPage() {
  const [searchId, setSearchId] = useState('')
  const student = students.find((s) => s.studentId === searchId || s.name === searchId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">学业档案</h1>
        <p className="text-muted-foreground">查询学生完整学业历程与档案</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="输入学号或姓名查询..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => {}}>查询</Button>
      </div>

      {student && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-medium">{student.name} ({student.studentId})</div>
                  <div className="text-sm text-muted-foreground">
                    {majors.find((m) => m.id === student.majorId)?.name} · {classes.find((c) => c.id === student.classId)?.name} · 入学{student.entryYear}
                  </div>
                </div>
                <Badge className="ml-auto">{student.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="grades">
            <TabsList>
              <TabsTrigger value="grades">成绩记录</TabsTrigger>
              <TabsTrigger value="credits">学分统计</TabsTrigger>
              <TabsTrigger value="changes">学籍异动</TabsTrigger>
            </TabsList>

            <TabsContent value="grades">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {gradeRecords.filter((g) => g.studentId === student.id).map((g) => (
                      <div key={g.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <div className="font-medium">{g.courseName}</div>
                          <div className="text-xs text-muted-foreground">{g.gradeType} · {g.credits}学分</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{g.status}</Badge>
                          <div className="text-right w-16">
                            <div className="font-medium">{g.recognizedScore}</div>
                            <div className="text-xs text-muted-foreground">GPA {g.gpa}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {gradeRecords.filter((g) => g.studentId === student.id).length === 0 && (
                      <div className="text-center text-muted-foreground py-8">暂无成绩记录</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credits">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{student.creditsEarned}</div>
                      <div className="text-sm text-muted-foreground">已获学分</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{student.gpa.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">当前GPA</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{gradeRecords.filter((g) => g.studentId === student.id).length}</div>
                      <div className="text-sm text-muted-foreground">成绩记录数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changes">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  {statusChanges.filter((sc) => sc.studentId === student.id).map((sc) => (
                    <div key={sc.id} className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{sc.type}</div>
                        <div className="text-sm text-muted-foreground">{sc.date} · {sc.reason} · 审批人：{sc.approver}</div>
                      </div>
                    </div>
                  ))}
                  {statusChanges.filter((sc) => sc.studentId === student.id).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">无学籍异动记录</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!student && searchId && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            未找到匹配的学生信息
          </CardContent>
        </Card>
      )}
    </div>
  )
}
