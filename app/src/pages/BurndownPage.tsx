import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingDown,
  Calendar,
  Flame,
  Info,
} from "lucide-react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { sampleBurndownData } from "@/data/toolsData";

export function BurndownPage() {
  const [showIdeal, setShowIdeal] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const data = useMemo(() => {
    return sampleBurndownData.map((d) => ({
      ...d,
      actual: d.actual !== null ? d.actual : undefined,
    }));
  }, []);

  const currentDay = data.filter((d) => d.actual !== undefined).length;
  const totalWork = data[0]?.ideal || 120;
  const remainingWork = data[currentDay - 1]?.actual || 0;
  const idealRemaining = data[currentDay - 1]?.ideal || 0;
  const variance = remainingWork - idealRemaining;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#27272a] border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-[#71717a] mb-1">第 {label} 天</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value !== undefined ? entry.value : "—"} 小时
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-[#10b981]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#fafafa]">燃尽图</h1>
            <p className="text-xs text-[#a1a1aa]">Sprint进度追踪 · 敏捷项目管理</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Sprint天数",
            value: `${data.length}`,
            sub: "总工期",
            icon: Calendar,
            color: "#6366f1",
          },
          {
            label: "总工作量",
            value: `${totalWork}h`,
            sub: "计划工时",
            icon: Flame,
            color: "#f59e0b",
          },
          {
            label: "已完成",
            value: `${totalWork - remainingWork}h`,
            sub: `${Math.round(((totalWork - remainingWork) / totalWork) * 100)}%`,
            icon: TrendingDown,
            color: "#10b981",
          },
          {
            label: "偏差",
            value: `${variance > 0 ? "+" : ""}${variance}h`,
            sub: variance > 0 ? "落后计划" : "超前计划",
            icon: Info,
            color: variance > 0 ? "#ef4444" : "#10b981",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="p-4 rounded-xl bg-[#18181b] border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="text-xl font-bold text-[#fafafa]">{stat.value}</div>
            <div className="text-[10px] text-[#71717a]">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-[#fafafa]">Sprint燃尽趋势</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowIdeal(!showIdeal)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all ${
                showIdeal
                  ? "bg-[#a1a1aa]/10 text-[#a1a1aa]"
                  : "bg-transparent text-[#71717a]"
              }`}
            >
              <div className="w-3 h-0.5 bg-[#a1a1aa] rounded-full" />
              理想线
            </button>
            <div className="flex items-center gap-1.5 text-xs text-[#10b981]">
              <div className="w-3 h-0.5 bg-[#10b981] rounded-full" />
              实际线
            </div>
          </div>
        </div>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onClick={(e) => {
                if (e && e.activeLabel) {
                  setSelectedDay(Number(e.activeLabel));
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#3f3f46"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Sprint天数", position: "insideBottom", offset: -5, fill: "#71717a", fontSize: 11 }}
              />
              <YAxis
                stroke="#3f3f46"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                label={{ value: "剩余工时(h)", angle: -90, position: "insideLeft", offset: 20, fill: "#71717a", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              {showIdeal && (
                <Area
                  type="monotone"
                  dataKey="ideal"
                  stroke="#a1a1aa"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  fill="transparent"
                  name="理想剩余"
                  dot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="#10b981"
                name="实际剩余"
                dot={{ r: 3, fill: "#10b981", stroke: "#18181b", strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: "#18181b", strokeWidth: 2 }}
              />
              <ReferenceLine
                x={currentDay}
                stroke="#6366f1"
                strokeDasharray="3 3"
                label={{ value: "今天", fill: "#6366f1", fontSize: 10, position: "top" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="p-5 rounded-xl bg-[#18181b] border border-white/5">
        <h3 className="text-sm font-semibold text-[#fafafa] mb-4">每日明细</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 px-3 text-[#71717a] font-medium">天数</th>
                <th className="text-right py-2 px-3 text-[#71717a] font-medium">理想剩余</th>
                <th className="text-right py-2 px-3 text-[#71717a] font-medium">实际剩余</th>
                <th className="text-right py-2 px-3 text-[#71717a] font-medium">偏差</th>
                <th className="text-right py-2 px-3 text-[#71717a] font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const actual = d.actual !== undefined ? d.actual : null;
                const diff = actual !== null ? actual - d.ideal : null;
                return (
                  <motion.tr
                    key={d.day}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className={`border-b border-white/5 ${selectedDay === d.day ? "bg-[#6366f1]/5" : ""}`}
                    onClick={() => setSelectedDay(d.day)}
                  >
                    <td className="py-2.5 px-3 text-[#fafafa]">第{d.day}天</td>
                    <td className="py-2.5 px-3 text-right text-[#a1a1aa]">{d.ideal}h</td>
                    <td className="py-2.5 px-3 text-right text-[#fafafa]">
                      {actual !== null ? `${actual}h` : "—"}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-medium"
                      style={{ color: diff !== null ? (diff > 0 ? "#ef4444" : "#10b981") : "#71717a" }}
                    >
                      {diff !== null ? `${diff > 0 ? "+" : ""}${diff}h` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {actual !== null ? (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: diff !== null && diff <= 0 ? "#10b98115" : "#ef444415",
                            color: diff !== null && diff <= 0 ? "#10b981" : "#ef4444",
                          }}
                        >
                          {diff !== null && diff <= 0 ? "正常" : "落后"}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#27272a] text-[#71717a]">
                          待进行
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
