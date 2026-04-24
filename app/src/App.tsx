import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { KnowledgePage } from "@/pages/KnowledgePage";
import { KnowledgeDetailPage } from "@/pages/KnowledgeDetailPage";
import { ProcessGroupsPage } from "@/pages/ProcessGroupsPage";
import { ToolsPage } from "@/pages/ToolsPage";
import { GanttPage } from "@/pages/GanttPage";
import { BurndownPage } from "@/pages/BurndownPage";
import { RiskMatrixPage } from "@/pages/RiskMatrixPage";
import { KanbanPage } from "@/pages/KanbanPage";
import { WbsPage } from "@/pages/WbsPage";
import { GraphPage } from "@/pages/GraphPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ChatPage } from "@/pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
            <Route path="/process-groups" element={<ProcessGroupsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/gantt" element={<GanttPage />} />
            <Route path="/tools/burndown" element={<BurndownPage />} />
            <Route path="/tools/risk" element={<RiskMatrixPage />} />
            <Route path="/tools/kanban" element={<KanbanPage />} />
            <Route path="/tools/wbs" element={<WbsPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </AnimatePresence>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
