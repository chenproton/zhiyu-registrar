'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRightLeft, ArrowLeftRight, Upload, FileSpreadsheet, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  classes,
  majors,
  grades,
  trainingPrograms,
  curriculumPracticePool,
  type CurriculumItem,
} from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type TabType = 'course' | 'practice'

interface PlanData {
  [itemId: string]: {
    [classId: string]: number
  }
}

export default function TeachingPlanTab({
  selectedDept,
  selectedGrade,
}: {
  selectedDept: string
  selectedGrade: string
}) {
  const [activeTab, setActiveTab] = useState<TabType>('course')
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [coursePlanData, setCoursePlanData] = useState<PlanData>({})
  const [practicePlanData, setPracticePlanData] = useState<PlanData>({})
  const [unifiedValues, setUnifiedValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    const program = trainingPrograms[0]
    program?.courses.forEach((c) => { init[c.id] = c.hours })
    curriculumPracticePool.forEach((p) => { init[p.id] = p.hours })
    return init
  })

  const gradeData = grades.find((g) => g.id === selectedGrade)

  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      if (c.gradeId !== selectedGrade) return false
      const major = majors.find((m) => m.id === c.majorId)
      return major?.departmentId === selectedDept
    })
  }, [selectedDept, selectedGrade])

  const courseList: CurriculumItem[] = useMemo(() => {
    const program = trainingPrograms[0]
    if (!program) return []
    return program.courses.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      hours: c.hours,
      nature: c.nature,
      assessment: c.assessment,
      version: 'v1.0',
      batch: '2026春',
      creator: '系统导入',
      updatedAt: '2026-03-01',
    }))
  }, [])

  const practiceList: CurriculumItem[] = useMemo(() => curriculumPracticePool.slice(0, 6), [])

  const currentList = activeTab === 'course' ? courseList : practiceList
  const currentPlanData = activeTab === 'course' ? coursePlanData : practicePlanData
  const setCurrentPlanData = activeTab === 'course' ? setCoursePlanData : setPracticePlanData

  const handleHoursChange = (itemId: string, classId: string, value: number) => {
    setCurrentPlanData((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] ?? {}), [classId]: value },
    }))
  }

  const handleUnifiedChange = (itemId: string, value: number) => {
    setUnifiedValues((prev) => ({ ...prev, [itemId]: value }))
  }

  const handleApplyToAll = (itemId: string) => {
    const value = unifiedValues[itemId] ?? 0
    const classIds = filteredClasses.map((c) => c.id)
    setCurrentPlanData((prev) => ({
      ...prev,
      [itemId]: Object.fromEntries(classIds.map((id) => [id, value])),
    }))
    toast.success('已覆盖全部班级')
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="course">课程</TabsTrigger>
            <TabsTrigger value="practice">实践场景</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="gap-1" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4" />
              导入
            </Button>
            <Button variant="outline" className="gap-1" onClick={() => toast('导出成功')}>
              导出
            </Button>
          </div>
        </div>

        <TabsContent value="course" className="mt-0 space-y-4">
          <PlanTable
            itemLabel="课程"
            list={courseList}
            filteredClasses={filteredClasses}
            planData={coursePlanData}
            unifiedValues={unifiedValues}
            onHoursChange={handleHoursChange}
            onUnifiedChange={handleUnifiedChange}
            onApplyToAll={handleApplyToAll}
          />
        </TabsContent>

        <TabsContent value="practice" className="mt-0 space-y-4">
          <PlanTable
            itemLabel="实践场景"
            list={practiceList}
            filteredClasses={filteredClasses}
            planData={practicePlanData}
            unifiedValues={unifiedValues}
            onHoursChange={handleHoursChange}
            onUnifiedChange={handleUnifiedChange}
            onApplyToAll={handleApplyToAll}
          />
        </TabsContent>
      </Tabs>

      {/* 导入弹窗 */}
      <ImportPlanDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        filteredClasses={filteredClasses}
        onImport={(data) => {
          if (activeTab === 'course') {
            setCoursePlanData((prev) => ({ ...prev, ...data }))
          } else {
            setPracticePlanData((prev) => ({ ...prev, ...data }))
          }
          toast.success('教学计划导入成功')
        }}
      />
    </div>
  )
}

