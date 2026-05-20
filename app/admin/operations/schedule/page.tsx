'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, CheckCircle, Publish } from 'lucide-react'
import { timetableEntries, classes, faculty, venues } from '@/lib/mock-data'

const days = ['周一', '周二', '周三', '周四', '周五']
const periods = ['1-2节', '3-4节', '5-6节', '7-8节']

function ScheduleGrid({ entries }: { entries: typeof timetableEntries }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-6 bg-muted">
        <div className="p-3 text-sm font-medium border-r">节次 / 星期</div>
        {days.map((d) => (
          <div key={d} className="p-3 text-sm font-medium text-center border-r last:border-r-0">{d}</div>
        ))}
      </div>
      {periods.map((p) => (
        <div key={p} className="grid grid-cols-6 border-t">
          <div className="p-3 text-sm text-muted-foreground border-r bg-muted/30">{p}</div>
          {[1, 2, 3, 4, 5].map((d) => {
            const entry = entries.find((e) => e.dayOfWeek === d && e.period === p)
            return (
              <div key={d} className="p-2 border-r last:border-r-0 min-h-[80px]">
                {entry && (
                  <div className="bg-primary/5 rounded p-2 text-xs space-y-1">
                    <div className="font-medium">{entry.courseName}</div>
                    <div className="text-muted-foreground">{faculty.find((f) => f.id === entry.facultyId)?.name}</div>
                    <div className="text-muted-foreground">{venues.find((v) => v.id === entry.venueId)?.name}</div>
                    {entry.nature === '场景教学' && !entry.externalPlatformId && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>未关联场景</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function SchedulePage() {
  const [view, setView] = useState('class')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">排课管理</h1>
          <p className="text-muted-foreground">排课任务创建、调整与发布</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1"><CheckCircle className="h-3 w-3 text-green-600" />冲突检测通过</Badge>
          <Button>发布课表</Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="class">按班级查看</TabsTrigger>
          <TabsTrigger value="teacher">按教师查看</TabsTrigger>
          <TabsTrigger value="venue">按场地查看</TabsTrigger>
        </TabsList>

        <TabsContent value="class" className="space-y-4">
          {classes.slice(0, 3).map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="font-medium">{c.name}</div>
                <ScheduleGrid entries={timetableEntries.filter((e) => e.classId === c.id)} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="teacher" className="space-y-4">
          {faculty.slice(0, 3).map((f) => (
            <Card key={f.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="font-medium">{f.name} ({f.title})</div>
                <ScheduleGrid entries={timetableEntries.filter((e) => e.facultyId === f.id)} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="venue" className="space-y-4">
          {venues.slice(0, 3).map((v) => (
            <Card key={v.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="font-medium">{v.name}</div>
                <ScheduleGrid entries={timetableEntries.filter((e) => e.venueId === v.id)} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
