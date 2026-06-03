'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { TeachingPlan, PlanCourseEntry, TrainingProgram, CoursePlan } from '@/lib/mock-data'
import { teachingPlansV2 as initialTeachingPlans } from '@/lib/mock-data'

interface TeachingPlanContextType {
  teachingPlans: TeachingPlan[]
  addTeachingPlan: (p: TeachingPlan) => void
  updateTeachingPlan: (p: TeachingPlan) => void
  generatePlanFromProgram: (program: TrainingProgram) => TeachingPlan | null
}

const TeachingPlanContext = createContext<TeachingPlanContextType | null>(null)

function determineVenueType(course: CoursePlan): PlanCourseEntry['venueTypeRequired'] {
  if (course.nature === '场景') return '校外基地'
  if (course.nature === '实践') return '实训室'
  if (course.code.startsWith('CS') || course.code.startsWith('AI') || course.code.startsWith('DS')) return '机房'
  return '教室'
}

function buildEntryFromCourse(
  course: CoursePlan,
  program: TrainingProgram,
  syllabusId: string
): PlanCourseEntry {
  const isScene = course.nature === '场景'
  const isPractice = course.nature === '实践' || isScene
  const weekHours = Math.max(1, Math.ceil(course.hours / 16))
  const endWeek = Math.min(16, Math.ceil(course.hours / weekHours))

  return {
    id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    courseId: course.id,
    courseName: course.name,
    courseCode: course.code,
    type: isScene ? 'scene' : isPractice ? 'practice' : 'theory',
    nature: course.nature,
    credits: course.credits,
    totalHours: course.hours,
    semester: course.semester,
    weekHours,
    startWeek: 1,
    endWeek,
    weekPattern: 'all',
    assignedClassIds: [],
    preferredFacultyIds: [],
    venueTypeRequired: determineVenueType(course),
    syllabusId,
    status: 'planned',
  }
}

export function TeachingPlanProvider({ children }: { children: React.ReactNode }) {
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlan[]>(initialTeachingPlans)

  const addTeachingPlan = useCallback((p: TeachingPlan) => {
    setTeachingPlans((prev) => [...prev, p])
  }, [])

  const updateTeachingPlan = useCallback((p: TeachingPlan) => {
    setTeachingPlans((prev) => prev.map((item) => (item.id === p.id ? p : item)))
  }, [])

  const generatePlanFromProgram = useCallback(
    (program: TrainingProgram) => {
      // 检查是否已存在该方案的计划
      const exists = teachingPlans.find((p) => p.programId === program.id)
      if (exists) return null

      // 优先从 curriculum 取课程（如果 courses 为空）
      const allCourses = (program.courses.length > 0 || program.practiceScenes.length > 0)
        ? [...program.courses, ...program.practiceScenes]
        : program.curriculum
          ? [
              ...program.curriculum.publicBasic.required,
              ...program.curriculum.publicBasic.limitedElective,
              ...program.curriculum.publicBasic.freeElective,
              ...program.curriculum.professional.basic,
              ...program.curriculum.professional.core,
              ...program.curriculum.professional.extended,
              ...program.curriculum.professional.practice,
            ]
          : []
      const now = new Date().toISOString()

      const entries: PlanCourseEntry[] = allCourses.map((course) => {
        // 用 courseId 生成一个虚拟 syllabusId（实际可能不存在，仅作关联占位）
        const syllabusId = `syl-placeholder-${course.id}`
        return buildEntryFromCourse(course, program, syllabusId)
      })

      const plan: TeachingPlan = {
        id: `plan-${Date.now()}`,
        programId: program.id,
        programName: program.name,
        majorId: program.majorId,
        entryYear: program.entryYear,
        totalSemesters: program.duration * 2,
        entries,
        status: 'generated',
        generatedAt: now,
        generatorLog: `基于培养方案「${program.name}」自动生成，共 ${entries.length} 门课程`,
      }

      setTeachingPlans((prev) => [...prev, plan])
      return plan
    },
    [teachingPlans]
  )

  const value: TeachingPlanContextType = {
    teachingPlans,
    addTeachingPlan,
    updateTeachingPlan,
    generatePlanFromProgram,
  }

  return <TeachingPlanContext.Provider value={value}>{children}</TeachingPlanContext.Provider>
}

export function useTeachingPlans() {
  const ctx = useContext(TeachingPlanContext)
  if (!ctx) throw new Error('useTeachingPlans must be used within TeachingPlanProvider')
  return ctx
}
