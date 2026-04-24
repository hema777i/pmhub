import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Layout,
  Plus,
  X,
  Calendar,
  Flag,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";
import { sampleKanbanColumns, type KanbanColumn, type KanbanTask } from "@/data/toolsData";

const priorityConfig = {
  high: { label: "高", color: "#ef4444", bg: "#ef444415" },
  medium: { label: "中", color: "#f59e0b", bg: "#f59e0b15" },
  low: { label: "低", color: "#10b981", bg: "#10b98115" },
};

export function KanbanPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>(sampleKanbanColumns);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggingTask(taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();
      if (!draggingTask) return;

      setColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.id !== draggingTask),
        }));

        const sourceCol = prev.find((col) =>
          col.tasks.some((t) => t.id === draggingTask)
        );
        const task = sourceCol?.tasks.find((t) => t.id === draggingTask);
        if (!task) return prev;

        const targetCol = newColumns.find((col) => col.id === targetColumnId);
        if (targetCol) {
          targetCol.tasks.push(task);
        }

        return newColumns;
      });

      setDraggingTask(null);
      setDragOverColumn(null);
    },
    [draggingTask]
  );

  const handleAddTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      priority: "medium",
      assignee: "我",
      tag: "新任务",
      dueDate: "待定",
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
    setNewTaskTitle("");
    setShowAddTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
    setSelectedTask(null);
  };

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);

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
          <div className="w-9 h-9 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
            <Layout className="w-5 h-5 text-[#06b6d4]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#fafafa]">Kanban看板</h1>
            <p className="text-xs text-[#a1a1aa]">{totalTasks} 个任务 · 拖拽管理</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-shrink-0 w-72 rounded-xl bg-[#18181b] border transition-all ${
              dragOverColumn === column.id
                ? "border-[#6366f1]/40 bg-[#6366f1]/5"
                : "border-white/5"
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <span className="text-sm font-semibold text-[#fafafa]">
                  {column.title}
                </span>
                <span className="text-xs text-[#71717a] bg-[#27272a] px-1.5 py-0.5 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button className="p-1 rounded hover:bg-white/5 text-[#71717a]">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-2 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {column.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onClick={() => {
                      setSelectedTask(task);
                      // column selected
                    }}
                    className={`p-3 rounded-lg bg-[#27272a]/50 border border-white/5 cursor-grab active:cursor-grabbing hover:border-white/10 transition-all group ${
                      draggingTask === task.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-3.5 h-3.5 text-[#3f3f46] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-[#fafafa] mb-2">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: priorityConfig[task.priority].bg,
                              color: priorityConfig[task.priority].color,
                            }}
                          >
                            {priorityConfig[task.priority].label}
                          </span>
                          <span className="text-[9px] text-[#71717a] px-1.5 py-0.5 rounded-full bg-white/5">
                            {task.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-[10px] text-[#71717a]">
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[#a1a1aa]">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[8px] text-white font-medium">
                              {task.assignee[0]}
                            </div>
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Task */}
              {showAddTask === column.id ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-[#27272a]/50 border border-white/5"
                >
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTask(column.id);
                      if (e.key === "Escape") setShowAddTask(null);
                    }}
                    autoFocus
                    className="w-full h-8 px-2 rounded bg-[#18181b] border border-white/5 text-xs text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#6366f1]/30 mb-2"
                    placeholder="输入任务标题"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="px-3 py-1.5 rounded-md bg-[#6366f1] text-white text-xs font-medium hover:bg-[#5558e0] transition-all"
                    >
                      添加
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTask(null);
                        setNewTaskTitle("");
                      }}
                      className="p-1.5 rounded-md hover:bg-white/5 text-[#71717a]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowAddTask(column.id)}
                  className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#71717a] hover:text-[#a1a1aa] hover:bg-white/5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加任务
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#fafafa] mb-1">
                    {selectedTask.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: priorityConfig[selectedTask.priority].bg,
                        color: priorityConfig[selectedTask.priority].color,
                      }}
                    >
                      {priorityConfig[selectedTask.priority].label}优先级
                    </span>
                    <span className="text-[10px] text-[#71717a] px-1.5 py-0.5 rounded-full bg-white/5">
                      {selectedTask.tag}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-[#71717a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#71717a]" />
                  <span className="text-sm text-[#a1a1aa]">截止日期: {selectedTask.dueDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-[#71717a]" />
                  <span className="text-sm text-[#a1a1aa]">负责人: {selectedTask.assignee}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="flex-1 h-9 rounded-lg bg-[#ef4444]/10 text-[#ef4444] text-sm font-medium hover:bg-[#ef4444]/20 transition-all"
                >
                  删除任务
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 h-9 rounded-lg bg-[#27272a] text-[#a1a1aa] text-sm hover:text-[#fafafa] transition-all"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
