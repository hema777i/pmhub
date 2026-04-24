import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wrench,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Layout,
  GitBranch,
  ArrowRight,
  Shield,
} from "lucide-react";
import { tools } from "@/data/toolsData";

const iconMap: Record<string, React.ElementType> = {
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Layout,
  GitBranch,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function ToolsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero */}
      <motion.section variants={item} className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img src="/tools-hero.jpg" alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#6366f1]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#fafafa]">交互工具集</h1>
              <p className="text-sm text-[#a1a1aa]">
                {tools.length} 款专业工具 · 实时交互 · 可视化分析
              </p>
            </div>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-lg leading-relaxed">
            从甘特图到风险矩阵，这套交互式工具帮助你在实践中理解项目管理的核心概念。
            每个工具都经过精心设计，支持实时交互和数据可视化。
          </p>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => {
          const Icon = iconMap[tool.icon] || Shield;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={tool.path}
                className="block h-full p-6 rounded-xl bg-[#18181b] border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: tool.color }} />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-[#6366f1]" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#fafafa] mb-2 group-hover:text-white transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-[#71717a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#6366f1] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>打开工具</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
