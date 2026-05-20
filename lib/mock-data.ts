// ============================================
// 数字教务平台 - Mock 数据
// ============================================

// ----- 1. 组织架构 -----

export interface Department {
  id: string
  code: string
  name: string
  type: string
  leader: string
  status: 'active' | 'inactive'
}

export const departments: Department[] = [
  { id: 'd1', code: 'CS', name: '计算机科学与技术学院', type: '工科', leader: '张教授', status: 'active' },
  { id: 'd2', code: 'ME', name: '机械工程学院', type: '工科', leader: '李教授', status: 'active' },
  { id: 'd3', code: 'BM', name: '商学院', type: '商科', leader: '王教授', status: 'active' },
  { id: 'd4', code: 'DES', name: '艺术设计学院', type: '艺术', leader: '赵教授', status: 'active' },
  { id: 'd5', code: 'AUTO', name: '汽车工程学院', type: '工科', leader: '刘教授', status: 'active' },
]

export interface Major {
  id: string
  code: string
  name: string
  departmentId: string
  level: '中专' | '大专' | '本科'
  duration: number
  status: 'active' | 'inactive'
}

export const majors: Major[] = [
  { id: 'm1', code: 'SE', name: '软件工程', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm2', code: 'AI', name: '人工智能', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm3', code: 'CN', name: '计算机网络技术', departmentId: 'd1', level: '大专', duration: 3, status: 'active' },
  { id: 'm4', code: 'MECH', name: '机械设计与制造', departmentId: 'd2', level: '大专', duration: 3, status: 'active' },
  { id: 'm5', code: 'ACM', name: '会计', departmentId: 'd3', level: '大专', duration: 3, status: 'active' },
  { id: 'm6', code: 'MK', name: '市场营销', departmentId: 'd3', level: '大专', duration: 3, status: 'active' },
  { id: 'm7', code: 'VD', name: '视觉传达设计', departmentId: 'd4', level: '本科', duration: 4, status: 'active' },
  { id: 'm8', code: 'AUTO-R', name: '汽车检测与维修', departmentId: 'd5', level: '大专', duration: 3, status: 'active' },
]

export interface Class {
  id: string
  code: string
  name: string
  majorId: string
  entryYear: number
  headTeacher: string
  studentCount: number
  type: '行政班' | '教学班'
}

export const classes: Class[] = [
  { id: 'c1', code: 'SE2026A', name: '软件工程2026级1班', majorId: 'm1', entryYear: 2026, headTeacher: '周老师', studentCount: 42, type: '行政班' },
  { id: 'c2', code: 'SE2026B', name: '软件工程2026级2班', majorId: 'm1', entryYear: 2026, headTeacher: '吴老师', studentCount: 40, type: '行政班' },
  { id: 'c3', code: 'AI2026A', name: '人工智能2026级1班', majorId: 'm2', entryYear: 2026, headTeacher: '郑老师', studentCount: 38, type: '行政班' },
  { id: 'c4', code: 'CN2025A', name: '计算机网络2025级1班', majorId: 'm3', entryYear: 2025, headTeacher: '王老师', studentCount: 45, type: '行政班' },
  { id: 'c5', code: 'MECH2025A', name: '机械设计2025级1班', majorId: 'm4', entryYear: 2025, headTeacher: '李老师', studentCount: 36, type: '行政班' },
  { id: 'c6', code: 'ACM2026A', name: '会计2026级1班', majorId: 'm5', entryYear: 2026, headTeacher: '张老师', studentCount: 50, type: '行政班' },
  { id: 'c7', code: 'VD2025A', name: '视觉传达2025级1班', majorId: 'm7', entryYear: 2025, headTeacher: '赵老师', studentCount: 30, type: '行政班' },
  { id: 'c8', code: 'AUTO2026A', name: '汽车维修2026级1班', majorId: 'm8', entryYear: 2026, headTeacher: '刘老师', studentCount: 35, type: '行政班' },
]

// ----- 2. 师资 -----

export interface Faculty {
  id: string
  employeeId: string
  name: string
  gender: '男' | '女'
  departmentId: string
  majorId?: string
  title: string
  education: string
  teachingQualifications: string[]
  isEnterpriseMentor: boolean
  enterpriseInfo?: { company: string; position: string; years: number; field: string }
  status: '在职' | '离职' | '外聘'
}

