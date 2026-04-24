export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  tags: string[];
}

export const tools: ToolItem[] = [
  {
    id: "gantt",
    title: "甘特图",
    description: "可视化项目进度的时间线工具，支持拖拽调整任务起止时间和依赖关系。",
    icon: "BarChart3",
    path: "/tools/gantt",
    color: "#6366f1",
    tags: ["时间管理", "可视化", "进度跟踪"],
  },
  {
    id: "burndown",
    title: "燃尽图",
    description: "敏捷项目管理核心工具，追踪剩余工作量随时间的变化趋势。",
    icon: "TrendingDown",
    path: "/tools/burndown",
    color: "#10b981",
    tags: ["敏捷", "Scrum", "Sprint"],
  },
  {
    id: "risk",
    title: "风险矩阵",
    description: "通过概率与影响两个维度评估和可视化项目风险的交互式工具。",
    icon: "AlertTriangle",
    path: "/tools/risk",
    color: "#f59e0b",
    tags: ["风险管理", "评估", "可视化"],
  },
  {
    id: "kanban",
    title: "Kanban看板",
    description: "拖拽式任务管理看板，支持自定义列和卡片，实时追踪任务状态。",
    icon: "Layout",
    path: "/tools/kanban",
    color: "#06b6d4",
    tags: ["任务管理", "敏捷", "可视化"],
  },
  {
    id: "wbs",
    title: "WBS分解",
    description: "交互式工作分解结构工具，将项目可交付成果逐层分解为可管理的工作包。",
    icon: "GitBranch",
    path: "/tools/wbs",
    color: "#8b5cf6",
    tags: ["范围管理", "分解", "规划"],
  },
];

export interface GanttTask {
  id: string;
  name: string;
  start: number;
  duration: number;
  progress: number;
  dependencies: string[];
  color: string;
  assignee: string;
}

export const sampleGanttTasks: GanttTask[] = [
  { id: "t1", name: "需求分析", start: 0, duration: 5, progress: 100, dependencies: [], color: "#6366f1", assignee: "张工" },
  { id: "t2", name: "系统设计", start: 5, duration: 7, progress: 100, dependencies: ["t1"], color: "#10b981", assignee: "李工" },
  { id: "t3", name: "前端开发", start: 10, duration: 14, progress: 65, dependencies: ["t2"], color: "#f59e0b", assignee: "王工" },
  { id: "t4", name: "后端开发", start: 10, duration: 16, progress: 45, dependencies: ["t2"], color: "#f59e0b", assignee: "赵工" },
  { id: "t5", name: "接口联调", start: 24, duration: 5, progress: 0, dependencies: ["t3", "t4"], color: "#06b6d4", assignee: "团队" },
  { id: "t6", name: "系统测试", start: 27, duration: 8, progress: 0, dependencies: ["t5"], color: "#ef4444", assignee: "测试组" },
  { id: "t7", name: "用户验收", start: 33, duration: 5, progress: 0, dependencies: ["t6"], color: "#8b5cf6", assignee: "产品组" },
  { id: "t8", name: "上线部署", start: 36, duration: 3, progress: 0, dependencies: ["t7"], color: "#6366f1", assignee: "运维组" },
];

export interface BurndownDataPoint {
  day: number;
  ideal: number;
  actual: number | null;
}

export const sampleBurndownData: BurndownDataPoint[] = [
  { day: 1, ideal: 120, actual: 120 },
  { day: 2, ideal: 112, actual: 118 },
  { day: 3, ideal: 104, actual: 115 },
  { day: 4, ideal: 96, actual: 110 },
  { day: 5, ideal: 88, actual: 105 },
  { day: 6, ideal: 80, actual: 95 },
  { day: 7, ideal: 72, actual: 88 },
  { day: 8, ideal: 64, actual: 78 },
  { day: 9, ideal: 56, actual: 68 },
  { day: 10, ideal: 48, actual: 60 },
  { day: 11, ideal: 40, actual: 50 },
  { day: 12, ideal: 32, actual: 42 },
  { day: 13, ideal: 24, actual: 32 },
  { day: 14, ideal: 16, actual: 22 },
  { day: 15, ideal: 8, actual: 12 },
  { day: 16, ideal: 0, actual: null },
];

export interface RiskItem {
  id: string;
  name: string;
  probability: number;
  impact: number;
  category: string;
  mitigation: string;
}

