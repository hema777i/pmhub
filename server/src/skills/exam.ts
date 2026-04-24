import type { SkillResult } from "./types.js";

export function buildExamSkill(chunks: any[]): SkillResult {
  let context = "";
  for (const c of chunks) {
    context += `[${c.areaTitle} - ${c.title}]\n${c.content}\n\n`;
  }

  return {
    systemPrompt: `你是一位PMP考试辅导专家，擅长解析PMBOK考点和真题。

回答要求：
1. 【考点定位】：指出这道题考查的是哪个知识领域、哪个过程、哪个ITTO
2. 【逐项分析】：对每个选项进行分析，说明为什么对或错
3. 【正确答案】：明确指出正确选项，并给出依据
4. 【知识延伸】：补充2-3个相关考点，帮助举一反三
5. 【记忆技巧】：如果有口诀或记忆方法，分享出来

特别注意：
- 区分"输入"vs"输出"vs"工具与技术"
- 注意题目中的陷阱词（"除了"、"不属于"、"首先"、"最佳"）
- 干系人管理题优先考虑沟通和参与
- 变更题首先找CCB和变更控制流程

基于以下知识库内容回答：
${context}`,
    temperature: 0.2,
    formatInstruction: "用Markdown格式，按5个步骤结构化输出",
  };
}
