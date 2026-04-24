import { useState, createContext, useContext, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
});

export function useLayout() {
  return useContext(LayoutContext);
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      <div className="min-h-screen bg-[#09090b] text-[#fafafa]">
        <TopBar />
        <div className="flex pt-14">
          <Sidebar />
          <main
            className="flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-56px)]"
            style={{
              marginLeft: sidebarCollapsed ? "64px" : "240px",
            }}
          >
            <div className="p-6 max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
