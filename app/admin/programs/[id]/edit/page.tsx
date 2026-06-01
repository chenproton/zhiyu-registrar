'use client'

import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import ProgramEditForm from '../../_components/program-edit-form'
import { usePrograms } from '../../_components/program-context'

export default function EditProgramPage() {
  const { id } = useParams<{ id: string }>()
  const { programs, updateProgram } = usePrograms()

  const program = programs.find((p) => p.id === id)
  if (!program) {
    return (
      <div className="p-6">
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">方案不存在</p>
          <p className="text-sm mt-1">ID: {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <ProgramEditForm initialProgram={{ ...program }} mode="edit" onSave={updateProgram} />
    </div>
  )
}
