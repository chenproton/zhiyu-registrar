'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ArrowRight, FileText, Award } from 'lucide-react'
import { getTeacherSyllabuses } from '@/lib/role-utils'
import { cn } from '@/lib/utils'

export default function TeacherSyllabusPage() {
  const router = useRouter()
  const mySyllabuses = getTeacherSyllabuses()

  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-700' },
    generated: { label: '已生成', color: 'bg-blue-100 text-blue-700' },
    editing: { label: '编辑中', color: 'bg-amber-100 text-amber-700' },
    finalized: { label: '已定稿', color: 'bg-emerald-100 text-emerald-700' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">课程与能力目标</h1>
        <p className="text-muted-foreground mt-1">查看和编辑所授课程的课程与能力目标</p>
      </div>

      {mySyllabuses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>暂无相关课程与能力目标</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {mySyllabuses.map((s) => {
            const status = statusMap[s.status] || { label: s.status, color: 'bg-gray-100 text-gray-700' }
            return (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{s.courseName}</h3>
                      <p className="text-sm text-muted-foreground">代码：{s.courseCode}</p>
                    </div>
                    <Badge className={cn('shrink-0', status.color)}>{status.label}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold">{s.credits}</div>
                      <div className="text-xs text-muted-foreground">学分</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold">{s.totalHours}</div>
                      <div className="text-xs text-muted-foreground">总学时</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold">{s.chapters.length}</div>
                      <div className="text-xs text-muted-foreground">章节数</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="truncate">{s.teachingMethods.slice(0, 40)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5" />
                      <span>考核：{s.assessmentMethod.slice(0, 30)}...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/admin/operations/syllabus/${s.id}`)}
                    >
                      查看 <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/teacher/syllabus/${s.id}`)}
                    >
                      编辑 <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
