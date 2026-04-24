import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Network,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Target,
} from "lucide-react";
import { knowledgeAreas, processGroups } from "@/data/knowledgeAreas";

interface GraphNode {
  id: string;
  label: string;
  type: "area" | "process" | "concept";
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  unlocked: boolean;
}

interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

const CONCEPTS = [
  "项目章程", "WBS", "关键路径", "挣值管理", "风险登记册",
  "干系人分析", "质量审计", "合同管理", "沟通计划", "资源平衡",
];

function createGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Add knowledge areas
  knowledgeAreas.forEach((area, i) => {
    const angle = (i / knowledgeAreas.length) * Math.PI * 2;
    const radius = 200;
    nodes.push({
      id: area.id,
      label: area.shortTitle,
      type: "area",
      color: area.color,
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: 28,
      unlocked: i < 4, // First 4 unlocked
    });
  });

  // Add process groups
  processGroups.forEach((pg, i) => {
    const angle = (i / processGroups.length) * Math.PI * 2 - Math.PI / 5;
    const radius = 120;
    nodes.push({
      id: pg.id,
      label: pg.title.replace("过程组", ""),
      type: "process",
      color: pg.color,
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: 22,
      unlocked: true,
    });
  });

  // Add concept nodes
  CONCEPTS.forEach((concept, i) => {
    const angle = (i / CONCEPTS.length) * Math.PI * 2 + Math.PI / 3;
    const radius = 280 + Math.random() * 50;
    nodes.push({
      id: `concept-${i}`,
      label: concept,
      type: "concept",
      color: "#71717a",
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: 16,
      unlocked: i < 5,
    });
  });

  // Create links between areas and process groups
  knowledgeAreas.forEach((area) => {
    area.processGroups.forEach((pgName) => {
      const pg = processGroups.find((p) => p.title.includes(pgName));
      if (pg) {
        links.push({ source: area.id, target: pg.id, strength: 0.5 });
      }
    });
  });

  // Create links between areas and concepts
  knowledgeAreas.slice(0, 6).forEach((area, i) => {
    const conceptIdx = i % CONCEPTS.length;
    links.push({ source: area.id, target: `concept-${conceptIdx}`, strength: 0.3 });
    if (i + 1 < CONCEPTS.length) {
      links.push({ source: area.id, target: `concept-${conceptIdx + 1}`, strength: 0.2 });
    }
  });

  // Links between process groups
  for (let i = 0; i < processGroups.length - 1; i++) {
    links.push({
      source: processGroups[i].id,
      target: processGroups[i + 1].id,
      strength: 0.8,
    });
  }

  return { nodes, links };
}

function runForceSimulation(
  nodes: GraphNode[],
  links: GraphLink[],
  iterations: number
) {
  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (4000 * (nodes[i].radius + nodes[j].radius)) / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    // Attraction (links)
    links.forEach((link) => {
      const source = nodes.find((n) => n.id === link.source);
      const target = nodes.find((n) => n.id === link.target);
      if (!source || !target) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 100) * link.strength * 0.01;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    });

    // Center gravity
    nodes.forEach((node) => {
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      node.vx += dx * 0.001;
      node.vy += dy * 0.001;
    });

    // Apply velocity and damping
    nodes.forEach((node) => {
      node.vx *= 0.6;
      node.vy *= 0.6;
      node.x += node.vx;
      node.y += node.vy;

      // Boundary
      node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
      node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
    });
  }
}

