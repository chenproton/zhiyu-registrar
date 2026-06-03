'use client'

import { useState } from 'react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MapPin, Wrench, CheckCircle2, Beaker, Upload, Download } from 'lucide-react'
import { venues } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function ResourcesPage() {
  // 场地弹窗
  const [createVenueOpen, setCreateVenueOpen] = useState(false)
  const [editVenueOpen, setEditVenueOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<typeof venues[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">场地资源管理</h1>
          <p className="text-muted-foreground">管理教学场地与实训资源</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('导入功能开发中')}>
            <Upload className="h-4 w-4 mr-2" />导入
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('导出功能开发中')}>
            <Download className="h-4 w-4 mr-2" />导出
          </Button>
          <Button onClick={() => setCreateVenueOpen(true)}><Plus className="h-4 w-4 mr-2" />新建场地</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">场地总数</p>
              <p className="text-2xl font-bold">{venues.length}</p>
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
              <p className="text-2xl font-bold">{venues.filter((v) => v.type === '实训基地').length}</p>
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
              <p className="text-2xl font-bold">{venues.filter((v) => v.status === 'available').length}</p>
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
              <p className="text-2xl font-bold">{venues.reduce((sum, v) => sum + (v.digitalInfo?.smartDeviceCount || 0), 0)}</p>
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
                <TableHead>场地名称</TableHead>
                <TableHead>场地类型</TableHead>
                <TableHead>容纳人数</TableHead>
                <TableHead>所在位置</TableHead>
                <TableHead>设施设备</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((v) => (
                <TableRow key={v.id} className={v.type === '实训基地' ? 'bg-purple-50/30' : undefined}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {v.type === '实训基地' && <Beaker className="h-3.5 w-3.5 text-purple-600" />}
                      {v.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={v.type === '实训基地' ? 'text-[10px] border-purple-300 text-purple-600' : 'text-[10px]'}>
                      {v.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{v.capacity}</TableCell>
                  <TableCell>{v.location}</TableCell>
                  <TableCell>
                    <div className="text-xs">{v.facilities}</div>
                    {v.digitalInfo && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        智能设备: {v.digitalInfo.smartDeviceCount} · 传感器: {v.digitalInfo.iotSensors.join('、')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.status === 'available' ? 'default' : v.status === 'maintenance' ? 'secondary' : 'destructive'}>
                      {v.status === 'available' ? '可用' : v.status === 'maintenance' ? '维修中' : '停用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedVenue(v); setEditVenueOpen(true) }}>编辑</Button>
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
          <DialogHeader><DialogTitle>新建场地（教室）</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>场地名称</Label><Input placeholder="请输入场地名称" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>场地类型</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="教室">教室</SelectItem>
                    <SelectItem value="实验室">实验室</SelectItem>
                    <SelectItem value="实训基地">实训基地</SelectItem>
                    <SelectItem value="机房">机房</SelectItem>
                    <SelectItem value="多媒体教室">多媒体教室</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>容纳人数</Label><Input type="number" placeholder="0" /></div>
            </div>
            <div className="space-y-2"><Label>所在位置</Label><Input placeholder="如 A栋1层" /></div>
            <div className="space-y-2"><Label>设施设备</Label><Input placeholder="如 投影仪、音响、空调" /></div>
            <div className="space-y-2"><Label>状态</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">可用</SelectItem>
                  <SelectItem value="maintenance">维修中</SelectItem>
                  <SelectItem value="disabled">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateVenueOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新建场地成功'); setCreateVenueOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑场地弹窗 */}
      <Dialog open={editVenueOpen} onOpenChange={setEditVenueOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑场地 — {selectedVenue?.name}</DialogTitle></DialogHeader>
          {selectedVenue && (
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>场地名称</Label><Input defaultValue={selectedVenue.name} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>场地类型</Label>
                  <Select defaultValue={selectedVenue.type}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="教室">教室</SelectItem>
                      <SelectItem value="实验室">实验室</SelectItem>
                      <SelectItem value="实训基地">实训基地</SelectItem>
                      <SelectItem value="机房">机房</SelectItem>
                      <SelectItem value="多媒体教室">多媒体教室</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>容纳人数</Label><Input type="number" defaultValue={selectedVenue.capacity} /></div>
              </div>
              <div className="space-y-2"><Label>所在位置</Label><Input defaultValue={selectedVenue.location} /></div>
              <div className="space-y-2"><Label>设施设备</Label><Input defaultValue={selectedVenue.facilities} /></div>
              <div className="space-y-2"><Label>状态</Label>
                <Select defaultValue={selectedVenue.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Button variant="outline" onClick={() => setEditVenueOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('保存成功'); setEditVenueOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
