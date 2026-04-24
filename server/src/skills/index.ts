import { classifyIntent } from "./classifier.js";
import { buildConceptSkill } from "./concept.js";
import { buildCalculationSkill } from "./calculation.js";
import { buildScenarioSkill } from "./scenario.js";
import { buildToolSkill } from "./tool.js";
import { buildExamSkill } from "./exam.js";
import type { SkillResult, IntentType } from "./types.js";

export { classifyIntent };
export type { IntentType, SkillResult };

export function buildSkill(intent: IntentType, chunks: any[]): SkillResult {
  switch (intent) {
    case "concept":
      return buildConceptSkill(chunks);
    case "calculation":
      return buildCalculationSkill(chunks);
    case "scenario":
      return buildScenarioSkill(chunks);
    case "tool":
      return buildToolSkill(chunks);
    case "exam":
      return buildExamSkill(chunks);
    default:
      return {
        systemPrompt: `你是一位PMBOK项目管理专家。请基于以下知识库内容回答用户问题。如果知识库中没有相关信息，请明确告知用户。回答时请使用中文。\n\n${chunks.map((c) => `[${c.areaTitle} - ${c.title}]\n${c.content}`).join("\n\n")}`,
        temperature: 0.3,
      };
  }
}
