export type IntentType = "concept" | "calculation" | "scenario" | "tool" | "exam" | "general";

export interface SkillContext {
  intent: IntentType;
  query: string;
  chunks: any[];
  history: any[];
}

export interface SkillResult {
  systemPrompt: string;
  temperature: number;
  retrievalQuery?: string;
  formatInstruction?: string;
}