export const faculty: Faculty[] = [
  { id: 'f1', employeeId: 'T2021001', name: '周建国', gender: '男', departmentId: 'd1', title: '教授', education: '博士', teachingQualifications: ['程序设计', '数据结构'], isEnterpriseMentor: false, status: '在职' },
  { id: 'f2', employeeId: 'T2021002', name: '吴晓敏', gender: '女', departmentId: 'd1', title: '副教授', education: '硕士', teachingQualifications: ['人工智能', '机器学习'], isEnterpriseMentor: false, status: '在职' },
  { id: 'f3', employeeId: 'T2021003', name: '王志强', gender: '男', departmentId: 'd1', title: '讲师', education: '硕士', teachingQualifications: ['网络技术', '网络安全'], isEnterpriseMentor: true, enterpriseInfo: { company: '华为', position: '高级工程师', years: 8, field: '网络工程' }, status: '在职' },
  { id: 'f4', employeeId: 'T2021004', name: '李红梅', gender: '女', departmentId: 'd2', title: '教授', education: '博士', teachingQualifications: ['机械设计', 'CAD/CAM'], isEnterpriseMentor: false, status: '在职' },
  { id: 'f5', employeeId: 'T2021005', name: '张大伟', gender: '男', departmentId: 'd3', title: '副教授', education: '硕士', teachingQualifications: ['会计学', '财务管理'], isEnterpriseMentor: false, status: '在职' },
  { id: 'f6', employeeId: 'T2021006', name: '赵丽华', gender: '女', departmentId: 'd4', title: '讲师', education: '硕士', teachingQualifications: ['平面设计', 'UI设计'], isEnterpriseMentor: true, enterpriseInfo: { company: '字节跳动', position: '设计总监', years: 6, field: '视觉设计' }, status: '在职' },
  { id: 'f7', employeeId: 'T2021007', name: '刘建国', gender: '男', departmentId: 'd5', title: '高级工程师', education: '本科', teachingQualifications: ['汽车维修', '新能源汽车'], isEnterpriseMentor: true, enterpriseInfo: { company: '比亚迪', position: '技术专家', years: 12, field: '汽车工程' }, status: '在职' },
  { id: 'f8', employeeId: 'T2021008', name: '陈秀英', gender: '女', departmentId: 'd3', title: '讲师', education: '硕士', teachingQualifications: ['市场营销', '电子商务'], isEnterpriseMentor: false, status: '在职' },
  { id: 'f9', employeeId: 'T2021009', name: '孙伟', gender: '男', departmentId: 'd2', title: '讲师', education: '硕士', teachingQualifications: ['数控技术', '3D打印'], isEnterpriseMentor: false, status: '在职' },
  { id: 'f10', employeeId: 'T2021010', name: '郑雅琴', gender: '女', departmentId: 'd1', title: '助教', education: '硕士', teachingQualifications: ['前端开发', 'Web设计'], isEnterpriseMentor: false, status: '在职' },
]

// ----- 3. 学生学籍 -----

export type StudentStatus = '在籍' | '休学' | '退学' | '毕业' | '结业'

export interface Student {
  id: string
  studentId: string
  name: string
  gender: '男' | '女'
  idCard: string
  departmentId: string
  majorId: string
  classId: string
  entryYear: number
  status: StudentStatus
  gpa: number
  creditsEarned: number
}

