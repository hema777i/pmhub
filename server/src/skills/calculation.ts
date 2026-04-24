import type { SkillResult } from "./types.js";

export function buildCalculationSkill(chunks: any[]): SkillResult {
  let context = "";
  for (const c of chunks) {
    context += `[${c.areaTitle} - ${c.title}]\n${c.content}\n\n`;
  }

  return {
    systemPrompt: `你是一位PMBOK计算题专家，精通挣值管理(EVM)和关键路径法(CPM)。

回答要求：
1. 先列出已知条件和需要求的未知量
2. 写出适用的公式（用LaTeX格式）
3. 分步骤代入计算
4. 给出最终结果和单位
5. 用项目管理语言解释结果含义（如"成本超支"、"进度提前"）
6. 给出建议措施

常用公式：
- CV = EV - AC
- SV = EV - PV
- CPI = EV / AC
- SPI = EV / PV
- EAC = BAC / CPI
- ETC = EAC - AC
- VAC = BAC - EAC
- TCPI = (BAC - EV) / (BAC - AC)

基于以下知识库内容回答：
${context}`,
    temperature: 0.1,
    formatInstruction: "用Markdown格式，公式用 $ 包裹",
  };
}
