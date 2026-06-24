import type { PlatformNavigationConfig } from "@/components/platform-shell"

const externalPortalUrl = "http://111.170.170.202:3001/portal"
const externalWorkspaceUrl = "http://111.170.170.202:3001/portal/workspace"
const externalAppsUrl = "http://111.170.170.202:3001/portal/apps"

export const teacherNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字教务平台",
  currentPlatformId: "registrar",
  currentPlatformLabel: "教师工作台",
  currentUserName: "周建国",
  currentUserRoleLabel: "任课教师",
  brandHref: "/teacher",
  brandIcon: "graduationCap",
  platformIcon: "briefcase",
  sideBackHref: "/teacher",
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
      href: "/teacher",
      matchers: ["/teacher$"],
    },
    {
      id: "my-tasks",
      label: "我的教学任务",
      icon: "bookOpen",
      children: [
        { id: "schedule", label: "我的课表", href: "/teacher/schedule", matchers: ["/teacher/schedule"] },
        { id: "course-assignments", label: "授课任务查询", href: "/teacher/course-assignments", matchers: ["/teacher/course-assignments"] },
      ],
    },
    {
      id: "grades-and-close",
      label: "成绩与结课",
      icon: "barChart3",
      children: [
        { id: "grade-submit", label: "成绩确认与提交", href: "/teacher/grade-submit", matchers: ["/teacher/grade-submit"] },
        { id: "course-close", label: "结课确认", href: "/teacher/course-close", matchers: ["/teacher/course-close"] },
        { id: "archive", label: "教学资料归档", href: "/teacher/archive", matchers: ["/teacher/archive"] },
      ],
    },
    {
      id: "applications",
      label: "事务申请",
      icon: "fileText",
      children: [
        { id: "adjustments", label: "调课申请", href: "/teacher/adjustments", matchers: ["/teacher/adjustments"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["my-tasks", "grades-and-close", "applications"],
}
