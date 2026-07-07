'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrainingProgram } from '@/lib/mock-data'
import { Calculator } from 'lucide-react'

export default function TabCreditHours({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const ch = program.creditHours || {
    totalCredits: 0, totalHours: 0, theoryHours: 0, practiceHours: 0,
    publicBasicCredits: 0, publicBasicHours: 0,
    professionalBasicCredits: 0, professionalBasicHours: 0,
    professionalCoreCredits: 0, professionalCoreHours: 0,
    professionalExtendedCredits: 0, professionalExtendedHours: 0,
    practiceCredits: 0, practiceHours: 0,
  }

  const update = (patch: Partial<typeof ch>) => {
    onChange({ ...program, creditHours: { ...ch, ...patch } })
  }

  const autoCalculate = () => {
    const curriculum = program.curriculum
    if (!curriculum || curriculum.length === 0) return

    const sumCredits = (arr: { credits: number }[]) => arr.reduce((s, c) => s + (Number(c.credits) || 0), 0)
    const sumHours = (arr: { hours: number }[]) => arr.reduce((s, c) => s + (Number(c.hours) || 0), 0)

    const publicBasic = curriculum.filter((c) => c.courseTypeLabel?.startsWith('公共基础'))
    const profBasic = curriculum.filter((c) => c.courseTypeLabel === '专业基础课程')
    const profCore = curriculum.filter((c) => c.courseTypeLabel === '专业核心课程')
    const profExtended = curriculum.filter((c) => c.courseTypeLabel === '拓展课程')
    const practice = curriculum.filter((c) => c.courseType === '场景')

    const publicBasicCredits = sumCredits(publicBasic)
    const publicBasicHours = sumHours(publicBasic)
    const professionalBasicCredits = sumCredits(profBasic)
    const professionalBasicHours = sumHours(profBasic)
    const professionalCoreCredits = sumCredits(profCore)
    const professionalCoreHours = sumHours(profCore)
    const professionalExtendedCredits = sumCredits(profExtended)
    const professionalExtendedHours = sumHours(profExtended)
    const practiceCredits = sumCredits(practice)
    const practiceHours = sumHours(practice)

    const totalCredits = publicBasicCredits + professionalBasicCredits + professionalCoreCredits + professionalExtendedCredits + practiceCredits
    const totalHours = publicBasicHours + professionalBasicHours + professionalCoreHours + professionalExtendedHours + practiceHours
    const theoryHours = totalHours - practiceHours

    update({
      totalCredits, totalHours, theoryHours, practiceHours,
      publicBasicCredits, publicBasicHours,
      professionalBasicCredits, professionalBasicHours,
      professionalCoreCredits, professionalCoreHours,
      professionalExtendedCredits, professionalExtendedHours,
      practiceCredits, practiceHours,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          可从课程设置自动汇总，也可手动调整
        </p>
        <Button variant="outline" size="sm" onClick={autoCalculate}>
          <Calculator className="h-4 w-4 mr-1" /> 从课程自动汇总
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 space-y-1">
            <p className="text-sm text-muted-foreground">总学分</p>
            <Input
              type="number"
              value={ch.totalCredits}
              onChange={(e) => update({ totalCredits: Number(e.target.value) })}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 space-y-1">
            <p className="text-sm text-muted-foreground">总学时</p>
            <Input
              type="number"
              value={ch.totalHours}
              onChange={(e) => update({ totalHours: Number(e.target.value) })}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 space-y-1">
            <p className="text-sm text-muted-foreground">理论学时</p>
            <Input
              type="number"
              value={ch.theoryHours}
              onChange={(e) => update({ theoryHours: Number(e.target.value) })}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 space-y-1">
            <p className="text-sm text-muted-foreground">实践学时</p>
            <Input
              type="number"
              value={ch.practiceHours}
              onChange={(e) => update({ practiceHours: Number(e.target.value) })}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50/50">
          <CardContent className="pt-4 pb-3 space-y-2">
            <p className="text-sm font-medium text-blue-700">公共基础</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">学分</Label>
                <Input type="number" value={ch.publicBasicCredits} onChange={(e) => update({ publicBasicCredits: Number(e.target.value) })} className="h-8" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">学时</Label>
                <Input type="number" value={ch.publicBasicHours} onChange={(e) => update({ publicBasicHours: Number(e.target.value) })} className="h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50">
          <CardContent className="pt-4 pb-3 space-y-2">
            <p className="text-sm font-medium text-purple-700">专业基础</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">学分</Label>
                <Input type="number" value={ch.professionalBasicCredits} onChange={(e) => update({ professionalBasicCredits: Number(e.target.value) })} className="h-8" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">学时</Label>
                <Input type="number" value={ch.professionalBasicHours} onChange={(e) => update({ professionalBasicHours: Number(e.target.value) })} className="h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50">
          <CardContent className="pt-4 pb-3 space-y-2">
            <p className="text-sm font-medium text-purple-700">专业核心</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">学分</Label>
                <Input type="number" value={ch.professionalCoreCredits} onChange={(e) => update({ professionalCoreCredits: Number(e.target.value) })} className="h-8" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">学时</Label>
                <Input type="number" value={ch.professionalCoreHours} onChange={(e) => update({ professionalCoreHours: Number(e.target.value) })} className="h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50">
          <CardContent className="pt-4 pb-3 space-y-2">
            <p className="text-sm font-medium text-purple-700">专业拓展</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">学分</Label>
                <Input type="number" value={ch.professionalExtendedCredits} onChange={(e) => update({ professionalExtendedCredits: Number(e.target.value) })} className="h-8" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">学时</Label>
                <Input type="number" value={ch.professionalExtendedHours} onChange={(e) => update({ professionalExtendedHours: Number(e.target.value) })} className="h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50">
          <CardContent className="pt-4 pb-3 space-y-2">
            <p className="text-sm font-medium text-amber-700">实践环节</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">学分</Label>
                <Input type="number" value={ch.practiceCredits} onChange={(e) => update({ practiceCredits: Number(e.target.value) })} className="h-8" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">学时</Label>
                <Input type="number" value={ch.practiceHours} onChange={(e) => update({ practiceHours: Number(e.target.value) })} className="h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
