'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileDigit,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Edit3,
  Save,
  X,
  Sparkles,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePrograms } from '../_components/program-context'
import { majors, type TrainingProgram, type CoursePlan } from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Archive } from 'lucide-react'

// ============================================
// 步骤定义
// ============================================
const steps = [
  { id: 'upload', label: '上传文档', icon: Upload },
  { id: 'parsing', label: 'AI解析', icon: BrainCircuit },
  { id: 'preview', label: '结果预览', icon: EyeIcon },
  { id: 'done', label: '导入完成', icon: CheckCircle2 },
]

function EyeIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

// ============================================
// Mock AI解析结果
// ============================================
interface ParsedCourse {
  id: string
  name: string
  code: string
  nature: '必修' | '选修' | '实践' | '场景'
  credits: number
  hours: number
  semester: number
  assessment: string
  category: '公共基础课' | '专业基础课' | '专业核心课' | '专业拓展课' | '实践环节'
  confidence: number // AI置信度
  warnings?: string[]
}

interface ParsedProgram {
  name: string
  code: string
  majorName: string
  level: string
  duration: number
  totalCredits: number
  courses: ParsedCourse[]
  practiceScenes: ParsedCourse[]
  stats: {
    totalCourses: number
    totalScenes: number
    theoryHours: number
    practiceHours: number
    avgConfidence: number
    warningCount: number
  }
}

const mockParsedResult: ParsedProgram = {
  name: '计算机网络技术专业人才培养方案',
  code: 'TP-CN-2025',
  majorName: '计算机网络技术',
  level: '大专',
  duration: 3,
  totalCredits: 147,
  courses: [
    { id: 'c1', name: '军事理论', code: 'MT101', nature: '必修', credits: 2, hours: 36, semester: 1, assessment: '考查', category: '公共基础课', confidence: 0.98 },
    { id: 'c2', name: '思想道德与法治', code: 'POL101', nature: '必修', credits: 3, hours: 48, semester: 1, assessment: '考试', category: '公共基础课', confidence: 0.99 },
    { id: 'c3', name: '体育与健康', code: 'PE101', nature: '必修', credits: 2, hours: 64, semester: 1, assessment: '考查', category: '公共基础课', confidence: 0.97 },
    { id: 'c4', name: '实用英语', code: 'ENG101', nature: '选修', credits: 2, hours: 32, semester: 1, assessment: '考查', category: '公共基础课', confidence: 0.95 },
    { id: 'c5', name: 'Python技术应用', code: 'PY101', nature: '必修', credits: 4, hours: 64, semester: 2, assessment: '考试', category: '专业基础课', confidence: 0.96 },
    { id: 'c6', name: '计算机网络基础', code: 'NET101', nature: '必修', credits: 4, hours: 64, semester: 2, assessment: '考试', category: '专业基础课', confidence: 0.98 },
    { id: 'c7', name: 'Windows Server操作系统管理', code: 'WIN101', nature: '必修', credits: 4, hours: 64, semester: 2, assessment: '考试', category: '专业基础课', confidence: 0.94, warnings: ['学时与学分比例疑似异常，建议核对'] },
    { id: 'c8', name: '数据库原理及应用', code: 'DB101', nature: '必修', credits: 3, hours: 48, semester: 3, assessment: '考试', category: '专业基础课', confidence: 0.97 },
    { id: 'c9', name: '网络安全技术基础', code: 'SEC101', nature: '必修', credits: 3, hours: 48, semester: 3, assessment: '考试', category: '专业基础课', confidence: 0.96 },
    { id: 'c10', name: '路由交换技术与应用', code: 'RSE101', nature: '必修', credits: 4, hours: 64, semester: 3, assessment: '考试', category: '专业核心课', confidence: 0.99 },
    { id: 'c11', name: 'Linux系统管理基础', code: 'LIN101', nature: '必修', credits: 4, hours: 64, semester: 3, assessment: '考试', category: '专业核心课', confidence: 0.98 },
    { id: 'c12', name: '网络自动化运维', code: 'NAO101', nature: '必修', credits: 3, hours: 48, semester: 4, assessment: '考查', category: '专业核心课', confidence: 0.92, warnings: ['课程名称与代码匹配度较低'] },
    { id: 'c13', name: '云计算网络技术与应用', code: 'CLD101', nature: '选修', credits: 3, hours: 48, semester: 4, assessment: '考查', category: '专业拓展课', confidence: 0.95 },
    { id: 'c14', name: '网页设计', code: 'WEB101', nature: '选修', credits: 2, hours: 32, semester: 4, assessment: '作品', category: '专业拓展课', confidence: 0.96 },
  ],
  practiceScenes: [
    { id: 'p1', name: '网络工程综合实训', code: 'PRAC-NET', nature: '实践', credits: 4, hours: 64, semester: 4, assessment: '场景测评', category: '实践环节', confidence: 0.97 },
    { id: 'p2', name: '岗位实习', code: 'PRAC-INT', nature: '实践', credits: 8, hours: 384, semester: 6, assessment: '场景测评', category: '实践环节', confidence: 0.99 },
    { id: 'p3', name: '毕业设计', code: 'PRAC-GRAD', nature: '实践', credits: 4, hours: 128, semester: 6, assessment: '论文', category: '实践环节', confidence: 0.98 },
  ],
  stats: {
    totalCourses: 14,
    totalScenes: 3,
    theoryHours: 720,
    practiceHours: 576,
    avgConfidence: 0.96,
    warningCount: 2,
  },
}

