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
  { id: 'm9', code: 'CS', name: '计算机科学与技术', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm10', code: 'DS', name: '数据科学与大数据技术', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm11', code: 'IS', name: '信息安全', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm12', code: 'IOT', name: '物联网工程', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm13', code: 'CE', name: '云计算技术应用', departmentId: 'd1', level: '大专', duration: 3, status: 'active' },
]

export interface Class {
  id: string
  code: string
  name: string
  majorId: string
  gradeId: string
  headTeacher: string
  studentCount: number
  type: '行政班' | '教学班'
}

export const classes: Class[] = [
  { id: 'c1', code: 'SE2026A', name: '软件工程2026级1班', majorId: 'm1', gradeId: 'g2026', headTeacher: '周老师', studentCount: 42, type: '行政班' },
  { id: 'c2', code: 'SE2026B', name: '软件工程2026级2班', majorId: 'm1', gradeId: 'g2026', headTeacher: '吴老师', studentCount: 40, type: '行政班' },
  { id: 'c3', code: 'AI2026A', name: '人工智能2026级1班', majorId: 'm2', gradeId: 'g2026', headTeacher: '郑老师', studentCount: 38, type: '行政班' },
  { id: 'c4', code: 'CN2025A', name: '计算机网络2025级1班', majorId: 'm3', gradeId: 'g2025', headTeacher: '王老师', studentCount: 45, type: '行政班' },
  { id: 'c5', code: 'MECH2025A', name: '机械设计2025级1班', majorId: 'm4', gradeId: 'g2025', headTeacher: '李老师', studentCount: 36, type: '行政班' },
  { id: 'c6', code: 'ACM2026A', name: '会计2026级1班', majorId: 'm5', gradeId: 'g2026', headTeacher: '张老师', studentCount: 50, type: '行政班' },
  { id: 'c7', code: 'VD2025A', name: '视觉传达2025级1班', majorId: 'm7', gradeId: 'g2025', headTeacher: '赵老师', studentCount: 30, type: '行政班' },
  { id: 'c8', code: 'AUTO2026A', name: '汽车维修2026级1班', majorId: 'm8', gradeId: 'g2026', headTeacher: '刘老师', studentCount: 35, type: '行政班' },
  { id: 'c9', code: 'CN2026A', name: '计算机网络技术2026级1班', majorId: 'm3', gradeId: 'g2026', headTeacher: '陈老师', studentCount: 43, type: '行政班' },
  { id: 'c10', code: 'CS2026A', name: '计算机科学与技术2026级1班', majorId: 'm9', gradeId: 'g2026', headTeacher: '孙老师', studentCount: 41, type: '行政班' },
  { id: 'c11', code: 'DS2026A', name: '数据科学2026级1班', majorId: 'm10', gradeId: 'g2026', headTeacher: '钱老师', studentCount: 39, type: '行政班' },
  { id: 'c12', code: 'IOT2026A', name: '物联网工程2026级1班', majorId: 'm12', gradeId: 'g2026', headTeacher: '马老师', studentCount: 37, type: '行政班' },
]

// ----- 1.5 年级/届别管理 -----

export interface Grade {
  id: string
  name: string              // 如"2026级"
  entryYear: number         // 入学年份
  status: '在校' | '毕业' | '结业'
}

export const grades: Grade[] = [
  { id: 'g2026', name: '2026级', entryYear: 2026, status: '在校' },
  { id: 'g2025', name: '2025级', entryYear: 2025, status: '在校' },
  { id: 'g2024', name: '2024级', entryYear: 2024, status: '在校' },
  { id: 'g2023', name: '2023级', entryYear: 2023, status: '毕业' },
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

export interface AbilityPortfolio {
  certificates: { name: string; issuer: string; date: string; status: '有效' | '过期' }[]
  competitions: { name: string; level: string; award: string; date: string }[]
  internships: { company: string; position: string; duration: string; evaluation: string }[]
  activities: { name: string; type: string; date: string }[]
  skillBadges: { name: string; level: string; issuer: string; date: string }[]
}

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
  educationLevel: '中专' | '大专' | '本科'
  degreeType?: '学士' | '无'
  abilityPortfolio?: AbilityPortfolio
  abilityRecognition?: {
    totalSkills: number
    certifiedSkills: number
    competencyLevel: '初级' | '中级' | '高级'
    lastAssessment: string
  }
}

