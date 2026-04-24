import { NavLink, useLocation } from "react-router-dom";
import { useLayout } from "./AppLayout";
import {
  LayoutDashboard,
  BookOpen,
  GitBranch,
  Wrench,
  Network,
  User,
  ChevronLeft,
  ChevronRight,
  Library,
  MessageSquare,
  LogIn,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", label: "仪表盘", icon: LayoutDashboard },
  { path: "/knowledge", label: "知识库", icon: BookOpen },
  { path: "/process-groups", label: "过程组", icon: Library },
  { path: "/graph", label: "知识图谱", icon: Network },
  { path: "/tools", label: "交互工具", icon: Wrench },
  { path: "/chat", label: "AI助手", icon: MessageSquare },
  { path: "/profile", label: "个人中心", icon: User },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const location = useLocation();
  const { user, login, logout } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-14 bottom-0 bg-[#18181b]/80 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-[#27272a] border border-white/10 flex items-center justify-center hover:bg-[#3f3f46] transition-colors z-50"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-[#a1a1aa]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#a1a1aa]" />
        )}
      </button>

      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/5">
        {sidebarCollapsed ? (
          <GitBranch className="w-6 h-6 text-[#6366f1]" />
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#fafafa]">
              PM Master
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  active || isActive
                    ? "bg-[#6366f1]/10 text-[#6366f1]"
                    : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5"
                }`
              }
            >
              {(isActive) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#6366f1] rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-[#6366f1]" : ""}`} />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {sidebarCollapsed && isActive && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272a] rounded text-xs text-[#fafafa] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status & Auth */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#10b981]/5 border border-[#10b981]/10">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-glow" />
            </div>
            <span className="text-xs text-[#10b981] font-medium">系统正常运行</span>
          </div>
          {user ? (
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    {user.username[0]}
                  </div>
                )}
                <span className="text-xs text-[#a1a1aa] truncate max-w-[100px]">{user.username}</span>
              </div>
              <button onClick={logout} className="text-[#a1a1aa] hover:text-[#ef4444] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>GitHub 登录</span>
            </button>
          )}
        </div>
      )}
    </motion.aside>
  );
}
