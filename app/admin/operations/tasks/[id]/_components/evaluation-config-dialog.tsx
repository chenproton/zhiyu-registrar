'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  RotateCcw,
  Pencil,
  X,
  CheckCircle2,
  FileQuestion,
  Search,
} from 'lucide-react'
import type {
  TaskEvaluationConfig,
  TaskEvalPoint,
  TaskReviewStep,
} from '@/lib/mock-data'

const methodLabels: Record<string, string> = {
  random_draw: '现场问答',
  review: '现场评审',
  paper: '试卷',
  question_bank: '题库',
  quiz: '随堂测',
  homework: '作业',
  outcome: '成果评价',
}

const subjectLabels: Record<string, string> = {
  teacher: '教师',
  enterprise_mentor: '企业导师',
  peer: '互评',
  self: '自评',
  ai: 'AI 评价',
  service_target: '服务对象',
}

interface Props {
  config: TaskEvaluationConfig
  onChange: (config: TaskEvaluationConfig) => void
}

export default function EvaluationConfigContent({
  config,
  onChange,
}: Props) {
  const setConfig = (updater: (prev: TaskEvaluationConfig) => TaskEvaluationConfig) => {
    onChange(updater(config))
  }

  const handleSave = () => {
    toast.success('测评配置已保存')
  }

  const availableMethods = [
    { key: 'random_draw', label: '现场问答' },
    { key: 'review', label: '现场评审' },
    { key: 'paper', label: '试卷' },
    { key: 'question_bank', label: '题库' },
    { key: 'quiz', label: '随堂测' },
    { key: 'homework', label: '作业' },
    { key: 'outcome', label: '成果评价' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">测评方式配置</h3>
        <Button onClick={handleSave}>保存配置</Button>
      </div>

      {config.enabledMethods.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-sm">暂未开通任何测评方式</p>
        </div>
      ) : (
        <Tabs defaultValue={config.enabledMethods[0]} className="w-full">
          <TabsList className="flex w-full h-auto gap-1 overflow-x-auto">
            {availableMethods
              .filter((m) => config.enabledMethods.includes(m.key))
              .map((m) => (
                <TabsTrigger key={m.key} value={m.key} className="text-[11px] flex-1 whitespace-nowrap px-1.5 py-1 h-8 min-w-0">
                  {m.label}
                </TabsTrigger>
              ))}
          </TabsList>

          {/* 现场问答 */}
          <TabsContent value="random_draw" className="space-y-4 mt-4">
            <RandomDrawPanel
              questions={config.randomDrawQuestions || []}
              onChangeQuestions={(questions) =>
                onChange({ ...config, randomDrawQuestions: questions })
              }
            />
          </TabsContent>

          {/* 现场评审 */}
          <TabsContent value="review" className="space-y-4 mt-4">
            <ReviewPanel
              steps={config.reviewSteps || []}
              onChangeSteps={(steps) => onChange({ ...config, reviewSteps: steps })}
            />
          </TabsContent>

          {/* 试卷 */}
          <TabsContent value="paper" className="space-y-4 mt-4">
            <PaperPanel
              config={config.paperConfig || { duration: 60, allowRetake: false, shuffleQuestions: false, showScoreAfterSubmit: true, activationType: 'always' }}
              onChangeConfig={(c) => onChange({ ...config, paperConfig: c })}
            />
          </TabsContent>

          {/* 题库 */}
          <TabsContent value="question_bank" className="space-y-4 mt-4">
            <QuestionBankPanel
              config={config.questionBankConfig || { questionIds: [], randomCount: 10, shuffleQuestions: true, showScoreAfterSubmit: true, allowRepeat: false }}
              onChangeConfig={(c) => onChange({ ...config, questionBankConfig: c })}
            />
          </TabsContent>

          {/* 随堂测 */}
          <TabsContent value="quiz" className="space-y-4 mt-4">
            <QuizPanel
              config={config.quizConfig || { questionIds: [], randomCount: 5, shuffleQuestions: true, showScoreAfterSubmit: true, allowRepeat: false }}
              onChangeConfig={(c) => onChange({ ...config, quizConfig: c })}
            />
          </TabsContent>

          {/* 作业 */}
          <TabsContent value="homework" className="space-y-4 mt-4">
            <HomeworkPanel
              config={config.homeworkMaterial || { requiresMaterial: true, estimatedDays: 3, formatRequirements: '', allowResubmit: true }}
              onChangeConfig={(c) => onChange({ ...config, homeworkMaterial: c })}
            />
          </TabsContent>

          {/* 成果评价 */}
          <TabsContent value="outcome" className="space-y-4 mt-4">
            <OutcomePanel
              config={config.outcomeMaterial || { requiresMaterial: true, estimatedDays: 7, formatRequirements: '', allowResubmit: false }}
              onChangeConfig={(c) => onChange({ ...config, outcomeMaterial: c })}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// ============ 现场问答面板 ============
function RandomDrawPanel({
  questions: initialQuestions,
  onChangeQuestions,
}: {
  questions: { id: string; name: string; description: string; answer: string; major: string }[]
  onChangeQuestions: (questions: { id: string; name: string; description: string; answer: string; major: string }[]) => void
}) {
  const [questions, setQuestions] = useState(initialQuestions.length > 0 ? initialQuestions : [
    { id: 'rdq-1', name: '简述面向对象的三大特性', description: '请简述封装、继承、多态的概念', answer: '封装：将数据和操作数据的方法绑定在一起...', major: '通用' },
    { id: 'rdq-2', name: 'Java 异常处理机制', description: '请说明 try-catch-finally 的使用场景', answer: 'try 块包含可能抛出异常的代码...', major: '后端开发' },
  ])
  const [selectedIds, setSelectedIds] = useState<string[]>(['rdq-1'])
  const [search, setSearch] = useState('')
  const [actionOpen, setActionOpen] = useState(false)
  const [actionMode, setActionMode] = useState<'add' | 'edit'>('add')
  const [actionTarget, setActionTarget] = useState<{ id: string; name: string; description: string; answer: string; major: string } | null>(null)
  const [form, setForm] = useState({ name: '', description: '', answer: '', major: '' })

  const majorOptions = ['前端开发', '后端开发', '运维部署', '通用']
  const filtered = questions.filter((q) => !search || q.name.includes(search) || q.description.includes(search) || q.major.includes(search))
  const selectedList = selectedIds.map((id) => questions.find((q) => q.id === id)).filter(Boolean) as typeof questions

  const onChangeRef = useRef(onChangeQuestions)
  onChangeRef.current = onChangeQuestions

  useEffect(() => {
    onChangeRef.current(questions)
  }, [questions])

  const handleAdd = () => {
    setForm({ name: '', description: '', answer: '', major: '' })
    setActionMode('add')
    setActionTarget(null)
    setActionOpen(true)
  }

  const handleEdit = (q: typeof questions[0]) => {
    setForm({ name: q.name, description: q.description, answer: q.answer, major: q.major })
    setActionMode('edit')
    setActionTarget(q)
    setActionOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (actionMode === 'edit' && actionTarget) {
      setQuestions(questions.map((q) => (q.id === actionTarget.id ? { ...q, ...form } : q)))
    } else {
      const newId = `rdq-${Date.now()}`
      setQuestions([...questions, { id: newId, ...form }])
    }
    setActionOpen(false)
    setSearch('')
  }

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
    setSelectedIds(selectedIds.filter((sid) => sid !== id))
  }

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg border border-blue-100 p-3 text-sm text-blue-700">
        <p className="font-medium">现场问答说明</p>
        <p className="text-xs mt-1">教师从题库中抽取题目，在课堂上对学生进行现场提问和评分。</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索现场问答题名称、描述或适用专业..." className="pl-9" />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />新增现场问答题
        </Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-[300px]">
        <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
          <p className="text-sm font-medium mb-3 text-gray-700">{search ? `搜索结果 (${filtered.length})` : "全部现场问答题"}</p>
          <div className="flex-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{search ? "未找到匹配的现场问答题" : "暂无现场问答题，请点击上方按钮新增"}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[26%]">题目名称</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[30%]">题目描述</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-2 w-[14%]">适用专业</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-3 py-2 w-[30%]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((q) => {
                    const isSelected = selectedIds.includes(q.id)
                    return (
                      <tr key={q.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-primary/[0.03]' : ''}`}>
                        <td className="px-3 py-2 text-sm font-medium text-gray-800">{q.name}</td>
                        <td className="px-3 py-2">
                          <p className="text-xs text-gray-500 line-clamp-1" title={q.description}>{q.description || "-"}</p>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="secondary" className="text-[10px]">{q.major || "-"}</Badge>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-gray-500 hover:text-primary" onClick={() => handleEdit(q)}>
                              编辑
                            </Button>
                            {isSelected ? (
                              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => handleToggle(q.id)}>取消</Button>
                            ) : (
                              <Button size="sm" className="h-6 text-[11px] px-2" onClick={() => handleToggle(q.id)}>选择</Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5 text-red-400 hover:text-red-600" onClick={() => handleDelete(q.id)}>
                              删除
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="w-2/5 border rounded-xl p-3 flex flex-col min-h-0">
          <p className="text-sm font-medium mb-3 text-gray-700">已配置现场问答题 ({selectedList.length})</p>
          <div className="flex-1 overflow-y-auto">
            {selectedList.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">请从左侧选择现场问答题</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedList.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium flex-1 truncate">{q.name}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 -mr-1 -mt-1" onClick={() => handleToggle(q.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{q.description || "暂无描述"}</p>
                    <Badge variant="outline" className="text-[9px] mt-1 font-normal px-1 py-0 h-4">{q.major || "通用"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={actionOpen} onOpenChange={setActionOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{actionMode === "add" ? "新增现场问答题" : "编辑现场问答题"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>题目名称</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="输入题目名称" className="mt-1.5" />
            </div>
            <div>
              <Label>适用专业</Label>
              <select value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className="mt-1.5 w-full h-10 border rounded-md px-3 text-sm">
                <option value="">选择适用专业</option>
                {majorOptions.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <Label>题目描述</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="输入题目描述" className="mt-1.5" rows={3} />
            </div>
            <div>
              <Label>题目答案</Label>
              <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="输入题目答案" className="mt-1.5" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)}>取消</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {actionMode === "add" ? "新增" : "保存修改"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============ 现场评审面板 ============
function ReviewPanel({
  steps,
  onChangeSteps,
}: {
  steps: TaskReviewStep[]
  onChangeSteps: (steps: TaskReviewStep[]) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newSubject, setNewSubject] = useState('')

  const enabledSteps = steps.filter((s) => s.enabled)
  const totalWeight = enabledSteps.reduce((sum, s) => sum + (s.weight || 0), 0)

  const handleAdd = () => {
    if (!newLabel.trim() || !newSubject) return
    onChangeSteps([
      ...steps,
      {
        id: `rs-${Date.now()}`,
        label: newLabel,
        desc: newDesc,
        enabled: true,
        subjectType: newSubject,
        weight: 0,
      },
    ])
    setShowAdd(false)
    setNewLabel('')
    setNewDesc('')
    setNewSubject('')
  }

  const handleSaveEdit = () => {
    onChangeSteps(
      steps.map((s) =>
        s.id === editingId ? { ...s, label: editLabel || s.label, desc: editDesc } : s
      )
    )
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    onChangeSteps(steps.filter((s) => s.id !== id))
  }

  const averageWeight = () => {
    if (enabledSteps.length === 0) return
    const base = Math.floor(100 / enabledSteps.length)
    const remainder = 100 % enabledSteps.length
    onChangeSteps(
      steps.map((s) => {
        if (!s.enabled) return s
        const idx = enabledSteps.findIndex((e) => e.id === s.id)
        return { ...s, weight: base + (idx < remainder ? 1 : 0) }
      })
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 rounded-lg border border-purple-100 p-3 text-sm text-purple-700">
        <p className="font-medium">现场评审说明</p>
        <p className="text-xs mt-1">评审时教师根据学生现场表现或提交的材料进行打分。</p>
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">评审流程设置</p>
            {enabledSteps.length > 0 && (
              <Badge
                variant={totalWeight === 100 ? 'default' : 'destructive'}
                className="text-xs"
              >
                权重合计 {totalWeight}%
                {totalWeight !== 100 && ' (需等于100%)'}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={averageWeight}>
              <RotateCcw className="h-3 w-3 mr-1" />
              一键平均权重
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => {
                setShowAdd(true)
                setNewLabel('')
                setNewDesc('')
                setNewSubject('')
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              新增步骤
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {steps.map((step) =>
            editingId === step.id ? (
              <div key={step.id} className="border rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    placeholder="步骤名称"
                    className="h-8 text-sm"
                  />
                  <select
                    value={step.subjectType || ''}
                    onChange={(e) =>
                      onChangeSteps(
                        steps.map((s) =>
                          s.id === step.id ? { ...s, subjectType: e.target.value || null } : s
                        )
                      )
                    }
                    className="h-8 text-sm border rounded-md px-2"
                  >
                    <option value="">选择评价主体</option>
                    {Object.entries(subjectLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="步骤描述"
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs" onClick={handleSaveEdit}>
                    保存
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingId(null)}>
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div key={step.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={step.enabled}
                      onCheckedChange={(v) => {
                        onChangeSteps(
                          steps.map((s) =>
                            s.id === step.id
                              ? { ...s, enabled: v, subjectType: v && !s.subjectType ? 'teacher' : s.subjectType }
                              : s
                          )
                        )
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.desc || '暂无描述'}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {step.subjectType ? subjectLabels[step.subjectType] || step.subjectType : '未绑定'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {step.enabled && (
                      <div className="flex items-center gap-1 mr-2">
                        <Input
                          type="number"
                          value={step.weight || 0}
                          onChange={(e) =>
                            onChangeSteps(
                              steps.map((s) =>
                                s.id === step.id
                                  ? { ...s, weight: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) }
                                  : s
                              )
                            )
                          }
                          className="h-7 text-xs w-14 text-center"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingId(step.id)
                        setEditLabel(step.label)
                        setEditDesc(step.desc)
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    {steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => handleDelete(step.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {showAdd && (
          <div className="border border-dashed border-primary/30 bg-primary/[0.02] rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="步骤名称" className="h-8 text-sm" />
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="h-8 text-sm border rounded-md px-2"
              >
                <option value="">选择评价主体</option>
                {Object.entries(subjectLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="步骤描述" className="h-8 text-sm" />
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs" onClick={handleAdd} disabled={!newLabel.trim() || !newSubject}>
                添加
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowAdd(false)}>
                取消
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 试卷面板 ============
function PaperPanel({
  config,
  onChangeConfig,
}: {
  config: { duration?: number; allowRetake?: boolean; maxRetakeCount?: number; shuffleQuestions?: boolean; showScoreAfterSubmit?: boolean; activationType?: 'manual' | 'scheduled' | 'always'; activationTime?: string; paperId?: string }
  onChangeConfig: (c: typeof config) => void
}) {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">考卷设置</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">考试时长（分钟）</Label>
            <Input
              type="number"
              value={config.duration || 60}
              onChange={(e) => onChangeConfig({ ...config, duration: Math.max(5, parseInt(e.target.value) || 5) })}
              className="mt-1 text-sm"
              min={5}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">允许重考</Label>
            <div className="mt-2 flex items-center gap-2">
              <Switch
                checked={config.allowRetake || false}
                onCheckedChange={(v) => onChangeConfig({ ...config, allowRetake: v })}
              />
              <span className="text-xs text-muted-foreground">{config.allowRetake ? '是' : '否'}</span>
            </div>
          </div>
          {config.allowRetake && (
            <div>
              <Label className="text-xs text-muted-foreground">最多重考次数</Label>
              <Input
                type="number"
                value={config.maxRetakeCount || 1}
                onChange={(e) => onChangeConfig({ ...config, maxRetakeCount: Math.max(1, parseInt(e.target.value) || 1) })}
                className="mt-1 text-sm"
                min={1}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={config.shuffleQuestions || false}
              onCheckedChange={(v) => onChangeConfig({ ...config, shuffleQuestions: v })}
            />
            <span className="text-xs text-muted-foreground">题目乱序</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.showScoreAfterSubmit !== false}
              onCheckedChange={(v) => onChangeConfig({ ...config, showScoreAfterSubmit: v })}
            />
            <span className="text-xs text-muted-foreground">交卷后显示成绩</span>
          </div>
        </div>
        <div className="mt-2 pt-3 border-t">
          <Label className="text-xs text-muted-foreground mb-2">试卷启用条件</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { key: 'manual', label: '后台手动启用' },
              { key: 'scheduled', label: '定时启用' },
              { key: 'always', label: '随时作答' },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => onChangeConfig({ ...config, activationType: mode.key as typeof config.activationType })}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  config.activationType === mode.key
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          {config.activationType === 'scheduled' && (
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">启用时间</Label>
              <Input
                type="datetime-local"
                value={config.activationTime || ''}
                onChange={(e) => onChangeConfig({ ...config, activationTime: e.target.value })}
                className="mt-1 text-sm"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

// ============ 题库面板 ============
function QuestionBankPanel({
  config,
  onChangeConfig,
}: {
  config: { questionIds: string[]; randomCount?: number; difficultyDistribution?: string; timeLimit?: number; allowRepeat?: boolean; shuffleQuestions?: boolean; showScoreAfterSubmit?: boolean }
  onChangeConfig: (c: typeof config) => void
}) {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50 rounded-lg border border-orange-100 p-3 text-sm text-orange-700">
        <p className="font-medium">题库说明</p>
        <p className="text-xs mt-1">从题库中按照规则随机抽取题目组成测评。</p>
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">抽题规则</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">随机抽题数量</Label>
            <Input
              type="number"
              value={config.randomCount || 10}
              onChange={(e) => onChangeConfig({ ...config, randomCount: Math.max(1, parseInt(e.target.value) || 1) })}
              className="mt-1 text-sm"
              min={1}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">时间限制（分钟）</Label>
            <Input
              type="number"
              value={config.timeLimit || 30}
              onChange={(e) => onChangeConfig({ ...config, timeLimit: Math.max(1, parseInt(e.target.value) || 1) })}
              className="mt-1 text-sm"
              min={1}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">难度分布</Label>
          <Input
            value={config.difficultyDistribution || ''}
            onChange={(e) => onChangeConfig({ ...config, difficultyDistribution: e.target.value })}
            placeholder="例如：简单40% / 中等40% / 困难20%"
            className="mt-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={config.allowRepeat || false}
              onCheckedChange={(v) => onChangeConfig({ ...config, allowRepeat: v })}
            />
            <span className="text-xs text-muted-foreground">允许重复测评</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.shuffleQuestions !== false}
              onCheckedChange={(v) => onChangeConfig({ ...config, shuffleQuestions: v })}
            />
            <span className="text-xs text-muted-foreground">题目乱序</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.showScoreAfterSubmit !== false}
              onCheckedChange={(v) => onChangeConfig({ ...config, showScoreAfterSubmit: v })}
            />
            <span className="text-xs text-muted-foreground">提交后展示成绩</span>
          </div>
        </div>
      </div>

    </div>
  )
}

// ============ 随堂测面板 ============
function QuizPanel({
  config,
  onChangeConfig,
}: {
  config: { questionIds: string[]; randomCount?: number; difficultyDistribution?: string; timeLimit?: number; allowRepeat?: boolean; shuffleQuestions?: boolean; showScoreAfterSubmit?: boolean }
  onChangeConfig: (c: typeof config) => void
}) {
  return (
    <div className="space-y-4">
      <div className="bg-red-50 rounded-lg border border-red-100 p-3 text-sm text-red-700">
        <p className="font-medium">随堂测说明</p>
        <p className="text-xs mt-1">课堂即时测验，快速检验学生掌握情况。</p>
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">测验设置</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">抽题数量</Label>
            <Input
              type="number"
              value={config.randomCount || 5}
              onChange={(e) => onChangeConfig({ ...config, randomCount: Math.max(1, parseInt(e.target.value) || 1) })}
              className="mt-1 text-sm"
              min={1}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">时间限制（分钟）</Label>
            <Input
              type="number"
              value={config.timeLimit || 15}
              onChange={(e) => onChangeConfig({ ...config, timeLimit: Math.max(1, parseInt(e.target.value) || 1) })}
              className="mt-1 text-sm"
              min={1}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={config.allowRepeat || false}
              onCheckedChange={(v) => onChangeConfig({ ...config, allowRepeat: v })}
            />
            <span className="text-xs text-muted-foreground">允许重复</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.shuffleQuestions !== false}
              onCheckedChange={(v) => onChangeConfig({ ...config, shuffleQuestions: v })}
            />
            <span className="text-xs text-muted-foreground">题目乱序</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.showScoreAfterSubmit !== false}
              onCheckedChange={(v) => onChangeConfig({ ...config, showScoreAfterSubmit: v })}
            />
            <span className="text-xs text-muted-foreground">提交后展示成绩</span>
          </div>
        </div>
      </div>

    </div>
  )
}

// ============ 作业面板 ============
function HomeworkPanel({
  config,
  onChangeConfig,
}: {
  config: { requiresMaterial: boolean; estimatedDays?: number; formatRequirements?: string; allowResubmit?: boolean }
  onChangeConfig: (c: typeof config) => void
}) {
  return (
    <div className="space-y-4">
      <div className="bg-pink-50 rounded-lg border border-pink-100 p-3 text-sm text-pink-700">
        <p className="font-medium">作业说明</p>
        <p className="text-xs mt-1">学生提交作业进行评价。</p>
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">作业材料要求</p>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.requiresMaterial}
              onCheckedChange={(v) => onChangeConfig({ ...config, requiresMaterial: v })}
            />
            <span className="text-xs text-muted-foreground">需要提交材料</span>
          </div>
        </div>
        {config.requiresMaterial && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">预估提交天数</Label>
                <Input
                  type="number"
                  value={config.estimatedDays || 3}
                  onChange={(e) => onChangeConfig({ ...config, estimatedDays: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="mt-1 text-sm"
                  min={1}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">格式要求</Label>
              <Textarea
                value={config.formatRequirements || ''}
                onChange={(e) => onChangeConfig({ ...config, formatRequirements: e.target.value })}
                placeholder="请描述作业格式要求..."
                rows={2}
                className="mt-1 text-sm"
              />
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <Switch
            checked={config.allowResubmit || false}
            onCheckedChange={(v) => onChangeConfig({ ...config, allowResubmit: v })}
          />
          <span className="text-xs text-muted-foreground">允许重新提交</span>
        </div>
      </div>

    </div>
  )
}

// ============ 成果评价面板 ============
function OutcomePanel({
  config,
  onChangeConfig,
}: {
  config: { requiresMaterial: boolean; estimatedDays?: number; formatRequirements?: string; allowResubmit?: boolean }
  onChangeConfig: (c: typeof config) => void
}) {
  return (
    <div className="space-y-4">
      <div className="bg-cyan-50 rounded-lg border border-cyan-100 p-3 text-sm text-cyan-700">
        <p className="font-medium">成果评价说明</p>
        <p className="text-xs mt-1">对学生提交的成果进行评价。</p>
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">成果材料要求</p>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.requiresMaterial}
              onCheckedChange={(v) => onChangeConfig({ ...config, requiresMaterial: v })}
            />
            <span className="text-xs text-muted-foreground">需要提交材料</span>
          </div>
        </div>
        {config.requiresMaterial && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">预估提交天数</Label>
                <Input
                  type="number"
                  value={config.estimatedDays || 7}
                  onChange={(e) => onChangeConfig({ ...config, estimatedDays: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="mt-1 text-sm"
                  min={1}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">格式要求</Label>
              <Textarea
                value={config.formatRequirements || ''}
                onChange={(e) => onChangeConfig({ ...config, formatRequirements: e.target.value })}
                placeholder="请描述成果材料格式要求..."
                rows={2}
                className="mt-1 text-sm"
              />
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <Switch
            checked={config.allowResubmit || false}
            onCheckedChange={(v) => onChangeConfig({ ...config, allowResubmit: v })}
          />
          <span className="text-xs text-muted-foreground">允许重新提交</span>
        </div>
      </div>

    </div>
  )
}
