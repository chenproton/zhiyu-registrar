'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lightbulb, Info } from 'lucide-react'
import { toast } from 'sonner'

// ==================== Types ====================
interface ScheduleCell {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface PeriodRow {
  id: string
  name: string
  sequence: number
  timeSlot: 'morning_self' | 'morning' | 'afternoon' | 'evening'
  type: 'class' | 'morning_self' | 'break_big' | 'evening'
  cells: ScheduleCell[]
}

interface PeriodSettings {
  morningSelfCount: number
  morningClassCount: number
  afternoonClassCount: number
  eveningClassCount: number
  classDuration: number
  breakDuration: number
  morningSelfDuration: number
  morningSelfBreak: number
  eveningDuration: number
  eveningBreak: number
  morningBigBreak: { enabled: boolean; duration: number; afterPeriod: number }
  afternoonBigBreak: { enabled: boolean; duration: number; afterPeriod: number }
}

// ==================== Constants ====================
const dayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

const typeStyleMap: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  class: { label: '正课', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  morning_self: { label: '早自习', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-400' },
  evening: { label: '晚自习', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-400' },
  break_big: { label: '大课间', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-400' },
}

// ==================== Time Helpers ====================
const parseTime = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const formatTime = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// ==================== Row Generator ====================
function generateRows(settings: PeriodSettings): PeriodRow[] {
  const rows: PeriodRow[] = []
  let current = 0
  let seq = 0

  const add = (
    timeSlot: PeriodRow['timeSlot'],
    type: PeriodRow['type'],
    name: string,
    duration: number
  ) => {
    const start = current
    const end = current + duration
    const id = `p-${timeSlot}-${seq}`
    rows.push({
      id,
      name,
      sequence: seq++,
      timeSlot,
      type,
      cells: Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i + 1,
        startTime: formatTime(start),
        endTime: formatTime(end),
      })),
    })
    current = end
  }

  // 早自习
  if (settings.morningSelfCount > 0) {
    current = parseTime('07:30')
    for (let i = 0; i < settings.morningSelfCount; i++) {
      add('morning_self', 'morning_self', `早自习${i + 1}`, settings.morningSelfDuration)
      if (i < settings.morningSelfCount - 1) current += settings.morningSelfBreak
    }
  }

  // 上午
  current = parseTime('08:00')
  for (let i = 0; i < settings.morningClassCount; i++) {
    add('morning', 'class', `上${i + 1}`, settings.classDuration)
    if (i < settings.morningClassCount - 1) {
      current += settings.breakDuration
      if (settings.morningBigBreak.enabled && settings.morningBigBreak.afterPeriod === i + 1) {
        add('morning', 'break_big', '大课间', settings.morningBigBreak.duration)
      }
    }
  }

  // 下午
  current = parseTime('14:00')
  for (let i = 0; i < settings.afternoonClassCount; i++) {
    add('afternoon', 'class', `下${i + 1}`, settings.classDuration)
    if (i < settings.afternoonClassCount - 1) {
      current += settings.breakDuration
      if (settings.afternoonBigBreak.enabled && settings.afternoonBigBreak.afterPeriod === i + 1) {
        add('afternoon', 'break_big', '大课间', settings.afternoonBigBreak.duration)
      }
    }
  }

  // 晚自习
  if (settings.eveningClassCount > 0) {
    current = parseTime('18:30')
    for (let i = 0; i < settings.eveningClassCount; i++) {
      add('evening', 'evening', `晚${i + 1}`, settings.eveningDuration)
      if (i < settings.eveningClassCount - 1) current += settings.eveningBreak
    }
  }

  return rows
}

// ==================== Default Settings ====================
const defaultSettings: PeriodSettings = {
  morningSelfCount: 1,
  morningClassCount: 4,
  afternoonClassCount: 3,
  eveningClassCount: 1,
  classDuration: 45,
  breakDuration: 10,
  morningSelfDuration: 20,
  morningSelfBreak: 10,
  eveningDuration: 45,
  eveningBreak: 10,
  morningBigBreak: { enabled: true, duration: 20, afterPeriod: 2 },
  afternoonBigBreak: { enabled: true, duration: 20, afterPeriod: 2 },
}

// ==================== Main Component ====================
export default function ClassScheduleTab() {
  const [settings, setSettings] = useState<PeriodSettings>(defaultSettings)
  const [rows, setRows] = useState<PeriodRow[]>(() => generateRows(defaultSettings))
  const [editOpen, setEditOpen] = useState(false)
  const [editingCell, setEditingCell] = useState<{ rowId: string; dayOfWeek: number } | null>(null)
  const [formStart, setFormStart] = useState('08:00')
  const [formEnd, setFormEnd] = useState('08:45')
  const [showHelp, setShowHelp] = useState(false)

  const handleSettingsChange = useCallback((next: PeriodSettings) => {
    // Clamp big-break afterPeriod to valid range
    const clamped = {
      ...next,
      morningBigBreak: {
        ...next.morningBigBreak,
        afterPeriod: Math.min(next.morningBigBreak.afterPeriod, Math.max(1, next.morningClassCount - 1)),
      },
      afternoonBigBreak: {
        ...next.afternoonBigBreak,
        afterPeriod: Math.min(next.afternoonBigBreak.afterPeriod, Math.max(1, next.afternoonClassCount - 1)),
      },
    }
    setSettings(clamped)
    setRows(generateRows(clamped))
  }, [])

  const handleCellClick = (row: PeriodRow, dayOfWeek: number) => {
    const cell = row.cells.find((c) => c.dayOfWeek === dayOfWeek)
    if (cell) {
      setEditingCell({ rowId: row.id, dayOfWeek })
      setFormStart(cell.startTime)
      setFormEnd(cell.endTime)
      setEditOpen(true)
    }
  }

  const handleSaveCell = () => {
    if (!editingCell) return
    setRows((prev) =>
      prev.map((row) =>
        row.id === editingCell.rowId
          ? {
              ...row,
              cells: row.cells.map((cell) =>
                cell.dayOfWeek === editingCell.dayOfWeek
                  ? { ...cell, startTime: formStart, endTime: formEnd }
                  : cell
              ),
            }
          : row
      )
    )
    setEditOpen(false)
    toast.success('时间设置已保存')
  }

  const updateSetting = <K extends keyof PeriodSettings>(key: K, value: PeriodSettings[K]) => {
    handleSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-240px)] min-h-[500px]">
      {/* Left: Table */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => setShowHelp(true)}>
              <Lightbulb className="h-3.5 w-3.5" />
              使用说明
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(typeStyleMap).map(([key, style]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-full', style.dot)} />
                <span className="text-xs text-muted-foreground">{style.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="border p-2 text-left w-20 bg-muted/80 sticky left-0 z-20 text-xs font-semibold">
                    节次/周次
                  </th>
                  {dayNames.map((d) => (
                    <th key={d} className="border p-2 text-center min-w-[110px] bg-muted/80 text-xs font-semibold">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const style = typeStyleMap[row.type] || typeStyleMap.class
                  return (
                    <tr key={row.id}>
                      <td className="border p-2 font-medium sticky left-0 bg-background z-10 text-xs">
                        {row.name}
                      </td>
                      {row.cells.map((cell) => (
                        <td
                          key={cell.dayOfWeek}
                          className="border p-1.5 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => handleCellClick(row, cell.dayOfWeek)}
                        >
                          <div
                            className={cn(
                              'rounded-md px-2 py-3 flex flex-col items-center gap-1',
                              style.bg,
                              'border',
                              style.border
                            )}
                          >
                            <span className={cn('text-[10px] font-medium', style.text)}>{style.label}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {cell.startTime}-{cell.endTime}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="border p-8 text-center text-muted-foreground text-sm">
                      暂无节次，请在右侧面板配置
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Right: Settings Panel */}
      <Card className="w-[360px] flex-shrink-0 overflow-auto">
        <CardContent className="p-4 space-y-5">
          {/* Period counts */}
          <div>
            <h4 className="text-sm font-semibold mb-3">排课节次设置</h4>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="早自习"
                value={settings.morningSelfCount}
                onChange={(v) => updateSetting('morningSelfCount', v)}
              />
              <NumberField
                label="上午"
                value={settings.morningClassCount}
                onChange={(v) => updateSetting('morningClassCount', v)}
              />
              <NumberField
                label="下午"
                value={settings.afternoonClassCount}
                onChange={(v) => updateSetting('afternoonClassCount', v)}
              />
              <NumberField
                label="晚自习"
                value={settings.eveningClassCount}
                onChange={(v) => updateSetting('eveningClassCount', v)}
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Duration settings */}
          <div>
            <h4 className="text-sm font-semibold mb-3">课程时间设置</h4>
            <div className="space-y-2.5">
              <DurationRow label="课程时长" value={settings.classDuration} onChange={(v) => updateSetting('classDuration', v)} />
              <DurationRow label="课间时长" value={settings.breakDuration} onChange={(v) => updateSetting('breakDuration', v)} />
              <DurationRow label="早自习课程时长" value={settings.morningSelfDuration} onChange={(v) => updateSetting('morningSelfDuration', v)} />
              <DurationRow label="早自习课间时长" value={settings.morningSelfBreak} onChange={(v) => updateSetting('morningSelfBreak', v)} />
              <DurationRow label="晚自习课程时长" value={settings.eveningDuration} onChange={(v) => updateSetting('eveningDuration', v)} />
              <DurationRow label="晚自习课间时长" value={settings.eveningBreak} onChange={(v) => updateSetting('eveningBreak', v)} />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Big breaks */}
          <div className="space-y-3">
            <BigBreakSetting
              label="上午大课间设置"
              enabled={settings.morningBigBreak.enabled}
              duration={settings.morningBigBreak.duration}
              afterPeriod={settings.morningBigBreak.afterPeriod}
              maxPeriod={settings.morningClassCount}
              onChange={(v) => updateSetting('morningBigBreak', v)}
            />
            <BigBreakSetting
              label="下午大课间设置"
              enabled={settings.afternoonBigBreak.enabled}
              duration={settings.afternoonBigBreak.duration}
              afterPeriod={settings.afternoonBigBreak.afterPeriod}
              maxPeriod={settings.afternoonClassCount}
              onChange={(v) => updateSetting('afternoonBigBreak', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cell Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>设置节次时间</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始时间</Label>
                <Input type="time" value={formStart} onChange={(e) => setFormStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>结束时间</Label>
                <Input type="time" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveCell}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>使用说明</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground py-2">
            <p>1. 在右侧面板配置各时段的节次数量，左侧表格会自动生成。</p>
            <p>2. 可设置课程时长、课间时长等参数，系统会自动推算每个节次的时间段。</p>
            <p>3. 点击表格中的任意单元格，可单独调整该节次在当天的起止时间。</p>
            <p>4. 大课间可设置在上午或下午的指定节次之后。</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelp(false)}>知道了</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== Sub Components ====================

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs w-14">{label}</Label>
      <Input
        type="number"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
        className="w-16 h-8 text-center text-sm"
      />
    </div>
  )
}

function DurationRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-16 h-8 text-center text-sm"
        />
        <span className="text-xs text-muted-foreground w-4">分</span>
      </div>
    </div>
  )
}

function BigBreakSetting({
  label,
  enabled,
  duration,
  afterPeriod,
  maxPeriod,
  onChange,
}: {
  label: string
  enabled: boolean
  duration: number
  afterPeriod: number
  maxPeriod: number
  onChange: (v: { enabled: boolean; duration: number; afterPeriod: number }) => void
}) {
  const options = Array.from({ length: Math.max(0, maxPeriod - 1) }, (_, i) => i + 1)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={enabled}
          onCheckedChange={(c) => onChange({ enabled: !!c, duration, afterPeriod })}
        />
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      {enabled && (
        <div className="pl-6 space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs w-20">大课间时长</Label>
            <Input
              type="number"
              min={1}
              value={duration}
              onChange={(e) =>
                onChange({ enabled, duration: Math.max(1, Number(e.target.value) || 1), afterPeriod })
              }
              className="w-16 h-8 text-center text-sm"
            />
            <span className="text-xs text-muted-foreground">分</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs w-20">大课间节次</Label>
            <Select
              value={String(afterPeriod)}
              onValueChange={(v) => onChange({ enabled, duration, afterPeriod: Number(v) })}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    第{n}节后
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