// ============================================
// 解析日志
// ============================================
const parseLogs = [
  { time: '00:00:01', level: 'info', message: '开始读取文档...' },
  { time: '00:00:02', level: 'info', message: '识别文档格式：Microsoft Word (.docx)' },
  { time: '00:00:03', level: 'info', message: '提取文档结构：共 197 行，12 个章节' },
  { time: '00:00:04', level: 'info', message: '定位到「课程设置及学时安排」章节' },
  { time: '00:00:05', level: 'info', message: '识别专业信息：计算机网络技术 (510202)，三年制大专' },
  { time: '00:00:06', level: 'info', message: '解析课程结构...' },
  { time: '00:00:07', level: 'success', message: '提取公共基础课程 5 门' },
  { time: '00:00:08', level: 'success', message: '提取专业基础课程 5 门' },
  { time: '00:00:09', level: 'success', message: '提取专业核心课程 4 门' },
  { time: '00:00:10', level: 'success', message: '提取专业拓展课程 2 门' },
  { time: '00:00:11', level: 'success', message: '提取实践环节 3 项' },
  { time: '00:00:12', level: 'warn', message: '警告：「Windows Server操作系统管理」学时与学分比例疑似异常 (64学时/4学分=16:1，标准为16-18:1)' },
  { time: '00:00:13', level: 'warn', message: '警告：「网络自动化运维」课程代码 NAO101 与名称匹配度较低，建议核对' },
  { time: '00:00:14', level: 'info', message: '自动补全缺失字段：考核方式、课程性质、学期分配' },
  { time: '00:00:15', level: 'info', message: 'AI解析完成，平均置信度 96%' },
]

