'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { BookOpen, Save } from 'lucide-react'
import { toast } from 'sonner'

const courses = [
  { id: 'co-001', code: 'CN101', name: '计算机网络技术', major: '计算机网络技术', isHybrid: true, onlineHours: 24, offlineHours: 36 },
  { id: 'co-002', code: 'SE201', name: '软件工程导论', major: '软件工程', isHybrid: true, onlineHours: 20, offlineHours: 40 },
  { id: 'co-003', code: 'AI301', name: '人工智能基础', major: '人工智能', isHybrid: false, onlineHours: 0, offlineHours: 48 },
  { id: 'co-004', code: 'DS102', name: '数据结构与算法', major: '计算机科学与技术', isHybrid: true, onlineHours: 16, offlineHours: 48 },
]

export default function HybridSettingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">混合式课程标注</h1>
        <p className="text-muted-foreground mt-1">在人才培养方案中标注混合式课程，配置线上线下学时</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            课程混合式属性设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border p-4 gap-4"
            >
              <div className="space-y-1">
                <div className="font-medium flex items-center gap-2">
                  {course.name}
                  {course.isHybrid && (
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">混合式</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {course.code} · {course.major} · 总学时 {course.onlineHours + course.offlineHours}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-sm text-muted-foreground">
                  线上 {course.onlineHours}h / 线下 {course.offlineHours}h
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">混合式</span>
                  <Switch defaultChecked={course.isHybrid} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success('混合式课程标注已保存')}>
          <Save className="h-4 w-4 mr-1" /> 保存标注
        </Button>
      </div>
    </div>
  )
}
