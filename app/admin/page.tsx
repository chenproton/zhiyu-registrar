'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  Award,
  TrendingUp,
} from 'lucide-react'

const stats = [
  { title: '在籍学生', value: '3,248', icon: Users, change: '+120 本学期' },
  { title: '专任教师', value: '186', icon: GraduationCap, change: '+8 本学期' },
  { title: '开设课程', value: '432', icon: BookOpen, change: '+24 本学期' },
  { title: '教学班数', value: '156', icon: CalendarDays, change: '正常运行' },
  { title: '待认定成绩', value: '1,205', icon: TrendingUp, change: '待处理' },
  { title: '教学成果', value: '28', icon: Award, change: '本年申报' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">平台总览</h1>
        <p className="text-muted-foreground">数字教务平台运行概况与关键指标</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">本学期教学运行状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>排课完成率</span>
              <span className="font-medium">98.5%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '98.5%' }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>成绩认定进度</span>
              <span className="font-medium">76.2%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '76.2%' }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>教学评价参与率</span>
              <span className="font-medium">89.0%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '89%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">待办事项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              '2026-2027学年第一学期排课任务待发布',
              '软件工程专业 2026 级培养方案待审批',
              '12 条调课申请待审批',
              '3 门课程成绩待院系审核',
              '2026 届毕业资格学历认定待启动',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
