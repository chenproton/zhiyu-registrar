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
import { Plus, Pencil, Star } from 'lucide-react'
import { evaluationTemplates } from '@/lib/mock-data'
import { toast } from 'sonner'

// 扩展的维度说明（任务评价新增维度）
const extendedDimensions: Record<string, string[]> = {
  'et1': ['教学态度', '教学内容', '教学方法', '教学效果', '任务设计合理性', '资源准备充分性'],
  'et2': ['教学态度', '教学内容', '教学方法', '教学效果', '进度把控'],
  'et3': ['教学态度', '教学内容', '教学方法', '教学效果', '能力达成', '场景教学组织'],
  'et4': ['企业实践指导', '能力达成', '场景教学组织'],
}

export default function EvaluationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">任务评价模板</h1>
          <p className="text-muted-foreground">配置教学质量评价模板，支持任务维度扩展</p>
        </div>
        <Button onClick={() => toast('新建模板功能开发中')}><Plus className="h-4 w-4 mr-2" />新建模板</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模板名称</TableHead>
                <TableHead>评价主体</TableHead>
                <TableHead>评价维度</TableHead>
                <TableHead>新增任务维度</TableHead>
                <TableHead>评价方式</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluationTemplates.map((et) => {
                const extraDims = extendedDimensions[et.id] || et.dimensions
                const baseDims = et.dimensions
                const newDims = extraDims.filter((d) => !baseDims.includes(d))
                return (
                  <TableRow key={et.id}>
                    <TableCell className="font-medium">{et.name}</TableCell>
                    <TableCell>{et.subject}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {baseDims.map((d) => (
                          <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {newDims.map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {d}
                          </Badge>
                        ))}
                        {newDims.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>{et.method}</TableCell>
                    <TableCell>
                      <Badge variant={et.status === 'published' ? 'default' : 'secondary'}>
                        {et.status === 'published' ? '已发布' : et.status === 'draft' ? '草稿' : '已停用'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => toast('编辑模板')}><Pencil className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
