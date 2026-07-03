'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import {
  Plus,
  MapPin,
  Wrench,
  CheckCircle2,
  Beaker,
  Upload,
  Download,
  Settings2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Venue } from '@/lib/mock-data'

export type EditableVenue = Omit<Venue, 'type'> & { type: string }

export interface VenueManagerState {
  venues: EditableVenue[]
  venueTypes: string[]
}

interface VenueManagerProps {
  initialVenues: Venue[]
  initialVenueTypes: string[]
  onChange?: (state: VenueManagerState) => void
}

export default function VenueManager({
  initialVenues,
  initialVenueTypes,
  onChange,
}: VenueManagerProps) {
  const [venues, setVenues] = useState<EditableVenue[]>(() =>
    initialVenues.map((v) => ({ ...v, type: v.type as string }))
  )
  const [venueTypes, setVenueTypes] = useState<string[]>(initialVenueTypes)

  const [createVenueOpen, setCreateVenueOpen] = useState(false)
  const [editVenueOpen, setEditVenueOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<EditableVenue | null>(null)
  const [venueTypeDialogOpen, setVenueTypeDialogOpen] = useState(false)
  const [newVenueType, setNewVenueType] = useState('')

  const [createForm, setCreateForm] = useState<Partial<EditableVenue>>({
    status: 'available',
    type: venueTypes[0] || '教室',
  })

  useEffect(() => {
    onChange?.({ venues, venueTypes })
  }, [venues, venueTypes, onChange])

  const stats = useMemo(
    () => ({
      total: venues.length,
      trainingBase: venues.filter((v) => v.type === '实训基地').length,
      available: venues.filter((v) => v.status === 'available').length,
      smartDevices: venues.reduce(
        (sum, v) => sum + (v.digitalInfo?.smartDeviceCount || 0),
        0
      ),
    }),
    [venues]
  )

  const handleCreate = () => {
    const name = (createForm.name || '').trim()
    const code = (createForm.code || '').trim()
    if (!name || !code) {
      toast.warning('请填写场地名称和编码')
      return
    }
    const newVenue: EditableVenue = {
      id: `v-${Date.now()}`,
      code,
      name,
      type: createForm.type || '教室',
      capacity: Number(createForm.capacity) || 0,
      location: (createForm.location || '').trim(),
      facilities: (createForm.facilities || '').trim(),
      status: (createForm.status as Venue['status']) || 'available',
      digitalInfo: {
        smartDeviceCount: 0,
        iotSensors: [],
      },
    }
    setVenues((prev) => [...prev, newVenue])
    setCreateForm({ status: 'available', type: venueTypes[0] || '教室' })
    setCreateVenueOpen(false)
    toast.success('新建场地成功')
  }

  const handleUpdate = () => {
    if (!selectedVenue) return
    const name = (selectedVenue.name || '').trim()
    const code = (selectedVenue.code || '').trim()
    if (!name || !code) {
      toast.warning('请填写场地名称和编码')
      return
    }
    setVenues((prev) =>
      prev.map((v) => (v.id === selectedVenue.id ? { ...selectedVenue } : v))
    )
    setEditVenueOpen(false)
    toast.success('保存成功')
  }

  const handleDelete = (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id))
    toast.success('已删除场地')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">场地资源管理</h2>
          <p className="text-sm text-muted-foreground">
            维护教学场地与实训资源，导入 Excel 前请确保外部场地名称能在下方找到对应
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('导入功能演示：已触发导入')}
          >
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('导出功能演示：已触发导出')}
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVenueTypeDialogOpen(true)}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            场地类型维护
          </Button>
          <Button onClick={() => setCreateVenueOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建场地
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">场地总数</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-full p-2 bg-blue-500">
              <MapPin className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">实训基地</p>
              <p className="text-2xl font-bold">{stats.trainingBase}</p>
            </div>
            <div className="rounded-full p-2 bg-purple-500">
              <Beaker className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">可用场地</p>
              <p className="text-2xl font-bold">{stats.available}</p>
            </div>
            <div className="rounded-full p-2 bg-green-500">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">智能设备</p>
              <p className="text-2xl font-bold">{stats.smartDevices}</p>
            </div>
            <div className="rounded-full p-2 bg-amber-500">
              <Wrench className="h-4 w-4 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>场地编码</TableHead>
                <TableHead>场地名称</TableHead>
                <TableHead>场地类型</TableHead>
                <TableHead>容纳人数</TableHead>
                <TableHead>所在位置</TableHead>
                <TableHead>设备要求</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((v) => (
                <TableRow
                  key={v.id}
                  className={
                    v.type === '实训基地' ? 'bg-purple-50/30' : undefined
                  }
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {v.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {v.type === '实训基地' && (
                        <Beaker className="h-3.5 w-3.5 text-purple-600" />
                      )}
                      {v.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        v.type === '实训基地'
                          ? 'text-[10px] border-purple-300 text-purple-600'
                          : 'text-[10px]'
                      }
                    >
                      {v.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{v.capacity}</TableCell>
                  <TableCell>{v.location}</TableCell>
                  <TableCell>
                    <div className="text-xs">{v.facilities}</div>
                    {v.digitalInfo && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        智能设备: {v.digitalInfo.smartDeviceCount} · 传感器:{' '}
                        {v.digitalInfo.iotSensors.join('、')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        v.status === 'available'
                          ? 'default'
                          : v.status === 'maintenance'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {v.status === 'available'
                        ? '可用'
                        : v.status === 'maintenance'
                          ? '维修中'
                          : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedVenue(v)
                          setEditVenueOpen(true)
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(v.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新建场地弹窗 */}
      <Dialog open={createVenueOpen} onOpenChange={setCreateVenueOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建场地（教室）</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>场地名称</Label>
              <Input
                placeholder="请输入场地名称"
                value={createForm.name || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>场地编码</Label>
              <Input
                placeholder="如 V009"
                value={createForm.code || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, code: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>场地类型</Label>
                <Select
                  value={createForm.type || ''}
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
                value={createForm.location || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>设备要求</Label>
              <Input
                placeholder="如 投影仪、音响、空调"
                value={createForm.facilities || ''}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, facilities: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select
                value={createForm.status || 'available'}
                onValueChange={(s) =>
                  setCreateForm((f) => ({ ...f, status: s as Venue['status'] }))
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
            <Button variant="outline" onClick={() => setCreateVenueOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑场地弹窗 */}
      <Dialog open={editVenueOpen} onOpenChange={setEditVenueOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑场地 — {selectedVenue?.name}</DialogTitle>
          </DialogHeader>
          {selectedVenue && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>场地名称</Label>
                <Input
                  value={selectedVenue.name}
                  onChange={(e) =>
                    setSelectedVenue((v) =>
                      v ? { ...v, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>场地编码</Label>
                <Input
                  value={selectedVenue.code}
                  onChange={(e) =>
                    setSelectedVenue((v) =>
                      v ? { ...v, code: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>场地类型</Label>
                  <Select
                    value={selectedVenue.type}
                    onValueChange={(t) =>
                      setSelectedVenue((v) =>
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
                    value={selectedVenue.capacity}
                    onChange={(e) =>
                      setSelectedVenue((v) =>
                        v
                          ? { ...v, capacity: Number(e.target.value) }
                          : null
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>所在位置</Label>
                <Input
                  value={selectedVenue.location}
                  onChange={(e) =>
                    setSelectedVenue((v) =>
                      v ? { ...v, location: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>设备要求</Label>
                <Input
                  value={selectedVenue.facilities}
                  onChange={(e) =>
                    setSelectedVenue((v) =>
                      v ? { ...v, facilities: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select
                  value={selectedVenue.status}
                  onValueChange={(s) =>
                    setSelectedVenue((v) =>
                      v
                        ? { ...v, status: s as Venue['status'] }
                        : null
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
            <Button variant="outline" onClick={() => setEditVenueOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 场地类型维护弹窗 */}
      <Dialog
        open={venueTypeDialogOpen}
        onOpenChange={setVenueTypeDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>场地类型维护</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>新增场地类型</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={newVenueType}
                  onChange={(e) => setNewVenueType(e.target.value)}
                  placeholder="输入新类型名称"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  disabled={!newVenueType.trim()}
                  onClick={() => {
                    const t = newVenueType.trim()
                    if (venueTypes.includes(t)) {
                      toast.warning('该类型已存在')
                      return
                    }
                    setVenueTypes((prev) => [...prev, t])
                    setNewVenueType('')
                    toast.success(`已添加类型「${t}」`)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>现有类型</Label>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {venueTypes.map((t) => (
                  <div
                    key={t}
                    className="flex items-center justify-between px-3 py-2 rounded-md border"
                  >
                    <span className="text-sm">{t}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => {
                        setVenueTypes((prev) => prev.filter((x) => x !== t))
                        toast.success(`已删除类型「${t}」`)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVenueTypeDialogOpen(false)}
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
