'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Users, Star, Building2 } from 'lucide-react'
import { evaluationRecords, evaluationActivities, tasks, departments, classes, majors, trainingPrograms } from '@/lib/mock-data'

const roleGroups = [
  { key: 'all', label: '全部评价' },
  { key: 'student', label: '学生评教' },
  { key: 'internal', label: '内部评价' },
  { key: 'expert', label: '专家评价' },
  { key: 'enterprise', label: '企业评价' },
]

const roleMap: Record<string, string> = {
  student: '学生',
  internal: '教师',
  expert: '专家',
  enterprise: '企业导师',
}

export default function EvaluationResultsPage() {
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [filterDept, setFilterDept] = useState<string>('all')
  const [filterTaskId, setFilterTaskId] = useState<string>('all')
  const [filterProgramId, setFilterProgramId] = useState<string>('all')

  const filteredRecords = useMemo(() => {
    return evaluationRecords.filter((r) => {
      if (selectedRole !== 'all' && r.evaluatorRole !== selectedRole) return false
      if (filterTaskId !== 'all') {
        const task = tasks.find((t) => t.name === r.evaluateeName || t.facultyName === r.evaluateeName)
        if (task?.id !== filterTaskId) return false
      }
      if (filterDept !== 'all') {
        const task = tasks.find((t) => t.facultyName === r.evaluateeName)
        if (task) {
          const cls = classes.find((c) => c.id === task.classId)
          const major = majors.find((m) => m.id === cls?.majorId)
          if (major?.departmentId !== filterDept) return false
        }
      }
      if (filterProgramId !== 'all') {
        const activity = evaluationActivities.find((a) => a.id === r.activityId)
        if (activity?.trainingProgramId !== filterProgramId) return false
      }
      return true
    })
  }, [selectedRole, filterDept, filterTaskId, filterProgramId])

  const avgScore =
    filteredRecords.length > 0
      ? (filteredRecords.reduce((s, r) => s + r.totalScore, 0) / filteredRecords.length).toFixed(2)
      : '—'

  const taskCount = new Set(filteredRecords.map((r) => r.evaluateeName)).size

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧评价主体导航 */}
      <div className="w-64 shrink-0 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">评价主体</span>
        </div>
        <div className="space-y-1">
          {roleGroups.map((rg) => {
            const count =
              rg.key === 'all'
                ? evaluationRecords.length
                : evaluationRecords.filter((r) => r.evaluatorRole === rg.key).length
            return (
              <button
                key={rg.key}
                onClick={() => setSelectedRole(rg.key)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                  selectedRole === rg.key
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span>{rg.label}</span>
                <span
                  className={`text-xs ${
                    selectedRole === rg.key ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 px-2 mb-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">院系分布</span>
          </div>
          <div className="space-y-1 px-2">
            {departments.map((d) => {
              const deptClassIds = classes
                .filter((c) => {
                  const m = majors.find((mj) => mj.id === c.majorId)
                  return m?.departmentId === d.id
                })
                .map((c) => c.id)
              const deptFacultyNames = tasks
                .filter((t) => deptClassIds.includes(t.classId))
                .map((t) => t.facultyName)
              const count = evaluationRecords.filter((r) => deptFacultyNames.includes(r.evaluateeName)).length
              return (
                <div key={d.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">任务评价结果</h1>
            <p className="text-muted-foreground text-sm">
              共 {filteredRecords.length} 条评价记录 · {roleMap[selectedRole] || '全部'}视角
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">总评价记录</p>
                <p className="text-2xl font-bold">{filteredRecords.length}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">平均总分</p>
                <p className="text-2xl font-bold">{avgScore}</p>
              </div>
              <div className="rounded-full p-2 bg-amber-500">
                <Star className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">覆盖教师数</p>
                <p className="text-2xl font-bold">{taskCount}</p>
              </div>
              <div className="rounded-full p-2 bg-purple-500">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="按院系筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部院系</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTaskId} onValueChange={setFilterTaskId}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="筛选任务" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部任务</SelectItem>
              {tasks.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterProgramId} onValueChange={setFilterProgramId}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="按培养方案筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部培养方案</SelectItem>
              {trainingPrograms.map((tp) => (
                <SelectItem key={tp.id} value={tp.id}>{tp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>评价人</TableHead>
                  <TableHead>身份</TableHead>
                  <TableHead>被评价教师</TableHead>
                  <TableHead>关联任务</TableHead>
                  <TableHead>各维度得分</TableHead>
                  <TableHead>总评</TableHead>
                  <TableHead>课程版本</TableHead>
                  <TableHead>评语</TableHead>
                  <TableHead>提交时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.evaluatorName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {roleMap[r.evaluatorRole] || r.evaluatorRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.evaluateeName}</TableCell>
                    <TableCell className="text-sm">{r.evaluateeType}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        {Object.entries(r.scores).map(([dim, score]) => (
                          <div key={dim} className="flex items-center gap-1">
                            <span className="text-muted-foreground">{dim}</span>
                            <span className="font-medium">{score}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.totalScore >= 4.5 ? 'default' : r.totalScore >= 3.5 ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {r.totalScore.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.courseVersion || '—'}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs">{r.comment || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.submittedAt}</TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                      暂无评价记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
