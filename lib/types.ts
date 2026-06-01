// ==================== 学生能力档案管理相关 ====================

export type ArchiveMaterialType = 'certificate' | 'competition' | 'activity' | 'internship' | 'skill'
export type ArchiveAuditStatus = 'pending' | 'approved' | 'rejected'
export type ArchiveDirection = 'positive' | 'negative'

export interface StudentAbilityArchive {
  id: string
  studentName: string
  studentId: string
  className: string
  materialType: ArchiveMaterialType
  materialName: string
  issuingOrg: string
  obtainDate: Date
  auditStatus: ArchiveAuditStatus
  auditRemark?: string
  convertedCredit: number
  direction: ArchiveDirection
  isVisible: boolean
  createdAt: Date
  level?: string
}

export interface CreditConversionRule {
  id: string
  materialType: ArchiveMaterialType
  level: string
  credit: number
}

export interface ArchiveVersion {
  id: string
  archiveId: string
  version: number
  changedBy: string
  changeSummary: string
  createdAt: Date
}

export interface StudentAbilityArchiveFormData {
  studentName: string
  studentId: string
  className: string
  materialType: ArchiveMaterialType
  materialName: string
  issuingOrg: string
  obtainDate: string
  direction: ArchiveDirection
}

export interface ArchiveAuditFormData {
  auditStatus: ArchiveAuditStatus
  auditRemark?: string
  convertedCredit: number
}
