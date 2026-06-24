'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { Syllabus, SceneSyllabus, TrainingProgram, CoursePlan } from '@/lib/mock-data'
import { syllabuses as initialSyllabuses, sceneSyllabuses as initialSceneSyllabuses, positions } from '@/lib/mock-data'

interface SyllabusContextType {
  syllabuses: Syllabus[]
  sceneSyllabuses: SceneSyllabus[]
  addSyllabus: (s: Syllabus) => void
  addSceneSyllabus: (s: SceneSyllabus) => void
  updateSyllabus: (s: Syllabus) => void
  updateSceneSyllabus: (s: SceneSyllabus) => void
  generateSyllabusesFromProgram: (program: TrainingProgram, courseIds: string[]) => { added: number; skipped: number }
}

const SyllabusContext = createContext<SyllabusContextType | null>(null)

function generateObjectives(courseName: string, nature: string): Syllabus['objectives'] {
  if (nature === '混合式') {
    return [
      { id: `obj-${Date.now()}-1`, dimension: '知识', content: `掌握${courseName}线上自主学习内容与线下核心知识点`, level: '掌握' },
      { id: `obj-${Date.now()}-2`, dimension: '能力', content: `能够在线上完成预习与测验，在线下课堂完成项目实践`, level: '掌握' },
      { id: `obj-${Date.now()}-3`, dimension: '素养', content: `培养自主学习能力、团队协作与职业规范意识`, level: '掌握' },
    ]
  }
  if (nature === '实践' || nature === '场景') {
    return [
      { id: `obj-${Date.now()}-1`, dimension: '知识', content: `了解${courseName}的基本流程和规范`, level: '了解' },
      { id: `obj-${Date.now()}-2`, dimension: '能力', content: `能够独立完成${courseName}的核心任务`, level: '掌握' },
      { id: `obj-${Date.now()}-3`, dimension: '素养', content: `培养团队协作和职业规范意识`, level: '掌握' },
    ]
  }
  return [
    { id: `obj-${Date.now()}-1`, dimension: '知识', content: `掌握${courseName}的基本概念和原理`, level: '掌握' },
    { id: `obj-${Date.now()}-2`, dimension: '能力', content: `能够运用${courseName}知识解决实际问题`, level: '掌握' },
    { id: `obj-${Date.now()}-3`, dimension: '素养', content: `培养严谨的科学态度和创新思维`, level: '理解' },
  ]
}

function generateChapters(course: CoursePlan): Syllabus['chapters'] {
  const chapterCount = Math.max(1, Math.ceil(course.hours / 8))
  const baseHours = Math.floor(course.hours / chapterCount)
  const remainder = course.hours % chapterCount
  const isHybrid = course.nature === '混合式' || course.isHybrid
  const isPractice = course.nature === '实践' || course.nature === '场景'
  const onlineRatio = isHybrid ? (course.onlineHours ?? Math.round(course.hours * 0.4)) / course.hours : 0

  const chapters: Syllabus['chapters'] = []
  for (let i = 0; i < chapterCount; i++) {
    const chHours = i < remainder ? baseHours + 1 : baseHours
    const onlineHours = isHybrid ? Math.round(chHours * onlineRatio) : 0
    const offlineHours = chHours - onlineHours
    chapters.push({
      id: `ch-${Date.now()}-${i}`,
      name: isPractice ? `任务${i + 1}：${course.name}实践环节${i + 1}` : isHybrid ? `单元${i + 1}：${course.name}混合教学单元${i + 1}` : `第${i + 1}章 ${course.name}核心内容`,
      hours: chHours,
      theoryHours: isPractice ? 0 : isHybrid ? offlineHours : Math.ceil(chHours * 0.6),
      practiceHours: isPractice ? chHours : isHybrid ? onlineHours : Math.floor(chHours * 0.4),
      content: isPractice
        ? `完成${course.name}相关实践任务，掌握操作技能`
        : isHybrid
          ? `${course.name}线上自主学习与线下课堂研讨相结合的混合教学`
          : `${course.name}理论知识讲解与案例分析`,
      teachingMethod: isPractice ? '项目实践' : isHybrid ? '线上线下混合、微课预习、课堂研讨、项目实践' : '讲授+案例',
      keyPoints: isPractice ? '操作规范' : isHybrid ? '线上自主学习与线下实践融合' : '核心概念',
      difficultPoints: isPractice ? '综合运用' : isHybrid ? '知识迁移与综合应用' : '理论推导',
    })
  }
  return chapters
}

function generateTaskChain(courseName: string) {
  return [
    { id: `st-${Date.now()}-1`, name: '任务准备与环境搭建', order: 1, mappedAbilityIds: [], hours: 4 },
    { id: `st-${Date.now()}-2`, name: `${courseName}核心任务执行`, order: 2, mappedAbilityIds: [], hours: 8 },
    { id: `st-${Date.now()}-3`, name: '成果验收与总结', order: 3, mappedAbilityIds: [], hours: 4 },
  ]
}

