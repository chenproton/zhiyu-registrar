'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TrainingProgram } from '@/lib/mock-data'

export default function TabTeachingConditions({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const tc = program.teachingConditions || {
    classroomRequirements: '',
    trainingVenueRequirements: '',
    internshipVenueRequirements: '',
    textbookRequirements: '',
    libraryRequirements: '',
    digitalResourceRequirements: '',
  }

  const update = (patch: Partial<typeof tc>) => {
    onChange({ ...program, teachingConditions: { ...tc, ...patch } })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>教室条件</Label>
        <Textarea
          value={tc.classroomRequirements}
          onChange={(e) => update({ classroomRequirements: e.target.value })}
          placeholder="描述教室数量、多媒体设备、网络条件等"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>实训场地条件</Label>
        <Textarea
          value={tc.trainingVenueRequirements}
          onChange={(e) => update({ trainingVenueRequirements: e.target.value })}
          placeholder="描述校内实训室、实训基地等条件"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>实习场所条件</Label>
        <Textarea
          value={tc.internshipVenueRequirements}
          onChange={(e) => update({ internshipVenueRequirements: e.target.value })}
          placeholder="描述校外实习基地、合作企业等条件"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>教材及图书资料</Label>
        <Textarea
          value={tc.textbookRequirements}
          onChange={(e) => update({ textbookRequirements: e.target.value })}
          placeholder="描述教材选用要求、图书资料配备等"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>图书馆条件</Label>
        <Textarea
          value={tc.libraryRequirements}
          onChange={(e) => update({ libraryRequirements: e.target.value })}
          placeholder="描述图书馆藏书量、电子资源等"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>数字资源条件</Label>
        <Textarea
          value={tc.digitalResourceRequirements}
          onChange={(e) => update({ digitalResourceRequirements: e.target.value })}
          placeholder="描述网络教学平台、在线课程资源、虚拟仿真等"
          rows={4}
        />
      </div>
    </div>
  )
}
