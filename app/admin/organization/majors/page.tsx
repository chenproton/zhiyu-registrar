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
import { Plus, Pencil } from 'lucide-react'
import { majors, departments } from '@/lib/mock-data'

export default function MajorsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ department: 'all', level: 'all' })

  const filtered = useMemo(() => {
    return majors.filter((m) => {
      if (search) {
        const s = search.toLowerCase()
        if (!m.name.toLowerCase().includes(s) && !m.code.toLowerCase().includes(s)) return false
      }
      if (filters.department !== 'all' && m.departmentId !== filters.department) return false
      if (filters.level !== 'all' && m.level !== filters.level) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">专业管理</h1>
          <p className="text-muted-foreground">维护各院系下设专业信息</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建专业</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索专业名称或编码..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'department',
                label: '全部院系',
                options: departments.map((d) => ({ value: d.id, label: d.name })),
              },
              {
                key: 'level',
                label: '全部层次',
                options: [
                  { value: '中专', label: '中专' },
                  { value: '大专', label: '大专' },
                  { value: '本科', label: '本科' },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
            onClearFilters={() => { setSearch(''); setFilters({ department: 'all', level: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>专业编码</TableHead>
                <TableHead>专业名称</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>培养层次</TableHead>
                <TableHead>学制</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.code}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{departments.find((d) => d.id === m.departmentId)?.name}</TableCell>
                  <TableCell>{m.level}</TableCell>
                  <TableCell>{m.duration}年</TableCell>
                  <TableCell>
                    <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                      {m.status === 'active' ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
