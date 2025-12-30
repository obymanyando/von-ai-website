import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  conversationId,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  conversationId: string | null;
  onDelta: (deltaText: string) => void;
  onDone: (newConversationId: string | null) => void;
  onError: (error: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, conversationId }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Failed to get response");
    return;
  }

  if (!resp.body) {
    onError("No response body");
    return;
  }

  const newConvId = resp.headers.get("X-Conversation-Id");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  onDone(newConvId);
}

export default function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const QUICK_REPLIES = [
    t("chatWidget.quickReplies.whatIsSprint"),
    t("chatWidget.quickReplies.howToStart"),
    t("chatWidget.quickReplies.whatCost"),
    t("chatWidget.quickReplies.howLong"),
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: [...messages, userMsg],
      conversationId,
      onDelta: (chunk) => upsertAssistant(chunk),
      onDone: (newConvId) => {
        if (newConvId && !conversationId) {
          setConversationId(newConvId);
        }
        setIsLoading(false);
      },
      onError: (error) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `${t("chatWidget.error")} ${error}` },
        ]);
        setIsLoading(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          isOpen && "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t("chatWidget.title")}</h3>
              <p className="text-xs text-muted-foreground">{t("chatWidget.subtitle")}</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Bot className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("chatWidget.greeting")}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_REPLIES.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickReply(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                      </div>
                      <span className="text-xs text-muted-foreground">{t("chatWidget.thinking")}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatWidget.placeholder")}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
