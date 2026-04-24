import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  User,
  Link2,
  Download,
  RotateCcw,
} from "lucide-react";
import { sampleGanttTasks, type GanttTask } from "@/data/toolsData";

const DAY_WIDTH = 40;
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 44;
const TASK_LABEL_WIDTH = 200;

export function GanttPage() {
  const [tasks, setTasks] = useState<GanttTask[]>(sampleGanttTasks);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const totalDays = useMemo(() => {
    return Math.max(...tasks.map((t) => t.start + t.duration)) + 2;
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, progress: t.progress >= 100 ? 0 : 100 } : t))
    );
  };

  const reset = () => setTasks(sampleGanttTasks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/tools"
            className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#6366f1]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#fafafa]">甘特图</h1>
            <p className="text-xs text-[#a1a1aa]">项目进度可视化工具</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181b] border border-white/5 text-xs text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#6366f1] text-xs text-white font-medium hover:bg-[#5558e0] transition-all">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="rounded-xl bg-[#18181b] border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#71717a]" />
            <span className="text-xs text-[#a1a1aa]">项目周期: {totalDays} 天</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#71717a]" />
            <span className="text-xs text-[#a1a1aa]">{tasks.length} 个任务</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-[#71717a]" />
            <span className="text-xs text-[#a1a1aa]">
              {tasks.reduce((sum, t) => sum + t.dependencies.length, 0)} 个依赖
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="overflow-x-auto scrollbar-thin">
          <div style={{ minWidth: TASK_LABEL_WIDTH + totalDays * DAY_WIDTH }}>
            {/* Header Row */}
            <div className="flex border-b border-white/5" style={{ height: HEADER_HEIGHT }}>
              <div
                className="flex-shrink-0 flex items-center px-4 text-xs font-semibold text-[#71717a] uppercase tracking-wider bg-[#18181b] sticky left-0 z-20 border-r border-white/5"
                style={{ width: TASK_LABEL_WIDTH }}
              >
                任务
              </div>
              <div className="relative flex-1">
                {Array.from({ length: totalDays }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full flex items-center justify-center text-[10px] text-[#71717a] border-l border-white/5"
                    style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                  >
                    第{i + 1}天
                  </div>
                ))}
              </div>
            </div>

            {/* Task Rows */}
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex border-b border-white/5 hover:bg-white/[0.02] transition-colors relative"
                style={{ height: ROW_HEIGHT }}
                onMouseEnter={() => setHoveredTask(task.id)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                {/* Task Label */}
                <div
                  className="flex-shrink-0 flex items-center px-4 gap-2 bg-[#18181b] sticky left-0 z-10 border-r border-white/5"
                  style={{ width: TASK_LABEL_WIDTH }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: task.color }}
                  />
                  <span className="text-xs text-[#fafafa] font-medium truncate">
                    {task.name}
                  </span>
                </div>

                {/* Timeline Area */}
                <div className="relative flex-1">
                  {/* Grid Lines */}
                  {Array.from({ length: totalDays }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-l border-white/[0.03]"
                      style={{ left: i * DAY_WIDTH }}
                    />
                  ))}

                  {/* Dependency Lines */}
                  {task.dependencies.map((depId) => {
                    const depTask = tasks.find((t) => t.id === depId);
                    if (!depTask) return null;
                    const depIndex = tasks.findIndex((t) => t.id === depId);
                    const startX = (task.start + 0) * DAY_WIDTH;
                    const startY = 0;
                    const endX = (depTask.start + depTask.duration) * DAY_WIDTH;
                    const endY = (depIndex - index) * ROW_HEIGHT;
                    return (
                      <svg
                        key={depId}
                        className="absolute pointer-events-none"
                        style={{
                          left: Math.min(startX, endX) + DAY_WIDTH / 2,
                          top: ROW_HEIGHT / 2,
                          width: Math.abs(startX - endX) + DAY_WIDTH,
                          height: Math.abs(endY) + ROW_HEIGHT,
                          overflow: "visible",
                        }}
                      >
                        <path
                          d={`M ${startX < endX ? 0 : Math.abs(startX - endX)} ${startY} 
                              C ${startX < endX ? 0 : Math.abs(startX - endX)} ${endY / 2 + startY},
                                ${startX < endX ? Math.abs(startX - endX) : 0} ${endY / 2 + startY},
                                ${startX < endX ? Math.abs(startX - endX) : 0} ${endY}`}
                          fill="none"
                          stroke={task.color}
                          strokeWidth="1"
                          strokeDasharray="4 2"
                          opacity="0.4"
                        />
                      </svg>
                    );
                  })}

                  {/* Task Bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + index * 0.08, duration: 0.5, ease: "easeOut" as const }}
                    className="absolute top-1/2 -translate-y-1/2 h-7 rounded-md cursor-pointer overflow-hidden"
                    style={{
                      left: task.start * DAY_WIDTH + 4,
                      width: task.duration * DAY_WIDTH - 8,
                      backgroundColor: `${task.color}20`,
                      border: `1px solid ${task.color}40`,
                      transformOrigin: "left",
                    }}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div
                      className="h-full rounded-md transition-all duration-300"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: task.progress === 100 ? task.color : `${task.color}80`,
                      }}
                    />
                    {/* Progress Label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white drop-shadow-md">
                        {task.progress}%
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Details */}
      {hoveredTask && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-[#18181b] border border-white/5"
        >
          {(() => {
            const task = tasks.find((t) => t.id === hoveredTask);
            if (!task) return null;
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1">
                    任务
                  </div>
                  <div className="text-sm text-[#fafafa] font-medium">{task.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1">
                    负责人
                  </div>
                  <div className="text-sm text-[#a1a1aa]">{task.assignee}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1">
                    进度
                  </div>
                  <div className="text-sm font-medium" style={{ color: task.color }}>
                    {task.progress}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1">
                    工期
                  </div>
                  <div className="text-sm text-[#a1a1aa]">{task.duration} 天</div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* How to Use */}
      <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
        <h3 className="text-sm font-semibold text-[#fafafa] mb-3">使用说明</h3>
        <ul className="space-y-2 text-xs text-[#a1a1aa]">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
            点击任务条可切换完成状态
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            悬停任务查看详细信息
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            虚线表示任务间的依赖关系
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
