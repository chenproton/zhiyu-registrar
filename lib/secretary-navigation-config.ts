import type { PlatformNavigationConfig } from "@/components/platform-shell"

const externalPortalUrl = "http://111.170.170.202:3001/portal"
const externalWorkspaceUrl = "http://111.170.170.202:3001/portal/workspace"
const externalAppsUrl = "http://111.170.170.202:3001/portal/apps"

export const secretaryNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字教务平台",
  currentPlatformId: "registrar",
  currentPlatformLabel: "教学秘书台",
  currentUserName: "张秘书",
  currentUserRoleLabel: "教学秘书",
  brandHref: "/secretary",
  brandIcon: "graduationCap",
  platformIcon: "clipboardList",
  sideBackHref: "/secretary",
  showCurrentTime: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "dashboard",
      label: "工作台",
      icon: "layoutGrid",
      href: "/secretary",
      matchers: ["/secretary$"],
    },
    {
      id: "teaching-plan",
      label: "教学计划与开课",
      icon: "layers3",
      children: [
        { id: "teaching-plans", label: "教学计划", href: "/secretary/teaching-plans", matchers: ["/secretary/teaching-plans"] },
        { id: "course-launch", label: "开课计划申报", href: "/secretary/course-launch", matchers: ["/secretary/course-launch"] },
      ],
    },
    {
      id: "operations-view",
      label: "排课与教学运行",
      icon: "calendar",
      children: [
        { id: "scheduling", label: "排课查看", href: "/secretary/scheduling", matchers: ["/secretary/scheduling"] },
        { id: "teacher-schedules", label: "教师课表", href: "/secretary/teacher-schedules", matchers: ["/secretary/teacher-schedules"] },
      ],
    },
    {
      id: "monitoring",
      label: "监控与审批",
      icon: "barChart3",
      children: [
        { id: "adjustments", label: "调课审批", href: "/secretary/adjustments", matchers: ["/secretary/adjustments"] },
        { id: "progress", label: "进度监控", href: "/secretary/progress", matchers: ["/secretary/progress"] },
        { id: "anomalies", label: "异常监控", href: "/secretary/anomalies", matchers: ["/secretary/anomalies"] },
      ],
    },
  ],
}
