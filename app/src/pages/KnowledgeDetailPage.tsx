import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  Circle,
  BookOpen,
  Wrench,
  ArrowRight,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { knowledgeAreas } from "@/data/knowledgeAreas";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function KnowledgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const area = knowledgeAreas.find((a) => a.id === id);

  if (!area) {
    return (
      <div className="text-center py-20">
        <p className="text-[#a1a1aa] mb-4">知识领域不存在</p>
        <Link
          to="/knowledge"
          className="text-[#6366f1] text-sm hover:underline"
        >
          返回知识库
        </Link>
      </div>
    );
  }

  const completedCount = area.subtasks.filter((t) => t.completed).length;
  const totalCount = area.subtasks.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const currentIndex = knowledgeAreas.findIndex((a) => a.id === id);
  const prevArea = currentIndex > 0 ? knowledgeAreas[currentIndex - 1] : null;
  const nextArea =
    currentIndex < knowledgeAreas.length - 1
      ? knowledgeAreas[currentIndex + 1]
      : null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      {/* Breadcrumb & Navigation */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        <span className="text-[#3f3f46]">/</span>
        <Link
          to="/knowledge"
          className="text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
        >
          知识库
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${area.color}15` }}
          >
            <Target className="w-7 h-7" style={{ color: area.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[#fafafa]">{area.title}</h1>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${area.color}15`,
                  color: area.color,
                }}
              >
                {area.processGroups.join(" · ")}
              </span>
            </div>
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              {area.description}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
              className="h-full rounded-full"
              style={{ backgroundColor: area.color }}
            />
          </div>
          <span className="text-sm font-semibold text-[#fafafa]">{progress}%</span>
          <span className="text-xs text-[#71717a]">
            {completedCount}/{totalCount} 完成
          </span>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {/* Key Concepts */}
          <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#6366f1]" />
              <h2 className="text-base font-semibold text-[#fafafa]">关键概念</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {area.keyConcepts.map((concept) => (
                <span
                  key={concept}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46] hover:text-[#fafafa] transition-colors cursor-pointer"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Process Tasks */}
          <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-[#10b981]" />
              <h2 className="text-base font-semibold text-[#fafafa]">
                管理过程 ({area.subtasks.length})
              </h2>
            </div>
            <div className="space-y-2">
              {area.subtasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    task.completed
                      ? "bg-[#10b981]/5 border border-[#10b981]/10"
                      : "bg-[#27272a]/30 border border-white/5 hover:border-white/10"
                  }`}
                >
                  <button className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#3f3f46] hover:text-[#6366f1] transition-colors" />
                    )}
                  </button>
                  <span
                    className={`text-sm flex-1 ${
                      task.completed
                        ? "text-[#a1a1aa] line-through"
                        : "text-[#fafafa]"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.completed && (
                    <span className="text-[10px] text-[#10b981] font-medium">
                      已完成
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Inputs & Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownCircle className="w-4 h-4 text-[#f59e0b]" />
                <h2 className="text-base font-semibold text-[#fafafa]">输入</h2>
              </div>
              <ul className="space-y-2">
                {area.inputs.map((input) => (
                  <li
                    key={input}
                    className="flex items-center gap-2 text-sm text-[#a1a1aa]"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#f59e0b]" />
                    {input}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpCircle className="w-4 h-4 text-[#8b5cf6]" />
                <h2 className="text-base font-semibold text-[#fafafa]">输出</h2>
              </div>
              <ul className="space-y-2">
                {area.outputs.map((output) => (
                  <li
                    key={output}
                    className="flex items-center gap-2 text-sm text-[#a1a1aa]"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#8b5cf6]" />
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation between areas */}
          <div className="flex items-center justify-between pt-4">
            {prevArea ? (
              <Link
                to={`/knowledge/${prevArea.id}`}
                className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{prevArea.shortTitle}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextArea ? (
              <Link
                to={`/knowledge/${nextArea.id}`}
                className="flex items-center gap-2 text-sm text-[#6366f1] hover:text-[#8184f7] transition-colors"
              >
                <span>{nextArea.shortTitle}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={item} className="space-y-4">
          {/* Tools Used */}
          <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-[#06b6d4]" />
              <h3 className="text-sm font-semibold text-[#fafafa]">常用工具与技术</h3>
            </div>
            <ul className="space-y-2">
              {area.tools.map((tool) => (
                <li
                  key={tool}
                  className="text-xs text-[#a1a1aa] px-2.5 py-2 rounded-lg bg-[#27272a]/50"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Tools CTA */}
          <Link
            to="/tools"
            className="block p-5 rounded-xl bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 border border-[#6366f1]/10 hover:border-[#6366f1]/20 transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-[#6366f1]" />
              <span className="text-xs font-semibold text-[#6366f1]">相关工具</span>
            </div>
            <p className="text-sm text-[#a1a1aa] mb-3">
              使用交互式工具加深对 {area.shortTitle} 的理解
            </p>
            <div className="flex items-center gap-1 text-xs text-[#6366f1] font-medium">
              <span>探索工具</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
