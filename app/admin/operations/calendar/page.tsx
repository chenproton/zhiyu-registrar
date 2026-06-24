'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Clock, Plus, Pencil, Trash2, Sun, Moon, Utensils } from 'lucide-react'
import { classSchedules, classes, departments, majors } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const periodTypeMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  morning_self: { label: '早自习', icon: <Sun className="h-3 w-3" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  class: { label: '正课', icon: <Clock className="h-3 w-3" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  break_big: { label: '大课间', icon: <Sun className="h-3 w-3" />, color: 'bg-green-50 text-green-700 border-green-200' },
  lunch: { label: '午休', icon: <Utensils className="h-3 w-3" />, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  evening: { label: '晚自习', icon: <Moon className="h-3 w-3" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
}

export default function CalendarPage() {
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '')
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<any>(null)

  const schedule = classSchedules.find((s) => s.classId === selectedClass)

  const filteredClasses = selectedDept === 'all'
    ? classes
    : classes.filter((c) => {
        const major = majors.find((m) => m.id === c.majorId)
        return major?.departmentId === selectedDept
      })

  const handleAddPeriod = () => {
    setEditingPeriod(null)
    setScheduleDialogOpen(true)
  }

  const handleEditPeriod = (period: any) => {
    setEditingPeriod(period)
    setScheduleDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">班级作息时间表</h1>
          <p className="text-muted-foreground">配置各班级的作息时间，包括节次、时段和类型</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={handleAddPeriod}>
            <Plus className="h-4 w-4" />
            新增节次
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label className="text-xs">院系</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部院系</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">班级</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch defaultChecked={schedule?.supportsSingleDouble ?? false} />
                <Label className="text-xs">支持单双周</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                共 <strong>{schedule?.periods.length ?? 0}</strong> 个节次
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {schedule ? (
            <div className="divide-y">
              {/* 上午 */}
              <div>
                <div className="px-4 py-2 bg-muted/30 text-sm font-medium">上午</div>
                <div className="divide-y">
                  {schedule.periods
                    .filter((p) => p.timeSlot === 'morning')
                    .map((period) => (
                      <PeriodRow
                        key={period.id}
                        period={period}
                        onEdit={() => handleEditPeriod(period)}
                      />
                    ))}
                </div>
              </div>
              {/* 下午 */}
              <div>
                <div className="px-4 py-2 bg-muted/30 text-sm font-medium">下午</div>
                <div className="divide-y">
                  {schedule.periods
                    .filter((p) => p.timeSlot === 'afternoon')
                    .map((period) => (
                      <PeriodRow
                        key={period.id}
                        period={period}
                        onEdit={() => handleEditPeriod(period)}
                      />
                    ))}
                </div>
              </div>
              {/* 晚上 */}
              <div>
                <div className="px-4 py-2 bg-muted/30 text-sm font-medium">晚上</div>
                <div className="divide-y">
                  {schedule.periods
                    .filter((p) => p.timeSlot === 'evening')
                    .map((period) => (
                      <PeriodRow
                        key={period.id}
                        period={period}
                        onEdit={() => handleEditPeriod(period)}
                      />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>暂无作息数据</p>
              <p className="text-sm">请先为该班级配置作息时间</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 节次编辑弹窗 */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPeriod ? '编辑节次' : '新增节次'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>节次序号</Label>
                <Input type="number" defaultValue={editingPeriod?.sequence ?? 1} placeholder="如：1" />
              </div>
              <div className="space-y-2">
                <Label>时段</Label>
                <Select defaultValue={editingPeriod?.timeSlot ?? 'morning'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">上午</SelectItem>
                    <SelectItem value="afternoon">下午</SelectItem>
                    <SelectItem value="evening">晚上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始时间</Label>
                <Input type="time" defaultValue={editingPeriod?.startTime ?? '08:00'} />
              </div>
              <div className="space-y-2">
                <Label>结束时间</Label>
                <Input type="time" defaultValue={editingPeriod?.endTime ?? '08:45'} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>节次类型</Label>
              <Select defaultValue={editingPeriod?.type ?? 'class'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning_self">早自习</SelectItem>
                  <SelectItem value="class">正课</SelectItem>
                  <SelectItem value="break_big">大课间</SelectItem>
                  <SelectItem value="lunch">午休</SelectItem>
                  <SelectItem value="evening">晚自习</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>显示名称</Label>
              <Input defaultValue={editingPeriod?.name ?? ''} placeholder="如：第1节" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('节次保存成功'); setScheduleDialogOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PeriodRow({ period, onEdit }: { period: any; onEdit: () => void }) {
  const typeInfo = periodTypeMap[period.type] || periodTypeMap.class
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className={cn('text-xs font-mono', typeInfo.color)}>
          <span className="mr-1">{typeInfo.icon}</span>
          {period.sequence}
        </Badge>
        <div>
          <div className="font-medium text-sm">{period.name}</div>
          <div className="text-xs text-muted-foreground font-mono">
            {period.startTime} - {period.endTime}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => toast.success('删除成功')}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
