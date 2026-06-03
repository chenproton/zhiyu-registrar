import { PlatformShell } from "@/components/platform-shell"
import { secretaryNavigationConfig } from "@/lib/secretary-navigation-config"

export default function SecretaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={secretaryNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
