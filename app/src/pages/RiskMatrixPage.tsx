import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import { sampleRisks, type RiskItem } from "@/data/toolsData";

const PROBABILITY_LABELS = ["极低", "低", "中", "高", "极高"];
const IMPACT_LABELS = ["极低", "低", "中", "高", "极高"];

function getRiskColor(p: number, i: number) {
  const score = p * i;
  if (score >= 16) return "#ef4444";
  if (score >= 9) return "#f59e0b";
  if (score >= 4) return "#fbbf24";
  return "#10b981";
}

function getRiskLevel(p: number, i: number) {
  const score = p * i;
  if (score >= 16) return "极高";
  if (score >= 9) return "高";
  if (score >= 4) return "中";
  return "低";
}

export function RiskMatrixPage() {
  const [risks, setRisks] = useState<RiskItem[]>(sampleRisks);
  const [selectedCell, setSelectedCell] = useState<{ p: number; i: number } | null>(null);
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRisk, setNewRisk] = useState({ name: "", category: "", probability: 3, impact: 3, mitigation: "" });

  const matrixRisks = useMemo(() => {
    const grid: RiskItem[][][] = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => [])
    );
    risks.forEach((risk) => {
      const pIdx = risk.probability - 1;
      const iIdx = risk.impact - 1;
      if (pIdx >= 0 && pIdx < 5 && iIdx >= 0 && iIdx < 5) {
        grid[pIdx][iIdx].push(risk);
      }
    });
    return grid;
  }, [risks]);

  const handleAddRisk = () => {
    if (!newRisk.name.trim()) return;
    const risk: RiskItem = {
      id: `risk-${Date.now()}`,
      name: newRisk.name,
      probability: newRisk.probability,
      impact: newRisk.impact,
      category: newRisk.category || "其他",
      mitigation: newRisk.mitigation || "待制定",
    };
    setRisks((prev) => [...prev, risk]);
    setNewRisk({ name: "", category: "", probability: 3, impact: 3, mitigation: "" });
    setShowAddModal(false);
  };

  const handleDeleteRisk = (id: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredRisks = selectedCell
    ? risks.filter((r) => r.probability === selectedCell.p + 1 && r.impact === selectedCell.i + 1)
    : risks;

  const riskStats = useMemo(() => {
    const total = risks.length;
    const high = risks.filter((r) => r.probability * r.impact >= 9).length;
    const medium = risks.filter((r) => {
      const score = r.probability * r.impact;
      return score >= 4 && score < 9;
    }).length;
    const low = risks.filter((r) => r.probability * r.impact < 4).length;
    return { total, high, medium, low };
  }, [risks]);

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
          <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#fafafa]">风险矩阵</h1>
            <p className="text-xs text-[#a1a1aa]">概率×影响评估 · 风险优先级排序</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#6366f1] text-xs text-white font-medium hover:bg-[#5558e0] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          添加风险
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "总风险数", value: riskStats.total, color: "#6366f1" },
          { label: "高风险", value: riskStats.high, color: "#ef4444" },
          { label: "中风险", value: riskStats.medium, color: "#f59e0b" },
          { label: "低风险", value: riskStats.low, color: "#10b981" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="p-4 rounded-xl bg-[#18181b] border border-white/5 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-[10px] text-[#71717a] uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Matrix */}
      <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#fafafa]">风险概率-影响矩阵</h3>
          {selectedCell && (
            <button
              onClick={() => setSelectedCell(null)}
              className="text-xs text-[#6366f1] hover:underline"
            >
              显示全部
            </button>
          )}
        </div>

        <div className="flex">
          {/* Y Axis Label */}
          <div className="flex flex-col justify-center pr-3">
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider -rotate-90 whitespace-nowrap">
              概率 →
            </span>
          </div>

          <div className="flex-1">
            {/* Matrix Grid */}
            <div className="grid grid-cols-6 gap-1">
              {/* Header Row */}
              <div className="w-12" />
              {IMPACT_LABELS.map((label, i) => (
                <div key={i} className="text-center text-[10px] text-[#71717a] py-1">
                  {label}
                </div>
              ))}

              {/* Rows */}
              {PROBABILITY_LABELS.map((pLabel, pIdx) => (
                <div key={pIdx} className="contents">
                  <div className="flex items-center justify-end pr-2 text-[10px] text-[#71717a]">
                    {pLabel}
                  </div>
                  {IMPACT_LABELS.map((_, iIdx) => {
                    const cellRisks = matrixRisks[pIdx][iIdx];
                    const isSelected = selectedCell?.p === pIdx && selectedCell?.i === iIdx;
                    const cellColor = getRiskColor(pIdx + 1, iIdx + 1);

                    return (
                      <motion.div
                        key={iIdx}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCell(isSelected ? null : { p: pIdx, i: iIdx })}
                        className={`relative aspect-square rounded-lg cursor-pointer transition-all border-2 ${
                          isSelected ? "border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: `${cellColor}15` }}
                      >
                        {cellRisks.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${cellColor}30`, color: cellColor }}
                            >
                              {cellRisks.length}
                            </div>
                          </div>
                        )}
                        {/* Risk dots */}
                        <div className="absolute bottom-1 left-1 flex gap-0.5">
                          {cellRisks.slice(0, 3).map((r) => (
                            <div
                              key={r.id}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: cellColor }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* X Axis Label */}
            <div className="text-center text-[10px] text-[#71717a] uppercase tracking-wider mt-2">
              ← 影响
            </div>
          </div>
        </div>
      </div>

      {/* Risk List */}
      <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
        <h3 className="text-sm font-semibold text-[#fafafa] mb-4">
          风险清单 {selectedCell && `· ${PROBABILITY_LABELS[selectedCell.p]}概率 × ${IMPACT_LABELS[selectedCell.i]}影响`}
        </h3>
        <div className="space-y-2">
          <AnimatePresence>
            {filteredRisks.map((risk, i) => {
              const score = risk.probability * risk.impact;
              const color = getRiskColor(risk.probability, risk.impact);
              const level = getRiskLevel(risk.probability, risk.impact);

              return (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-lg bg-[#27272a]/30 border border-white/5 hover:border-white/10 transition-all"
                  onMouseEnter={() => setHoveredRisk(risk.id)}
                  onMouseLeave={() => setHoveredRisk(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-[#fafafa]">{risk.name}</h4>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${color}15`, color }}
                        >
                          {level}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#71717a] mb-2">
                        <span>类别: {risk.category}</span>
                        <span>概率: {PROBABILITY_LABELS[risk.probability - 1]}</span>
                        <span>影响: {IMPACT_LABELS[risk.impact - 1]}</span>
                        <span>得分: {score}</span>
                      </div>
                      <p className="text-xs text-[#a1a1aa]">
                        <span className="text-[#71717a]">应对措施: </span>
                        {risk.mitigation}
                      </p>
                    </div>
                    {hoveredRisk === risk.id && (
                      <button
                        onClick={() => handleDeleteRisk(risk.id)}
                        className="ml-3 p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[#71717a] hover:text-[#ef4444] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Risk Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-xl bg-[#18181b] border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-[#fafafa]">添加新风险</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-[#71717a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#71717a] mb-1.5 block">风险名称</label>
                  <input
                    type="text"
                    value={newRisk.name}
                    onChange={(e) => setNewRisk((p) => ({ ...p, name: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-[#27272a] border border-white/5 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1]/30"
                    placeholder="输入风险名称"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#71717a] mb-1.5 block">类别</label>
                  <input
                    type="text"
                    value={newRisk.category}
                    onChange={(e) => setNewRisk((p) => ({ ...p, category: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-[#27272a] border border-white/5 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1]/30"
                    placeholder="如：技术、资源、外部"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#71717a] mb-1.5 block">概率 (1-5)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newRisk.probability}
                      onChange={(e) => setNewRisk((p) => ({ ...p, probability: Number(e.target.value) }))}
                      className="w-full accent-[#6366f1]"
                    />
                    <div className="text-center text-xs text-[#a1a1aa] mt-1">
                      {PROBABILITY_LABELS[newRisk.probability - 1]}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#71717a] mb-1.5 block">影响 (1-5)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newRisk.impact}
                      onChange={(e) => setNewRisk((p) => ({ ...p, impact: Number(e.target.value) }))}
                      className="w-full accent-[#6366f1]"
                    />
                    <div className="text-center text-xs text-[#a1a1aa] mt-1">
                      {IMPACT_LABELS[newRisk.impact - 1]}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#71717a] mb-1.5 block">应对措施</label>
                  <textarea
                    value={newRisk.mitigation}
                    onChange={(e) => setNewRisk((p) => ({ ...p, mitigation: e.target.value }))}
                    className="w-full h-20 px-3 py-2 rounded-lg bg-[#27272a] border border-white/5 text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1]/30 resize-none"
                    placeholder="描述应对措施..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleAddRisk}
                    className="flex-1 h-9 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#5558e0] transition-all"
                  >
                    添加风险
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="h-9 px-4 rounded-lg bg-[#27272a] text-[#a1a1aa] text-sm hover:text-[#fafafa] transition-all"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
