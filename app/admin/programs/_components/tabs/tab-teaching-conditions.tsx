'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { TrainingProgram, venues, type Venue } from '@/lib/mock-data'
import { toast } from 'sonner'
import { Plus, Trash2, Pencil, Link2 } from 'lucide-react'

const VENUE_TYPE_OPTIONS: Venue['type'][] = ['教室', '多媒体教室', '实验室', '机房', '实训基地', '其他']
const VENUE_STATUS_OPTIONS: Venue['status'][] = ['available', 'maintenance', 'disabled']

const statusLabel: Record<string, string> = {
  available: '可用',
  maintenance: '维护中',
  disabled: '停用',
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  available: 'default',
  maintenance: 'secondary',
  disabled: 'destructive',
}

export default function TabTeachingConditions({
  program,
  onChange,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
}) {
  const tc = program.teachingConditions || {
    classroomRequirements: '',
    classroomVenueIds: [],
    trainingVenueRequirements: '',
    trainingVenueIds: [],
    internshipVenueRequirements: '',
    internshipVenueIds: [],
    textbookRequirements: '',
    libraryRequirements: '',
    digitalResourceRequirements: '',
  }

  const update = (patch: Partial<typeof tc>) => {
    onChange({ ...program, teachingConditions: { ...tc, ...patch } })
  }

  // 本地 venue 状态（同步全局 venues）
  const [venueList, setVenueList] = useState<Venue[]>([...venues])
  const syncVenues = (newVenues: Venue[]) => {
    setVenueList(newVenues)
    venues.length = 0
    venues.push(...newVenues)
  }

  // 弹窗状态
  const [refDialogOpen, setRefDialogOpen] = useState(false)
  const [refTarget, setRefTarget] = useState<'classroom' | 'training' | 'internship' | null>(null)
  const [venueFormOpen, setVenueFormOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [formTarget, setFormTarget] = useState<'classroom' | 'training' | 'internship' | null>(null)

  const getKey = (field: 'classroom' | 'training' | 'internship') =>
    `${field}VenueIds` as 'classroomVenueIds' | 'trainingVenueIds' | 'internshipVenueIds'

  const getAssociatedIds = (field: 'classroom' | 'training' | 'internship') =>
    tc[getKey(field)] || []

  const getAssociatedVenues = (field: 'classroom' | 'training' | 'internship') =>
    venueList.filter((v) => getAssociatedIds(field).includes(v.id))

  const addVenueToField = (field: 'classroom' | 'training' | 'internship', venueId: string) => {
    const key = getKey(field)
    const current = tc[key] || []
    if (current.includes(venueId)) return
    update({ [key]: [...current, venueId] })
  }

  const removeVenueFromField = (field: 'classroom' | 'training' | 'internship', venueId: string) => {
    const key = getKey(field)
    const current = tc[key] || []
    update({ [key]: current.filter((id) => id !== venueId) })
  }

  const openRefDialog = (field: 'classroom' | 'training' | 'internship') => {
    setRefTarget(field)
    setRefDialogOpen(true)
  }

  const openNewVenue = (field: 'classroom' | 'training' | 'internship') => {
    setEditingVenue(null)
    setFormTarget(field)
    setVenueFormOpen(true)
  }

  const openEditVenue = (venue: Venue) => {
    setEditingVenue(venue)
    setFormTarget(null)
    setVenueFormOpen(true)
  }

  const saveVenue = (venue: Venue) => {
    if (editingVenue) {
      // 编辑：替换全局
      const newVenues = venueList.map((v) => (v.id === venue.id ? venue : v))
      syncVenues(newVenues)
      toast.success('场地资源已更新')
    } else if (formTarget) {
      // 新增：加入全局并关联
      const newVenues = [...venueList, venue]
      syncVenues(newVenues)
      addVenueToField(formTarget, venue.id)
      toast.success('场地资源已创建并关联')
    }
    setVenueFormOpen(false)
  }

  const deleteVenueGlobally = (venueId: string) => {
    const newVenues = venueList.filter((v) => v.id !== venueId)
    syncVenues(newVenues)
    // 从所有关联字段中移除
    update({
      classroomVenueIds: (tc.classroomVenueIds || []).filter((id) => id !== venueId),
      trainingVenueIds: (tc.trainingVenueIds || []).filter((id) => id !== venueId),
      internshipVenueIds: (tc.internshipVenueIds || []).filter((id) => id !== venueId),
    })
    toast.success('场地资源已删除')
  }

  const VenueTable = ({ field, title }: { field: 'classroom' | 'training' | 'internship'; title: string }) => {
    const associated = getAssociatedVenues(field)
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title} ({associated.length})</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openRefDialog(field)}>
              <Link2 className="h-3 w-3 mr-1" />引用
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openNewVenue(field)}>
              <Plus className="h-3 w-3 mr-1" />新增
            </Button>
          </div>
        </div>
        {associated.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">名称</TableHead>
                  <TableHead className="text-xs w-20">类型</TableHead>
                  <TableHead className="text-xs w-14">容量</TableHead>
                  <TableHead className="text-xs w-24">位置</TableHead>
                  <TableHead className="text-xs">设施</TableHead>
                  <TableHead className="text-xs w-16">状态</TableHead>
                  <TableHead className="text-xs w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {associated.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-sm">{v.name}</TableCell>
                    <TableCell className="text-xs">{v.type}</TableCell>
                    <TableCell className="text-xs">{v.capacity}</TableCell>
                    <TableCell className="text-xs">{v.location}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{v.facilities}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[v.status] || 'outline'} className="text-[10px]">
                        {statusLabel[v.status] || v.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditVenue(v)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeVenueFromField(field, v.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground border rounded-lg p-3 text-center">暂无关联场地资源</div>
        )}
      </div>
    )
  }

  // 引用弹窗：展示未关联的场地
  const availableForRef = refTarget
    ? venueList.filter((v) => !getAssociatedIds(refTarget).includes(v.id))
    : []

  return (
    <div className="space-y-6">
      {/* 教室条件 */}
      <div className="space-y-2">
        <Label>教室条件</Label>
        <RichTextEditor
          value={tc.classroomRequirements}
          onChange={(v) => update({ classroomRequirements: v })}
          placeholder="如：本专业配备多媒体教室12间，每间可容纳50-60人，均配备交互式电子白板、投影设备、音响系统及千兆网络接口。另配有智慧教室2间，支持分组研讨、远程互动教学等多样化教学模式。"
        />
        <VenueTable field="classroom" title="已关联教室场地" />
      </div>

      {/* 实训场地条件 */}
      <div className="space-y-2">
        <Label>实训场地条件</Label>
        <RichTextEditor
          value={tc.trainingVenueRequirements}
          onChange={(v) => update({ trainingVenueRequirements: v })}
          placeholder="如：本专业建有网络工程实训室、云计算实训室、网络安全实训室等5个专业实训室，总面积约800平方米，设备总值600余万元。实训室配备路由器、交换机、防火墙、服务器等主流网络设备，可同时容纳150名学生开展实训教学。"
        />
        <VenueTable field="training" title="已关联实训场地" />
      </div>

      {/* 实习场所条件 */}
      <div className="space-y-2">
        <Label>实习场所条件</Label>
        <RichTextEditor
          value={tc.internshipVenueRequirements}
          onChange={(v) => update({ internshipVenueRequirements: v })}
          placeholder="如：本专业与华为、H3C、深信服等8家企业建立了稳定的校外实习基地合作关系，能够提供网络运维、云计算部署、安全运维等对口实习岗位。基地配备企业导师，实行双导师制管理，每年可接收本专业学生顶岗实习不少于60人。"
        />
        <VenueTable field="internship" title="已关联实习场地" />
      </div>

      {/* 教材及图书资料 */}
      <div className="space-y-2">
        <Label>教材及图书资料</Label>
        <RichTextEditor
          value={tc.textbookRequirements}
          onChange={(v) => update({ textbookRequirements: v })}
          placeholder="如：优先选用近5年出版的国家级或省部级规划教材、精品教材，以及校企合作开发的活页式、工作手册式新型教材。专业图书资料生均不少于60册，并定期更新补充行业新技术、新标准相关书籍。"
        />
      </div>
      <div className="space-y-2">
        <Label>图书馆条件</Label>
        <RichTextEditor
          value={tc.libraryRequirements}
          onChange={(v) => update({ libraryRequirements: v })}
          placeholder="如：学校图书馆藏书总量达80万册，其中本专业相关纸质图书1.2万册，电子图书5万册。订阅有中国知网、万方数据、超星数字图书馆等数据库，能够满足师生教学科研和自主学习需求。"
        />
      </div>
      <div className="space-y-2">
        <Label>数字资源条件</Label>
        <RichTextEditor
          value={tc.digitalResourceRequirements}
          onChange={(v) => update({ digitalResourceRequirements: v })}
          placeholder="如：学校建有智慧教学平台，支持在线课程建设、混合式教学、学习行为分析等功能。本专业已建成省级精品在线开放课程2门、校级在线课程8门，引入虚拟仿真实训项目3个，学生可通过网络随时随地开展自主学习和技能训练。"
        />
      </div>

      {/* 引用弹窗 */}
      <Dialog open={refDialogOpen} onOpenChange={setRefDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>引用场地资源</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {availableForRef.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">暂无可引用的场地资源</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">名称</TableHead>
                    <TableHead className="text-xs w-20">类型</TableHead>
                    <TableHead className="text-xs w-14">容量</TableHead>
                    <TableHead className="text-xs w-24">位置</TableHead>
                    <TableHead className="text-xs w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableForRef.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-sm">{v.name}</TableCell>
                      <TableCell className="text-xs">{v.type}</TableCell>
                      <TableCell className="text-xs">{v.capacity}</TableCell>
                      <TableCell className="text-xs">{v.location}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            if (refTarget) addVenueToField(refTarget, v.id)
                            setRefDialogOpen(false)
                          }}
                        >
                          引用
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setRefDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增/编辑场地弹窗 */}
      <VenueFormDialog
        open={venueFormOpen}
        onOpenChange={setVenueFormOpen}
        initial={editingVenue}
        onSave={saveVenue}
        onDelete={editingVenue ? () => { deleteVenueGlobally(editingVenue.id); setVenueFormOpen(false) } : undefined}
      />
    </div>
  )
}

function VenueFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: Venue | null
  onSave: (v: Venue) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<Venue>(
    initial || {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: '',
      type: '教室',
      capacity: 0,
      location: '',
      facilities: '',
      status: 'available',
    }
  )

  const handleSave = () => {
    if (!form.name) {
      toast.error('请输入场地名称')
      return
    }
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? '编辑场地资源' : '新增场地资源'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label className="text-xs">场地名称</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">场地类型</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Venue['type'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENUE_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">容纳人数</Label>
            <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">位置</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">设施设备</Label>
            <Input value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">状态</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Venue['status'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENUE_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{statusLabel[s] || s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete} className="sm:mr-auto">
              <Trash2 className="h-4 w-4 mr-1" />删除
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>取消</Button>
          <Button size="sm" onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
