'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ClassScheduleTab, { type PeriodRow } from './class-schedule-tab'

interface PeriodSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (rows: PeriodRow[]) => void
}

export default function PeriodSettingsDialog({
  open,
  onOpenChange,
  onChange,
}: PeriodSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>教学节次设置</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ClassScheduleTab onChange={onChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
