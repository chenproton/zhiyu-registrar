'use client'

import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { positions } from '@/lib/mock-data'

interface PositionSearchSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  multiple?: boolean
  placeholder?: string
  disabled?: boolean
}

export default function PositionSearchSelect({
  value,
  onChange,
  multiple = true,
  placeholder = '搜索岗位...',
  disabled = false,
}: PositionSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedPositions = useMemo(
    () => positions.filter((p) => value.includes(p.id)),
    [value]
  )

  const filteredPositions = useMemo(() => {
    if (!search.trim()) return positions
    const q = search.toLowerCase()
    return positions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q)
    )
  }, [search])

  const handleSelect = (positionId: string) => {
    if (multiple) {
      const exists = value.includes(positionId)
      if (exists) {
        onChange(value.filter((id) => id !== positionId))
      } else {
        onChange([...value, positionId])
      }
      // 多选模式下不关闭弹窗，方便连续选择
    } else {
      onChange([positionId])
      setOpen(false)
    }
  }

  const handleRemove = (positionId: string) => {
    onChange(value.filter((id) => id !== positionId))
  }

  return (
    <div className="space-y-2">
      {selectedPositions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPositions.map((pos) => (
            <Badge
              key={pos.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {pos.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(pos.id)
                  }}
                  className="ml-0.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            <span className="text-muted-foreground truncate">
              {value.length > 0
                ? multiple
                  ? `已选择 ${value.length} 个岗位`
                  : selectedPositions[0]?.name
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="搜索岗位名称、代码或行业..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>未找到匹配的岗位</CommandEmpty>
              <CommandGroup>
                {filteredPositions.map((pos) => {
                  const isSelected = value.includes(pos.id)
                  return (
                    <CommandItem
                      key={pos.id}
                      value={pos.id}
                      onSelect={() => handleSelect(pos.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm">{pos.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {pos.code} · {pos.industry}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
