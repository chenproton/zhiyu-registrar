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
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import VenueManager, {
  type VenueManagerState,
  type EditableVenue,
} from '@/components/shared/venue-manager'
import { venues as mockVenues, venueTypes as mockVenueTypes, allPeriods, type Venue } from '@/lib/mock-data'

export interface AlignmentState {
  venues: Venue[]
  venueTypes: string[]
  venueMapping: Record<string, string>
  periodMapping: Record<string, string[]>
}

interface VenuePeriodAlignmentTabProps {
  onChange?: (state: AlignmentState) => void
}

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
  const [selectedVenueColumn, setSelectedVenueColumn] = useState<string>('')
  const [selectedPeriodColumn, setSelectedPeriodColumn] = useState<string>('')
  const [externalVenueValues, setExternalVenueValues] = useState<string[]>([])
  const [externalPeriodValues, setExternalPeriodValues] = useState<string[]>([])

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
    })
  }, [currentVenues, managerState.venueTypes, venueMapping, periodMapping, onChange])

  const handleFileUpload = async (file: File) => {
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
      if (json.length < 2) {
        toast.warning('Excel 内容为空或缺少表头')
        return
      }
      const [headerRow, ...dataRows] = json
      const headers = (headerRow || []).map((h) => String(h || '')).filter(Boolean)
      if (headers.length === 0) {
        toast.warning('未能识别到表头')
        return
      }
      setFileName(file.name)
      setHeaders(headers)
      setRows(dataRows)
      setSelectedVenueColumn('')
      setSelectedPeriodColumn('')
      setExternalVenueValues([])
      setExternalPeriodValues([])
      setVenueMapping({})
      setPeriodMapping({})
      toast.success(`已解析 ${file.name}，共 ${dataRows.length} 行数据`)
    } catch (err) {
      toast.error('Excel 解析失败，请检查文件格式')
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

  const handleVenueColumnChange = (column: string) => {
    setSelectedVenueColumn(column)
    const values = extractUniqueValues(column)
    setExternalVenueValues(values)
    const nextMapping: Record<string, string> = {}
    values.forEach((val) => {
      const matched = managerState.venues.find(
        (v) => v.name === val || v.code === val
      )
      if (matched) nextMapping[val] = matched.id
    })
    setVenueMapping(nextMapping)
  }

  const handlePeriodColumnChange = (column: string) => {
    setSelectedPeriodColumn(column)
    const values = extractUniqueValues(column)
    setExternalPeriodValues(values)
    const nextMapping: Record<string, string[]> = {}
    values.forEach((val) => {
      // 尝试精确匹配单节次；范围值需要用户手动勾选
      const exact = allPeriods.find((p) => p === val)
      nextMapping[val] = exact ? [exact] : []
    })
    setPeriodMapping(nextMapping)
  }

  const addManualExternalVenue = (val: string) => {
    const key = val.trim()
    if (!key || externalVenueValues.includes(key)) return
    setExternalVenueValues((prev) => [...prev, key])
  }

  const addManualExternalPeriod = (val: string) => {
    const key = val.trim()
    if (!key || externalPeriodValues.includes(key)) return
    setExternalPeriodValues((prev) => [...prev, key])
  }

  const venueMapById = useMemo(() => {
    const map = new Map<string, EditableVenue>()
    managerState.venues.forEach((v) => map.set(v.id, v))
    return map
  }, [managerState.venues])

  const unmappedVenues = useMemo(
    () => externalVenueValues.filter((v) => !venueMapping[v]),
    [externalVenueValues, venueMapping]
  )
  const unmappedPeriods = useMemo(
    () => externalPeriodValues.filter((v) => (periodMapping[v] || []).length === 0),
    [externalPeriodValues, periodMapping]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">场地 + 节次对齐</h2>
          <p className="text-sm text-muted-foreground">
            在导入课表前，先将外部 Excel 中的场地、节次名称与系统内数据对齐
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unmappedVenues.length === 0 && unmappedPeriods.length === 0 ? (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              当前映射完整
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              待映射: 场地 {unmappedVenues.length} / 节次 {unmappedPeriods.length}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="venues">
        <TabsList>
          <TabsTrigger value="venues" className="gap-1">
            <MapPin className="h-4 w-4" />
            场地资源管理
          </TabsTrigger>
          <TabsTrigger value="mapping" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Excel 对齐映射
          </TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="pt-4">
          <VenueManager
            initialVenues={mockVenues}
            initialVenueTypes={mockVenueTypes}
            onChange={setManagerState}
          />
        </TabsContent>

        <TabsContent value="mapping" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                上传外部排课 Excel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                上传一份示例 Excel，系统将自动识别场地列和节次列，并提示你做映射。
              </p>
              <div className="flex items-center gap-3">
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
                  <Button asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      上传 Excel
                    </span>
                  </Button>
                </label>
                {fileName && (
                  <span className="text-sm text-muted-foreground">
                    已选择：{fileName}（{rows.length} 行）
                  </span>
                )}
              </div>

              {headers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      场地所在列
                    </Label>
                    <Select
                      value={selectedVenueColumn}
                      onValueChange={handleVenueColumnChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择列" />
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
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      节次所在列
                    </Label>
                    <Select
                      value={selectedPeriodColumn}
                      onValueChange={handlePeriodColumnChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择列" />
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
              )}
            </CardContent>
          </Card>

          {externalVenueValues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  场地映射
                  {unmappedVenues.length > 0 && (
                    <Badge variant="secondary" className="text-amber-600">
                      待完成 {unmappedVenues.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="手动添加外部场地名称"
                    className="w-[240px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addManualExternalVenue((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
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
                    <Plus className="h-4 w-4 mr-1" />
                    添加
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>外部 Excel 场地值</TableHead>
                        <TableHead>映射状态</TableHead>
                        <TableHead>系统场地</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {externalVenueValues.map((val) => {
                        const mappedId = venueMapping[val]
                        const mappedVenue = mappedId
                          ? venueMapById.get(mappedId)
                          : undefined
                        return (
                          <TableRow key={val}>
                            <TableCell className="font-medium">{val}</TableCell>
                            <TableCell>
                              {mappedVenue ? (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-green-600 border-green-300"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  已映射
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-amber-600 border-amber-300"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  未映射
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={mappedId || ''}
                                onValueChange={(id) =>
                                  setVenueMapping((prev) => ({
                                    ...prev,
                                    [val]: id,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-[260px]">
                                  <SelectValue placeholder="选择系统场地" />
                                </SelectTrigger>
                                <SelectContent>
                                  {managerState.venues.map((v) => (
                                    <SelectItem key={v.id} value={v.id}>
                                      {v.name}（{v.code}）
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  setExternalVenueValues((prev) =>
                                    prev.filter((x) => x !== val)
                                  )
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {externalPeriodValues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  节次映射
                  {unmappedPeriods.length > 0 && (
                    <Badge variant="secondary" className="text-amber-600">
                      待完成 {unmappedPeriods.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    id="manual-period-input"
                    placeholder="手动添加外部节次名称"
                    className="w-[240px]"
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
                    <Plus className="h-4 w-4 mr-1" />
                    添加
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>外部 Excel 节次值</TableHead>
                        <TableHead>映射状态</TableHead>
                        <TableHead>系统节次（可多选）</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {externalPeriodValues.map((val) => {
                        const mapped = periodMapping[val] || []
                        const complete = mapped.length > 0
                        return (
                          <TableRow key={val}>
                            <TableCell className="font-medium">{val}</TableCell>
                            <TableCell>
                              {complete ? (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-green-600 border-green-300"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  已映射
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-amber-600 border-amber-300"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  未映射
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <ScrollArea className="h-[120px] w-[320px] rounded-md border p-2">
                                <div className="space-y-1">
                                  {allPeriods.map((p) => {
                                    const checked = mapped.includes(p)
                                    return (
                                      <label
                                        key={p}
                                        className={cn(
                                          'flex items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer hover:bg-muted',
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
                                                : current.filter((x) => x !== p)
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
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  setExternalPeriodValues((prev) =>
                                    prev.filter((x) => x !== val)
                                  )
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {fileName &&
            externalVenueValues.length === 0 &&
            externalPeriodValues.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-6">
                请在上方选择“场地所在列”和“节次所在列”以开始映射
              </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
