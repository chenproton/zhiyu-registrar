import {
  tasks,
  courseAssignments,
  preparationTasks,
  teachingProgress,
  syllabuses,
  sceneSyllabuses,
  faculty,
  classes,
  departments,
  majors,
  timetableEntries,
  adjustmentRequests,
  type Task,
  type CourseAssignment,
  type PreparationTask,
  type TeachingProgress,
  type Syllabus,
  type SceneSyllabus,
  type Faculty,
  type TimetableEntry,
  type AdjustmentRequest,
} from './mock-data'
import { currentTeacher, currentSecretary } from './current-user'

// ==================== 教师视角数据过滤 ====================

/** 获取当前教师负责的所有教学任务 */
export function getTeacherTasks(facultyId: string = currentTeacher.id): Task[] {
  return tasks.filter((t) => t.facultyId === facultyId)
}

/** 获取当前教师的所有课程分配 */
export function getTeacherCourseAssignments(facultyId: string = currentTeacher.id): CourseAssignment[] {
  return courseAssignments.filter(
    (ca) => ca.facultyId === facultyId || (ca.coFacultyIds?.includes(facultyId) ?? false)
  )
}

/** 获取当前教师的备课任务 */
export function getTeacherPreparationTasks(facultyId: string = currentTeacher.id): PreparationTask[] {
  return preparationTasks.filter((p) => p.facultyId === facultyId)
}

/** 获取当前教师的教学进度 */
export function getTeacherTeachingProgress(facultyId: string = currentTeacher.id): TeachingProgress[] {
  const f = faculty.find((item) => item.id === facultyId)
  if (!f) return []
  return teachingProgress.filter((tp) => tp.facultyName === f.name)
}

/** 获取当前教师所授课程对应的教学大纲 */
export function getTeacherSyllabuses(facultyId: string = currentTeacher.id): (Syllabus | SceneSyllabus)[] {
  const cas = getTeacherCourseAssignments(facultyId)
  const courseNames = new Set(cas.map((ca) => ca.courseName))
  return [
    ...syllabuses.filter((s) => courseNames.has(s.courseName)),
    ...sceneSyllabuses.filter((s) => courseNames.has(s.courseName)),
  ]
}

/** 获取当前教师的课表条目（兼容旧版 timetableEntries） */
export function getTeacherTimetableEntries(facultyId: string = currentTeacher.id): TimetableEntry[] {
  return timetableEntries.filter((te) => te.facultyId === facultyId)
}

/** 获取当前教师的信息 */
export function getTeacherInfo(facultyId: string = currentTeacher.id): Faculty | undefined {
  return faculty.find((f) => f.id === facultyId)
}

// ==================== 教学秘书视角数据过滤 ====================

/** 教学秘书可见：全部教学任务 */
export function getAllTasks(): Task[] {
  return tasks
}

/** 教学秘书可见：全部课程分配 */
export function getAllCourseAssignments(): CourseAssignment[] {
  return courseAssignments
}

/** 教学秘书可见：全部备课任务 */
export function getAllPreparationTasks(): PreparationTask[] {
  return preparationTasks
}

/** 教学秘书可见：全部教学进度 */
export function getAllTeachingProgress(): TeachingProgress[] {
  return teachingProgress
}

/** 教学秘书可见：全部教学大纲 */
export function getAllSyllabuses(): (Syllabus | SceneSyllabus)[] {
  return [...syllabuses, ...sceneSyllabuses]
}

/** 教学秘书可见：全部课表条目 */
export function getAllTimetableEntries(): TimetableEntry[] {
  return timetableEntries
}

/** 按教师ID分组获取教学任务（用于秘书视角的教师课表） */
export function getTasksByFaculty(): Map<string, Task[]> {
  const map = new Map<string, Task[]>()
  tasks.forEach((t) => {
    const list = map.get(t.facultyId) || []
    list.push(t)
    map.set(t.facultyId, list)
  })
  return map
}

/** 按院系ID获取该院系下的所有教师 */
export function getFacultyByDepartment(departmentId: string): Faculty[] {
  return faculty.filter((f) => f.departmentId === departmentId)
}

/** 获取秘书所属院系的教师列表（默认使用 currentSecretary.departmentId） */
export function getSecretaryDepartmentFaculty(departmentId: string = currentSecretary.departmentId || ''): Faculty[] {
  return getFacultyByDepartment(departmentId)
}

// ==================== 调课申请数据过滤 ====================

/** 获取当前教师的调课申请 */
export function getTeacherAdjustmentRequests(facultyId: string = currentTeacher.id): AdjustmentRequest[] {
  return adjustmentRequests.filter((a) => a.facultyId === facultyId)
}

/** 获取全部调课申请（秘书视角） */
export function getAllAdjustmentRequests(): AdjustmentRequest[] {
  return adjustmentRequests
}

/** 获取待审批的调课申请（秘书视角） */
export function getPendingAdjustmentRequests(): AdjustmentRequest[] {
  return adjustmentRequests.filter((a) => a.status === 'pending')
}

// ==================== 通用辅助函数 ====================

/** 获取星期标签 */
export function getDayLabel(dayOfWeek: number): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[dayOfWeek] || '未知'
}

/** 按星期分组任务 */
export function groupTasksByDay(taskList: Task[]): Map<number, Task[]> {
  const map = new Map<number, Task[]>()
  taskList.forEach((t) => {
    const list = map.get(t.dayOfWeek) || []
    list.push(t)
    map.set(t.dayOfWeek, list)
  })
  return map
}

/** 计算任务冲突 */
export function detectTaskConflicts(taskList: Task[]): { taskA: Task; taskB: Task; reason: string }[] {
  const conflicts: { taskA: Task; taskB: Task; reason: string }[] = []
  for (let i = 0; i < taskList.length; i++) {
    for (let j = i + 1; j < taskList.length; j++) {
      const a = taskList[i]
      const b = taskList[j]
      if (a.dayOfWeek === b.dayOfWeek && a.periods.some((p) => b.periods.includes(p))) {
        if (a.venueId === b.venueId) {
          conflicts.push({ taskA: a, taskB: b, reason: `场地冲突：${a.venueName}` })
        }
      }
    }
  }
  return conflicts
}
