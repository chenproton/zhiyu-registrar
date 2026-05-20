'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FilterBar } from '@/components/shared/filter-bar'
import { Plus, Pencil } from 'lucide-react'
import { classes, majors, departments } from '@/lib/mock-data'

export default function ClassesPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ major: 'all', entryYear: 'all' })

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      if (search) {
        const s = search.toLowerCase()
        if (!c.name.toLowerCase().includes(s) && !c.code.toLowerCase().includes(s)) return false
      }
      if (filters.major !== 'all' && c.majorId !== filters.major) return false
      if (filters.entryYear !== 'all' && String(c.entryYear) !== filters.entryYear) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">班级管理</h1>
          <p className="text-muted-foreground">维护各专业下设班级信息</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建班级</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索班级名称或编码..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'major',
                label: '全部专业',
                options: majors.map((m) => ({ value: m.id, label: m.name })),
              },
              {
                key: 'entryYear',
                label: '全部年级',
                options: [
                  { value: '2026', label: '2026级' },
                  { value: '2025', label: '2025级' },
                  { value: '2024', label: '2024级' },
                  { value: '2023', label: '2023级' },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
            onClearFilters={() => { setSearch(''); setFilters({ major: 'all', entryYear: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>班级编码</TableHead>
                <TableHead>班级名称</TableHead>
                <TableHead>所属专业</TableHead>
                <TableHead>入学年份</TableHead>
                <TableHead>班主任</TableHead>
                <TableHead>学生数</TableHead>
                <TableHead>班级性质</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.code}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{majors.find((m) => m.id === c.majorId)?.name}</TableCell>
                  <TableCell>{c.entryYear}级</TableCell>
                  <TableCell>{c.headTeacher}</TableCell>
                  <TableCell>{c.studentCount}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
