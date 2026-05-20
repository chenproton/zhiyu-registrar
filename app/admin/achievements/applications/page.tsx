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
import { Plus } from 'lucide-react'
import { teachingAchievements, departments } from '@/lib/mock-data'

export default function AchievementsApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">成果申报</h1>
          <p className="text-muted-foreground">教师教学成果申报入口</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />申报成果</Button>
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
              {teachingAchievements.map((ta) => (
                <TableRow key={ta.id}>
                  <TableCell className="font-medium">{ta.name}</TableCell>
                  <TableCell>{ta.type}</TableCell>
                  <TableCell>{ta.applicantName}</TableCell>
                  <TableCell>{departments.find((d) => d.id === ta.departmentId)?.name}</TableCell>
                  <TableCell>
                    <Badge variant={ta.status === '已通过' ? 'default' : ta.status === '已驳回' ? 'destructive' : 'outline'}>
                      {ta.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">查看</Button>
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
