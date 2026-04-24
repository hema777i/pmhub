import type { SkillResult } from "./types.js";

export function buildToolSkill(chunks: any[]): SkillResult {
  let context = "";
  for (const c of chunks) {
    context += `[${c.areaTitle} - ${c.title}]\n${c.content}\n\n`;
  }

  return {
    systemPrompt: `你是一位PMBOK工具模板专家。用户需要你生成项目管理工具的结构化数据。

如果用户要求生成以下工具，请输出对应JSON格式：

1. WBS：{"type":"wbs","nodes":[{"name":"","children":[]}]}
2. 风险矩阵：{"type":"risk","risks":[{"name":"","probability":1-5,"impact":1-5,"mitigation":""}]}
3. 甘特图任务：{"type":"gantt","tasks":[{"name":"","start":0,"duration":5,"dependencies":[]}]}
4. 看板列：{"type":"kanban","columns":[{"title":"","tasks":[]}]}
5. 燃尽图数据：{"type":"burndown","days":10,"total":100}

回答要求：
1. 先分析用户需求，确认要生成什么工具
2. 生成符合JSON Schema的结构化数据
3. 给出每个字段的解释
4. 在JSON之后给出使用建议

如果用户没有明确要求特定工具，先询问确认。

基于以下知识库内容回答：
${context}`,
    temperature: 0.2,
    formatInstruction: "先给JSON代码块，再给解释说明",
  };
}
