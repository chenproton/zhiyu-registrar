'use client'

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { TrainingProgram } from '@/lib/mock-data'
import { departments, grades, majors } from '@/lib/mock-data'

function generateCode(majorId: string, entryYear: number): string {
  const major = majors.find((m) => m.id === majorId)
  return `TP-${major?.code || 'XX'}-${entryYear}`
}

function calcEndDate(startDate: string, duration: number): string {
  if (!startDate || !duration) return ''
  const startYear = new Date(startDate).getFullYear()
  const endYear = startYear + duration
  return `${endYear}-07-01`
}

function generateSemesters(startDate: string, duration: number, semestersPerYear: number): string[] {
  if (!startDate || !duration || !semestersPerYear) return []
  const startYear = new Date(startDate).getFullYear()
  const semesters: string[] = []
  for (let i = 0; i < duration; i++) {
    const year = startYear + i
    for (let s = 1; s <= semestersPerYear; s++) {
      semesters.push(`${year}年第${s}学期`)
    }
  }
  return semesters
}

export default function TabBasicInfo({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  // 当前专业对应的院系
  const currentMajor = majors.find((m) => m.id === program.majorId)
  const currentDeptId = currentMajor?.departmentId || ''
  const semestersPerYear = program.semestersPerYear || 2

  // 根据院系过滤专业
  const filteredMajors = useMemo(() => {
    if (!currentDeptId) return majors
    return majors.filter((m) => m.departmentId === currentDeptId)
  }, [currentDeptId])

  // 学期列表
  const semesterList = useMemo(() => {
    return generateSemesters(program.startDate || '', program.duration, semestersPerYear)
  }, [program.startDate, program.duration, semestersPerYear])

  // 处理院系变化
  const handleDeptChange = (deptId: string) => {
    const deptMajors = majors.filter((m) => m.departmentId === deptId)
    const firstMajor = deptMajors[0]
    const newMajorId = firstMajor?.id || ''
    const newDuration = firstMajor?.duration || program.duration
    const newCode = generateCode(newMajorId, program.entryYear)
    const newEndDate = calcEndDate(program.startDate || '', newDuration)
    onChange({
      ...program,
      majorId: newMajorId,
      majorName: firstMajor?.name || '',
      majorCode: firstMajor?.code || '',
      duration: newDuration,
      code: newCode,
      endDate: newEndDate,
    })
  }

  // 处理专业变化
  const handleMajorChange = (majorId: string) => {
    const m = majors.find((x) => x.id === majorId)
    const newDuration = m?.duration || program.duration
    const newCode = generateCode(majorId, program.entryYear)
    const newEndDate = calcEndDate(program.startDate || '', newDuration)
    onChange({
      ...program,
      majorId,
      majorName: m?.name || '',
      majorCode: m?.code || '',
      duration: newDuration,
      code: newCode,
      endDate: newEndDate,
    })
  }

  // 处理年级变化
  const handleEntryYearChange = (year: number) => {
    const newCode = generateCode(program.majorId, year)
    onChange({ ...program, entryYear: year, code: newCode })
  }

  // 处理学制变化
  const handleDurationChange = (duration: number) => {
    const newEndDate = calcEndDate(program.startDate || '', duration)
    onChange({ ...program, duration, endDate: newEndDate })
  }

  // 处理开始时间变化
  const handleStartDateChange = (startDate: string) => {
    const newEndDate = calcEndDate(startDate, program.duration)
    onChange({ ...program, startDate, endDate: newEndDate })
  }

  // 处理结束时间手动编辑
  const handleEndDateChange = (endDate: string) => {
    onChange({ ...program, endDate })
  }

  // 处理每年学期数变化
  const handleSemestersPerYearChange = (val: number) => {
    onChange({ ...program, semestersPerYear: val })
  }

  return (
    <div className="space-y-5">
      {/* 第一行：方案名称、方案编码、版本号 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>方案名称</Label>
          <Input
            className="w-full"
            value={program.name}
            onChange={(e) => onChange({ ...program, name: e.target.value })}
            placeholder="如 2025级计算机网络技术专业人才培养方案"
          />
        </div>
        <div className="space-y-2">
          <Label>方案编码</Label>
          <Input
            className="w-full bg-muted"
            value={program.code}
            disabled
            placeholder="自动生成"
          />
        </div>
        <div className="space-y-2">
          <Label>版本号</Label>
          <Input value="v1.0" disabled className="bg-muted w-full" />
        </div>
      </div>

      {/* 第二行：所属院系、专业名称、适用年级 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>所属院系</Label>
          <Select value={currentDeptId} onValueChange={handleDeptChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择院系" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>专业名称</Label>
          <Select
            value={program.majorId}
            onValueChange={handleMajorChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择专业" />
            </SelectTrigger>
            <SelectContent>
              {filteredMajors.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>适用年级</Label>
          <Select
            value={String(program.entryYear)}
            onValueChange={(v) => handleEntryYearChange(Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择年级" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g.id} value={String(g.entryYear)}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 第三行：层次、状态 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>层次</Label>
          <Select
            value={program.level}
            onValueChange={(v) => onChange({ ...program, level: v as TrainingProgram['level'] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="中专">中专</SelectItem>
              <SelectItem value="高职高专">高职高专</SelectItem>
              <SelectItem value="本科">本科</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={program.status}
            onValueChange={(v) => onChange({ ...program, status: v as TrainingProgram['status'] })}
          >
            <SelectTrigger className="w-full">
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
        <div />
      </div>

      {/* 第四行：学制、方案开始时间、方案结束时间（联动区域） */}
      <div className="rounded-lg border bg-slate-50/50 p-4 space-y-4">
        <p className="text-sm font-medium text-slate-700">学制与时间安排</p>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>学制（年）</Label>
            <Input
              className="w-full bg-white"
              type="number"
              min={1}
              max={10}
              value={program.duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>每年学期数</Label>
            <Select
              value={String(semestersPerYear)}
              onValueChange={(v) => handleSemestersPerYearChange(Number(v))}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1个学期</SelectItem>
                <SelectItem value="2">2个学期</SelectItem>
                <SelectItem value="3">3个学期</SelectItem>
                <SelectItem value="4">4个学期</SelectItem>
                <SelectItem value="5">5个学期</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>方案开始时间</Label>
            <Input
              className="w-full bg-white"
              type="date"
              value={program.startDate || ''}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>方案结束时间</Label>
            <Input
              className="w-full bg-white"
              type="date"
              value={program.endDate || ''}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
          </div>
        </div>

        {/* 学期列表展示 */}
        {semesterList.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">学期列表（共 {semesterList.length} 个学期）</Label>
            <div className="flex flex-wrap gap-2">
              {semesterList.map((sem, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs font-normal">
                  第{idx + 1}学期：{sem}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 入学基本要求 */}
      <div className="space-y-2">
        <Label>入学基本要求</Label>
        <RichTextEditor
          value={program.entryRequirements || ''}
          onChange={(v) => onChange({ ...program, entryRequirements: v })}
          placeholder="如：中等职业学校毕业、普通高级中学毕业或具备同等学力。身心健康，无色盲色弱，具有一定的计算机基础知识和英语学习能力的应届/往届毕业生均可报考。"
        />
      </div>
    </div>
  )
}
