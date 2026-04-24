import { useState, useEffect, useRef } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Plus } from "lucide-react";

interface Message {
  id: number;
  role: string;
  content: string;
  sources?: any[];
}

interface Session {
  id: number;
  title: string;
  model: string;
  createdAt: string;
}

export function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("deepseek-reasoner");
  const scrollRef = useRef<HTMLDivElement>(null);
  const modelOptions = [
    { value: "deepseek-chat", label: "DeepSeek Chat（快）" },
    { value: "deepseek-reasoner", label: "DeepSeek Reasoner（强）" },
  ];

  useEffect(() => {
    api.chat.sessions().then((data) => setSessions(data.sessions));
  }, []);

  useEffect(() => {
    if (activeSession) {
      api.chat.messages(activeSession).then((data) => setMessages(data.messages));
    }
  }, [activeSession]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const createSession = async () => {
    const data = await api.chat.createSession(selectedModel);
    setSessions((prev) => [data.session, ...prev]);
    setActiveSession(data.session.id);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const res = await api.chat.sendMessage(activeSession, text);
    const reader = res.body?.getReader();
    if (!reader) {
      setLoading(false);
      return;
    }

    let assistantText = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("0:")) {
          try {
            const text = JSON.parse(line.slice(2));
            assistantText += text;
          } catch {}
        }
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: "assistant", content: assistantText },
    ]);
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 space-y-3">
          <Button onClick={createSession} className="w-full gap-2">
            <Plus className="h-4 w-4" /> 新对话
          </Button>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">模型选择</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {modelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <ScrollArea className="flex-1 px-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSession(s.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors ${
                activeSession === s.id ? "bg-accent" : "hover:bg-accent/50"
              }`}
            >
              {s.title}
            </button>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {activeSession && (
          <div className="px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">
              {sessions.find((s) => s.id === activeSession)?.title}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {sessions.find((s) => s.id === activeSession)?.model === "deepseek-reasoner"
                ? "Reasoner"
                : "Chat"}
            </span>
          </div>
        )}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {!activeSession ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              点击左侧"新对话"开始与AI助手交流
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10"><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10"><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <span className="animate-pulse">思考中...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {activeSession && (
          <div className="p-4 border-t border-border">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="输入问题，例如：什么是项目章程？"
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={loading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
