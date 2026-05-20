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
import { faculty, departments } from '@/lib/mock-data'

export default function FacultyPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ department: 'all', status: 'all' })

  const filtered = useMemo(() => {
    return faculty.filter((f) => {
      if (search) {
        const s = search.toLowerCase()
        if (!f.name.toLowerCase().includes(s) && !f.employeeId.toLowerCase().includes(s)) return false
      }
      if (filters.department !== 'all' && f.departmentId !== filters.department) return false
      if (filters.status !== 'all' && f.status !== filters.status) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">师资管理</h1>
          <p className="text-muted-foreground">维护教师档案、授课资格与企业导师信息</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新建教师</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索教师姓名或工号..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: 'department',
                label: '全部院系',
                options: departments.map((d) => ({ value: d.id, label: d.name })),
              },
              {
                key: 'status',
                label: '全部状态',
                options: [
                  { value: '在职', label: '在职' },
                  { value: '离职', label: '离职' },
                  { value: '外聘', label: '外聘' },
                ],
              },
            ]}
            filterValues={filters}
            onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
            onClearFilters={() => { setSearch(''); setFilters({ department: 'all', status: 'all' }) }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>工号</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>性别</TableHead>
                <TableHead>所属院系</TableHead>
                <TableHead>职称</TableHead>
                <TableHead>学历</TableHead>
                <TableHead>授课资格</TableHead>
                <TableHead>企业导师</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.employeeId}</TableCell>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.gender}</TableCell>
                  <TableCell>{departments.find((d) => d.id === f.departmentId)?.name}</TableCell>
                  <TableCell>{f.title}</TableCell>
                  <TableCell>{f.education}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {f.teachingQualifications.map((q) => (
                        <Badge key={q} variant="outline" className="text-xs">{q}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {f.isEnterpriseMentor ? (
                      <Badge variant="default" className="text-xs">是</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={f.status === '在职' ? 'default' : 'secondary'}>{f.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
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
