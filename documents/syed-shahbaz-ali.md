# Syed Shahbaz Ali

## Contact

I can be reached by email at alishahbaz617@gmail.com or by phone at
+91-9849514527. My LinkedIn profile is https://linkedin.com/in/syed-shahbaz-ali,
where you can also find my professional history and connect with me
directly.

## About

I'm a software engineer based in Hyderabad, India, with 4+ years of
professional experience. What defines me as an engineer is that I go deep —
I'm not satisfied with a surface-level fix or a "good enough" implementation;
I want to understand the underlying problem well enough to design something
that actually holds up. I currently work as a Software Engineer at zotok.ai,
where my focus has shifted from pure frontend engineering toward building
AI-powered products. The problems that genuinely excite me sit at the
intersection of AI/LLM systems and frontend engineering — things like
designing agent workflows, building RAG pipelines, and figuring out how to
present AI-generated, streaming output in a UI that feels fast and natural
rather than clunky.

## Experience

#### Software Engineer, zotok.ai — Hyderabad, India (Jun 2023 - Present)

ZöTok(https://zotok.ai/) is a supply chain AI solution that streamlines the entire
order-to-cash process directly through WhatsApp.

I built an AI-powered knowledge retrieval assistant that transformed 
WhatsApp group messages into vector embeddings and used hybrid search—combining 
BM25 and semantic vector search—to retrieve relevant information from 
large volumes of conversations. The system used LangGraph, 
OpenAI’s text-embedding-3-small model, and OpenSearch, along with message categorization, real-time streaming, 
and dynamic response rendering. The hardest part was designing reliable agent 
logic and workflows: determining how the agent should handle multi-step tasks, 
select and call the right tools, retrieve relevant context, and keep its behavior 
predictable as the product scope expanded.


I led frontend performance optimization work that reduced initial page
load times by 70% and bundle size by 45%. This came from a combination of
techniques working together rather than one silver bullet: splitting code
by route and feature, removing or replacing unnecessarily heavy
dependencies, and reworking our lazy-loading strategy alongside a cleaner
Webpack configuration.

I architected a monorepo with a micro-frontend architecture. The team
needed this because the codebase had grown too large and too tightly
coupled to maintain effectively — different parts of the product kept
stepping on each other, and it was becoming harder to ship changes safely.
Splitting things into a micro-frontend architecture inside a monorepo let
teams work and deploy more independently without that coupling.

I developed a React.js + Electron desktop application integrated with
Tally ERP, automating financial data synchronization between offline
accounting systems and cloud infrastructure. The trickiest part of this
was twofold: getting real-time financial data sync working reliably against
Tally ERP, and building the whole thing as a proper desktop application
with Electron and React — bridging an offline, desktop-native accounting
tool with cloud infrastructure that expects a very different kind of
connectivity.

I customized and extended the open-source Typebot platform using Next.js.
Specifically, I built custom conversational flows tailored to specific
customer journeys, extended Typebot's core logic beyond what it supported
out of the box, and integrated it into our existing product and backend
systems.

I led a team of 6 engineers. In practice, that meant three things: setting
and enforcing code review standards and a clear PR process, mentoring
engineers and unblocking them day-to-day, and setting the technical
direction and architecture decisions for the team's work.

#### Software Engineer, AVRL — Hyderabad, India (Nov 2021 - May 2023)

AVRL-Generation(https://avrl.io/) is a platform for applying decision-making technology in
logistics, designed to be manageable even by a non-technical workforce.

I built automation workflows for multiple logistics platforms to scrape
data, process dynamic calculations, and make client-specific decisions.
This was genuinely hard for two reasons: the target sites constantly
changed their structure, which meant scrapers broke often and needed
resilient, adaptive selector strategies rather than brittle hardcoded ones;
and the sheer scale of supporting many different logistics sites, each
with its own quirks.

I modularized the automation scripts and interaction patterns into
reusable templates. The real impact of this was twofold: new sites could
be onboarded much faster using existing templates instead of starting from
scratch, and it significantly reduced the ongoing manual maintenance
effort needed to keep everything running as sites changed.

#### Software Engineer Intern, Mytra Money — Hyderabad, India (Jul 2021 - Oct 2021)

Mytra Money(https://mytra.money/) is a tech-fin product providing ERP capabilities at the heart
of a digital banking experience for businesses and individuals.

The thing I'm most proud of from this internship is designing a
JSON-driven dynamic component rendering system using React.js — a system
where UI components could be configured and rendered dynamically from
JSON rather than being hardcoded, making the product more flexible to
extend. Alongside that, I worked extensively on Redux store management and
built responsive, reusable UI components for the broader ERP-meets-banking
product.

## Education

### Deccan College of Engineering & Technology — B.Tech. Computer Science (2017 - 2021), CGPA: 7.14

My coursework gave me a solid grounding in data structures, algorithms, and
core computer science fundamentals — the kind of foundation that still
shapes how I think about problems today. Alongside formal coursework, I
was self-driven about web development specifically, working on my own
projects to build practical, hands-on skills that complemented the
theoretical fundamentals from class.

## Skills

**Frontend:** JavaScript (ES6), TypeScript, React.js, Next.js, HTML, CSS,
SCSS, REST APIs. This is the space I've spent the most time in professionally,
across three different companies, ranging from building reusable component
systems to leading performance optimization initiatives.

**AI & Backend:** LangGraph, NestJS, Python, Django, MySQL, DynamoDB. I've
used LangGraph specifically to build multi-step agent workflows and
tool-calling logic — designing how an AI agent reasons through a task and
decides which tools to invoke and when. I've also built RAG (Retrieval-
Augmented Generation) pipelines, including the very chatbot this
information is powering.

**Tools:** Assistant UI, Nx, Webpack, Babel, Redux Toolkit (RTK), Git,
Bundle Analyzer — tools I've used heavily in the context of the frontend
performance and monorepo/micro-frontend work described above.

**Cloud & Infra:** AWS (EC2, DynamoDB, CloudFront, Lambda, S3, Route 53).

## Personal

Outside of work, I'm drawn to the outdoors — I go on occasional longer
trekking trips and expeditions rather than casual weekend walks, and I
enjoy the kind of challenge that comes with planning and pushing through
a multi-day trek. I'm also fairly serious about fitness: I do gym and
strength training regularly, run, and have taken part in marathons.
Alongside that, I play football, badminton and cricket when I get the chance.

If you asked a close coworker to describe my personality in one line,
they'd probably say I'm persistent — I don't give up easily on a hard bug
or a difficult problem, and I'd rather keep digging until I actually
understand what's going wrong than move on with a half-fix. That trait
shows up as much in how I approach a stubborn production issue as it does
in finishing a long trek.

## Projects

#### Meet Shahbaz — an AI chatbot built from my own resume

This very chatbot is a project in its own right: a Retrieval-Augmented
Generation (RAG) system that lets visitors ask natural-language questions
about my background and get answers grounded in real information about me,
rather than a static resume or portfolio page. It's built using LangChain
for document loading, chunking, and orchestration, Chroma as the vector
store, a FastAPI backend that streams responses, and a React frontend
built with assistant-ui. Beyond just being a demo, it reflects the same
kind of AI/LLM work I care about professionally — designing how a system
retrieves the right context and reasons over it to produce a useful,
grounded answer instead of a generic or hallucinated one.