export const students: Student[] = [
  { id: 's1', studentId: '2026010101', name: '李明', gender: '男', idCard: '110101200801011234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2026, status: '在籍', gpa: 3.6, creditsEarned: 28, educationLevel: '本科',
    abilityPortfolio: {
      certificates: [{ name: '全国计算机等级考试二级', issuer: '教育部考试中心', date: '2026-03', status: '有效' }],
      competitions: [{ name: '蓝桥杯程序设计大赛', level: '省级', award: '二等奖', date: '2026-04' }],
      internships: [{ company: '字节跳动', position: '后端开发实习生', duration: '2026.07-2026.09', evaluation: '优秀' }],
      activities: [{ name: 'ACM程序设计社团', type: '社团活动', date: '2026-09' }],
      skillBadges: [{ name: 'Python编程', level: '中级', issuer: '能力测评平台', date: '2026-05' }],
    },
    abilityRecognition: { totalSkills: 8, certifiedSkills: 3, competencyLevel: '中级', lastAssessment: '2026-06-15' },
  },
  { id: 's2', studentId: '2026010102', name: '王芳', gender: '女', idCard: '110101200802021234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2026, status: '在籍', gpa: 3.8, creditsEarned: 30, educationLevel: '本科',
    abilityPortfolio: {
      certificates: [{ name: '大学英语六级', issuer: '教育部考试中心', date: '2026-06', status: '有效' }],
      competitions: [],
      internships: [],
      activities: [{ name: '学生会科技部', type: '学生工作', date: '2026-09' }],
      skillBadges: [{ name: '数据分析', level: '初级', issuer: '能力测评平台', date: '2026-05' }],
    },
    abilityRecognition: { totalSkills: 6, certifiedSkills: 2, competencyLevel: '初级', lastAssessment: '2026-06-15' },
  },
  { id: 's3', studentId: '2026010103', name: '张伟', gender: '男', idCard: '110101200803031234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2026, status: '在籍', gpa: 3.2, creditsEarned: 26, educationLevel: '本科' },
  { id: 's4', studentId: '2026010201', name: '刘洋', gender: '男', idCard: '110101200801041234', departmentId: 'd1', majorId: 'm2', classId: 'c3', entryYear: 2026, status: '在籍', gpa: 3.5, creditsEarned: 29, educationLevel: '本科' },
  { id: 's5', studentId: '2025010301', name: '陈静', gender: '女', idCard: '110101200703051234', departmentId: 'd1', majorId: 'm3', classId: 'c4', entryYear: 2025, status: '在籍', gpa: 3.7, creditsEarned: 78, educationLevel: '大专' },
  { id: 's6', studentId: '2025010401', name: '杨强', gender: '男', idCard: '110101200706061234', departmentId: 'd2', majorId: 'm4', classId: 'c5', entryYear: 2025, status: '在籍', gpa: 3.1, creditsEarned: 72, educationLevel: '大专' },
  { id: 's7', studentId: '2026010501', name: '黄丽', gender: '女', idCard: '110101200805071234', departmentId: 'd3', majorId: 'm5', classId: 'c6', entryYear: 2026, status: '在籍', gpa: 3.9, creditsEarned: 32, educationLevel: '大专',
    abilityPortfolio: {
      certificates: [{ name: '初级会计职称', issuer: '财政部', date: '2026-05', status: '有效' }],
      competitions: [{ name: '全国大学生会计技能大赛', level: '国家级', award: '三等奖', date: '2026-06' }],
      internships: [{ company: '用友集团', position: '财务实习生', duration: '2026.07-2026.09', evaluation: '良好' }],
      activities: [],
      skillBadges: [{ name: '会计信息化', level: '中级', issuer: '能力测评平台', date: '2026-05' }],
    },
    abilityRecognition: { totalSkills: 10, certifiedSkills: 4, competencyLevel: '中级', lastAssessment: '2026-06-15' },
  },
  { id: 's8', studentId: '2026010502', name: '赵军', gender: '男', idCard: '110101200806081234', departmentId: 'd3', majorId: 'm6', classId: 'c6', entryYear: 2026, status: '在籍', gpa: 3.3, creditsEarned: 27, educationLevel: '大专' },
  { id: 's9', studentId: '2025010701', name: '周敏', gender: '女', idCard: '110101200704091234', departmentId: 'd4', majorId: 'm7', classId: 'c7', entryYear: 2025, status: '在籍', gpa: 3.4, creditsEarned: 75, educationLevel: '本科' },
  { id: 's10', studentId: '2026010801', name: '吴磊', gender: '男', idCard: '110101200807101234', departmentId: 'd5', majorId: 'm8', classId: 'c8', entryYear: 2026, status: '在籍', gpa: 3.0, creditsEarned: 25, educationLevel: '大专' },
  { id: 's11', studentId: '2023010101', name: '郑涛', gender: '男', idCard: '110101200601111234', departmentId: 'd1', majorId: 'm1', classId: 'c1', entryYear: 2023, status: '毕业', gpa: 3.5, creditsEarned: 164, educationLevel: '本科', degreeType: '学士',
    abilityPortfolio: {
      certificates: [
        { name: '软件设计师（中级）', issuer: '工信部', date: '2025-05', status: '有效' },
        { name: '大学英语六级', issuer: '教育部考试中心', date: '2024-06', status: '有效' },
      ],
      competitions: [{ name: '互联网+创新创业大赛', level: '省级', award: '金奖', date: '2025-08' }],
      internships: [{ company: '华为', position: '软件开发实习生', duration: '2025.03-2025.06', evaluation: '优秀' }],
      activities: [{ name: '学生会主席', type: '学生工作', date: '2024-09' }],
      skillBadges: [
        { name: 'Java后端开发', level: '高级', issuer: '能力测评平台', date: '2025-12' },
        { name: '微服务架构', level: '中级', issuer: '能力测评平台', date: '2025-12' },
      ],
    },
    abilityRecognition: { totalSkills: 15, certifiedSkills: 8, competencyLevel: '高级', lastAssessment: '2026-06-01' },
  },
  { id: 's12', studentId: '2024010101', name: '孙雪', gender: '女', idCard: '110101200702121234', departmentId: 'd1', majorId: 'm1', classId: 'c2', entryYear: 2024, status: '在籍', gpa: 3.6, creditsEarned: 98, educationLevel: '本科' },
  { id: 's13', studentId: '2026010104', name: '钱多多', gender: '男', idCard: '110101200808131234', departmentId: 'd1', majorId: 'm1', classId: 'c2', entryYear: 2026, status: '在籍', gpa: 2.9, creditsEarned: 24, educationLevel: '本科' },
  { id: 's14', studentId: '2025010302', name: '林晓', gender: '女', idCard: '110101200705141234', departmentId: 'd1', majorId: 'm3', classId: 'c4', entryYear: 2025, status: '休学', gpa: 3.0, creditsEarned: 45, educationLevel: '大专' },
  { id: 's15', studentId: '2024010201', name: '徐凯', gender: '男', idCard: '110101200603151234', departmentId: 'd1', majorId: 'm2', classId: 'c3', entryYear: 2024, status: '在籍', gpa: 3.7, creditsEarned: 92, educationLevel: '本科' },
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
  digitalInfo?: {
    floorPlanUrl?: string
    model3dUrl?: string
    bookingSystemUrl?: string
    smartDeviceCount: number
    iotSensors: string[]
  }
}

export const venues: Venue[] = [
  { id: 'v1', name: 'A101 多媒体教室', type: '多媒体教室', capacity: 60, location: 'A栋1层', facilities: '投影仪、音响、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 3, iotSensors: ['温湿度', ' occupancy'] } },
  { id: 'v2', name: 'A102 普通教室', type: '教室', capacity: 50, location: 'A栋1层', facilities: '黑板、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 1, iotSensors: ['温湿度'] } },
  { id: 'v3', name: 'B201 计算机机房', type: '机房', capacity: 80, location: 'B栋2层', facilities: '电脑80台、投影仪、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', smartDeviceCount: 85, iotSensors: ['温湿度', '能耗监测', ' occupancy'] } },
  { id: 'v4', name: 'B301 网络实验室', type: '实验室', capacity: 40, location: 'B栋3层', facilities: '网络设备、防火墙、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', smartDeviceCount: 20, iotSensors: ['温湿度', '能耗监测'] } },
  { id: 'v5', name: 'C101 机械实训基地', type: '实训基地', capacity: 30, location: 'C栋1层', facilities: '数控机床、3D打印机、吊车', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', bookingSystemUrl: '#', smartDeviceCount: 15, iotSensors: ['温湿度', '能耗监测', '设备状态'] } },
  { id: 'v6', name: 'C201 汽车实训车间', type: '实训基地', capacity: 25, location: 'C栋2层', facilities: '举升机、诊断仪、新能源实训台', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', bookingSystemUrl: '#', smartDeviceCount: 12, iotSensors: ['温湿度', '能耗监测', '设备状态', '安全监控'] } },
  { id: 'v7', name: 'D101 设计工作室', type: '实验室', capacity: 35, location: 'D栋1层', facilities: 'iMac、绘图板、打印机', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 35, iotSensors: ['温湿度', ' occupancy'] } },
  { id: 'v8', name: 'A201 大阶梯教室', type: '教室', capacity: 120, location: 'A栋2层', facilities: '投影仪、音响、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 5, iotSensors: ['温湿度', ' occupancy'] } },
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
  startDate?: string
  endDate?: string
  creator?: string
  collaborators?: string[]
  createdAt?: string
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
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '张教授',
    collaborators: ['李副教授', '王讲师'],
    createdAt: '2025-06-15',
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
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '张教授',
    collaborators: ['赵副教授'],
    createdAt: '2025-06-20',
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
    startDate: '2026-09-01',
    endDate: '2029-07-01',
    creator: '刘教授',
    collaborators: [],
    createdAt: '2025-07-01',
  },
  {
    id: 'tp10',
    name: '2023级软件工程专业人才培养方案',
    code: 'TP-SE-2023',
    majorId: 'm1',
    entryYear: 2023,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co100', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co101', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co102', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co103', name: '软件工程', code: 'SE201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co104', name: '数据库原理', code: 'SE202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co105', name: 'Web开发技术', code: 'SE301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co106', name: '软件测试', code: 'SE302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co107', name: '软件工程实践', code: 'SE401', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品' },
    ],
    status: 'pending',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '张教授',
    collaborators: ['赵副教授'],
    createdAt: '2022-06-10',
  },
  {
    id: 'tp11',
    name: '2023级人工智能专业人才培养方案',
    code: 'TP-AI-2023',
    majorId: 'm2',
    entryYear: 2023,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co108', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co109', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co110', name: '数据结构与算法', code: 'AI103', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co111', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co112', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co113', name: '计算机视觉', code: 'AI302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co114', name: '自然语言处理', code: 'AI303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co115', name: '人工智能综合实践', code: 'AI401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '李副教授',
    collaborators: ['王讲师', '赵副教授'],
    createdAt: '2022-07-11',
  },
  {
    id: 'tp12',
    name: '2023级计算机网络技术专业人才培养方案',
    code: 'TP-CN-2023',
    majorId: 'm3',
    entryYear: 2023,
    level: '大专',
    duration: 3,
    totalCredits: 130,
    requiredCredits: 95,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co116', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co117', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co118', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co119', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co120', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co121', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查' },
      { id: 'co122', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2026-07-01',
    creator: '王讲师',
    collaborators: ['赵副教授', '刘教授'],
    createdAt: '2022-08-12',
  },
  {
    id: 'tp13',
    name: '2023级计算机科学与技术专业人才培养方案',
    code: 'TP-CS-2023',
    majorId: 'm9',
    entryYear: 2023,
    level: '本科',
    duration: 4,
    totalCredits: 167,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co123', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co124', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co125', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co126', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co127', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co128', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co129', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试' },
      { id: 'co130', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co131', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文' },
    ],
    status: 'pending',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '赵副教授',
    collaborators: ['孙讲师'],
    createdAt: '2022-09-13',
  },
  {
    id: 'tp14',
    name: '2023级数据科学与大数据技术专业人才培养方案',
    code: 'TP-DS-2023',
    majorId: 'm10',
    entryYear: 2023,
    level: '本科',
    duration: 4,
    totalCredits: 168,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co132', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co133', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co134', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co135', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co136', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co137', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co138', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co139', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co140', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '刘教授',
    collaborators: ['陈副教授', '孙讲师'],
    createdAt: '2022-010-14',
  },
  {
    id: 'tp15',
    name: '2023级信息安全专业人才培养方案',
    code: 'TP-IS-2023',
    majorId: 'm11',
    entryYear: 2023,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 122,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co141', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co142', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co143', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co144', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co145', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co146', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co147', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co148', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co149', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '陈副教授',
    collaborators: ['孙讲师', '周教授'],
    createdAt: '2022-011-15',
  },
  {
    id: 'tp16',
    name: '2023级物联网工程专业人才培养方案',
    code: 'TP-IOT-2023',
    majorId: 'm12',
    entryYear: 2023,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co150', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co151', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co152', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co153', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co154', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co155', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co156', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co157', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co158', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'pending',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '孙讲师',
    collaborators: ['李副教授'],
    createdAt: '2022-06-16',
  },
  {
    id: 'tp17',
    name: '2023级云计算技术应用专业人才培养方案',
    code: 'TP-CE-2023',
    majorId: 'm13',
    entryYear: 2023,
    level: '大专',
    duration: 3,
    totalCredits: 129,
    requiredCredits: 96,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co159', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co160', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co161', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co162', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co163', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co164', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
      { id: 'co165', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查' },
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2026-07-01',
    creator: '周教授',
    collaborators: ['张教授', '李副教授'],
    createdAt: '2022-07-17',
  },
  {
    id: 'tp18',
    name: '2024级软件工程专业人才培养方案',
    code: 'TP-SE-2024',
    majorId: 'm1',
    entryYear: 2024,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co166', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co167', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co168', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co169', name: '软件工程', code: 'SE201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co170', name: '数据库原理', code: 'SE202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co171', name: 'Web开发技术', code: 'SE301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co172', name: '软件测试', code: 'SE302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co173', name: '软件工程实践', code: 'SE401', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '张教授',
    collaborators: ['李副教授', '王讲师'],
    createdAt: '2023-06-10',
  },
  {
    id: 'tp19',
    name: '2024级人工智能专业人才培养方案',
    code: 'TP-AI-2024',
    majorId: 'm2',
    entryYear: 2024,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co174', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co175', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co176', name: '数据结构与算法', code: 'AI103', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co177', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co178', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co179', name: '计算机视觉', code: 'AI302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co180', name: '自然语言处理', code: 'AI303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co181', name: '人工智能综合实践', code: 'AI401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '李副教授',
    collaborators: ['王讲师', '赵副教授'],
    createdAt: '2023-07-11',
  },
  {
    id: 'tp20',
    name: '2024级计算机网络技术专业人才培养方案',
    code: 'TP-CN-2024',
    majorId: 'm3',
    entryYear: 2024,
    level: '大专',
    duration: 3,
    totalCredits: 130,
    requiredCredits: 95,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co182', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co183', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co184', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co185', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co186', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co187', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查' },
      { id: 'co188', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
    ],
    status: 'pending',
    startDate: '2024-09-01',
    endDate: '2027-07-01',
    creator: '王讲师',
    collaborators: ['陈副教授'],
    createdAt: '2023-08-12',
  },
  {
    id: 'tp21',
    name: '2024级计算机科学与技术专业人才培养方案',
    code: 'TP-CS-2024',
    majorId: 'm9',
    entryYear: 2024,
    level: '本科',
    duration: 4,
    totalCredits: 167,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co189', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co190', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co191', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co192', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co193', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co194', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co195', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试' },
      { id: 'co196', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co197', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文' },
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '赵副教授',
    collaborators: ['刘教授', '陈副教授'],
    createdAt: '2023-09-13',
  },
  {
    id: 'tp22',
    name: '2024级数据科学与大数据技术专业人才培养方案',
    code: 'TP-DS-2024',
    majorId: 'm10',
    entryYear: 2024,
    level: '本科',
    duration: 4,
    totalCredits: 168,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co198', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co199', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co200', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co201', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co202', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co203', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co204', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co205', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co206', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '刘教授',
    collaborators: ['陈副教授', '孙讲师'],
    createdAt: '2023-010-14',
  },
  {
    id: 'tp23',
    name: '2024级信息安全专业人才培养方案',
    code: 'TP-IS-2024',
    majorId: 'm11',
    entryYear: 2024,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 122,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co207', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co208', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co209', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co210', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co211', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co212', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co213', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co214', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co215', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'pending',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '陈副教授',
    collaborators: ['张教授'],
    createdAt: '2023-011-15',
  },
  {
    id: 'tp24',
    name: '2024级物联网工程专业人才培养方案',
    code: 'TP-IOT-2024',
    majorId: 'm12',
    entryYear: 2024,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co216', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co217', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co218', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co219', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co220', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co221', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co222', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co223', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co224', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '孙讲师',
    collaborators: ['周教授', '张教授'],
    createdAt: '2023-06-16',
  },
  {
    id: 'tp25',
    name: '2024级云计算技术应用专业人才培养方案',
    code: 'TP-CE-2024',
    majorId: 'm13',
    entryYear: 2024,
    level: '大专',
    duration: 3,
    totalCredits: 129,
    requiredCredits: 96,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co225', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co226', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co227', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co228', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co229', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co230', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
      { id: 'co231', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查' },
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2027-07-01',
    creator: '周教授',
    collaborators: ['张教授', '李副教授'],
    createdAt: '2023-07-17',
  },
  {
    id: 'tp26',
    name: '2025级软件工程专业人才培养方案',
    code: 'TP-SE-2025',
    majorId: 'm1',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co232', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co233', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co234', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co235', name: '软件工程', code: 'SE201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co236', name: '数据库原理', code: 'SE202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co237', name: 'Web开发技术', code: 'SE301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co238', name: '软件测试', code: 'SE302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co239', name: '软件工程实践', code: 'SE401', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '张教授',
    collaborators: ['李副教授', '王讲师'],
    createdAt: '2024-06-10',
  },
  {
    id: 'tp27',
    name: '2025级人工智能专业人才培养方案',
    code: 'TP-AI-2025',
    majorId: 'm2',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co240', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co241', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co242', name: '数据结构与算法', code: 'AI103', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co243', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co244', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co245', name: '计算机视觉', code: 'AI302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co246', name: '自然语言处理', code: 'AI303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co247', name: '人工智能综合实践', code: 'AI401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'pending',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '李副教授',
    collaborators: ['刘教授'],
    createdAt: '2024-07-11',
  },
  {
    id: 'tp28',
    name: '2025级计算机网络技术专业人才培养方案',
    code: 'TP-CN-2025',
    majorId: 'm3',
    entryYear: 2025,
    level: '大专',
    duration: 3,
    totalCredits: 130,
    requiredCredits: 95,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co248', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co249', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co250', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co251', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co252', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co253', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查' },
      { id: 'co254', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2028-07-01',
    creator: '王讲师',
    collaborators: ['赵副教授', '刘教授'],
    createdAt: '2024-08-12',
  },
  {
    id: 'tp29',
    name: '2025级计算机科学与技术专业人才培养方案',
    code: 'TP-CS-2025',
    majorId: 'm9',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 167,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co255', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co256', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co257', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co258', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co259', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co260', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co261', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试' },
      { id: 'co262', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co263', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文' },
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '赵副教授',
    collaborators: ['刘教授', '陈副教授'],
    createdAt: '2024-09-13',
  },
  {
    id: 'tp30',
    name: '2025级数据科学与大数据技术专业人才培养方案',
    code: 'TP-DS-2025',
    majorId: 'm10',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 168,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co264', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co265', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co266', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co267', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co268', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co269', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co270', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co271', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co272', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'pending',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '刘教授',
    collaborators: ['周教授'],
    createdAt: '2024-010-14',
  },
  {
    id: 'tp31',
    name: '2025级信息安全专业人才培养方案',
    code: 'TP-IS-2025',
    majorId: 'm11',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 122,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co273', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co274', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co275', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co276', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co277', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co278', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co279', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co280', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co281', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '陈副教授',
    collaborators: ['孙讲师', '周教授'],
    createdAt: '2024-011-15',
  },
  {
    id: 'tp32',
    name: '2025级物联网工程专业人才培养方案',
    code: 'TP-IOT-2025',
    majorId: 'm12',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co282', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co283', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co284', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co285', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co286', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co287', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co288', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co289', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co290', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '孙讲师',
    collaborators: ['周教授', '张教授'],
    createdAt: '2024-06-16',
  },
  {
    id: 'tp33',
    name: '2025级云计算技术应用专业人才培养方案',
    code: 'TP-CE-2025',
    majorId: 'm13',
    entryYear: 2025,
    level: '大专',
    duration: 3,
    totalCredits: 129,
    requiredCredits: 96,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co291', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co292', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co293', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co294', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co295', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co296', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
      { id: 'co297', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查' },
    ],
    status: 'pending',
    startDate: '2025-09-01',
    endDate: '2028-07-01',
    creator: '周教授',
    collaborators: ['王讲师'],
    createdAt: '2024-07-17',
  },
  {
    id: 'tp36',
    name: '2026级计算机网络技术专业人才培养方案',
    code: 'TP-CN-2026',
    majorId: 'm3',
    entryYear: 2026,
    level: '大专',
    duration: 3,
    totalCredits: 130,
    requiredCredits: 95,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co314', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co315', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co316', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co317', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co318', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co319', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查' },
      { id: 'co320', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
    ],
    status: 'published',
    startDate: '2026-09-01',
    endDate: '2029-07-01',
    creator: '王讲师',
    collaborators: ['赵副教授', '刘教授'],
    createdAt: '2025-08-12',
  },
  {
    id: 'tp37',
    name: '2026级计算机科学与技术专业人才培养方案',
    code: 'TP-CS-2026',
    majorId: 'm9',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 167,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co321', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co322', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co323', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co324', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co325', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co326', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co327', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试' },
      { id: 'co328', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co329', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文' },
    ],
    status: 'pending',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '赵副教授',
    collaborators: ['孙讲师'],
    createdAt: '2025-09-13',
  },
  {
    id: 'tp38',
    name: '2026级数据科学与大数据技术专业人才培养方案',
    code: 'TP-DS-2026',
    majorId: 'm10',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 168,
    requiredCredits: 121,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co330', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co331', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co332', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co333', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co334', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co335', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co336', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co337', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co338', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '刘教授',
    collaborators: ['陈副教授', '孙讲师'],
    createdAt: '2025-010-14',
  },
  {
    id: 'tp39',
    name: '2026级信息安全专业人才培养方案',
    code: 'TP-IS-2026',
    majorId: 'm11',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 164,
    requiredCredits: 122,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co339', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co340', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co341', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co342', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co343', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co344', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试' },
      { id: 'co345', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co346', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查' },
      { id: 'co347', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'published',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '陈副教授',
    collaborators: ['孙讲师', '周教授'],
    createdAt: '2025-011-15',
  },
  {
    id: 'tp40',
    name: '2026级物联网工程专业人才培养方案',
    code: 'TP-IOT-2026',
    majorId: 'm12',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 120,
    electiveCredits: 24,
    practiceCredits: 20,
    courses: [
      { id: 'co348', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co349', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co350', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co351', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co352', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co353', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co354', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co355', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查' },
      { id: 'co356', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品' },
    ],
    status: 'pending',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '孙讲师',
    collaborators: ['李副教授'],
    createdAt: '2025-06-16',
  },
  {
    id: 'tp41',
    name: '2026级云计算技术应用专业人才培养方案',
    code: 'TP-CE-2026',
    majorId: 'm13',
    entryYear: 2026,
    level: '大专',
    duration: 3,
    totalCredits: 129,
    requiredCredits: 96,
    electiveCredits: 18,
    practiceCredits: 15,
    courses: [
      { id: 'co357', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co358', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试' },
      { id: 'co359', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co360', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试' },
      { id: 'co361', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试' },
      { id: 'co362', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查' },
      { id: 'co363', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查' },
    ],
    status: 'published',
    startDate: '2026-09-01',
    endDate: '2029-07-01',
    creator: '周教授',
    collaborators: ['张教授', '李副教授'],
    createdAt: '2025-07-17',
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

// ============================================
// 数字教务平台 v2.0 - 以学习任务为最小单元的新实体
// ============================================

// ----- 14. 任务核心实体（Task）-----

export type TaskStatus =
  | 'draft'
  | 'ready'
  | 'published'
  | 'in_progress'
  | 'evaluating'
  | 'completed'
  | 'archived'

export type TaskType = 'traditional' | 'scene'
export type TaskSource = 'imported' | 'manual'

export interface TaskResource {
  id: string
  taskId: string
  name: string
  type: 'textbook' | 'ppt' | 'video' | 'link' | 'document' | 'scene_link'
  url?: string
  textbookId?: string
  externalResourceId?: string
  isVisibleToStudents: boolean
  uploadBy: string
  uploadedAt: string
  sortOrder: number
}

export interface TimeSlot {
  date: string
  period: string
}

export interface SceneSubTask {
  id: string
  taskId: string
  name: string
  scenePlatformTaskId: string
  facultyId?: string
  facultyName?: string
  enterpriseMentorId?: string
  enterpriseMentorName?: string
  mentorParticipationType: 'full' | 'partial' | 'remote'
  mentorTimeSlots?: TimeSlot[]
  dayOfWeek?: number
  period?: string
  weeks?: string
  workStationId?: string
  workStationName?: string
  equipmentList?: string[]
  status: 'planned' | 'in_progress' | 'completed'
  progress?: {
    completionRate: number
    syncAt: string
  }
}

export interface TaskProgressSummary {
  plannedHours: number
  completedHours: number
  completionRate: number
  studentAvgCompletion: number
  studentCount: number
  completedStudentCount: number
  subTaskProgress?: {
    subTaskId: string
    subTaskName: string
    completionRate: number
  }[]
  dataSource: 'course_platform' | 'scene_platform' | 'mixed'
  lastSyncAt: string
}

export interface TaskGradeSummary {
  taskId: string
  classId: string
  facultyId: string
  components: {
    type: 'usual' | 'midterm' | 'final' | 'practice' | 'total' | 'makeup' | 'retake'
    typeLabel: string
    weight: number
    status: 'pending' | 'confirmed' | 'audited' | 'recognized' | 'published'
    recordCount: number
    totalStudents: number
  }[]
  overallStatus: 'pending' | 'evaluating' | 'published'
  publishAt?: string
  publishedBy?: string
}

export interface TaskReview {
  taskId: string
  facultyReview?: {
    teachingReflection: string
    problemsFound: string[]
    improvementMeasures: string[]
    studentFeedbackSummary: string
    createdAt: string
  }
  studentReviews?: {
    studentId: string
    learningSummary: string
    difficulties: string[]
    suggestions: string[]
    createdAt: string
  }[]
  evaluationSnapshot?: {
    avgScore: number
    participantCount: number
    dimensionScores: Record<string, number>
  }
}

export interface Task {
  id: string
  code: string
  name: string
  type: TaskType
  source: TaskSource
  status: TaskStatus
  termId: string
  courseName: string
  courseCode?: string
  classId: string
  className: string
  facultyId: string
  facultyName: string
  enterpriseMentorId?: string
  enterpriseMentorName?: string
  dayOfWeek: number
  period: string
  weeks: string
  venueId: string
  venueName: string
  workStationId?: string
  workStationName?: string
  externalPlatformId?: string
  externalPlatformType?: 'course' | 'scene'
  resources: TaskResource[]
  syllabus?: string
  objectives?: string[]
  sceneSubTasks?: SceneSubTask[]
  progressSummary?: TaskProgressSummary
  gradeSummary?: TaskGradeSummary
  review?: TaskReview
  createdAt: string
  updatedAt: string
  publishedAt?: string
  completedAt?: string
  archivedAt?: string
}

// ----- 学生端任务视角 -----

export interface StudentTaskView {
  taskId: string
  taskName: string
  courseName: string
  type: TaskType
  status: 'published' | 'in_progress' | 'evaluating' | 'completed'
  dayOfWeek: number
  period: string
  weeks: string
  venueName: string
  facultyName: string
  enterpriseMentorName?: string
  resources: { name: string; type: string; url?: string }[]
  myProgress?: { completionRate: number; lastAccessAt?: string }
  myGrades?: { component: string; score: number; status: 'pending' | 'published' }[]
  evaluationAvailable?: boolean
  evaluationCompleted?: boolean
}

// ----- 任务变更日志 -----

export interface TaskChangeLog {
  id: string
  taskId: string
  changeType: 'time' | 'venue' | 'faculty' | 'mentor' | 'workstation' | 'subtask' | 'cancel' | 'makeup'
  oldValue: Record<string, unknown>
  newValue: Record<string, unknown>
  reason: string
  applicant: string
  approver?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  approvedAt?: string
}

// ----- 15. 任课关系 -----

export interface CourseAssignment {
  id: string
  classId: string
  courseName: string
  courseCode: string
  facultyId: string
  coFacultyIds?: string[]
  hoursPerWeek: number
  weekPattern: 'all' | 'odd' | 'even'
  isSplit: boolean
  splitClasses?: { name: string; facultyId: string }[]
}

export const courseAssignments: CourseAssignment[] = [
  { id: 'ca1', classId: 'c1', courseName: '程序设计基础', courseCode: 'CS101', facultyId: 'f1', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca2', classId: 'c1', courseName: '高等数学', courseCode: 'MATH101', facultyId: 'f1', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca3', classId: 'c1', courseName: '数据结构', courseCode: 'CS102', facultyId: 'f2', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca4', classId: 'c1', courseName: '软件工程实践', courseCode: 'CS301', facultyId: 'f3', coFacultyIds: ['f3'], hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca5', classId: 'c3', courseName: 'Python程序设计', courseCode: 'AI102', facultyId: 'f2', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca6', classId: 'c3', courseName: '机器学习', courseCode: 'AI201', facultyId: 'f2', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca7', classId: 'c5', courseName: '机械设计基础', courseCode: 'MECH101', facultyId: 'f4', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca8', classId: 'c6', courseName: '会计学基础', courseCode: 'ACM101', facultyId: 'f5', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca9', classId: 'c7', courseName: '设计基础', courseCode: 'DES101', facultyId: 'f6', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  { id: 'ca10', classId: 'c8', courseName: '汽车构造', courseCode: 'AUTO101', facultyId: 'f7', hoursPerWeek: 4, weekPattern: 'all', isSplit: false },
  // 分层教学示例：软件工程2班英语分层
  { id: 'ca11', classId: 'c2', courseName: '大学英语（A层）', courseCode: 'ENG101A', facultyId: 'f8', hoursPerWeek: 4, weekPattern: 'all', isSplit: true, splitClasses: [{ name: 'A层（提高班）', facultyId: 'f8' }, { name: 'B层（基础班）', facultyId: 'f10' }] },
]

// ----- 15.5 课程池（独立课程库）-----

export interface CourseItem {
  id: string
  name: string
  code: string
  category: '公共课' | '专业基础课' | '专业课' | '实践课'
  type: '理论' | '实践' | '场景'
  nature: '必修' | '选修'
  defaultHours: number // 默认周课时
}

export const coursePool: CourseItem[] = [
  { id: 'course-001', name: '程序设计基础', code: 'CS101', category: '专业基础课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-002', name: '高等数学', code: 'MATH101', category: '公共课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-003', name: '数据结构', code: 'CS102', category: '专业基础课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-004', name: '计算机网络', code: 'CS201', category: '专业课', type: '理论', nature: '必修', defaultHours: 3 },
  { id: 'course-005', name: '软件工程实践', code: 'CS301', category: '实践课', type: '实践', nature: '必修', defaultHours: 4 },
  { id: 'course-006', name: 'Python程序设计', code: 'AI102', category: '专业基础课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-007', name: '机器学习', code: 'AI201', category: '专业课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-008', name: '会计学基础', code: 'ACM101', category: '专业基础课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-009', name: '设计基础', code: 'DES101', category: '专业基础课', type: '实践', nature: '必修', defaultHours: 4 },
  { id: 'course-010', name: '汽车构造', code: 'AUTO101', category: '专业课', type: '实践', nature: '必修', defaultHours: 4 },
  { id: 'course-011', name: '大学英语', code: 'ENG101', category: '公共课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-012', name: '体育与健康', code: 'PE101', category: '公共课', type: '实践', nature: '必修', defaultHours: 2 },
  { id: 'course-013', name: '思想政治', code: 'POL101', category: '公共课', type: '理论', nature: '必修', defaultHours: 2 },
  { id: 'course-014', name: '线性代数', code: 'MATH102', category: '公共课', type: '理论', nature: '必修', defaultHours: 3 },
  { id: 'course-015', name: '机械设计基础', code: 'MECH101', category: '专业基础课', type: '理论', nature: '必修', defaultHours: 4 },
  { id: 'course-016', name: '数控技术', code: 'MECH201', category: '专业课', type: '实践', nature: '必修', defaultHours: 4 },
]

// ----- 15.6 教学计划（班级×课程 课时分配）-----

export interface TeachingPlanEntry {
  id: string
  classId: string
  courseId: string
  hoursPerWeek: number
  weekPattern: 'all' | 'odd' | 'even'
}

export const teachingPlans: TeachingPlanEntry[] = [
  { id: 'tp-001', classId: 'c1', courseId: 'course-001', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-002', classId: 'c1', courseId: 'course-002', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-003', classId: 'c1', courseId: 'course-003', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-004', classId: 'c1', courseId: 'course-011', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-005', classId: 'c1', courseId: 'course-012', hoursPerWeek: 2, weekPattern: 'all' },
  { id: 'tp-006', classId: 'c1', courseId: 'course-013', hoursPerWeek: 2, weekPattern: 'all' },
  { id: 'tp-007', classId: 'c2', courseId: 'course-001', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-008', classId: 'c2', courseId: 'course-002', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-009', classId: 'c3', courseId: 'course-006', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-010', classId: 'c3', courseId: 'course-007', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-011', classId: 'c4', courseId: 'course-004', hoursPerWeek: 3, weekPattern: 'all' },
  { id: 'tp-012', classId: 'c5', courseId: 'course-015', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-013', classId: 'c5', courseId: 'course-016', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-014', classId: 'c6', courseId: 'course-008', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-015', classId: 'c7', courseId: 'course-009', hoursPerWeek: 4, weekPattern: 'all' },
  { id: 'tp-016', classId: 'c8', courseId: 'course-010', hoursPerWeek: 4, weekPattern: 'all' },
]

// ----- 16. 班级作息时间表 -----

export interface ClassPeriod {
  id: string
  sequence: number         // 节次序号
  timeSlot: 'morning' | 'afternoon' | 'evening'
  startTime: string        // 如 "08:00"
  endTime: string          // 如 "08:45"
  type: 'class' | 'morning_self' | 'lunch' | 'break_big' | 'evening'
  name: string             // 如 "第1节" "早自习" "午休" "大课间"
}

export interface ClassSchedule {
  classId: string
  weekPattern: 'all' | 'odd' | 'even'
  supportsSingleDouble: boolean
  periods: ClassPeriod[]
}

export const classSchedules: ClassSchedule[] = [
  {
    classId: 'c1',
    weekPattern: 'all',
    supportsSingleDouble: false,
    periods: [
      { id: 'cp-001', sequence: 0, timeSlot: 'morning', startTime: '07:30', endTime: '08:00', type: 'morning_self', name: '早自习' },
      { id: 'cp-002', sequence: 1, timeSlot: 'morning', startTime: '08:00', endTime: '08:45', type: 'class', name: '第1节' },
      { id: 'cp-003', sequence: 2, timeSlot: 'morning', startTime: '08:55', endTime: '09:40', type: 'class', name: '第2节' },
      { id: 'cp-004', sequence: 3, timeSlot: 'morning', startTime: '09:40', endTime: '10:10', type: 'break_big', name: '大课间' },
      { id: 'cp-005', sequence: 4, timeSlot: 'morning', startTime: '10:10', endTime: '10:55', type: 'class', name: '第3节' },
      { id: 'cp-006', sequence: 5, timeSlot: 'morning', startTime: '11:05', endTime: '11:50', type: 'class', name: '第4节' },
      { id: 'cp-007', sequence: 6, timeSlot: 'afternoon', startTime: '11:50', endTime: '14:00', type: 'lunch', name: '午休' },
      { id: 'cp-008', sequence: 7, timeSlot: 'afternoon', startTime: '14:00', endTime: '14:45', type: 'class', name: '第5节' },
      { id: 'cp-009', sequence: 8, timeSlot: 'afternoon', startTime: '14:55', endTime: '15:40', type: 'class', name: '第6节' },
      { id: 'cp-010', sequence: 9, timeSlot: 'afternoon', startTime: '15:50', endTime: '16:35', type: 'class', name: '第7节' },
      { id: 'cp-011', sequence: 10, timeSlot: 'afternoon', startTime: '16:45', endTime: '17:30', type: 'class', name: '第8节' },
      { id: 'cp-012', sequence: 11, timeSlot: 'evening', startTime: '18:30', endTime: '20:00', type: 'evening', name: '晚自习' },
    ],
  },
  {
    classId: 'c2',
    weekPattern: 'all',
    supportsSingleDouble: false,
    periods: [
      { id: 'cp-c2-001', sequence: 0, timeSlot: 'morning', startTime: '07:30', endTime: '08:00', type: 'morning_self', name: '早自习' },
      { id: 'cp-c2-002', sequence: 1, timeSlot: 'morning', startTime: '08:00', endTime: '08:45', type: 'class', name: '第1节' },
      { id: 'cp-c2-003', sequence: 2, timeSlot: 'morning', startTime: '08:55', endTime: '09:40', type: 'class', name: '第2节' },
      { id: 'cp-c2-004', sequence: 3, timeSlot: 'morning', startTime: '09:40', endTime: '10:10', type: 'break_big', name: '大课间' },
      { id: 'cp-c2-005', sequence: 4, timeSlot: 'morning', startTime: '10:10', endTime: '10:55', type: 'class', name: '第3节' },
      { id: 'cp-c2-006', sequence: 5, timeSlot: 'morning', startTime: '11:05', endTime: '11:50', type: 'class', name: '第4节' },
      { id: 'cp-c2-007', sequence: 6, timeSlot: 'afternoon', startTime: '11:50', endTime: '14:00', type: 'lunch', name: '午休' },
      { id: 'cp-c2-008', sequence: 7, timeSlot: 'afternoon', startTime: '14:00', endTime: '14:45', type: 'class', name: '第5节' },
      { id: 'cp-c2-009', sequence: 8, timeSlot: 'afternoon', startTime: '14:55', endTime: '15:40', type: 'class', name: '第6节' },
      { id: 'cp-c2-010', sequence: 9, timeSlot: 'afternoon', startTime: '15:50', endTime: '16:35', type: 'class', name: '第7节' },
      { id: 'cp-c2-011', sequence: 10, timeSlot: 'afternoon', startTime: '16:45', endTime: '17:30', type: 'class', name: '第8节' },
      { id: 'cp-c2-012', sequence: 11, timeSlot: 'evening', startTime: '18:30', endTime: '20:00', type: 'evening', name: '晚自习' },
    ],
  },
  {
    classId: 'c3',
    weekPattern: 'all',
    supportsSingleDouble: false,
    periods: [
      { id: 'cp-c3-001', sequence: 0, timeSlot: 'morning', startTime: '07:30', endTime: '08:00', type: 'morning_self', name: '早自习' },
      { id: 'cp-c3-002', sequence: 1, timeSlot: 'morning', startTime: '08:00', endTime: '08:45', type: 'class', name: '第1节' },
      { id: 'cp-c3-003', sequence: 2, timeSlot: 'morning', startTime: '08:55', endTime: '09:40', type: 'class', name: '第2节' },
      { id: 'cp-c3-004', sequence: 3, timeSlot: 'morning', startTime: '09:40', endTime: '10:10', type: 'break_big', name: '大课间' },
      { id: 'cp-c3-005', sequence: 4, timeSlot: 'morning', startTime: '10:10', endTime: '10:55', type: 'class', name: '第3节' },
      { id: 'cp-c3-006', sequence: 5, timeSlot: 'morning', startTime: '11:05', endTime: '11:50', type: 'class', name: '第4节' },
      { id: 'cp-c3-007', sequence: 6, timeSlot: 'afternoon', startTime: '11:50', endTime: '14:00', type: 'lunch', name: '午休' },
      { id: 'cp-c3-008', sequence: 7, timeSlot: 'afternoon', startTime: '14:00', endTime: '14:45', type: 'class', name: '第5节' },
      { id: 'cp-c3-009', sequence: 8, timeSlot: 'afternoon', startTime: '14:55', endTime: '15:40', type: 'class', name: '第6节' },
      { id: 'cp-c3-010', sequence: 9, timeSlot: 'afternoon', startTime: '15:50', endTime: '16:35', type: 'class', name: '第7节' },
      { id: 'cp-c3-011', sequence: 10, timeSlot: 'afternoon', startTime: '16:45', endTime: '17:30', type: 'class', name: '第8节' },
      { id: 'cp-c3-012', sequence: 11, timeSlot: 'evening', startTime: '18:30', endTime: '20:00', type: 'evening', name: '晚自习' },
    ],
  },
]

// ----- Mock Tasks 数据（基于原有 timetableEntries 升级）-----

function getClassName(classId: string): string {
  return classes.find((c) => c.id === classId)?.name || classId
}

function getFacultyName(facultyId: string): string {
  return faculty.find((f) => f.id === facultyId)?.name || facultyId
}

function getVenueName(venueId: string): string {
  return venues.find((v) => v.id === venueId)?.name || venueId
}

export const tasks: Task[] = [
  // 传统教学任务
  {
    id: 'task-001',
    code: 'T-SE2026A-CS101-001',
    name: '软件工程2026级1班-程序设计基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '程序设计基础',
    courseCode: 'CS101',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'course-001',
    externalPlatformType: 'course',
    resources: [
      { id: 'tr-001', taskId: 'task-001', name: '程序设计基础课件-第1章', type: 'ppt', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-20', sortOrder: 1 },
      { id: 'tr-002', taskId: 'task-001', name: 'Java程序设计基础（教材）', type: 'textbook', textbookId: 'tb1', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-20', sortOrder: 2 },
    ],
    syllabus: '本课程介绍程序设计基础概念，包括变量、控制结构、函数、面向对象基础等。',
    objectives: ['掌握基本编程概念', '能独立完成简单程序设计'],
    progressSummary: {
      plannedHours: 64,
      completedHours: 48,
      completionRate: 75,
      studentAvgCompletion: 85,
      studentCount: 42,
      completedStudentCount: 35,
      dataSource: 'course_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    gradeSummary: {
      taskId: 'task-001',
      classId: 'c1',
      facultyId: 'f1',
      components: [
        { type: 'usual', typeLabel: '平时', weight: 0.3, status: 'published', recordCount: 42, totalStudents: 42 },
        { type: 'final', typeLabel: '期末', weight: 0.7, status: 'pending', recordCount: 0, totalStudents: 42 },
      ],
      overallStatus: 'evaluating',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-002',
    code: 'T-SE2026A-MATH101-001',
    name: '软件工程2026级1班-高等数学',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '高等数学',
    courseCode: 'MATH101',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [
      { id: 'tr-003', taskId: 'task-002', name: '高等数学教学大纲', type: 'document', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-18', sortOrder: 1 },
    ],
    progressSummary: {
      plannedHours: 64,
      completedHours: 48,
      completionRate: 75,
      studentAvgCompletion: 78,
      studentCount: 42,
      completedStudentCount: 32,
      dataSource: 'course_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-003',
    code: 'T-SE2026A-CS102-001',
    name: '软件工程2026级1班-数据结构',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据结构',
    courseCode: 'CS102',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [
      { id: 'tr-004', taskId: 'task-003', name: '数据结构与算法（教材）', type: 'textbook', textbookId: 'tb2', isVisibleToStudents: true, uploadBy: 'f2', uploadedAt: '2026-08-22', sortOrder: 1 },
    ],
    progressSummary: {
      plannedHours: 64,
      completedHours: 40,
      completionRate: 62.5,
      studentAvgCompletion: 72,
      studentCount: 42,
      completedStudentCount: 28,
      dataSource: 'course_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 场景教学任务（含细分安排）
  {
    id: 'task-004',
    code: 'T-SE2026A-CS301-001',
    name: '软件工程2026级1班-软件工程实践',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '软件工程实践',
    courseCode: 'CS301',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    enterpriseMentorId: 'f3',
    enterpriseMentorName: '王志强',
    dayOfWeek: 3,
    period: '5-8节',
    weeks: '5-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    workStationId: 'ws-001',
    workStationName: '网络工程实训工位A区',
    externalPlatformId: 'scene-001',
    externalPlatformType: 'scene',
    resources: [
      { id: 'tr-005', taskId: 'task-004', name: '软件工程实践指导手册', type: 'document', url: '#', isVisibleToStudents: true, uploadBy: 'f3', uploadedAt: '2026-08-25', sortOrder: 1 },
      { id: 'tr-006', taskId: 'task-004', name: '场景平台入口', type: 'scene_link', url: '#', isVisibleToStudents: true, uploadBy: 'f3', uploadedAt: '2026-08-25', sortOrder: 2 },
    ],
    syllabus: '通过项目实战掌握软件工程全生命周期管理。',
    objectives: ['掌握需求分析方法', '能进行系统设计与实现', '掌握软件测试技术'],
    sceneSubTasks: [
      {
        id: 'sst-001',
        taskId: 'task-004',
        name: '场景一：需求分析与原型设计',
        scenePlatformTaskId: 'scene-task-001',
        facultyId: 'f3',
        facultyName: '王志强',
        mentorParticipationType: 'partial',
        mentorTimeSlots: [{ date: '2026-10-08', period: '下午(5-8节)' }, { date: '2026-10-15', period: '下午(5-8节)' }],
        workStationId: 'ws-001',
        workStationName: '网络工程实训工位A区',
        equipmentList: ['白板', '原型设计软件'],
        status: 'completed',
        progress: { completionRate: 92, syncAt: '2026-10-15T08:00:00Z' },
      },
      {
        id: 'sst-002',
        taskId: 'task-004',
        name: '场景二：系统架构设计',
        scenePlatformTaskId: 'scene-task-002',
        facultyId: 'f3',
        facultyName: '王志强',
        mentorParticipationType: 'full',
        mentorTimeSlots: [{ date: '2026-10-22', period: '下午(5-8节)' }, { date: '2026-10-29', period: '下午(5-8节)' }],
        workStationId: 'ws-002',
        workStationName: '网络工程实训工位B区',
        equipmentList: ['架构设计工具', '云服务器'],
        status: 'in_progress',
        progress: { completionRate: 65, syncAt: '2026-10-15T08:00:00Z' },
      },
      {
        id: 'sst-003',
        taskId: 'task-004',
        name: '场景三：编码实现与测试',
        scenePlatformTaskId: 'scene-task-003',
        facultyId: 'f1',
        facultyName: '周建国',
        mentorParticipationType: 'remote',
        mentorTimeSlots: [{ date: '2026-11-05', period: '下午(5-8节)' }],
        workStationId: 'ws-003',
        workStationName: '软件开发实训工位',
        equipmentList: ['IDE环境', '测试工具'],
        status: 'planned',
      },
    ],
    progressSummary: {
      plannedHours: 64,
      completedHours: 32,
      completionRate: 50,
      studentAvgCompletion: 78,
      studentCount: 42,
      completedStudentCount: 30,
      subTaskProgress: [
        { subTaskId: 'sst-001', subTaskName: '场景一：需求分析与原型设计', completionRate: 92 },
        { subTaskId: 'sst-002', subTaskName: '场景二：系统架构设计', completionRate: 65 },
        { subTaskId: 'sst-003', subTaskName: '场景三：编码实现与测试', completionRate: 0 },
      ],
      dataSource: 'scene_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 软件工程2026级1班 补充任务（填满课表）
  {
    id: 'task-013',
    code: 'T-SE2026A-CS201-001',
    name: '软件工程2026级1班-计算机网络',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '计算机网络',
    courseCode: 'CS201',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-014',
    code: 'T-SE2026A-PRAC001-001',
    name: '软件工程2026级1班-企业认知实习',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '企业认知实习',
    courseCode: 'PRAC001',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    period: '7-8节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-005',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-015',
    code: 'T-SE2026A-ENG101-001',
    name: '软件工程2026级1班-大学英语',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '大学英语',
    courseCode: 'ENG101',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f8',
    facultyName: '陈秀英',
    dayOfWeek: 2,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-016',
    code: 'T-SE2026A-PRAC002-001',
    name: '软件工程2026级1班-专业综合实训',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '专业综合实训',
    courseCode: 'PRAC002',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-006',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-017',
    code: 'T-SE2026A-PRAC006-001',
    name: '软件工程2026级1班-开源项目实战',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '开源项目实战',
    courseCode: 'PRAC006',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    period: '7-8节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-007',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-018',
    code: 'T-SE2026A-AI101-001',
    name: '软件工程2026级1班-人工智能导论',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '人工智能导论',
    courseCode: 'AI101',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-019',
    code: 'T-SE2026A-MATH102-001',
    name: '软件工程2026级1班-线性代数',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '线性代数',
    courseCode: 'MATH102',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-020',
    code: 'T-SE2026A-PRAC005-001',
    name: '软件工程2026级1班-创新创业实践',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '创新创业实践',
    courseCode: 'PRAC005',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-008',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-021',
    code: 'T-SE2026A-PRAC009-001',
    name: '软件工程2026级1班-数据挖掘实践',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据挖掘实践',
    courseCode: 'PRAC009',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    period: '7-8节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-009',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-022',
    code: 'T-SE2026A-SE202-001',
    name: '软件工程2026级1班-数据库原理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据库原理',
    courseCode: 'SE202',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 4,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-023',
    code: 'T-SE2026A-SE301-001',
    name: '软件工程2026级1班-Web开发技术',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'Web开发技术',
    courseCode: 'SE301',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f10',
    facultyName: '郑雅琴',
    dayOfWeek: 4,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-024',
    code: 'T-SE2026A-PRAC007-001',
    name: '软件工程2026级1班-软件开发实训',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '软件开发实训',
    courseCode: 'PRAC007',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 4,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-010',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-025',
    code: 'T-SE2026A-PRAC008-001',
    name: '软件工程2026级1班-网络工程实训',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络工程实训',
    courseCode: 'PRAC008',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    period: '7-8节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    externalPlatformId: 'scene-011',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-026',
    code: 'T-SE2026A-CS203-001',
    name: '软件工程2026级1班-操作系统',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '操作系统',
    courseCode: 'CS203',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-027',
    code: 'T-SE2026A-CS301-002',
    name: '软件工程2026级1班-编译原理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '编译原理',
    courseCode: 'CS301',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-028',
    code: 'T-SE2026A-PE101-001',
    name: '软件工程2026级1班-体育与健康',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '体育与健康',
    courseCode: 'PE101',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f10',
    facultyName: '郑雅琴',
    dayOfWeek: 5,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v8',
    venueName: 'A201 大阶梯教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-029',
    code: 'T-SE2026A-POL101-001',
    name: '软件工程2026级1班-思想政治',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '思想政治',
    courseCode: 'POL101',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f8',
    facultyName: '陈秀英',
    dayOfWeek: 5,
    period: '7-8节',
    weeks: '1-16周',
    venueId: 'v2',
    venueName: 'A102 普通教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c2 软件工程2026级2班
  {
    id: 'task-030',
    code: 'T-SE2026B-CS101-001',
    name: '软件工程2026级2班-程序设计基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '程序设计基础',
    courseCode: 'CS101',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-031',
    code: 'T-SE2026B-MATH101-001',
    name: '软件工程2026级2班-高等数学',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '高等数学',
    courseCode: 'MATH101',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-032',
    code: 'T-SE2026B-CS102-001',
    name: '软件工程2026级2班-数据结构',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据结构',
    courseCode: 'CS102',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-033',
    code: 'T-SE2026B-CS301-001',
    name: '软件工程2026级2班-软件工程实践',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '软件工程实践',
    courseCode: 'CS301',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    externalPlatformId: 'scene-012',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-034',
    code: 'T-SE2026B-CS203-001',
    name: '软件工程2026级2班-操作系统',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '操作系统',
    courseCode: 'CS203',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c3 人工智能2026级1班
  {
    id: 'task-035',
    code: 'T-AI2026A-MATH102-001',
    name: '人工智能2026级1班-线性代数',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '线性代数',
    courseCode: 'MATH102',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-036',
    code: 'T-AI2026A-CS102-001',
    name: '人工智能2026级1班-数据结构',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据结构',
    courseCode: 'CS102',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-037',
    code: 'T-AI2026A-AI401-001',
    name: '人工智能2026级1班-人工智能综合实践',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '人工智能综合实践',
    courseCode: 'AI401',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 5,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    externalPlatformId: 'scene-013',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c4 计算机网络2025级1班
  {
    id: 'task-038',
    code: 'T-CN2025A-CN102-001',
    name: '计算机网络2025级1班-网络技术基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络技术基础',
    courseCode: 'CN102',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-039',
    code: 'T-CN2025A-CN201-001',
    name: '计算机网络2025级1班-Linux系统管理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'Linux系统管理',
    courseCode: 'CN201',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 2,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-040',
    code: 'T-CN2025A-CN301-001',
    name: '计算机网络2025级1班-网络安全基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络安全基础',
    courseCode: 'CN301',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c5 机械设计2025级1班
  {
    id: 'task-041',
    code: 'T-MECH2025A-MECH101-001',
    name: '机械设计2025级1班-机械设计基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '机械设计基础',
    courseCode: 'MECH101',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f4',
    facultyName: '李红梅',
    dayOfWeek: 2,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v5',
    venueName: 'C101 机械实训基地',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-042',
    code: 'T-MECH2025A-MECH201-001',
    name: '机械设计2025级1班-数控技术',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数控技术',
    courseCode: 'MECH201',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f4',
    facultyName: '李红梅',
    dayOfWeek: 3,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v5',
    venueName: 'C101 机械实训基地',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-043',
    code: 'T-MECH2025A-CAD101-001',
    name: '机械设计2025级1班-CAD/CAM',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'CAD/CAM',
    courseCode: 'CAD101',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f9',
    facultyName: '孙伟',
    dayOfWeek: 4,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v5',
    venueName: 'C101 机械实训基地',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c6 会计2026级1班
  {
    id: 'task-044',
    code: 'T-ACM2026A-ACM201-001',
    name: '会计2026级1班-财务会计',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '财务会计',
    courseCode: 'ACM201',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f5',
    facultyName: '张大伟',
    dayOfWeek: 1,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-045',
    code: 'T-ACM2026A-ACM301-001',
    name: '会计2026级1班-会计电算化',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '会计电算化',
    courseCode: 'ACM301',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f5',
    facultyName: '张大伟',
    dayOfWeek: 2,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-046',
    code: 'T-ACM2026A-MKT101-001',
    name: '会计2026级1班-市场营销',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '市场营销',
    courseCode: 'MKT101',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f8',
    facultyName: '陈秀英',
    dayOfWeek: 4,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c7 视觉传达2025级1班
  {
    id: 'task-047',
    code: 'T-VD2025A-GRA101-001',
    name: '视觉传达2025级1班-平面设计',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '平面设计',
    courseCode: 'GRA101',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v7',
    venueName: 'D101 设计工作室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-048',
    code: 'T-VD2025A-UI101-001',
    name: '视觉传达2025级1班-UI设计',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'UI设计',
    courseCode: 'UI101',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 3,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v7',
    venueName: 'D101 设计工作室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-049',
    code: 'T-VD2025A-DES101-001',
    name: '视觉传达2025级1班-设计基础',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '设计基础',
    courseCode: 'DES101',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 5,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v7',
    venueName: 'D101 设计工作室',
    externalPlatformId: 'scene-014',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c8 汽车维修2026级1班
  {
    id: 'task-050',
    code: 'T-AUTO2026A-AUTO101-001',
    name: '汽车维修2026级1班-汽车构造',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '汽车构造',
    courseCode: 'AUTO101',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 1,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v6',
    venueName: 'C201 汽车实训车间',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-051',
    code: 'T-AUTO2026A-NEV101-001',
    name: '汽车维修2026级1班-新能源汽车',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '新能源汽车',
    courseCode: 'NEV101',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 2,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v6',
    venueName: 'C201 汽车实训车间',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-052',
    code: 'T-AUTO2026A-REPAIR101-001',
    name: '汽车维修2026级1班-汽车维修',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '汽车维修',
    courseCode: 'REPAIR101',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 3,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v6',
    venueName: 'C201 汽车实训车间',
    externalPlatformId: 'scene-015',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c9 计算机网络技术2026级1班
  {
    id: 'task-053',
    code: 'T-CN2026A-CN101-001',
    name: '计算机网络技术2026级1班-计算机基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '计算机基础',
    courseCode: 'CN101',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-054',
    code: 'T-CN2026A-CN102-001',
    name: '计算机网络技术2026级1班-网络技术基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络技术基础',
    courseCode: 'CN102',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 2,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-055',
    code: 'T-CN2026A-CN201-001',
    name: '计算机网络技术2026级1班-Linux系统管理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'Linux系统管理',
    courseCode: 'CN201',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-056',
    code: 'T-CN2026A-PRAC008-001',
    name: '计算机网络技术2026级1班-网络工程实训',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络工程实训',
    courseCode: 'PRAC008',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 5,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    externalPlatformId: 'scene-016',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c10 计算机科学与技术2026级1班
  {
    id: 'task-057',
    code: 'T-CS2026A-CS101-001',
    name: '计算机科学与技术2026级1班-程序设计基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '程序设计基础',
    courseCode: 'CS101',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-058',
    code: 'T-CS2026A-CS103-001',
    name: '计算机科学与技术2026级1班-离散数学',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '离散数学',
    courseCode: 'CS103',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-059',
    code: 'T-CS2026A-CS203-001',
    name: '计算机科学与技术2026级1班-操作系统',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '操作系统',
    courseCode: 'CS203',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 4,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-060',
    code: 'T-CS2026A-CS301-001',
    name: '计算机科学与技术2026级1班-编译原理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '编译原理',
    courseCode: 'CS301',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c11 数据科学2026级1班
  {
    id: 'task-061',
    code: 'T-DS2026A-DS101-001',
    name: '数据科学2026级1班-Python程序设计',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'Python程序设计',
    courseCode: 'DS101',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 1,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-062',
    code: 'T-DS2026A-MATH103-001',
    name: '数据科学2026级1班-概率论与数理统计',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '概率论与数理统计',
    courseCode: 'MATH103',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-063',
    code: 'T-DS2026A-DS201-001',
    name: '数据科学2026级1班-数据库原理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据库原理',
    courseCode: 'DS201',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-064',
    code: 'T-DS2026A-DS301-001',
    name: '数据科学2026级1班-大数据技术原理',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '大数据技术原理',
    courseCode: 'DS301',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 4,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // c12 物联网工程2026级1班
  {
    id: 'task-065',
    code: 'T-IOT2026A-CS101-001',
    name: '物联网工程2026级1班-程序设计基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '程序设计基础',
    courseCode: 'CS101',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    period: '5-6节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-066',
    code: 'T-IOT2026A-IOT101-001',
    name: '物联网工程2026级1班-电路与电子技术',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '电路与电子技术',
    courseCode: 'IOT101',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-067',
    code: 'T-IOT2026A-IOT201-001',
    name: '物联网工程2026级1班-传感器技术',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '传感器技术',
    courseCode: 'IOT201',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-068',
    code: 'T-IOT2026A-IOT401-001',
    name: '物联网工程2026级1班-物联网综合实践',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '物联网综合实践',
    courseCode: 'IOT401',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 5,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    externalPlatformId: 'scene-017',
    externalPlatformType: 'scene',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 更多传统教学任务
  {
    id: 'task-005',
    code: 'T-AI2026A-AI102-001',
    name: '人工智能2026级1班-Python程序设计',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: 'Python程序设计',
    courseCode: 'AI102',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    progressSummary: {
      plannedHours: 64,
      completedHours: 50,
      completionRate: 78,
      studentAvgCompletion: 88,
      studentCount: 38,
      completedStudentCount: 33,
      dataSource: 'course_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  {
    id: 'task-006',
    code: 'T-AI2026A-AI201-001',
    name: '人工智能2026级1班-机器学习',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '机器学习',
    courseCode: 'AI201',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 4,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 场景教学任务：机械设计基础
  {
    id: 'task-007',
    code: 'T-MECH2025A-MECH101-001',
    name: '机械设计2025级1班-机械设计基础',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '机械设计基础',
    courseCode: 'MECH101',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f4',
    facultyName: '李红梅',
    dayOfWeek: 1,
    period: '5-8节',
    weeks: '1-14周',
    venueId: 'v5',
    venueName: 'C101 机械实训基地',
    workStationId: 'ws-004',
    workStationName: '数控实训工位',
    externalPlatformId: 'scene-002',
    externalPlatformType: 'scene',
    resources: [
      { id: 'tr-007', taskId: 'task-007', name: '机械设计基础（教材）', type: 'textbook', textbookId: 'tb4', isVisibleToStudents: true, uploadBy: 'f4', uploadedAt: '2026-08-20', sortOrder: 1 },
    ],
    sceneSubTasks: [
      {
        id: 'sst-004',
        taskId: 'task-007',
        name: '场景一：零件三维建模',
        scenePlatformTaskId: 'scene-task-004',
        facultyId: 'f4',
        facultyName: '李红梅',
        mentorParticipationType: 'partial',
        mentorTimeSlots: [{ date: '2026-09-15', period: '下午(5-8节)' }],
        workStationId: 'ws-004',
        workStationName: '数控实训工位',
        equipmentList: ['CAD软件', '3D打印机'],
        status: 'completed',
        progress: { completionRate: 88, syncAt: '2026-10-15T08:00:00Z' },
      },
      {
        id: 'sst-005',
        taskId: 'task-007',
        name: '场景二：装配体设计与仿真',
        scenePlatformTaskId: 'scene-task-005',
        facultyId: 'f4',
        facultyName: '李红梅',
        mentorParticipationType: 'full',
        mentorTimeSlots: [{ date: '2026-10-06', period: '下午(5-8节)' }, { date: '2026-10-13', period: '下午(5-8节)' }],
        workStationId: 'ws-005',
        workStationName: '仿真实训工位',
        equipmentList: ['仿真软件', '测量仪器'],
        status: 'in_progress',
        progress: { completionRate: 72, syncAt: '2026-10-15T08:00:00Z' },
      },
    ],
    progressSummary: {
      plannedHours: 56,
      completedHours: 42,
      completionRate: 75,
      studentAvgCompletion: 80,
      studentCount: 36,
      completedStudentCount: 28,
      subTaskProgress: [
        { subTaskId: 'sst-004', subTaskName: '场景一：零件三维建模', completionRate: 88 },
        { subTaskId: 'sst-005', subTaskName: '场景二：装配体设计与仿真', completionRate: 72 },
      ],
      dataSource: 'scene_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 传统教学：会计学基础
  {
    id: 'task-008',
    code: 'T-ACM2026A-ACM101-001',
    name: '会计2026级1班-会计学基础',
    type: 'traditional',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '会计学基础',
    courseCode: 'ACM101',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f5',
    facultyName: '张大伟',
    dayOfWeek: 3,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [
      { id: 'tr-008', taskId: 'task-008', name: '会计学原理（教材）', type: 'textbook', textbookId: 'tb5', isVisibleToStudents: true, uploadBy: 'f5', uploadedAt: '2026-08-20', sortOrder: 1 },
    ],
    progressSummary: {
      plannedHours: 64,
      completedHours: 52,
      completionRate: 81,
      studentAvgCompletion: 90,
      studentCount: 50,
      completedStudentCount: 45,
      dataSource: 'course_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 场景教学：设计基础
  {
    id: 'task-009',
    code: 'T-VD2025A-DES101-001',
    name: '视觉传达2025级1班-设计基础',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '设计基础',
    courseCode: 'DES101',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 2,
    period: '5-8节',
    weeks: '1-16周',
    venueId: 'v7',
    venueName: 'D101 设计工作室',
    workStationId: 'ws-006',
    workStationName: '设计工位A区',
    externalPlatformId: 'scene-003',
    externalPlatformType: 'scene',
    resources: [
      { id: 'tr-009', taskId: 'task-009', name: '设计心理学（教材）', type: 'textbook', textbookId: 'tb7', isVisibleToStudents: true, uploadBy: 'f6', uploadedAt: '2026-08-20', sortOrder: 1 },
    ],
    sceneSubTasks: [
      {
        id: 'sst-006',
        taskId: 'task-009',
        name: '场景一：用户研究与需求洞察',
        scenePlatformTaskId: 'scene-task-006',
        facultyId: 'f6',
        facultyName: '赵丽华',
        mentorParticipationType: 'partial',
        mentorTimeSlots: [{ date: '2026-09-20', period: '下午(5-8节)' }],
        workStationId: 'ws-006',
        workStationName: '设计工位A区',
        equipmentList: ['iMac', '绘图板'],
        status: 'completed',
        progress: { completionRate: 85, syncAt: '2026-10-15T08:00:00Z' },
      },
    ],
    progressSummary: {
      plannedHours: 64,
      completedHours: 45,
      completionRate: 70,
      studentAvgCompletion: 82,
      studentCount: 30,
      completedStudentCount: 24,
      subTaskProgress: [
        { subTaskId: 'sst-006', subTaskName: '场景一：用户研究与需求洞察', completionRate: 85 },
      ],
      dataSource: 'scene_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // 场景教学：汽车构造
  {
    id: 'task-010',
    code: 'T-AUTO2026A-AUTO101-001',
    name: '汽车维修2026级1班-汽车构造',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '汽车构造',
    courseCode: 'AUTO101',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 4,
    period: '5-8节',
    weeks: '1-14周',
    venueId: 'v6',
    venueName: 'C201 汽车实训车间',
    workStationId: 'ws-007',
    workStationName: '汽车维修实训工位',
    externalPlatformId: 'scene-004',
    externalPlatformType: 'scene',
    resources: [
      { id: 'tr-010', taskId: 'task-010', name: '汽车构造（教材）', type: 'textbook', textbookId: 'tb8', isVisibleToStudents: true, uploadBy: 'f7', uploadedAt: '2026-08-20', sortOrder: 1 },
    ],
    sceneSubTasks: [
      {
        id: 'sst-007',
        taskId: 'task-010',
        name: '场景一：发动机拆解与检测',
        scenePlatformTaskId: 'scene-task-007',
        facultyId: 'f7',
        facultyName: '刘建国',
        mentorParticipationType: 'full',
        mentorTimeSlots: [{ date: '2026-09-25', period: '下午(5-8节)' }, { date: '2026-10-09', period: '下午(5-8节)' }],
        workStationId: 'ws-007',
        workStationName: '汽车维修实训工位',
        equipmentList: ['举升机', '诊断仪', '发动机总成'],
        status: 'in_progress',
        progress: { completionRate: 68, syncAt: '2026-10-15T08:00:00Z' },
      },
    ],
    progressSummary: {
      plannedHours: 56,
      completedHours: 35,
      completionRate: 62.5,
      studentAvgCompletion: 75,
      studentCount: 35,
      completedStudentCount: 22,
      subTaskProgress: [
        { subTaskId: 'sst-007', subTaskName: '场景一：发动机拆解与检测', completionRate: 68 },
      ],
      dataSource: 'scene_platform',
      lastSyncAt: '2026-10-15T08:00:00Z',
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
  },
  // draft 状态任务（待处理）
  {
    id: 'task-011',
    code: 'T-SE2026B-CS101-001',
    name: '软件工程2026级2班-程序设计基础',
    type: 'traditional',
    source: 'imported',
    status: 'draft',
    termId: 't1',
    courseName: '程序设计基础',
    courseCode: 'CS101',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 3,
    period: '1-2节',
    weeks: '1-16周',
    venueId: 'v3',
    venueName: 'B201 计算机机房',
    resources: [],
    createdAt: '2026-10-10',
    updatedAt: '2026-10-10',
  },
  // ready 状态任务（待发布）
  {
    id: 'task-012',
    code: 'T-CN2025A-CS201-001',
    name: '计算机网络2025级1班-计算机网络',
    type: 'traditional',
    source: 'imported',
    status: 'ready',
    termId: 't1',
    courseName: '计算机网络',
    courseCode: 'CS201',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    period: '3-4节',
    weeks: '1-16周',
    venueId: 'v4',
    venueName: 'B301 网络实验室',
    resources: [
      { id: 'tr-011', taskId: 'task-012', name: '计算机网络原理（教材）', type: 'textbook', textbookId: 'tb3', isVisibleToStudents: true, uploadBy: 'f3', uploadedAt: '2026-10-12', sortOrder: 1 },
    ],
    createdAt: '2026-10-10',
    updatedAt: '2026-10-12',
  },
]

// ----- Mock 任务变更日志 -----

export const taskChangeLogs: TaskChangeLog[] = [
  {
    id: 'tcl-001',
    taskId: 'task-001',
    changeType: 'time',
    oldValue: { dayOfWeek: 1, period: '1-2节' },
    newValue: { dayOfWeek: 3, period: '1-2节' },
    reason: '教师参加学术会议',
    applicant: '周建国',
    approver: '教务处',
    status: 'approved',
    createdAt: '2026-09-10',
    approvedAt: '2026-09-11',
  },
  {
    id: 'tcl-002',
    taskId: 'task-007',
    changeType: 'time',
    oldValue: { dayOfWeek: 1, period: '5-8节' },
    newValue: { dayOfWeek: 2, period: '5-8节' },
    reason: '实训设备维护',
    applicant: '李红梅',
    approver: '院系管理员',
    status: 'pending',
    createdAt: '2026-09-15',
  },
  {
    id: 'tcl-003',
    taskId: 'task-005',
    changeType: 'cancel',
    oldValue: { status: 'published' },
    newValue: { status: 'cancelled' },
    reason: '国庆节放假调休',
    applicant: '吴晓敏',
    approver: '教务处',
    status: 'approved',
    createdAt: '2026-09-20',
    approvedAt: '2026-09-20',
  },
]

// ----- 生成 StudentTaskView 的辅助函数 -----

export function getStudentTaskView(task: Task, studentId: string): StudentTaskView {
  const studentGrades = gradeRecords.filter(
    (g) => g.studentId === studentId && g.courseName === task.courseName && g.termId === task.termId
  )
  return {
    taskId: task.id,
    taskName: task.name,
    courseName: task.courseName,
    type: task.type,
    status: task.status === 'published' || task.status === 'in_progress' || task.status === 'evaluating' || task.status === 'completed' ? task.status : 'published',
    dayOfWeek: task.dayOfWeek,
    period: task.period,
    weeks: task.weeks,
    venueName: task.venueName,
    facultyName: task.facultyName,
    enterpriseMentorName: task.enterpriseMentorName,
    resources: task.resources
      .filter((r) => r.isVisibleToStudents)
      .map((r) => ({ name: r.name, type: r.type, url: r.url })),
    myProgress: task.progressSummary
      ? { completionRate: task.progressSummary.studentAvgCompletion, lastAccessAt: task.progressSummary.lastSyncAt }
      : undefined,
    myGrades: studentGrades.map((g) => ({
      component: g.gradeType,
      score: g.recognizedScore,
      status: g.status === '已发布' ? 'published' : 'pending',
    })),
  }
}


// ----- 课程库 / 实践场景库（用于排课中心搜索绑定）-----

export interface CurriculumItem {
  id: string
  name: string
  code: string
  hours: number
  nature: string
  assessment: string
  version: string
  batch: string
  creator: string
  updatedAt: string
}

// 课程搜索库
export const curriculumCoursePool: CurriculumItem[] = [
  { id: 'cc-001', name: '程序设计基础', code: 'CS101', hours: 64, nature: '必修', assessment: '考试', version: 'v2.1', batch: '2026春', creator: '张教授', updatedAt: '2026-03-15' },
  { id: 'cc-002', name: '高等数学', code: 'MATH101', hours: 64, nature: '必修', assessment: '考试', version: 'v1.8', batch: '2026春', creator: '李教授', updatedAt: '2026-02-20' },
  { id: 'cc-003', name: '线性代数', code: 'MATH102', hours: 48, nature: '必修', assessment: '考试', version: 'v1.5', batch: '2026春', creator: '王讲师', updatedAt: '2026-03-01' },
  { id: 'cc-004', name: '概率论与数理统计', code: 'MATH103', hours: 48, nature: '必修', assessment: '考试', version: 'v2.0', batch: '2026秋', creator: '李教授', updatedAt: '2026-08-10' },
  { id: 'cc-005', name: '大学物理', code: 'PHY101', hours: 64, nature: '必修', assessment: '考试', version: 'v1.3', batch: '2026春', creator: '赵教授', updatedAt: '2026-01-18' },
  { id: 'cc-006', name: '大学英语', code: 'ENG101', hours: 64, nature: '必修', assessment: '考试', version: 'v3.0', batch: '2026春', creator: '刘老师', updatedAt: '2026-03-05' },
  { id: 'cc-007', name: '体育与健康', code: 'PE101', hours: 32, nature: '必修', assessment: '考查', version: 'v1.0', batch: '2026春', creator: '陈老师', updatedAt: '2026-02-01' },
  { id: 'cc-008', name: '思想政治', code: 'POL101', hours: 32, nature: '必修', assessment: '考查', version: 'v2.2', batch: '2026春', creator: '孙教授', updatedAt: '2026-03-12' },
  { id: 'cc-009', name: '数据结构', code: 'CS102', hours: 64, nature: '必修', assessment: '考试', version: 'v2.5', batch: '2026秋', creator: '张教授', updatedAt: '2026-08-20' },
  { id: 'cc-010', name: '计算机网络', code: 'CS201', hours: 48, nature: '必修', assessment: '考试', version: 'v1.9', batch: '2026秋', creator: '周副教授', updatedAt: '2026-09-01' },
  { id: 'cc-011', name: '操作系统', code: 'CS202', hours: 64, nature: '必修', assessment: '考试', version: 'v2.0', batch: '2027春', creator: '吴教授', updatedAt: '2027-01-15' },
  { id: 'cc-012', name: '数据库原理', code: 'CS203', hours: 48, nature: '必修', assessment: '考试', version: 'v1.7', batch: '2026秋', creator: '郑讲师', updatedAt: '2026-08-25' },
  { id: 'cc-013', name: '软件工程', code: 'CS301', hours: 48, nature: '必修', assessment: '考试', version: 'v3.1', batch: '2027秋', creator: '钱教授', updatedAt: '2027-09-10' },
  { id: 'cc-014', name: '人工智能导论', code: 'AI101', hours: 48, nature: '选修', assessment: '考查', version: 'v1.2', batch: '2027春', creator: '冯副教授', updatedAt: '2027-03-08' },
  { id: 'cc-015', name: '机器学习', code: 'AI201', hours: 64, nature: '选修', assessment: '考试', version: 'v2.3', batch: '2027秋', creator: '冯副教授', updatedAt: '2027-08-30' },
  { id: 'cc-016', name: '前端开发技术', code: 'WEB101', hours: 48, nature: '选修', assessment: '考查', version: 'v1.5', batch: '2026秋', creator: '杨讲师', updatedAt: '2026-09-05' },
  { id: 'cc-017', name: '云计算技术', code: 'CLOUD101', hours: 48, nature: '选修', assessment: '考查', version: 'v1.1', batch: '2027春', creator: '朱教授', updatedAt: '2027-02-18' },
  { id: 'cc-018', name: '网络安全', code: 'SEC101', hours: 48, nature: '选修', assessment: '考试', version: 'v2.0', batch: '2027秋', creator: '秦副教授', updatedAt: '2027-08-22' },
]

// 实践场景搜索库
export const curriculumPracticePool: CurriculumItem[] = [
  { id: 'cp-001', name: '企业认知实习', code: 'PRAC001', hours: 32, nature: '实践', assessment: '报告', version: 'v1.0', batch: '2026春', creator: '周老师', updatedAt: '2026-03-01' },
  { id: 'cp-002', name: '专业综合实训', code: 'PRAC002', hours: 64, nature: '实践', assessment: '作品', version: 'v2.0', batch: '2026秋', creator: '吴老师', updatedAt: '2026-08-15' },
  { id: 'cp-003', name: '企业顶岗实习', code: 'PRAC003', hours: 128, nature: '实践', assessment: '鉴定', version: 'v1.5', batch: '2027春', creator: '郑老师', updatedAt: '2027-01-20' },
  { id: 'cp-004', name: '毕业设计（论文）', code: 'PRAC004', hours: 192, nature: '实践', assessment: '答辩', version: 'v3.0', batch: '2028秋', creator: '王老师', updatedAt: '2028-09-01' },
  { id: 'cp-005', name: '创新创业实践', code: 'PRAC005', hours: 64, nature: '实践', assessment: '作品', version: 'v1.2', batch: '2027春', creator: '李老师', updatedAt: '2027-03-10' },
  { id: 'cp-006', name: '开源项目实战', code: 'PRAC006', hours: 64, nature: '实践', assessment: '作品', version: 'v1.0', batch: '2027秋', creator: '陈老师', updatedAt: '2027-08-25' },
  { id: 'cp-007', name: '软件开发实训', code: 'PRAC007', hours: 96, nature: '实践', assessment: '作品', version: 'v2.1', batch: '2026秋', creator: '赵老师', updatedAt: '2026-09-12' },
  { id: 'cp-008', name: '网络工程实训', code: 'PRAC008', hours: 64, nature: '实践', assessment: '作品', version: 'v1.3', batch: '2027春', creator: '孙老师', updatedAt: '2027-02-28' },
  { id: 'cp-009', name: '数据挖掘实践', code: 'PRAC009', hours: 64, nature: '实践', assessment: '报告', version: 'v1.1', batch: '2027秋', creator: '钱老师', updatedAt: '2027-08-18' },
  { id: 'cp-010', name: '智能系统开发', code: 'PRAC010', hours: 96, nature: '实践', assessment: '答辩', version: 'v2.0', batch: '2028春', creator: '马老师', updatedAt: '2028-01-15' },
]

// 已绑定的实践场景（初始为空）
export const boundPractices: CurriculumItem[] = []
