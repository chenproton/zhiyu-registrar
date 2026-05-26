'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

export default function PublicationPage() {
  const records = [
    { title: '2025-2026学年第二学期期末成绩公告', type: '成绩公告', status: '已发布', date: '2026-07-10' },
    { title: '2026届毕业资格学历认定结果', type: '学历认定', status: '待发布', date: '—' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">认定发布</h1>
          <p className="text-muted-foreground">成绩公告与学历认定结果发布管理</p>
        </div>
      </div>

      <div className="grid gap-4">
        {records.map((r, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">类型：{r.type} · 发布日期：{r.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={r.status === '已发布' ? 'default' : 'outline'}>{r.status}</Badge>
                  {r.status === '待发布' && <Button size="sm" onClick={() => toast.success('发布成功')}><Send className="h-4 w-4 mr-1" />发布</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
