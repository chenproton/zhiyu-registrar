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
      label: "基础数据管理",
      icon: "folderKanban",
      children: [
        { id: "departments", label: "院系管理", href: "/admin/organization/departments", matchers: ["/admin/organization/departments"] },
        { id: "majors", label: "专业管理", href: "/admin/organization/majors", matchers: ["/admin/organization/majors"] },
        { id: "grades", label: "年级（届别）管理", href: "/admin/organization/grades", matchers: ["/admin/organization/grades"] },
        { id: "classes", label: "班级管理", href: "/admin/organization/classes", matchers: ["/admin/organization/classes"] },
        { id: "faculty", label: "师资管理", href: "/admin/organization/faculty", matchers: ["/admin/organization/faculty"] },
        { id: "students", label: "学生管理", href: "/admin/organization/students", matchers: ["/admin/organization/students"] },
        { id: "resources", label: "场地资源管理", href: "/admin/organization/resources", matchers: ["/admin/organization/resources"] },
      ],
    },
    {
      id: "operations",
      label: "教学运行中心",
      icon: "calendar",
      children: [
        { id: "programs", label: "人培方案管理", href: "/admin/programs", matchers: ["/admin/programs", "/admin/programs/import", "/admin/programs/new", "/admin/programs/"] },
        { id: "teaching-plans", label: "教学计划管理", href: "/admin/operations/teaching-plans", matchers: ["/admin/operations/teaching-plans"] },
        { id: "scheduling", label: "排课课表同步", href: "/admin/operations/scheduling", matchers: ["/admin/operations/scheduling"] },
        { id: "tasks", label: "课时中心", href: "/admin/operations/tasks", matchers: ["/admin/operations/tasks"] },
        { id: "program-progress", label: "教学进度监控", href: "/admin/operations/program-progress", matchers: ["/admin/operations/program-progress"] },
      ],
    },
    {
      id: "academics",
      label: "学业认定中心",
      icon: "graduationCap",
      children: [
        { id: "grades", label: "成绩认定", href: "/admin/academics/grades", matchers: ["/admin/academics/grades"] },
        { id: "competency", label: "能力认定", href: "/admin/academics/competency", matchers: ["/admin/academics/competency"] },
        { id: "degrees", label: "学历认定", href: "/admin/academics/degrees", matchers: ["/admin/academics/degrees"] },
        { id: "archives", label: "学生档案管理", href: "/admin/academics/archives", matchers: ["/admin/academics/archives"] },
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
    {
      id: "todo-later",
      label: "暂不做",
      icon: "circleDashed",
      children: [
        { id: "approval-management", label: "教学事务审批管理", href: "/admin/operations/approval-management", matchers: ["/admin/operations/approval-management"] },
        { id: "schedule-management", label: "排课管理", href: "/admin/operations/schedule-management", matchers: ["/admin/operations/schedule-management"] },
        { id: "preparation", label: "备课管理", href: "/admin/operations/preparation", matchers: ["/admin/operations/preparation"] },
        { id: "course-launch", label: "开课管理", href: "/admin/operations/course-launch", matchers: ["/admin/operations/course-launch"] },
        { id: "anomalies", label: "异常监控", href: "/admin/operations/anomalies", matchers: ["/admin/operations/anomalies"] },
        { id: "review", label: "任务复盘", href: "/admin/operations/review", matchers: ["/admin/operations/review"] },
      ],
    },
  ],
}
