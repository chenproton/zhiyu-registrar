'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { TrainingProgram } from '@/lib/mock-data'
import {
  ArrowLeft,
  Save,
  Send,
  BookOpen,
  Briefcase,
  Target,
  GraduationCap,
  Clock,
  Users,
  School,
  ShieldCheck,
  LayoutList,
} from 'lucide-react'
import TabBasicInfo from './tabs/tab-basic-info'
import TabCareerOrientation from './tabs/tab-career-orientation'
import TabTrainingSpecs from './tabs/tab-training-specs'
import TabCurriculum from './tabs/tab-curriculum'
import TabCreditHours from './tabs/tab-credit-hours'
import TabFacultyTeam from './tabs/tab-faculty-team'
import TabTeachingConditions from './tabs/tab-teaching-conditions'
import TabQualityAssurance from './tabs/tab-quality-assurance'

const tabs = [
  { id: 'basic', label: '基本信息', icon: BookOpen },
  { id: 'career', label: '职业面向', icon: Briefcase },
  { id: 'specs', label: '培养目标与规格', icon: Target },
  { id: 'curriculum', label: '课程设置', icon: LayoutList },
  { id: 'hours', label: '学时统计', icon: Clock },
  { id: 'faculty', label: '师资队伍', icon: Users },
  { id: 'conditions', label: '教学条件', icon: School },
  { id: 'quality', label: '质量保障', icon: ShieldCheck },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  pending: { label: '待审核', variant: 'outline' },
  published: { label: '已发布', variant: 'default' },
  deprecated: { label: '已停用', variant: 'destructive' },
}

export default function ProgramEditForm({
  initialProgram,
  mode,
  onSave,
}: {
  initialProgram: TrainingProgram
  mode: 'new' | 'edit'
  onSave: (program: TrainingProgram) => void
}) {
  const router = useRouter()
  const [program, setProgram] = useState<TrainingProgram>(initialProgram)
  const [activeTab, setActiveTab] = useState('basic')
  const [saving, setSaving] = useState(false)

  const handleSave = (publish = false) => {
    if (!program.name || !program.code) {
      toast.error('请填写方案名称和编码')
      setActiveTab('basic')
      return
    }
    if (!program.majorId) {
      toast.error('请选择面向专业')
      setActiveTab('basic')
      return
    }
    setSaving(true)
    const toSave = publish ? { ...program, status: 'published' as const } : program
    onSave(toSave)
    toast.success(publish ? '方案已发布' : '草稿已保存')
    setSaving(false)
    router.push('/admin/programs')
  }

  const status = statusMap[program.status] || { label: program.status, variant: 'secondary' as const }

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/programs')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回列表
          </Button>
          <div>
            <h1 className="text-lg font-bold">
              {mode === 'new' ? '新建培养方案' : '编辑培养方案'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {program.name || '未命名方案'} · {program.code || '无编码'}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-1" />
            保存草稿
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Send className="h-4 w-4 mr-1" />
            发布方案
          </Button>
        </div>
      </div>

      {/* Tab 导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex w-auto">
            {tabs.map((t) => {
              const Icon = t.icon
              return (
                <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="basic" className="space-y-4">
          <TabBasicInfo program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="career" className="space-y-4">
          <TabCareerOrientation program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="specs" className="space-y-4">
          <TabTrainingSpecs program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="curriculum" className="space-y-4">
          <TabCurriculum program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="hours" className="space-y-4">
          <TabCreditHours program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="faculty" className="space-y-4">
          <TabFacultyTeam program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="conditions" className="space-y-4">
          <TabTeachingConditions program={program} onChange={setProgram} />
        </TabsContent>
        <TabsContent value="quality" className="space-y-4">
          <TabQualityAssurance program={program} onChange={setProgram} />
        </TabsContent>
      </Tabs>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={() => router.push('/admin/programs')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          取消返回
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-1" />
            保存草稿
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Send className="h-4 w-4 mr-1" />
            发布方案
          </Button>
        </div>
      </div>
    </div>
  )
}
