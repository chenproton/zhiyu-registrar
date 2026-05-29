import { PlatformShell } from "@/components/platform-shell"
import { registrarNavigationConfig } from "@/lib/navigation-config"
import { DataProvider } from "@/components/providers/data-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DataProvider>
      <PlatformShell config={registrarNavigationConfig}>
        {children}
      </PlatformShell>
    </DataProvider>
  )
}
