import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Rocket,
  Map,
  Zap,
  Activity,
  CheckCircle,
  ArrowRight,
  Layers,
  BookOpen,
} from "lucide-react";
import { processGroups } from "@/data/knowledgeAreas";

const iconMap: Record<string, React.ElementType> = {
  Rocket,
  Map,
  Zap,
  Activity,
  CheckCircle,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function ProcessGroupsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-5xl"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#10b981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa]">五大过程组</h1>
            <p className="text-sm text-[#a1a1aa]">
              项目管理生命周期 · 从启动到收尾的完整流程
            </p>
          </div>
        </div>
      </motion.div>

      {/* Process Group Flow */}
      <motion.div variants={item} className="relative">
        {/* Connection Line */}
        <div className="absolute top-[60px] left-[40px] right-[40px] h-0.5 bg-gradient-to-r from-[#6366f1] via-[#10b981] via-[#f59e0b] via-[#ef4444] to-[#8b5cf6] opacity-30 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {processGroups.map((pg, i) => {
            const Icon = iconMap[pg.icon] || Layers;
            return (
              <motion.div
                key={pg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="relative"
              >
                <div className="p-5 rounded-xl bg-[#18181b] border border-white/5 hover:border-white/10 transition-all group text-center">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10"
                    style={{ backgroundColor: `${pg.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: pg.color }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-[#fafafa] mb-1">
                    {pg.title}
                  </h3>
                  <div
                    className="text-[10px] font-medium mb-3"
                    style={{ color: pg.color }}
                  >
                    {pg.knowledgeAreas.length} 个知识领域
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-3 mb-4">
                    {pg.description.slice(0, 80)}...
                  </p>

                  {/* Key Activities */}
                  <div className="space-y-1.5 mb-4">
                    {pg.keyActivities.slice(0, 2).map((activity) => (
                      <div
                        key={activity}
                        className="text-[10px] text-[#71717a] px-2 py-1 rounded bg-[#27272a]"
                      >
                        {activity}
                      </div>
                    ))}
                    {pg.keyActivities.length > 2 && (
                      <div className="text-[10px] text-[#6366f1]">
                        +{pg.keyActivities.length - 2} 更多
                      </div>
                    )}
                  </div>

                  {/* Deliverables */}
                  <div className="pt-3 border-t border-white/5">
                    <div className="text-[10px] text-[#71717a] mb-1.5">主要交付物</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {pg.deliverables.map((d) => (
                        <span
                          key={d}
                          className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#a1a1aa]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow (except last) */}
                {i < processGroups.length - 1 && (
                  <div className="flex justify-center my-2 md:hidden">
                    <ArrowRight className="w-4 h-4 text-[#3f3f46] rotate-90" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Knowledge Areas in Process Groups */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-[#fafafa] mb-5">
          知识领域与过程组映射
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                  知识领域
                </th>
                {processGroups.map((pg) => (
                  <th
                    key={pg.id}
                    className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: pg.color }}
                  >
                    {pg.title.replace("过程组", "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "整合管理", process: ["启动", "规划", "执行", "监控", "收尾"] },
                { name: "范围管理", process: ["", "规划", "", "监控", ""] },
                { name: "进度管理", process: ["", "规划", "", "监控", ""] },
                { name: "成本管理", process: ["", "规划", "", "监控", ""] },
                { name: "质量管理", process: ["", "规划", "执行", "监控", ""] },
                { name: "资源管理", process: ["", "规划", "执行", "监控", ""] },
                { name: "沟通管理", process: ["", "规划", "执行", "监控", ""] },
                { name: "风险管理", process: ["", "规划", "执行", "监控", ""] },
                { name: "采购管理", process: ["", "规划", "执行", "监控", ""] },
                { name: "干系人管理", process: ["启动", "规划", "执行", "监控", ""] },
              ].map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 text-[#fafafa] font-medium">{row.name}</td>
                  {row.process.map((p, j) => (
                    <td key={j} className="text-center py-3 px-3">
                      {p && (
                        <div
                          className="w-3 h-3 rounded-full mx-auto"
                          style={{ backgroundColor: processGroups[j].color }}
                        />
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="text-center py-6">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e0] text-white text-sm font-semibold rounded-lg transition-all"
        >
          <BookOpen className="w-4 h-4" />
          开始学习知识领域
        </Link>
      </motion.div>
    </motion.div>
  );
}
