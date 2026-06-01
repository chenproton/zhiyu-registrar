import { ProgramProvider } from './_components/program-context'

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProgramProvider>{children}</ProgramProvider>
}
