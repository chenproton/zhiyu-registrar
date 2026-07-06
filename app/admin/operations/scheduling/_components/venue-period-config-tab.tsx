'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Plus, MapPin, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { type Venue } from '@/lib/mock-data'
import ClassScheduleTab, { type PeriodRow } from './class-schedule-tab'

type EditableVenue = Omit<Venue, 'type'> & { type: string }

interface VenuePeriodConfigTabProps {
  venues: Venue[]
  venueTypes: string[]
  onVenuesChange: (venues: Venue[], venueTypes: string[]) => void
  onPeriodsChange: (periods: string[]) => void
}

export default function VenuePeriodConfigTab({
  venues: initialVenues,
  venueTypes: initialVenueTypes,
  onVenuesChange,
  onPeriodsChange,
}: VenuePeriodConfigTabProps) {
  const [venues, setVenues] = useState<EditableVenue[]>(() =>
    initialVenues.map((v) => ({ ...v, type: v.type as string }))
  )
  const [venueTypes, setVenueTypes] = useState<string[]>(initialVenueTypes)
  const [selectedVenueId, setSelectedVenueId] = useState(initialVenues[0]?.id || '')

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<EditableVenue | null>(null)
  const [createForm, setCreateForm] = useState({
    name: '',
    code: '',
    type: initialVenueTypes[0] || '教室',
    capacity: 0,
    location: '',
    facilities: '',
    status: 'available' as string,
  })

  useEffect(() => {
    onVenuesChange(venues as unknown as Venue[], venueTypes)
  }, [venues, venueTypes])

  const handleCreate = () => {
    const { name, code } = createForm
    if (!name.trim() || !code.trim()) {
      toast.warning('请填写场地名称和编码')
      return
    }
    const newVenue: EditableVenue = {
      id: `v-${Date.now()}`,
      code: code.trim(),
      name: name.trim(),
      type: createForm.type,
      capacity: createForm.capacity || 0,
      location: createForm.location.trim(),
      facilities: createForm.facilities.trim(),
      status: createForm.status as Venue['status'],
      digitalInfo: { smartDeviceCount: 0, iotSensors: [] },
    }
    setVenues((prev) => [...prev, newVenue])
    setCreateForm({
      name: '',
      code: '',
      type: initialVenueTypes[0] || '教室',
      capacity: 0,
      location: '',
      facilities: '',
      status: 'available',
    })
    setCreateDialogOpen(false)
    setSelectedVenueId(newVenue.id)
    toast.success('新建场地成功')
  }

  const handleUpdate = () => {
    if (!editingVenue) return
    if (!editingVenue.name.trim() || !editingVenue.code.trim()) {
      toast.warning('请填写场地名称和编码')
      return
    }
    setVenues((prev) =>
      prev.map((v) => (v.id === editingVenue.id ? { ...editingVenue } : v))
    )
    setEditDialogOpen(false)
    toast.success('保存成功')
  }

  const handleDelete = (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id))
    if (selectedVenueId === id) {
      setSelectedVenueId(venues[0]?.id || '')
    }
    toast.success('已删除场地')
  }

  const selectedVenue = venues.find((v) => v.id === selectedVenueId)

  return (
    <div className="flex gap-4">
      {/* 左侧场地列表 */}
      <div className="w-[220px] shrink-0 border rounded-lg bg-muted/20 flex flex-col h-[calc(100vh-240px)]">
        <div className="p-3 border-b font-medium text-sm flex items-center justify-between">
          <span>场地列表</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {venues.length === 0 ? (
            <div className="px-3 py-8 text-sm text-muted-foreground text-center">
              暂无场地，点击 + 新建
            </div>
          ) : (
            venues.map((v) => (
              <div
                key={v.id}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm transition-colors border-l-2 flex items-center justify-between group',
                  selectedVenueId === v.id
                    ? 'bg-primary/10 text-primary border-l-primary'
                    : 'text-muted-foreground border-l-transparent hover:bg-muted hover:text-foreground'
                )}
              >
                <button
                  onClick={() => setSelectedVenueId(v.id)}
                  className="flex-1 text-left truncate flex flex-col gap-0.5 min-w-0"
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate font-medium">{v.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-4 self-start ml-4"
                  >
                    {v.type}
                  </Badge>
                </button>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingVenue(v)
                      setEditDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(v.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>

        {selectedVenue && (
          <div className="p-3 border-t text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center justify-between">
              <span>场地编码</span>
              <span className="font-mono text-foreground">{selectedVenue.code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>类型</span>
              <span>{selectedVenue.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>容量</span>
              <span>{selectedVenue.capacity}人</span>
            </div>
            <div className="flex items-center justify-between">
              <span>位置</span>
              <span className="truncate max-w-[120px]">{selectedVenue.location || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* 右侧节次设置 */}
      <div className="flex-1 min-w-0">
        <ClassScheduleTab
          onChange={(rows: PeriodRow[]) => onPeriodsChange(rows.map((r) => r.name))}
        />
      </div>

      {/* 新建场地弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建场地</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>场地名称</Label>
              <Input
                placeholder="请输入场地名称"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>场地编码</Label>
              <Input
                placeholder="如 V009"
                value={createForm.code}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, code: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>场地类型</Label>
                <Select
                  value={createForm.type}
                  onValueChange={(t) =>
                    setCreateForm((f) => ({ ...f, type: t }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {venueTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>容纳人数</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={createForm.capacity || ''}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      capacity: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>所在位置</Label>
              <Input
                placeholder="如 A栋1层"
                value={createForm.location}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>设备要求</Label>
              <Input
                placeholder="如 投影仪、音响、空调"
                value={createForm.facilities}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, facilities: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select
                value={createForm.status}
                onValueChange={(s) =>
                  setCreateForm((f) => ({ ...f, status: s }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">可用</SelectItem>
                  <SelectItem value="maintenance">维修中</SelectItem>
                  <SelectItem value="disabled">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑场地弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑场地 — {editingVenue?.name}</DialogTitle>
          </DialogHeader>
          {editingVenue && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>场地名称</Label>
                <Input
                  value={editingVenue.name}
                  onChange={(e) =>
                    setEditingVenue((v) =>
                      v ? { ...v, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>场地编码</Label>
                <Input
                  value={editingVenue.code}
                  onChange={(e) =>
                    setEditingVenue((v) =>
                      v ? { ...v, code: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>场地类型</Label>
                  <Select
                    value={editingVenue.type}
                    onValueChange={(t) =>
                      setEditingVenue((v) =>
                        v ? { ...v, type: t } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {venueTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>容纳人数</Label>
                  <Input
                    type="number"
                    value={editingVenue.capacity}
                    onChange={(e) =>
                      setEditingVenue((v) =>
                        v ? { ...v, capacity: Number(e.target.value) } : null
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>所在位置</Label>
                <Input
                  value={editingVenue.location}
                  onChange={(e) =>
                    setEditingVenue((v) =>
                      v ? { ...v, location: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>设备要求</Label>
                <Input
                  value={editingVenue.facilities}
                  onChange={(e) =>
                    setEditingVenue((v) =>
                      v ? { ...v, facilities: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select
                  value={editingVenue.status}
                  onValueChange={(s) =>
                    setEditingVenue((v) =>
                      v ? { ...v, status: s as Venue['status'] } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">可用</SelectItem>
                    <SelectItem value="maintenance">维修中</SelectItem>
                    <SelectItem value="disabled">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
