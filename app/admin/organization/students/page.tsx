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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FilterBar } from '@/components/shared/filter-bar'
import { Plus, Pencil } from 'lucide-react'
import { students, classes, majors, departments, statusChanges } from '@/lib/mock-data'

const statusColor: Record<string, string> = {
  '在籍': 'default',
  '休学': 'secondary',
  '退学': 'destructive',
  '毕业': 'default',
  '结业': 'secondary',
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'all', major: 'all' })

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const term = search.toLowerCase()
        if (!s.name.toLowerCase().includes(term) && !s.studentId.toLowerCase().includes(term)) return false
      }
      if (filters.status !== 'all' && s.status !== filters.status) return false
      if (filters.major !== 'all' && s.majorId !== filters.major) return false
      return true
    })
  }, [search, filters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学生学籍管理</h1>
          <p className="text-muted-foreground">管理学生基础信息与学籍异动</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />新生录入</Button>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">学生信息管理</TabsTrigger>
          <TabsTrigger value="changes">学籍异动管理</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <FilterBar
                searchPlaceholder="搜索学生姓名或学号..."
                searchValue={search}
                onSearchChange={setSearch}
                filters={[
                  {
                    key: 'status',
                    label: '全部学籍状态',
                    options: [
                      { value: '在籍', label: '在籍' },
                      { value: '休学', label: '休学' },
                      { value: '退学', label: '退学' },
                      { value: '毕业', label: '毕业' },
                      { value: '结业', label: '结业' },
                    ],
                  },
                  {
                    key: 'major',
                    label: '全部专业',
                    options: majors.map((m) => ({ value: m.id, label: m.name })),
                  },
                ]}
                filterValues={filters}
                onFilterChange={(key, value) => setFilters((p) => ({ ...p, [key]: value }))}
                onClearFilters={() => { setSearch(''); setFilters({ status: 'all', major: 'all' }) }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>学号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>所属院系</TableHead>
                    <TableHead>专业</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>入学年份</TableHead>
                    <TableHead>学籍状态</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.studentId}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.gender}</TableCell>
                      <TableCell>{departments.find((d) => d.id === s.departmentId)?.name}</TableCell>
                      <TableCell>{majors.find((m) => m.id === s.majorId)?.name}</TableCell>
                      <TableCell>{classes.find((c) => c.id === s.classId)?.name}</TableCell>
                      <TableCell>{s.entryYear}级</TableCell>
                      <TableCell>
                        <Badge variant={statusColor[s.status] as any}>{s.status}</Badge>
                      </TableCell>
                      <TableCell>{s.gpa.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
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
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>异动类型</TableHead>
                    <TableHead>学生学号</TableHead>
                    <TableHead>学生姓名</TableHead>
                    <TableHead>原状态/值</TableHead>
                    <TableHead>新状态/值</TableHead>
                    <TableHead>异动日期</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>审批人</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusChanges.map((sc) => {
                    const stu = students.find((s) => s.id === sc.studentId)
                    return (
                      <TableRow key={sc.id}>
                        <TableCell><Badge>{sc.type}</Badge></TableCell>
                        <TableCell>{stu?.studentId}</TableCell>
                        <TableCell>{stu?.name}</TableCell>
                        <TableCell>{sc.fromValue || '—'}</TableCell>
                        <TableCell>{sc.toValue || '—'}</TableCell>
                        <TableCell>{sc.date}</TableCell>
                        <TableCell>{sc.reason}</TableCell>
                        <TableCell>{sc.approver}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
