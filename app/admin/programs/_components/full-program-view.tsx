'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { TrainingProgram } from '@/lib/mock-data'
import { positions } from '@/lib/mock-data'

export default function FullProgramView({ program }: { program: TrainingProgram }) {
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

      {/* 入学要求 */}
      {program.entryRequirements && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">入学基本要求</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{program.entryRequirements}</p>
          </CardContent>
        </Card>
      )}

      {/* 职业面向 */}
      {program.careerOrientation && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">职业面向</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">专业大类：</span>
                <span className="font-medium">{program.careerOrientation.professionalCategory.name} ({program.careerOrientation.professionalCategory.code})</span>
              </div>
              <div>
                <span className="text-muted-foreground">专业类：</span>
                <span className="font-medium">{program.careerOrientation.professionalSubcategory.name} ({program.careerOrientation.professionalSubcategory.code})</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">对应行业：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {program.careerOrientation.correspondingIndustries.map((ind, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{ind.name} ({ind.code})</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">主要岗位：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {program.careerOrientation.mainPositions.map((posId, i) => {
                  const pos = positions.find((p) => p.id === posId)
                  return (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {pos?.name || posId}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">职业类证书：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {program.careerOrientation.vocationalCertificates.map((cert, i) => (
                  <Badge key={i} variant="outline" className="text-xs text-blue-600 border-blue-300">{cert}</Badge>
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
            <p className="text-sm text-muted-foreground leading-relaxed">{program.trainingObjectives}</p>
          </CardContent>
        </Card>
      )}

      {/* 培养规格 */}
      {program.trainingSpecifications && program.trainingSpecifications.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">培养规格 ({program.trainingSpecifications.length}项)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {program.trainingSpecifications.map((spec) => (
                <div key={spec.id} className="flex gap-2 text-sm">
                  <Badge variant="outline" className="shrink-0 h-5">{spec.id}</Badge>
                  <p className="text-muted-foreground">{spec.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 课程设置 */}
      {program.curriculum && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">课程设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 公共基础课程 */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-blue-700">公共基础课程</h4>
              {program.curriculum.publicBasic.required.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">必修 ({program.curriculum.publicBasic.required.length}门)</p>
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
                        {program.curriculum.publicBasic.required.map((c) => (
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
              )}
            </div>

            {/* 专业课程 */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-purple-700">专业课程</h4>
              {program.curriculum.professional.basic.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">专业基础 ({program.curriculum.professional.basic.length}门)</p>
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
                        {program.curriculum.professional.basic.map((c) => (
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
              )}
              {program.curriculum.professional.core.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">专业核心 ({program.curriculum.professional.core.length}门)</p>
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
                        {program.curriculum.professional.core.map((c) => (
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
              )}
              {program.curriculum.professional.extended.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">专业拓展 ({program.curriculum.professional.extended.length}门)</p>
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
                        {program.curriculum.professional.extended.map((c) => (
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
              )}
              {program.curriculum.professional.practice.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">专业实践 ({program.curriculum.professional.practice.length}门)</p>
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
                        {program.curriculum.professional.practice.map((c) => (
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
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 学时学分统计 */}
      {program.creditHours && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">学时学分统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">总学分</p>
                <p className="text-xl font-bold">{program.creditHours.totalCredits}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">总学时</p>
                <p className="text-xl font-bold">{program.creditHours.totalHours}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">理论学时</p>
                <p className="text-xl font-bold">{program.creditHours.theoryHours}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">实践学时</p>
                <p className="text-xl font-bold">{program.creditHours.practiceHours}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-muted-foreground">公共基础</p>
                <p className="font-medium">{program.creditHours.publicBasicCredits}学分 / {program.creditHours.publicBasicHours}学时</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <p className="text-muted-foreground">专业基础+核心</p>
                <p className="font-medium">{program.creditHours.professionalBasicCredits + program.creditHours.professionalCoreCredits}学分</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-muted-foreground">实践环节</p>
                <p className="font-medium">{program.creditHours.practiceCredits}学分 / {program.creditHours.practiceHours}学时</p>
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
            <div className="rounded-lg border p-3">
              <p className="font-medium mb-1">队伍结构</p>
              <p className="text-muted-foreground">{program.facultyTeam.structure}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium mb-1">专业带头人</p>
              <p className="text-muted-foreground">{program.facultyTeam.leaderRequirements}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium mb-1">专任教师</p>
              <p className="text-muted-foreground">{program.facultyTeam.fullTimeRequirements}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium mb-1">兼职教师</p>
              <p className="text-muted-foreground">{program.facultyTeam.partTimeRequirements}</p>
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
            {program.teachingConditions.classroomRequirements && (
              <div className="rounded-lg border p-3">
                <p className="font-medium mb-1">专业教室</p>
                <p className="text-muted-foreground">{program.teachingConditions.classroomRequirements}</p>
              </div>
            )}
            {program.teachingConditions.trainingVenueRequirements && (
              <div className="rounded-lg border p-3">
                <p className="font-medium mb-1">实训场所</p>
                <p className="text-muted-foreground">{program.teachingConditions.trainingVenueRequirements}</p>
              </div>
            )}
            {program.teachingConditions.textbookRequirements && (
              <div className="rounded-lg border p-3">
                <p className="font-medium mb-1">教材选用</p>
                <p className="text-muted-foreground">{program.teachingConditions.textbookRequirements}</p>
              </div>
            )}
            {program.teachingConditions.digitalResourceRequirements && (
              <div className="rounded-lg border p-3">
                <p className="font-medium mb-1">数字资源</p>
                <p className="text-muted-foreground">{program.teachingConditions.digitalResourceRequirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 质量保障和毕业要求 */}
      {program.qualityAssurance && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">质量保障和毕业要求</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">
              <p className="font-medium mb-1">质量保障体系</p>
              <p className="text-muted-foreground">{program.qualityAssurance.systemDescription}</p>
            </div>
            {program.qualityAssurance.graduationRequirements && (
              <div className="rounded-lg border p-3 space-y-2">
                <p className="font-medium">毕业要求</p>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">思想道德要求：</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {program.qualityAssurance.graduationRequirements.ideological.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">学分要求：</p>
                  <p className="text-muted-foreground">
                    总学分{program.qualityAssurance.graduationRequirements.requirements.credits.total}，
                    其中必修{program.qualityAssurance.graduationRequirements.requirements.credits.required}学分，
                    选修{program.qualityAssurance.graduationRequirements.requirements.credits.elective}学分。
                    {program.qualityAssurance.graduationRequirements.requirements.credits.note}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">建议证书：</p>
                  <div className="flex flex-wrap gap-1">
                    {program.qualityAssurance.graduationRequirements.requirements.certificates.map((cert, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
