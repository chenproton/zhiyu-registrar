'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Send } from 'lucide-react'
import { toast } from 'sonner'

const launchPlans = [
  { id: 'plan-001', courseName: '计算机网络技术', teacher: '周建国', className: '计网2301班', major: '计算机网络技术', status: 'draft' },
  { id: 'plan-002', courseName: '软件工程导论', teacher: '吴志明', className: '软件2301班', major: '软件工程', status: 'submitted' },
]

const statusConfig: Record<string, { label: string; badge: string }> = {
  draft: { label: '草稿', badge: 'bg-gray-100 text-gray-700' },
  submitted: { label: '已提交', badge: 'bg-blue-100 text-blue-700' },
  approved: { label: '已通过', badge: 'bg-emerald-100 text-emerald-700' },
}

export default function SecretaryCourseLaunchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">开课计划申报</h1>
        <p className="text-muted-foreground mt-1">根据本届学生人培方案提取本学期应开课程，分配授课老师与班级</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            开课计划列表
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {launchPlans.map((plan) => {
            const cfg = statusConfig[plan.status] || statusConfig.draft
            return (
              <div key={plan.id} className="rounded-lg border p-4 hover:shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {plan.courseName}
                      <Badge className={cfg.badge}>{cfg.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {plan.major} · {plan.className} · 授课教师：{plan.teacher}
                    </div>
                  </div>

                  {plan.status === 'draft' && (
                    <Button size="sm" onClick={() => toast.success('开课计划已提交教务处审核')}>
                      <Send className="h-4 w-4 mr-1" /> 提交审核
                    </Button>
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
