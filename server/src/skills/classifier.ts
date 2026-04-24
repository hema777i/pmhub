import type { IntentType } from "./types.js";

const CALC_KEYWORDS = ["spi", "cpi", "eac", "etc", "pv", "ev", "ac", "cv", "sv", "bac", "vac", "tcpi", "计算", "公式", "成本", "进度偏差", "挣值"];
const EXAM_KEYWORDS = ["以下哪个", "正确的是", "错误的是", "不属于", "包括", "最佳", "首先", "应该", "pmp", "考试", "真题"];
const TOOL_KEYWORDS = ["帮我做", "帮我画", "生成", "创建一个", "做一个", "wbs", "甘特图", "风险矩阵", "燃尽图", "看板"];
const SCENARIO_KEYWORDS = ["怎么办", "如何处理", "如果", "假设", "延期", "超支", "冲突", "离职", "变更", "风险", "问题", "干系人不满"];

export function classifyIntent(query: string): IntentType {
  const q = query.toLowerCase();

  if (CALC_KEYWORDS.some((k) => q.includes(k))) return "calculation";
  if (EXAM_KEYWORDS.some((k) => q.includes(k))) return "exam";
  if (TOOL_KEYWORDS.some((k) => q.includes(k))) return "tool";
  if (SCENARIO_KEYWORDS.some((k) => q.includes(k))) return "scenario";

  // 纯问定义/概念
  if (/^(什么|简述|解释|定义|介绍|什么是)/.test(query)) return "concept";

  return "general";
}
