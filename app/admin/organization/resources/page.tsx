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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil } from 'lucide-react'
import { textbooks, venues } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('venues')
  // 教材弹窗
  const [createTextbookOpen, setCreateTextbookOpen] = useState(false)
  const [editTextbookOpen, setEditTextbookOpen] = useState(false)
  const [selectedTextbook, setSelectedTextbook] = useState<typeof textbooks[0] | null>(null)

  // 场地弹窗
  const [createVenueOpen, setCreateVenueOpen] = useState(false)
  const [editVenueOpen, setEditVenueOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<typeof venues[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">教学资源管理</h1>
          <p className="text-muted-foreground">管理场地资源与教材库</p>
        </div>
        {activeTab === 'venues' ? (
          <Button onClick={() => setCreateVenueOpen(true)}><Plus className="h-4 w-4 mr-2" />新建场地</Button>
        ) : (
          <Button onClick={() => setCreateTextbookOpen(true)}><Plus className="h-4 w-4 mr-2" />新建教材</Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="venues">场地资源</TabsTrigger>
          <TabsTrigger value="textbooks">教材库</TabsTrigger>
        </TabsList>

        {/* 场地资源 */}
        <TabsContent value="venues" className="space-y-4">
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
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>{v.type}</TableCell>
                      <TableCell>{v.capacity}</TableCell>
                      <TableCell>{v.location}</TableCell>
                      <TableCell>{v.facilities}</TableCell>
                      <TableCell>
                        <Badge variant={v.status === 'available' ? 'default' : v.status === 'maintenance' ? 'secondary' : 'destructive'}>
                          {v.status === 'available' ? '可用' : v.status === 'maintenance' ? '维修中' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedVenue(v); setEditVenueOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 教材库 */}
        <TabsContent value="textbooks" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>教材名称</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>出版社</TableHead>
                    <TableHead>作者</TableHead>
                    <TableHead>版次</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {textbooks.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.isbn}</TableCell>
                      <TableCell>{t.publisher}</TableCell>
                      <TableCell>{t.author}</TableCell>
                      <TableCell>{t.edition}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>
                          {t.status === 'active' ? '启用' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedTextbook(t); setEditTextbookOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新建教材弹窗 */}
      <Dialog open={createTextbookOpen} onOpenChange={setCreateTextbookOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新建教材</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>教材名称</Label><Input placeholder="请输入教材名称" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>ISBN</Label><Input placeholder="请输入ISBN" /></div>
              <div className="space-y-2"><Label>出版社</Label><Input placeholder="请输入出版社" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>作者</Label><Input placeholder="请输入作者" /></div>
              <div className="space-y-2"><Label>版次</Label><Input placeholder="如 第5版" /></div>
            </div>
            <div className="space-y-2"><Label>状态</Label>
              <Select><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger><SelectContent><SelectItem value="active">启用</SelectItem><SelectItem value="inactive">停用</SelectItem></SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTextbookOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('新建教材成功'); setCreateTextbookOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑教材弹窗 */}
      <Dialog open={editTextbookOpen} onOpenChange={setEditTextbookOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>编辑教材 — {selectedTextbook?.name}</DialogTitle></DialogHeader>
          {selectedTextbook && (
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>教材名称</Label><Input defaultValue={selectedTextbook.name} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>ISBN</Label><Input defaultValue={selectedTextbook.isbn} /></div>
                <div className="space-y-2"><Label>出版社</Label><Input defaultValue={selectedTextbook.publisher} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>作者</Label><Input defaultValue={selectedTextbook.author} /></div>
                <div className="space-y-2"><Label>版次</Label><Input defaultValue={selectedTextbook.edition} /></div>
              </div>
              <div className="space-y-2"><Label>状态</Label>
                <Select defaultValue={selectedTextbook.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">启用</SelectItem><SelectItem value="inactive">停用</SelectItem></SelectContent></Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTextbookOpen(false)}>取消</Button>
            <Button onClick={() => { toast.success('保存成功'); setEditTextbookOpen(false) }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新建场地弹窗 */}
      <Dialog open={createVenueOpen} onOpenChange={setCreateVenueOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>新建场地</DialogTitle></DialogHeader>
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
