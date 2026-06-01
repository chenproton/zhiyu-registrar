'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrainingProgram } from '@/lib/mock-data'
import { Plus, Trash2, X } from 'lucide-react'

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

  const [newPos, setNewPos] = useState('')
  const [newCert, setNewCert] = useState('')

  const update = (patch: Partial<typeof co>) => {
    onChange({ ...program, careerOrientation: { ...co, ...patch } })
  }

  return (
    <div className="space-y-6">
      {/* 专业大类 / 小类 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>专业大类</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={co.professionalCategory.name}
              onChange={(e) =>
                update({ professionalCategory: { ...co.professionalCategory, name: e.target.value } })
              }
              placeholder="如 电子与信息大类"
            />
            <Input
              value={co.professionalCategory.code}
              onChange={(e) =>
                update({ professionalCategory: { ...co.professionalCategory, code: e.target.value } })
              }
              placeholder="代码 如 51"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>专业类</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={co.professionalSubcategory.name}
              onChange={(e) =>
                update({ professionalSubcategory: { ...co.professionalSubcategory, name: e.target.value } })
              }
              placeholder="如 计算机类"
            />
            <Input
              value={co.professionalSubcategory.code}
              onChange={(e) =>
                update({ professionalSubcategory: { ...co.professionalSubcategory, code: e.target.value } })
              }
              placeholder="代码 如 5102"
            />
          </div>
        </div>
      </div>

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

      {/* 主要职业 */}
      <div className="space-y-2">
        <Label>主要职业</Label>
        <div className="space-y-2">
          {co.mainOccupations.map((occ, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={occ.name}
                onChange={(e) => {
                  const arr = [...co.mainOccupations]
                  arr[i] = { ...occ, name: e.target.value }
                  update({ mainOccupations: arr })
                }}
                placeholder="职业名称"
                className="flex-1"
              />
              <Input
                value={occ.code}
                onChange={(e) => {
                  const arr = [...co.mainOccupations]
                  arr[i] = { ...occ, code: e.target.value }
                  update({ mainOccupations: arr })
                }}
                placeholder="代码"
                className="w-28"
              />
              <Button variant="ghost" size="icon" onClick={() => {
                const arr = co.mainOccupations.filter((_, idx) => idx !== i)
                update({ mainOccupations: arr })
              }}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => update({ mainOccupations: [...co.mainOccupations, { name: '', code: '' }] })}
          >
            <Plus className="h-4 w-4 mr-1" /> 添加职业
          </Button>
        </div>
      </div>

      {/* 主要岗位 */}
      <div className="space-y-2">
        <Label>主要岗位</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {co.mainPositions.map((pos, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {pos}
              <button onClick={() => update({ mainPositions: co.mainPositions.filter((_, idx) => idx !== i) })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newPos}
            onChange={(e) => setNewPos(e.target.value)}
            placeholder="输入岗位名称，回车添加"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newPos.trim()) {
                update({ mainPositions: [...co.mainPositions, newPos.trim()] })
                setNewPos('')
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (newPos.trim()) {
                update({ mainPositions: [...co.mainPositions, newPos.trim()] })
                setNewPos('')
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 职业类证书 */}
      <div className="space-y-2">
        <Label>职业类证书</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {co.vocationalCertificates.map((cert, i) => (
            <Badge key={i} variant="outline" className="gap-1 pr-1 text-blue-600 border-blue-300">
              {cert}
              <button onClick={() => update({ vocationalCertificates: co.vocationalCertificates.filter((_, idx) => idx !== i) })}>
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
                update({ vocationalCertificates: [...co.vocationalCertificates, newCert.trim()] })
                setNewCert('')
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (newCert.trim()) {
                update({ vocationalCertificates: [...co.vocationalCertificates, newCert.trim()] })
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
