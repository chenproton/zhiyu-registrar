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

export interface MultiSelectOption {
  value: string
  label: string
  description?: string
}

interface MultiSelectComboboxProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

export default function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = '请选择...',
  searchPlaceholder = '搜索...',
  emptyText = '未找到匹配项',
  disabled = false,
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  )

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.description && o.description.toLowerCase().includes(q))
    )
  }, [options, search])

  const handleSelect = (optionValue: string) => {
    const exists = value.includes(optionValue)
    if (exists) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue))
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* 已选标签展示 */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant="secondary"
              className="gap-1 pr-1 text-xs"
            >
              {opt.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(opt.value)
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
                ? `已选择 ${value.length} 项`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((opt) => {
                  const isSelected = value.includes(opt.value)
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => handleSelect(opt.value)}
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
                          <span className="text-sm">{opt.label}</span>
                          {opt.description && (
                            <span className="text-xs text-muted-foreground">
                              {opt.description}
                            </span>
                          )}
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
