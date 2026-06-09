'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/ui/rich-text-editor'
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
        <RichTextEditor
          value={ft.structure}
          onChange={(v) => update({ structure: v })}
          placeholder="如：本专业教学团队由15名专任教师和5名企业兼职教师组成，师生比约1:18。其中教授2人、副教授6人、讲师7人；博士3人、硕士10人。企业兼职教师均来自行业一线，具备5年以上工程实践经验。"
        />
      </div>
      <div className="space-y-2">
        <Label>专业带头人要求</Label>
        <RichTextEditor
          value={ft.leaderRequirements}
          onChange={(v) => update({ leaderRequirements: v })}
          placeholder="如：专业带头人应具有副高级及以上职称，具有10年以上本专业教学或行业工作经历，熟悉本专业人才培养规律和行业发展趋势，具有较强的教学研究能力和团队管理能力，能够引领专业建设和课程改革方向。"
        />
      </div>
      <div className="space-y-2">
        <Label>专任教师要求</Label>
        <RichTextEditor
          value={ft.fullTimeRequirements}
          onChange={(v) => update({ fullTimeRequirements: v })}
          placeholder="如：专任教师应具有硕士研究生及以上学历，具备高校教师资格证书和本专业相关职业资格证书。其中'双师型'教师比例不低于60%，每5年累计不少于6个月的企业实践经历，能够熟练运用信息化教学手段开展理实一体化教学。"
        />
      </div>
      <div className="space-y-2">
        <Label>兼职教师要求</Label>
        <RichTextEditor
          value={ft.partTimeRequirements}
          onChange={(v) => update({ partTimeRequirements: v })}
          placeholder="如：兼职教师应从行业企业一线技术骨干或管理人员中选聘，具有5年以上本专业相关工作经验和中级及以上专业技术职务（或同等职业资格）。主要承担专业实践课程教学、实习实训指导、毕业设计指导等教学任务，每年承担教学工作量不少于80学时。"
        />
      </div>
    </div>
  )
}