export const sampleRisks: RiskItem[] = [
  { id: "r1", name: "需求变更", probability: 4, impact: 4, category: "范围", mitigation: "建立变更控制委员会，严格变更流程" },
  { id: "r2", name: "关键人员离职", probability: 2, impact: 5, category: "资源", mitigation: "知识文档化，交叉培训，建立备份资源" },
  { id: "r3", name: "技术架构缺陷", probability: 3, impact: 4, category: "技术", mitigation: "技术预研，架构评审，原型验证" },
  { id: "r4", name: "第三方依赖延迟", probability: 4, impact: 3, category: "采购", mitigation: "提前启动采购，寻找替代方案" },
  { id: "r5", name: "预算超支", probability: 3, impact: 3, category: "成本", mitigation: "定期成本审查，储备分析，挣值管理" },
  { id: "r6", name: "安全漏洞", probability: 2, impact: 5, category: "质量", mitigation: "安全审计，代码扫描，渗透测试" },
  { id: "r7", name: "性能不达标", probability: 3, impact: 3, category: "质量", mitigation: "性能测试，负载测试，持续优化" },
  { id: "r8", name: "法规合规问题", probability: 2, impact: 4, category: "外部", mitigation: "合规审查，法律顾问咨询" },
];

export interface KanbanTask {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  tag: string;
  dueDate: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  tasks: KanbanTask[];
}

export const sampleKanbanColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "待办",
    color: "#71717a",
    tasks: [
      { id: "k1", title: "完成用户登录模块", priority: "high", assignee: "张工", tag: "前端", dueDate: "4月25日" },
      { id: "k2", title: "数据库优化方案", priority: "medium", assignee: "李工", tag: "后端", dueDate: "4月28日" },
      { id: "k3", title: "API接口文档编写", priority: "low", assignee: "王工", tag: "文档", dueDate: "5月1日" },
    ],
  },
  {
    id: "inprogress",
    title: "进行中",
    color: "#f59e0b",
    tasks: [
      { id: "k4", title: "首页UI设计", priority: "high", assignee: "赵工", tag: "设计", dueDate: "4月22日" },
      { id: "k5", title: "支付接口对接", priority: "high", assignee: "张工", tag: "后端", dueDate: "4月24日" },
    ],
  },
  {
    id: "review",
    title: "审核中",
    color: "#6366f1",
    tasks: [
      { id: "k6", title: "用户权限管理", priority: "medium", assignee: "李工", tag: "后端", dueDate: "4月23日" },
    ],
  },
  {
    id: "done",
    title: "已完成",
    color: "#10b981",
    tasks: [
      { id: "k7", title: "项目初始化", priority: "high", assignee: "团队", tag: "基础", dueDate: "4月15日" },
      { id: "k8", title: "技术选型", priority: "high", assignee: "团队", tag: "基础", dueDate: "4月16日" },
    ],
  },
];

export interface WBSNode {
  id: string;
  name: string;
  level: number;
  children?: WBSNode[];
}

export const sampleWBS: WBSNode[] = [
  {
    id: "wbs-1",
    name: "软件开发项目",
    level: 0,
    children: [
      {
        id: "wbs-1.1",
        name: "项目管理",
        level: 1,
        children: [
          { id: "wbs-1.1.1", name: "项目启动", level: 2 },
          { id: "wbs-1.1.2", name: "项目规划", level: 2 },
          { id: "wbs-1.1.3", name: "项目监控", level: 2 },
          { id: "wbs-1.1.4", name: "项目收尾", level: 2 },
        ],
      },
      {
        id: "wbs-1.2",
        name: "需求分析",
        level: 1,
        children: [
          { id: "wbs-1.2.1", name: "用户调研", level: 2 },
          { id: "wbs-1.2.2", name: "需求文档", level: 2 },
          { id: "wbs-1.2.3", name: "需求评审", level: 2 },
        ],
      },
      {
        id: "wbs-1.3",
        name: "系统设计",
        level: 1,
        children: [
          { id: "wbs-1.3.1", name: "架构设计", level: 2 },
          { id: "wbs-1.3.2", name: "数据库设计", level: 2 },
          { id: "wbs-1.3.3", name: "UI/UX设计", level: 2 },
        ],
      },
      {
        id: "wbs-1.4",
        name: "开发实现",
        level: 1,
        children: [
          { id: "wbs-1.4.1", name: "前端开发", level: 2 },
          { id: "wbs-1.4.2", name: "后端开发", level: 2 },
          { id: "wbs-1.4.3", name: "接口联调", level: 2 },
        ],
      },
      {
        id: "wbs-1.5",
        name: "测试验收",
        level: 1,
        children: [
          { id: "wbs-1.5.1", name: "单元测试", level: 2 },
          { id: "wbs-1.5.2", name: "集成测试", level: 2 },
          { id: "wbs-1.5.3", name: "用户验收", level: 2 },
        ],
      },
      {
        id: "wbs-1.6",
        name: "部署运维",
        level: 1,
        children: [
          { id: "wbs-1.6.1", name: "环境搭建", level: 2 },
          { id: "wbs-1.6.2", name: "上线部署", level: 2 },
          { id: "wbs-1.6.3", name: "运维监控", level: 2 },
        ],
      },
    ],
  },
];
