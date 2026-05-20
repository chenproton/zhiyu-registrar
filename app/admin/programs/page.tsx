'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Eye, FileText } from 'lucide-react'
import { trainingPrograms, majors } from '@/lib/mock-data'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  pending: { label: '审批中', variant: 'outline' },
  published: { label: '已发布', variant: 'default' },
  deprecated: { label: '已废止', variant: 'destructive' },
}

export default function ProgramsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">培养方案列表</h1>
          <p className="text-muted-foreground">管理各专业人才培养方案编制与版本</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建方案</Button>
      </div>

      <div className="grid gap-4">
        {trainingPrograms.map((tp) => (
          <Card key={tp.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {tp.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    方案编码：{tp.code} · 适用专业：{majors.find((m) => m.id === tp.majorId)?.name} · {tp.entryYear}级入学
                  </CardDescription>
                </div>
                <Badge variant={statusMap[tp.status].variant}>{statusMap[tp.status].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">培养层次</p>
                  <p className="font-medium">{tp.level} · {tp.duration}年</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">总学分</p>
                  <p className="font-medium">{tp.totalCredits}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">必修/选修/实践</p>
                  <p className="font-medium">{tp.requiredCredits} / {tp.electiveCredits} / {tp.practiceCredits}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">课程数量</p>
                  <p className="font-medium">{tp.courses.length} 门</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === tp.id ? null : tp.id)}>
                  <Eye className="h-4 w-4 mr-1" />
                  {expandedId === tp.id ? '收起课程计划' : '查看课程计划'}
                </Button>
              </div>

              {expandedId === tp.id && (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>课程编码</TableHead>
                        <TableHead>课程名称</TableHead>
                        <TableHead>学分</TableHead>
                        <TableHead>学时</TableHead>
                        <TableHead>学期</TableHead>
                        <TableHead>课程性质</TableHead>
                        <TableHead>考核方式</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tp.courses.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.code}</TableCell>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.credits}</TableCell>
                          <TableCell>{c.hours}</TableCell>
                          <TableCell>第{c.semester}学期</TableCell>
                          <TableCell>
                            <Badge variant="outline">{c.nature}</Badge>
                          </TableCell>
                          <TableCell>{c.assessment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
