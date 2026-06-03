import { PlatformShell } from "@/components/platform-shell"
import { registrarNavigationConfig } from "@/lib/navigation-config"
import { DataProvider } from "@/components/providers/data-provider"
import { SyllabusProvider } from "@/components/providers/syllabus-provider"
import { TeachingPlanProvider } from "@/components/providers/teaching-plan-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DataProvider>
      <SyllabusProvider>
        <TeachingPlanProvider>
          <PlatformShell config={registrarNavigationConfig}>
            {children}
          </PlatformShell>
        </TeachingPlanProvider>
      </SyllabusProvider>
    </DataProvider>
  )
}
