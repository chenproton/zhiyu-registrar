'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { BarChart3, Save, CheckCircle2 } from 'lucide-react'
import { getTeacherTeachingProgress } from '@/lib/role-utils'
import { teachingProgress } from '@/lib/mock-data'

export default function TeacherProgressPage() {
  const myProgress = getTeacherTeachingProgress()
  const [editing, setEditing] = useState<Record<string, number>>({})

  const handleChange = (id: string, value: string) => {
    const num = parseInt(value) || 0
    setEditing((prev) => ({ ...prev, [id]: num }))
  }

  const handleSave = () => {
    Object.entries(editing).forEach(([id, completedHours]) => {
      const idx = teachingProgress.findIndex((p) => p.id === id)
      if (idx >= 0) {
        teachingProgress[idx].completedHours = Math.min(
          completedHours,
          teachingProgress[idx].plannedHours
        )
      }
    })
    toast.success('教学进度保存成功')
    setEditing({})
  }

  const hasChanges = Object.keys(editing).length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">教学进度</h1>
          <p className="text-muted-foreground mt-1">填报和查看所授课程的教学进度</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            保存修改
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            课程教学进度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myProgress.map((p) => {
              const completed = editing[p.id] !== undefined ? editing[p.id] : p.completedHours
              const percent = Math.round((completed / p.plannedHours) * 100)
              const isCompleted = completed >= p.plannedHours

              return (
                <div key={p.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.courseName}</div>
                      <div className="text-xs text-muted-foreground">
                        班级：{p.classId}
                      </div>
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        已完成
                      </Badge>
                    ) : (
                      <Badge variant="outline">进行中</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">计划学时</div>
                      <div className="font-semibold">{p.plannedHours}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">已完成学时</div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={p.plannedHours}
                          value={completed}
                          onChange={(e) => handleChange(p.id, e.target.value)}
                          className="h-8 w-20"
                        />
                        <span className="text-muted-foreground">/ {p.plannedHours}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">学生平均完成率</div>
                      <div className="font-semibold">{p.studentAvgCompletion}%</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">教学进度</span>
                      <span className="font-medium">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                </div>
              )
            })}
            {myProgress.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">暂无教学进度数据</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
