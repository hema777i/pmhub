export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  color: string;
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  color: string;
}

export const learningModules: LearningModule[] = [
  { id: "lm-1", title: "项目整合管理", category: "十大知识领域", progress: 28, totalLessons: 7, completedLessons: 2, lastAccessed: "2025-04-22", color: "#6366f1" },
  { id: "lm-2", title: "项目范围管理", category: "十大知识领域", progress: 33, totalLessons: 6, completedLessons: 2, lastAccessed: "2025-04-21", color: "#10b981" },
  { id: "lm-3", title: "项目进度管理", category: "十大知识领域", progress: 33, totalLessons: 6, completedLessons: 2, lastAccessed: "2025-04-20", color: "#f59e0b" },
  { id: "lm-4", title: "项目成本管理", category: "十大知识领域", progress: 50, totalLessons: 4, completedLessons: 2, lastAccessed: "2025-04-19", color: "#ef4444" },
  { id: "lm-5", title: "甘特图实战", category: "交互工具", progress: 80, totalLessons: 5, completedLessons: 4, lastAccessed: "2025-04-22", color: "#6366f1" },
  { id: "lm-6", title: "Kanban看板", category: "交互工具", progress: 60, totalLessons: 5, completedLessons: 3, lastAccessed: "2025-04-18", color: "#06b6d4" },
];

export const achievements: Achievement[] = [
  { id: "ach-1", title: "初学者", description: "完成第一个知识领域的学习", icon: "Star", unlocked: true, unlockedAt: "2025-04-15", color: "#f59e0b" },
  { id: "ach-2", title: "知识探索者", description: "浏览所有十大知识领域", icon: "Compass", unlocked: true, unlockedAt: "2025-04-18", color: "#6366f1" },
  { id: "ach-3", title: "工具大师", description: "使用3个以上交互工具", icon: "Wrench", unlocked: true, unlockedAt: "2025-04-20", color: "#10b981" },
  { id: "ach-4", title: "进度追踪者", description: "完成甘特图工具的学习", icon: "BarChart3", unlocked: false, color: "#06b6d4" },
  { id: "ach-5", title: "风险管理者", description: "完成风险矩阵工具的学习", icon: "Shield", unlocked: false, color: "#8b5cf6" },
  { id: "ach-6", title: "敏捷实践者", description: "完成Kanban看板的学习", icon: "Zap", unlocked: false, color: "#f97316" },
  { id: "ach-7", title: "WBS专家", description: "完成WBS分解工具的学习", icon: "GitBranch", unlocked: false, color: "#14b8a6" },
  { id: "ach-8", title: "PMP预备", description: "完成所有知识领域的学习", icon: "Award", unlocked: false, color: "#d946ef" },
];

export const overallProgress = {
  totalAreas: 10,
  completedAreas: 0,
  totalTools: 5,
  completedTools: 0,
  totalLessons: 49,
  completedLessons: 16,
  studyHours: 24,
  streak: 5,
};

export interface DataStreamItem {
  id: string;
  title: string;
  type: string;
  status: "synced" | "pending" | "error";
  timestamp: string;
}

export const sampleDataStream: DataStreamItem[] = [
  { id: "ds-1", title: "整合管理进度同步", type: "学习", status: "synced", timestamp: "14:32:05" },
  { id: "ds-2", title: "甘特图配置更新", type: "工具", status: "synced", timestamp: "14:31:42" },
  { id: "ds-3", title: "风险矩阵计算", type: "工具", status: "pending", timestamp: "14:31:18" },
  { id: "ds-4", title: "Kanban看板状态", type: "工具", status: "synced", timestamp: "14:30:55" },
  { id: "ds-5", title: "学习里程碑达成", type: "系统", status: "synced", timestamp: "14:30:30" },
  { id: "ds-6", title: "WBS数据导入", type: "工具", status: "synced", timestamp: "14:29:48" },
  { id: "ds-7", title: "用户偏好同步", type: "系统", status: "pending", timestamp: "14:29:15" },
  { id: "ds-8", title: "进度报告生成", type: "系统", status: "synced", timestamp: "14:28:52" },
  { id: "ds-9", title: "燃尽图数据更新", type: "工具", status: "synced", timestamp: "14:28:30" },
  { id: "ds-10", title: "知识图谱索引", type: "学习", status: "synced", timestamp: "14:28:05" },
];
