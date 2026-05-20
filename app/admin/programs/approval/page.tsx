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
import { trainingPrograms, majors } from '@/lib/mock-data'

export default function ProgramsApprovalPage() {
  const pending = trainingPrograms.filter((tp) => tp.status === 'draft' || tp.status === 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">培养方案审批</h1>
        <p className="text-muted-foreground">审批待发布的培养方案</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>方案名称</TableHead>
                <TableHead>适用专业</TableHead>
                <TableHead>入学年级</TableHead>
                <TableHead>提交人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((tp) => (
                <TableRow key={tp.id}>
                  <TableCell className="font-medium">{tp.name}</TableCell>
                  <TableCell>{majors.find((m) => m.id === tp.majorId)?.name}</TableCell>
                  <TableCell>{tp.entryYear}级</TableCell>
                  <TableCell>院系管理员</TableCell>
                  <TableCell>
                    <Badge variant={tp.status === 'pending' ? 'outline' : 'secondary'}>
                      {tp.status === 'pending' ? '审批中' : '草稿'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-green-600"><CheckCircle className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-600"><XCircle className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    暂无待审批方案
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
