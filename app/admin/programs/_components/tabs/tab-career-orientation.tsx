'use client'

import { useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { TrainingProgram, positions } from '@/lib/mock-data'
import MultiSelectCombobox from '@/components/shared/multi-select-combobox'

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

  const update = (patch: Partial<typeof co>) => {
    onChange({ ...program, careerOrientation: { ...co, ...patch } })
  }

  // 行业选项：从 positions 中提取唯一行业名称
  const industryOptions = useMemo(() => {
    const industries = Array.from(new Set(positions.map((p) => p.industry)))
    return industries.map((name) => ({ value: name, label: name }))
  }, [])

  // 岗位选项
  const positionOptions = useMemo(() => {
    return positions.map((p) => ({
      value: p.id,
      label: p.name,
      description: `${p.code} · ${p.industry}`,
    }))
  }, [])

  return (
    <div className="space-y-6">
      {/* 对应行业 */}
      <div className="space-y-2">
        <Label>对应行业</Label>
        <MultiSelectCombobox
          options={industryOptions}
          value={co.correspondingIndustries}
          onChange={(vals) => update({ correspondingIndustries: vals })}
          placeholder="请选择对应行业"
          searchPlaceholder="搜索行业..."
          emptyText="未找到匹配的行业"
        />
      </div>

      {/* 面向岗位列表 */}
      <div className="space-y-2">
        <Label>面向岗位列表</Label>
        <MultiSelectCombobox
          options={positionOptions}
          value={co.mainPositions}
          onChange={(vals) => update({ mainPositions: vals })}
          placeholder="请选择面向岗位"
          searchPlaceholder="搜索岗位名称、代码或行业..."
          emptyText="未找到匹配的岗位"
        />
      </div>
    </div>
  )
}
