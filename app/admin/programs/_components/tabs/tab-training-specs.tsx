'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { TrainingProgram } from '@/lib/mock-data'
import { Plus, Trash2 } from 'lucide-react'

export default function TabTrainingSpecs({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const specs = program.trainingSpecifications || []

  return (
    <div className="space-y-6">
      {/* 培养目标 */}
      <div className="space-y-2">
        <Label>培养目标</Label>
        <RichTextEditor
          value={program.trainingObjectives || ''}
          onChange={(v) => onChange({ ...program, trainingObjectives: v })}
          placeholder="本专业培养能够践行社会主义核心价值观，德智体美劳全面发展，具有一定的科学文化水平、良好的人文素养、职业道德和创新意识，具备较强的就业能力和可持续发展能力的高素质技术技能人才。学生毕业后能够从事...（请补充具体岗位和工作领域）"
        />
        <p className="text-xs text-muted-foreground">可在此录入完整培养目标文本</p>
      </div>

      {/* 培养规格 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>培养规格</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...program,
                trainingSpecifications: [
                  ...specs,
                  { id: specs.length > 0 ? Math.max(...specs.map((s) => s.id)) + 1 : 1, content: '' },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> 添加规格条目
          </Button>
        </div>
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={spec.id} className="flex items-start gap-2">
              <div className="w-10 h-9 flex items-center justify-center rounded-md bg-muted text-sm font-medium shrink-0 mt-0.5">
                {spec.id}
              </div>
              <RichTextEditor
                value={spec.content}
                onChange={(v) => {
                  const arr = [...specs]
                  arr[i] = { ...spec, content: v }
                  onChange({ ...program, trainingSpecifications: arr })
                }}
                placeholder={`培养规格第 ${spec.id} 条：如掌握本专业必需的基础理论和基本知识；具备从事本专业实际工作的基本技能和初步能力；具有良好的职业道德和敬业精神...`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 mt-0.5"
                onClick={() => {
                  const arr = specs.filter((_, idx) => idx !== i)
                  onChange({ ...program, trainingSpecifications: arr })
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          {specs.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-6 border rounded-lg border-dashed">
              暂无培养规格条目，点击上方按钮添加
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
