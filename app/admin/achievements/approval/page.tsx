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
import { CheckCircle, XCircle } from 'lucide-react'
import { teachingAchievements, departments } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function AchievementsApprovalPage() {
  const pending = teachingAchievements.filter((ta) => ta.status === '已提交' || ta.status === '审批中')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">成果审批</h1>
        <p className="text-muted-foreground">教学成果申报审批管理</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>成果名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>申报人</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((ta) => (
                <TableRow key={ta.id}>
                  <TableCell className="font-medium">{ta.name}</TableCell>
                  <TableCell>{ta.type}</TableCell>
                  <TableCell>{ta.applicantName}</TableCell>
                  <TableCell>{departments.find((d) => d.id === ta.departmentId)?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ta.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-green-600" onClick={() => toast.success('审批通过')}><CheckCircle className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-600" onClick={() => toast.error('已驳回')}><XCircle className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">暂无待审批成果</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
