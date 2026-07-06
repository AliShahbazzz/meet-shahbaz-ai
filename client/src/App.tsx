import { useEffect, useState } from "react";
import {
  AssistantRuntimeProvider,
  AuiIf,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
  useLocalRuntime,
} from "@assistant-ui/react";

import { chatModel } from "./lib/chat-model";
import { MarkdownText } from "./components/markdown-text";
import {
  IconArrowRight,
  IconBrain,
  IconBriefcase,
  IconChat,
  IconChevronDown,
  IconCode,
  IconGlobe,
  IconImage,
  IconMail,
  IconMessageCircle,
  IconPlus,
  IconRefresh,
  IconRocket,
  IconSliders,
  IconUser,
  IconUsers,
} from "./components/icons";
import "./App.css";

const PROMPT_POOL = [
  { text: "What's the hardest technical problem he's solved recently?", icon: IconSliders },
  { text: "What did he build at zotok.ai as an AI assistant?", icon: IconChat },
  { text: "How did he cut page load times by 70%?", icon: IconRocket },
  { text: "What's it like working with him as a team lead?", icon: IconUsers },
  { text: "What's his experience with LangGraph and AI agents?", icon: IconBrain },
  { text: "Walk me through his frontend and AI skill set", icon: IconCode },
  { text: "How was this very chatbot built?", icon: IconMessageCircle },
  { text: "What kind of engineer is he outside of work?", icon: IconUser },
  { text: "Is he open to new opportunities?", icon: IconBriefcase },
  { text: "Get in touch with him directly", icon: IconMail },
];

function pickRandomPrompts(count: number) {
  return [...PROMPT_POOL].sort(() => Math.random() - 0.5).slice(0, count);
}

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
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>
  );
}

function ComposerCharCount() {
  const length = useAuiState((state) => state.composer.text.length);
  return (
    <span className="composer__char-count">{length}/1000</span>
  );
}

function Composer() {
  return (
    <ComposerPrimitive.Root className="composer">
      <div className="composer__row composer__row--top">
        <ComposerPrimitive.Input
          className="composer__input"
          placeholder="Ask whatever you want..."
          rows={1}
        />
        <button type="button" className="composer__source-picker">
          <IconGlobe className="composer__source-picker-icon" />
          <span>All Web</span>
          <IconChevronDown className="composer__source-picker-chevron" />
        </button>
      </div>

      <div className="composer__row composer__row--bottom">
        <div className="composer__actions">
          <button type="button" className="composer__action">
            <IconPlus className="composer__action-icon" />
            Add Attachment
          </button>
          <button type="button" className="composer__action">
            <IconImage className="composer__action-icon" />
            Use Image
          </button>
        </div>

        <div className="composer__meta">
          <ComposerCharCount />
          <ComposerPrimitive.Send className="composer__send">
            <IconArrowRight />
          </ComposerPrimitive.Send>
        </div>
      </div>
    </ComposerPrimitive.Root>
  );
}

function FollowUpSuggestions() {
  const isRunning = useAuiState((state) => state.thread.isRunning);
  const messageCount = useAuiState((state) => state.thread.messages.length);
  const [prompts, setPrompts] = useState(() => pickRandomPrompts(3));

  useEffect(() => {
    if (!isRunning) {
      setPrompts(pickRandomPrompts(3));
    }
  }, [isRunning, messageCount]);

  if (isRunning) return null;

  return (
    <div className="followup-suggestions">
      {prompts.map(({ text, icon: PromptIcon }) => (
        <ThreadPrimitive.Suggestion
          key={text}
          className="followup-suggestion"
          prompt={text}
          send
        >
          <PromptIcon className="followup-suggestion__icon" />
          <span>{text}</span>
        </ThreadPrimitive.Suggestion>
      ))}
    </div>
  );
}

function WelcomeScreen() {
  const [prompts, setPrompts] = useState(() => pickRandomPrompts(4));

  return (
    <div className="welcome">
      <h1 className="welcome__heading">
        <span className="welcome__heading-strong">Hi there, </span>
        <br />
        <span className="welcome__heading-muted">What would like to know?</span>
      </h1>

      <p className="welcome__subtitle">
        Use one of the most common prompts below or use your own to begin
      </p>

      <div className="prompt-grid">
        {prompts.map(({ text, icon: PromptIcon }) => (
          <ThreadPrimitive.Suggestion
            key={text}
            className="prompt-card"
            prompt={text}
            send
          >
            <span className="prompt-card__text">{text}</span>
            <PromptIcon className="prompt-card__icon" />
          </ThreadPrimitive.Suggestion>
        ))}
      </div>

      <br />
      <br />

      <Composer />
    </div>
  );
}

function ChatThread() {
  return (
    <ThreadPrimitive.Root className="app-shell">
      <ThreadPrimitive.Viewport className="chat__viewport">
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <WelcomeScreen />
        </AuiIf>

        <AuiIf condition={(s) => !s.thread.isEmpty}>
          <div className="chat">
            <ThreadPrimitive.Messages
              components={{
                UserMessage,
                AssistantMessage,
              }}
            />
          </div>
        </AuiIf>
      </ThreadPrimitive.Viewport>

      <AuiIf condition={(s) => !s.thread.isEmpty}>
        <div className="composer-dock">
          <FollowUpSuggestions />
          <Composer />
        </div>
      </AuiIf>
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
