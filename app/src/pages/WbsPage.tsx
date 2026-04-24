import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  GitBranch,
  ChevronRight,
  FolderOpen,
  FileText,
  Layers,
} from "lucide-react";
import { sampleWBS, type WBSNode } from "@/data/toolsData";

interface TreeNodeProps {
  node: WBSNode;
  level: number;
  parentExpanded: boolean;
}

function TreeNode({ node, level, parentExpanded }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const colorHue = (level * 45 + 230) % 360;
  const color = `hsl(${colorHue}, 70%, ${60 - level * 8}%)`;

  if (!parentExpanded) return null;

  return (
    <div>
      {/* Connector Lines */}
      <div className="flex items-center">
        {/* Indentation */}
        {Array.from({ length: level }).map((_, i) => (
          <div key={i} className="w-6 flex-shrink-0 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#27272a]" />
          </div>
        ))}

        {/* Node */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.05 }}
          className={`flex items-center gap-2 py-2 px-3 rounded-lg flex-1 cursor-pointer transition-all ${
            hasChildren
              ? "hover:bg-[#27272a]/50"
              : "hover:bg-white/[0.02]"
          }`}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {hasChildren ? (
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-[#71717a]" />
            </motion.div>
          ) : (
            <div className="w-4" />
          )}

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            {hasChildren ? (
              <FolderOpen className="w-4 h-4" style={{ color }} />
            ) : (
              <FileText className="w-4 h-4" style={{ color }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#71717a]">{node.id}</span>
              <span className="text-sm text-[#fafafa] font-medium truncate">{node.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#71717a]">
            {hasChildren && (
              <span>{node.children?.length} 个子项</span>
            )}
            {!hasChildren && (
              <span className="px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981]">
                工作包
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {node.children?.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                parentExpanded={expanded}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WbsPage() {
  const [viewMode, setViewMode] = useState<"tree" | "outline">("tree");

  const totalNodes = (nodes: WBSNode[]): number => {
    return nodes.reduce((sum, n) => sum + 1 + (n.children ? totalNodes(n.children) : 0), 0);
  };

  const totalWorkPackages = (nodes: WBSNode[]): number => {
    return nodes.reduce((sum, n) => {
      if (!n.children || n.children.length === 0) return sum + 1;
      return sum + totalWorkPackages(n.children);
    }, 0);
  };

  const nodeCount = totalNodes(sampleWBS);
  const wpCount = totalWorkPackages(sampleWBS);

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
          <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#fafafa]">WBS分解</h1>
            <p className="text-xs text-[#a1a1aa]">工作分解结构 · 交互式层级展示</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#18181b] rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => setViewMode("tree")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "tree"
                ? "bg-[#27272a] text-[#fafafa]"
                : "text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            树形
          </button>
          <button
            onClick={() => setViewMode("outline")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "outline"
                ? "bg-[#27272a] text-[#fafafa]"
                : "text-[#71717a] hover:text-[#a1a1aa]"
            }`}
          >
            大纲
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "总节点", value: nodeCount, icon: Layers, color: "#6366f1" },
          { label: "工作包", value: wpCount, icon: FileText, color: "#10b981" },
          { label: "层级深度", value: "3", icon: GitBranch, color: "#f59e0b" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="p-4 rounded-xl bg-[#18181b] border border-white/5 text-center"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div className="text-xl font-bold text-[#fafafa]">{stat.value}</div>
            <div className="text-[10px] text-[#71717a] uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tree View */}
      {viewMode === "tree" && (
        <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
          <div className="space-y-1">
            {sampleWBS.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                parentExpanded={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Outline View */}
      {viewMode === "outline" && (
        <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                    WBS编码
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                    名称
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                    层级
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                    类型
                  </th>
                </tr>
              </thead>
              <tbody>
                {flattenWBS(sampleWBS).map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono text-xs text-[#71717a]">
                      {item.id}
                    </td>
                    <td
                      className="py-2.5 px-4 text-[#fafafa]"
                      style={{ paddingLeft: `${16 + item.level * 24}px` }}
                    >
                      <span className={item.level === 0 ? "font-semibold" : ""}>
                        {item.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#27272a] text-[#a1a1aa]">
                        L{item.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: item.isWorkPackage
                            ? "#10b98115"
                            : "#6366f115",
                          color: item.isWorkPackage ? "#10b981" : "#6366f1",
                        }}
                      >
                        {item.isWorkPackage ? "工作包" : "可交付成果"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function flattenWBS(
  nodes: WBSNode[],
  level = 0
): Array<{ id: string; name: string; level: number; isWorkPackage: boolean }> {
  const result: Array<{ id: string; name: string; level: number; isWorkPackage: boolean }> = [];
  for (const node of nodes) {
    const hasChildren = node.children && node.children.length > 0;
    result.push({
      id: node.id,
      name: node.name,
      level,
      isWorkPackage: !hasChildren,
    });
    if (hasChildren) {
      result.push(...flattenWBS(node.children!, level + 1));
    }
  }
  return result;
}
