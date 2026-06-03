import { faculty } from './mock-data'

// ==================== 当前用户定义 ====================
// 本系统为演示系统，通过常量模拟当前登录用户
// 实际项目中应从登录态/Context中获取

export type UserRole = 'admin' | 'teacher' | 'secretary'

export interface CurrentUser {
  id: string
  name: string
  role: UserRole
  roleLabel: string
  departmentId?: string
  avatar?: string
}

/** 教务管理员 */
export const currentAdmin: CurrentUser = {
  id: 'admin-1',
  name: '教务管理员',
  role: 'admin',
  roleLabel: '数字教务平台',
}

/** 任课教师（默认：周建国 f1） */
export const currentTeacher: CurrentUser = {
  id: 'f1',
  name: '周建国',
  role: 'teacher',
  roleLabel: '任课教师',
  departmentId: 'd1',
}

/** 教学秘书（虚拟用户，归属计算机学院 d1） */
export const currentSecretary: CurrentUser = {
  id: 'secretary-1',
  name: '张秘书',
  role: 'secretary',
  roleLabel: '教学秘书',
  departmentId: 'd1',
}

/** 获取当前教师对应的 faculty 完整信息 */
export function getCurrentFaculty() {
  return faculty.find((f) => f.id === currentTeacher.id) || faculty[0]
}
