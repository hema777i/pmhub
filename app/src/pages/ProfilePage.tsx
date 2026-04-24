import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Star,
  Compass,
  Wrench,
  BarChart3,
  Shield,
  Zap,
  GitBranch,
  Lock,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { overallProgress, learningModules, achievements } from "@/data/userProgress";
import { knowledgeAreas } from "@/data/knowledgeAreas";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const achievementIcons: Record<string, React.ElementType> = {
  Star,
  Compass,
  Wrench,
  BarChart3,
  Shield,
  Zap,
  GitBranch,
  Award,
};

export function ProfilePage() {
  const radarData = knowledgeAreas.slice(0, 8).map((area) => {
    const completed = area.subtasks.filter((t) => t.completed).length;
    return {
      subject: area.shortTitle,
      A: Math.round((completed / area.subtasks.length) * 100),
      fullMark: 100,
    };
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Profile Header */}
      <motion.div variants={item} className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-white">PM</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#fafafa]">项目管理学习者</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">
            已学习 {overallProgress.studyHours} 小时 · 连续 {overallProgress.streak} 天 · {overallProgress.completedLessons} 课时完成
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] font-medium">
              PMP备考中
            </span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] font-medium">
              活跃学习者
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "学习进度",
            value: `${Math.round((overallProgress.completedLessons / overallProgress.totalLessons) * 100)}%`,
            sub: `${overallProgress.completedLessons}/${overallProgress.totalLessons} 课时`,
            icon: TrendingUp,
            color: "#6366f1",
          },
          {
            label: "学习时长",
            value: `${overallProgress.studyHours}h`,
            sub: "累计学习", 
            icon: Clock,
            color: "#10b981",
          },
          {
            label: "连续学习",
            value: `${overallProgress.streak}`,
            sub: "天 streak",
            icon: Flame,
            color: "#f59e0b",
          },
          {
            label: "成就",
            value: `${achievements.filter((a) => a.unlocked).length}/${achievements.length}`,
            sub: "已解锁",
            icon: Award,
            color: "#ec4899",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="p-4 rounded-xl bg-[#18181b] border border-white/5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#fafafa]">{stat.value}</div>
            <div className="text-[10px] text-[#71717a] mt-0.5">{stat.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Radar Chart + Learning Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Radar Chart */}
          <motion.div variants={item} className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <h3 className="text-sm font-semibold text-[#fafafa] mb-4">知识领域掌握度</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#71717a", fontSize: 9 }}
                    tickCount={5}
                  />
                  <Radar
                    name="掌握度"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#27272a] border border-white/10 rounded-lg p-2 shadow-xl">
                            <p className="text-xs text-[#fafafa]">
                              {payload[0].payload.subject}: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Learning Modules */}
          <motion.div variants={item} className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#fafafa]">学习模块</h3>
              <Link
                to="/knowledge"
                className="text-xs text-[#6366f1] hover:underline"
              >
                继续学习
              </Link>
            </div>
            <div className="space-y-3">
              {learningModules.map((module, i) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#27272a]/30 border border-white/5"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${module.color}15` }}
                  >
                    <BookOpen className="w-4 h-4" style={{ color: module.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#fafafa] font-medium">{module.title}</span>
                      <span className="text-xs text-[#71717a]">{module.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${module.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" as const }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: module.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#71717a]">
                      <span>{module.completedLessons}/{module.totalLessons} 课时</span>
                      <span>上次: {module.lastAccessed}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - Achievements */}
        <motion.div variants={item} className="space-y-4">
          <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              <h3 className="text-sm font-semibold text-[#fafafa]">成就</h3>
            </div>
            <div className="space-y-2.5">
              {achievements.map((achievement, i) => {
                const Icon = achievementIcons[achievement.icon] || Star;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      achievement.unlocked
                        ? "bg-[#27272a]/30 border border-white/5"
                        : "bg-transparent border border-transparent opacity-50"
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: achievement.unlocked
                          ? `${achievement.color}15`
                          : "#27272a",
                      }}
                    >
                      {achievement.unlocked ? (
                        <Icon
                          className="w-4 h-4"
                          style={{ color: achievement.color }}
                        />
                      ) : (
                        <Lock className="w-4 h-4 text-[#3f3f46]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#fafafa]">
                        {achievement.title}
                      </div>
                      <div className="text-[10px] text-[#71717a]">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <span className="text-[9px] text-[#10b981]">
                        {achievement.unlockedAt}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <h3 className="text-sm font-semibold text-[#fafafa] mb-3">快速入口</h3>
            <div className="space-y-1.5">
              {[
                { label: "知识库", path: "/knowledge", icon: BookOpen, color: "#6366f1" },
                { label: "交互工具", path: "/tools", icon: Target, color: "#10b981" },
                { label: "知识图谱", path: "/graph", icon: Award, color: "#f59e0b" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-all"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <link.icon className="w-3.5 h-3.5" style={{ color: link.color }} />
                  </div>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
