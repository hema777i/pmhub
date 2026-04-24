import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export function createChatStream(messages: any[], model = "deepseek-reasoner", temperature = 0.3) {
  return streamText({
    model: deepseek(model) as any,
    messages,
    temperature,
  });
}
