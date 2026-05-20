'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Star } from 'lucide-react'
import { teachingAchievements, departments } from '@/lib/mock-data'

export default function AchievementsShowcasePage() {
  const benchmarks = teachingAchievements.filter((ta) => ta.isBenchmark && ta.status === '已通过')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">标杆案例库</h1>
        <p className="text-muted-foreground">展示优秀教学成果标杆案例</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {benchmarks.map((ta) => (
          <Card key={ta.id} className="relative">
            <div className="absolute top-4 right-4">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{ta.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline">{ta.type}</Badge>
              <div className="text-sm text-muted-foreground">申报人：{ta.applicantName}</div>
              <div className="text-sm text-muted-foreground">所属院系：{departments.find((d) => d.id === ta.departmentId)?.name}</div>
              <div className="text-sm">{ta.content}</div>
            </CardContent>
          </Card>
        ))}
        {benchmarks.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">暂无标杆案例</div>
        )}
      </div>
    </div>
  )
}
