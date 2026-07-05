import type { ChatModelAdapter } from "@assistant-ui/react";

type StreamEvent =
  | { type: "sources"; sources: unknown[] }
  | { type: "text-delta"; delta: string }
  | { type: "done"; response: string }
  | { type: "error"; message: string };

export const chatModel: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const lastMessage = messages.at(-1);

    const message = lastMessage?.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: abortSignal,
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to start chat stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;

        const event = JSON.parse(line) as StreamEvent;

        if (event.type === "text-delta") {
          fullResponse += event.delta;

          yield {
            content: [
              {
                type: "text",
                text: fullResponse,
              },
            ],
          };
        }

        if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    }
  },
};
