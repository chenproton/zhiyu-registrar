"use client"

import Link from "next/link"
import { Copy, Pencil, Trash2, UserPlus, Send, RotateCcw, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { TrainingProgram } from "@/lib/mock-data"

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-500" },
  pending: { label: "审批中", className: "bg-yellow-50 text-yellow-600" },
  published: { label: "已发布", className: "bg-green-50 text-green-600" },
  deprecated: { label: "已废弃", className: "bg-gray-100 text-gray-400" },
}

interface ProgramListProps {
  programs: TrainingProgram[]
  majors: { id: string; name: string; departmentId: string }[]
  selectedIds?: string[]
  onSelectId?: (id: string, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
  onEdit?: (program: TrainingProgram) => void
  onInvite?: (program: TrainingProgram) => void
  onDelete?: (program: TrainingProgram) => void
  onClone?: (program: TrainingProgram) => void
  onSubmitApproval?: (program: TrainingProgram) => void
  onWithdrawApproval?: (program: TrainingProgram) => void
  onWithdrawPublish?: (program: TrainingProgram) => void
  onExport?: (program: TrainingProgram) => void
  className?: string
}

export function ProgramList({
  programs,
  majors,
  selectedIds = [],
  onSelectId,
  onSelectAll,
  onEdit,
  onInvite,
  onDelete,
  onClone,
  onSubmitApproval,
  onWithdrawApproval,
  onWithdrawPublish,
  onExport,
  className,
}: ProgramListProps) {
  if (programs.length === 0) return null

  const allSelected = programs.length > 0 && programs.every((p) => selectedIds.includes(p.id))
  const someSelected = programs.some((p) => selectedIds.includes(p.id)) && !allSelected

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white overflow-hidden", className)}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 border-b border-slate-100 items-center">
        <div className="col-span-1 flex justify-center">
          <Checkbox
            checked={someSelected ? "indeterminate" : allSelected}
            onCheckedChange={(checked) => onSelectAll?.(checked === true)}
            aria-label="全选"
          />
        </div>
        <div className="col-span-2">方案名称</div>
        <div className="col-span-1 text-center">状态</div>
        <div className="col-span-1">专业</div>
        <div className="col-span-1 text-center">年级</div>
        <div className="col-span-1 text-center">学制</div>
        <div className="col-span-1 text-center">课程数</div>
        <div className="col-span-1 text-center">实践场景</div>
        <div className="col-span-1 text-center">总学分</div>
        <div className="col-span-1">创建人</div>
        <div className="col-span-1 text-right">操作</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-slate-100">
        {programs.map((program) => {
          const status = statusConfig[program.status] || statusConfig.draft
          const isSelected = selectedIds.includes(program.id)
          const major = majors.find((m) => m.id === program.majorId)

          return (
            <div
              key={program.id}
              className={cn(
                "grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50 transition-colors group relative",
                isSelected && "bg-primary/5"
              )}
            >
              <div className="col-span-1 flex justify-center">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectId?.(program.id, checked === true)}
                  aria-label={`选择 ${program.name}`}
                />
              </div>
              <div className="col-span-2">
                <Link href={`/admin/programs/${program.id}/edit`} className="block">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1 hover:text-primary">{program.name}</p>
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{program.code}</p>
              </div>
              <div className="col-span-1 text-center">
                <Badge variant="secondary" className={cn("text-xs", status.className)}>
                  {status.label}
                </Badge>
              </div>
              <div className="col-span-1 text-sm text-slate-600 truncate">{major?.name || "-"}</div>
              <div className="col-span-1 text-center text-sm text-slate-600">{program.entryYear}级</div>
              <div className="col-span-1 text-center text-sm text-slate-600">{program.duration}年/{program.level}</div>
              <div className="col-span-1 text-center">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                  {program.courses.length}
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-600">
                  {program.practiceScenes.length}
                </span>
              </div>
              <div className="col-span-1 text-center text-sm text-slate-600">{program.totalCredits}</div>
              <div className="col-span-1 text-xs text-slate-500 truncate">{program.creator || "-"}</div>
              <div className="col-span-1 text-right relative">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm z-10 px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                  {program.status === 'draft' && onSubmitApproval && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSubmitApproval(program)
                      }}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      提交审批
                    </Button>
                  )}
                  {program.status === 'pending' && onWithdrawApproval && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onWithdrawApproval(program)
                      }}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      撤回审批
                    </Button>
                  )}
                  {program.status === 'published' && onWithdrawPublish && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onWithdrawPublish(program)
                      }}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      撤回发布
                    </Button>
                  )}
                  {onClone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClone(program)
                      }}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      克隆
                    </Button>
                  )}
                  {program.status === 'draft' && onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(program)
                      }}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      编辑
                    </Button>
                  )}
                  {program.status === 'draft' && onInvite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onInvite(program)
                      }}
                    >
                      <UserPlus className="mr-1 h-3 w-3" />
                      邀请共建
                    </Button>
                  )}
                  {program.status === 'draft' && onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(program)
                      }}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      删除
                    </Button>
                  )}
                  {onExport && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onExport(program)
                      }}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      导出
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
