'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { TrainingProgram, trainingPrograms as initialPrograms } from '@/lib/mock-data'

interface ProgramContextType {
  programs: TrainingProgram[]
  addProgram: (p: TrainingProgram) => void
  updateProgram: (p: TrainingProgram) => void
  deleteProgram: (id: string) => void
}

const ProgramContext = createContext<ProgramContextType | null>(null)

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms)

  const addProgram = (p: TrainingProgram) => {
    setPrograms((prev) => [...prev, p])
  }

  const updateProgram = (p: TrainingProgram) => {
    setPrograms((prev) => prev.map((item) => (item.id === p.id ? p : item)))
  }

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProgramContext.Provider value={{ programs, addProgram, updateProgram, deleteProgram }}>
      {children}
    </ProgramContext.Provider>
  )
}

export function usePrograms() {
  const ctx = useContext(ProgramContext)
  if (!ctx) throw new Error('usePrograms must be used within ProgramProvider')
  return ctx
}