export const students: Student[] = [
  { id: 's1', studentId: '2026010101', name: '李明', gender: '男', idCard: '110101200801011234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2026, status: '在籍', gpa: 3.6, creditsEarned: 28 },
  { id: 's2', studentId: '2026010102', name: '王芳', gender: '女', idCard: '110101200802021234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2026, status: '在籍', gpa: 3.8, creditsEarned: 30 },
  { id: 's3', studentId: '2026010103', name: '张伟', gender: '男', idCard: '110101200803031234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2026, status: '在籍', gpa: 3.2, creditsEarned: 26 },
  { id: 's4', studentId: '2026010201', name: '刘洋', gender: '男', idCard: '110101200801041234', departmentId: 'd1', majorId: 'm2', classId: 'c3', entryYear: 2026, status: '在籍', gpa: 3.5, creditsEarned: 29 },
  { id: 's5', studentId: '2025010301', name: '陈静', gender: '女', idCard: '110101200703051234', departmentId: 'd1', majorId: 'm3', classId: 'c4', entryYear: 2025, status: '在籍', gpa: 3.7, creditsEarned: 78 },
  { id: 's6', studentId: '2025010401', name: '杨强', gender: '男', idCard: '110101200706061234', departmentId: 'd2', majorId: 'm4', classId: 'c5', entryYear: 2025, status: '在籍', gpa: 3.1, creditsEarned: 72 },
  { id: 's7', studentId: '2026010501', name: '黄丽', gender: '女', idCard: '110101200805071234', departmentId: 'd3', majorId: 'm5', classId: 'c6', entryYear: 2026, status: '在籍', gpa: 3.9, creditsEarned: 32 },
  { id: 's8', studentId: '2026010502', name: '赵军', gender: '男', idCard: '110101200806081234', departmentId: 'd3', majorId: 'm6', classId: 'c6', entryYear: 2026, status: '在籍', gpa: 3.3, creditsEarned: 27 },
  { id: 's9', studentId: '2025010701', name: '周敏', gender: '女', idCard: '110101200704091234', departmentId: 'd4', majorId: 'm7', classId: 'c7', entryYear: 2025, status: '在籍', gpa: 3.4, creditsEarned: 75 },
  { id: 's10', studentId: '2026010801', name: '吴磊', gender: '男', idCard: '110101200807101234', departmentId: 'd5', majorId: 'm8', classId: 'c8', entryYear: 2026, status: '在籍', gpa: 3.0, creditsEarned: 25 },
  { id: 's11', studentId: '2023010101', name: '郑涛', gender: '男', idCard: '110101200601111234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2023, status: '毕业', gpa: 3.5, creditsEarned: 164 },
  { id: 's12', studentId: '2024010101', name: '孙雪', gender: '女', idCard: '110101200702121234', departmentId: 'd1', majorId: 'm1', classId: 'c2', entryYear: 2024, status: '在籍', gpa: 3.6, creditsEarned: 98 },
  { id: 's13', studentId: '2026010104', name: '钱多多', gender: '男', idCard: '110101200808131234', departmentId: 'd1', majorId: 'm1', classId: 'c2', entryYear: 2026, status: '在籍', gpa: 2.9, creditsEarned: 24 },
  { id: 's14', studentId: '2025010302', name: '林晓', gender: '女', idCard: '110101200705141234', departmentId: 'd1', majorId: 'm3', classId: 'c4', entryYear: 2025, status: '休学', gpa: 3.0, creditsEarned: 45 },
  { id: 's15', studentId: '2024010201', name: '徐凯', gender: '男', idCard: '110101200603151234', departmentId: 'd1', majorId: 'm2', classId: 'c3', entryYear: 2024, status: '在籍', gpa: 3.7, creditsEarned: 92 },
]

export interface StatusChange {
  id: string
  studentId: string
  type: '转专业' | '休学' | '复学' | '退学' | '留级' | '毕业'
  fromValue?: string
  toValue?: string
  date: string
  reason: string
  approver: string
}

export const statusChanges: StatusChange[] = [
  { id: 'sc1', studentId: 's14', type: '休学', fromValue: '在籍', toValue: '休学', date: '2025-09-01', reason: '因病休学一年', approver: '教务处' },
  { id: 'sc2', studentId: 's11', type: '毕业', fromValue: '在籍', toValue: '毕业', date: '2026-06-30', reason: '达到毕业要求', approver: '学位委员会' },
  { id: 'sc3', studentId: 's5', type: '转专业', fromValue: '软件工程', toValue: '计算机网络技术', date: '2025-09-01', reason: '个人申请，成绩符合要求', approver: '教务处' },
]

// ----- 4. 教学资源 -----

export interface Textbook {
  id: string
  name: string
  isbn: string
  publisher: string
  author: string
  edition: string
  associatedCourses: string[]
  status: 'active' | 'inactive'
}

export const textbooks: Textbook[] = [
  { id: 'tb1', name: 'Java程序设计基础', isbn: '978-7-111-12345-1', publisher: '机械工业出版社', author: '谭浩强', edition: '第5版', associatedCourses: ['Java程序设计'], status: 'active' },
  { id: 'tb2', name: '数据结构与算法', isbn: '978-7-302-23456-2', publisher: '清华大学出版社', author: '严蔚敏', edition: '第3版', associatedCourses: ['数据结构'], status: 'active' },
  { id: 'tb3', name: '计算机网络原理', isbn: '978-7-111-34567-3', publisher: '机械工业出版社', author: '谢希仁', edition: '第8版', associatedCourses: ['计算机网络'], status: 'active' },
  { id: 'tb4', name: '机械设计基础', isbn: '978-7-302-45678-4', publisher: '清华大学出版社', author: '杨可桢', edition: '第7版', associatedCourses: ['机械设计'], status: 'active' },
  { id: 'tb5', name: '会计学原理', isbn: '978-7-111-56789-5', publisher: '机械工业出版社', author: '陈国辉', edition: '第4版', associatedCourses: ['会计学基础'], status: 'active' },
  { id: 'tb6', name: '市场营销学', isbn: '978-7-302-67890-6', publisher: '清华大学出版社', author: '吴健安', edition: '第6版', associatedCourses: ['市场营销'], status: 'active' },
  { id: 'tb7', name: '设计心理学', isbn: '978-7-111-78901-7', publisher: '中信出版社', author: '唐纳德·诺曼', edition: '第2版', associatedCourses: ['设计基础'], status: 'active' },
  { id: 'tb8', name: '汽车构造', isbn: '978-7-302-89012-8', publisher: '清华大学出版社', author: '陈家瑞', edition: '第6版', associatedCourses: ['汽车构造'], status: 'active' },
]

export interface Venue {
  id: string
  name: string
  type: '教室' | '实验室' | '实训基地' | '机房' | '多媒体教室' | '其他'
  capacity: number
  location: string
  facilities: string
  status: 'available' | 'maintenance' | 'disabled'
}

export const venues: Venue[] = [
  { id: 'v1', name: 'A101 多媒体教室', type: '多媒体教室', capacity: 60, location: 'A栋1层', facilities: '投影仪、音响、空调', status: 'available' },
  { id: 'v2', name: 'A102 普通教室', type: '教室', capacity: 50, location: 'A栋1层', facilities: '黑板、空调', status: 'available' },
  { id: 'v3', name: 'B201 计算机机房', type: '机房', capacity: 80, location: 'B栋2层', facilities: '电脑80台、投影仪、空调', status: 'available' },
  { id: 'v4', name: 'B301 网络实验室', type: '实验室', capacity: 40, location: 'B栋3层', facilities: '网络设备、防火墙、空调', status: 'available' },
  { id: 'v5', name: 'C101 机械实训基地', type: '实训基地', capacity: 30, location: 'C栋1层', facilities: '数控机床、3D打印机、吊车', status: 'available' },
  { id: 'v6', name: 'C201 汽车实训车间', type: '实训基地', capacity: 25, location: 'C栋2层', facilities: '举升机、诊断仪、新能源实训台', status: 'available' },
  { id: 'v7', name: 'D101 设计工作室', type: '实验室', capacity: 35, location: 'D栋1层', facilities: 'iMac、绘图板、打印机', status: 'available' },
  { id: 'v8', name: 'A201 大阶梯教室', type: '教室', capacity: 120, location: 'A栋2层', facilities: '投影仪、音响、空调', status: 'available' },
]

// ----- 5. 培养方案 -----

export interface CoursePlan {
  id: string
  name: string
  code: string
  credits: number
  hours: number
  semester: number
  nature: '必修' | '选修' | '实践' | '场景'
  assessment: '考试' | '考查' | '论文' | '作品' | '场景测评'
}

export interface TrainingProgram {
  id: string
  name: string
  code: string
  majorId: string
  entryYear: number
  level: '中专' | '大专' | '本科'
  duration: number
  totalCredits: number
  requiredCredits: number
  electiveCredits: number
  practiceCredits: number
  courses: CoursePlan[]
  status: 'draft' | 'pending' | 'published' | 'deprecated'
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 'tp1',
    name: '2026级软件工程专业人才培养方案',
    code: 'TP-SE-2026',
    majorId: 'm1',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co1', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co2', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co3', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co4', name: '计算机网络', code: 'CS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co5', name: '软件工程实践', code: 'CS301', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品' },
      { id: 'co6', name: '人工智能导论', code: 'AI101', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
    ],
    status: 'published',
  },
  {
    id: 'tp2',
    name: '2026级人工智能专业人才培养方案',
    code: 'TP-AI-2026',
    majorId: 'm2',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 166,
    requiredCredits: 122,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co7', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co8', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co9', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co10', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试' },
    ],
    status: 'published',
  },
  {
    id: 'tp3',
    name: '2026级会计专业人才培养方案',
    code: 'TP-ACM-2026',
    majorId: 'm5',
    entryYear: 2026,
    level: '大专',
    duration: 3,
    totalCredits: 128,
    requiredCredits: 95,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co11', name: '会计学基础', code: 'ACM101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co12', name: '财务会计', code: 'ACM201', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co13', name: '会计电算化', code: 'ACM301', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查' },
    ],
    status: 'draft',
  },
]

// ----- 6. 教学日历 -----

export interface Term {
  id: string
  year: string
  semester: '第一学期' | '第二学期'
  startDate: string
  endDate: string
  isCurrent: boolean
}

export const terms: Term[] = [
  { id: 't1', year: '2026-2027', semester: '第一学期', startDate: '2026-09-01', endDate: '2027-01-15', isCurrent: true },
  { id: 't2', year: '2025-2026', semester: '第二学期', startDate: '2026-02-20', endDate: '2026-07-05', isCurrent: false },
]

export interface CalendarWeek {
  id: string
  termId: string
  weekNumber: number
  startDate: string
  endDate: string
  weekType: '教学周' | '考试周' | '实践周' | '假期' | '节假日'
  holidayName?: string
}

export const calendarWeeks: CalendarWeek[] = [
  { id: 'cw1', termId: 't1', weekNumber: 1, startDate: '2026-09-01', endDate: '2026-09-06', weekType: '教学周' },
  { id: 'cw2', termId: 't1', weekNumber: 2, startDate: '2026-09-07', endDate: '2026-09-13', weekType: '教学周' },
  { id: 'cw3', termId: 't1', weekNumber: 3, startDate: '2026-09-14', endDate: '2026-09-20', weekType: '教学周' },
  { id: 'cw4', termId: 't1', weekNumber: 4, startDate: '2026-09-21', endDate: '2026-09-27', weekType: '教学周' },
  { id: 'cw5', termId: 't1', weekNumber: 5, startDate: '2026-09-28', endDate: '2026-10-04', weekType: '节假日', holidayName: '国庆节' },
  { id: 'cw6', termId: 't1', weekNumber: 6, startDate: '2026-10-05', endDate: '2026-10-11', weekType: '教学周' },
  { id: 'cw7', termId: 't1', weekNumber: 7, startDate: '2026-10-12', endDate: '2026-10-18', weekType: '教学周' },
  { id: 'cw8', termId: 't1', weekNumber: 8, startDate: '2026-10-19', endDate: '2026-10-25', weekType: '教学周' },
  { id: 'cw9', termId: 't1', weekNumber: 9, startDate: '2026-10-26', endDate: '2026-11-01', weekType: '教学周' },
  { id: 'cw10', termId: 't1', weekNumber: 10, startDate: '2026-11-02', endDate: '2026-11-08', weekType: '教学周' },
  { id: 'cw11', termId: 't1', weekNumber: 11, startDate: '2026-11-09', endDate: '2026-11-15', weekType: '教学周' },
  { id: 'cw12', termId: 't1', weekNumber: 12, startDate: '2026-11-16', endDate: '2026-11-22', weekType: '教学周' },
  { id: 'cw13', termId: 't1', weekNumber: 13, startDate: '2026-11-23', endDate: '2026-11-29', weekType: '教学周' },
  { id: 'cw14', termId: 't1', weekNumber: 14, startDate: '2026-11-30', endDate: '2026-12-06', weekType: '教学周' },
  { id: 'cw15', termId: 't1', weekNumber: 15, startDate: '2026-12-07', endDate: '2026-12-13', weekType: '教学周' },
  { id: 'cw16', termId: 't1', weekNumber: 16, startDate: '2026-12-14', endDate: '2026-12-20', weekType: '教学周' },
  { id: 'cw17', termId: 't1', weekNumber: 17, startDate: '2026-12-21', endDate: '2026-12-27', weekType: '考试周' },
  { id: 'cw18', termId: 't1', weekNumber: 18, startDate: '2026-12-28', endDate: '2027-01-03', weekType: '考试周' },
]

// ----- 7. 排课 -----

export interface TimetableEntry {
  id: string
  classId: string
  courseName: string
  facultyId: string
  venueId: string
  dayOfWeek: number
  period: string
  weeks: string
  nature: '理论' | '实践' | '场景教学' | '考试'
  externalPlatformId?: string
  externalPlatformType?: 'course' | 'scene'
}

export const timetableEntries: TimetableEntry[] = [
  { id: 'te1', classId: 'c1', courseName: '程序设计基础', facultyId: 'f1', venueId: 'v3', dayOfWeek: 1, period: '1-2节', weeks: '1-16周', nature: '理论' },
  { id: 'te2', classId: 'c1', courseName: '高等数学', facultyId: 'f1', venueId: 'v1', dayOfWeek: 1, period: '3-4节', weeks: '1-16周', nature: '理论' },
  { id: 'te3', classId: 'c1', courseName: '数据结构', facultyId: 'f2', venueId: 'v3', dayOfWeek: 2, period: '1-2节', weeks: '1-16周', nature: '理论' },
  { id: 'te4', classId: 'c1', courseName: '软件工程实践', facultyId: 'f3', venueId: 'v4', dayOfWeek: 3, period: '5-8节', weeks: '5-16周', nature: '实践' },
  { id: 'te5', classId: 'c3', courseName: 'Python程序设计', facultyId: 'f2', venueId: 'v3', dayOfWeek: 2, period: '3-4节', weeks: '1-16周', nature: '理论' },
  { id: 'te6', classId: 'c3', courseName: '机器学习', facultyId: 'f2', venueId: 'v3', dayOfWeek: 4, period: '1-2节', weeks: '1-16周', nature: '理论' },
  { id: 'te7', classId: 'c5', courseName: '机械设计基础', facultyId: 'f4', venueId: 'v5', dayOfWeek: 1, period: '5-8节', weeks: '1-14周', nature: '实践' },
  { id: 'te8', classId: 'c6', courseName: '会计学基础', facultyId: 'f5', venueId: 'v1', dayOfWeek: 3, period: '1-2节', weeks: '1-16周', nature: '理论' },
  { id: 'te9', classId: 'c7', courseName: '设计基础', facultyId: 'f6', venueId: 'v7', dayOfWeek: 2, period: '5-8节', weeks: '1-16周', nature: '实践' },
  { id: 'te10', classId: 'c8', courseName: '汽车构造', facultyId: 'f7', venueId: 'v6', dayOfWeek: 4, period: '5-8节', weeks: '1-14周', nature: '实践' },
]

// ----- 8. 调课 -----

export interface CourseAdjustment {
  id: string
  originalEntryId: string
  type: '调课' | '停课' | '补课'
  newDayOfWeek?: number
  newPeriod?: string
  newVenueId?: string
  newFacultyId?: string
  reason: string
  applicant: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  notifyStatus: '未通知' | '已通知'
  createdAt: string
}

export const courseAdjustments: CourseAdjustment[] = [
  { id: 'ca1', originalEntryId: 'te1', type: '调课', newDayOfWeek: 3, newPeriod: '1-2节', reason: '教师参加学术会议', applicant: '周建国', status: 'approved', notifyStatus: '已通知', createdAt: '2026-09-10' },
  { id: 'ca2', originalEntryId: 'te7', type: '调课', newDayOfWeek: 2, newPeriod: '5-8节', reason: '实训设备维护', applicant: '李红梅', status: 'pending', notifyStatus: '未通知', createdAt: '2026-09-15' },
  { id: 'ca3', originalEntryId: 'te5', type: '停课', reason: '国庆节放假调休', applicant: '吴晓敏', status: 'approved', notifyStatus: '已通知', createdAt: '2026-09-20' },
]

// ----- 9. 教学进度 -----

export interface TeachingProgress {
  id: string
  courseName: string
  classId: string
  facultyName: string
  plannedHours: number
  completedHours: number
  studentAvgCompletion: number
}

export const teachingProgress: TeachingProgress[] = [
  { id: 'tp1', courseName: '程序设计基础', classId: 'c1', facultyName: '周建国', plannedHours: 64, completedHours: 48, studentAvgCompletion: 85 },
  { id: 'tp2', courseName: '高等数学', classId: 'c1', facultyName: '周建国', plannedHours: 64, completedHours: 48, studentAvgCompletion: 78 },
  { id: 'tp3', courseName: '数据结构', classId: 'c1', facultyName: '吴晓敏', plannedHours: 64, completedHours: 40, studentAvgCompletion: 72 },
  { id: 'tp4', courseName: 'Python程序设计', classId: 'c3', facultyName: '吴晓敏', plannedHours: 64, completedHours: 50, studentAvgCompletion: 88 },
  { id: 'tp5', courseName: '机械设计基础', classId: 'c5', facultyName: '李红梅', plannedHours: 56, completedHours: 42, studentAvgCompletion: 80 },
  { id: 'tp6', courseName: '会计学基础', classId: 'c6', facultyName: '张大伟', plannedHours: 64, completedHours: 52, studentAvgCompletion: 90 },
  { id: 'tp7', courseName: '设计基础', classId: 'c7', facultyName: '赵丽华', plannedHours: 64, completedHours: 45, studentAvgCompletion: 82 },
  { id: 'tp8', courseName: '汽车构造', classId: 'c8', facultyName: '刘建国', plannedHours: 56, completedHours: 35, studentAvgCompletion: 75 },
]

// ----- 10. 教学质量评价 -----

export interface EvaluationTemplate {
  id: string
  name: string
  subject: '学生评教' | '内部评价' | '专家评价' | '企业评价'
  dimensions: string[]
  method: '打分制' | '等级制' | '问卷打分'
  status: 'draft' | 'published' | 'disabled'
}

export const evaluationTemplates: EvaluationTemplate[] = [
  { id: 'et1', name: '期末学生评教模板', subject: '学生评教', dimensions: ['教学态度', '教学内容', '教学方法', '教学效果'], method: '打分制', status: 'published' },
  { id: 'et2', name: '教师互评模板', subject: '内部评价', dimensions: ['教学态度', '教学内容', '教学方法', '教学效果'], method: '打分制', status: 'published' },
  { id: 'et3', name: '专家听课评价表', subject: '专家评价', dimensions: ['教学态度', '教学内容', '教学方法', '教学效果', '能力达成'], method: '等级制', status: 'published' },
  { id: 'et4', name: '企业实践指导评价', subject: '企业评价', dimensions: ['企业实践指导', '能力达成'], method: '打分制', status: 'published' },
]

export interface EvaluationActivity {
  id: string
  name: string
  termId: string
  templateId: string
  scope: string
  startTime: string
  endTime: string
  status: 'not_started' | 'active' | 'ended'
}

export const evaluationActivities: EvaluationActivity[] = [
  { id: 'ea1', name: '2026-2027第一学期期末学生评教', termId: 't1', templateId: 'et1', scope: '全校', startTime: '2026-12-15', endTime: '2026-12-25', status: 'active' },
  { id: 'ea2', name: '2026-2027第一学期教师互评', termId: 't1', templateId: 'et2', scope: '全校', startTime: '2026-11-01', endTime: '2026-11-15', status: 'ended' },
]

export interface EvaluationRecord {
  id: string
  activityId: string
  evaluatorName: string
  evaluatorRole: string
  evaluateeName: string
  evaluateeType: string
  scores: Record<string, number>
  totalScore: number
  comment?: string
  submittedAt: string
}

export const evaluationRecords: EvaluationRecord[] = [
  { id: 'er1', activityId: 'ea1', evaluatorName: '李明', evaluatorRole: '学生', evaluateeName: '周建国', evaluateeType: '教师', scores: { '教学态度': 5, '教学内容': 4, '教学方法': 5, '教学效果': 4 }, totalScore: 4.5, comment: '讲解清晰，案例丰富', submittedAt: '2026-12-16' },
  { id: 'er2', activityId: 'ea1', evaluatorName: '王芳', evaluatorRole: '学生', evaluateeName: '周建国', evaluateeType: '教师', scores: { '教学态度': 5, '教学内容': 5, '教学方法': 4, '教学效果': 5 }, totalScore: 4.75, submittedAt: '2026-12-17' },
  { id: 'er3', activityId: 'ea2', evaluatorName: '吴晓敏', evaluatorRole: '教师', evaluateeName: '周建国', evaluateeType: '教师', scores: { '教学态度': 5, '教学内容': 5, '教学方法': 5, '教学效果': 4 }, totalScore: 4.75, comment: '课堂组织能力强', submittedAt: '2026-11-05' },
]

// ----- 11. 成绩认定 -----

export type GradeType = '平时' | '期中' | '期末' | '实践' | '总评' | '补考' | '重修'
export type GradeStatus = '待确认' | '待审核' | '待认定' | '已认定' | '已发布'

export interface GradeRecord {
  id: string
  studentId: string
  courseName: string
  gradeType: GradeType
  rawScore: number
  recognizedScore: number
  credits: number
  gpa: number
  status: GradeStatus
  termId: string
}

export const gradeRecords: GradeRecord[] = [
  { id: 'g1', studentId: 's1', courseName: '程序设计基础', gradeType: '平时', rawScore: 85, recognizedScore: 85, credits: 4, gpa: 3.5, status: '已发布', termId: 't2' },
  { id: 'g2', studentId: 's1', courseName: '程序设计基础', gradeType: '期末', rawScore: 88, recognizedScore: 88, credits: 4, gpa: 3.7, status: '已发布', termId: 't2' },
  { id: 'g3', studentId: 's1', courseName: '程序设计基础', gradeType: '总评', rawScore: 87, recognizedScore: 87, credits: 4, gpa: 3.7, status: '已发布', termId: 't2' },
  { id: 'g4', studentId: 's2', courseName: '数据结构', gradeType: '平时', rawScore: 92, recognizedScore: 92, credits: 4, gpa: 4.0, status: '已发布', termId: 't2' },
  { id: 'g5', studentId: 's5', courseName: '计算机网络', gradeType: '平时', rawScore: 78, recognizedScore: 78, credits: 3, gpa: 3.0, status: '已认定', termId: 't2' },
  { id: 'g6', studentId: 's5', courseName: '计算机网络', gradeType: '期末', rawScore: 82, recognizedScore: 82, credits: 3, gpa: 3.3, status: '待审核', termId: 't2' },
  { id: 'g7', studentId: 's6', courseName: '机械设计基础', gradeType: '总评', rawScore: 75, recognizedScore: 75, credits: 4, gpa: 2.7, status: '待确认', termId: 't2' },
  { id: 'g8', studentId: 's7', courseName: '会计学基础', gradeType: '平时', rawScore: 95, recognizedScore: 95, credits: 4, gpa: 4.0, status: '已发布', termId: 't1' },
  { id: 'g9', studentId: 's10', courseName: '汽车构造', gradeType: '总评', rawScore: 68, recognizedScore: 68, credits: 4, gpa: 2.0, status: '待确认', termId: 't1' },
  { id: 'g10', studentId: 's12', courseName: '数据结构', gradeType: '期末', rawScore: 90, recognizedScore: 90, credits: 4, gpa: 4.0, status: '已发布', termId: 't2' },
]

// ----- 12. 学历认定 -----

export type DegreeStatus = '待审核' | '符合毕业条件' | '不符合毕业条件' | '结业' | '肄业'

export interface DegreeRecognition {
  id: string
  studentId: string
  programId: string
  totalCredits: number
  requiredCredits: number
  electiveCredits: number
  practiceCredits: number
  requiredPassed: number
  requiredTotal: number
  graduationDesignStatus: '合格' | '不合格'
  attendanceRate: number
  degreeStatus: DegreeStatus
  badgeSynced: boolean
}

export const degreeRecognitions: DegreeRecognition[] = [
  { id: 'dr1', studentId: 's11', programId: 'tp1', totalCredits: 164, requiredCredits: 120, electiveCredits: 24, practiceCredits: 20, requiredPassed: 45, requiredTotal: 45, graduationDesignStatus: '合格', attendanceRate: 96, degreeStatus: '符合毕业条件', badgeSynced: true },
  { id: 'dr2', studentId: 's5', programId: 'tp3', totalCredits: 78, requiredCredits: 95, electiveCredits: 12, practiceCredits: 8, requiredPassed: 22, requiredTotal: 28, graduationDesignStatus: '不合格', attendanceRate: 85, degreeStatus: '不符合毕业条件', badgeSynced: false },
  { id: 'dr3', studentId: 's6', programId: 'tp1', totalCredits: 72, requiredCredits: 120, electiveCredits: 10, practiceCredits: 6, requiredPassed: 20, requiredTotal: 32, graduationDesignStatus: '不合格', attendanceRate: 78, degreeStatus: '不符合毕业条件', badgeSynced: false },
]

// ----- 13. 教学成果 -----

export type AchievementType = '教学改革' | '教材建设' | '课程建设' | '教学竞赛' | '优秀毕设' | '其他'
export type AchievementStatus = '草稿' | '已提交' | '审批中' | '已通过' | '已驳回'

export interface TeachingAchievement {
  id: string
  name: string
  type: AchievementType
  applicantName: string
  departmentId: string
  content: string
  status: AchievementStatus
  isBenchmark: boolean
}

export const teachingAchievements: TeachingAchievement[] = [
  { id: 'ta1', name: '基于项目驱动的软件工程课程改革', type: '教学改革', applicantName: '周建国', departmentId: 'd1', content: '探索项目驱动教学法在软件工程课程中的应用', status: '已通过', isBenchmark: true },
  { id: 'ta2', name: '《Python程序设计》在线课程建设', type: '课程建设', applicantName: '吴晓敏', departmentId: 'd1', content: '建设面向全校的Python程序设计在线开放课程', status: '已通过', isBenchmark: false },
  { id: 'ta3', name: '机械设计虚拟仿真实验教学系统', type: '教学改革', applicantName: '李红梅', departmentId: 'd2', content: '开发机械设计课程的虚拟仿真实验平台', status: '审批中', isBenchmark: false },
  { id: 'ta4', name: '2026届优秀毕业设计：智能分拣系统', type: '优秀毕设', applicantName: '郑涛', departmentId: 'd1', content: '基于深度学习的智能物流分拣系统设计与实现', status: '已通过', isBenchmark: true },
  { id: 'ta5', name: '会计专业校企合作实训基地建设', type: '课程建设', applicantName: '张大伟', departmentId: 'd3', content: '与用友集团共建会计信息化实训基地', status: '已提交', isBenchmark: false },
]
