'use client'

import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Play, Square } from 'lucide-react'
import { evaluationActivities, terms } from '@/lib/mock-data'

export default function EvaluationActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">评价活动</h1>
          <p className="text-muted-foreground">创建与管理教学质量评价活动</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建活动</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动名称</TableHead>
                <TableHead>学期</TableHead>
                <TableHead>评价范围</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluationActivities.map((ea) => (
                <TableRow key={ea.id}>
                  <TableCell className="font-medium">{ea.name}</TableCell>
                  <TableCell>{terms.find((t) => t.id === ea.termId)?.year} {terms.find((t) => t.id === ea.termId)?.semester}</TableCell>
                  <TableCell>{ea.scope}</TableCell>
                  <TableCell>{ea.startTime} ~ {ea.endTime}</TableCell>
                  <TableCell>
                    <Badge variant={ea.status === 'active' ? 'default' : ea.status === 'ended' ? 'secondary' : 'outline'}>
                      {ea.status === 'active' ? '进行中' : ea.status === 'ended' ? '已结束' : '未开始'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ea.status === 'not_started' && <Button variant="ghost" size="icon"><Play className="h-4 w-4" /></Button>}
                      {ea.status === 'active' && <Button variant="ghost" size="icon"><Square className="h-4 w-4" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
