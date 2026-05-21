import type { PlatformNavigationConfig } from "@/components/platform-shell"

const externalPortalUrl = "http://111.170.170.202:3001/portal"
const externalWorkspaceUrl = "http://111.170.170.202:3001/portal/workspace"
const externalAppsUrl = "http://111.170.170.202:3001/portal/apps"

export const registrarNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "数字教务平台",
  currentPlatformId: "registrar",
  currentPlatformLabel: "数字教务平台",
  brandHref: "/admin",
  brandIcon: "settings",
  platformIcon: "graduationCap",
  sideBackHref: "/admin",
  currentUserName: "教务管理员",
  currentUserRoleLabel: "数字教务平台",
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
      id: "overview",
      label: "平台总览",
      icon: "barChart3",
      href: "/admin",
      matchers: ["/admin$"],
    },
    {
      id: "organization",
      label: "数据治理中心",
      icon: "folderKanban",
      children: [
        { id: "departments", label: "院系管理", href: "/admin/organization/departments", matchers: ["/admin/organization/departments"] },
        { id: "majors", label: "专业管理", href: "/admin/organization/majors", matchers: ["/admin/organization/majors"] },
        { id: "classes", label: "班级管理", href: "/admin/organization/classes", matchers: ["/admin/organization/classes"] },
        { id: "faculty", label: "师资管理", href: "/admin/organization/faculty", matchers: ["/admin/organization/faculty"] },
        { id: "students", label: "学生学籍管理", href: "/admin/organization/students", matchers: ["/admin/organization/students"] },
        { id: "resources", label: "教学资源管理", href: "/admin/organization/resources", matchers: ["/admin/organization/resources"] },
      ],
    },
    {
      id: "programs",
      label: "培养方案管理",
      icon: "bookOpen",
      children: [
        { id: "programs-list", label: "方案列表", href: "/admin/programs", matchers: ["/admin/programs$"] },
        { id: "programs-approval", label: "方案审批", href: "/admin/programs/approval", matchers: ["/admin/programs/approval"] },
      ],
    },
    {
      id: "operations",
      label: "教学运行中心",
      icon: "calendar",
      children: [
        { id: "calendar", label: "教学日历", href: "/admin/operations/calendar", matchers: ["/admin/operations/calendar"] },
        { id: "schedule", label: "排课管理", href: "/admin/operations/schedule", matchers: ["/admin/operations/schedule"] },
        { id: "adjustments", label: "调课管理", href: "/admin/operations/adjustments", matchers: ["/admin/operations/adjustments"] },
        { id: "progress", label: "教学进度监控", href: "/admin/operations/progress", matchers: ["/admin/operations/progress"] },
        { id: "evaluation-templates", label: "评价模板", href: "/admin/operations/evaluation/templates", matchers: ["/admin/operations/evaluation/templates"] },
        { id: "evaluation-activities", label: "评价活动", href: "/admin/operations/evaluation/activities", matchers: ["/admin/operations/evaluation/activities"] },
        { id: "evaluation-results", label: "评价结果汇总", href: "/admin/operations/evaluation/results", matchers: ["/admin/operations/evaluation/results"] },
      ],
    },
    {
      id: "academics",
      label: "学业认定中心",
      icon: "graduationCap",
      children: [
        { id: "grades", label: "成绩认定", href: "/admin/academics/grades", matchers: ["/admin/academics/grades"] },
        { id: "degrees", label: "学历认定", href: "/admin/academics/degrees", matchers: ["/admin/academics/degrees"] },
        { id: "publication", label: "认定发布", href: "/admin/academics/publication", matchers: ["/admin/academics/publication"] },
        { id: "archives", label: "学业档案", href: "/admin/academics/archives", matchers: ["/admin/academics/archives"] },
      ],
    },
    {
      id: "achievements",
      label: "教学成果管理",
      icon: "award",
      children: [
        { id: "achievements-applications", label: "成果申报", href: "/admin/achievements/applications", matchers: ["/admin/achievements/applications"] },
        { id: "achievements-approval", label: "成果审批", href: "/admin/achievements/approval", matchers: ["/admin/achievements/approval"] },
        { id: "achievements-showcase", label: "标杆案例库", href: "/admin/achievements/showcase", matchers: ["/admin/achievements/showcase"] },
      ],
    },
  ],
}
