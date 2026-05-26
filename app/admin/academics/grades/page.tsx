'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FilterBar } from '@/components/shared/filter-bar'
import { CheckCircle, XCircle, Send } from 'lucide-react'
import { gradeRecords, students } from '@/lib/mock-data'
import { toast } from 'sonner'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  '待确认': { label: '待确认', variant: 'secondary' },
  '待审核': { label: '待审核', variant: 'outline' },
  '待认定': { label: '待认定', variant: 'outline' },
  '已认定': { label: '已认定', variant: 'default' },
  '已发布': { label: '已发布', variant: 'default' },
}

export default function GradesPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all' })

  const filtered = useMemo(() => {
    return gradeRecords.filter((g) => {
      const stu = students.find((s) => s.id === g.studentId)
      if (search) {
        const term = search.toLowerCase()
        if (!stu?.name.toLowerCase().includes(term) && !g.courseName.toLowerCase().includes(term)) return false
      }
      if (filters.status !== 'all' && g.status !== filters.status) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">成绩认定</h1>
          <p className="text-muted-foreground">成绩同步、确认、审核、认定与发布</p>
        </div>
        <Button onClick={() => toast.success('成绩发布成功')}><Send className="h-4 w-4 mr-2" />发布成绩</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索学生姓名或课程..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'status',
                label: '全部状态',
                options: [
                  { value: '待确认', label: '待确认' },
                  { value: '待审核', label: '待审核' },
                  { value: '待认定', label: '待认定' },
                  { value: '已认定', label: '已认定' },
                  { value: '已发布', label: '已发布' },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
            onClearFilters={() => { setSearch(''); setFilters({ status: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>学生</TableHead>
                <TableHead>课程</TableHead>
                <TableHead>成绩类型</TableHead>
                <TableHead>原始成绩</TableHead>
                <TableHead>认定成绩</TableHead>
                <TableHead>学分</TableHead>
                <TableHead>绩点</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((g) => {
                const stu = students.find((s) => s.id === g.studentId)
                return (
                  <TableRow key={g.id}>
                    <TableCell>{stu?.name}</TableCell>
                    <TableCell className="font-medium">{g.courseName}</TableCell>
                    <TableCell>{g.gradeType}</TableCell>
                    <TableCell>{g.rawScore}</TableCell>
                    <TableCell>{g.recognizedScore}</TableCell>
                    <TableCell>{g.credits}</TableCell>
                    <TableCell>{g.gpa.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[g.status].variant}>{statusMap[g.status].label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {g.status === '待确认' && <Button variant="ghost" size="icon" onClick={() => toast.success('成绩已确认')}><CheckCircle className="h-4 w-4 text-green-600" /></Button>}
                        {g.status === '待审核' && <Button variant="ghost" size="icon" onClick={() => toast.success('成绩已审核')}><CheckCircle className="h-4 w-4 text-green-600" /></Button>}
                        {g.status === '待认定' && <Button variant="ghost" size="icon" onClick={() => toast.success('成绩已认定')}><CheckCircle className="h-4 w-4 text-green-600" /></Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">暂无数据</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
