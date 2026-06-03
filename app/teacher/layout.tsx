import { PlatformShell } from "@/components/platform-shell"
import { teacherNavigationConfig } from "@/lib/teacher-navigation-config"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={teacherNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
