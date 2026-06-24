import type { PlatformNavigationConfig } from "@/components/platform-shell"

const externalPortalUrl = "http://111.170.170.202:3001/portal"
const externalWorkspaceUrl = "http://111.170.170.202:3001/portal/workspace"
const externalAppsUrl = "http://111.170.170.202:3001/portal/apps"

export const registrarNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "教务服务平台",
  currentPlatformId: "registrar",
  currentPlatformLabel: "教务服务平台",
  brandHref: "/admin",
  brandIcon: "settings",
  platformIcon: "graduationCap",
  sideBackHref: "/admin",
  currentUserName: "教务管理员",
  currentUserRoleLabel: "教务服务平台",
  showCurrentTime: true,
  showUserMenu: true,
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
      id: "basic-data",
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
      id: "talent-program",
      label: "人才培养方案",
      icon: "bookOpen",
      children: [
        { id: "programs", label: "人培方案管理", href: "/admin/programs", matchers: ["/admin/programs", "/admin/programs/import", "/admin/programs/new", "/admin/programs/"] },
      ],
    },
    {
      id: "teaching-plan",
      label: "教学计划与开课",
      icon: "layers3",
      children: [
        { id: "teaching-plans", label: "教学计划管理", href: "/admin/operations/teaching-plans", matchers: ["/admin/operations/teaching-plans"] },
        { id: "course-launch", label: "开课计划申报", href: "/admin/operations/course-launch", matchers: ["/admin/operations/course-launch"] },
        { id: "course-launch-approval", label: "开课计划审批", href: "/admin/operations/course-launch-approval", matchers: ["/admin/operations/course-launch-approval"] },
      ],
    },
    {
      id: "scheduling",
      label: "排课与教学任务",
      icon: "calendar",
      children: [
        { id: "schedule-management", label: "排课管理", href: "/admin/operations/schedule-management", matchers: ["/admin/operations/schedule-management"] },
        { id: "tasks", label: "教学任务管理", href: "/admin/operations/tasks", matchers: ["/admin/operations/tasks"] },
        { id: "course-assignments", label: "教师授课任务", href: "/admin/operations/course-assignments", matchers: ["/admin/operations/course-assignments"] },
        { id: "timetable-query", label: "课表查询", href: "/admin/operations/timetable-query", matchers: ["/admin/operations/timetable-query"] },
      ],
    },
    {
      id: "grades",
      label: "成绩与结课",
      icon: "barChart3",
      children: [
        { id: "academics-grades", label: "成绩管理", href: "/admin/academics/grades", matchers: ["/admin/academics/grades"] },
        { id: "process-data-sync", label: "过程数据回传", href: "/admin/academics/process-data-sync", matchers: ["/admin/academics/process-data-sync"] },
        { id: "academics-archives", label: "教学归档", href: "/admin/academics/archives", matchers: ["/admin/academics/archives"] },
      ],
    },
    {
      id: "monitor",
      label: "教学运行监控",
      icon: "lineChart",
      children: [
        { id: "program-progress", label: "教学进度监控", href: "/admin/operations/program-progress", matchers: ["/admin/operations/program-progress"] },
        { id: "anomalies", label: "异常监控", href: "/admin/operations/anomalies", matchers: ["/admin/operations/anomalies"] },
        { id: "review", label: "任务复盘", href: "/admin/operations/review", matchers: ["/admin/operations/review"] },
      ],
    },
    {
      id: "approval-management",
      label: "教学事务审批",
      icon: "fileCheck",
      children: [
        { id: "approval-management", label: "审批管理", href: "/admin/operations/approval-management", matchers: ["/admin/operations/approval-management"] },
      ],
    },
    {
      id: "teaching-research",
      label: "虚拟教研室",
      icon: "share2",
      children: [
        { id: "research-rooms", label: "虚拟教研室", href: "/admin/research-rooms", matchers: ["/admin/research-rooms"] },
      ],
    },
    {
      id: "integration",
      label: "系统集成",
      icon: "settings",
      children: [
        { id: "integration-config", label: "系统集成配置", href: "/admin/integration/config", matchers: ["/admin/integration/config"] },
        { id: "integration-logs", label: "数据同步日志", href: "/admin/integration/logs", matchers: ["/admin/integration/logs"] },
      ],
    },
  ],
  defaultExpandedSideNavIds: ["basic-data", "talent-program", "teaching-plan", "scheduling", "grades", "monitor", "approval-management", "teaching-research", "integration"],
}