function buildSyllabusFromCourse(program: TrainingProgram, course: CoursePlan): Syllabus {
  const isPractice = course.nature === '实践' || course.nature === '场景'
  const isHybrid = course.nature === '混合式' || course.isHybrid
  const now = new Date().toISOString()

  return {
    id: `syl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    programId: program.id,
    courseId: course.id,
    courseName: course.name,
    courseCode: course.code,
    type: isHybrid ? 'hybrid' : isPractice ? 'practice' : 'theory',
    credits: course.credits,
    totalHours: course.hours,
    theoryHours: isPractice ? 0 : isHybrid ? (course.offlineHours ?? Math.ceil(course.hours * 0.6)) : Math.ceil(course.hours * 0.6),
    practiceHours: isPractice ? course.hours : isHybrid ? (course.onlineHours ?? Math.floor(course.hours * 0.4)) : Math.floor(course.hours * 0.4),
    applicableMajorIds: [program.majorId],
    objectives: generateObjectives(course.name, course.nature),
    chapters: generateChapters(course),
    teachingMethods: isHybrid
      ? '线上线下混合式教学：课前微课预习与测验、课中案例研讨与项目实训、课后作业与单元测试'
      : isPractice
        ? '项目驱动、小组协作、企业导师指导'
        : '讲授法、案例教学、课堂讨论、线上线下混合',
    assessmentMethod: course.assessment,
    assessmentWeight: isHybrid
      ? { usual: 40, midterm: 10, final: 30, practice: 20 }
      : isPractice
        ? { usual: 40, midterm: 0, final: 0, practice: 60 }
        : { usual: 30, midterm: 20, final: 50, practice: 0 },
    textbooks: ['国家规划教材（待指定）'],
    references: ['相关行业标准与技术文档'],
    status: 'generated',
    version: 'v1.0',
    createdAt: now,
    updatedAt: now,
    generatorLog: `基于培养方案「${program.name}」自动生成`,
  }
}

function buildSceneSyllabusFromCourse(program: TrainingProgram, course: CoursePlan): SceneSyllabus {
  const base = buildSyllabusFromCourse(program, course)
  const firstPosId = program.careerOrientation?.mainPositions?.[0]
  const pos = firstPosId ? positions.find((p) => p.id === firstPosId) : undefined

  return {
    ...base,
    type: 'scene',
    mappedPositionId: pos?.id || '',
    mappedPositionName: pos?.name || (firstPosId || ''),
    taskChain: generateTaskChain(course.name),
    evaluationRubric: 'A: 独立完成全部任务且质量优秀 \nB: 在指导下完成，质量良好 \nC: 基本完成核心任务 \nD: 部分完成，需加强',
    workstationType: '综合实训工位',
    equipmentList: ['开发电脑', '专业软件', '测试工具'],
    enterpriseMentorRequired: true,
  }
}

export function SyllabusProvider({ children }: { children: React.ReactNode }) {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>(initialSyllabuses)
  const [sceneSyllabuses, setSceneSyllabuses] = useState<SceneSyllabus[]>(initialSceneSyllabuses)

  const addSyllabus = useCallback((s: Syllabus) => {
    setSyllabuses((prev) => [...prev, s])
  }, [])

  const addSceneSyllabus = useCallback((s: SceneSyllabus) => {
    setSceneSyllabuses((prev) => [...prev, s])
  }, [])

  const updateSyllabus = useCallback((s: Syllabus) => {
    setSyllabuses((prev) => prev.map((item) => (item.id === s.id ? s : item)))
  }, [])

  const updateSceneSyllabus = useCallback((s: SceneSyllabus) => {
    setSceneSyllabuses((prev) => prev.map((item) => (item.id === s.id ? s : item)))
  }, [])

  const generateSyllabusesFromProgram = useCallback(
    (program: TrainingProgram, courseIds: string[]) => {
      let added = 0
      let skipped = 0
      // 优先使用 curriculum 数组（实际结构），回退 courses/practiceScenes
      const allCourses = (Array.isArray(program.curriculum) && program.curriculum.length > 0)
        ? program.curriculum as CoursePlan[]
        : [...program.courses, ...program.practiceScenes]

      for (const courseId of courseIds) {
        const course = allCourses.find((c) => c.id === courseId)
        if (!course) {
          skipped++
          continue
        }

        // 检查是否已存在
        const exists =
          syllabuses.some((s) => s.programId === program.id && s.courseId === courseId) ||
          sceneSyllabuses.some((s) => s.programId === program.id && s.courseId === courseId)
        if (exists) {
          skipped++
          continue
        }

        if (course.nature === '场景') {
          const sceneSyl = buildSceneSyllabusFromCourse(program, course)
          setSceneSyllabuses((prev) => [...prev, sceneSyl])
        } else {
          const syl = buildSyllabusFromCourse(program, course)
          setSyllabuses((prev) => [...prev, syl])
        }
        added++
      }

      return { added, skipped }
    },
    [syllabuses, sceneSyllabuses]
  )

  const value: SyllabusContextType = {
    syllabuses,
    sceneSyllabuses,
    addSyllabus,
    addSceneSyllabus,
    updateSyllabus,
    updateSceneSyllabus,
    generateSyllabusesFromProgram,
  }

  return <SyllabusContext.Provider value={value}>{children}</SyllabusContext.Provider>
}

export function useSyllabuses() {
  const ctx = useContext(SyllabusContext)
  if (!ctx) throw new Error('useSyllabuses must be used within SyllabusProvider')
  return ctx
}
