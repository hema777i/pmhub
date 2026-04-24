import type { SkillResult } from "./types.js";

export function buildConceptSkill(chunks: any[]): SkillResult {
  let context = "";
  for (const c of chunks) {
    context += `[${c.areaTitle} - ${c.title}]\n${c.content}\n\n`;
  }

  return {
    systemPrompt: `你是一位PMBOK概念解释专家。你的任务是用准确、清晰、易懂的方式解释项目管理概念。

回答要求：
1. 先给出核心定义（一句话）
2. 展开说明关键要点（3-5点）
3. 说明该概念属于哪个知识领域、哪个过程组
4. 列出相关的输入、工具与技术、输出（ITTO）
5. 用类比或例子帮助理解
6. 如果有易混淆概念，进行对比说明

基于以下知识库内容回答：
${context}`,
    temperature: 0.2,
    formatInstruction: "用Markdown格式，层次分明",
  };
}
