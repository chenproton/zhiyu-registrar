'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrainingProgram } from '@/lib/mock-data'
import { Plus, Trash2, X } from 'lucide-react'
import PositionSearchSelect from '@/components/shared/position-search-select'

export default function TabCareerOrientation({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const co = program.careerOrientation || {
    professionalCategory: { name: '', code: '' },
    professionalSubcategory: { name: '', code: '' },
    correspondingIndustries: [],
    mainOccupations: [],
    mainPositions: [],
    vocationalCertificates: [],
  }

  const [newCert, setNewCert] = useState('')

  const update = (patch: Partial<typeof co>) => {
    onChange({ ...program, careerOrientation: { ...co, ...patch } })
  }

  return (
    <div className="space-y-6">
      {/* 对应行业 */}
      <div className="space-y-2">
        <Label>对应行业</Label>
        <div className="space-y-2">
          {co.correspondingIndustries.map((ind, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={ind.name}
                onChange={(e) => {
                  const arr = [...co.correspondingIndustries]
                  arr[i] = { ...ind, name: e.target.value }
                  update({ correspondingIndustries: arr })
                }}
                placeholder="行业名称"
                className="flex-1"
              />
              <Input
                value={ind.code}
                onChange={(e) => {
                  const arr = [...co.correspondingIndustries]
                  arr[i] = { ...ind, code: e.target.value }
                  update({ correspondingIndustries: arr })
                }}
                placeholder="代码"
                className="w-28"
              />
              <Button variant="ghost" size="icon" onClick={() => {
                const arr = co.correspondingIndustries.filter((_, idx) => idx !== i)
                update({ correspondingIndustries: arr })
              }}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => update({ correspondingIndustries: [...co.correspondingIndustries, { name: '', code: '' }] })}
          >
            <Plus className="h-4 w-4 mr-1" /> 添加行业
          </Button>
        </div>
      </div>

      {/* 面向岗位列表 */}
      <div className="space-y-2">
        <Label>面向岗位列表</Label>
        <PositionSearchSelect
          value={co.mainPositions}
          onChange={(ids) => update({ mainPositions: ids })}
          multiple
        />
      </div>


    </div>
  )
}
