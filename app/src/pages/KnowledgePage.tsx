import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Target,
  ArrowRight,
  Filter,
  BookOpen,
  CheckCircle2,
  Circle,
} from "lucide-react";
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

const processGroupFilters = ["全部", "启动", "规划", "执行", "监控", "收尾"];

export function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("全部");

  const filteredAreas = knowledgeAreas.filter((area) => {
    const matchesSearch =
      searchQuery === "" ||
      area.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.keyConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      activeFilter === "全部" || area.processGroups.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#6366f1]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa]">知识库</h1>
            <p className="text-sm text-[#a1a1aa]">
              PMBOK第七版十大知识领域 · {knowledgeAreas.length} 个知识领域 · 49 个过程
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={item} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            type="text"
            placeholder="搜索知识领域、关键概念、ITTO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#18181b] border border-white/5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#6366f1]/30 focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#71717a]" />
          {processGroupFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === filter
                  ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20"
                  : "bg-[#18181b] text-[#a1a1aa] border border-white/5 hover:text-[#fafafa] hover:bg-white/5"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Knowledge Area Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAreas.map((area) => {
          const completedCount = area.subtasks.filter((t) => t.completed).length;
          const totalCount = area.subtasks.length;
          const progress = Math.round((completedCount / totalCount) * 100);

          return (
            <motion.div
              key={area.id}
              variants={item}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={`/knowledge/${area.id}`}
                className="block p-5 rounded-xl bg-[#18181b] border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${area.color}15` }}
                    >
                      <Target className="w-5 h-5" style={{ color: area.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#fafafa] group-hover:text-white transition-colors">
                        {area.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {area.processGroups.map((pg) => (
                          <span
                            key={pg}
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-[#71717a]"
                          >
                            {pg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#3f3f46] group-hover:text-[#6366f1] group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-sm text-[#a1a1aa] mb-4 line-clamp-2 leading-relaxed">
                  {area.description}
                </p>

                {/* Key Concepts */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {area.keyConcepts.slice(0, 4).map((concept) => (
                    <span
                      key={concept}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-[#27272a] text-[#a1a1aa]"
                    >
                      {concept}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" as const }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: area.color }}
                    />
                  </div>
                  <span className="text-xs text-[#71717a] font-medium">
                    {completedCount}/{totalCount}
                  </span>
                </div>

                {/* Subtasks Preview */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                  {area.subtasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-2">
                      {task.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-[#3f3f46]" />
                      )}
                      <span
                        className={`text-xs ${
                          task.completed ? "text-[#a1a1aa] line-through" : "text-[#71717a]"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}
                  {area.subtasks.length > 3 && (
                    <div className="text-[10px] text-[#6366f1] pl-5.5">
                      还有 {area.subtasks.length - 3} 个过程...
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredAreas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Search className="w-10 h-10 text-[#3f3f46] mx-auto mb-3" />
          <p className="text-sm text-[#a1a1aa]">没有找到匹配的知识领域</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("全部");
            }}
            className="mt-3 text-xs text-[#6366f1] hover:underline"
          >
            清除搜索条件
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