export default function ProgramImportPage() {
  const router = useRouter()
  const { addProgram } = usePrograms()
  const [currentStep, setCurrentStep] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [parsingProgress, setParsingProgress] = useState(0)
  const [parsedResult, setParsedResult] = useState<ParsedProgram | null>(null)
  const [logs, setLogs] = useState<typeof parseLogs>([])
  const [createdProgramId, setCreatedProgramId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const zipFileInputRef = useRef<HTMLInputElement>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importOptions, setImportOptions] = useState<Record<string, boolean>>({
    basicInfo: true,
    careerOrientation: true,
    trainingGoals: true,
    curriculum: true,
    facultyTeam: false,
    teachingConditions: false,
  })

  const toggleImportOption = (key: string) => {
    setImportOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // 步骤颜色
  const stepStatus = (index: number) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'current'
    return 'pending'
  }

  // 上传文件
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      toast.success(`已选择文件：${f.name}`)
    }
  }

  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setZipFile(f)
      toast.success(`已选择压缩包：${f.name}`)
    }
  }

  const confirmZipImport = () => {
    setImportDialogOpen(false)
    toast.success('标准人培方案导入成功！')
    setCurrentStep(3)
  }

  // 开始解析（Mock）
  const startParsing = () => {
    if (!file) {
      toast.error('请先上传文件')
      return
    }
    setCurrentStep(1)
    setParsingProgress(0)
    setLogs([])

    // Mock解析进度
    let progress = 0
    let logIndex = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 8
      if (progress > 100) progress = 100
      setParsingProgress(Math.min(progress, 100))

      // 逐步显示日志
      if (logIndex < parseLogs.length && Math.random() > 0.3) {
        const batch = parseLogs.slice(logIndex, logIndex + Math.floor(Math.random() * 2) + 1)
        setLogs((prev) => [...prev, ...batch])
        logIndex += batch.length
      }

      if (progress >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          setParsedResult(mockParsedResult)
          setCurrentStep(2)
          toast.success('AI解析完成！')
        }, 500)
      }
    }, 300)
  }

  // 确认并导入
  const handleImport = () => {
    if (!parsedResult) return

    // 根据专业名称匹配 majorId
    const matchedMajor = majors.find((m) =>
      parsedResult.majorName.includes(m.name) || m.name.includes(parsedResult.majorName)
    )

    const mappedCourses: CoursePlan[] = parsedResult.courses.map((c) => ({
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: c.name,
      code: c.code,
      credits: c.credits,
      hours: c.hours,
      semester: c.semester,
      nature: c.nature,
      assessment: c.assessment as CoursePlan['assessment'],
      version: 'v1.0',
      category: c.category,
    }))

    const mappedScenes: CoursePlan[] = parsedResult.practiceScenes.map((s) => ({
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: s.name,
      code: s.code,
      credits: s.credits,
      hours: s.hours,
      semester: s.semester,
      nature: s.nature as CoursePlan['nature'],
      assessment: s.assessment as CoursePlan['assessment'],
      version: 'v1.0',
      category: s.category,
    }))

    const requiredCredits = parsedResult.courses
      .filter((c) => c.nature === '必修')
      .reduce((sum, c) => sum + c.credits, 0)
    const electiveCredits = parsedResult.courses
      .filter((c) => c.nature === '选修')
      .reduce((sum, c) => sum + c.credits, 0)
    const practiceCredits = parsedResult.practiceScenes.reduce((sum, s) => sum + s.credits, 0)

    const programId = `tp${Date.now()}`
    const newProgram: TrainingProgram = {
      id: programId,
      name: parsedResult.name,
      code: parsedResult.code,
      majorId: matchedMajor?.id || '',
      entryYear: new Date().getFullYear(),
      level: (parsedResult.level.includes('本') ? '本科' : parsedResult.level.includes('专') ? '大专' : '中专') as TrainingProgram['level'],
      duration: parsedResult.duration,
      totalCredits: parsedResult.totalCredits,
      requiredCredits,
      electiveCredits,
      practiceCredits,
      courses: mappedCourses,
      practiceScenes: mappedScenes,
      status: 'draft',
      creator: '当前用户',
      collaborators: [],
      createdAt: new Date().toISOString().split('T')[0],
      importSource: file?.name.endsWith('.pdf') ? 'ai-word' : 'ai-excel',
      aiExtractStatus: 'completed',
      startDate: `${new Date().getFullYear()}-09-01`,
      endDate: `${new Date().getFullYear() + parsedResult.duration}-07-01`,
    }

    addProgram(newProgram)
    setCreatedProgramId(programId)
    toast.success('人培方案导入成功！')
    setCurrentStep(3)
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            AI导入人培方案
          </h1>
          <p className="text-muted-foreground mt-1">
            上传人才培养方案文档（Excel/Word），AI自动解析并生成结构化数据
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>

      {/* 步骤导航 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = stepStatus(index)
              const Icon = step.icon
              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                        status === 'completed' && 'border-emerald-500 bg-emerald-50 text-emerald-600',
                        status === 'current' && 'border-primary bg-primary text-primary-foreground',
                        status === 'pending' && 'border-muted-foreground/30 text-muted-foreground'
                      )}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-2 text-xs font-medium',
                        status === 'current' ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'mx-2 h-0.5 flex-1',
                        status === 'completed' ? 'bg-emerald-500' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 步骤内容 */}
      <Card className="min-h-[500px]">
        <CardContent className="pt-6">
          {/* ===== Step 0: 上传 ===== */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
              {/* 左侧：导入自定义人培方案 */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    导入自定义人培方案（PDF/Word）
                  </CardTitle>
                  <CardDescription>
                    上传自定义格式的人才培养方案文档，AI自动解析
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <div
                    className={cn(
                      'flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer',
                      file
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {file ? (
                      <>
                        <FileText className="h-10 w-10 text-emerald-500 mb-2" />
                        <p className="text-base font-medium text-emerald-700">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-base font-medium">点击或拖拽上传文档</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          支持 Word、PDF 和 Excel 格式
                        </p>
                      </>
                    )}
                  </div>

                  {file && (
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" size="sm" onClick={() => { setFile(null); setLogs([]) }}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        重新选择
                      </Button>
                      <Button size="sm" onClick={startParsing}>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        开始AI解析
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">文档格式建议：</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                        <p className="text-xs font-medium">Excel</p>
                        <p className="text-[10px] text-muted-foreground">结构化数据</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-medium">Word</p>
                        <p className="text-[10px] text-muted-foreground">完整方案文档</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center">
                        <FileDigit className="h-4 w-4 text-red-600" />
                        <p className="text-xs font-medium">PDF</p>
                        <p className="text-[10px] text-muted-foreground">扫描/电子版</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 右侧：导入标准人培方案 */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Archive className="h-5 w-5 text-purple-600" />
                    导入标准人培方案（本系统导出）
                  </CardTitle>
                  <CardDescription>
                    上传从本系统导出的标准压缩包，快速恢复完整数据
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <div
                    className={cn(
                      'flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer',
                      zipFile
                        ? 'border-purple-400 bg-purple-50/50'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    )}
                    onClick={() => zipFileInputRef.current?.click()}
                  >
                    <input
                      ref={zipFileInputRef}
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleZipFileChange}
                    />
                    {zipFile ? (
                      <>
                        <Archive className="h-10 w-10 text-purple-500 mb-2" />
                        <p className="text-base font-medium text-purple-700">{zipFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(zipFile.size / 1024).toFixed(1)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-base font-medium">点击或拖拽上传压缩包</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          仅支持 .zip 格式
                        </p>
                      </>
                    )}
                  </div>

                  {zipFile && (
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" size="sm" onClick={() => setZipFile(null)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        重新选择
                      </Button>
                      <Button size="sm" onClick={() => setImportDialogOpen(true)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        确认导入
                      </Button>
                    </div>
                  )}

                  <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">导入内容说明：</p>
                    <p className="text-xs text-muted-foreground">
                      系统将自动识别人培方案主体数据，您可在下一步选择是否一并导入关联的课程与能力目标、教学计划及排课数据。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== Step 1: AI解析中 ===== */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <BrainCircuit className="h-10 w-10 text-primary animate-pulse" />
                </div>
              </div>
              <div className="w-full max-w-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">AI正在解析文档...</span>
                  <span className="text-muted-foreground">{parsingProgress.toFixed(0)}%</span>
                </div>
                <Progress value={parsingProgress} className="h-2" />
              </div>
              <div className="w-full max-w-lg rounded-lg border bg-muted/30">
                <ScrollArea className="h-64 p-4">
                  <div className="space-y-2">
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-xs text-muted-foreground font-mono shrink-0 w-16">
                          {log.time}
                        </span>
                        <span
                          className={cn(
                            'shrink-0',
                            log.level === 'success' && 'text-emerald-600',
                            log.level === 'warn' && 'text-amber-600',
                            log.level === 'error' && 'text-red-600',
                            log.level === 'info' && 'text-blue-600'
                          )}
                        >
                          {log.level === 'success' && '✓'}
                          {log.level === 'warn' && '⚠'}
                          {log.level === 'error' && '✗'}
                          {log.level === 'info' && '•'}
                        </span>
                        <span className={cn(
                          log.level === 'warn' && 'text-amber-700',
                          log.level === 'error' && 'text-red-700'
                        )}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    {parsingProgress < 100 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-xs font-mono shrink-0 w-16">--:--:--</span>
                        <span className="animate-pulse">处理中...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* ===== Step 2: 预览 ===== */}
          {currentStep === 2 && parsedResult && (
            <div className="space-y-6">
              {/* 概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50/50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">课程数量</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{parsedResult.stats.totalCourses}</p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50/50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-muted-foreground">实践场景</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{parsedResult.stats.totalScenes}</p>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50/50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-muted-foreground">总学时</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{parsedResult.stats.theoryHours + parsedResult.stats.practiceHours}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50/50">
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-muted-foreground">总学分</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{parsedResult.totalCredits}</p>
                  </CardContent>
                </Card>
              </div>

              {/* 警告提示 */}
              {parsedResult.stats.warningCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">
                    发现 {parsedResult.stats.warningCount} 个异常，建议在编辑确认步骤中核对
                  </span>
                </div>
              )}

              {/* 置信度 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">AI解析置信度：</span>
                <Progress value={parsedResult.stats.avgConfidence * 100} className="w-32 h-2" />
                <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                  {(parsedResult.stats.avgConfidence * 100).toFixed(0)}%
                </Badge>
              </div>

              {/* 课程表格 */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">课程列表（{parsedResult.courses.length}门）</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>课程名称</TableHead>
                        <TableHead>代码</TableHead>
                        <TableHead>性质</TableHead>
                        <TableHead>学分</TableHead>
                        <TableHead>学时</TableHead>
                        <TableHead>学期</TableHead>
                        <TableHead>考核</TableHead>
                        <TableHead>置信度</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedResult.courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {course.name}
                              {course.warnings && course.warnings.length > 0 && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            {course.warnings && course.warnings.length > 0 && (
                              <p className="text-xs text-amber-600 mt-0.5">{course.warnings[0]}</p>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{course.code}</TableCell>
                          <TableCell>
                            <Badge variant={course.nature === '必修' ? 'default' : 'secondary'} className="text-xs">
                              {course.nature}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.hours}</TableCell>
                          <TableCell>第{course.semester}学期</TableCell>
                          <TableCell>{course.assessment}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                course.confidence >= 0.95 ? 'text-emerald-600 border-emerald-300' :
                                course.confidence >= 0.85 ? 'text-amber-600 border-amber-300' :
                                'text-red-600 border-red-300'
                              )}
                            >
                              {(course.confidence * 100).toFixed(0)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* 实践场景表格 */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">实践场景（{parsedResult.practiceScenes.length}项）</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>场景名称</TableHead>
                        <TableHead>代码</TableHead>
                        <TableHead>学分</TableHead>
                        <TableHead>学时</TableHead>
                        <TableHead>学期</TableHead>
                        <TableHead>考核</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedResult.practiceScenes.map((scene) => (
                        <TableRow key={scene.id}>
                          <TableCell className="font-medium">{scene.name}</TableCell>
                          <TableCell className="font-mono text-xs">{scene.code}</TableCell>
                          <TableCell>{scene.credits}</TableCell>
                          <TableCell>{scene.hours}</TableCell>
                          <TableCell>第{scene.semester}学期</TableCell>
                          <TableCell>{scene.assessment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  重新上传
                </Button>
                <Button onClick={handleImport}>
                  <Save className="mr-2 h-4 w-4" />
                  确认导入
                </Button>
              </div>
            </div>
          )}

          {/* ===== Step 3: 导入完成 ===== */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">人培方案导入成功！</h3>
                <p className="text-muted-foreground mt-1">
                  已生成「{parsedResult?.name}」，包含 {parsedResult?.courses.length} 门课程和 {parsedResult?.practiceScenes.length} 个实践场景
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push('/admin/programs')}>
                  返回人培方案列表
                </Button>
                <Button onClick={() => router.push(`/admin/programs/${createdProgramId}/edit`)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  前往编辑
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 标准人培方案导入选项弹窗 */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>选择要导入的内容模块</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">请选择需要导入的人培方案内容模块（至少选1项）：</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={importOptions.basicInfo} onCheckedChange={() => toggleImportOption('basicInfo')} />
                <div>
                  <div className="text-sm font-medium">基本信息</div>
                  <div className="text-xs text-muted-foreground">专业名称、学制、学分要求等基础信息</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={importOptions.careerOrientation} onCheckedChange={() => toggleImportOption('careerOrientation')} />
                <div>
                  <div className="text-sm font-medium">职业面向</div>
                  <div className="text-xs text-muted-foreground">职业岗位、工作任务与能力要求</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={importOptions.trainingGoals} onCheckedChange={() => toggleImportOption('trainingGoals')} />
                <div>
                  <div className="text-sm font-medium">培养目标与规格</div>
                  <div className="text-xs text-muted-foreground">培养目标、毕业要求、能力指标</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={importOptions.curriculum} onCheckedChange={() => toggleImportOption('curriculum')} />
                <div>
                  <div className="text-sm font-medium">课程（场景）设置</div>
                  <div className="text-xs text-muted-foreground">课程计划、实践场景、学时学分安排</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={importOptions.facultyTeam} onCheckedChange={() => toggleImportOption('facultyTeam')} />
                <div>
                  <div className="text-sm font-medium">师资队伍</div>
                  <div className="text-xs text-muted-foreground">专业教学团队、双师型教师配置</div>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <Checkbox checked={importOptions.teachingConditions} onCheckedChange={() => toggleImportOption('teachingConditions')} />
                <div>
                  <div className="text-sm font-medium">教学条件</div>
                  <div className="text-xs text-muted-foreground">实训基地、教学资源、信息化条件</div>
                </div>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>取消</Button>
            <Button
              onClick={confirmZipImport}
              disabled={!Object.values(importOptions).some(Boolean)}
            >
              确认导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
