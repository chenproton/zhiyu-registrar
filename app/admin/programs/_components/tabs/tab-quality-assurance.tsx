'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrainingProgram } from '@/lib/mock-data'
import { Plus, Trash2, X } from 'lucide-react'

export default function TabQualityAssurance({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const qa = program.qualityAssurance || {
    systemDescription: '',
    graduationRequirements: {
      ideological: [''],
      academic: { courseAssessment: '', gradeCredit: '', creditSubstitution: '' },
      requirements: {
        courseCompletion: '',
        credits: { total: 0, required: 0, elective: 0, minTotal: 0, note: '' },
        physicalEducation: '',
        certificates: [''],
      },
    },
  }

  const [newCert, setNewCert] = useState('')

  const update = (patch: Partial<typeof qa>) => {
    onChange({ ...program, qualityAssurance: { ...qa, ...patch } })
  }

  const gr = qa.graduationRequirements

  return (
    <div className="space-y-6">
      {/* 质量保障体系 */}
      <div className="space-y-2">
        <Label>质量保障体系描述</Label>
        <Textarea
          value={qa.systemDescription}
          onChange={(e) => update({ systemDescription: e.target.value })}
          placeholder="描述教学质量监控体系、评价机制、持续改进措施等"
          rows={4}
        />
      </div>

      {/* 毕业要求 - 思想政治 */}
      <div className="space-y-2">
        <Label>思想政治要求</Label>
        <div className="space-y-2">
          {gr.ideological.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const arr = [...gr.ideological]
                  arr[i] = e.target.value
                  update({ graduationRequirements: { ...gr, ideological: arr } })
                }}
                placeholder="思想政治要求条目"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const arr = gr.ideological.filter((_, idx) => idx !== i)
                  update({ graduationRequirements: { ...gr, ideological: arr } })
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => update({ graduationRequirements: { ...gr, ideological: [...gr.ideological, ''] } })}
          >
            <Plus className="h-4 w-4 mr-1" /> 添加条目
          </Button>
        </div>
      </div>

      {/* 学业要求 */}
      <div className="space-y-4 border rounded-lg p-4">
        <p className="text-sm font-medium">学业要求</p>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">课程考核</Label>
          <Textarea
            value={gr.academic.courseAssessment}
            onChange={(e) => update({ graduationRequirements: { ...gr, academic: { ...gr.academic, courseAssessment: e.target.value } } })}
            placeholder="课程考核方式说明"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">成绩与学分</Label>
          <Textarea
            value={gr.academic.gradeCredit}
            onChange={(e) => update({ graduationRequirements: { ...gr, academic: { ...gr.academic, gradeCredit: e.target.value } } })}
            placeholder="成绩记载与学分管理说明"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">学分替代</Label>
          <Textarea
            value={gr.academic.creditSubstitution}
            onChange={(e) => update({ graduationRequirements: { ...gr, academic: { ...gr.academic, creditSubstitution: e.target.value } } })}
            placeholder="学分替代政策说明"
            rows={2}
          />
        </div>
      </div>

      {/* 学分要求 */}
      <div className="space-y-4 border rounded-lg p-4">
        <p className="text-sm font-medium">学分要求</p>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">总学分</Label>
            <Input
              type="number"
              value={gr.requirements.credits.total}
              onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, credits: { ...gr.requirements.credits, total: Number(e.target.value) } } } })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">必修学分</Label>
            <Input
              type="number"
              value={gr.requirements.credits.required}
              onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, credits: { ...gr.requirements.credits, required: Number(e.target.value) } } } })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">选修学分</Label>
            <Input
              type="number"
              value={gr.requirements.credits.elective}
              onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, credits: { ...gr.requirements.credits, elective: Number(e.target.value) } } } })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">最低总学分</Label>
            <Input
              type="number"
              value={gr.requirements.credits.minTotal}
              onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, credits: { ...gr.requirements.credits, minTotal: Number(e.target.value) } } } })}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">学分说明</Label>
          <Input
            value={gr.requirements.credits.note}
            onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, credits: { ...gr.requirements.credits, note: e.target.value } } } })}
            placeholder="学分要求补充说明"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">课程完成要求</Label>
          <Textarea
            value={gr.requirements.courseCompletion}
            onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, courseCompletion: e.target.value } } })}
            placeholder="课程完成要求说明"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">体育要求</Label>
          <Textarea
            value={gr.requirements.physicalEducation}
            onChange={(e) => update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, physicalEducation: e.target.value } } })}
            placeholder="体育课程和体质健康要求"
            rows={2}
          />
        </div>
      </div>

      {/* 证书要求 */}
      <div className="space-y-2">
        <Label>鼓励取得的证书</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {gr.requirements.certificates.map((cert, i) => (
            <Badge key={i} variant="outline" className="gap-1 pr-1 text-blue-600 border-blue-300">
              {cert}
              <button onClick={() => {
                const arr = gr.requirements.certificates.filter((_, idx) => idx !== i)
                update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, certificates: arr } } })
              }}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            placeholder="输入证书名称，回车添加"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newCert.trim()) {
                update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, certificates: [...gr.requirements.certificates, newCert.trim()] } } })
                setNewCert('')
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (newCert.trim()) {
                update({ graduationRequirements: { ...gr, requirements: { ...gr.requirements, certificates: [...gr.requirements.certificates, newCert.trim()] } } })
                setNewCert('')
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
