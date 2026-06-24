'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const syncRecords = [
  { id: 'sync-001', courseName: '计算机网络技术', className: '计网2301班', onlineScore: 86, status: 'synced', syncTime: '2026-06-23 14:30' },
  { id: 'sync-002', courseName: '软件工程导论', className: '软件2301班', onlineScore: 78, status: 'synced', syncTime: '2026-06-23 14:32' },
  { id: 'sync-003', courseName: '数据结构与算法', className: '计科2301班', onlineScore: null, status: 'pending', syncTime: '-' },
]

const statusConfig: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
  synced: { label: '已回传', badge: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="h-4 w-4 text-emerald-600" /> },
  pending: { label: '待回传', badge: 'bg-amber-100 text-amber-700', icon: <AlertCircle className="h-4 w-4 text-amber-600" /> },
}

export default function ProcessDataSyncPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">过程数据回传</h1>
        <p className="text-muted-foreground mt-1">课程平台线上学习过程成绩自动回传教务系统，支撑总评成绩合成</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{syncRecords.length}</div>
            <div className="text-xs text-muted-foreground">待同步课程</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{syncRecords.filter((r) => r.status === 'synced').length}</div>
            <div className="text-xs text-muted-foreground">已回传</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{syncRecords.filter((r) => r.status === 'pending').length}</div>
            <div className="text-xs text-muted-foreground">待回传</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            回传记录
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {syncRecords.map((record) => {
            const cfg = statusConfig[record.status] || statusConfig.pending
            return (
              <div key={record.id} className="rounded-lg border p-4 hover:shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {record.courseName}
                      <Badge className={cfg.badge}>{cfg.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {record.className} · 回传时间：{record.syncTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      线上过程成绩：{record.onlineScore ?? '未回传'}
                    </div>
                    {record.status === 'pending' && (
                      <Button size="sm" onClick={() => toast.success('已发起过程数据回传')}>
                        <RefreshCw className="h-4 w-4 mr-1" /> 立即回传
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
