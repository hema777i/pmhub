import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Wrench,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  Zap,
  Shield,
  Target,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { overallProgress } from "@/data/userProgress";
import { knowledgeAreas } from "@/data/knowledgeAreas";
import { tools } from "@/data/toolsData";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function HomePage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.section variants={item} className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 p-10 md:p-14">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <Zap className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#f59e0b]">
                项目管理知识平台
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-[#fafafa] mb-4 leading-tight"
            >
              掌握项目管理
              <br />
              <span className="text-gradient">十大知识领域</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-[#a1a1aa] text-base md:text-lg mb-8 leading-relaxed max-w-lg"
            >
              从整合管理到干系人管理，系统化学习PMBOK知识体系，
              配合交互式工具实战演练，为PMP认证做好充分准备。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e0] text-white text-sm font-semibold rounded-lg transition-all hover:scale-[0.98] active:scale-[0.96]"
              >
                <BookOpen className="w-4 h-4" />
                开始学习
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#fafafa] text-sm font-medium rounded-lg border border-white/10 transition-all hover:scale-[0.98] active:scale-[0.96]"
              >
                <Wrench className="w-4 h-4" />
                交互工具
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Overview */}
      <motion.section variants={item}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "学习进度",
              value: `${Math.round((overallProgress.completedLessons / overallProgress.totalLessons) * 100)}%`,
              sublabel: `${overallProgress.completedLessons}/${overallProgress.totalLessons} 课时`,
              icon: TrendingUp,
              color: "#6366f1",
            },
            {
              label: "已学习",
              value: `${overallProgress.studyHours}h`,
              sublabel: "累计学习时长",
              icon: Clock,
              color: "#10b981",
            },
            {
              label: "知识领域",
              value: `${overallProgress.totalAreas}`,
              sublabel: "十大知识领域",
              icon: Target,
              color: "#f59e0b",
            },
            {
              label: "连续学习",
              value: `${overallProgress.streak}`,
              sublabel: "天学习 streak",
              icon: Award,
              color: "#ec4899",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
              className="p-5 rounded-xl bg-[#18181b] border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#fafafa] mb-0.5">{stat.value}</div>
              <div className="text-xs text-[#a1a1aa] mb-1">{stat.label}</div>
              <div className="text-[10px] text-[#71717a]">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Knowledge Areas Preview */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#fafafa]">知识领域</h2>
          <Link
            to="/knowledge"
            className="flex items-center gap-1 text-xs text-[#6366f1] hover:text-[#8184f7] transition-colors font-medium"
          >
            查看全部
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {knowledgeAreas.slice(0, 10).map((area, i) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/knowledge/${area.id}`}
                className="block p-4 rounded-xl bg-[#18181b] border border-white/5 hover:border-white/10 transition-all group hover:-translate-y-0.5"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${area.color}15` }}
                >
                  <Target className="w-4 h-4" style={{ color: area.color }} />
                </div>
                <div className="text-sm font-medium text-[#fafafa] mb-1 group-hover:text-white transition-colors">
                  {area.shortTitle}
                </div>
                <div className="text-[10px] text-[#71717a]">{area.processGroups.length}个过程组</div>
                <div className="mt-2.5 w-full h-1 bg-[#27272a] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(area.subtasks.filter((t) => t.completed).length / area.subtasks.length) * 100}%`,
                    }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.8, ease: "easeOut" as const }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tools & Graph CTA */}
      <motion.section variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tools CTA */}
          <Link
            to="/tools"
            className="group relative p-6 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#6366f1]/20 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#6366f1]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#6366f1]">
                  交互工具
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#fafafa] mb-2">5款专业工具</h3>
              <p className="text-sm text-[#a1a1aa] mb-4">
                甘特图、燃尽图、风险矩阵、Kanban看板、WBS分解
              </p>
              <div className="flex items-center gap-2 text-xs text-[#6366f1] font-medium">
                <span>立即使用</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Graph CTA */}
          <Link
            to="/graph"
            className="group relative p-6 rounded-xl bg-[#18181b] border border-white/5 hover:border-[#10b981]/20 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#10b981]">
                  知识图谱
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#fafafa] mb-2">可视化知识网络</h3>
              <p className="text-sm text-[#a1a1aa] mb-4">
                探索知识领域间的关联，解锁学习路径
              </p>
              <div className="flex items-center gap-2 text-xs text-[#10b981] font-medium">
                <span>探索图谱</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* Quick Access Tools */}
      <motion.section variants={item}>
        <h2 className="text-lg font-semibold text-[#fafafa] mb-5">快速工具</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
            >
              <Link
                to={tool.path}
                className="block p-4 rounded-xl bg-[#18181b] border border-white/5 hover:border-white/10 transition-all group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <Shield className="w-4 h-4" style={{ color: tool.color }} />
                </div>
                <div className="text-sm font-medium text-[#fafafa] mb-1">{tool.title}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tool.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-[#71717a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
