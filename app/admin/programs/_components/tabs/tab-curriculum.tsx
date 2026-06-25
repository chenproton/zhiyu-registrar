'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TrainingProgram, CoursePlan, defaultCourseTypes, courseNatures, syllabuses, sceneSyllabuses, trainingPrograms, positions } from '@/lib/mock-data'
import { toast } from '@/hooks/use-toast'
import { Plus, Trash2, Settings, Check, ChevronsUpDown, Upload, Download, Library, Search, LayoutList, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

const ALL_SYLLABUS_IDS = [
  ...syllabuses.map((s) => s.id),
  ...sceneSyllabuses.map((s) => s.id),
]

function findSyllabusId(courseName: string): string | null {
  if (!courseName) return null
  const syl = syllabuses.find((s) => s.courseName === courseName || courseName.includes(s.courseName) || s.courseName.includes(courseName))
  if (syl) return syl.id
  const scene = sceneSyllabuses.find((s) => s.courseName === courseName || courseName.includes(s.courseName) || s.courseName.includes(courseName))
  if (scene) return scene.id
  const hash = courseName.split('').reduce((h, ch) => h + ch.charCodeAt(0), 0)
  return ALL_SYLLABUS_IDS[hash % ALL_SYLLABUS_IDS.length] ?? null
}

// 模拟岗位课时库（用于下拉搜索选择）
const mockScenes = positions.map((p) => ({ code: p.code, name: p.name }))

const emptyCourse = (defaults?: Partial<CoursePlan>): CoursePlan => ({
  id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '',
  code: '',
  credits: 0,
  hours: 0,
  semester: 1,
  nature: '必修',
  assessment: '考试',
  version: 'v1.0',
  courseType: '课程',
  subCategory: '必修',
  courseTypeLabel: defaultCourseTypes[0],
  ...defaults,
})

export default function TabCurriculum({
  program,
  onChange,
  showTitle = false,
}: {
  program: TrainingProgram
  onChange: (p: TrainingProgram) => void
  showTitle?: boolean
}) {
  const curriculum = program.curriculum || []
  const [activeFilter, setActiveFilter] = useState<string>('全部')
  const [typeConfigOpen, setTypeConfigOpen] = useState(false)
  const [courseTypes, setCourseTypes] = useState<string[]>(defaultCourseTypes)
  // 跟踪哪些岗位课时行处于"新建"输入模式（true=输入框，false=下拉选择）
  const [sceneEditMode, setSceneEditMode] = useState<Record<string, boolean>>({})
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [selectedLibraryIds, setSelectedLibraryIds] = useState<Set<string>>(new Set())
  const [librarySearch, setLibrarySearch] = useState('')
  const [libraryCategory, setLibraryCategory] = useState<string>('全部')

  // 岗位导入弹窗
  const [positionSceneOpen, setPositionSceneOpen] = useState(false)
  const [selectedPositionId, setSelectedPositionId] = useState<string>('')
  const [positionSearch, setPositionSearch] = useState('')

  // 从所有人培方案的 curriculum 中提取唯一课程课时，构建课程课时库
  const mockCourseLibrary = useMemo(() => {
    const map = new Map<string, { id: string; name: string; code: string; credits: number; hours: number; type: string }>()
    trainingPrograms.forEach((tp) => {
      tp.curriculum?.forEach((c) => {
        if (c.courseType !== '场景' && c.name && !map.has(c.name)) {
          map.set(c.name, {
            id: c.id,
            name: c.name,
            code: c.code || '',
            credits: c.credits || 0,
            hours: c.hours || 0,
            type: c.courseTypeLabel || defaultCourseTypes[0],
          })
        }
      })
    })
    return Array.from(map.values())
  }, [])

  const libraryCategories = useMemo(() => {
    const cats = new Set<string>()
    mockCourseLibrary.forEach((c) => {
      if (c.type.includes('公共基础')) cats.add('公共基础')
      else if (c.type.includes('专业基础')) cats.add('专业基础')
      else if (c.type.includes('专业核心')) cats.add('专业核心')
      else if (c.type.includes('专业拓展')) cats.add('专业拓展')
      else if (c.type.includes('素质')) cats.add('素质教育')
      else cats.add('其他')
    })
    return ['全部', ...Array.from(cats).sort()]
  }, [mockCourseLibrary])

  const filteredLibrary = useMemo(() => {
    let result = mockCourseLibrary
    if (libraryCategory !== '全部') {
      result = result.filter((c) => {
        if (libraryCategory === '公共基础') return c.type.includes('公共基础')
        if (libraryCategory === '专业基础') return c.type.includes('专业基础')
        if (libraryCategory === '专业核心') return c.type.includes('专业核心')
        if (libraryCategory === '专业拓展') return c.type.includes('专业拓展')
        if (libraryCategory === '素质教育') return c.type.includes('素质')
        return true
      })
    }
    if (librarySearch.trim()) {
      const q = librarySearch.toLowerCase()
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      )
    }
    return result
  }, [mockCourseLibrary, librarySearch, libraryCategory])

  const toggleLibrarySelection = (id: string) => {
    setSelectedLibraryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addFromLibrary = () => {
    const existingNames = new Set(curriculum.map((c) => c.name))
    const toAdd = mockCourseLibrary.filter((c) => selectedLibraryIds.has(c.id) && !existingNames.has(c.name))
    if (toAdd.length === 0) {
      toast({ title: '所选课程课时已存在或为空', variant: 'destructive' })
      return
    }
    const newCourses: CoursePlan[] = toAdd.map((c) =>
      emptyCourse({
        name: c.name,
        code: c.code,
        credits: c.credits,
        hours: c.hours,
        courseTypeLabel: c.type,
      })
    )
    updateCurriculum([...curriculum, ...newCourses])
    setLibraryOpen(false)
    setSelectedLibraryIds(new Set())
    toast({ title: `成功添加 ${toAdd.length} 门课程课时` })
  }

  const filteredPositions = useMemo(() => {
    if (!positionSearch.trim()) return positions
    const q = positionSearch.toLowerCase()
    return positions.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
  }, [positionSearch])

  const handleImportScenes = () => {
    if (!selectedPositionId) {
      toast({ title: '请选择岗位', variant: 'destructive' })
      return
    }
    const position = positions.find((p) => p.id === selectedPositionId)
    if (!position) {
      toast({ title: '岗位不存在', variant: 'destructive' })
      return
    }
    const existingNames = new Set(curriculum.map((c) => c.name))
    if (existingNames.has(position.name)) {
      toast({ title: '该岗位已存在', variant: 'destructive' })
      return
    }
    const newScene: CoursePlan = emptyCourse({
      name: position.name,
      code: position.code,
      credits: 0,
      hours: 0,
      nature: '场景',
      assessment: '考查',
      courseType: '场景',
      subCategory: '场景',
      courseTypeLabel: '',
    })
    updateCurriculum([...curriculum, newScene])
    setPositionSceneOpen(false)
    setSelectedPositionId('')
    toast({ title: `成功加入岗位：${position.name}` })
  }

  const filteredCourses = useMemo(() => {
    if (activeFilter === '全部') return curriculum
    if (activeFilter === '场景') return curriculum.filter((c) => c.courseType === '场景')
    return curriculum.filter((c) => c.courseTypeLabel === activeFilter)
  }, [curriculum, activeFilter])

  const updateCurriculum = (newCurriculum: CoursePlan[]) => {
    onChange({ ...program, curriculum: newCurriculum })
  }

  const updateCourse = (index: number, patch: Partial<CoursePlan>) => {
    const arr = [...curriculum]
    arr[index] = { ...arr[index], ...patch }
    updateCurriculum(arr)
  }

  const addCourse = () => {
    updateCurriculum([...curriculum, emptyCourse()])
  }

  const removeCourse = (index: number) => {
    updateCurriculum(curriculum.filter((_, i) => i !== index))
  }

  // 课程课时类型管理
  const updateTypeName = (idx: number, newName: string) => {
    const oldName = courseTypes[idx]
    const newTypes = [...courseTypes]
    newTypes[idx] = newName
    setCourseTypes(newTypes)
    const newCurriculum = curriculum.map((c) =>
      c.courseTypeLabel === oldName ? { ...c, courseTypeLabel: newName } : c
    )
    updateCurriculum(newCurriculum)
  }

  const addType = () => {
    setCourseTypes([...courseTypes, `新课程课时类型${courseTypes.length + 1}`])
  }

  const removeType = (idx: number) => {
    if (courseTypes.length <= 1) {
      toast({ title: '至少保留一个课程课时类型', variant: 'destructive' })
      return
    }
    const removedName = courseTypes[idx]
    const newTypes = courseTypes.filter((_, i) => i !== idx)
    setCourseTypes(newTypes)
    const fallback = newTypes[0]
    const newCurriculum = curriculum.map((c) =>
      c.courseTypeLabel === removedName ? { ...c, courseTypeLabel: fallback } : c
    )
    updateCurriculum(newCurriculum)
    if (activeFilter === removedName) setActiveFilter('全部')
  }

  // 岗位课时选择器组件
  function SceneSearchSelect({
    value,
    onSelect,
    onNewScene,
  }: {
    value: { code: string; name: string }
    onSelect: (scene: { code: string; name: string }) => void
    onNewScene: () => void
  }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
      if (!search.trim()) return mockScenes
      const q = search.toLowerCase()
      return mockScenes.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      )
    }, [search])

    const selectedScene = mockScenes.find((s) => s.code === value.code && s.name === value.name)

    return (
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between font-normal h-8 text-xs"
            >
              <span className={cn('truncate', !selectedScene && 'text-muted-foreground')}>
                {selectedScene ? `${selectedScene.name} (${selectedScene.code})` : '选择岗位课时...'}
              </span>
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="搜索岗位课时名称或编码..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>未找到匹配的岗位课时</CommandEmpty>
                <CommandGroup>
                  {filtered.map((scene) => (
                    <CommandItem
                      key={scene.code}
                      value={scene.code}
                      onSelect={() => {
                        onSelect(scene)
                        setOpen(false)
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 shrink-0',
                          value.code === scene.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm">{scene.name}</span>
                        <span className="text-xs text-muted-foreground">{scene.code}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={onNewScene}>
          <Plus className="h-3 w-3 mr-1" />
          切换手动输入
        </Button>
      </div>
    )
  }

  const tabButtons = (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={activeFilter === '全部' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveFilter('全部')}
      >
        全部 ({curriculum.length})
      </Button>
      <Button
        variant={activeFilter === '场景' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveFilter('场景')}
      >
        岗位课时 ({curriculum.filter((c) => c.courseType === '场景').length})
      </Button>
      {courseTypes.map((type) => {
        const count = curriculum.filter((c) => c.courseTypeLabel === type).length
        return (
          <Button
            key={type}
            variant={activeFilter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(type)}
          >
            {type} ({count})
          </Button>
        )
      })}
    </div>
  )

  const toolbarButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => { setPositionSceneOpen(true); setSelectedPositionId(''); setPositionSearch('') }}>
        <Briefcase className="h-4 w-4 mr-1" />
        岗位导入
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast({ title: '导入功能使用现有组件样式即可' })}>
        <Upload className="h-4 w-4 mr-1" />
        导入
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast({ title: '导出功能使用现有组件样式即可' })}>
        <Download className="h-4 w-4 mr-1" />
        导出
      </Button>
      <Button variant="outline" size="sm" onClick={() => { setLibraryOpen(true); setSelectedLibraryIds(new Set()); setLibrarySearch(''); setLibraryCategory('全部') }}>
        <Library className="h-4 w-4 mr-1" />
        课程课时库管理
      </Button>
      <Button variant="outline" size="sm" onClick={() => setTypeConfigOpen(true)}>
        <Settings className="h-4 w-4 mr-1" />
        课程课时类型管理
      </Button>
    </div>
  )

  const tableContent = (
    <>
      {/* 大表格 */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead className="w-44">课程课时类型</TableHead>
              <TableHead className="w-28">课时代码</TableHead>
              <TableHead className="w-96">课时名称</TableHead>
              <TableHead className="w-32">学分</TableHead>
              <TableHead className="w-24">课时（学时）</TableHead>
              <TableHead className="w-24">性质</TableHead>
              <TableHead className="w-32"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((c, displayIdx) => {
              const realIndex = curriculum.findIndex((item) => item.id === c.id)
              const syllabusId = c.name ? findSyllabusId(c.name) : null
              const isScene = c.courseType === '场景'
              const isNewSceneMode = sceneEditMode[c.id] || false

              return (
                <TableRow key={c.id}>
                  {/* 类型切换（无列名） */}
                  <TableCell>
                    <Select
                      value={c.courseType || '课程'}
                      onValueChange={(v) => {
                        const isSceneNew = v === '场景'
                        updateCourse(realIndex, {
                          courseType: v as '课程' | '场景',
                          courseTypeLabel: isSceneNew ? '' : (c.courseTypeLabel || courseTypes[0]),
                        })
                        if (isSceneNew) {
                          setSceneEditMode((prev) => ({ ...prev, [c.id]: false }))
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="课程">课程课时</SelectItem>
                        <SelectItem value="场景">岗位课时</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* 课程课时类型 */}
                  <TableCell>
                    {isScene ? (
                      <span className="text-xs text-muted-foreground">-</span>
                    ) : (
                      <Select
                        value={c.courseTypeLabel || ''}
                        onValueChange={(v) => updateCourse(realIndex, { courseTypeLabel: v })}
                      >
                        <SelectTrigger className="h-8 text-xs w-40">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  {/* 课程课时（岗位课时）代码 + 名称 */}
                  {isScene ? (
                    <>
                      <TableCell>
                        {isNewSceneMode ? (
                          <Input
                            value={c.code}
                            onChange={(e) => updateCourse(realIndex, { code: e.target.value })}
                            className="h-8 text-xs w-full"
                            placeholder="岗位课时编码"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground truncate block">
                            {c.code || '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isNewSceneMode ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={c.name}
                              onChange={(e) => updateCourse(realIndex, { name: e.target.value })}
                              className="h-8 text-xs flex-1"
                              placeholder="岗位课时名称"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs shrink-0"
                              onClick={() => setSceneEditMode((prev) => ({ ...prev, [c.id]: false }))}
                            >
                              取消
                            </Button>
                          </div>
                        ) : (
                          <SceneSearchSelect
                            value={{ code: c.code, name: c.name }}
                            onSelect={(scene) => {
                              updateCourse(realIndex, { code: scene.code, name: scene.name })
                            }}
                            onNewScene={() => setSceneEditMode((prev) => ({ ...prev, [c.id]: true }))}
                          />
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <Input
                          value={c.code}
                          onChange={(e) => updateCourse(realIndex, { code: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={c.name}
                          onChange={(e) => updateCourse(realIndex, { name: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </TableCell>
                    </>
                  )}

                  {/* 学分 */}
                  <TableCell>
                    <Input
                      type="number"
                      value={c.credits}
                      onChange={(e) => updateCourse(realIndex, { credits: Number(e.target.value) })}
                      className="h-8 text-xs"
                    />
                  </TableCell>

                  {/* 课时（学时） */}
                  <TableCell>
                    <Input
                      type="number"
                      value={c.hours}
                      onChange={(e) => updateCourse(realIndex, { hours: Number(e.target.value) })}
                      className="h-8 text-xs"
                    />
                  </TableCell>

                  {/* 性质 */}
                  <TableCell>
                    <Select
                      value={c.subCategory || courseNatures[0] || '必修'}
                      onValueChange={(v) => updateCourse(realIndex, { subCategory: v })}
                    >
                      <SelectTrigger className="h-8 text-xs w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courseNatures.map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* 操作 */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {c.name && syllabusId ? (
                        <a
                          href={`/admin/operations/syllabus/${syllabusId}?edit=1`}
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          进入详细配置
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">进入详细配置</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeCourse(realIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Button variant="outline" size="sm" onClick={addCourse}>
        <Plus className="h-4 w-4 mr-1" /> 添加课时
      </Button>

      {/* 课程课时类型管理弹窗 */}
      <Dialog open={typeConfigOpen} onOpenChange={setTypeConfigOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>课程课时类型管理</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {courseTypes.map((type, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={type}
                  onChange={(e) => updateTypeName(idx, e.target.value)}
                  className="h-9 text-sm flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeType(idx)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={addType}>
              <Plus className="h-4 w-4 mr-1" /> 新增类型
            </Button>
            <Button size="sm" onClick={() => setTypeConfigOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 课程课时库管理弹窗 */}
      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              课程课时库管理
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 space-y-3">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课程课时名称或代码..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* 分类筛选 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {libraryCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={libraryCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setLibraryCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              已选 <span className="font-medium text-foreground">{selectedLibraryIds.size}</span> 门课程课时 ·
              共 <span className="font-medium text-foreground">{filteredLibrary.length}</span> 门
            </div>
          </div>

          {/* 课程课时列表 */}
          <div className="px-6 pb-2">
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_80px_80px_60px] gap-2 px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
                <span>课程课时名称</span>
                <span className="text-center">代码</span>
                <span className="text-center">学分</span>
                <span className="text-center">学时</span>
                <span className="text-center">选择</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {filteredLibrary.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-8">未找到匹配的课程课时</div>
                )}
                {filteredLibrary.map((course) => {
                  const alreadyExists = curriculum.some((c) => c.name === course.name)
                  const isSelected = selectedLibraryIds.has(course.id)
                  return (
                    <div
                      key={course.id}
                      className={cn(
                        'grid grid-cols-[1fr_100px_80px_80px_60px] gap-2 px-3 py-2.5 text-sm border-b last:border-b-0 items-center transition-colors',
                        isSelected ? 'bg-primary/5' : 'hover:bg-muted/50',
                        alreadyExists && 'opacity-50'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">{course.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{course.type}</div>
                      </div>
                      <span className="text-xs text-muted-foreground text-center truncate">{course.code || '-'}</span>
                      <span className="text-xs text-center">{course.credits}</span>
                      <span className="text-xs text-center">{course.hours}</span>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isSelected}
                          disabled={alreadyExists}
                          onCheckedChange={() => toggleLibrarySelection(course.id)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLibraryIds(new Set())}
              disabled={selectedLibraryIds.size === 0}
            >
              清空选择
            </Button>
            <Button size="sm" onClick={addFromLibrary} disabled={selectedLibraryIds.size === 0}>
              添加选中课程课时 ({selectedLibraryIds.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 岗位导入弹窗 */}
      <Dialog open={positionSceneOpen} onOpenChange={setPositionSceneOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              岗位导入
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* 岗位搜索 */}
            <div className="space-y-2">
              <Label className="text-sm">选择岗位</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索岗位名称或代码..."
                  value={positionSearch}
                  onChange={(e) => setPositionSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <div className="border rounded-md overflow-hidden max-h-[360px] overflow-y-auto">
                {filteredPositions.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">未找到匹配的岗位</div>
                )}
                {filteredPositions.map((pos) => (
                  <div
                    key={pos.id}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-b last:border-b-0 transition-colors',
                      selectedPositionId === pos.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                    )}
                    onClick={() => setSelectedPositionId(pos.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-4 h-4 rounded-full border flex items-center justify-center',
                        selectedPositionId === pos.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                      )}>
                        {selectedPositionId === pos.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-medium">{pos.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{pos.code}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setPositionSceneOpen(false)}>取消</Button>
            <Button size="sm" onClick={handleImportScenes} disabled={!selectedPositionId}>
              加入选中岗位
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )

  return showTitle ? (
    <section id="section-curriculum" className="scroll-mt-24 scroll-smooth space-y-4">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center gap-2">
          <LayoutList className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">教学进程总体安排</h2>
        </div>
        {toolbarButtons}
      </div>
      {tabButtons}
      {tableContent}
    </section>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {tabButtons}
        {toolbarButtons}
      </div>
      {tableContent}
    </div>
  )
}
