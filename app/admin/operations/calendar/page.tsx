'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { terms, calendarWeeks } from '@/lib/mock-data'

export default function CalendarPage() {
  const currentTerm = terms.find((t) => t.isCurrent) || terms[0]
  const weeks = calendarWeeks.filter((w) => w.termId === currentTerm.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">教学日历</h1>
          <p className="text-muted-foreground">管理学年学期、周次与节假日安排</p>
        </div>
        <Button>配置节假日</Button>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue={currentTerm.id}>
          <SelectTrigger className="w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {terms.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.year}学年 {t.semester} {t.isCurrent ? '(当前学期)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {currentTerm.startDate} 至 {currentTerm.endDate}
        </div>
      </div>

      <div className="grid gap-3">
        {weeks.map((w) => (
          <Card key={w.id} className={w.weekType !== '教学周' ? 'border-orange-300' : ''}>
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium">第{w.weekNumber}周</div>
                  <div className="text-sm text-muted-foreground w-40">
                    {w.startDate} ~ {w.endDate}
                  </div>
                  <Badge variant={w.weekType === '教学周' ? 'outline' : w.weekType === '考试周' ? 'default' : 'secondary'}>
                    {w.weekType}
                  </Badge>
                  {w.holidayName && <span className="text-sm text-orange-600">{w.holidayName}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