function ImportPlanDialog({
  open,
  onOpenChange,
  filteredClasses,
  onImport,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  filteredClasses: typeof classes
  onImport: (data: PlanData) => void
}) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<PlanData>({})

  const handleParse = () => {
    if (!text.trim()) {
      toast.error('请输入数据')
      return
    }
    const result: PlanData = {}
    const lines = text.trim().split('\n').filter((l) => l.trim())
    lines.forEach((line) => {
      const parts = line.split(/[,，\t]/).map((s) => s.trim())
      if (parts.length >= 3) {
        const itemName = parts[0]
        const itemId = `import-${itemName}`
        const classData: Record<string, number> = {}
        filteredClasses.forEach((c, i) => {
          const val = Number(parts[i + 1])
          if (!isNaN(val)) classData[c.id] = val
        })
        result[itemId] = classData
      }
    })
    setPreview(result)
    toast.success(`解析成功，共 ${Object.keys(result).length} 条记录`)
  }

  const handleConfirm = () => {
    if (Object.keys(preview).length === 0) {
      toast.error('请先解析数据')
      return
    }
    onImport(preview)
    onOpenChange(false)
    setText('')
    setPreview({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            导入课时分配
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">数据格式</p>
            <p>每行：课程名称, 班级1课时, 班级2课时, ...</p>
            <p className="font-mono bg-white border rounded px-2 py-1">程序设计基础, 4, 4, 4</p>
            <p>班级顺序：{filteredClasses.map((c) => c.name).join('、')}</p>
          </div>
          <div className="space-y-2">
            <Label>粘贴数据</Label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="在此粘贴数据..." rows={6} />
            <Button variant="outline" size="sm" onClick={handleParse}>
              <Upload className="h-3.5 w-3.5 mr-1" />
              解析
            </Button>
          </div>
          {Object.keys(preview).length > 0 && (
            <div className="rounded-lg border bg-green-50 p-2 text-xs text-green-700">
              已解析 {Object.keys(preview).length} 条记录，点击确认导入
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); setText(''); setPreview({}) }}>取消</Button>
          <Button onClick={handleConfirm} disabled={Object.keys(preview).length === 0}>确认导入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PlanTable({
  itemLabel,
  list,
  filteredClasses,
  planData,
  unifiedValues,
  onHoursChange,
  onUnifiedChange,
  onApplyToAll,
}: {
  itemLabel: string
  list: CurriculumItem[]
  filteredClasses: typeof classes
  planData: PlanData
  unifiedValues: Record<string, number>
  onHoursChange: (itemId: string, classId: string, value: number) => void
  onUnifiedChange: (itemId: string, value: number) => void
  onApplyToAll: (itemId: string) => void
}) {
  return (
    <Card>
      <CardContent className="p-0 overflow-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] sticky left-0 bg-background z-10">
                  {itemLabel} / 班级
                </TableHead>
                {filteredClasses.map((c) => (
                  <TableHead key={c.id} className="text-center min-w-[100px]">
                    <div className="text-xs">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground font-normal">
                      {majors.find((m) => m.id === c.majorId)?.name}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center min-w-[160px] sticky right-0 bg-background z-10 border-l">统一设置</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="sticky left-0 bg-background z-10 font-medium">
                    <div className="text-sm">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">{item.code}</div>
                  </TableCell>
                  {filteredClasses.map((c) => {
                    const hours = planData[item.id]?.[c.id] ?? 0
                    return (
                      <TableCell key={c.id} className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          value={hours}
                          onChange={(e) => onHoursChange(item.id, c.id, Number(e.target.value))}
                          className="h-8 w-16 mx-auto text-center"
                        />
                      </TableCell>
                    )
                  })}
                  <TableCell className="text-center sticky right-0 bg-background z-10 border-l">
                    <div className="flex items-center justify-center gap-1.5">
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        value={unifiedValues[item.id] ?? item.hours}
                        onChange={(e) => onUnifiedChange(item.id, Number(e.target.value))}
                        className="h-8 w-14 text-center"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-[10px] px-2"
                        onClick={() => onApplyToAll(item.id)}
                      >
                        覆盖全部班级
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={filteredClasses.length + 2}
                    className="text-center text-muted-foreground py-12"
                  >
                    暂无{itemLabel}数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
