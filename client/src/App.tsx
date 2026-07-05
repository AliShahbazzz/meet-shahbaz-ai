import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useLocalRuntime,
} from "@assistant-ui/react";

import { chatModel } from "./lib/chat-model";
import "./App.css";

function UserMessage() {
  return (
    <MessagePrimitive.Root className="message message--user">
      <div className="message__bubble">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="message message--assistant">
      <div className="message__bubble">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function ChatThread() {
  return (
    <ThreadPrimitive.Root className="chat">
      <ThreadPrimitive.Viewport className="chat__viewport">
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />

        <ComposerPrimitive.Root className="composer">
          <ComposerPrimitive.Input
            className="composer__input"
            placeholder="Ask me anything..."
          />

          <ComposerPrimitive.Send className="composer__send">
            Send
          </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

export default function App() {
  const runtime = useLocalRuntime(chatModel);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ChatThread />
    </AssistantRuntimeProvider>
  );
}
