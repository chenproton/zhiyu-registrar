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
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { courseAdjustments, timetableEntries, faculty, venues } from '@/lib/mock-data'

export default function AdjustmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">调课管理</h1>
          <p className="text-muted-foreground">调课申请、审批与通知管理</p>
        </div>
        <Button>发起调课申请</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>原课程</TableHead>
                <TableHead>调整类型</TableHead>
                <TableHead>新时间/地点</TableHead>
                <TableHead>申请人</TableHead>
                <TableHead>原因</TableHead>
                <TableHead>审批状态</TableHead>
                <TableHead>通知状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseAdjustments.map((ca) => {
                const orig = timetableEntries.find((e) => e.id === ca.originalEntryId)
                return (
                  <TableRow key={ca.id}>
                    <TableCell>
                      <div className="font-medium">{orig?.courseName}</div>
                      <div className="text-xs text-muted-foreground">
                        周{orig?.dayOfWeek} {orig?.period} · {venues.find((v) => v.id === orig?.venueId)?.name}
                      </div>
                    </TableCell>
                    <TableCell><Badge>{ca.type}</Badge></TableCell>
                    <TableCell>
                      {ca.type === '调课' ? (
                        <div className="text-xs">
                          <div>周{ca.newDayOfWeek} {ca.newPeriod}</div>
                          <div>{venues.find((v) => v.id === ca.newVenueId)?.name || '—'}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>{ca.applicant}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{ca.reason}</TableCell>
                    <TableCell>
                      <Badge variant={ca.status === 'approved' ? 'default' : ca.status === 'rejected' ? 'destructive' : 'outline'}>
                        {ca.status === 'approved' ? '已通过' : ca.status === 'rejected' ? '已驳回' : '待审批'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ca.notifyStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ca.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-600"><CheckCircle className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-600"><XCircle className="h-4 w-4" /></Button>
                          </>
                        )}
                      </div>
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
