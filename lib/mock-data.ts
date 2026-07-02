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
  description?: string
}

export const departments: Department[] = [
  { id: 'd1', code: 'CS', name: '计算机科学与技术学院', type: '工科', leader: '张教授', status: 'active', description: '培养计算机科学与技术、软件工程、人工智能等领域的高级专业人才' },
  { id: 'd2', code: 'ME', name: '机械工程学院', type: '工科', leader: '李教授', status: 'active', description: '专注于机械设计、制造及自动化领域的人才培养与科学研究' },
  { id: 'd3', code: 'BM', name: '商学院', type: '商科', leader: '王教授', status: 'active', description: '涵盖会计、市场营销、工商管理等专业，培养现代商业管理人才' },
  { id: 'd4', code: 'DES', name: '艺术设计学院', type: '艺术', leader: '赵教授', status: 'active', description: '致力于视觉传达、环境设计、数字媒体艺术等创意设计人才培养' },
  { id: 'd5', code: 'AUTO', name: '汽车工程学院', type: '工科', leader: '刘教授', status: 'active', description: '聚焦汽车检测与维修、新能源汽车技术等应用型人才培养' },
  { id: 'd6', code: 'FL', name: '外国语学院', type: '文科', leader: '陈教授', status: 'active', description: '提供英语、日语等外语专业教育，培养国际化语言应用人才' },
  { id: 'd7', code: 'CE', name: '土木工程学院', type: '工科', leader: '周教授', status: 'active', description: '从事土木工程、建筑信息模型技术等专业的教学与科研工作' },
  { id: 'd8', code: 'MED', name: '医学院', type: '医科', leader: '吴教授', status: 'active', description: '培养护理学、药学等医学相关专业的高素质应用型人才' },
  { id: 'd9', code: 'MUS', name: '音乐学院', type: '艺术', leader: '郑教授', status: 'active', description: '专注于音乐表演、音乐教育等艺术类专业人才培养' },
  { id: 'd10', code: 'PE', name: '体育学院', type: '体育', leader: '孙教授', status: 'active', description: '致力于体育教育、运动训练等专业人才的培养与发展' },
]

export interface Major {
  id: string
  code: string
  name: string
  departmentId: string
  level: '中专' | '高职高专' | '本科'
  duration: number
  status: 'active' | 'inactive'
}

