'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Clock,
  Eye,
  PenLine,
  FileText,
  Search,
  Video,
  Library,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ==================== Mock Data ====================

const SCENE_TASKS = [
  { id: 'st-001', name: 'Web前端开发综合实训', scenarioName: '企业官网开发', scenarioCode: 'SC-2026A-001', taskType: 'assessment' as const, assessmentForm: '成果评价' },
  { id: 'st-002', name: 'API接口设计与测试', scenarioName: '电商平台后端', scenarioCode: 'SC-2026A-002', taskType: 'training' as const, assessmentForm: '现场评审' },
  { id: 'st-003', name: '数据库优化方案', scenarioName: '高并发系统', scenarioCode: 'SC-2026A-003', taskType: 'assessment' as const, assessmentForm: '现场问答' },
]

const CLASSROOMS = [
  { id: 'oc-001', name: '程序设计基础', code: 'CS101-A', teacherName: '周建国', category: '专业课' },
  { id: 'oc-002', name: '高等数学', code: 'MATH101-A', teacherName: '周建国', category: '基础课' },
]

const SMART_COURSES = [
  { id: 'sc-001', name: 'Java程序设计', code: 'JAVA201', teacherName: '周建国', category: '编程基础' },
  { id: 'sc-002', name: '数据结构与算法', code: 'DS301', teacherName: '周建国', category: '核心课' },
]

const STUDENT_NAMES = ['李明', '王芳', '张伟', '刘洋', '陈静', '杨强', '赵敏', '黄磊', '周杰', '吴倩', '徐磊', '孙丽', '马超', '朱琳', '胡军']

function generateMockStudents(count: number, baseId: string) {
  return Array.from({ length: count }, (_, i) => {
    const name = STUDENT_NAMES[i % STUDENT_NAMES.length] + (i >= STUDENT_NAMES.length ? `${Math.floor(i / STUDENT_NAMES.length) + 1}` : '')
    const status = Math.random() > 0.4 ? 'graded' : 'pending'
    return {
      id: `${baseId}-s${i + 1}`,
      name,
      studentNumber: `2026${String(1001 + i).padStart(4, '0')}`,
      className: '软件工程2026级1班',
      enrollmentYear: 2026,
      status: status as 'pending' | 'graded',
      score: status === 'graded' ? Math.floor(60 + Math.random() * 40) : undefined,
      submittedAt: status === 'graded' ? `2026-10-${String(10 + i).padStart(2, '0')} 14:30` : undefined,
      method: ['试卷', '题库', '评审', '现场问答', '随堂测'][Math.floor(Math.random() * 5)],
    }
  })
}

const sceneStudents = generateMockStudents(15, 'scene')
const classroomStudents = generateMockStudents(12, 'class')
const courseStudents = generateMockStudents(14, 'course')

// ==================== Status Filter ====================

function StatusFilterTabs({
  value,
  onChange,
  allCount,
  pendingCount,
  gradedCount,
}: {
  value: 'all' | 'pending' | 'graded'
  onChange: (v: 'all' | 'pending' | 'graded') => void
  allCount: number
  pendingCount: number
  gradedCount: number
}) {
  const tabs = [
    { key: 'all' as const, label: '全部', count: allCount },
    { key: 'pending' as const, label: '待评分', count: pendingCount },
    { key: 'graded' as const, label: '已评分', count: gradedCount },
  ]
  return (
    <div className="flex gap-1.5 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
            value === tab.key
              ? 'bg-primary/10 text-primary border-primary/30'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          )}
        >
          {tab.label}
          <span className="ml-1 text-[10px] opacity-70">({tab.count})</span>
        </button>
      ))}
    </div>
  )
}

// ==================== Student List Item ====================

function StudentListItem({
  student,
}: {
  student: {
    id: string
    name: string
    studentNumber: string
    className: string
    enrollmentYear: number
    status: 'pending' | 'graded'
    score?: number
    submittedAt?: string
    method?: string
  }
}) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
          {student.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 text-sm">{student.name}</span>
            <span className="text-xs text-gray-400">{student.studentNumber}</span>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px]',
                student.status === 'pending'
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-green-50 text-green-600 border-green-200'
              )}
            >
              {student.status === 'pending' ? '待评分' : '已评分'}
            </Badge>
            {student.method && (
              <Badge variant="secondary" className="text-[10px] font-normal">
                {student.method}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {student.className} · {student.enrollmentYear}届
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {student.status === 'graded' && student.score !== undefined && (
          <span className="text-sm font-semibold text-gray-700">{student.score}分</span>
        )}
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast('查看学生测评详情（模拟）')}>
          <Eye className="mr-1 h-3 w-3" />
          查看
        </Button>
        {student.status === 'pending' ? (
          <Button size="sm" className="h-7 text-xs" onClick={() => toast('进入评分页面（模拟）')}>
            <PenLine className="mr-1 h-3 w-3" />
            评分
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" disabled>
            <CheckCircle2 className="mr-1 h-3 w-3" />
            已评分
          </Button>
        )}
      </div>
    </div>
  )
}


// ==================== Scene Task Tab ====================

const METHODS = ['全部', '试卷', '题库', '评审', '现场问答'] as const
type MethodType = (typeof METHODS)[number]

function SceneTaskTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState<MethodType>('全部')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded'>('all')
  const [selectedTaskId, setSelectedTaskId] = useState<string>(SCENE_TASKS[0]?.id || '')

  const selectedTask = SCENE_TASKS.find((t) => t.id === selectedTaskId)

  const displayedStudents = useMemo(() => {
    let students = [...sceneStudents]
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentNumber.toLowerCase().includes(q)
      )
    }
    if (methodFilter !== '全部') {
      students = students.filter((s) => s.method === methodFilter)
    }
    if (statusFilter !== 'all') {
      students = students.filter((s) => s.status === statusFilter)
    }
    return students
  }, [searchQuery, methodFilter, statusFilter])

  const statusCounts = useMemo(() => {
    let all = displayedStudents.length
    if (searchQuery.trim() || methodFilter !== '全部') {
      all = displayedStudents.length
    } else {
      all = sceneStudents.length
    }
    return {
      all,
      pending: sceneStudents.filter((s) => s.status === 'pending').length,
      graded: sceneStudents.filter((s) => s.status === 'graded').length,
    }
  }, [searchQuery, methodFilter])

  const methodCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    METHODS.forEach((m) => {
      if (m === '全部') {
        counts[m] = sceneStudents.length
      } else {
        counts[m] = sceneStudents.filter((s) => s.method === m).length
      }
    })
    return counts
  }, [])

  return (
    <div className="space-y-4">
      {selectedTask && (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{selectedTask.scenarioName}</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{selectedTask.name}</span>
            <Badge variant="outline" className="text-xs font-normal">{selectedTask.taskType === 'assessment' ? '考核' : '训练'}</Badge>
            {selectedTask.assessmentForm && (
              <Badge variant="secondary" className="text-xs font-normal">{selectedTask.assessmentForm}</Badge>
            )}
          </div>

          {/* Method filter */}
          <div className="rounded-lg border bg-white p-3 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 shrink-0">测评方式</span>
              <div className="flex gap-1 flex-wrap">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMethodFilter(m); setStatusFilter('all') }}
                    className={cn(
                      'px-3 py-1 rounded-md text-xs font-medium transition-all',
                      methodFilter === m
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    {m}
                    <span className="ml-1 opacity-80">({methodCounts[m] || 0})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-dashed" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 shrink-0">评分状态</span>
              <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} {...statusCounts} />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索学生姓名、学号..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <div className="divide-y divide-gray-100">
              {displayedStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">暂无学生记录</div>
              ) : (
                displayedStudents.map((student) => (
                  <StudentListItem key={student.id} student={student} />
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

// ==================== Online Classroom Tab ====================

function OnlineClassroomTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>(CLASSROOMS[0]?.id || '')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded'>('all')

  const selectedClassroom = CLASSROOMS.find((c) => c.id === selectedClassroomId)

  const displayedStudents = useMemo(() => {
    let students = [...classroomStudents]
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentNumber.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      students = students.filter((s) => s.status === statusFilter)
    }
    return students
  }, [searchQuery, statusFilter])

  const statusCounts = useMemo(() => ({
    all: classroomStudents.length,
    pending: classroomStudents.filter((s) => s.status === 'pending').length,
    graded: classroomStudents.filter((s) => s.status === 'graded').length,
  }), [])

  return (
    <div className="space-y-4">
      {selectedClassroom && (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Video className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{selectedClassroom.name}</span>
            <Badge variant="outline" className="text-xs font-normal">{selectedClassroom.code}</Badge>
            <Badge variant="secondary" className="text-xs font-normal">{selectedClassroom.category}</Badge>
            <span className="text-xs text-gray-500">教师：{selectedClassroom.teacherName}</span>
          </div>

          <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} {...statusCounts} />

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索学生姓名、学号..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <div className="divide-y divide-gray-100">
              {displayedStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">暂无学生记录</div>
              ) : (
                displayedStudents.map((student) => (
                  <StudentListItem key={student.id} student={student} />
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

// ==================== Smart Course Tab ====================

function SmartCourseTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>(SMART_COURSES[0]?.id || '')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded'>('all')

  const selectedCourse = SMART_COURSES.find((c) => c.id === selectedCourseId)

  const displayedStudents = useMemo(() => {
    let students = [...courseStudents]
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentNumber.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      students = students.filter((s) => s.status === statusFilter)
    }
    return students
  }, [searchQuery, statusFilter])

  const statusCounts = useMemo(() => ({
    all: courseStudents.length,
    pending: courseStudents.filter((s) => s.status === 'pending').length,
    graded: courseStudents.filter((s) => s.status === 'graded').length,
  }), [])

  return (
    <div className="space-y-4">
      {selectedCourse && (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Library className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{selectedCourse.name}</span>
            <Badge variant="outline" className="text-xs font-normal">{selectedCourse.code}</Badge>
            <Badge variant="secondary" className="text-xs font-normal">{selectedCourse.category}</Badge>
            <span className="text-xs text-gray-500">教师：{selectedCourse.teacherName}</span>
          </div>

          <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} {...statusCounts} />

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索学生姓名、学号..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <div className="divide-y divide-gray-100">
              {displayedStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">暂无学生记录</div>
              ) : (
                displayedStudents.map((student) => (
                  <StudentListItem key={student.id} student={student} />
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

// ==================== Main Panel ====================

export default function StudentGradesPanel() {
  const [activeTab, setActiveTab] = useState('scene')

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9">
          <TabsTrigger value="scene" className="text-sm px-5">场景任务</TabsTrigger>
          <TabsTrigger value="online-classroom" className="text-sm px-5">智慧课堂（模拟）</TabsTrigger>
          <TabsTrigger value="smart-course" className="text-sm px-5">在线课程（模拟）</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'scene' && <SceneTaskTab />}
      {activeTab === 'online-classroom' && <OnlineClassroomTab />}
      {activeTab === 'smart-course' && <SmartCourseTab />}
    </div>
  )
}
