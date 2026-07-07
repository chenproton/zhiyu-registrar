'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  CalendarDays,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { teachingPlansV2, type TeachingPlan } from '@/lib/mock-data'

export default function TeachingPlanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string

  const originalPlan = teachingPlansV2.find((p) => p.id === planId)
  const [plan, setPlan] = useState<TeachingPlan | undefined>(originalPlan)
  const [editMode, setEditMode] = useState(false)

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <CalendarDays className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">未找到教学计划</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/operations/teaching-plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回列表
        </Button>
      </div>
    )
  }

  const semesterGroups = new Map<number, typeof plan.entries>()
  plan.entries.forEach((entry) => {
    const list = semesterGroups.get(entry.semester) || []
    list.push(entry)
    semesterGroups.set(entry.semester, list)
  })
  const sortedSemesters = Array.from(semesterGroups.entries()).sort((a, b) => a[0] - b[0])

  const updateEntry = (entryId: string, field: string, value: any) => {
    setPlan((prev) => prev ? {
      ...prev,
      entries: prev.entries.map((e) => e.id === entryId ? { ...e, [field]: value } : e),
    } : prev)
  }

  const handleSave = () => {
    toast.success('教学计划保存成功！')
    setEditMode(false)
  }

  const handleConfirm = () => {
    setPlan((prev) => prev ? { ...prev, status: 'confirmed' } : prev)
    toast.success('教学计划已确认！')
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/operations/teaching-plans')}>
            <ArrowLeft className="h-4 w-4 mr-1" />返回
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {plan.programName} · 教学计划
            </h1>
            <p className="text-sm text-muted-foreground">
              {plan.totalSemesters}个学期 · {plan.entries.length}门课程/岗位
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={plan.status === 'confirmed' ? 'default' : 'outline'} className={cn(plan.status === 'confirmed' && 'bg-emerald-100 text-emerald-700')}>
            {plan.status === 'confirmed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {plan.status === 'draft' ? '草稿' : plan.status === 'generated' ? '已生成' : plan.status === 'adjusting' ? '调整中' : '已确认'}
          </Badge>
          {editMode ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>取消</Button>
              <Button size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-1" />保存</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>编辑</Button>
              {plan.status !== 'confirmed' && (
                <Button size="sm" onClick={handleConfirm}><CheckCircle2 className="h-4 w-4 mr-1" />确认计划</Button>
              )}
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="semester-1">
        <TabsList>
          {sortedSemesters.map(([semester]) => (
            <TabsTrigger key={semester} value={`semester-${semester}`}>第{semester}学期</TabsTrigger>
          ))}
        </TabsList>
        {sortedSemesters.map(([semester, entries]) => (
          <TabsContent key={semester} value={`semester-${semester}`}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">第{semester}学期课程安排（{entries.length}门）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>课程/岗位</TableHead>
                        <TableHead>性质</TableHead>
                        <TableHead>学分</TableHead>
                        <TableHead>总学时</TableHead>
                        <TableHead className="w-24">周学时</TableHead>
                        <TableHead className="w-28">起止周</TableHead>
                        <TableHead>周次模式</TableHead>
                        <TableHead>场地</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.courseName}</TableCell>
                          <TableCell>
                            <Badge variant={entry.nature === '必修' ? 'default' : 'secondary'} className="text-xs">{entry.nature}</Badge>
                          </TableCell>
                          <TableCell>{entry.credits}</TableCell>
                          <TableCell>{entry.totalHours}</TableCell>
                          <TableCell>
                            {editMode ? (
                              <Input type="number" value={entry.weekHours} onChange={(e) => updateEntry(entry.id, 'weekHours', parseInt(e.target.value) || 0)} className="h-8 w-16" />
                            ) : entry.weekHours}
                          </TableCell>
                          <TableCell>
                            {editMode ? (
                              <div className="flex items-center gap-1">
                                <Input type="number" value={entry.startWeek} onChange={(e) => updateEntry(entry.id, 'startWeek', parseInt(e.target.value) || 0)} className="h-8 w-14" />
                                <span>-</span>
                                <Input type="number" value={entry.endWeek} onChange={(e) => updateEntry(entry.id, 'endWeek', parseInt(e.target.value) || 0)} className="h-8 w-14" />
                              </div>
                            ) : (
                              `${entry.startWeek}-${entry.endWeek}周`
                            )}
                          </TableCell>
                          <TableCell>
                            {editMode ? (
                              <select value={entry.weekPattern} onChange={(e) => updateEntry(entry.id, 'weekPattern', e.target.value)} className="h-8 rounded-md border px-2 text-sm">
                                <option value="all">全周</option>
                                <option value="odd">单周</option>
                                <option value="even">双周</option>
                                <option value="intensive">集中</option>
                              </select>
                            ) : (
                              entry.weekPattern === 'all' ? '全周' : entry.weekPattern === 'odd' ? '单周' : entry.weekPattern === 'even' ? '双周' : '集中'
                            )}
                          </TableCell>
                          <TableCell>
                            {editMode ? (
                              <select value={entry.venueTypeRequired} onChange={(e) => updateEntry(entry.id, 'venueTypeRequired', e.target.value)} className="h-8 rounded-md border px-2 text-sm">
                                <option value="教室">教室</option>
                                <option value="机房">机房</option>
                                <option value="实训室">实训室</option>
                                <option value="实验室">实验室</option>
                                <option value="校外基地">校外基地</option>
                              </select>
                            ) : entry.venueTypeRequired}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => router.push('/admin/operations/syllabus?programId=' + plan.programId)}>
          <ArrowRight className="h-4 w-4 mr-1 rotate-180" />查看大纲
        </Button>
        <Button onClick={() => router.push('/admin/operations/scheduling?programId=' + plan.programId)}>
          前往排课<ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
