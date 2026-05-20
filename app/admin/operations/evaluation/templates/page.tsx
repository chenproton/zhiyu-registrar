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
import { Plus, Pencil } from 'lucide-react'
import { evaluationTemplates } from '@/lib/mock-data'

export default function EvaluationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">评价模板</h1>
          <p className="text-muted-foreground">配置教学质量评价模板与评价维度</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建模板</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模板名称</TableHead>
                <TableHead>评价主体</TableHead>
                <TableHead>评价维度</TableHead>
                <TableHead>评价方式</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluationTemplates.map((et) => (
                <TableRow key={et.id}>
                  <TableCell className="font-medium">{et.name}</TableCell>
                  <TableCell>{et.subject}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {et.dimensions.map((d) => (
                        <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{et.method}</TableCell>
                  <TableCell>
                    <Badge variant={et.status === 'published' ? 'default' : 'secondary'}>
                      {et.status === 'published' ? '已发布' : et.status === 'draft' ? '草稿' : '已停用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
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
