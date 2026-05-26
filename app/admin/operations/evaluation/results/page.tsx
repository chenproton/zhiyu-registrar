'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Filter } from 'lucide-react'
import { evaluationRecords, tasks } from '@/lib/mock-data'

export default function EvaluationResultsPage() {
  const [filterTaskId, setFilterTaskId] = useState<string>('all')

  const groups = [
    { key: 'student', label: '学生评教' },
    { key: 'internal', label: '内部评价' },
    { key: 'expert', label: '专家评价' },
    { key: 'enterprise', label: '企业评价' },
  ]

  const roleMap: Record<string, string> = {
    student: '学生',
    internal: '教师',
    expert: '专家',
    enterprise: '企业导师',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">任务评价结果汇总</h1>
        <p className="text-muted-foreground">按任务实例维度汇总评价结果，同一教师的不同任务可独立评价</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterTaskId} onValueChange={setFilterTaskId}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="筛选任务" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部任务</SelectItem>
            {tasks.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 任务评价概览卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">总评价记录</div>
              <div className="text-xl font-bold">{evaluationRecords.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">平均总分</div>
              <div className="text-xl font-bold">
                {(evaluationRecords.reduce((s, r) => s + r.totalScore, 0) / evaluationRecords.length).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">覆盖任务数</div>
              <div className="text-xl font-bold">{new Set(evaluationRecords.map((r) => r.evaluateeName)).size}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="student">
        <TabsList>
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>{g.label}</TabsTrigger>
          ))}
        </TabsList>

        {groups.map((g) => (
          <TabsContent key={g.key} value={g.key} className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>评价人</TableHead>
                      <TableHead>身份</TableHead>
                      <TableHead>被评价对象</TableHead>
                      <TableHead>关联任务</TableHead>
                      <TableHead>各维度得分</TableHead>
                      <TableHead>总评</TableHead>
                      <TableHead>评语</TableHead>
                      <TableHead>提交时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationRecords
                      .filter((r) => r.evaluatorRole === roleMap[g.key])
                      .map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.evaluatorName}</TableCell>
                          <TableCell><Badge variant="outline">{r.evaluatorRole}</Badge></TableCell>
                          <TableCell className="font-medium">{r.evaluateeName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {tasks.find((t) => t.facultyName === r.evaluateeName)?.courseName || '—'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs space-y-0.5">
                              {Object.entries(r.scores).map(([k, v]) => (
                                <div key={k}>{k}: {v}</div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{r.totalScore}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{r.comment || '—'}</TableCell>
                          <TableCell>{r.submittedAt}</TableCell>
                        </TableRow>
                      ))}
                    {evaluationRecords.filter((r) => r.evaluatorRole === roleMap[g.key]).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">暂无数据</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
