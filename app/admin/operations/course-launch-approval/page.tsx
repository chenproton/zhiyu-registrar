'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'

const applications = [
  { id: 'app-001', courseName: '计算机网络技术', major: '计算机网络技术', teacher: '周建国', className: '计网2301班', status: 'pending' },
  { id: 'app-002', courseName: '软件工程导论', major: '软件工程', teacher: '吴志明', className: '软件2301班', status: 'approved' },
  { id: 'app-003', courseName: '数据结构与算法', major: '计算机科学与技术', teacher: '郑华', className: '计科2301班', status: 'pending' },
]

const statusConfig: Record<string, { label: string; badge: string }> = {
  pending: { label: '待审批', badge: 'bg-amber-100 text-amber-700' },
  approved: { label: '已通过', badge: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '已驳回', badge: 'bg-red-100 text-red-700' },
}

export default function CourseLaunchApprovalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">开课计划审批</h1>
        <p className="text-muted-foreground mt-1">审核二级学院提交的开课计划申报，生成学期开课任务</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            开课计划申报审批
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {applications.map((app) => {
            const cfg = statusConfig[app.status] || statusConfig.pending
            return (
              <div key={app.id} className="rounded-lg border p-4 hover:shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {app.courseName}
                      <Badge className={cfg.badge}>{cfg.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.major} · {app.className} · 授课教师：{app.teacher}
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.success('已驳回申报')}>
                        <XCircle className="h-4 w-4 mr-1" /> 驳回
                      </Button>
                      <Button size="sm" onClick={() => toast.success('已通过申报')}>
                        <CheckCircle className="h-4 w-4 mr-1" /> 通过
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
