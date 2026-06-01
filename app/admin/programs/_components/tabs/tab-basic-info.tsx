'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TrainingProgram } from '@/lib/mock-data'
import { departments, grades, majors } from '@/lib/mock-data'

export default function TabBasicInfo({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const dept = departments.find((d) => d.id === program.majorId)
    ? departments.find((d) => majors.find((m) => m.id === program.majorId)?.departmentId === d.id)
    : undefined

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>方案名称</Label>
          <Input
            value={program.name}
            onChange={(e) => onChange({ ...program, name: e.target.value })}
            placeholder="如 2025级计算机网络技术专业人才培养方案"
          />
        </div>
        <div className="space-y-2">
          <Label>方案编码</Label>
          <Input
            value={program.code}
            onChange={(e) => onChange({ ...program, code: e.target.value })}
            placeholder="如 TP-CN-510202-2025"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>专业名称</Label>
          <Select
            value={program.majorId}
            onValueChange={(v) => {
              const m = majors.find((x) => x.id === v)
              onChange({
                ...program,
                majorId: v,
                majorName: m?.name || '',
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择专业" />
            </SelectTrigger>
            <SelectContent>
              {majors.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>专业代码</Label>
          <Input
            value={program.majorCode || ''}
            onChange={(e) => onChange({ ...program, majorCode: e.target.value })}
            placeholder="如 510202"
          />
        </div>
        <div className="space-y-2">
          <Label>版本号</Label>
          <Input
            value={program.version || ''}
            onChange={(e) => onChange({ ...program, version: e.target.value })}
            placeholder="如 2025版"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>适用年级</Label>
          <Select
            value={String(program.entryYear)}
            onValueChange={(v) => onChange({ ...program, entryYear: Number(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择年级" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g.id} value={String(g.entryYear)}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>层次</Label>
          <Select
            value={program.level}
            onValueChange={(v) => onChange({ ...program, level: v as TrainingProgram['level'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="中专">中专</SelectItem>
              <SelectItem value="大专">大专</SelectItem>
              <SelectItem value="本科">本科</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>学制（年）</Label>
          <Input
            type="number"
            value={program.duration}
            onChange={(e) => onChange({ ...program, duration: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={program.status}
            onValueChange={(v) => onChange({ ...program, status: v as TrainingProgram['status'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="deprecated">已停用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>总学分</Label>
          <Input
            type="number"
            value={program.totalCredits}
            onChange={(e) => onChange({ ...program, totalCredits: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>必修学分</Label>
          <Input
            type="number"
            value={program.requiredCredits}
            onChange={(e) => onChange({ ...program, requiredCredits: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>选修学分</Label>
          <Input
            type="number"
            value={program.electiveCredits}
            onChange={(e) => onChange({ ...program, electiveCredits: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>实践学分</Label>
          <Input
            type="number"
            value={program.practiceCredits}
            onChange={(e) => onChange({ ...program, practiceCredits: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>方案开始时间</Label>
          <Input
            type="date"
            value={program.startDate || ''}
            onChange={(e) => onChange({ ...program, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>方案结束时间</Label>
          <Input
            type="date"
            value={program.endDate || ''}
            onChange={(e) => onChange({ ...program, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>入学基本要求</Label>
        <Textarea
          value={program.entryRequirements || ''}
          onChange={(e) => onChange({ ...program, entryRequirements: e.target.value })}
          placeholder="如 中等职业学校毕业､普通高级中学毕业或具备同等学力"
          rows={3}
        />
      </div>
    </div>
  )
}
