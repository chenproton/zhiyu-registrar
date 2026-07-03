'use client'

import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileSpreadsheet,
  Upload,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronDown,
  Beaker,
  Wrench,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import VenueManager, {
  type VenueManagerState,
} from '@/components/shared/venue-manager'
import {
  venues as mockVenues,
  venueTypes as mockVenueTypes,
  allPeriods,
  type Venue,
} from '@/lib/mock-data'

export interface AlignmentState {
  venues: Venue[]
  venueTypes: string[]
  venueMapping: Record<string, string>
  periodMapping: Record<string, string[]>
  excel?: {
    fileName: string
    headers: string[]
    rows: unknown[][]
    venueColumn: string
    periodColumn: string
  }
}

interface VenuePeriodAlignmentTabProps {
  onChange?: (state: AlignmentState) => void
}

const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export default function VenuePeriodAlignmentTab({
  onChange,
}: VenuePeriodAlignmentTabProps) {
  const [managerState, setManagerState] = useState<VenueManagerState>({
    venues: mockVenues.map((v) => ({ ...v, type: v.type as string })),
    venueTypes: mockVenueTypes,
  })

  const [venueMapping, setVenueMapping] = useState<Record<string, string>>({})
  const [periodMapping, setPeriodMapping] = useState<Record<string, string[]>>({})

  // Excel parsing state
  const [fileName, setFileName] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<unknown[][]>([])
  const [venueColumn, setVenueColumn] = useState('')
  const [periodColumn, setPeriodColumn] = useState('')

  const currentVenues = useMemo(
    () => managerState.venues.map((v) => ({ ...(v as Venue) })),
    [managerState.venues]
  )

  useEffect(() => {
    onChange?.({
      venues: currentVenues,
      venueTypes: managerState.venueTypes,
      venueMapping,
      periodMapping,
      excel:
        fileName && headers.length && rows.length
          ? { fileName, headers, rows, venueColumn, periodColumn }
          : undefined,
    })
  }, [
    currentVenues,
    managerState.venueTypes,
    venueMapping,
    periodMapping,
    fileName,
    headers,
    rows,
    venueColumn,
    periodColumn,
    onChange,
  ])

  const handleFileUpload = async (file: File) => {
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
      if (json.length < 2) {
        toast.warning('Excel 内容为空或缺少表头')
        return
      }
      const [headerRow, ...dataRows] = json
      const newHeaders = (headerRow || [])
        .map((h) => String(h || ''))
        .filter(Boolean)

      setFileName(file.name)
      setHeaders(newHeaders)
      setRows(dataRows)

      // 自动识别列
      const detectedVenue =
        newHeaders.find((h) =>
          ['场地', '教室', 'venue', 'room'].some((k) =>
            h.toLowerCase().includes(k)
          )
        ) || ''
      const detectedPeriod =
        newHeaders.find((h) =>
          ['节次', '时段', 'period'].some((k) => h.toLowerCase().includes(k))
        ) || ''

      setVenueColumn(detectedVenue)
      setPeriodColumn(detectedPeriod)
      setVenueMapping({})
      setPeriodMapping({})

      toast.success(`已解析 ${file.name}，共 ${dataRows.length} 行`)
    } catch (err) {
      toast.error('Excel 解析失败')
      console.error(err)
    }
  }

  const extractUniqueValues = (column: string) => {
    const idx = headers.indexOf(column)
    if (idx < 0) return []
    const values = new Set<string>()
    rows.forEach((row) => {
      const val = row[idx]
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        values.add(String(val).trim())
      }
    })
    return Array.from(values)
  }

  const externalVenueValues = useMemo(
    () => (venueColumn ? extractUniqueValues(venueColumn) : []),
    [venueColumn, headers, rows]
  )
  const externalPeriodValues = useMemo(
    () => (periodColumn ? extractUniqueValues(periodColumn) : []),
    [periodColumn, headers, rows]
  )

  // 自动映射：上传/切换列时触发
  useEffect(() => {
    const nextVenueMapping: Record<string, string> = {}
    externalVenueValues.forEach((val) => {
      const matched = managerState.venues.find(
        (v) => v.name === val || v.code === val
      )
      if (matched) nextVenueMapping[val] = matched.id
    })
    setVenueMapping(nextVenueMapping)
  }, [externalVenueValues, managerState.venues])

  useEffect(() => {
    const nextPeriodMapping: Record<string, string[]> = {}
    externalPeriodValues.forEach((val) => {
      const exact = allPeriods.find((p) => p === val)
      nextPeriodMapping[val] = exact ? [exact] : []
    })
    setPeriodMapping(nextPeriodMapping)
  }, [externalPeriodValues])

  const unmappedVenues = useMemo(
    () => externalVenueValues.filter((v) => !venueMapping[v]),
    [externalVenueValues, venueMapping]
  )
  const unmappedPeriods = useMemo(
    () =>
      externalPeriodValues.filter(
        (v) => (periodMapping[v] || []).length === 0
      ),
    [externalPeriodValues, periodMapping]
  )

  const venueMapById = useMemo(() => {
    const map = new Map<string, Venue>()
    currentVenues.forEach((v) => map.set(v.id, v))
    return map
  }, [currentVenues])

  const addManualExternalVenue = (val: string) => {
    const key = val.trim()
    if (!key) return
    // 通过 select column 再提取的方式不太方便，这里直接加入列表
    if (!externalVenueValues.includes(key)) {
      // 这里不直接修改 rows，只是加入映射列表
      // 通过把值加入 externalVenueValues 需要状态变量，简单处理：加到 mapping keys
      setVenueMapping((prev) => ({ ...prev, [key]: '' }))
    }
  }

  const addManualExternalPeriod = (val: string) => {
    const key = val.trim()
    if (!key) return
    setPeriodMapping((prev) => ({ ...prev, [key]: [] }))
  }

  return (
    <div className="space-y-4">
      {/* 顶部：标题 + 上传 + 汇总 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">场地 + 节次对齐</h2>
          <p className="text-sm text-muted-foreground">
            上传外部排课 Excel，将外部场地/节次与系统内部数据对齐
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              {fileName}
              <span className="text-xs">({rows.length} 行)</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              id="alignment-excel-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                handleFileUpload(file)
                e.target.value = ''
              }}
            />
            <label htmlFor="alignment-excel-upload">
              <Button asChild size="sm">
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {fileName ? '重新上传' : '上传 Excel'}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      {fileName && (
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            variant="outline"
            className={cn(
              'gap-1',
              unmappedVenues.length === 0
                ? 'text-green-600 border-green-300'
                : 'text-amber-600 border-amber-300'
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            场地：已映射 {externalVenueValues.length - unmappedVenues.length} /
            待映射 {unmappedVenues.length}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'gap-1',
              unmappedPeriods.length === 0
                ? 'text-green-600 border-green-300'
                : 'text-amber-600 border-amber-300'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            节次：已映射 {externalPeriodValues.length - unmappedPeriods.length} /
            待映射 {unmappedPeriods.length}
          </Badge>
        </div>
      )}

      {!fileName && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            <FileSpreadsheet className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>请先上传外部排课 Excel，系统将自动提取场地和节次值</p>
          </CardContent>
        </Card>
      )}

      {fileName && (
        <>
          {/* 列选择 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    外部场地所在列
                  </Label>
                  <Select
                    value={venueColumn}
                    onValueChange={setVenueColumn}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="选择列" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    外部节次所在列
                  </Label>
                  <Select
                    value={periodColumn}
                    onValueChange={setPeriodColumn}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="选择列" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="venue" className="w-full">
            <TabsList>
              <TabsTrigger value="venue" className="gap-1">
                <MapPin className="h-4 w-4" />
                场地映射
              </TabsTrigger>
              <TabsTrigger value="period" className="gap-1">
                <Clock className="h-4 w-4" />
                节次映射
              </TabsTrigger>
              <TabsTrigger value="manage" className="gap-1">
                <Wrench className="h-4 w-4" />
                场地管理
              </TabsTrigger>
            </TabsList>

            {/* 场地映射 Tab */}
            <TabsContent value="venue" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 左侧：外部场地列表 */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>外部场地值</span>
                      <div className="flex items-center gap-2">
                        <Input
                          id="manual-venue-input"
                          placeholder="手动添加"
                          className="h-8 w-[140px] text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addManualExternalVenue(
                                (e.target as HTMLInputElement).value
                              )
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            const input = document.getElementById(
                              'manual-venue-input'
                            ) as HTMLInputElement
                            if (input) {
                              addManualExternalVenue(input.value)
                              input.value = ''
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <div className="space-y-2">
                      {externalVenueValues.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                          未识别到场地数据，请检查列选择
                        </div>
                      ) : (
                        externalVenueValues.map((val) => {
                          const mappedId = venueMapping[val]
                          const mappedVenue = mappedId
                            ? venueMapById.get(mappedId)
                            : undefined
                          return (
                            <div
                              key={val}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{val}</div>
                                <div>
                                  {mappedVenue ? (
                                    <Badge
                                      variant="outline"
                                      className="gap-1 text-green-600 border-green-300 text-[10px]"
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                      已映射
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="gap-1 text-red-600 border-red-300 text-[10px]"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                      未映射
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={mappedId || ''}
                                  onValueChange={(id) =>
                                    setVenueMapping((prev) => ({
                                      ...prev,
                                      [val]: id,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-[200px] h-8 text-xs">
                                    <SelectValue placeholder="选择系统场地" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currentVenues.map((v) => (
                                      <SelectItem key={v.id} value={v.id}>
                                        {v.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() =>
                                    setVenueMapping((prev) => {
                                      const next = { ...prev }
                                      delete next[val]
                                      return next
                                    })
                                  }
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 右侧：内部场地参考 */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">系统内部场地参考</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>场地名称</TableHead>
                          <TableHead>编码</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>容量</TableHead>
                          <TableHead>位置</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVenues.map((v) => (
                          <TableRow
                            key={v.id}
                            className={
                              v.type === '实训基地'
                                ? 'bg-purple-50/30'
                                : undefined
                            }
                          >
                            <TableCell className="font-medium text-sm">
                              <div className="flex items-center gap-1.5">
                                {v.type === '实训基地' && (
                                  <Beaker className="h-3.5 w-3.5 text-purple-600" />
                                )}
                                {v.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {v.code}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {v.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{v.capacity}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {v.location}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 节次映射 Tab */}
            <TabsContent value="period" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 左侧：外部节次列表 */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>外部节次值</span>
                      <div className="flex items-center gap-2">
                        <Input
                          id="manual-period-input"
                          placeholder="手动添加"
                          className="h-8 w-[140px] text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addManualExternalPeriod(
                                (e.target as HTMLInputElement).value
                              )
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            const input = document.getElementById(
                              'manual-period-input'
                            ) as HTMLInputElement
                            if (input) {
                              addManualExternalPeriod(input.value)
                              input.value = ''
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <div className="space-y-2">
                      {externalPeriodValues.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                          未识别到节次数据，请检查列选择
                        </div>
                      ) : (
                        externalPeriodValues.map((val) => {
                          const mapped = periodMapping[val] || []
                          const complete = mapped.length > 0
                          return (
                            <div
                              key={val}
                              className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{val}</div>
                                <div>
                                  {complete ? (
                                    <Badge
                                      variant="outline"
                                      className="gap-1 text-green-600 border-green-300 text-[10px]"
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                      已映射
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="gap-1 text-red-600 border-red-300 text-[10px]"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                      未映射
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                  >
                                    {complete
                                      ? `已选 ${mapped.length} 个`
                                      : '选择节次'}
                                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[240px] p-0">
                                  <ScrollArea className="h-[240px] p-3">
                                    <div className="space-y-2">
                                      {allPeriods.map((p) => {
                                        const checked = mapped.includes(p)
                                        return (
                                          <label
                                            key={p}
                                            className={cn(
                                              'flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-muted',
                                              checked && 'bg-primary/5'
                                            )}
                                          >
                                            <Checkbox
                                              checked={checked}
                                              onCheckedChange={(c) => {
                                                setPeriodMapping((prev) => {
                                                  const current = prev[val] || []
                                                  const next = c
                                                    ? [...current, p]
                                                    : current.filter(
                                                        (x) => x !== p
                                                      )
                                                  return { ...prev, [val]: next }
                                                })
                                              }}
                                            />
                                            <span>{p}</span>
                                          </label>
                                        )
                                      })}
                                    </div>
                                  </ScrollArea>
                                </PopoverContent>
                              </Popover>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 右侧：内部节次参考网格 */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">系统内部节次参考</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-8 bg-muted">
                        <div className="p-2 text-xs font-medium border-r">
                          节次 / 星期
                        </div>
                        {dayLabels.map((d) => (
                          <div
                            key={d}
                            className="p-2 text-xs font-medium text-center border-r last:border-r-0"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                      {allPeriods.map((p) => (
                        <div key={p} className="grid grid-cols-8 border-t">
                          <div className="p-2 text-xs text-muted-foreground border-r bg-muted/30 flex items-center">
                            {p}
                          </div>
                          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                            <div
                              key={d}
                              className={cn(
                                'p-2 border-r last:border-r-0 min-h-[48px] flex items-center justify-center text-xs text-muted-foreground bg-muted/5'
                              )}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 场地管理 Tab */}
            <TabsContent value="manage" className="pt-4">
              <VenueManager
                initialVenues={mockVenues}
                initialVenueTypes={mockVenueTypes}
                onChange={setManagerState}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