export function GraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] } | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const data = createGraphData();
    runForceSimulation(data.nodes, data.links, 100);
    setGraphData(data);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.3));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const progress = useMemo(() => {
    if (!graphData) return 0;
    const unlocked = graphData.nodes.filter((n) => n.unlocked).length;
    return Math.round((unlocked / graphData.nodes.length) * 100);
  }, [graphData]);

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-[#a1a1aa]">加载知识图谱...</div>
      </div>
    );
  }

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
          <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
            <Network className="w-5 h-5 text-[#10b981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa]">知识图谱</h1>
            <p className="text-sm text-[#a1a1aa]">
              {graphData.nodes.length} 个节点 · {graphData.links.length} 条连接 · {progress}% 已解锁
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#18181b] rounded-lg p-0.5 border border-white/5">
            <button onClick={handleZoomOut} className="p-2 rounded-md hover:bg-white/5 text-[#a1a1aa]">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="p-2 rounded-md hover:bg-white/5 text-[#a1a1aa]">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={handleZoomIn} className="p-2 rounded-md hover:bg-white/5 text-[#a1a1aa]">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" as const }}
            className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#10b981]"
          />
        </div>
        <span className="text-xs text-[#a1a1aa] font-medium">{progress}%</span>
      </div>

      {/* Graph */}
      <div className="relative rounded-xl bg-[#18181b] border border-white/5 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 800 600"
          className="w-full h-[500px] cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Links */}
            {graphData.links.map((link, i) => {
              const source = graphData.nodes.find((n) => n.id === link.source);
              const target = graphData.nodes.find((n) => n.id === link.target);
              if (!source || !target) return null;
              return (
                <motion.line
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.5 + i * 0.01 }}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#6366f1"
                  strokeWidth={link.strength * 2}
                  strokeDasharray={link.strength < 0.5 ? "4 4" : "none"}
                />
              );
            })}

            {/* Nodes */}
            {graphData.nodes.map((node, i) => (
              <g
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className="cursor-pointer"
              >
                {/* Glow for unlocked */}
                {node.unlocked && (
                  <motion.circle
                    initial={{ r: 0, opacity: 0 }}
                    animate={{ r: node.radius + 8, opacity: 0.15 }}
                    transition={{ delay: 0.8 + i * 0.03, duration: 0.5 }}
                    cx={node.x}
                    cy={node.y}
                    fill={node.color}
                  />
                )}

                {/* Main circle */}
                <motion.circle
                  initial={{ r: 0 }}
                  animate={{ r: node.radius }}
                  transition={{ delay: 0.3 + i * 0.03, type: "spring", stiffness: 200 }}
                  cx={node.x}
                  cy={node.y}
                  fill={node.unlocked ? `${node.color}20` : "#27272a"}
                  stroke={node.unlocked ? node.color : "#3f3f46"}
                  strokeWidth={2}
                />

                {/* Lock icon for locked */}
                {!node.unlocked && (
                  <foreignObject
                    x={node.x - 6}
                    y={node.y - 6}
                    width={12}
                    height={12}
                  >
                    <Lock className="w-3 h-3 text-[#3f3f46]" />
                  </foreignObject>
                )}

                {/* Label */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.03 }}
                  x={node.x}
                  y={node.y + node.radius + 14}
                  textAnchor="middle"
                  fill={node.unlocked ? "#fafafa" : "#71717a"}
                  fontSize={node.type === "area" ? 11 : 9}
                  fontWeight={node.type === "area" ? 600 : 400}
                >
                  {node.label}
                </motion.text>
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-[#18181b]/90 backdrop-blur border border-white/5">
          <div className="text-[10px] text-[#71717a] uppercase tracking-wider mb-2">图例</div>
          <div className="space-y-1.5">
            {[
              { label: "知识领域", color: "#6366f1", size: "w-3 h-3" },
              { label: "过程组", color: "#10b981", size: "w-2.5 h-2.5" },
              { label: "核心概念", color: "#71717a", size: "w-2 h-2" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className={`${item.size} rounded-full`}
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-[#a1a1aa]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Detail */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-[#18181b] border border-white/5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${selectedNode.color}15` }}
            >
              {selectedNode.unlocked ? (
                <Unlock className="w-5 h-5" style={{ color: selectedNode.color }} />
              ) : (
                <Lock className="w-5 h-5 text-[#3f3f46]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#fafafa]">{selectedNode.label}</h3>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${selectedNode.color}15`,
                    color: selectedNode.color,
                  }}
                >
                  {selectedNode.type === "area"
                    ? "知识领域"
                    : selectedNode.type === "process"
                    ? "过程组"
                    : "核心概念"}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: selectedNode.unlocked ? "#10b98115" : "#3f3f46",
                    color: selectedNode.unlocked ? "#10b981" : "#71717a",
                  }}
                >
                  {selectedNode.unlocked ? "已解锁" : "未解锁"}
                </span>
              </div>
            </div>
          </div>

          {selectedNode.type === "area" && (
            <div className="flex items-center gap-2">
              <Link
                to={`/knowledge/${selectedNode.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] text-white text-xs font-medium hover:bg-[#5558e0] transition-all"
              >
                <Target className="w-3.5 h-3.5" />
                学习此领域
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
