import { Search, Bell, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const breadcrumbMap: Record<string, string> = {
  "/": "仪表盘",
  "/knowledge": "知识库",
  "/process-groups": "过程组",
  "/tools": "交互工具",
  "/graph": "知识图谱",
  "/profile": "个人中心",
  "/tools/gantt": "甘特图",
  "/tools/burndown": "燃尽图",
  "/tools/risk": "风险矩阵",
  "/tools/kanban": "Kanban看板",
  "/tools/wbs": "WBS分解",
};

export function TopBar() {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);

  const currentLabel = breadcrumbMap[location.pathname] || "PM Master";
  const isToolPage = location.pathname.startsWith("/tools/");

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-[#71717a] font-medium">PM Master</span>
          <span className="text-[#3f3f46]">/</span>
          <span className="text-[#fafafa] font-semibold">{currentLabel}</span>
          {isToolPage && (
            <>
              <span className="text-[#3f3f46]">/</span>
              <span className="text-[#6366f1] text-xs font-medium px-2 py-0.5 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20">
                交互工具
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className={`relative flex items-center transition-all duration-300 ${
            searchFocused ? "w-72" : "w-56"
          }`}
        >
          <Search className="absolute left-3 w-4 h-4 text-[#71717a] pointer-events-none" />
          <input
            type="text"
            placeholder="搜索知识库、工具..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#18181b] border border-white/5 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#6366f1]/30 focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* System Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10b981]/5 border border-[#10b981]/10">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping opacity-40" />
          </div>
          <span className="text-xs text-[#10b981] font-medium">系统正常</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-[#18181b] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors group">
          <Bell className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ef4444] text-[10px] text-white flex items-center justify-center font-medium">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="w-9 h-9 rounded-lg bg-[#18181b] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors group">
          <Settings className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#6366f1]/30 transition-all">
          <span className="text-sm font-semibold text-white">PM</span>
        </div>
      </div>
    </header>
  );
}
