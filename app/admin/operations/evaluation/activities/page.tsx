'use client'

import { useState } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Play, Square, Filter } from 'lucide-react'
import { evaluationActivities, terms } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function EvaluationActivitiesPage() {
  const [filterTaskType, setFilterTaskType] = useState<'all' | 'traditional' | 'scene'>('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任务评价活动</h1>
          <p className="text-muted-foreground">创建与管理教学质量评价活动，可按任务类型精确筛选</p>
        </div>
        <Button onClick={() => toast('新建活动功能开发中')}><Plus className="h-4 w-4 mr-2" />新建活动</Button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterTaskType} onValueChange={(v) => setFilterTaskType(v as typeof filterTaskType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="评价任务范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部任务类型</SelectItem>
            <SelectItem value="traditional">仅传统教学任务</SelectItem>
            <SelectItem value="scene">仅场景教学任务</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>活动名称</TableHead>
                <TableHead>学期</TableHead>
                <TableHead>评价范围</TableHead>
                <TableHead>任务类型筛选</TableHead>
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
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {filterTaskType === 'all' ? '全部' : filterTaskType === 'traditional' ? '传统教学' : '场景教学'}
                    </Badge>
                  </TableCell>
                  <TableCell>{ea.startTime} ~ {ea.endTime}</TableCell>
                  <TableCell>
                    <Badge variant={ea.status === 'active' ? 'default' : ea.status === 'ended' ? 'secondary' : 'outline'}>
                      {ea.status === 'active' ? '进行中' : ea.status === 'ended' ? '已结束' : '未开始'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ea.status === 'not_started' && <Button variant="ghost" size="icon" onClick={() => toast.success('活动已开始')}><Play className="h-4 w-4" /></Button>}
                      {ea.status === 'active' && <Button variant="ghost" size="icon" onClick={() => toast.success('活动已结束')}><Square className="h-4 w-4" /></Button>}
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