export const majors: Major[] = [
  { id: 'm1', code: 'SE', name: '软件工程', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm2', code: 'AI', name: '人工智能', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm3', code: 'CN', name: '计算机网络技术', departmentId: 'd1', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm4', code: 'MECH', name: '机械设计与制造', departmentId: 'd2', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm5', code: 'ACM', name: '会计', departmentId: 'd3', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm6', code: 'MK', name: '市场营销', departmentId: 'd3', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm7', code: 'VD', name: '视觉传达设计', departmentId: 'd4', level: '本科', duration: 4, status: 'active' },
  { id: 'm8', code: 'AUTO-R', name: '汽车检测与维修', departmentId: 'd5', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm9', code: 'CS', name: '计算机科学与技术', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm10', code: 'DS', name: '数据科学与大数据技术', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm11', code: 'IS', name: '信息安全', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm12', code: 'IOT', name: '物联网工程', departmentId: 'd1', level: '本科', duration: 4, status: 'active' },
  { id: 'm13', code: 'CE', name: '云计算技术应用', departmentId: 'd1', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm14', code: 'EN', name: '英语', departmentId: 'd6', level: '本科', duration: 4, status: 'active' },
  { id: 'm15', code: 'JP', name: '日语', departmentId: 'd6', level: '本科', duration: 4, status: 'active' },
  { id: 'm16', code: 'CIV', name: '土木工程', departmentId: 'd7', level: '本科', duration: 4, status: 'active' },
  { id: 'm17', code: 'BIM', name: '建筑信息模型技术', departmentId: 'd7', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm18', code: 'NUR', name: '护理学', departmentId: 'd8', level: '本科', duration: 4, status: 'active' },
  { id: 'm19', code: 'PHA', name: '药学', departmentId: 'd8', level: '高职高专', duration: 3, status: 'active' },
  { id: 'm20', code: 'MU-P', name: '音乐表演', departmentId: 'd9', level: '本科', duration: 4, status: 'active' },
  { id: 'm21', code: 'PE-E', name: '体育教育', departmentId: 'd10', level: '本科', duration: 4, status: 'active' },
]

export interface Class {
  id: string
  code: string
  name: string
  majorId: string
  gradeId: string
  headTeacher: string
  studentCount: number
  type: '行政班' | '教学班（如订单班）'
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
  { id: 'g2029', name: '2029级', entryYear: 2029, status: '在校' },
  { id: 'g2028', name: '2028级', entryYear: 2028, status: '在校' },
  { id: 'g2027', name: '2027级', entryYear: 2027, status: '在校' },
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
  password: string
  status: '在职' | '离职' | '外聘'
  roles?: string[]
  positions?: string[]
}

export const facultyRoles = ['系统管理员', '教学秘书', '教师', '企业导师', '质量管理员']

export const faculty: Faculty[] = [
  { id: 'f1', employeeId: 'T2021001', name: '周建国', password: '123456', status: '在职', roles: ['系统管理员', '教师'], positions: ['系主任', '教授'] },
  { id: 'f2', employeeId: 'T2021002', name: '吴晓敏', password: '123456', status: '在职', roles: ['教学秘书', '教师'], positions: ['副教授'] },
  { id: 'f3', employeeId: 'T2021003', name: '王志强', password: '123456', status: '在职', roles: ['教师'], positions: ['企业导师', '讲师'] },
  { id: 'f4', employeeId: 'T2021004', name: '李红梅', password: '123456', status: '在职', positions: ['讲师'] },
  { id: 'f5', employeeId: 'T2021005', name: '张大伟', password: '123456', status: '在职', positions: ['教授'] },
  { id: 'f6', employeeId: 'T2021006', name: '赵丽华', password: '123456', status: '在职', positions: ['副教授'] },
  { id: 'f7', employeeId: 'T2021007', name: '刘建国', password: '123456', status: '在职', positions: ['企业导师', '研究员'] },
  { id: 'f8', employeeId: 'T2021008', name: '陈秀英', password: '123456', status: '在职', positions: ['讲师'] },
  { id: 'f9', employeeId: 'T2021009', name: '孙伟', password: '123456', status: '在职', positions: ['教研室主任'] },
  { id: 'f10', employeeId: 'T2021010', name: '郑雅琴', password: '123456', status: '在职', positions: ['助教'] },
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
  departmentId: string
  majorId: string
  classId: string
  status: StudentStatus
  abilityPortfolio?: AbilityPortfolio
  abilityRecognition?: {
    totalSkills: number
    certifiedSkills: number
    competencyLevel: '初级' | '中级' | '高级'
    lastAssessment: string
    status: '待审核' | '已认定' | '已驳回'
  }
}

export const students: Student[] = [
  { id: 's1', studentId: '2026010101', name: '李明', departmentId: 'd1', majorId: 'm1', classId: 'c1', status: '在籍',
    abilityPortfolio: {
      certificates: [{ name: '全国计算机等级考试二级', issuer: '教育部考试中心', date: '2026-03', status: '有效' }],
      competitions: [{ name: '蓝桥杯程序设计大赛', level: '省级', award: '二等奖', date: '2026-04' }],
      internships: [{ company: '字节跳动', position: '后端开发实习生', duration: '2026.07-2026.09', evaluation: '优秀' }],
      activities: [{ name: 'ACM程序设计社团', type: '社团活动', date: '2026-09' }],
      skillBadges: [{ name: 'Python编程', level: '中级', issuer: '能力测评平台', date: '2026-05' }],
    },
    abilityRecognition: { totalSkills: 8, certifiedSkills: 3, competencyLevel: '中级', lastAssessment: '2026-06-15', status: '已认定' },
  },
  { id: 's2', studentId: '2026010102', name: '王芳', departmentId: 'd1', majorId: 'm1', classId: 'c1', status: '在籍',
    abilityPortfolio: {
      certificates: [{ name: '大学英语六级', issuer: '教育部考试中心', date: '2026-06', status: '有效' }],
      competitions: [],
      internships: [],
      activities: [{ name: '学生会科技部', type: '学生工作', date: '2026-09' }],
      skillBadges: [{ name: '数据分析', level: '初级', issuer: '能力测评平台', date: '2026-05' }],
    },
    abilityRecognition: { totalSkills: 6, certifiedSkills: 2, competencyLevel: '初级', lastAssessment: '2026-06-15', status: '待审核' },
  },
  { id: 's3', studentId: '2026010103', name: '张伟', departmentId: 'd1', majorId: 'm1', classId: 'c1', status: '在籍' },
  { id: 's4', studentId: '2026010201', name: '刘洋', departmentId: 'd1', majorId: 'm2', classId: 'c3', status: '在籍' },
  { id: 's5', studentId: '2025010301', name: '陈静', departmentId: 'd1', majorId: 'm3', classId: 'c4', status: '在籍' },
  { id: 's6', studentId: '2025010401', name: '杨强', departmentId: 'd2', majorId: 'm4', classId: 'c5', status: '在籍' },
  { id: 's7', studentId: '2026010501', name: '黄丽', departmentId: 'd3', majorId: 'm5', classId: 'c6', status: '在籍',
    abilityPortfolio: {
      certificates: [{ name: '初级会计职称', issuer: '财政部', date: '2026-05', status: '有效' }],
      competitions: [{ name: '全国大学生会计技能大赛', level: '国家级', award: '三等奖', date: '2026-06' }],
      internships: [{ company: '用友集团', position: '财务实习生', duration: '2026.07-2026.09', evaluation: '良好' }],
      activities: [],
      skillBadges: [{ name: '会计信息化', level: '中级', issuer: '能力测评平台', date: '2026-05' }],
    },
    abilityRecognition: { totalSkills: 10, certifiedSkills: 4, competencyLevel: '中级', lastAssessment: '2026-06-15', status: '已认定' },
  },
  { id: 's8', studentId: '2026010502', name: '赵军', departmentId: 'd3', majorId: 'm6', classId: 'c6', status: '在籍' },
  { id: 's9', studentId: '2025010701', name: '周敏', departmentId: 'd4', majorId: 'm7', classId: 'c7', status: '在籍' },
  { id: 's10', studentId: '2026010801', name: '吴磊', departmentId: 'd5', majorId: 'm8', classId: 'c8', status: '在籍' },
  { id: 's11', studentId: '2023010101', name: '郑涛', departmentId: 'd1', majorId: 'm1', classId: 'c1', status: '毕业',
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
    abilityRecognition: { totalSkills: 15, certifiedSkills: 8, competencyLevel: '高级', lastAssessment: '2026-06-01', status: '已认定' },
  },
  { id: 's12', studentId: '2024010101', name: '孙雪', departmentId: 'd1', majorId: 'm1', classId: 'c2', status: '在籍' },
  { id: 's13', studentId: '2026010104', name: '钱多多', departmentId: 'd1', majorId: 'm1', classId: 'c2', status: '在籍' },
  { id: 's14', studentId: '2025010302', name: '林晓', departmentId: 'd1', majorId: 'm3', classId: 'c4', status: '休学' },
  { id: 's15', studentId: '2024010201', name: '徐凯', departmentId: 'd1', majorId: 'm2', classId: 'c3', status: '在籍' },
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
  code: string
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

export const venueTypes = ['教室', '实验室', '实训基地', '机房', '多媒体教室', '其他']

export const venues: Venue[] = [
  { id: 'v1', code: 'V001', name: 'A101 多媒体教室', type: '多媒体教室', capacity: 60, location: 'A栋1层', facilities: '投影仪、音响、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 3, iotSensors: ['温湿度', ' occupancy'] } },
  { id: 'v2', code: 'V002', name: 'A102 普通教室', type: '教室', capacity: 50, location: 'A栋1层', facilities: '黑板、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 1, iotSensors: ['温湿度'] } },
  { id: 'v3', code: 'V003', name: 'B201 计算机机房', type: '机房', capacity: 80, location: 'B栋2层', facilities: '电脑80台、投影仪、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', smartDeviceCount: 85, iotSensors: ['温湿度', '能耗监测', ' occupancy'] } },
  { id: 'v4', code: 'V004', name: 'B301 网络实验室', type: '实验室', capacity: 40, location: 'B栋3层', facilities: '网络设备、防火墙、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', smartDeviceCount: 20, iotSensors: ['温湿度', '能耗监测'] } },
  { id: 'v5', code: 'V005', name: 'C101 机械实训基地', type: '实训基地', capacity: 30, location: 'C栋1层', facilities: '数控机床、3D打印机、吊车', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', bookingSystemUrl: '#', smartDeviceCount: 15, iotSensors: ['温湿度', '能耗监测', '设备状态'] } },
  { id: 'v6', code: 'V006', name: 'C201 汽车实训车间', type: '实训基地', capacity: 25, location: 'C栋2层', facilities: '举升机、诊断仪、新能源实训台', status: 'available',
    digitalInfo: { floorPlanUrl: '#', model3dUrl: '#', bookingSystemUrl: '#', smartDeviceCount: 12, iotSensors: ['温湿度', '能耗监测', '设备状态', '安全监控'] } },
  { id: 'v7', code: 'V007', name: 'D101 设计工作室', type: '实验室', capacity: 35, location: 'D栋1层', facilities: 'iMac、绘图板、打印机', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 35, iotSensors: ['温湿度', ' occupancy'] } },
  { id: 'v8', code: 'V008', name: 'A201 大阶梯教室', type: '教室', capacity: 120, location: 'A栋2层', facilities: '投影仪、音响、空调', status: 'available',
    digitalInfo: { floorPlanUrl: '#', smartDeviceCount: 5, iotSensors: ['温湿度', ' occupancy'] } },
]

// ----- 4.5 岗位公共库 -----

export interface Position {
  id: string
  code: string
  name: string
  industry: string
}

export const positions: Position[] = [
  { id: 'pos-001', code: 'J001', name: '软件开发工程师', industry: '计算机软件' },
  { id: 'pos-002', code: 'J002', name: '前端开发工程师', industry: '互联网' },
  { id: 'pos-003', code: 'J003', name: '后端开发工程师', industry: '互联网' },
  { id: 'pos-004', code: 'J004', name: '测试工程师', industry: '计算机软件' },
  { id: 'pos-005', code: 'J005', name: '运维工程师', industry: '互联网' },
  { id: 'pos-006', code: 'J006', name: '网络运维工程师', industry: '通信/网络' },
  { id: 'pos-007', code: 'J007', name: '网络系统集成工程师', industry: '通信/网络' },
  { id: 'pos-008', code: 'J008', name: '网络安全运维工程师', industry: '信息安全' },
  { id: 'pos-009', code: 'J009', name: '云计算运维工程师', industry: '云计算' },
  { id: 'pos-010', code: 'J010', name: '网络技术支持工程师', industry: '通信/网络' },
  { id: 'pos-011', code: 'J011', name: '数据库管理员', industry: '计算机软件' },
  { id: 'pos-012', code: 'J012', name: '系统架构师', industry: '计算机软件' },
  { id: 'pos-013', code: 'J013', name: '产品经理', industry: '互联网' },
  { id: 'pos-014', code: 'J014', name: 'UI设计师', industry: '互联网' },
  { id: 'pos-015', code: 'J015', name: '数据分析师', industry: '人工智能' },
  { id: 'pos-016', code: 'J016', name: '人工智能工程师', industry: '人工智能' },
  { id: 'pos-017', code: 'J017', name: '嵌入式开发工程师', industry: '智能制造' },
  { id: 'pos-018', code: 'J018', name: '物联网工程师', industry: '物联网' },
  { id: 'pos-019', code: 'J019', name: '信息安全工程师', industry: '信息安全' },
  { id: 'pos-020', code: 'J020', name: '技术支持工程师', industry: '计算机软件' },
  { id: 'pos-021', code: 'J021', name: '项目经理', industry: '互联网' },
  { id: 'pos-022', code: 'J022', name: '网络技术支持', industry: '通信/网络' },
  { id: 'pos-023', code: 'J023', name: '网络系统运维', industry: '通信/网络' },
  { id: 'pos-024', code: 'J024', name: '网络应用开发', industry: '通信/网络' },
]

// ----- 5. 培养方案 -----

export interface CoursePlan {
  id: string
  name: string
  code: string
  credits: number
  hours: number
  /** 新增：理论学时 */
  theoryHours?: number
  /** 新增：实践学时 */
  practiceHours?: number
  semester: number
  nature: '必修' | '选修' | '实践' | '场景'
  assessment: '考试' | '考查' | '论文' | '作品' | '场景测评'
  version: string
  /** 新增：课程类别，如「公共基础必修」「专业核心」 */
  category?: string
  /** 新增：课程目标 */
  objectives?: string
  /** 新增：主要教学内容 */
  mainContent?: string
  /** 新增：教学要求 */
  teachingRequirements?: string
  /** 新增：教学方法 */
  teachingMethods?: string
  /** 新增：典型工作任务描述 */
  typicalTasks?: string
  /** 新增：教学内容与要求 */
  contentRequirements?: string
  /** 新增：类型（课程/场景） */
  courseType?: '课程' | '场景'
  /** 新增：子分类（必修/限选/任选/专业基础/专业核心/专业拓展/专业实践） */
  subCategory?: string
  /** 新增：课程类型（如公共基础必修课程/专业核心课程等） */
  courseTypeLabel?: string
  /** 新增：岗位课时下的场景名称列表 */
  scenes?: { id: string; name: string }[]
}

/** 全局课程类型配置（可在表格顶部增删改） */
export const defaultCourseTypes = [
  '公共基础课程',
  '专业基础课程',
  '专业核心课程',
  '拓展课程',
]

/** 全局课程性质配置（可在 /admin/programs 页面增删改） */
export const courseNatures = ['必修', '选修', '实践']

export interface TrainingProgram {
  // ===== 基本信息（保留旧字段兼容）=====
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
  practiceScenes: CoursePlan[]
  status: 'draft' | 'pending' | 'published' | 'deprecated'
  frozenAt?: string
  startDate?: string
  endDate?: string
  creator?: string
  collaborators?: string[]
  createdAt?: string
  importSource?: 'manual' | 'ai-excel' | 'ai-word'
  aiExtractStatus?: 'none' | 'processing' | 'completed' | 'failed'
  aiExtractLog?: string

  // ===== 新增：完整人培方案字段（全部可选，兼容旧数据）=====

  /** 专业名称（冗余，便于展示） */
  majorName?: string
  /** 专业代码 */
  majorCode?: string
  /** 方案版本号 */
  version?: string

  // -- 2. 入学基本要求 --
  entryRequirements?: string

  // -- 4. 职业面向 --
  careerOrientation?: {
    professionalCategory: { name: string; code: string }
    professionalSubcategory: { name: string; code: string }
    correspondingIndustries: string[]
    mainOccupations: { name: string; code: string }[]
    /** 主要岗位ID列表（关联岗位公共库） */
    mainPositions: string[]
    vocationalCertificates: string[]
  }

  // -- 5. 培养目标 --
  trainingObjectives?: string

  // -- 6. 培养规格 --
  trainingSpecifications?: { id: number; content: string }[]

  // -- 7. 课程设置（完全扁平化大数组，与 courses/practiceScenes 并存） --
  curriculum?: CoursePlan[]

  // -- 7.2 学时安排统计 --
  creditHours?: {
    totalCredits: number
    totalHours: number
    theoryHours: number
    practiceHours: number
    publicBasicCredits: number
    publicBasicHours: number
    professionalBasicCredits: number
    professionalBasicHours: number
    professionalCoreCredits: number
    professionalCoreHours: number
    professionalExtendedCredits: number
    professionalExtendedHours: number
    practiceCredits: number
    practiceHours: number
  }

  // -- 8. 师资队伍 --
  facultyTeam?: {
    structure: string
    leaderRequirements: string
    fullTimeRequirements: string
    partTimeRequirements: string
  }

  // -- 9. 教学条件 --
  teachingConditions?: {
    classroomRequirements: string
    classroomVenueIds?: string[]
    trainingVenueRequirements: string
    trainingVenueIds?: string[]
    internshipVenueRequirements: string
    internshipVenueIds?: string[]
    textbookRequirements: string
    libraryRequirements: string
    digitalResourceRequirements: string
  }

  // -- 10. 质量保障和毕业要求 --
  qualityAssurance?: {
    systemDescription: string
    graduationRequirements: {
      ideological: string[]
      academic: {
        courseAssessment: string
        gradeCredit: string
        creditSubstitution: string
      }
      requirements: {
        courseCompletion: string
        credits: { total: number; required: number; elective: number; minTotal: number; note: string }
        physicalEducation: string
        certificates: string[]
      }
    }
  }
  /** 自定义目录章节 */
  customSections?: { id: string; title: string; content: string }[]
  /** 每年学期数（1-5，默认2） */
  semestersPerYear?: number
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
      { id: 'co1', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8', courseTypeLabel: '公共基础课程' },
      { id: 'co2', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-01', name: '大学英语I', code: 'ENG101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '公共基础课程' },
      { id: 'co-se-02', name: '思想道德与法治', code: 'POL101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', courseTypeLabel: '公共基础课程' },
      { id: 'co-se-03', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '公共基础课程' },
      { id: 'co3', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-04', name: '大学英语II', code: 'ENG102', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '公共基础课程' },
      { id: 'co-se-05', name: '体育与健康', code: 'PE101', credits: 2, hours: 32, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', courseTypeLabel: '公共基础课程' },
      { id: 'co4', name: '计算机网络', code: 'CS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.9', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-06', name: '离散数学', code: 'MATH201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-07', name: '数据库原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-08', name: '计算机组成原理', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-09', name: '操作系统', code: 'CS301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-10', name: '软件工程导论', code: 'SE101', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co6', name: '人工智能导论', code: 'AI101', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.2', courseTypeLabel: '拓展课程' },
      { id: 'co-se-11', name: 'Web前端开发', code: 'WEB101', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考查', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co5', name: '软件工程实践', code: 'CS302', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v3.1', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-12', name: '软件测试技术', code: 'SE201', credits: 3, hours: 48, semester: 5, nature: '必修', assessment: '考查', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-13', name: '移动应用开发', code: 'MOB101', credits: 3, hours: 48, semester: 5, nature: '必修', assessment: '考查', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-14', name: '系统架构设计', code: 'SE301', credits: 3, hours: 48, semester: 6, nature: '必修', assessment: '考查', version: 'v1.0', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-15', name: '大数据技术基础', code: 'BD101', credits: 3, hours: 48, semester: 6, nature: '选修', assessment: '考查', version: 'v1.0', courseTypeLabel: '拓展课程' },
      { id: 'co-se-16', name: '云计算与容器技术', code: 'CLOUD101', credits: 3, hours: 48, semester: 7, nature: '选修', assessment: '考查', version: 'v1.0', courseTypeLabel: '拓展课程' },
    ],
    practiceScenes: [
      { id: 'ps-se-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-se-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-se-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' },
      { id: 'ps-se-04', name: '技术支持工程师', code: 'PRAC101', credits: 2, hours: 32, semester: 3, nature: '场景', assessment: '报告', version: 'v1.0' },
      { id: 'ps-se-05', name: '项目经理', code: 'PRAC201', credits: 4, hours: 96, semester: 7, nature: '场景', assessment: '答辩', version: 'v1.0' },
      { id: 'ps-se-06', name: '产品经理', code: 'PRAC301', credits: 2, hours: 32, semester: 8, nature: '实践', assessment: '报告', version: 'v1.0' },
      { id: 'ps-se-07', name: '软件开发工程师', code: 'PRAC102', credits: 2, hours: 32, semester: 1, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-se-08', name: '后端开发工程师', code: 'PRAC103', credits: 2, hours: 32, semester: 2, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    curriculum: [
      { id: 'co1', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8', courseType: '课程', courseTypeLabel: '公共基础课程' },
      { id: 'co2', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1', courseType: '课程', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-01', name: '大学英语I', code: 'ENG101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '公共基础课程' },
      { id: 'co-se-02', name: '思想道德与法治', code: 'POL101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '公共基础课程' },
      { id: 'ps-se-07', name: '软件开发工程师', code: 'J001', credits: 2, hours: 32, semester: 1, nature: '实践', assessment: '作品', version: 'v1.0', courseType: '场景' },
      { id: 'co-se-03', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '公共基础课程' },
      { id: 'co3', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5', courseType: '课程', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-04', name: '大学英语II', code: 'ENG102', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '公共基础课程' },
      { id: 'co-se-05', name: '体育与健康', code: 'PE101', credits: 2, hours: 32, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '公共基础课程' },
      { id: 'ps-se-08', name: '后端开发工程师', code: 'J003', credits: 2, hours: 32, semester: 2, nature: '实践', assessment: '作品', version: 'v1.0', courseType: '场景' },
      { id: 'co4', name: '计算机网络', code: 'CS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.9', courseType: '课程', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-06', name: '离散数学', code: 'MATH201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业基础课程' },
      { id: 'co-se-07', name: '数据库原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-08', name: '计算机组成原理', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业基础课程' },
      { id: 'ps-se-04', name: '技术支持工程师', code: 'J020', credits: 2, hours: 32, semester: 3, nature: '场景', assessment: '报告', version: 'v1.0', courseType: '场景' },
      { id: 'co-se-09', name: '操作系统', code: 'CS301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-10', name: '软件工程导论', code: 'SE101', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co6', name: '人工智能导论', code: 'AI101', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.2', courseType: '课程', courseTypeLabel: '拓展课程' },
      { id: 'co-se-11', name: 'Web前端开发', code: 'WEB101', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co5', name: '软件工程实践', code: 'CS302', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v3.1', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-12', name: '软件测试技术', code: 'SE201', credits: 3, hours: 48, semester: 5, nature: '必修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-13', name: '移动应用开发', code: 'MOB101', credits: 3, hours: 48, semester: 5, nature: '必修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'ps-se-001', name: '软件开发工程师', code: 'J001', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1', courseType: '场景' },
      { id: 'co-se-14', name: '系统架构设计', code: 'SE301', credits: 3, hours: 48, semester: 6, nature: '必修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '专业核心课程' },
      { id: 'co-se-15', name: '大数据技术基础', code: 'BD101', credits: 3, hours: 48, semester: 6, nature: '选修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '拓展课程' },
      { id: 'ps-se-002', name: '系统架构师', code: 'J012', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0', courseType: '场景' },
      { id: 'co-se-16', name: '云计算与容器技术', code: 'CLOUD101', credits: 3, hours: 48, semester: 7, nature: '选修', assessment: '考查', version: 'v1.0', courseType: '课程', courseTypeLabel: '拓展课程' },
      { id: 'ps-se-05', name: '项目经理', code: 'J021', credits: 4, hours: 96, semester: 7, nature: '场景', assessment: '答辩', version: 'v1.0', courseType: '场景' },
      { id: 'ps-se-003', name: '系统架构师', code: 'J012', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0', courseType: '场景' },
      { id: 'ps-se-06', name: '产品经理', code: 'J013', credits: 2, hours: 32, semester: 8, nature: '实践', assessment: '报告', version: 'v1.0', courseType: '场景' },
    ],
    status: 'published',
    frozenAt: '2026-08-15',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '当前用户',
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
      { id: 'co7', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.5' },
      { id: 'co8', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co9', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.3' },
      { id: 'co10', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ai-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ai-002', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-ai-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    frozenAt: '2026-08-15',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '当前用户',
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
      { id: 'co11', name: '会计学基础', code: 'ACM101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co12', name: '财务会计', code: 'ACM201', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co13', name: '会计电算化', code: 'ACM301', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ac-001', name: '软件开发工程师', code: 'PRAC001', credits: 2, hours: 32, semester: 3, nature: '实践', assessment: '报告', version: 'v1.0' },
      { id: 'ps-ac-002', name: '项目经理', code: 'PRAC003', credits: 4, hours: 128, semester: 7, nature: '实践', assessment: '鉴定', version: 'v1.5' }
    ],
    status: 'draft',
    startDate: '2026-09-01',
    endDate: '2029-07-01',
    creator: '当前用户',
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
      { id: 'co100', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co101', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co102', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co103', name: '软件工程', code: 'SE201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co104', name: '数据库原理', code: 'SE202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co105', name: 'Web开发技术', code: 'SE301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co106', name: '软件测试', code: 'SE302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co107', name: '软件工程实践', code: 'SE401', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-se-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-se-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-se-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'pending',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '当前用户',
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
      { id: 'co108', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.5' },
      { id: 'co109', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co110', name: '数据结构与算法', code: 'AI103', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co111', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.3' },
      { id: 'co112', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co113', name: '计算机视觉', code: 'AI302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co114', name: '自然语言处理', code: 'AI303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co115', name: '人工智能综合实践', code: 'AI401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ai-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ai-002', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-ai-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co116', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co117', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co118', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co119', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co120', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co121', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
      { id: 'co122', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-net-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-net-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-net-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2026-07-01',
    creator: '当前用户',
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
      { id: 'co123', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co124', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co125', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co126', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co127', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co128', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.7' },
      { id: 'co129', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试', version: 'v3.1' },
      { id: 'co130', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co131', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cs-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-cs-002', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cs-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co132', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co133', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co134', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co135', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co136', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co137', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co138', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co139', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co140', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ds-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ds-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    startDate: '2023-09-01',
    endDate: '2027-07-01',
    creator: '当前用户',
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
      { id: 'co141', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co142', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co143', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co144', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co145', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co146', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co147', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co148', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co149', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-sec-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-sec-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co150', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co151', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co152', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co153', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co154', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co155', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co156', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co157', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co158', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-iot-001', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-iot-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co159', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co160', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co161', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co162', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co163', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co164', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co165', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cloud-001', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cloud-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co166', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co167', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co168', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co169', name: '软件工程', code: 'SE201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co170', name: '数据库原理', code: 'SE202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co171', name: 'Web开发技术', code: 'SE301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co172', name: '软件测试', code: 'SE302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co173', name: '软件工程实践', code: 'SE401', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-se-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-se-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-se-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '当前用户',
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
      { id: 'co174', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.5' },
      { id: 'co175', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co176', name: '数据结构与算法', code: 'AI103', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co177', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.3' },
      { id: 'co178', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co179', name: '计算机视觉', code: 'AI302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co180', name: '自然语言处理', code: 'AI303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co181', name: '人工智能综合实践', code: 'AI401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ai-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ai-002', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-ai-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co182', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co183', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co184', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co185', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co186', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co187', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
      { id: 'co188', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-net-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-net-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-net-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'pending',
    startDate: '2024-09-01',
    endDate: '2027-07-01',
    creator: '当前用户',
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
      { id: 'co189', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co190', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co191', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co192', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co193', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co194', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.7' },
      { id: 'co195', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试', version: 'v3.1' },
      { id: 'co196', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co197', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cs-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-cs-002', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cs-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co198', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co199', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co200', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co201', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co202', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co203', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co204', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co205', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co206', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ds-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ds-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    startDate: '2024-09-01',
    endDate: '2028-07-01',
    creator: '当前用户',
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
      { id: 'co207', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co208', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co209', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co210', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co211', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co212', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co213', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co214', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co215', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-sec-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-sec-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co216', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co217', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co218', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co219', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co220', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co221', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co222', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co223', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co224', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-iot-001', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-iot-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co225', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co226', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co227', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co228', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co229', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co230', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co231', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cloud-001', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cloud-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co232', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co233', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co234', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co235', name: '软件工程', code: 'SE201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co236', name: '数据库原理', code: 'SE202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co237', name: 'Web开发技术', code: 'SE301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co238', name: '软件测试', code: 'SE302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co239', name: '软件工程实践', code: 'SE401', credits: 4, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-se-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-se-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-se-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '当前用户',
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
      { id: 'co240', name: '线性代数', code: 'MATH102', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.5' },
      { id: 'co241', name: 'Python程序设计', code: 'AI102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co242', name: '数据结构与算法', code: 'AI103', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co243', name: '机器学习', code: 'AI201', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.3' },
      { id: 'co244', name: '深度学习', code: 'AI301', credits: 4, hours: 64, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co245', name: '计算机视觉', code: 'AI302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co246', name: '自然语言处理', code: 'AI303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co247', name: '人工智能综合实践', code: 'AI401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ai-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ai-002', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-ai-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co248', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co249', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co250', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co251', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co252', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co253', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
      { id: 'co254', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-net-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-net-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-net-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2028-07-01',
    creator: '当前用户',
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
      { id: 'co255', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co256', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co257', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co258', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co259', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co260', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.7' },
      { id: 'co261', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试', version: 'v3.1' },
      { id: 'co262', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co263', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cs-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-cs-002', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cs-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co264', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co265', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co266', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co267', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co268', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co269', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co270', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co271', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co272', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ds-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ds-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'pending',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '当前用户',
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
      { id: 'co273', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co274', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co275', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co276', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co277', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co278', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co279', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co280', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co281', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-sec-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-sec-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co282', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co283', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co284', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co285', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co286', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co287', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co288', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co289', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co290', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-iot-001', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-iot-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co291', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co292', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co293', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co294', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co295', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co296', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co297', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cloud-001', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cloud-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co314', name: '计算机基础', code: 'CN101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co315', name: '网络技术基础', code: 'CN102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co316', name: 'Linux系统管理', code: 'CN201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co317', name: '网络设备配置', code: 'CN202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co318', name: '网络安全基础', code: 'CN301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co319', name: '网络综合布线', code: 'CN302', credits: 3, hours: 48, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
      { id: 'co320', name: '云计算基础', code: 'CN303', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-net-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-net-002', name: '系统架构师', code: 'PRAC002', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v2.0' },
      { id: 'ps-net-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    frozenAt: '2026-08-15',
    startDate: '2026-09-01',
    endDate: '2029-07-01',
    creator: '当前用户',
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
      { id: 'co321', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co322', name: '离散数学', code: 'CS103', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co323', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co324', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co325', name: '计算机组成原理', code: 'CS202', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co326', name: '操作系统', code: 'CS203', credits: 4, hours: 64, semester: 3, nature: '必修', assessment: '考试', version: 'v1.7' },
      { id: 'co327', name: '编译原理', code: 'CS301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考试', version: 'v3.1' },
      { id: 'co328', name: '算法设计与分析', code: 'CS302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co329', name: '毕业设计', code: 'CS401', credits: 8, hours: 128, semester: 7, nature: '实践', assessment: '论文', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cs-001', name: '软件开发工程师', code: 'PRAC007', credits: 4, hours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v2.1' },
      { id: 'ps-cs-002', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cs-003', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co330', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co331', name: '概率论与数理统计', code: 'MATH103', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v2.0' },
      { id: 'co332', name: 'Python程序设计', code: 'DS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co333', name: '数据结构与算法', code: 'DS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co334', name: '数据库原理', code: 'DS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co335', name: '大数据技术原理', code: 'DS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co336', name: '数据挖掘', code: 'DS302', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co337', name: 'Hadoop生态技术', code: 'DS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co338', name: '大数据综合实践', code: 'DS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-ds-001', name: '数据分析师', code: 'PRAC009', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '报告', version: 'v1.1' },
      { id: 'ps-ds-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    frozenAt: '2026-08-15',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '当前用户',
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
      { id: 'co339', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co340', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co341', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co342', name: '计算机网络', code: 'IS201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co343', name: '密码学', code: 'IS301', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co344', name: '网络安全', code: 'IS302', credits: 3, hours: 48, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co345', name: 'Web安全技术', code: 'IS303', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co346', name: '逆向工程', code: 'IS304', credits: 3, hours: 48, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co347', name: '安全攻防实践', code: 'IS401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-sec-001', name: '网络系统集成工程师', code: 'PRAC008', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.3' },
      { id: 'ps-sec-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    frozenAt: '2026-08-15',
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
      { id: 'co348', name: '高等数学', code: 'MATH101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.8' },
      { id: 'co349', name: '程序设计基础', code: 'CS101', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v2.1' },
      { id: 'co350', name: '电路与电子技术', code: 'IOT101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co351', name: '数据结构', code: 'CS102', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v2.5' },
      { id: 'co352', name: '传感器技术', code: 'IOT201', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co353', name: '嵌入式系统', code: 'IOT202', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co354', name: '无线通信技术', code: 'IOT301', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co355', name: 'RFID技术', code: 'IOT302', credits: 3, hours: 48, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co356', name: '物联网综合实践', code: 'IOT401', credits: 4, hours: 64, semester: 6, nature: '实践', assessment: '作品', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-iot-001', name: '人工智能工程师', code: 'PRAC010', credits: 4, hours: 96, semester: 6, nature: '实践', assessment: '答辩', version: 'v2.0' },
      { id: 'ps-iot-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
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
      { id: 'co357', name: '计算机基础', code: 'CE101', credits: 3, hours: 48, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co358', name: 'Linux操作系统', code: 'CE102', credits: 4, hours: 64, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co359', name: '网络技术基础', code: 'CE201', credits: 3, hours: 48, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co360', name: '虚拟化技术', code: 'CE202', credits: 4, hours: 64, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co361', name: 'Docker容器技术', code: 'CE301', credits: 3, hours: 48, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0' },
      { id: 'co362', name: 'OpenStack云计算', code: 'CE302', credits: 3, hours: 48, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0' },
      { id: 'co363', name: '云计算运维实践', code: 'CE303', credits: 4, hours: 64, semester: 3, nature: '实践', assessment: '考查', version: 'v1.0' },
    ],
    practiceScenes: [
      { id: 'ps-cloud-001', name: '软件开发工程师', code: 'PRAC006', credits: 3, hours: 64, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0' },
      { id: 'ps-cloud-002', name: '系统架构师', code: 'PRAC004', credits: 6, hours: 192, semester: 8, nature: '实践', assessment: '答辩', version: 'v3.0' }
    ],
    status: 'published',
    frozenAt: '2026-08-15',
    startDate: '2026-09-01',
    endDate: '2029-07-01',
    creator: '周教授',
    collaborators: ['张教授', '李副教授'],
    createdAt: '2025-07-17',
  },
  // 新增学院培养方案（空壳）
  {
    id: 'tp-fl-2026',
    name: '2026级英语专业人才培养方案',
    code: 'TP-EN-2026',
    majorId: 'm14',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 160,
    requiredCredits: 115,
    electiveCredits: 28,
    practiceCredits: 17,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '陈教授',
    collaborators: [],
    createdAt: '2025-08-01',
  },
  {
    id: 'tp-civ-2026',
    name: '2026级土木工程专业人才培养方案',
    code: 'TP-CIV-2026',
    majorId: 'm16',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 165,
    requiredCredits: 120,
    electiveCredits: 25,
    practiceCredits: 20,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '周教授',
    collaborators: [],
    createdAt: '2025-08-01',
  },
  {
    id: 'tp-nur-2026',
    name: '2026级护理学专业人才培养方案',
    code: 'TP-NUR-2026',
    majorId: 'm18',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 168,
    requiredCredits: 125,
    electiveCredits: 22,
    practiceCredits: 21,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '吴教授',
    collaborators: [],
    createdAt: '2025-08-01',
  },
  {
    id: 'tp-mus-2026',
    name: '2026级音乐表演专业人才培养方案',
    code: 'TP-MU-2026',
    majorId: 'm20',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 155,
    requiredCredits: 110,
    electiveCredits: 30,
    practiceCredits: 15,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '郑教授',
    collaborators: [],
    createdAt: '2025-08-01',
  },
  {
    id: 'tp-pe-2026',
    name: '2026级体育教育专业人才培养方案',
    code: 'TP-PE-2026',
    majorId: 'm21',
    entryYear: 2026,
    level: '本科',
    duration: 4,
    totalCredits: 158,
    requiredCredits: 112,
    electiveCredits: 26,
    practiceCredits: 20,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2026-09-01',
    endDate: '2030-07-01',
    creator: '孙教授',
    collaborators: [],
    createdAt: '2025-08-01',
  },
  {
    id: 'tp-fl-2025',
    name: '2025级日语专业人才培养方案',
    code: 'TP-JP-2025',
    majorId: 'm15',
    entryYear: 2025,
    level: '本科',
    duration: 4,
    totalCredits: 160,
    requiredCredits: 115,
    electiveCredits: 28,
    practiceCredits: 17,
    courses: [],
    practiceScenes: [],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2029-07-01',
    creator: '陈教授',
    collaborators: [],
    createdAt: '2024-08-01',
  },
  {
    id: 'tp-bim-2027',
    name: '2027级建筑信息模型技术专业人才培养方案',
    code: 'TP-BIM-2027',
    majorId: 'm17',
    entryYear: 2027,
    level: '大专',
    duration: 3,
    totalCredits: 130,
    requiredCredits: 95,
    electiveCredits: 18,
    practiceCredits: 17,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2027-09-01',
    endDate: '2030-07-01',
    creator: '周教授',
    collaborators: [],
    createdAt: '2026-08-01',
  },
  {
    id: 'tp-pha-2028',
    name: '2028级药学专业人才培养方案',
    code: 'TP-PHA-2028',
    majorId: 'm19',
    entryYear: 2028,
    level: '大专',
    duration: 3,
    totalCredits: 125,
    requiredCredits: 90,
    electiveCredits: 20,
    practiceCredits: 15,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '2028-09-01',
    endDate: '2031-07-01',
    creator: '吴教授',
    collaborators: [],
    createdAt: '2027-08-01',
  },
  {
    id: 'tp-cn-2025',
    name: '2025级计算机网络技术专业人才培养方案',
    code: 'TP-CN-2025',
    majorId: 'm3',
    majorName: '计算机网络技术',
    majorCode: '510202',
    version: '2025-v1.0',
    entryYear: 2025,
    level: '大专',
    duration: 3,
    totalCredits: 142,
    requiredCredits: 108,
    electiveCredits: 14,
    practiceCredits: 20,
    courses: [],
    practiceScenes: [],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2028-07-01',
    creator: '王志强',
    collaborators: ['张讲师', '李工程师', '赵副教授'],
    createdAt: '2025-06-20',
    entryRequirements: '具有高中阶段教育毕业证书或同等学力，身体健康，无色盲色弱，具备一定的逻辑思维能力和动手操作能力。',
    careerOrientation: {
      professionalCategory: { name: '电子信息大类', code: '51' },
      professionalSubcategory: { name: '计算机类', code: '5102' },
      correspondingIndustries: [
        '互联网和相关服务',
        '软件和信息技术服务业',
        '电信、广播电视和卫星传输服务',
      ],
      mainOccupations: [
        { name: '信息通信网络运行管理员', code: '4-04-04-01' },
        { name: '信息通信网络机务员', code: '4-04-02-01' },
        { name: '计算机网络工程技术人员', code: '2-02-10-04' },
        { name: '信息安全管理员', code: '4-04-04-02' },
      ],
      mainPositions: ['pos-006', 'pos-007', 'pos-008', 'pos-009', 'pos-010', 'pos-006', 'pos-005', 'pos-005'],
      vocationalCertificates: [
        '华为认证网络工程师（HCIA/HCIP）',
        '思科认证网络助理（CCNA）',
        '红帽认证系统管理员（RHCSA）',
        '全国计算机等级考试三级网络技术',
        '1+X网络系统建设与运维职业技能等级证书',
        '1+X云计算平台运维与开发职业技能等级证书',
        '注册信息安全专业人员（CISP）',
      ],
    },
    trainingObjectives: '本专业培养理想信念坚定，德、智、体、美、劳全面发展，具有一定的科学文化水平，良好的人文素养、职业道德和创新意识，精益求精的工匠精神，较强的就业能力和可持续发展的能力；掌握本专业知识和技术技能，面向互联网和相关服务、软件和信息技术服务业等行业的信息和通信工程技术人员、信息通信网络维护人员、信息通信网络运行管理人员等职业群，能够从事网络售前技术支持、网络应用开发、网络系统运维、网络系统集成等工作的高素质技术技能人才。',
    trainingSpecifications: [
      { id: 1, content: '坚定拥护中国共产党领导和中国特色社会主义制度，' },
      { id: 2, content: '具有良好的职业道德和工匠精神，爱岗敬业，具有高度的责任心和团队协作精神。' },
      { id: 3, content: '具有良好的身心素质和人文素养，掌握一定的学习方法，具有终身学习的意识和能力。' },
      { id: 4, content: '具有质量意识、环保意识、安全意识、信息素养、创新思维。' },
      { id: 5, content: '掌握必备的思想政治理论、科学文化基础知识和中华优秀传统文化知识。' },
      { id: 6, content: '熟悉与本专业相关的法律法规以及环境保护、安全消防、文明生产等知识。' },
      { id: 7, content: '掌握计算机网络基础、网络操作系统、程序设计基础、数据库技术等专业知识。' },
      { id: 8, content: '掌握网络工程设计与实施、网络设备配置与管理、网络安全防护、云计算平台运维等专业技能。' },
      { id: 9, content: '具备网络系统规划、设计、实施、运维和管理的能力。' },
      { id: 10, content: '具备网络故障诊断与排除、网络性能优化、网络安全事件应急处理的能力。' },
      { id: 11, content: '具备初步的网络应用开发能力和网络自动化运维能力。' },
      { id: 12, content: '具有探究学习、终身学习和可持续发展的能力，能够跟踪网络技术发展趋势。' },
      { id: 13, content: '具有良好的语言表达能力、文字表达能力、沟通合作能力。' },
      { id: 14, content: '具备基本的英语阅读和专业技术文档查阅能力。' },
    ],
    curriculum: [
          { id: 'pb1', name: '思想道德与法治', code: 'GB101', credits: 3, hours: 48, theoryHours: 40, practiceHours: 8, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb2', name: '毛泽东思想和中国特色社会主义理论体系概论', code: 'GB102', credits: 4, hours: 64, theoryHours: 56, practiceHours: 8, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb3', name: '形势与政策', code: 'GB103', credits: 1, hours: 16, theoryHours: 16, practiceHours: 0, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb4', name: '军事理论', code: 'GB104', credits: 2, hours: 32, theoryHours: 32, practiceHours: 0, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb5', name: '军事技能', code: 'GB105', credits: 2, hours: 56, theoryHours: 0, practiceHours: 56, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb6', name: '心理健康教育', code: 'GB106', credits: 2, hours: 32, theoryHours: 24, practiceHours: 8, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb7', name: '体育与健康', code: 'GB107', credits: 4, hours: 64, theoryHours: 8, practiceHours: 56, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb8', name: '大学语文', code: 'GB108', credits: 2, hours: 32, theoryHours: 32, practiceHours: 0, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb9', name: '实用英语', code: 'GB109', credits: 4, hours: 64, theoryHours: 48, practiceHours: 16, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb10', name: '高等数学', code: 'GB110', credits: 3, hours: 48, theoryHours: 48, practiceHours: 0, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb11', name: '大学生职业发展与就业指导', code: 'GB111', credits: 2, hours: 32, theoryHours: 24, practiceHours: 8, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb12', name: '创新创业教育', code: 'GB112', credits: 2, hours: 32, theoryHours: 16, practiceHours: 16, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb13', name: '劳动教育', code: 'GB113', credits: 1, hours: 16, theoryHours: 4, practiceHours: 12, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb14', name: '国家安全教育', code: 'GB114', credits: 1, hours: 16, theoryHours: 16, practiceHours: 0, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb15', name: '信息技术', code: 'GB115', credits: 2, hours: 32, theoryHours: 16, practiceHours: 16, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'pb16', name: '艺术鉴赏', code: 'GB116', credits: 2, hours: 32, theoryHours: 32, practiceHours: 0, semester: 2, nature: '必修', assessment: '考查', version: 'v1.0', category: '公共基础必修' , courseType: '课程', subCategory: '必修' , courseTypeLabel: '公共基础课程' },
          { id: 'le1', name: '实用数学提高', code: 'LE101', credits: 2, hours: 32, theoryHours: 32, practiceHours: 0, semester: 2, nature: '选修', assessment: '考查', version: 'v1.0', category: '公共基础限选' , courseType: '课程', subCategory: '限选' , courseTypeLabel: '公共基础课程' },
          { id: 'le2', name: '实用英语提高', code: 'LE102', credits: 2, hours: 32, theoryHours: 24, practiceHours: 8, semester: 2, nature: '选修', assessment: '考查', version: 'v1.0', category: '公共基础限选' , courseType: '课程', subCategory: '限选' , courseTypeLabel: '公共基础课程' },
          { id: 'fe1', name: '信息技术拓展', code: 'FE101', credits: 2, hours: 32, theoryHours: 16, practiceHours: 16, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0', category: '公共基础任选' , courseType: '课程', subCategory: '任选' , courseTypeLabel: '公共基础课程' },
          { id: 'fe2', name: '社交礼仪', code: 'FE102', credits: 1, hours: 16, theoryHours: 16, practiceHours: 0, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0', category: '公共基础任选' , courseType: '课程', subCategory: '任选' , courseTypeLabel: '公共基础课程' },
          { id: 'fe3', name: '演讲与口才', code: 'FE103', credits: 1, hours: 16, theoryHours: 8, practiceHours: 8, semester: 3, nature: '选修', assessment: '考查', version: 'v1.0', category: '公共基础任选' , courseType: '课程', subCategory: '任选' , courseTypeLabel: '公共基础课程' },
          { id: 'pro-b1', name: 'Python程序设计基础', code: 'PB201', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 1, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业基础课' , courseType: '课程', subCategory: '专业基础' , courseTypeLabel: '专业基础课程' },
          { id: 'pro-b2', name: '计算机网络基础', code: 'PB202', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业基础课' , courseType: '课程', subCategory: '专业基础' , courseTypeLabel: '专业基础课程' },
          { id: 'pro-b3', name: '网络操作系统（Windows Server）', code: 'PB203', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业基础课' , courseType: '课程', subCategory: '专业基础' , courseTypeLabel: '专业基础课程' },
          { id: 'pro-b4', name: '数据库技术与应用', code: 'PB204', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 2, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业基础课' , courseType: '课程', subCategory: '专业基础' , courseTypeLabel: '专业基础课程' },
          { id: 'pro-b5', name: '网络安全技术基础', code: 'PB205', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业基础课' , courseType: '课程', subCategory: '专业基础' , courseTypeLabel: '专业基础课程' },
          { id: 'pro-b6', name: '计算机组装与维护', code: 'PB206', credits: 3, hours: 48, theoryHours: 16, practiceHours: 32, semester: 1, nature: '必修', assessment: '考查', version: 'v1.0', category: '专业基础课' , courseType: '课程', subCategory: '专业基础' , courseTypeLabel: '专业基础课程' },
          { id: 'pro-c1', name: 'Linux网络操作系统', code: 'PC301', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c2', name: '虚拟化技术与应用', code: 'PC302', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c3', name: '网络自动化运维', code: 'PC303', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 3, nature: '必修', assessment: '考查', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c4', name: '路由交换技术', code: 'PC304', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 3, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c5', name: '网络安全设备配置与管理', code: 'PC305', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c6', name: '无线网络技术', code: 'PC306', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 4, nature: '必修', assessment: '考查', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c7', name: '综合布线设计与实施', code: 'PC307', credits: 3, hours: 48, theoryHours: 16, practiceHours: 32, semester: 4, nature: '必修', assessment: '考查', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-c8', name: '网络工程设计与实施', code: 'PC308', credits: 4, hours: 64, theoryHours: 32, practiceHours: 32, semester: 4, nature: '必修', assessment: '考试', version: 'v1.0', category: '专业核心课' , courseType: '课程', subCategory: '专业核心' , courseTypeLabel: '专业核心课程' },
          { id: 'pro-e1', name: '云计算技术与应用', code: 'PE401', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0', category: '专业拓展课' , courseType: '课程', subCategory: '专业拓展' , courseTypeLabel: '拓展课程' },
          { id: 'pro-e2', name: 'Web前端设计与开发', code: 'PE402', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0', category: '专业拓展课' , courseType: '课程', subCategory: '专业拓展' , courseTypeLabel: '拓展课程' },
          { id: 'pro-e3', name: '高级路由与交换技术', code: 'PE403', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 4, nature: '选修', assessment: '考查', version: 'v1.0', category: '专业拓展课' , courseType: '课程', subCategory: '专业拓展' , courseTypeLabel: '拓展课程' },
          { id: 'pro-e4', name: 'SDN技术与应用', code: 'PE404', credits: 3, hours: 48, theoryHours: 24, practiceHours: 24, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0', category: '专业拓展课' , courseType: '课程', subCategory: '专业拓展' , courseTypeLabel: '拓展课程' },
          { id: 'pro-e5', name: '物联网技术基础', code: 'PE405', credits: 2, hours: 32, theoryHours: 16, practiceHours: 16, semester: 5, nature: '选修', assessment: '考查', version: 'v1.0', category: '专业拓展课' , courseType: '课程', subCategory: '专业拓展' , courseTypeLabel: '拓展课程' },
          { id: 'pro-p1', name: '网络系统集成工程师', code: 'J007', credits: 4, hours: 96, theoryHours: 0, practiceHours: 96, semester: 5, nature: '实践', assessment: '作品', version: 'v1.0', category: '专业实践课' , courseType: '场景', subCategory: '专业实践' , courseTypeLabel: '' },
          { id: 'pro-p2', name: '系统架构师', code: 'J012', credits: 4, hours: 96, theoryHours: 0, practiceHours: 96, semester: 5, nature: '实践', assessment: '论文', version: 'v1.0', category: '专业实践课' , courseType: '场景', subCategory: '专业实践' , courseTypeLabel: '' },
          { id: 'pro-p3', name: '项目经理', code: 'J021', credits: 12, hours: 480, theoryHours: 0, practiceHours: 480, semester: 6, nature: '实践', assessment: '考查', version: 'v1.0', category: '专业实践课' , courseType: '场景', subCategory: '专业实践' , courseTypeLabel: '' },
    ],
    creditHours: {
      totalCredits: 142,
      totalHours: 2688,
      theoryHours: 1096,
      practiceHours: 1592,
      publicBasicCredits: 42,
      publicBasicHours: 672,
      professionalBasicCredits: 22,
      professionalBasicHours: 352,
      professionalCoreCredits: 29,
      professionalCoreHours: 464,
      professionalExtendedCredits: 11,
      professionalExtendedHours: 176,
      practiceCredits: 20,
      practiceHours: 672,
    },
    facultyTeam: {
      structure: '本专业教学团队由专任教师和企业兼职教师组成，其中专任教师不少于8人，企业兼职教师不少于4人。团队应具有合理的年龄结构、职称结构和双师结构。',
      leaderRequirements: '专业带头人应具有高级职称或高级职业资格，具有5年以上企业工作经历或连续3年以上承担企业技术项目经历，在本领域具有较高的影响力。',
      fullTimeRequirements: '专任教师应具有硕士以上学位或中级以上职称，其中双师型教师比例不低于80%。每位专任教师每5年企业实践时间累计不少于6个月。',
      partTimeRequirements: '兼职教师应从企业一线聘请具有3年以上工作经历的工程技术人员或管理人员，承担专业课程教学或实习指导任务，每年承担教学任务不少于30学时。',
    },
    teachingConditions: {
      classroomRequirements: '应配备多媒体教室、计算机机房、网络实训室等专业教学场所。多媒体教室应配备投影仪、计算机、音响设备；计算机机房每人一机，网络互通。',
      classroomVenueIds: ['v1', 'v2', 'v8'],
      trainingVenueRequirements: '应建有网络综合布线实训室、路由交换实训室、网络安全实训室、云计算实训室、虚拟化实训室等。实训设备应满足每人一台（套）或每组一台（套）的要求。',
      trainingVenueIds: ['v3', 'v4', 'v5', 'v6', 'v7'],
      internshipVenueRequirements: '应建立稳定的校外实习基地，与网络集成企业、数据中心、运营商等建立合作关系，能提供网络运维、系统集成、技术支持等岗位实习机会。',
      internshipVenueIds: ['v5', 'v6'],
      textbookRequirements: '优先选用高职国家规划教材、精品教材和活页式、工作手册式新型教材。鼓励与行业企业合作开发校本教材和数字化教学资源。',
      libraryRequirements: '应配备充足的纸质图书和电子图书资源，计算机类、网络技术类专业图书生均不少于30册。应订阅相关专业期刊和数据库。',
      digitalResourceRequirements: '应建设专业教学资源库，包含课程标准、教学设计、教学课件、实训指导书、案例库、试题库等。应配备网络教学平台，支持线上线下混合式教学。',
    },
    qualityAssurance: {
      systemDescription: '建立学校、二级学院、专业教研室三级教学质量监控体系，通过教学检查、听课评课、学生评教、毕业生跟踪调查等方式，对人才培养全过程进行质量监控。定期开展专业调研和人才培养方案修订，确保培养质量持续改进。',
      graduationRequirements: {
        ideological: [
          '坚定拥护中国共产党领导，树立中国特色社会主义共同理想',
          '践行社会主义核心价值观，具有良好道德品质',
          '具有健康的体魄、良好的心理素质和行为习惯',
        ],
        academic: {
          courseAssessment: '学生必须修完人才培养方案规定的全部课程，课程考核分为考试和考查两种形式，成绩采用百分制或等级制记载。',
          gradeCredit: '实行学分制管理，课程成绩合格方可获得相应学分。课程总评成绩由平时成绩和期末成绩组成，平时成绩占比不低于40%。',
          creditSubstitution: '鼓励学生取得职业技能等级证书、参加技能大赛获奖、参与创新创业活动等，可按规定置换相应课程学分，最高不超过6学分。',
        },
        requirements: {
          courseCompletion: '修完人才培养方案规定的全部必修课程和规定学分的选修课程，完成毕业设计和岗位实习。',
          credits: { total: 142, required: 108, elective: 14, minTotal: 135, note: '总学分不低于135学分方可毕业，其中必修学分108学分，选修学分至少14学分（含公共选修和专业选修）。' },
          physicalEducation: '学生体质健康测试成绩达到《国家学生体质健康标准》要求，体育课程成绩合格。',
          certificates: [
            '鼓励取得1+X网络系统建设与运维职业技能等级证书',
            '鼓励取得华为认证网络工程师（HCIA）或同等水平职业资格证书',
            '全国计算机等级考试二级以上证书',
          ],
        },
      },
    },
  },
  {
    id: 'tp-cn-2025',
    name: '2025级计算机网络技术专业人才培养方案',
    code: 'TP-CN-510202-2025',
    majorId: 'm3',
    majorName: '计算机网络技术',
    majorCode: '510202',
    entryYear: 2025,
    level: '大专',
    duration: 3,
    version: '2025版',
    totalCredits: 147,
    requiredCredits: 120,
    electiveCredits: 15,
    practiceCredits: 32,
    courses: [],
    practiceScenes: [],
    status: 'published',
    startDate: '2025-09-01',
    endDate: '2028-07-01',
    creator: '网络工程系',
    collaborators: ['王志强', '李红梅'],
    createdAt: '2025-06-01',
    importSource: 'manual',
    aiExtractStatus: 'none',

    entryRequirements: '中等职业学校毕业､普通高级中学毕业或具备同等学力',

    careerOrientation: {
      professionalCategory: { name: '电子与信息大类', code: '51' },
      professionalSubcategory: { name: '计算机类', code: '5102' },
      correspondingIndustries: [
        '互联网和相关服务',
        '软件和信息技术服务',
      ],
      mainOccupations: [
        { name: '信息和通信工程技术人员', code: '2-02-10' },
        { name: '信息通信网络维护人员', code: '4-04-02' },
        { name: '信息通信网络运行管理人员', code: '4-04-04' },
      ],
      mainPositions: ['pos-022', 'pos-023', 'pos-007', 'pos-024'],
      vocationalCertificates: [
        '计算机技术与软件专业技术资格',
        '网络系统建设与运维',
        'Web前端开发',
        '云计算平台运维与开发',
        '网络安全运维',
        'WPS办公应用',
        '无线网络规划与实施',
        '网络系统规划与部署',
      ],
    },

    trainingObjectives: '本专业培养能够践行社会主义核心价值观，传承技能文明，德智体美劳全面发展，具有一定的科学文化水平，良好的人文素养､科学素养､数字素养､职业道德､创新意识，敬佑生命､救死扶伤､甘于奉献､大爱无疆的职业精神，较强的就业创业能力和可持续发展的能力，掌握本专业知识和技术技能，具备职业综合素质和行动能力，面向互联网和相关服务､软件和信息技术服务等行业的信息和通信工程技术人员､信息通信网络维护人员､信息通信网络运行管理人员等职业，能够从事网络技术支持､网络系统运维､网络系统集成､网络应用开发等工作的高技能人才｡',

    trainingSpecifications: [
      { id: 1, content: '坚定拥护中国共产党领导和中国特色社会主义制度，以习近平新时代中国特色社会主义思想为指导，践行社会主义核心价值观，具有坚定的理想信念､深厚的爱国情感和中华民族自豪感；' },
      { id: 2, content: '掌握与本专业对应职业活动相关的国家法律､行业规定，掌握绿色生产､环境保护､安全防护､质量管理等相关知识与技能，了解相关行业文化，具有爱岗敬业的职业精神，遵守职业道德准则和行为规范，具备社会责任感和创新精神；' },
      { id: 3, content: '掌握支撑本专业学习和可持续发展必备的语文､数学､外语 \(英语等\)､信息技术等文化基础知识，具有良好的人文素养与科学素养，具备职业生涯规划能力；' },
      { id: 4, content: '具有良好的语言表达能力､文字表达能力､沟通合作能力，具有较强的集体意识和团队合作意识，学习 1 门外语并结合本专业加以运用；' },
      { id: 5, content: '掌握计算机网络､程序设计､网络操作系统､路由交换技术､数据库技术､网络安全技术､云计算和虚拟化等方面的专业基础理论知识；' },
      { id: 6, content: '掌握中小型网络和无线局域网的规划设计､设备选型，以及网络设备的安装､配置､调试和排错等技术技能，具有网络搭建､日常巡检和技术文档撰写能力；' },
      { id: 7, content: '掌握服务器､云平台的安装､配置､调试和管理等技术技能，具有网络服务器､云平台､虚拟化等的部署和管理能力；' },
      { id: 8, content: '掌握网络安全软硬件的安装配置和调试､网络攻击防御､网站管理维护､数据库管理､备份与恢复等技术技能，具有初步的网络安全检测､网络安全防护､网络安全运维管理和保障能力；' },
      { id: 9, content: '掌握网络自动化运维工具的使用等技术技能，具有初步的网络自动化运维软件开发能力；' },
      { id: 10, content: '掌握信息技术基础知识，具有适应本行业数字化和智能化发展需求的数字技能；' },
      { id: 11, content: '具有探究学习､终身学习和可持续发展的能力，具有整合知识和综合运用知识分析问题和解决问题的能力；' },
      { id: 12, content: '掌握身体运动的基本知识和至少 1 项体育运动技能，达到国家大学生体质健康测试合格标准，养成良好的运动习惯､卫生习惯和行为习惯，具备一定的心理调适能力；' },
      { id: 13, content: '掌握必备的美育知识，具有一定的文化修养､审美能力，形成至少 1 项艺术特长或爱好；' },
      { id: 14, content: '树立正确的劳动观，尊重劳动，热爱劳动，具备与本专业职业发展相适应的劳动素养，弘扬劳模精神､劳动精神､工匠精神，弘扬劳动光荣､技能宝贵､创造伟大的时代风尚｡' }
    ],
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
  periods: string[]
  weeks: string
  nature: '理论' | '实践' | '场景教学' | '考试'
  externalPlatformId?: string
  externalPlatformType?: 'course' | 'scene'
}

export const timetableEntries: TimetableEntry[] = [
  { id: 'te1', classId: 'c1', courseName: '程序设计基础', facultyId: 'f1', venueId: 'v3', dayOfWeek: 1, periods: ['上午 1', '上午 2'], weeks: '1-16周', nature: '理论' },
  { id: 'te2', classId: 'c1', courseName: '高等数学', facultyId: 'f1', venueId: 'v1', dayOfWeek: 1, periods: ['上午 3', '上午 4'], weeks: '1-16周', nature: '理论' },
  { id: 'te3', classId: 'c1', courseName: '数据结构', facultyId: 'f2', venueId: 'v3', dayOfWeek: 2, periods: ['上午 1', '上午 2'], weeks: '1-16周', nature: '理论' },
  { id: 'te4', classId: 'c1', courseName: '软件工程实践', facultyId: 'f3', venueId: 'v4', dayOfWeek: 3, periods: ['下午 1', '下午 2', '下午 3', '下午 4'], weeks: '5-16周', nature: '实践' },
  { id: 'te5', classId: 'c3', courseName: 'Python程序设计', facultyId: 'f2', venueId: 'v3', dayOfWeek: 2, periods: ['上午 3', '上午 4'], weeks: '1-16周', nature: '理论' },
  { id: 'te6', classId: 'c3', courseName: '机器学习', facultyId: 'f2', venueId: 'v3', dayOfWeek: 4, periods: ['上午 1', '上午 2'], weeks: '1-16周', nature: '理论' },
  { id: 'te7', classId: 'c5', courseName: '机械设计基础', facultyId: 'f4', venueId: 'v5', dayOfWeek: 1, periods: ['下午 1', '下午 2', '下午 3', '下午 4'], weeks: '1-14周', nature: '实践' },
  { id: 'te8', classId: 'c6', courseName: '会计学基础', facultyId: 'f5', venueId: 'v1', dayOfWeek: 3, periods: ['上午 1', '上午 2'], weeks: '1-16周', nature: '理论' },
  { id: 'te9', classId: 'c7', courseName: '设计基础', facultyId: 'f6', venueId: 'v7', dayOfWeek: 2, periods: ['下午 1', '下午 2', '下午 3', '下午 4'], weeks: '1-16周', nature: '实践' },
  { id: 'te10', classId: 'c8', courseName: '汽车构造', facultyId: 'f7', venueId: 'v6', dayOfWeek: 4, periods: ['下午 1', '下午 2', '下午 3', '下午 4'], weeks: '1-14周', nature: '实践' },
]

// 排课节次定义（与排课节次配置对应）
export const allPeriods = [
  '早自习 1',
  '上午 1',
  '上午 2',
  '上午 3',
  '上午 4',
  '下午 1',
  '下午 2',
  '下午 3',
  '下午 4',
  '晚自习 1',
] as const

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

// ----- 11. 成绩认定 -----

export type GradeType = '平时' | '期中' | '期末' | '实践' | '总评' | '补考' | '重修'
export type GradeStatus = '待确认' | '待审核' | '待认定' | '已认定' | '已发布'
export type ApplyType = '课程替代' | '校外成绩认定' | '补考' | '重修' | '学分兑换' | '缓考'

export interface AuditRecord {
  step: number
  role: string
  action: '提交' | '确认' | '送审' | '审核通过' | '审核不通过' | '退回' | '认定' | '发布'
  operator: string
  date: string
  comment?: string
}

export interface GradeRecord {
  id: string
  studentId: string
  courseName: string
  gradeType: GradeType
  applyType: ApplyType
  rawScore: number
  recognizedScore: number
  credits: number
  gpa: number
  status: GradeStatus
  termId: string
  originalCourse?: string
  targetCourse?: string
  applyDate: string
  auditHistory: AuditRecord[]
}

export const gradeRecords: GradeRecord[] = [
  { id: 'g1', studentId: 's1', courseName: '程序设计基础', gradeType: '平时', applyType: '课程替代', rawScore: 85, recognizedScore: 85, credits: 4, gpa: 3.5, status: '已发布', termId: 't2', originalCourse: 'C语言程序设计', targetCourse: '程序设计基础', applyDate: '2026-05-10', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '李明', date: '2026-05-10', comment: '申请课程替代认定' },
    { step: 2, role: '教学秘书', action: '确认', operator: '周秘书', date: '2026-05-12', comment: '信息核对无误' },
    { step: 3, role: '教学秘书', action: '送审', operator: '周秘书', date: '2026-05-12' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '张院长', date: '2026-05-15', comment: '同意认定' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-05-18', comment: '予以认定' },
    { step: 6, role: '教务处', action: '发布', operator: '李处长', date: '2026-05-20' },
  ]},
  { id: 'g2', studentId: 's1', courseName: '程序设计基础', gradeType: '期末', applyType: '课程替代', rawScore: 88, recognizedScore: 88, credits: 4, gpa: 3.7, status: '已发布', termId: 't2', originalCourse: 'C语言程序设计', targetCourse: '程序设计基础', applyDate: '2026-05-10', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '李明', date: '2026-05-10' },
    { step: 2, role: '教学秘书', action: '确认', operator: '周秘书', date: '2026-05-12' },
    { step: 3, role: '教学秘书', action: '送审', operator: '周秘书', date: '2026-05-12' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '张院长', date: '2026-05-15' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-05-18' },
    { step: 6, role: '教务处', action: '发布', operator: '李处长', date: '2026-05-20' },
  ]},
  { id: 'g3', studentId: 's1', courseName: '程序设计基础', gradeType: '总评', applyType: '课程替代', rawScore: 87, recognizedScore: 87, credits: 4, gpa: 3.7, status: '已发布', termId: 't2', originalCourse: 'C语言程序设计', targetCourse: '程序设计基础', applyDate: '2026-05-10', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '李明', date: '2026-05-10' },
    { step: 2, role: '教学秘书', action: '确认', operator: '周秘书', date: '2026-05-12' },
    { step: 3, role: '教学秘书', action: '送审', operator: '周秘书', date: '2026-05-12' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '张院长', date: '2026-05-15' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-05-18' },
    { step: 6, role: '教务处', action: '发布', operator: '李处长', date: '2026-05-20' },
  ]},
  { id: 'g4', studentId: 's2', courseName: '数据结构', gradeType: '平时', applyType: '校外成绩认定', rawScore: 92, recognizedScore: 92, credits: 4, gpa: 4.0, status: '已发布', termId: 't2', originalCourse: '海外交换-数据结构', targetCourse: '数据结构', applyDate: '2026-04-20', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '王芳', date: '2026-04-20', comment: '海外交换成绩转换' },
    { step: 2, role: '教学秘书', action: '确认', operator: '吴秘书', date: '2026-04-22' },
    { step: 3, role: '教学秘书', action: '送审', operator: '吴秘书', date: '2026-04-22' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '张院长', date: '2026-04-25' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-04-28' },
    { step: 6, role: '教务处', action: '发布', operator: '李处长', date: '2026-05-01' },
  ]},
  { id: 'g5', studentId: 's5', courseName: '计算机网络', gradeType: '平时', applyType: '补考', rawScore: 78, recognizedScore: 78, credits: 3, gpa: 3.0, status: '已认定', termId: 't2', applyDate: '2026-06-05', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '陈静', date: '2026-06-05' },
    { step: 2, role: '教学秘书', action: '确认', operator: '王秘书', date: '2026-06-06' },
    { step: 3, role: '教学秘书', action: '送审', operator: '王秘书', date: '2026-06-06' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '李院长', date: '2026-06-08' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-06-10' },
  ]},
  { id: 'g6', studentId: 's5', courseName: '计算机网络', gradeType: '期末', applyType: '补考', rawScore: 82, recognizedScore: 82, credits: 3, gpa: 3.3, status: '待审核', termId: 't2', applyDate: '2026-06-05', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '陈静', date: '2026-06-05' },
    { step: 2, role: '教学秘书', action: '确认', operator: '王秘书', date: '2026-06-06' },
    { step: 3, role: '教学秘书', action: '送审', operator: '王秘书', date: '2026-06-06' },
  ]},
  { id: 'g7', studentId: 's6', courseName: '机械设计基础', gradeType: '总评', applyType: '重修', rawScore: 75, recognizedScore: 75, credits: 4, gpa: 2.7, status: '待确认', termId: 't2', applyDate: '2026-06-12', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '杨强', date: '2026-06-12', comment: '重修成绩认定申请' },
  ]},
  { id: 'g8', studentId: 's7', courseName: '会计学基础', gradeType: '平时', applyType: '课程替代', rawScore: 95, recognizedScore: 95, credits: 4, gpa: 4.0, status: '已发布', termId: 't1', originalCourse: '基础会计', targetCourse: '会计学基础', applyDate: '2026-03-15', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '黄丽', date: '2026-03-15' },
    { step: 2, role: '教学秘书', action: '确认', operator: '张秘书', date: '2026-03-16' },
    { step: 3, role: '教学秘书', action: '送审', operator: '张秘书', date: '2026-03-16' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '王院长', date: '2026-03-18' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-03-20' },
    { step: 6, role: '教务处', action: '发布', operator: '李处长', date: '2026-03-22' },
  ]},
  { id: 'g9', studentId: 's10', courseName: '汽车构造', gradeType: '总评', applyType: '缓考', rawScore: 68, recognizedScore: 68, credits: 4, gpa: 2.0, status: '待确认', termId: 't1', applyDate: '2026-06-01', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '吴磊', date: '2026-06-01', comment: '因病缓考成绩认定' },
  ]},
  { id: 'g10', studentId: 's12', courseName: '数据结构', gradeType: '期末', applyType: '学分兑换', rawScore: 90, recognizedScore: 90, credits: 4, gpa: 4.0, status: '已发布', termId: 't2', originalCourse: '慕课-数据结构', targetCourse: '数据结构', applyDate: '2026-05-01', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '孙雪', date: '2026-05-01', comment: '学分银行兑换' },
    { step: 2, role: '教学秘书', action: '确认', operator: '吴秘书', date: '2026-05-03' },
    { step: 3, role: '教学秘书', action: '送审', operator: '吴秘书', date: '2026-05-03' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '张院长', date: '2026-05-05' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-05-08' },
    { step: 6, role: '教务处', action: '发布', operator: '李处长', date: '2026-05-10' },
  ]},
  { id: 'g11', studentId: 's3', courseName: '高等数学', gradeType: '总评', applyType: '补考', rawScore: 72, recognizedScore: 72, credits: 5, gpa: 2.7, status: '待审核', termId: 't2', applyDate: '2026-06-08', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '张伟', date: '2026-06-08' },
    { step: 2, role: '教学秘书', action: '确认', operator: '周秘书', date: '2026-06-09' },
    { step: 3, role: '教学秘书', action: '送审', operator: '周秘书', date: '2026-06-09' },
  ]},
  { id: 'g12', studentId: 's4', courseName: '人工智能导论', gradeType: '平时', applyType: '校外成绩认定', rawScore: 88, recognizedScore: 88, credits: 3, gpa: 3.7, status: '待认定', termId: 't2', originalCourse: '企业实训-AI基础', targetCourse: '人工智能导论', applyDate: '2026-05-20', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '刘洋', date: '2026-05-20', comment: '企业实训成绩转换' },
    { step: 2, role: '教学秘书', action: '确认', operator: '郑秘书', date: '2026-05-21' },
    { step: 3, role: '教学秘书', action: '送审', operator: '郑秘书', date: '2026-05-21' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '张院长', date: '2026-05-23' },
  ]},
  { id: 'g13', studentId: 's13', courseName: '软件工程', gradeType: '期末', applyType: '重修', rawScore: 80, recognizedScore: 80, credits: 4, gpa: 3.3, status: '待确认', termId: 't2', applyDate: '2026-06-10', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '钱多多', date: '2026-06-10' },
  ]},
  { id: 'g14', studentId: 's9', courseName: '视觉设计', gradeType: '总评', applyType: '课程替代', rawScore: 86, recognizedScore: 86, credits: 3, gpa: 3.5, status: '已认定', termId: 't1', originalCourse: '平面设计基础', targetCourse: '视觉设计', applyDate: '2026-04-10', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '周敏', date: '2026-04-10' },
    { step: 2, role: '教学秘书', action: '确认', operator: '赵秘书', date: '2026-04-11' },
    { step: 3, role: '教学秘书', action: '送审', operator: '赵秘书', date: '2026-04-11' },
    { step: 4, role: '学院审核', action: '审核通过', operator: '赵院长', date: '2026-04-13' },
    { step: 5, role: '教务处', action: '认定', operator: '李处长', date: '2026-04-15' },
  ]},
  { id: 'g15', studentId: 's15', courseName: '市场营销', gradeType: '平时', applyType: '缓考', rawScore: 78, recognizedScore: 78, credits: 3, gpa: 3.0, status: '待审核', termId: 't2', applyDate: '2026-06-05', auditHistory: [
    { step: 1, role: '学生', action: '提交', operator: '徐凯', date: '2026-06-05' },
    { step: 2, role: '教学秘书', action: '确认', operator: '吴秘书', date: '2026-06-06' },
    { step: 3, role: '教学秘书', action: '送审', operator: '吴秘书', date: '2026-06-06' },
  ]},
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
  scenePassed: number
  sceneTotal: number
  degreeStatus: DegreeStatus
  badgeSynced: boolean
  auditHistory: AuditRecord[]
}

export const degreeRecognitions: DegreeRecognition[] = [
  { id: 'dr1', studentId: 's11', programId: 'tp1', totalCredits: 164, requiredCredits: 120, electiveCredits: 24, practiceCredits: 20, requiredPassed: 45, requiredTotal: 45, graduationDesignStatus: '合格', attendanceRate: 96, scenePassed: 12, sceneTotal: 12, degreeStatus: '符合毕业条件', badgeSynced: true, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核通过，学分、必修课、毕设、出勤率、场景任务均达标' },
    { step: 2, role: '院系初审', action: '审核通过', operator: '张院长', date: '2026-05-05', comment: '学生成绩合格，同意毕业' },
    { step: 3, role: '教务处复审', action: '审核通过', operator: '李处长', date: '2026-05-10', comment: '复核通过，符合毕业条件' },
  ]},
  { id: 'dr2', studentId: 's5', programId: 'tp3', totalCredits: 78, requiredCredits: 95, electiveCredits: 12, practiceCredits: 8, requiredPassed: 22, requiredTotal: 28, graduationDesignStatus: '不合格', attendanceRate: 85, scenePassed: 6, sceneTotal: 10, degreeStatus: '不符合毕业条件', badgeSynced: false, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核未通过，学分未达标、毕设未通过、场景任务未达标' },
  ]},
  { id: 'dr3', studentId: 's6', programId: 'tp1', totalCredits: 72, requiredCredits: 120, electiveCredits: 10, practiceCredits: 6, requiredPassed: 20, requiredTotal: 32, graduationDesignStatus: '不合格', attendanceRate: 78, scenePassed: 5, sceneTotal: 10, degreeStatus: '不符合毕业条件', badgeSynced: false, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核未通过，学分严重不足、必修课未达标、毕设未通过、出勤率不足' },
  ]},
  { id: 'dr4', studentId: 's1', programId: 'tp1', totalCredits: 160, requiredCredits: 120, electiveCredits: 22, practiceCredits: 18, requiredPassed: 45, requiredTotal: 45, graduationDesignStatus: '合格', attendanceRate: 92, scenePassed: 12, sceneTotal: 12, degreeStatus: '符合毕业条件', badgeSynced: true, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核通过' },
    { step: 2, role: '院系初审', action: '审核通过', operator: '张院长', date: '2026-05-05' },
    { step: 3, role: '教务处复审', action: '审核通过', operator: '李处长', date: '2026-05-10' },
  ]},
  { id: 'dr5', studentId: 's2', programId: 'tp1', totalCredits: 158, requiredCredits: 120, electiveCredits: 20, practiceCredits: 18, requiredPassed: 44, requiredTotal: 45, graduationDesignStatus: '合格', attendanceRate: 90, scenePassed: 11, sceneTotal: 12, degreeStatus: '不符合毕业条件', badgeSynced: false, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核未通过，必修课差1门未合格，场景任务差1项未达标' },
  ]},
  { id: 'dr6', studentId: 's7', programId: 'tp3', totalCredits: 165, requiredCredits: 120, electiveCredits: 25, practiceCredits: 20, requiredPassed: 45, requiredTotal: 45, graduationDesignStatus: '合格', attendanceRate: 98, scenePassed: 12, sceneTotal: 12, degreeStatus: '符合毕业条件', badgeSynced: true, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核通过' },
    { step: 2, role: '院系初审', action: '审核通过', operator: '王院长', date: '2026-05-05' },
    { step: 3, role: '教务处复审', action: '审核通过', operator: '李处长', date: '2026-05-10' },
  ]},
  { id: 'dr7', studentId: 's8', programId: 'tp3', totalCredits: 70, requiredCredits: 120, electiveCredits: 15, practiceCredits: 10, requiredPassed: 25, requiredTotal: 40, graduationDesignStatus: '不合格', attendanceRate: 72, scenePassed: 4, sceneTotal: 10, degreeStatus: '不符合毕业条件', badgeSynced: false, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核未通过，学分严重不足、必修课未达标、毕设未通过、出勤率不足、场景任务未达标' },
  ]},
  { id: 'dr8', studentId: 's9', programId: 'tp2', totalCredits: 162, requiredCredits: 120, electiveCredits: 24, practiceCredits: 18, requiredPassed: 45, requiredTotal: 45, graduationDesignStatus: '合格', attendanceRate: 94, scenePassed: 12, sceneTotal: 12, degreeStatus: '符合毕业条件', badgeSynced: true, auditHistory: [
    { step: 1, role: '系统', action: '提交', operator: '系统自动', date: '2026-05-01', comment: '预审核通过' },
    { step: 2, role: '院系初审', action: '审核通过', operator: '赵院长', date: '2026-05-05' },
    { step: 3, role: '教务处复审', action: '审核通过', operator: '李处长', date: '2026-05-10' },
  ]},
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
  periods: string[]
  weeks: string
  venueId: string
  venueName: string
  workStationId?: string
  workStationName?: string
  externalPlatformId?: string
  externalPlatformType?: 'course' | 'scene'
  courseVersion?: string
  resources: TaskResource[]
  syllabus?: string
  objectives?: string[]
  sceneSubTasks?: SceneSubTask[]
  progressSummary?: TaskProgressSummary
  gradeSummary?: TaskGradeSummary
  review?: TaskReview
  classSessions?: TaskClassSession[]
  studentGrades?: TaskStudentGrade[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  completedAt?: string
  archivedAt?: string
  prepContent?: TaskPrepContent
  evaluationConfig?: TaskEvaluationConfig
}

// ----- 备课内容（课前/课中/课后）-----

export interface TaskPrepContent {
  pre: {
    objectives?: string
    guidePlan?: string
    previewQuestions?: string[]
  }
  in: {
    coursewareResources?: TaskResource[]
    quizQuestions?: string[]
    discussionTopics?: string[]
  }
  post: {
    homework?: string
    quizQuestions?: string[]
    extensionResources?: string[]
  }
}

// ----- 测评配置 -----

export interface TaskEvalPoint {
  id: string
  name: string
  desc: string
  weight: number
  maxScore: number
  scoringMethod?: 'score' | 'level' | 'rubric'
  subType?: string
  types?: string[]
}

export interface TaskReviewStep {
  id: string
  label: string
  desc: string
  enabled: boolean
  subjectType: string | null
  weight: number
}

export interface TaskPaperConfig {
  paperId?: string
  duration?: number
  allowRetake?: boolean
  maxRetakeCount?: number
  shuffleQuestions?: boolean
  showScoreAfterSubmit?: boolean
  activationType?: 'manual' | 'scheduled' | 'immediate'
  activationTime?: string
}

export interface TaskMaterialConfig {
  requiresMaterial: boolean
  estimatedDays?: number
  formatRequirements?: string
  venueResources?: string
  allowResubmit?: boolean
}

export interface TaskQuestionBankConfig {
  questionIds: string[]
  randomCount?: number
  difficultyDistribution?: string
  timeLimit?: number
  allowRepeat?: boolean
  shuffleQuestions?: boolean
  showScoreAfterSubmit?: boolean
}

export interface TaskQuizConfig {
  questionIds: string[]
  randomCount?: number
  difficultyDistribution?: string
  timeLimit?: number
  allowRepeat?: boolean
  shuffleQuestions?: boolean
  showScoreAfterSubmit?: boolean
}

export interface TaskEvaluationConfig {
  enabledMethods: string[]
  evalPoints?: {
    randomDraw?: TaskEvalPoint[]
    review?: TaskEvalPoint[]
    paper?: TaskEvalPoint[]
    questionBank?: TaskEvalPoint[]
    outcome?: TaskEvalPoint[]
    homework?: TaskEvalPoint[]
    quiz?: TaskEvalPoint[]
  }
  reviewSteps?: TaskReviewStep[]
  paperConfig?: TaskPaperConfig
  questionBankConfig?: TaskQuestionBankConfig
  quizConfig?: TaskQuizConfig
  outcomeMaterial?: TaskMaterialConfig
  homeworkMaterial?: TaskMaterialConfig
}

// ----- 课堂记录（单次课堂教学的元数据）-----

export interface TaskClassSession {
  id: string
  taskId: string
  sessionNumber: number        // 第几次课
  scheduledDate: string        // 计划上课日期
  actualDate?: string          // 实际上课日期
  status: 'scheduled' | 'held' | 'cancelled' | 'makeup'
  attendanceCount: number      // 签到人数
  absentStudentIds: string[]   // 缺勤学生ID
  topic?: string               // 本节课主题
  notes?: string               // 课堂小结/异常记录
  resourcesUsed: string[]      // 使用的资源ID
  createdAt: string
}

// ----- 学生成绩明细（挂载在 Task 上，从外部平台回流）-----

export interface TaskStudentGrade {
  studentId: string
  studentName: string
  components: {
    type: 'usual' | 'midterm' | 'final' | 'practice' | 'total' | 'makeup' | 'retake'
    typeLabel: string
    score: number
    maxScore: number
    status: 'pending' | 'published'
    source: 'course_platform' | 'scene_platform' | 'manual'
    syncedAt?: string
  }[]
  totalScore?: number
  totalStatus: 'pending' | 'published'
}

// ----- 学生端任务视角 -----

export interface StudentTaskView {
  taskId: string
  taskName: string
  courseName: string
  type: TaskType
  status: 'published' | 'in_progress' | 'evaluating' | 'completed'
  dayOfWeek: number
  periods: string[]
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
  courseVersion?: string
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
      { id: 'cp-001', sequence: 0, timeSlot: 'morning', startTime: '07:30', endTime: '08:00', type: 'morning_self', name: '早自习 1' },
      { id: 'cp-002', sequence: 1, timeSlot: 'morning', startTime: '08:00', endTime: '08:45', type: 'class', name: '上午 1' },
      { id: 'cp-003', sequence: 2, timeSlot: 'morning', startTime: '08:55', endTime: '09:40', type: 'class', name: '上午 2' },
      { id: 'cp-004', sequence: 3, timeSlot: 'morning', startTime: '09:40', endTime: '10:10', type: 'break_big', name: '大课间' },
      { id: 'cp-005', sequence: 4, timeSlot: 'morning', startTime: '10:10', endTime: '10:55', type: 'class', name: '上午 3' },
      { id: 'cp-006', sequence: 5, timeSlot: 'morning', startTime: '11:05', endTime: '11:50', type: 'class', name: '上午 4' },
      { id: 'cp-007', sequence: 6, timeSlot: 'afternoon', startTime: '11:50', endTime: '14:00', type: 'lunch', name: '午休' },
      { id: 'cp-008', sequence: 7, timeSlot: 'afternoon', startTime: '14:00', endTime: '14:45', type: 'class', name: '下午 1' },
      { id: 'cp-009', sequence: 8, timeSlot: 'afternoon', startTime: '14:55', endTime: '15:40', type: 'class', name: '下午 2' },
      { id: 'cp-010', sequence: 9, timeSlot: 'afternoon', startTime: '15:50', endTime: '16:35', type: 'class', name: '下午 3' },
      { id: 'cp-011', sequence: 10, timeSlot: 'afternoon', startTime: '16:45', endTime: '17:30', type: 'class', name: '下午 4' },
      { id: 'cp-012', sequence: 11, timeSlot: 'evening', startTime: '18:30', endTime: '20:00', type: 'evening', name: '晚自习 1' },
    ],
  },
  {
    classId: 'c2',
    weekPattern: 'all',
    supportsSingleDouble: false,
    periods: [
      { id: 'cp-c2-001', sequence: 0, timeSlot: 'morning', startTime: '07:30', endTime: '08:00', type: 'morning_self', name: '早自习 1' },
      { id: 'cp-c2-002', sequence: 1, timeSlot: 'morning', startTime: '08:00', endTime: '08:45', type: 'class', name: '上午 1' },
      { id: 'cp-c2-003', sequence: 2, timeSlot: 'morning', startTime: '08:55', endTime: '09:40', type: 'class', name: '上午 2' },
      { id: 'cp-c2-004', sequence: 3, timeSlot: 'morning', startTime: '09:40', endTime: '10:10', type: 'break_big', name: '大课间' },
      { id: 'cp-c2-005', sequence: 4, timeSlot: 'morning', startTime: '10:10', endTime: '10:55', type: 'class', name: '上午 3' },
      { id: 'cp-c2-006', sequence: 5, timeSlot: 'morning', startTime: '11:05', endTime: '11:50', type: 'class', name: '上午 4' },
      { id: 'cp-c2-007', sequence: 6, timeSlot: 'afternoon', startTime: '11:50', endTime: '14:00', type: 'lunch', name: '午休' },
      { id: 'cp-c2-008', sequence: 7, timeSlot: 'afternoon', startTime: '14:00', endTime: '14:45', type: 'class', name: '下午 1' },
      { id: 'cp-c2-009', sequence: 8, timeSlot: 'afternoon', startTime: '14:55', endTime: '15:40', type: 'class', name: '下午 2' },
      { id: 'cp-c2-010', sequence: 9, timeSlot: 'afternoon', startTime: '15:50', endTime: '16:35', type: 'class', name: '下午 3' },
      { id: 'cp-c2-011', sequence: 10, timeSlot: 'afternoon', startTime: '16:45', endTime: '17:30', type: 'class', name: '下午 4' },
      { id: 'cp-c2-012', sequence: 11, timeSlot: 'evening', startTime: '18:30', endTime: '20:00', type: 'evening', name: '晚自习 1' },
    ],
  },
  {
    classId: 'c3',
    weekPattern: 'all',
    supportsSingleDouble: false,
    periods: [
      { id: 'cp-c3-001', sequence: 0, timeSlot: 'morning', startTime: '07:30', endTime: '08:00', type: 'morning_self', name: '早自习 1' },
      { id: 'cp-c3-002', sequence: 1, timeSlot: 'morning', startTime: '08:00', endTime: '08:45', type: 'class', name: '上午 1' },
      { id: 'cp-c3-003', sequence: 2, timeSlot: 'morning', startTime: '08:55', endTime: '09:40', type: 'class', name: '上午 2' },
      { id: 'cp-c3-004', sequence: 3, timeSlot: 'morning', startTime: '09:40', endTime: '10:10', type: 'break_big', name: '大课间' },
      { id: 'cp-c3-005', sequence: 4, timeSlot: 'morning', startTime: '10:10', endTime: '10:55', type: 'class', name: '上午 3' },
      { id: 'cp-c3-006', sequence: 5, timeSlot: 'morning', startTime: '11:05', endTime: '11:50', type: 'class', name: '上午 4' },
      { id: 'cp-c3-007', sequence: 6, timeSlot: 'afternoon', startTime: '11:50', endTime: '14:00', type: 'lunch', name: '午休' },
      { id: 'cp-c3-008', sequence: 7, timeSlot: 'afternoon', startTime: '14:00', endTime: '14:45', type: 'class', name: '下午 1' },
      { id: 'cp-c3-009', sequence: 8, timeSlot: 'afternoon', startTime: '14:55', endTime: '15:40', type: 'class', name: '下午 2' },
      { id: 'cp-c3-010', sequence: 9, timeSlot: 'afternoon', startTime: '15:50', endTime: '16:35', type: 'class', name: '下午 3' },
      { id: 'cp-c3-011', sequence: 10, timeSlot: 'afternoon', startTime: '16:45', endTime: '17:30', type: 'class', name: '下午 4' },
      { id: 'cp-c3-012', sequence: 11, timeSlot: 'evening', startTime: '18:30', endTime: '20:00', type: 'evening', name: '晚自习 1' },
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
    courseVersion: 'v2.1',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    classSessions: [
      { id: 'cs-001', taskId: 'task-001', sessionNumber: 1, scheduledDate: '2026-09-01', actualDate: '2026-09-01', status: 'held', attendanceCount: 40, absentStudentIds: ['s3'], topic: '课程导论与Java环境搭建', notes: '课堂气氛活跃，学生参与度高', resourcesUsed: ['tr-001'], createdAt: '2026-09-01' },
      { id: 'cs-002', taskId: 'task-001', sessionNumber: 2, scheduledDate: '2026-09-08', actualDate: '2026-09-08', status: 'held', attendanceCount: 41, absentStudentIds: [], topic: '变量与数据类型', notes: '', resourcesUsed: ['tr-001'], createdAt: '2026-09-08' },
      { id: 'cs-003', taskId: 'task-001', sessionNumber: 3, scheduledDate: '2026-09-15', actualDate: '2026-09-15', status: 'held', attendanceCount: 39, absentStudentIds: ['s2', 's3'], topic: '控制结构', notes: '随堂测验完成率90%', resourcesUsed: ['tr-001'], createdAt: '2026-09-15' },
      { id: 'cs-004', taskId: 'task-001', sessionNumber: 4, scheduledDate: '2026-09-22', actualDate: '2026-09-22', status: 'held', attendanceCount: 42, absentStudentIds: [], topic: '数组与字符串', notes: '', resourcesUsed: ['tr-001', 'tr-002'], createdAt: '2026-09-22' },
      { id: 'cs-005', taskId: 'task-001', sessionNumber: 5, scheduledDate: '2026-09-29', status: 'scheduled', attendanceCount: 0, absentStudentIds: [], resourcesUsed: [], createdAt: '2026-09-29' },
    ],
    studentGrades: [
      { studentId: 's1', studentName: '李明', components: [
        { type: 'usual', typeLabel: '平时', score: 85, maxScore: 100, status: 'published', source: 'course_platform', syncedAt: '2026-10-15T08:00:00Z' },
        { type: 'final', typeLabel: '期末', score: 88, maxScore: 100, status: 'pending', source: 'course_platform' },
      ], totalScore: 87, totalStatus: 'pending' },
      { studentId: 's2', studentName: '王芳', components: [
        { type: 'usual', typeLabel: '平时', score: 92, maxScore: 100, status: 'published', source: 'course_platform', syncedAt: '2026-10-15T08:00:00Z' },
        { type: 'final', typeLabel: '期末', score: 0, maxScore: 100, status: 'pending', source: 'course_platform' },
      ], totalStatus: 'pending' },
      { studentId: 's3', studentName: '张伟', components: [
        { type: 'usual', typeLabel: '平时', score: 78, maxScore: 100, status: 'published', source: 'course_platform', syncedAt: '2026-10-15T08:00:00Z' },
        { type: 'final', typeLabel: '期末', score: 0, maxScore: 100, status: 'pending', source: 'course_platform' },
      ], totalStatus: 'pending' },
    ],
    createdAt: '2026-08-15',
    updatedAt: '2026-10-15',
    publishedAt: '2026-08-25',
    prepContent: {
      pre: {
        objectives: '1. 了解Java语言的发展历史与应用领域\n2. 掌握JDK的安装与环境变量配置\n3. 理解变量、数据类型与运算符的基本概念',
        guidePlan: '通过导学案引导学生自主预习，阅读教材第1章内容，完成在线预习测验，观看Java环境搭建微课视频。',
        previewQuestions: ['Java语言的主要特点有哪些？', '什么是JDK、JRE和JVM？', 'Java中的基本数据类型有哪些？'],
      },
      in: {
        coursewareResources: [
          { id: 'tr-p101', taskId: 'task-001', name: '第1章 Java语言概述.pptx', type: 'ppt', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-20', sortOrder: 1 },
          { id: 'tr-p102', taskId: 'task-001', name: '第2章 变量与数据类型.pptx', type: 'ppt', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-21', sortOrder: 2 },
          { id: 'tr-p103', taskId: 'task-001', name: 'Java环境搭建演示视频.mp4', type: 'video', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-22', sortOrder: 3 },
        ],
        quizQuestions: ['int和Integer的区别是什么？', '以下代码的输出结果是什么？'],
        discussionTopics: ['Java与Python在实际开发中的选择', '面向对象编程的核心思想'],
      },
      post: {
        homework: '完成教材P45 编程题 1-5，提交至课程平台代码仓库',
        quizQuestions: ['课后巩固测验：变量与数据类型综合练习（共5题）'],
        extensionResources: ['推荐阅读：《Thinking in Java》第一章', '拓展视频：Java内存模型入门'],
      },
    },
    evaluationConfig: {
      enabledMethods: ['paper', 'quiz', 'homework', 'question_bank', 'random_draw', 'review', 'outcome'],
      evalPoints: {
        paper: [
          { id: 'ep-p101', name: '语法基础', desc: 'Java基本语法与数据类型', weight: 30, maxScore: 100, scoringMethod: 'score' },
          { id: 'ep-p102', name: '程序设计能力', desc: '独立完成简单程序设计', weight: 40, maxScore: 100, scoringMethod: 'score' },
          { id: 'ep-p103', name: '调试与排错', desc: '发现并修复程序中的错误', weight: 30, maxScore: 100, scoringMethod: 'score' },
        ],
        quiz: [
          { id: 'ep-q101', name: '课堂反应', desc: '随堂测正确率', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
        homework: [
          { id: 'ep-h101', name: '作业完成度', desc: '课后作业提交与质量', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
        questionBank: [
          { id: 'ep-qb101', name: '题库抽测', desc: '从题库随机抽题测评', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
        randomDraw: [
          { id: 'ep-rd-001', name: '现场反应', desc: '现场问答表现', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
        review: [
          { id: 'ep-rev-001', name: '评审表现', desc: '现场评审综合表现', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
        outcome: [
          { id: 'ep-out-001', name: '成果质量', desc: '成果评价综合质量', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
      },
      paperConfig: {
        paperId: 'paper-cs-001',
        duration: 120,
        allowRetake: true,
        maxRetakeCount: 2,
        shuffleQuestions: true,
        showScoreAfterSubmit: true,
        activationType: 'scheduled',
        activationTime: '2026-12-01T14:00:00',
      },
      quizConfig: {
        questionIds: ['q-cs-001', 'q-cs-002', 'q-cs-003'],
        randomCount: 3,
        timeLimit: 20,
        allowRepeat: true,
        shuffleQuestions: true,
        showScoreAfterSubmit: true,
      },
      questionBankConfig: {
        questionIds: ['qb-cs-001', 'qb-cs-002', 'qb-cs-003', 'qb-cs-004', 'qb-cs-005'],
        randomCount: 10,
        difficultyDistribution: '简单40% / 中等40% / 困难20%',
        timeLimit: 30,
        allowRepeat: false,
        shuffleQuestions: true,
        showScoreAfterSubmit: true,
      },
      homeworkMaterial: {
        requiresMaterial: true,
        estimatedDays: 5,
        formatRequirements: '源代码文件(.java) + 实验报告(.pdf)',
        allowResubmit: true,
      },
      reviewSteps: [
        { id: 'rs-cs-001', label: '初评', desc: '由指导教师进行第一轮评审', enabled: true, subjectType: 'teacher', weight: 50 },
        { id: 'rs-cs-002', label: '复评', desc: '由专家组进行第二轮复核', enabled: true, subjectType: 'teacher', weight: 50 },
      ],
      outcomeMaterial: {
        requiresMaterial: true,
        estimatedDays: 7,
        formatRequirements: '项目成果报告(.pdf) + 演示视频(.mp4)',
        allowResubmit: false,
      },
    },
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
    courseVersion: 'v1.8',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    periods: ['上午 1', '上午 2'],
    weeks: '1-16周',
    venueId: 'v1',
    venueName: 'A101 多媒体教室',
    resources: [
      { id: 'tr-003', taskId: 'task-002', name: '高等数学课程与能力目标', type: 'document', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-18', sortOrder: 1 },
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
    prepContent: {
      pre: {
        objectives: '1. 理解函数极限的定义与性质\n2. 掌握极限的运算法则\n3. 能够运用极限求解基本问题',
        guidePlan: '通过导学案引导学生自主预习，观看微课视频，完成预习测试题。',
        previewQuestions: ['函数极限的定义是什么？', '极限的四则运算法则有哪些？', '无穷小量与无穷大量的关系？'],
      },
      in: {
        coursewareResources: [
          { id: 'tr-p001', taskId: 'task-002', name: '第5章 极限与连续.pptx', type: 'ppt', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-20', sortOrder: 1 },
          { id: 'tr-p002', taskId: 'task-002', name: '极限计算演示视频.mp4', type: 'video', url: '#', isVisibleToStudents: true, uploadBy: 'f1', uploadedAt: '2026-08-21', sortOrder: 2 },
        ],
        quizQuestions: ['lim(x→0) sinx/x = ?', '判断下列极限是否存在'],
        discussionTopics: ['生活中的极限现象举例', '无穷小量在实际问题中的应用'],
      },
      post: {
        homework: '完成教材P128 习题 1-10，提交至课程平台',
        quizQuestions: ['课后巩固测验：极限综合练习（共5题）'],
        extensionResources: ['推荐阅读：《数学分析》第三章', '拓展视频：洛必达法则进阶'],
      },
    },
    evaluationConfig: {
      enabledMethods: ['paper', 'quiz', 'homework'],
      evalPoints: {
        paper: [
          { id: 'ep-p001', name: '基础知识掌握', desc: '考察函数极限基本概念', weight: 40, maxScore: 100, scoringMethod: 'score' },
          { id: 'ep-p002', name: '计算能力', desc: '极限计算准确性', weight: 35, maxScore: 100, scoringMethod: 'score' },
          { id: 'ep-p003', name: '综合应用', desc: '运用极限解决实际问题', weight: 25, maxScore: 100, scoringMethod: 'score' },
        ],
        quiz: [
          { id: 'ep-q001', name: '课堂反应', desc: '随堂测正确率', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
        homework: [
          { id: 'ep-h001', name: '作业完成度', desc: '课后作业提交与质量', weight: 100, maxScore: 100, scoringMethod: 'score' },
        ],
      },
      paperConfig: {
        paperId: 'paper-math-001',
        duration: 90,
        allowRetake: false,
        shuffleQuestions: true,
        showScoreAfterSubmit: true,
        activationType: 'scheduled',
        activationTime: '2026-11-01T09:00:00',
      },
      quizConfig: {
        questionIds: ['q-001', 'q-002'],
        randomCount: 2,
        timeLimit: 15,
        allowRepeat: false,
        shuffleQuestions: true,
        showScoreAfterSubmit: true,
      },
      homeworkMaterial: {
        requiresMaterial: true,
        estimatedDays: 3,
        formatRequirements: 'PDF格式，手写扫描或电子文档均可',
        allowResubmit: true,
      },
    },
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
    courseVersion: 'v2.5',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    periods: ['下午 3', '下午 4'],
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
    courseVersion: 'v3.1',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    enterpriseMentorId: 'f3',
    enterpriseMentorName: '王志强',
    dayOfWeek: 3,
    periods: ['下午 1', '下午 2', '下午 3', '下午 4'],
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
    classSessions: [
      { id: 'cs-101', taskId: 'task-004', sessionNumber: 1, scheduledDate: '2026-10-08', actualDate: '2026-10-08', status: 'held', attendanceCount: 40, absentStudentIds: ['s3'], topic: '场景一：需求分析与原型设计', notes: '企业导师现场指导，学生分组完成需求文档', resourcesUsed: ['tr-005'], createdAt: '2026-10-08' },
      { id: 'cs-102', taskId: 'task-004', sessionNumber: 2, scheduledDate: '2026-10-15', actualDate: '2026-10-15', status: 'held', attendanceCount: 41, absentStudentIds: ['s2'], topic: '场景二：系统架构设计', notes: '使用架构设计工具进行实战演练', resourcesUsed: ['tr-006'], createdAt: '2026-10-15' },
      { id: 'cs-103', taskId: 'task-004', sessionNumber: 3, scheduledDate: '2026-10-22', status: 'scheduled', attendanceCount: 0, absentStudentIds: [], topic: '场景三：编码实现与测试', resourcesUsed: [], createdAt: '2026-10-22' },
    ],
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
    courseVersion: 'v1.9',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    periods: ['下午 1', '下午 2'],
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
    name: '软件开发工程师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '软件开发工程师',
    courseCode: 'J001',
    courseVersion: 'v1.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v3.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f8',
    facultyName: '陈秀英',
    dayOfWeek: 4,
    periods: ['上午 3', '上午 4'],
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
    name: '系统架构师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '系统架构师',
    courseCode: 'J012',
    courseVersion: 'v2.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    periods: ['下午 3', '下午 4'],
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
    name: '软件开发工程师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '软件开发工程师',
    courseCode: 'J001',
    courseVersion: 'v1.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.2',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.5',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 5,
    periods: ['上午 3', '上午 4'],
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
    name: '产品经理',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '产品经理',
    courseCode: 'J013',
    courseVersion: 'v1.2',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    periods: ['下午 1', '下午 2'],
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
    name: '数据分析师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '数据分析师',
    courseCode: 'J015',
    courseVersion: 'v1.1',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f10',
    facultyName: '郑雅琴',
    dayOfWeek: 4,
    periods: ['上午 1', '上午 2'],
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
    name: '软件开发工程师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '软件开发工程师',
    courseCode: 'J001',
    courseVersion: 'v2.1',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    periods: ['上午 1', '上午 2'],
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
    name: '网络系统集成工程师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络系统集成工程师',
    courseCode: 'J007',
    courseVersion: 'v1.3',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    periods: ['下午 3', '下午 4'],
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
    courseVersion: 'v1.7',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    periods: ['下午 3', '下午 4'],
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
    courseVersion: 'v3.1',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f10',
    facultyName: '郑雅琴',
    dayOfWeek: 5,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v2.2',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f8',
    facultyName: '陈秀英',
    dayOfWeek: 1,
    periods: ['下午 3', '下午 4'],
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
    courseVersion: 'v2.1',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.8',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v2.5',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v3.1',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.7',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.5',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v2.5',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 5,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 2,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f4',
    facultyName: '李红梅',
    dayOfWeek: 2,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f4',
    facultyName: '李红梅',
    dayOfWeek: 3,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f9',
    facultyName: '孙伟',
    dayOfWeek: 4,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f5',
    facultyName: '张大伟',
    dayOfWeek: 1,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f5',
    facultyName: '张大伟',
    dayOfWeek: 2,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f8',
    facultyName: '陈秀英',
    dayOfWeek: 4,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 3,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 5,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 1,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 2,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 3,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 2,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    periods: ['上午 1', '上午 2'],
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
    name: '网络系统集成工程师',
    type: 'scene',
    source: 'imported',
    status: 'published',
    termId: 't1',
    courseName: '网络系统集成工程师',
    courseCode: 'J007',
    courseVersion: 'v1.3',
    classId: 'c9',
    className: '计算机网络技术2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 5,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v2.1',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.7',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 4,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v3.1',
    classId: 'c10',
    className: '计算机科学与技术2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 5,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 1,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v2.0',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 3,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c11',
    className: '数据科学2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 4,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v2.1',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 1,
    periods: ['下午 1', '下午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 2,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 3,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c12',
    className: '物联网工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 5,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 2,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v2.3',
    classId: 'c3',
    className: '人工智能2026级1班',
    facultyId: 'f2',
    facultyName: '吴晓敏',
    dayOfWeek: 4,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c5',
    className: '机械设计2025级1班',
    facultyId: 'f4',
    facultyName: '李红梅',
    dayOfWeek: 1,
    periods: ['下午 1', '下午 2', '下午 3', '下午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c6',
    className: '会计2026级1班',
    facultyId: 'f5',
    facultyName: '张大伟',
    dayOfWeek: 3,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.0',
    classId: 'c7',
    className: '视觉传达2025级1班',
    facultyId: 'f6',
    facultyName: '赵丽华',
    dayOfWeek: 2,
    periods: ['下午 1', '下午 2', '下午 3', '下午 4'],
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
    courseVersion: 'v1.0',
    classId: 'c8',
    className: '汽车维修2026级1班',
    facultyId: 'f7',
    facultyName: '刘建国',
    dayOfWeek: 4,
    periods: ['下午 1', '下午 2', '下午 3', '下午 4'],
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
    courseVersion: 'v2.1',
    classId: 'c2',
    className: '软件工程2026级2班',
    facultyId: 'f1',
    facultyName: '周建国',
    dayOfWeek: 3,
    periods: ['上午 1', '上午 2'],
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
    courseVersion: 'v1.9',
    classId: 'c4',
    className: '计算机网络2025级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    dayOfWeek: 4,
    periods: ['上午 3', '上午 4'],
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
    courseVersion: 'v2.1',
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
    courseVersion: 'v1.8',
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
    courseVersion: 'v2.0',
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
  { id: 'cc-001', name: '程序设计基础', code: 'CS101', hours: 64, nature: '必修', assessment: '考试', version: 'v2.1', batch: '2026春', creator: '当前用户', updatedAt: '2026-03-15' },
  { id: 'cc-002', name: '高等数学', code: 'MATH101', hours: 64, nature: '必修', assessment: '考试', version: 'v1.8', batch: '2026春', creator: '李教授', updatedAt: '2026-02-20' },
  { id: 'cc-003', name: '线性代数', code: 'MATH102', hours: 48, nature: '必修', assessment: '考试', version: 'v1.5', batch: '2026春', creator: '当前用户', updatedAt: '2026-03-01' },
  { id: 'cc-004', name: '概率论与数理统计', code: 'MATH103', hours: 48, nature: '必修', assessment: '考试', version: 'v2.0', batch: '2026秋', creator: '李教授', updatedAt: '2026-08-10' },
  { id: 'cc-005', name: '大学物理', code: 'PHY101', hours: 64, nature: '必修', assessment: '考试', version: 'v1.3', batch: '2026春', creator: '赵教授', updatedAt: '2026-01-18' },
  { id: 'cc-006', name: '大学英语', code: 'ENG101', hours: 64, nature: '必修', assessment: '考试', version: 'v3.0', batch: '2026春', creator: '刘老师', updatedAt: '2026-03-05' },
  { id: 'cc-007', name: '体育与健康', code: 'PE101', hours: 32, nature: '必修', assessment: '考查', version: 'v1.0', batch: '2026春', creator: '陈老师', updatedAt: '2026-02-01' },
  { id: 'cc-008', name: '思想政治', code: 'POL101', hours: 32, nature: '必修', assessment: '考查', version: 'v2.2', batch: '2026春', creator: '孙教授', updatedAt: '2026-03-12' },
  { id: 'cc-009', name: '数据结构', code: 'CS102', hours: 64, nature: '必修', assessment: '考试', version: 'v2.5', batch: '2026秋', creator: '当前用户', updatedAt: '2026-08-20' },
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
  { id: 'cp-001', name: '软件开发工程师', code: 'PRAC001', hours: 32, nature: '实践', assessment: '报告', version: 'v1.0', batch: '2026春', creator: '周老师', updatedAt: '2026-03-01' },
  { id: 'cp-002', name: '系统架构师', code: 'PRAC002', hours: 64, nature: '实践', assessment: '作品', version: 'v2.0', batch: '2026秋', creator: '吴老师', updatedAt: '2026-08-15' },
  { id: 'cp-003', name: '项目经理', code: 'PRAC003', hours: 128, nature: '实践', assessment: '鉴定', version: 'v1.5', batch: '2027春', creator: '郑老师', updatedAt: '2027-01-20' },
  { id: 'cp-004', name: '系统架构师', code: 'PRAC004', hours: 192, nature: '实践', assessment: '答辩', version: 'v3.0', batch: '2028秋', creator: '王老师', updatedAt: '2028-09-01' },
  { id: 'cp-005', name: '产品经理', code: 'PRAC005', hours: 64, nature: '实践', assessment: '作品', version: 'v1.2', batch: '2027春', creator: '李老师', updatedAt: '2027-03-10' },
  { id: 'cp-006', name: '软件开发工程师', code: 'PRAC006', hours: 64, nature: '实践', assessment: '作品', version: 'v1.0', batch: '2027秋', creator: '陈老师', updatedAt: '2027-08-25' },
  { id: 'cp-007', name: '软件开发工程师', code: 'PRAC007', hours: 96, nature: '实践', assessment: '作品', version: 'v2.1', batch: '2026秋', creator: '赵老师', updatedAt: '2026-09-12' },
  { id: 'cp-008', name: '网络系统集成工程师', code: 'PRAC008', hours: 64, nature: '实践', assessment: '作品', version: 'v1.3', batch: '2027春', creator: '孙老师', updatedAt: '2027-02-28' },
  { id: 'cp-009', name: '数据分析师', code: 'PRAC009', hours: 64, nature: '实践', assessment: '报告', version: 'v1.1', batch: '2027秋', creator: '钱老师', updatedAt: '2027-08-18' },
  { id: 'cp-010', name: '人工智能工程师', code: 'PRAC010', hours: 96, nature: '实践', assessment: '答辩', version: 'v2.0', batch: '2028春', creator: '马老师', updatedAt: '2028-01-15' },
]

// 已绑定的实践场景（初始为空）
export const boundPractices: CurriculumItem[] = []


// ==================== 学生能力档案管理模拟数据 ====================

export const MOCK_STUDENTS = [
  { name: '张三', id: '2021001', className: '2021级全栈开发1班' },
  { name: '李四', id: '2021002', className: '2021级全栈开发1班' },
  { name: '王五', id: '2021003', className: '2021级后端开发1班' },
  { name: '赵六', id: '2021004', className: '2021级前端开发1班' },
  { name: '孙七', id: '2021005', className: '2021级全栈开发1班' },
  { name: '周八', id: '2021006', className: '2021级后端开发1班' },
  { name: '吴九', id: '2021007', className: '2021级前端开发1班' },
  { name: '郑十', id: '2021008', className: '2021级全栈开发1班' },
  { name: '钱十一', id: '2021009', className: '2021级后端开发1班' },
  { name: '冯十二', id: '2021010', className: '2021级前端开发1班' },
  { name: '陈十三', id: '2021011', className: '2021级全栈开发1班' },
  { name: '褚十四', id: '2021012', className: '2021级后端开发1班' },
  { name: '卫十五', id: '2021013', className: '2021级前端开发1班' },
  { name: '蒋十六', id: '2021014', className: '2021级全栈开发1班' },
  { name: '沈十七', id: '2021015', className: '2021级后端开发1班' },
  { name: '韩十八', id: '2021016', className: '2021级前端开发1班' },
  { name: '杨十九', id: '2021017', className: '2021级全栈开发1班' },
  { name: '朱二十', id: '2021018', className: '2021级后端开发1班' },
  { name: '秦二十一', id: '2021019', className: '2021级前端开发1班' },
  { name: '尤二十二', id: '2021020', className: '2021级全栈开发1班' },
]

export const mockStudentAbilityArchives: import('@/lib/types').StudentAbilityArchive[] = [
  {
    id: 'sp-arch-1',
    studentName: '张三',
    studentId: '2021001',
    className: '2021级全栈开发1班',
    materialType: 'certificate',
    materialName: 'AWS云从业者认证',
    issuingOrg: 'Amazon Web Services',
    obtainDate: new Date('2024-01-15'),
    auditStatus: 'approved',
    convertedCredit: 1.5,
    direction: 'positive',
    isVisible: true,
    createdAt: new Date('2024-01-20'),
    level: '国际认证',
  },
  {
    id: 'sp-arch-2',
    studentName: '张三',
    studentId: '2021001',
    className: '2021级全栈开发1班',
    materialType: 'competition',
    materialName: '全国大学生程序设计竞赛金奖',
    issuingOrg: '中国计算机学会',
    obtainDate: new Date('2023-11-10'),
    auditStatus: 'approved',
    convertedCredit: 2.0,
    direction: 'positive',
    isVisible: true,
    createdAt: new Date('2023-11-15'),
    level: '国家级一等奖',
  },
  {
    id: 'sp-arch-3',
    studentName: '李四',
    studentId: '2021002',
    className: '2021级全栈开发1班',
    materialType: 'internship',
    materialName: '字节跳动前端开发实习证明',
    issuingOrg: '字节跳动',
    obtainDate: new Date('2024-02-01'),
    auditStatus: 'pending',
    convertedCredit: 0,
    direction: 'positive',
    isVisible: true,
    createdAt: new Date('2024-02-05'),
    level: '知名企业3个月以上',
  },
  {
    id: 'sp-arch-4',
    studentName: '王五',
    studentId: '2021003',
    className: '2021级后端开发1班',
    materialType: 'skill',
    materialName: 'Redis高级应用培训证书',
    issuingOrg: '某培训机构',
    obtainDate: new Date('2024-03-10'),
    auditStatus: 'rejected',
    auditRemark: '培训机构不在认证白名单中',
    convertedCredit: 0,
    direction: 'positive',
    isVisible: true,
    createdAt: new Date('2024-03-12'),
    level: '培训合格',
  },
  {
    id: 'sp-arch-5',
    studentName: '赵六',
    studentId: '2021004',
    className: '2021级前端开发1班',
    materialType: 'activity',
    materialName: '校级优秀志愿者',
    issuingOrg: '校团委',
    obtainDate: new Date('2023-09-01'),
    auditStatus: 'approved',
    convertedCredit: 0.5,
    direction: 'positive',
    isVisible: true,
    createdAt: new Date('2023-09-05'),
    level: '校级优秀志愿者',
  },
  {
    id: 'sp-arch-6',
    studentName: '赵六',
    studentId: '2021004',
    className: '2021级前端开发1班',
    materialType: 'certificate',
    materialName: '考试违纪记录',
    issuingOrg: '教务处',
    obtainDate: new Date('2023-12-15'),
    auditStatus: 'approved',
    convertedCredit: -1.0,
    direction: 'negative',
    isVisible: false,
    createdAt: new Date('2023-12-16'),
  },
]

export const mockCreditConversionRules: import('@/lib/types').CreditConversionRule[] = [
  { id: 'ccr-1', materialType: 'certificate', level: '国家级', credit: 2.0 },
  { id: 'ccr-2', materialType: 'certificate', level: '省级', credit: 1.5 },
  { id: 'ccr-3', materialType: 'certificate', level: '校级', credit: 0.5 },
  { id: 'ccr-4', materialType: 'competition', level: '国家级一等奖', credit: 2.0 },
  { id: 'ccr-5', materialType: 'competition', level: '国家级二等奖', credit: 1.5 },
  { id: 'ccr-6', materialType: 'competition', level: '省级一等奖', credit: 1.0 },
  { id: 'ccr-7', materialType: 'internship', level: '知名企业3个月以上', credit: 1.5 },
  { id: 'ccr-8', materialType: 'activity', level: '校级优秀志愿者', credit: 0.5 },
]

export const mockArchiveVersions: import('@/lib/types').ArchiveVersion[] = [
  { id: 'ver-1', archiveId: 'sp-arch-1', version: 1, changedBy: '张三', changeSummary: '上传开题报告v1', createdAt: new Date('2024-03-10') },
  { id: 'ver-2', archiveId: 'sp-arch-1', version: 2, changedBy: '张教授', changeSummary: '批注修改意见', createdAt: new Date('2024-03-12') },
  { id: 'ver-3', archiveId: 'sp-arch-1', version: 3, changedBy: '张三', changeSummary: '上传开题报告v2', createdAt: new Date('2024-03-15') },
]


// ============================================
// 阶段一新增：教学大纲 / 教学计划 / 备课 / 开课 数据模型
// ============================================

// ----- 教学大纲 -----

export interface SyllabusObjective {
  id: string
  dimension: '知识' | '能力' | '素养'
  content: string
  level: '了解' | '理解' | '掌握' | '熟练' | '精通'
}

export interface SyllabusChapter {
  id: string
  name: string
  hours: number
  theoryHours: number
  practiceHours: number
  content: string
  teachingMethod: string
  keyPoints: string
  difficultPoints: string
  semester?: number
}

export type SyllabusStatus = 'draft' | 'generated' | 'editing' | 'finalized'
export type SyllabusType = 'theory' | 'practice' | 'scene'

export interface Syllabus {
  id: string
  programId: string
  courseId: string
  courseName: string
  courseCode: string
  type: SyllabusType
  credits: number
  totalHours: number
  theoryHours: number
  practiceHours: number
  applicableMajorIds: string[]
  objectives: SyllabusObjective[]
  chapters: SyllabusChapter[]
  /** 简化教学目标（富文本） */
  objectivesText?: string
  /** 简化教学内容（富文本） */
  chaptersText?: string
  /** 教学条件（富文本） */
  teachingConditions?: string
  teachingMethods: string
  assessmentMethod: string
  assessmentWeight: {
    usual: number
    midterm: number
    final: number
    practice: number
  }
  textbooks: string[]
  references: string[]
  status: SyllabusStatus
  version: string
  createdAt: string
  updatedAt: string
  generatorLog?: string
  semesterList?: number[]
}

// 场景大纲扩展
export interface SceneSyllabus extends Syllabus {
  type: 'scene'
  mappedPositionId: string
  mappedPositionName: string
  taskChain: {
    id: string
    name: string
    order: number
    mappedAbilityIds: string[]
    hours: number
    evaluationRuleId?: string
  }[]
  evaluationRubric: string
  workstationType: string
  equipmentList: string[]
  enterpriseMentorRequired: boolean
}

// ----- 教学计划 -----

export type WeekPattern = 'all' | 'odd' | 'even' | 'intensive'

export interface PlanCourseEntry {
  id: string
  courseId: string
  courseName: string
  courseCode: string
  type: 'theory' | 'practice' | 'scene'
  nature: '必修' | '选修' | '实践' | '场景'
  courseTypeLabel?: string
  credits: number
  totalHours: number
  semester: number
  weekHours: number
  startWeek: number
  endWeek: number
  weekPattern: WeekPattern
  assignedClassIds: string[]
  preferredFacultyIds: string[]
  venueTypeRequired: '教室' | '机房' | '实训室' | '实验室' | '校外基地'
  syllabusId: string
  status: 'planned' | 'confirmed' | 'scheduled'
  teacherType?: '校本师资' | '企业导师'
  teacherId?: string
  teacherName?: string
}

export interface TeachingPlan {
  id: string
  programId: string
  programName: string
  majorId: string
  entryYear: number
  totalSemesters: number
  entries: PlanCourseEntry[]
  status: 'draft' | 'generated' | 'adjusting' | 'confirmed'
  generatedAt: string
  confirmedAt?: string
  generatorLog?: string
}

// ----- 备课 -----

export type PreparationStage = 'pre' | 'in' | 'post'
export type PreparationStatus = 'pending' | 'in_progress' | 'completed' | 'submitted'

export interface PreparationResource {
  id: string
  name: string
  type: 'document' | 'video' | 'ppt' | 'link' | 'quiz' | 'scene_link' | 'equipment'
  url?: string
  description?: string
  stage: PreparationStage
}

export interface PreparationActivity {
  id: string
  name: string
  type: 'discussion' | 'quiz' | 'task' | 'group_work' | 'demo' | 'practice'
  description: string
  duration: number
  stage: PreparationStage
}

export interface PreparationTask {
  id: string
  taskId: string
  taskName: string
  taskType: 'traditional' | 'scene'
  courseName: string
  classId: string
  className: string
  facultyId: string
  facultyName: string
  status: PreparationStatus
  progress: number
  stages: {
    pre: {
      objectives: string[]
      resources: PreparationResource[]
      activities: PreparationActivity[]
      guidePlan: string
      previewQuestions: string[]
    }
    in: {
      resources: PreparationResource[]
      activities: PreparationActivity[]
      coursewareResources: PreparationResource[]
      quizQuestions: string[]
      discussionTopics: string[]
    }
    post: {
      resources: PreparationResource[]
      activities: PreparationActivity[]
      homework: string
      quizQuestions: string[]
      extensionResources: PreparationResource[]
    }
  }
  // 场景备课特有
  scenePrep?: {
    externalPlatformId?: string
    subTaskPreparations: {
      subTaskId: string
      subTaskName: string
      description?: string
      abilityPointIds: string[]
      evaluationRubricId: string
      workstationId?: string
      equipmentChecklist: string[]
      safetyRequirements: string
      enterpriseMentorNotes: string
      mentorSchedule?: {
        participationType: 'onsite' | 'remote' | 'async'
        timeSlot: string
      }
    }[]
  }
  // 课程备课特有
  coursePrep?: {
    externalPlatformId?: string
    knowledgePointIds: string[]
    syllabusChapterMapping: { chapterId: string; sessionIndex: number }[]
  }
  submittedAt?: string
  reviewedAt?: string
  reviewNotes?: string
}

// ----- 开课 -----

export type LaunchStatus = 'ready' | 'launching' | 'launched' | 'withdrawn' | 'ended'

export interface CourseLaunchRecord {
  id: string
  taskId: string
  taskName: string
  taskType: 'traditional' | 'scene'
  courseName: string
  classId: string
  className: string
  facultyId: string
  facultyName: string
  venueId: string
  venueName: string
  dayOfWeek: number
  periods: number[]
  weeks: string
  launchStatus: LaunchStatus
  prepStatus: PreparationStatus
  checklist: {
    prepCompleted: boolean
    venueConfirmed: boolean
    studentsNotified: boolean
    materialsReady: boolean
    equipmentChecked?: boolean
  }
  launchedAt?: string
  endedAt?: string
  studentVisibility: boolean
  notes: string
}

// ============================================
// Mock 数据：教学大纲
// ============================================

export const syllabuses: Syllabus[] = [
  {
    id: 'syl-001',
    programId: 'tp1',
    courseId: 'c-1717000000000-1',
    courseName: '程序设计基础',
    courseCode: 'CS101',
    type: 'theory',
    credits: 4,
    totalHours: 64,
    theoryHours: 48,
    practiceHours: 16,
    applicableMajorIds: ['m1'],
    objectives: [
      { id: 'obj-1', dimension: '知识', content: '掌握程序设计的基本概念和语法', level: '掌握' },
      { id: 'obj-2', dimension: '能力', content: '能够独立编写和调试简单程序', level: '熟练' },
      { id: 'obj-3', dimension: '素养', content: '培养逻辑思维和问题分析能力', level: '掌握' },
    ],
    chapters: [
      { id: 'ch-1', name: '程序设计概述', hours: 4, theoryHours: 4, practiceHours: 0, content: '程序设计语言的发展、特点和应用', teachingMethod: '讲授+讨论', keyPoints: '程序设计的基本概念', difficultPoints: '编译与解释的区别' },
      { id: 'ch-2', name: '数据类型与运算符', hours: 8, theoryHours: 6, practiceHours: 2, content: '基本数据类型、变量、常量、运算符', teachingMethod: '讲授+实验', keyPoints: '数据类型的选择', difficultPoints: '类型转换' },
      { id: 'ch-3', name: '控制结构', hours: 12, theoryHours: 8, practiceHours: 4, content: '顺序、选择、循环结构', teachingMethod: '讲授+案例', keyPoints: '循环结构的应用', difficultPoints: '嵌套循环' },
      { id: 'ch-4', name: '数组与字符串', hours: 10, theoryHours: 6, practiceHours: 4, content: '一维数组、二维数组、字符串处理', teachingMethod: '讲授+实验', keyPoints: '数组的存储与访问', difficultPoints: '字符串操作' },
      { id: 'ch-5', name: '函数与模块化', hours: 12, theoryHours: 8, practiceHours: 4, content: '函数定义、调用、参数传递、递归', teachingMethod: '案例教学', keyPoints: '函数的声明与调用', difficultPoints: '递归算法' },
      { id: 'ch-6', name: '指针与引用', hours: 10, theoryHours: 8, practiceHours: 2, content: '指针概念、指针运算、动态内存', teachingMethod: '讲授+实验', keyPoints: '指针与数组的关系', difficultPoints: '多级指针' },
      { id: 'ch-7', name: '文件操作', hours: 8, theoryHours: 4, practiceHours: 4, content: '文件的打开、读写、关闭', teachingMethod: '项目驱动', keyPoints: '文件读写模式', difficultPoints: '二进制文件操作' },
    ],
    teachingMethods: '讲授法、案例教学法、项目驱动法、翻转课堂',
    assessmentMethod: '平时成绩30% + 期中考试20% + 期末上机考试50%',
    assessmentWeight: { usual: 30, midterm: 20, final: 50, practice: 0 },
    textbooks: ['《C程序设计（第五版）》，谭浩强，清华大学出版社'],
    references: ['《C Primer Plus（第6版）》，Stephen Prata'],
    status: 'finalized',
    version: 'v1.0',
    createdAt: '2025-01-15',
    updatedAt: '2025-02-20',
  },
  {
    id: 'syl-002',
    programId: 'tp1',
    courseId: 'c-1717000000000-2',
    courseName: '高等数学',
    courseCode: 'MATH101',
    type: 'theory',
    credits: 4,
    totalHours: 64,
    theoryHours: 64,
    practiceHours: 0,
    applicableMajorIds: ['m1'],
    objectives: [
      { id: 'obj-1', dimension: '知识', content: '掌握微积分、级数等基本理论', level: '掌握' },
      { id: 'obj-2', dimension: '能力', content: '能够运用数学工具解决工程问题', level: '熟练' },
    ],
    chapters: [
      { id: 'ch-1', name: '函数与极限', hours: 12, theoryHours: 12, practiceHours: 0, content: '函数概念、极限定义、无穷小与无穷大', teachingMethod: '讲授+练习', keyPoints: '极限的计算方法', difficultPoints: 'ε-δ定义' },
      { id: 'ch-2', name: '导数与微分', hours: 14, theoryHours: 14, practiceHours: 0, content: '导数概念、求导法则、微分应用', teachingMethod: '讲授+练习', keyPoints: '复合函数求导', difficultPoints: '隐函数求导' },
      { id: 'ch-3', name: '中值定理与导数应用', hours: 10, theoryHours: 10, practiceHours: 0, content: '罗尔定理、拉格朗日定理、泰勒公式', teachingMethod: '讲授+讨论', keyPoints: '洛必达法则', difficultPoints: '泰勒展开' },
      { id: 'ch-4', name: '不定积分', hours: 10, theoryHours: 10, practiceHours: 0, content: '积分概念、换元法、分部积分', teachingMethod: '讲授+练习', keyPoints: '基本积分公式', difficultPoints: '三角换元' },
      { id: 'ch-5', name: '定积分', hours: 12, theoryHours: 12, practiceHours: 0, content: '定积分概念、应用、广义积分', teachingMethod: '讲授+应用案例', keyPoints: '牛顿-莱布尼茨公式', difficultPoints: '广义积分收敛性' },
      { id: 'ch-6', name: '级数', hours: 6, theoryHours: 6, practiceHours: 0, content: '数项级数、幂级数、傅里叶级数', teachingMethod: '讲授', keyPoints: '收敛判别法', difficultPoints: '一致收敛' },
    ],
    teachingMethods: '讲授法、习题课、翻转课堂',
    assessmentMethod: '平时成绩20% + 期中考试30% + 期末考试50%',
    assessmentWeight: { usual: 20, midterm: 30, final: 50, practice: 0 },
    textbooks: ['《高等数学（第七版）》，同济大学数学系，高等教育出版社'],
    references: ['《数学分析》，华东师范大学数学系'],
    status: 'finalized',
    version: 'v1.0',
    createdAt: '2025-01-15',
    updatedAt: '2025-02-20',
  },
]

export const sceneSyllabuses: SceneSyllabus[] = [
  {
    id: 'syl-scene-001',
    programId: 'tp1',
    courseId: 'prac-001',
    courseName: '软件开发工程师',
    courseCode: 'J001',
    type: 'scene',
    credits: 2,
    totalHours: 32,
    theoryHours: 8,
    practiceHours: 24,
    applicableMajorIds: ['m1'],
    objectives: [
      { id: 'obj-1', dimension: '知识', content: '了解企业组织架构和软件开发流程', level: '了解' },
      { id: 'obj-2', dimension: '能力', content: '能够参与团队协作完成简单任务', level: '掌握' },
      { id: 'obj-3', dimension: '素养', content: '培养职业素养和沟通协调能力', level: '掌握' },
    ],
    objectivesText: '<p>通过本课程的学习，学生应达到以下目标：</p><ul><li>了解企业组织架构和软件开发流程</li><li>能够参与团队协作完成简单任务</li><li>培养职业素养和沟通协调能力</li></ul>',
    chapters: [
      { id: 'ch-1', name: '企业环境与规章制度', hours: 4, theoryHours: 4, practiceHours: 0, content: '企业文化、组织架构、安全规范', teachingMethod: '参观+讲解', keyPoints: '企业规章制度', difficultPoints: '保密协议理解' },
      { id: 'ch-2', name: '软件开发流程实践', hours: 12, theoryHours: 4, practiceHours: 8, content: '需求分析、设计、编码、测试全流程', teachingMethod: '项目实践', keyPoints: '敏捷开发流程', difficultPoints: '需求变更处理' },
      { id: 'ch-3', name: '岗位技能体验', hours: 16, theoryHours: 0, practiceHours: 16, content: '前端/后端/测试岗位轮换体验', teachingMethod: '岗位轮训', keyPoints: '岗位核心技能', difficultPoints: '快速适应新岗位' },
    ],
    chaptersText: '<p>本课程教学内容分为以下阶段：</p><ol><li><strong>企业环境与规章制度</strong>（4学时）— 企业文化、组织架构、安全规范</li><li><strong>软件开发流程实践</strong>（12学时）— 需求分析、设计、编码、测试全流程</li><li><strong>岗位技能体验</strong>（16学时）— 前端/后端/测试岗位轮换体验</li></ol>',
    teachingMethods: '场景化教学、岗位轮训、企业导师制',
    assessmentMethod: '过程评价40% + 岗位胜任力测评60%',
    assessmentWeight: { usual: 40, midterm: 0, final: 0, practice: 60 },
    textbooks: ['企业内训资料'],
    references: ['《软件工程实践者的研究方法》，Roger Pressman'],
    teachingConditions: '<p>1. 校内实训基地：配备高性能计算机、软件开发环境（IDE、Git等）</p><p>2. 企业实训基地：合作企业提供真实项目工位</p><p>3. 软件资源：正版开发工具、项目管理平台</p>',
    status: 'finalized',
    version: 'v1.0',
    createdAt: '2025-01-15',
    updatedAt: '2025-02-20',
    mappedPositionId: 'pos-001',
    mappedPositionName: '软件开发工程师',
    taskChain: [
      { id: 'st-1', name: '环境熟悉与工具配置', order: 1, mappedAbilityIds: ['ab-1'], hours: 4, evaluationRuleId: 'er-1' },
      { id: 'st-2', name: '需求理解与任务分解', order: 2, mappedAbilityIds: ['ab-2', 'ab-3'], hours: 8, evaluationRuleId: 'er-2' },
      { id: 'st-3', name: '功能开发与代码提交', order: 3, mappedAbilityIds: ['ab-4'], hours: 12, evaluationRuleId: 'er-3' },
      { id: 'st-4', name: '测试与缺陷修复', order: 4, mappedAbilityIds: ['ab-5'], hours: 8, evaluationRuleId: 'er-4' },
    ],
    evaluationRubric: 'A:独立完成全部任务且质量优秀 B:在指导下完成，质量良好 C:基本完成核心任务 D:部分完成，需加强',
    workstationType: '软件开发工位',
    equipmentList: ['开发电脑', 'IDE环境', 'Git仓库权限', '测试环境'],
    enterpriseMentorRequired: true,
  },
]

// ============================================
// Mock 数据：教学计划
// ============================================

export const teachingPlansV2: TeachingPlan[] = [
  {
    id: 'plan-001',
    programId: 'tp1',
    programName: '2026级软件工程专业人才培养方案',
    majorId: 'm1',
    entryYear: 2026,
    totalSemesters: 8,
    status: 'confirmed',
    generatedAt: '2025-03-01',
    confirmedAt: '2025-03-10',
    entries: [
      {
        id: 'pe-001',
        courseId: 'c-1717000000000-1',
        courseName: '程序设计基础',
        courseCode: 'CS101',
        type: 'theory',
        nature: '必修',
        credits: 4,
        totalHours: 64,
        semester: 1,
        weekHours: 4,
        startWeek: 1,
        endWeek: 16,
        weekPattern: 'all',
        assignedClassIds: ['c1', 'c2'],
        preferredFacultyIds: ['f1'],
        venueTypeRequired: '机房',
        syllabusId: 'syl-001',
        status: 'scheduled',
      },
      {
        id: 'pe-002',
        courseId: 'c-1717000000000-2',
        courseName: '高等数学',
        courseCode: 'MATH101',
        type: 'theory',
        nature: '必修',
        credits: 4,
        totalHours: 64,
        semester: 1,
        weekHours: 4,
        startWeek: 1,
        endWeek: 16,
        weekPattern: 'all',
        assignedClassIds: ['c1', 'c2'],
        preferredFacultyIds: [],
        venueTypeRequired: '教室',
        syllabusId: 'syl-002',
        status: 'scheduled',
      },
      {
        id: 'pe-003',
        courseId: 'prac-001',
        courseName: '软件开发工程师',
        courseCode: 'J001',
        type: 'scene',
        nature: '实践',
        credits: 2,
        totalHours: 32,
        semester: 3,
        weekHours: 8,
        startWeek: 17,
        endWeek: 20,
        weekPattern: 'intensive',
        assignedClassIds: ['c1', 'c2'],
        preferredFacultyIds: ['f3'],
        venueTypeRequired: '校外基地',
        syllabusId: 'syl-scene-001',
        status: 'scheduled',
      },
    ],
  },
  {
    id: 'plan-cn-2025',
    programId: 'tp-cn-2025',
    programName: '2025级计算机网络技术专业人才培养方案',
    majorId: 'm3',
    entryYear: 2025,
    totalSemesters: 6,
    status: 'confirmed',
    generatedAt: '2025-06-20',
    confirmedAt: '2025-06-25',
    entries: [
      { id: 'pe-cn-001', courseId: 'pb1', courseName: '思想道德与法治', courseCode: 'GB101', type: 'theory', nature: '必修', credits: 3, totalHours: 48, semester: 1, weekHours: 3, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '教室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-002', courseId: 'pb7', courseName: '体育与健康', courseCode: 'GB107', type: 'theory', nature: '必修', credits: 4, totalHours: 64, semester: 1, weekHours: 2, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '教室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-003', courseId: 'pb10', courseName: '高等数学', courseCode: 'GB110', type: 'theory', nature: '必修', credits: 3, totalHours: 48, semester: 1, weekHours: 3, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '教室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-004', courseId: 'pb15', courseName: '信息技术', courseCode: 'GB115', type: 'theory', nature: '必修', credits: 2, totalHours: 32, semester: 1, weekHours: 2, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '机房', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-005', courseId: 'pro-b1', courseName: 'Python程序设计基础', courseCode: 'PB201', type: 'theory', nature: '必修', credits: 4, totalHours: 64, semester: 1, weekHours: 4, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '机房', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-006', courseId: 'pro-b6', courseName: '计算机组装与维护', courseCode: 'PB206', type: 'practice', nature: '必修', credits: 3, totalHours: 48, semester: 1, weekHours: 3, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '实训室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-007', courseId: 'le1', courseName: '实用数学提高', courseCode: 'LE101', type: 'theory', nature: '选修', credits: 2, totalHours: 32, semester: 2, weekHours: 2, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '教室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-008', courseId: 'pro-c1', courseName: 'Linux网络操作系统', courseCode: 'PC301', type: 'theory', nature: '必修', credits: 4, totalHours: 64, semester: 3, weekHours: 4, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '机房', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-009', courseId: 'pro-c4', courseName: '路由交换技术', courseCode: 'PC304', type: 'theory', nature: '必修', credits: 4, totalHours: 64, semester: 3, weekHours: 4, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '实训室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-010', courseId: 'pro-e1', courseName: '云计算技术与应用', courseCode: 'PE401', type: 'theory', nature: '选修', credits: 3, totalHours: 48, semester: 4, weekHours: 3, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '机房', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-011', courseId: 'pro-p1', courseName: '网络系统集成工程师', courseCode: 'PP501', type: 'practice', nature: '实践', credits: 4, totalHours: 96, semester: 5, weekHours: 6, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '实训室', syllabusId: '', status: 'planned' },
      { id: 'pe-cn-012', courseId: 'pro-p3', courseName: '项目经理', courseCode: 'J021', type: 'scene', nature: '实践', credits: 12, totalHours: 480, semester: 6, weekHours: 30, startWeek: 1, endWeek: 16, weekPattern: 'all', assignedClassIds: [], preferredFacultyIds: [], venueTypeRequired: '校外基地', syllabusId: '', status: 'planned' },
    ],
  },
]

// ============================================
// Mock 数据：备课任务
// ============================================

export const preparationTasks: PreparationTask[] = [
  {
    id: 'prep-001',
    taskId: 'task-001',
    taskName: '程序设计基础-第1次课',
    taskType: 'traditional',
    courseName: '程序设计基础',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    status: 'completed',
    progress: 100,
    stages: {
      pre: {
        objectives: ['了解程序设计语言的发展历史', '理解编译和解释的区别'],
        resources: [
          { id: 'res-1', name: '课程导入PPT', type: 'ppt', stage: 'pre' },
          { id: 'res-2', name: '编程语言发展史视频', type: 'video', stage: 'pre' },
        ],
        activities: [
          { id: 'act-1', name: '课前讨论：你用过哪些编程语言', type: 'discussion', description: '在班级群发起讨论', duration: 10, stage: 'pre' },
        ],
        guidePlan: '通过生活实例引入编程概念，激发学习兴趣',
        previewQuestions: ['什么是算法？', '编程语言有哪些分类？'],
      },
      in: {
        resources: [
          { id: 'res-3', name: '课堂演示代码', type: 'document', stage: 'in' },
        ],
        activities: [
          { id: 'act-2', name: 'Hello World 现场编程', type: 'demo', description: '教师演示并让学生跟随', duration: 15, stage: 'in' },
          { id: 'act-3', name: '小组讨论：IDE选择', type: 'group_work', description: '讨论不同IDE的优缺点', duration: 10, stage: 'in' },
        ],
        coursewareResources: [
          { id: 'res-4', name: '第1章课件', type: 'ppt', stage: 'in' },
        ],
        quizQuestions: ['编译型语言和解释型语言的区别是？'],
        discussionTopics: ['为什么选择C语言作为入门语言？'],
      },
      post: {
        resources: [
          { id: 'res-5', name: '课后拓展阅读', type: 'link', stage: 'post' },
        ],
        activities: [
          { id: 'act-4', name: '在线编程练习', type: 'practice', description: '完成3道基础编程题', duration: 30, stage: 'post' },
        ],
        homework: '安装IDE并编写第一个程序，提交截图',
        quizQuestions: ['简述程序开发的基本步骤'],
        extensionResources: [
          { id: 'res-6', name: '著名程序员访谈录', type: 'video', stage: 'post' },
        ],
      },
    },
    coursePrep: {
      externalPlatformId: 'platform-cs101',
      knowledgePointIds: ['kp-1', 'kp-2'],
      syllabusChapterMapping: [{ chapterId: 'ch-1', sessionIndex: 1 }],
    },
    submittedAt: '2025-09-01',
  },
  {
    id: 'prep-002',
    taskId: 'task-scene-001',
    taskName: '企业认知实习-环境熟悉',
    taskType: 'scene',
    courseName: '软件开发工程师',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    status: 'in_progress',
    progress: 60,
    stages: {
      pre: {
        objectives: ['了解企业开发环境', '熟悉代码仓库操作'],
        resources: [
          { id: 'res-s1', name: '企业安全规范手册', type: 'document', stage: 'pre' },
          { id: 'res-s2', name: 'Git操作指南', type: 'link', stage: 'pre' },
        ],
        activities: [
          { id: 'act-s1', name: '安全培训签到', type: 'task', description: '完成安全规范学习并签到', duration: 30, stage: 'pre' },
        ],
        guidePlan: '企业导师先进行安全培训，再介绍开发环境',
        previewQuestions: ['什么是代码版本控制？'],
      },
      in: {
        resources: [
          { id: 'res-s3', name: '开发环境配置文档', type: 'document', stage: 'in' },
          { id: 'res-s4', name: '项目代码仓库', type: 'scene_link', stage: 'in' },
        ],
        activities: [
          { id: 'act-s2', name: '环境配置实操', type: 'practice', description: '在导师指导下配置开发环境', duration: 120, stage: 'in' },
        ],
        coursewareResources: [],
        quizQuestions: [],
        discussionTopics: ['遇到环境配置问题如何排查？'],
      },
      post: {
        resources: [],
        activities: [
          { id: 'act-s3', name: '提交环境配置报告', type: 'task', description: '记录配置过程和遇到的问题', duration: 20, stage: 'post' },
        ],
        homework: '提交开发环境配置报告',
        quizQuestions: [],
        extensionResources: [],
      },
    },
    scenePrep: {
      externalPlatformId: 'platform-scene-001',
      subTaskPreparations: [
        {
          subTaskId: 'st-1',
          subTaskName: '环境熟悉与工具配置',
          description: '学生需在导师指导下完成开发环境配置，包括IDE安装、Git配置、代码仓库克隆',
          abilityPointIds: ['ab-1', 'ab-2'],
          evaluationRubricId: 'er-1',
          workstationId: 'ws-001',
          equipmentChecklist: ['开发电脑', '网络连接', 'Git客户端', 'VPN账号'],
          safetyRequirements: '遵守企业信息安全规范，不泄露源代码；离开时锁屏',
          enterpriseMentorNotes: '重点关注学生的Git基础操作能力',
          mentorSchedule: {
            participationType: 'onsite',
            timeSlot: '第1-2节',
          },
        },
      ],
    },
  },
]

// ============================================
// Mock 数据：开课记录
// ============================================

export const courseLaunchRecords: CourseLaunchRecord[] = [
  {
    id: 'launch-001',
    taskId: 'task-001',
    taskName: '程序设计基础-第1次课',
    taskType: 'traditional',
    courseName: '程序设计基础',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f1',
    facultyName: '周建国',
    venueId: 'v1',
    venueName: '计算机楼A101',
    dayOfWeek: 1,
    periods: [2, 3],
    weeks: '1-16',
    launchStatus: 'launched',
    prepStatus: 'completed',
    checklist: {
      prepCompleted: true,
      venueConfirmed: true,
      studentsNotified: true,
      materialsReady: true,
    },
    launchedAt: '2025-09-02',
    studentVisibility: true,
    notes: '已正常开课',
  },
  {
    id: 'launch-002',
    taskId: 'task-scene-001',
    taskName: '企业认知实习-环境熟悉',
    taskType: 'scene',
    courseName: '软件开发工程师',
    classId: 'c1',
    className: '软件工程2026级1班',
    facultyId: 'f3',
    facultyName: '王志强',
    venueId: 'v5',
    venueName: '校外实训基地',
    dayOfWeek: 3,
    periods: [6, 7, 8],
    weeks: '17-20',
    launchStatus: 'ready',
    prepStatus: 'in_progress',
    checklist: {
      prepCompleted: false,
      venueConfirmed: true,
      studentsNotified: false,
      materialsReady: false,
      equipmentChecked: false,
    },
    studentVisibility: false,
    notes: '等待备课完成',
  },
]


// ==================== 调课申请 ====================

export type AdjustmentType = 'change_time' | 'change_venue' | 'substitute' | 'cancel' | 'makeup'
export type AdjustmentStatus = 'pending' | 'secretary_approved' | 'admin_approved' | 'rejected'

export interface AdjustmentRequest {
  id: string
  facultyId: string
  facultyName: string
  courseName: string
  className: string
  type: AdjustmentType
  status: AdjustmentStatus
  reason: string
  originalInfo: {
    dayOfWeek?: number
    periods?: string[]
    venueName?: string
  }
  newInfo: {
    dayOfWeek?: number
    periods?: string[]
    venueName?: string
    substituteFacultyName?: string
  }
  createdAt: string
  reviewedAt?: string
  reviewerName?: string
  reviewRemark?: string
}

export const adjustmentRequests: AdjustmentRequest[] = [
  {
    id: 'adj-001',
    facultyId: 'f1',
    facultyName: '周建国',
    courseName: '程序设计基础',
    className: '软件工程2026级1班',
    type: 'change_time',
    status: 'pending',
    reason: '因参加学术会议，需将本周课程调整至周五',
    originalInfo: { dayOfWeek: 1, periods: ['上午 1', '上午 2'], venueName: '教学楼A-301' },
    newInfo: { dayOfWeek: 5, periods: ['上午 1', '上午 2'], venueName: '教学楼A-301' },
    createdAt: '2026-05-28',
  },
  {
    id: 'adj-002',
    facultyId: 'f1',
    facultyName: '周建国',
    courseName: '高等数学',
    className: '软件工程2026级1班',
    type: 'change_venue',
    status: 'secretary_approved',
    reason: '原教室投影仪故障，申请更换至多媒体教室',
    originalInfo: { dayOfWeek: 1, periods: ['上午 3', '上午 4'], venueName: '教学楼B-205' },
    newInfo: { dayOfWeek: 1, periods: ['上午 3', '上午 4'], venueName: '教学楼A-401' },
    createdAt: '2026-05-25',
    reviewedAt: '2026-05-26',
    reviewerName: '张秘书',
    reviewRemark: '已确认B-205设备故障，同意更换',
  },
]
