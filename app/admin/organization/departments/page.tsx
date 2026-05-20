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
import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
import { departments } from '@/lib/mock-data'

export default function DepartmentsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all' })

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      if (search) {
        const s = search.toLowerCase()
        if (!d.name.toLowerCase().includes(s) && !d.code.toLowerCase().includes(s)) return false
      }
      if (filters.status !== 'all' && d.status !== filters.status) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">院系管理</h1>
          <p className="text-muted-foreground">维护学校组织架构中的院系信息</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建院系</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索院系名称或编码..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'status',
                label: '全部状态',
                options: [
                  { value: 'active', label: '启用' },
                  { value: 'inactive', label: '禁用' },
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
                <TableHead>院系编码</TableHead>
                <TableHead>院系名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.code}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>{d.leader}</TableCell>
                  <TableCell>
                    <Badge variant={d.status === 'active' ? 'default' : 'secondary'}>
                      {d.status === 'active' ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon">
                        {d.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
