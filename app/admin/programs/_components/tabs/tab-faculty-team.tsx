'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TrainingProgram } from '@/lib/mock-data'

export default function TabFacultyTeam({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const ft = program.facultyTeam || {
    structure: '',
    leaderRequirements: '',
    fullTimeRequirements: '',
    partTimeRequirements: '',
  }

  const update = (patch: Partial<typeof ft>) => {
    onChange({ ...program, facultyTeam: { ...ft, ...patch } })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>队伍结构</Label>
        <Textarea
          value={ft.structure}
          onChange={(e) => update({ structure: e.target.value })}
          placeholder="描述师资队伍的整体结构，如师生比、职称结构、学历结构等"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>专业带头人要求</Label>
        <Textarea
          value={ft.leaderRequirements}
          onChange={(e) => update({ leaderRequirements: e.target.value })}
          placeholder="描述专业带头人的任职资格和要求"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>专任教师要求</Label>
        <Textarea
          value={ft.fullTimeRequirements}
          onChange={(e) => update({ fullTimeRequirements: e.target.value })}
          placeholder="描述专任教师的任职资格和要求"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>兼职教师要求</Label>
        <Textarea
          value={ft.partTimeRequirements}
          onChange={(e) => update({ partTimeRequirements: e.target.value })}
          placeholder="描述兼职教师的任职资格和要求"
          rows={4}
        />
      </div>
    </div>
  )
}
