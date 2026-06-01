'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        <Textarea
          value={program.trainingObjectives || ''}
          onChange={(e) => onChange({ ...program, trainingObjectives: e.target.value })}
          placeholder="本专业培养能够践行社会主义核心价值观..."
          rows={6}
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
              <Textarea
                value={spec.content}
                onChange={(e) => {
                  const arr = [...specs]
                  arr[i] = { ...spec, content: e.target.value }
                  onChange({ ...program, trainingSpecifications: arr })
                }}
                placeholder={`培养规格第 ${spec.id} 条内容`}
                rows={2}
                className="flex-1 min-h-[60px]"
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
