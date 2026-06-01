"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import type {
  StudentAbilityArchive,
  CreditConversionRule,
  ArchiveVersion,
} from '@/lib/types'
import {
  mockStudentAbilityArchives,
  mockCreditConversionRules,
  mockArchiveVersions,
} from '@/lib/mock-data'

interface DataContextValue {
  studentAbilityArchives: StudentAbilityArchive[]
  creditConversionRules: CreditConversionRule[]
  archiveVersions: ArchiveVersion[]
  createStudentAbilityArchive: (data: any) => StudentAbilityArchive
  updateStudentAbilityArchive: (id: string, data: Partial<StudentAbilityArchive>) => void
  deleteStudentAbilityArchive: (id: string) => void
  updateCreditConversionRules: (rules: CreditConversionRule[]) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [studentAbilityArchives, setStudentAbilityArchives] = useState<StudentAbilityArchive[]>(mockStudentAbilityArchives)
  const [creditConversionRules, setCreditConversionRules] = useState<CreditConversionRule[]>(mockCreditConversionRules)
  const [archiveVersions] = useState<ArchiveVersion[]>(mockArchiveVersions)

  const createStudentAbilityArchive = useCallback((data: any) => {
    const newArchive: StudentAbilityArchive = {
      id: `sp-arch-${Date.now()}`,
      studentName: data.studentName,
      studentId: data.studentId,
      className: data.className,
      materialType: data.materialType,
      materialName: data.materialName,
      issuingOrg: data.issuingOrg,
      obtainDate: new Date(data.obtainDate),
      auditStatus: 'pending',
      convertedCredit: 0,
      direction: data.direction || 'positive',
      isVisible: true,
      createdAt: new Date(),
    }
    setStudentAbilityArchives((prev) => [...prev, newArchive])
    return newArchive
  }, [])

  const updateStudentAbilityArchive = useCallback((id: string, data: Partial<StudentAbilityArchive>) => {
    setStudentAbilityArchives((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    )
  }, [])

  const deleteStudentAbilityArchive = useCallback((id: string) => {
    setStudentAbilityArchives((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const updateCreditConversionRules = useCallback((rules: CreditConversionRule[]) => {
    setCreditConversionRules(rules)
  }, [])

  const value: DataContextValue = {
    studentAbilityArchives,
    creditConversionRules,
    archiveVersions,
    createStudentAbilityArchive,
    updateStudentAbilityArchive,
    deleteStudentAbilityArchive,
    updateCreditConversionRules,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
