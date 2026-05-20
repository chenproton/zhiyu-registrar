'use client'

import { Card, CardContent } from '@/components/ui/card'
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
import { evaluationRecords } from '@/lib/mock-data'

export default function EvaluationResultsPage() {
  const groups = [
    { key: 'student', label: '学生评教' },
    { key: 'internal', label: '内部评价' },
    { key: 'expert', label: '专家评价' },
    { key: 'enterprise', label: '企业评价' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">评价结果汇总</h1>
        <p className="text-muted-foreground">按评价主体维度汇总评价结果</p>
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
                      <TableHead>类型</TableHead>
                      <TableHead>各维度得分</TableHead>
                      <TableHead>总评</TableHead>
                      <TableHead>评语</TableHead>
                      <TableHead>提交时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationRecords
                      .filter((r) => r.evaluatorRole === (g.key === 'student' ? '学生' : g.key === 'internal' ? '教师' : g.key === 'expert' ? '专家' : '企业导师'))
                      .map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.evaluatorName}</TableCell>
                          <TableCell><Badge variant="outline">{r.evaluatorRole}</Badge></TableCell>
                          <TableCell>{r.evaluateeName}</TableCell>
                          <TableCell>{r.evaluateeType}</TableCell>
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
                    {evaluationRecords.filter((r) => r.evaluatorRole === (g.key === 'student' ? '学生' : g.key === 'internal' ? '教师' : g.key === 'expert' ? '专家' : '企业导师')).length === 0 && (
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
