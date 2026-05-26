'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Award, Clock, CalendarDays, Star, Briefcase, Trophy, FileCheck } from 'lucide-react'
import { students, gradeRecords, statusChanges, classes, majors } from '@/lib/mock-data'

export default function ArchivesPage() {
  const [searchId, setSearchId] = useState('')
  const student = students.find((s) => s.studentId === searchId || s.name === searchId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">学业档案</h1>
        <p className="text-muted-foreground">查询学生完整学业历程、成绩、学分与能力认定档案</p>
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
                    {majors.find((m) => m.id === student.majorId)?.name} · {classes.find((c) => c.id === student.classId)?.name} · 入学{student.entryYear} · {student.educationLevel}
                  </div>
                </div>
                <Badge className="ml-auto">{student.status}</Badge>
                {student.degreeType && (
                  <Badge variant="outline" className="ml-2">{student.degreeType}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="grades">
            <TabsList>
              <TabsTrigger value="grades">成绩记录</TabsTrigger>
              <TabsTrigger value="credits">学分统计</TabsTrigger>
              <TabsTrigger value="ability">能力认定</TabsTrigger>
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

            <TabsContent value="ability">
              <div className="space-y-4">
                {/* 能力认定概览 */}
                {student.abilityRecognition && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        能力认定概览
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{student.abilityRecognition.totalSkills}</div>
                          <div className="text-sm text-muted-foreground">总技能数</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{student.abilityRecognition.certifiedSkills}</div>
                          <div className="text-sm text-muted-foreground">已认证技能</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{student.abilityRecognition.competencyLevel}</div>
                          <div className="text-sm text-muted-foreground">能力等级</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{student.abilityRecognition.lastAssessment}</div>
                          <div className="text-sm text-muted-foreground">最近评估</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 能力档案袋详情 */}
                {student.abilityPortfolio ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* 证书 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          证书
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {student.abilityPortfolio.certificates.length > 0 ? student.abilityPortfolio.certificates.map((c, i) => (
                          <div key={i} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                            <div>
                              <div className="font-medium">{c.name}</div>
                              <div className="text-muted-foreground">{c.issuer} · {c.date}</div>
                            </div>
                            <Badge variant={c.status === '有效' ? 'default' : 'secondary'} className="text-xs">{c.status}</Badge>
                          </div>
                        )) : <p className="text-sm text-muted-foreground">暂无证书</p>}
                      </CardContent>
                    </Card>

                    {/* 技能徽章 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          技能徽章
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {student.abilityPortfolio.skillBadges.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {student.abilityPortfolio.skillBadges.map((b, i) => (
                              <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {b.name} · {b.level}
                              </Badge>
                            ))}
                          </div>
                        ) : <p className="text-sm text-muted-foreground">暂无技能徽章</p>}
                      </CardContent>
                    </Card>

                    {/* 竞赛 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          竞赛获奖
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {student.abilityPortfolio.competitions.length > 0 ? student.abilityPortfolio.competitions.map((c, i) => (
                          <div key={i} className="border rounded-lg p-3 text-sm">
                            <div className="font-medium">{c.name}</div>
                            <div className="text-muted-foreground">{c.level} · {c.award} · {c.date}</div>
                          </div>
                        )) : <p className="text-sm text-muted-foreground">暂无竞赛记录</p>}
                      </CardContent>
                    </Card>

                    {/* 实习 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          实习经历
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {student.abilityPortfolio.internships.length > 0 ? student.abilityPortfolio.internships.map((item, i) => (
                          <div key={i} className="border rounded-lg p-3 text-sm">
                            <div className="font-medium">{item.company} · {item.position}</div>
                            <div className="text-muted-foreground">{item.duration} · 评价：{item.evaluation}</div>
                          </div>
                        )) : <p className="text-sm text-muted-foreground">暂无实习记录</p>}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <p>该学生暂无能力档案袋数据</p>
                      <p className="text-xs mt-1">能力档案袋数据从能力测评平台同步</p>
                    </CardContent>
                  </Card>
                )}
              </div>
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
