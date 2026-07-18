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
  { text: "How did Shahbaz turn raw WhatsApp chats into a searchable AI knowledge base?", icon: IconChat },
  { text: "What made designing reliable AI agent workflows with LangGraph so hard?", icon: IconBrain },
  { text: "How did you cut page load times by 70% and bundle size by 45%?", icon: IconRocket },
  { text: "Why did Shahbaz split a growing codebase into a micro-frontend monorepo?", icon: IconCode },
  { text: "How did you bridge an offline Tally ERP system with the cloud in a desktop app?", icon: IconSliders },
  { text: "What's it like leading a team of 6 engineers day-to-day?", icon: IconUsers },
  { text: "How did Shahbaz keep web scrapers running against constantly changing sites?", icon: IconGlobe },
  { text: "What's the JSON-driven UI system Shahbaz is most proud of building?", icon: IconMessageCircle },
  { text: "How was this very RAG chatbot actually built, end to end?", icon: IconChat },
  { text: "What tech stack powers Shahbaz's AI and frontend work?", icon: IconCode },
  { text: "What embedding model and search technique powers that WhatsApp AI assistant?", icon: IconBrain },
  { text: "What would a coworker say about what it's like working with Shahbaz?", icon: IconUser },
  { text: "What does Shahbaz do for fun?", icon: IconUser },
  { text: "What's the toughest trek or expedition Shahbaz has taken on?", icon: IconGlobe },
  { text: "Where can I find Shahbaz's LinkedIn profile?", icon: IconBriefcase },
  { text: "How can I get in touch with Shahbaz directly?", icon: IconMail },
  { text: "What's Shahbaz's experience with Redux Toolkit and state management?", icon: IconSliders },
  { text: "How does Shahbaz approach a stubborn, hard-to-fix bug?", icon: IconBrain },
  { text: "What was the trickiest part of building a React + Electron desktop app?", icon: IconCode },
  { text: "How did Shahbaz customize Typebot for custom conversational flows?", icon: IconMessageCircle },
  { text: "What AWS services has Shahbaz worked with?", icon: IconGlobe },
  { text: "What's the story behind Shahbaz's CS degree and self-taught web skills?", icon: IconUser },
  { text: "Why is Shahbaz drawn to AI/LLM systems over pure frontend work now?", icon: IconRocket },
];

type PromptItem = (typeof PROMPT_POOL)[number];

/** Rotates through `items` starting at `offset`, without repeating any item. */
function rotateWindow(items: PromptItem[], offset: number, count: number): PromptItem[] {
  if (items.length === 0) return [];
  if (items.length <= count) return items;
  const start = offset % items.length;
  return Array.from({ length: count }, (_, i) => items[(start + i) % items.length]!);
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
        {/* <button type="button" className="composer__source-picker">
          <IconGlobe className="composer__source-picker-icon" />
          <span>All Web</span>
          <IconChevronDown className="composer__source-picker-chevron" />
        </button> */}
      </div>

      <div className="composer__row composer__row--bottom">
        <div className="composer__actions">
          {/* <button type="button" className="composer__action">
            <IconPlus className="composer__action-icon" />
            Add Attachment
          </button>
          <button type="button" className="composer__action">
            <IconImage className="composer__action-icon" />
            Use Image
          </button> */}
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

type PromptsProps = {
  usedPrompts: Set<string>;
  onUsePrompt: (text: string) => void;
};

function FollowUpSuggestions({ usedPrompts, onUsePrompt }: PromptsProps) {
  const isRunning = useAuiState((state) => state.thread.isRunning);
  const messageCount = useAuiState((state) => state.thread.messages.length);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isRunning) {
      setOffset((o) => o + 3);
    }
  }, [isRunning, messageCount]);

  if (isRunning) return null;

  const available = PROMPT_POOL.filter((p) => !usedPrompts.has(p.text));
  const prompts = rotateWindow(available, offset, 3);

  if (prompts.length === 0) return null;

  return (
    <div className="followup-suggestions">
      {visible &&
        prompts.map(({ text, icon: PromptIcon }) => (
          <ThreadPrimitive.Suggestion
            key={text}
            className="followup-suggestion"
            prompt={text}
            send
            onClick={() => onUsePrompt(text)}
          >
            <PromptIcon className="followup-suggestion__icon" />
            <span>{text}</span>
          </ThreadPrimitive.Suggestion>
        ))}
      <button
        type="button"
        className="followup-suggestions__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
      >
        <IconChevronDown
          className={
            visible
              ? "followup-suggestions__toggle-icon"
              : "followup-suggestions__toggle-icon followup-suggestions__toggle-icon--collapsed"
          }
        />
        {visible ? "Hide suggestions" : "Show suggestions"}
      </button>
    </div>
  );
}

function WelcomeScreen({ usedPrompts, onUsePrompt }: PromptsProps) {
  const [offset, setOffset] = useState(0);

  const available = PROMPT_POOL.filter((p) => !usedPrompts.has(p.text));
  const prompts = rotateWindow(available, offset, 4);

  return (
    <div className="welcome">
      <h1 className="welcome__heading">
        <span className="welcome__heading-strong">Hi there, </span>
        <br />
        <span className="welcome__heading-muted">ask me anything about Shahbaz</span>
      </h1>

      <p className="welcome__subtitle">
        I'm Shahbaz, but AI — ask about his experience, projects, or skills,
        or start with one of the prompts below.
      </p>

      <div className="prompt-grid">
        {prompts.map(({ text, icon: PromptIcon }) => (
          <ThreadPrimitive.Suggestion
            key={text}
            className="prompt-card"
            prompt={text}
            send
            onClick={() => onUsePrompt(text)}
          >
            <span className="prompt-card__text">{text}</span>
            <PromptIcon className="prompt-card__icon" />
          </ThreadPrimitive.Suggestion>
        ))}
      </div>

      <button
        type="button"
        className="refresh-prompts"
        onClick={() => setOffset((o) => o + 4)}
        disabled={available.length <= 4}
      >
        <IconRefresh className="refresh-prompts__icon" />
        Refresh Prompts
      </button>

      <Composer />
    </div>
  );
}

function ChatThread() {
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(() => new Set());

  const markPromptUsed = (text: string) =>
    setUsedPrompts((prev) => (prev.has(text) ? prev : new Set(prev).add(text)));

  return (
    <ThreadPrimitive.Root className="app-shell">
      <ThreadPrimitive.Viewport className="chat__viewport">
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <WelcomeScreen usedPrompts={usedPrompts} onUsePrompt={markPromptUsed} />
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
          <FollowUpSuggestions usedPrompts={usedPrompts} onUsePrompt={markPromptUsed} />
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
