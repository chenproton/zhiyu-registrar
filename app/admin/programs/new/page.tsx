'use client'

import ProgramEditForm from '../_components/program-edit-form'
import { usePrograms } from '../_components/program-context'
import { TrainingProgram } from '@/lib/mock-data'
import { grades } from '@/lib/mock-data'

export default function NewProgramPage() {
  const { addProgram } = usePrograms()

  const emptyProgram: TrainingProgram = {
    id: `tp${Date.now()}`,
    name: '',
    code: '',
    majorId: '',
    entryYear: grades[0]?.entryYear || 2026,
    level: '大专',
    duration: 3,
    totalCredits: 0,
    requiredCredits: 0,
    electiveCredits: 0,
    practiceCredits: 0,
    courses: [],
    practiceScenes: [],
    status: 'draft',
    startDate: '',
    endDate: '',
    creator: '当前用户',
    collaborators: [],
    createdAt: new Date().toISOString().split('T')[0],
  }

  return (
    <div className="p-6">
      <ProgramEditForm initialProgram={emptyProgram} mode="new" onSave={addProgram} />
    </div>
  )
}
