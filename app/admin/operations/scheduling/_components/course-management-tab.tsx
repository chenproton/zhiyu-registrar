'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Link2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  curriculumCoursePool,
  curriculumPracticePool,
  boundPractices,
  trainingPrograms,
  grades,
  type CurriculumItem,
} from '@/lib/mock-data'

type TabType = 'course' | 'practice'

// 将培养方案中的课程转换为统一结构
function adaptProgramCourses(): CurriculumItem[] {
  const program = trainingPrograms[0]
  if (!program) return []
  return program.courses.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    hours: c.hours,
    nature: c.nature,
    assessment: c.assessment,
    version: 'v1.0',
    batch: '2026春',
    creator: '系统导入',
    updatedAt: '2026-03-01',
  }))
}

export default function CourseManagementTab({ selectedGrade }: { selectedGrade: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('course')
  const [searchQuery, setSearchQuery] = useState('')

  // 课程列表（从培养方案初始化 + 可新增/删除）
  const [courseList, setCourseList] = useState<CurriculumItem[]>(adaptProgramCourses)
  // 岗位列表（从 boundPractices 初始化 + 可新增/删除）
  const [practiceList, setPracticeList] = useState<CurriculumItem[]>([...boundPractices])

  // 新增对话框
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [poolSearch, setPoolSearch] = useState('')

  const gradeData = grades.find((g) => g.id === selectedGrade)

  const currentList = activeTab === 'course' ? courseList : practiceList
  const setCurrentList = activeTab === 'course' ? setCourseList : setPracticeList
  const currentPool = activeTab === 'course' ? curriculumCoursePool : curriculumPracticePool

  const filteredList = useMemo(() => {
    if (!searchQuery) return currentList
    return currentList.filter(
      (item) =>
        item.name.includes(searchQuery) || item.code.includes(searchQuery)
    )
  }, [currentList, searchQuery])

  const filteredPool = useMemo(() => {
    const q = poolSearch.trim()
    let pool = currentPool
    // 排除已绑定的
    const boundIds = new Set(currentList.map((i) => i.id))
    pool = pool.filter((p) => !boundIds.has(p.id))
    if (!q) return pool
    return pool.filter(
      (item) => item.name.includes(q) || item.code.includes(q)
    )
  }, [currentPool, currentList, poolSearch])

  const handleAdd = (item: CurriculumItem) => {
    setCurrentList((prev) => [...prev, item])
    toast.success(`${activeTab === 'course' ? '课程' : '岗位'}已绑定`)
  }

  const handleRemove = (id: string) => {
    setCurrentList((prev) => prev.filter((i) => i.id !== id))
    toast.success('已取消关联')
  }

  const itemLabel = activeTab === 'course' ? '课程' : '岗位'
  const itemLabelPlural = activeTab === 'course' ? '课程' : '岗位'

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as TabType); setSearchQuery('') }}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="course">课程</TabsTrigger>
            <TabsTrigger value="practice">岗位</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input
              placeholder={`搜索${itemLabelPlural}名称或编码...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button className="gap-1" onClick={() => { setPoolSearch(''); setAddDialogOpen(true) }}>
              <Plus className="h-4 w-4" />
              新增{itemLabel}
            </Button>
          </div>
        </div>

        <TabsContent value="course" className="mt-0 space-y-4">
          <ListTable
            list={filteredList}
            itemLabel="课程"
            onRemove={handleRemove}
          />
        </TabsContent>

        <TabsContent value="practice" className="mt-0 space-y-4">
          <ListTable
            list={filteredList}
            itemLabel="岗位"
            onRemove={handleRemove}
          />
        </TabsContent>
      </Tabs>

      {/* 新增/绑定对话框 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>从库中搜索并绑定{itemLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`搜索${itemLabelPlural}名称或编码...`}
                value={poolSearch}
                onChange={(e) => setPoolSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="border rounded-md overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">编码</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead className="w-[60px]">学时</TableHead>
                    <TableHead className="w-[70px]">版本号</TableHead>
                    <TableHead className="w-[80px]">所属批次</TableHead>
                    <TableHead className="w-[80px]">创建人</TableHead>
                    <TableHead className="w-[100px]">更新时间</TableHead>
                    <TableHead className="w-[80px]">性质</TableHead>
                    <TableHead className="w-[80px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPool.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8 text-sm">
                        {poolSearch ? '未找到匹配的' + itemLabelPlural : `暂无可绑定的${itemLabelPlural}`}
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredPool.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.code}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{item.version}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.creator}</TableCell>
                      <TableCell className="text-xs">{item.updatedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{item.nature}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-7 gap-1" onClick={() => handleAdd(item)}>
                          <Link2 className="h-3.5 w-3.5" />
                          绑定
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ListTable({
  list,
  itemLabel,
  onRemove,
}: {
  list: CurriculumItem[]
  itemLabel: string
  onRemove: (id: string) => void
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{itemLabel}编码</TableHead>
              <TableHead>{itemLabel}名称</TableHead>
              <TableHead>学时</TableHead>
              <TableHead>版本号</TableHead>
              <TableHead>所属批次</TableHead>
              <TableHead>创建人</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>性质</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-12 text-sm">
                  暂无{itemLabel}，请点击右上角"新增{itemLabel}"按钮从库中绑定
                </TableCell>
              </TableRow>
            )}
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.code}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell>{item.version}</TableCell>
                <TableCell>{item.batch}</TableCell>
                <TableCell>{item.creator}</TableCell>
                <TableCell className="text-xs">{item.updatedAt}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{item.nature}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-destructive hover:text-destructive gap-1"
                    onClick={() => onRemove(item.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    取消关联
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
