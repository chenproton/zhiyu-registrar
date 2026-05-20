import { PlatformShell } from "@/platform-navigation-shell"
import { registrarNavigationConfig } from "@/lib/navigation-config"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={registrarNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
