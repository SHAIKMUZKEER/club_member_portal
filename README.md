# 🚀 Club Member Portal — AWS Student Builder AI Copilot

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Student%20Builder%20Groups-orange?style=for-the-badge&logo=amazonaws" alt="AWS Student Builder Groups"/>
  <img src="https://img.shields.io/badge/AI-RAG%20Copilot-purple?style=for-the-badge" alt="RAG AI"/>
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase" alt="Supabase"/>
</p>

<p align="center">
  <b>An AI-powered member portal and knowledge-base copilot for the AWS Student Builder Group at RGUKT-ONGOLE.</b>
</p>

---

## 📌 Project Overview

**Club Member Portal** is an AI-powered web application designed for members of the AWS Student Builder Group at RGUKT-ONGOLE.

The platform combines:

* 🔐 Secure member authentication
* 💬 Members-only AI chatbot
* 📚 Document-based knowledge base
* 🔎 Semantic/vector search
* 🧠 Retrieval-Augmented Generation (RAG)
* 📖 Source-aware answers
* 💾 Per-user chat history
* 👍/👎 Answer feedback
* 🔄 Password reset functionality
* 🎨 Modern responsive UI
* ☁️ AWS-oriented cloud deployment architecture

The core objective is to allow a new Student Builder to log in and ask questions such as:

> "When is the next workshop?"

> "How do I publish on Builder Center?"

> "How do I get started with Amazon Bedrock?"

Instead of relying on general internet knowledge, the AI retrieves information from the official club documents and generates an answer grounded in that retrieved context.

The original 70% challenge explicitly required members to sign up, log in, access a members-only chat, load the eight starter documents, provide source citations, and provide a safe fallback when information is not available.

---

# 🎯 Problem Statement

Student communities often distribute important information through multiple documents, messages, workshops, and announcements.

This creates several problems:

* Members have difficulty finding the correct information.
* New members may not know where to start.
* Important AWS learning information can be buried inside documents.
* Manually searching through multiple Markdown files is inefficient.
* A normal chatbot may hallucinate information that is not part of the official club material.
* Members need a way to verify where an AI answer came from.

The **Club Member Portal** addresses these problems by providing a centralized authenticated portal with an AI copilot that retrieves information from the official club knowledge base before generating answers.

---

# 💡 Solution

The system follows a **Retrieval-Augmented Generation (RAG)** architecture.

Instead of directly asking an LLM:

```text
User Question
     ↓
     LLM
     ↓
Generated Answer
```

our system follows:

```text
User Question
     ↓
Generate Query Embedding
     ↓
Vector Similarity Search
     ↓
Retrieve Relevant Club Documents
     ↓
Provide Retrieved Context to LLM
     ↓
Generate Grounded Answer
     ↓
Display Answer + Sources
```

This reduces hallucination and keeps responses grounded in the official knowledge base.

---

# ✨ Key Features

## 🔐 1. Member Authentication

Members can:

* Create an account
* Log in using email and password
* Verify their email
* Reset forgotten passwords
* Access protected chat functionality

Authentication is implemented using **Supabase Auth**.

Only authenticated users can access the chatbot.

---

## 💬 2. Members-Only AI Chat

The chatbot is available only to authenticated members.

Users can ask questions related to:

* AWS Student Builder Groups
* AWS account setup
* Builder Center
* Amazon Bedrock
* AWS Lambda
* Workshops
* Hackathon rules
* Club community information

---

## 📚 3. Official Knowledge Base

The application includes the eight starter club documents required by the hackathon:

```text
01-onboarding-faq.md
02-aws-account-setup.md
03-builder-center-publish.md
04-bedrock-starter.md
05-hackathon-rules.md
06-workshop-index.md
07-lambda-patterns.md
08-sbg-community.md
```

These documents contain the information used by the RAG system.

The hackathon specification requires the AI to answer only from club documents and show sources with each answer.

---

# 🧠 4. Retrieval-Augmented Generation (RAG)

The most important technical component of the project is the RAG pipeline.

### Step 1 — Document Loading

The application loads Markdown documents from:

```text
/docs/*.md
```

The documents are imported by the server at startup/runtime.

### Step 2 — Document Chunking

Documents are divided into smaller chunks based on Markdown headings.

Each chunk contains:

```text
Document Name
Heading
Content
```

Example:

```text
03-builder-center-publish.md
        ↓
Publishing on AWS Builder Center
        ↓
Chunk content
```

### Step 3 — Embedding Generation

Each chunk is converted into a numerical vector using:

```text
OpenAI text-embedding-3-small
```

through the AI Gateway used by the application.

### Step 4 — Vector Storage

The generated embeddings are stored inside PostgreSQL using:

```text
pgvector
```

The database contains a vector column with:

```text
vector(1536)
```

### Step 5 — Semantic Search

When the user asks a question:

```text
"What is Builder Center?"
```

the question is converted into an embedding.

The system then performs vector similarity search against the stored document chunks.

### Step 6 — Relevance Filtering

Retrieved chunks are filtered using a similarity threshold.

The current implementation uses:

```text
MIN_SIMILARITY = 0.32
```

### Step 7 — LLM Generation

The relevant document context is passed to the chat model.

The current project uses:

```text
google/gemini-3.5-flash
```

through the AI Gateway.

### Step 8 — Grounded Response

The generated response is shown to the user together with the relevant source document and section.

---

# 🛡️ 5. Hallucination Prevention

The system uses a strict system prompt instructing the AI to:

* Answer only from retrieved context
* Avoid guessing
* Avoid inventing AWS pricing
* Avoid inventing AWS service limits
* Avoid inventing policies
* Stay focused on club/AWS learning topics

If relevant information cannot be retrieved, the system marks the response as unverified instead of presenting unsupported information as fact.

This follows the hackathon's requirement that the chatbot should not guess when information is unavailable.

---

# 📖 6. Source Citations

Each generated answer can contain source information such as:

```text
Source:
03-builder-center-publish.md
Section:
How do I publish on Builder Center?
```

The backend stores the source document and heading along with the assistant message.

This allows members to verify the information against the original club document.

---

# 💾 7. Chat History

The application stores chat messages per authenticated user.

Each message contains:

```text
id
user_id
role
content
sources
feedback
created_at
```

Users can retrieve their previous conversations.

Users can also clear their chat history.

---

# 👍 8. Answer Feedback

Users can provide feedback on AI responses:

```text
👍 Helpful
👎 Not Helpful
```

The feedback value is stored with the corresponding message.

This creates a foundation for future chatbot quality analysis.

---

# 🔑 9. Password Reset

Members who forget their password can request a password reset through their registered email.

The authentication flow is handled through Supabase Auth.

---

# 🎨 10. Modern User Interface

The frontend provides:

* Responsive layout
* Dark/light theme support
* Animated visual elements
* AWS Student Builder branding
* Chat interface
* Authentication screens
* Password visibility toggle
* Source cards
* Loading states
* Error handling
* Empty states

---

# 🏗️ System Architecture

## 🔷 High-Level Architecture

The overall architecture can be represented as:

```mermaid
flowchart TB

    USER["👤 Student Builder"]
    
    FRONTEND["🖥️ React + TypeScript Frontend
    TanStack Start / Router
    Tailwind CSS
    Radix UI"]
    
    AUTH["🔐 Supabase Authentication"]
    
    SERVER["⚙️ TanStack Start Server
    Server Functions"]
    
    RAG["🧠 RAG Pipeline"]
    
    EMBEDDING["🔢 Embedding Model
    text-embedding-3-small"]
    
    VECTOR["🗄️ PostgreSQL + pgvector
    Supabase"]
    
    SEARCH["🔎 Vector Similarity Search"]
    
    LLM["🤖 Gemini 3.5 Flash
    AI Gateway"]
    
    DOCS["📚 Official Club Documents
    8 Markdown Files"]
    
    RESPONSE["📖 Grounded Answer
    + Sources"]
    
    USER --> FRONTEND
    FRONTEND --> AUTH
    FRONTEND --> SERVER
    
    SERVER --> RAG
    DOCS --> RAG
    
    RAG --> EMBEDDING
    EMBEDDING --> VECTOR
    
    SERVER --> SEARCH
    SEARCH --> VECTOR
    
    SEARCH --> LLM
    LLM --> RESPONSE
    
    RESPONSE --> FRONTEND
    FRONTEND --> USER
```

---

# 🏢 High-Level System Design

At the highest level, the system contains five major layers:

```text
┌───────────────────────────────────────┐
│             USER LAYER                │
│       Student Builder / Member        │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│          PRESENTATION LAYER            │
│ React + TypeScript + TanStack Router   │
│ Tailwind CSS + Radix UI + Three.js     │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│           APPLICATION LAYER            │
│       TanStack Start Server            │
│       Server Functions + Auth          │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│              AI / RAG LAYER            │
│ Chunking → Embeddings → Retrieval      │
│ → Context → Gemini → Grounded Answer   │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│             DATA LAYER                 │
│ Supabase PostgreSQL + pgvector         │
│ Messages + Knowledge Base              │
└───────────────────────────────────────┘
```

---

# 🔬 Low-Level System Architecture

## Authentication Flow

```mermaid
sequenceDiagram

    participant U as User
    participant F as React Frontend
    participant S as Supabase Auth
    participant B as Backend

    U->>F: Enter email + password
    F->>S: signInWithPassword()
    S->>F: Session / JWT
    F->>B: Authenticated request
    B->>S: Validate JWT
    S->>B: User claims
    B->>F: Authorized response
    F->>U: Open member chat
```

---

# 🧠 Low-Level RAG Architecture

```mermaid
flowchart LR

    DOC["Markdown Documents"]

    CHUNK["Document Chunker"]

    EMB["Embedding Generator
    text-embedding-3-small"]

    DB["Supabase PostgreSQL
    pgvector"]

    QUERY["User Question"]

    QEMB["Question Embedding"]

    MATCH["match_kb_chunks()
    Vector Similarity"]

    FILTER["Similarity Filter
    threshold = 0.32"]

    CONTEXT["Retrieved Context"]

    GEMINI["Gemini 3.5 Flash"]

    ANSWER["Grounded Answer"]

    SOURCE["Source Metadata"]

    DOC --> CHUNK
    CHUNK --> EMB
    EMB --> DB

    QUERY --> QEMB
    QEMB --> MATCH
    DB --> MATCH
    MATCH --> FILTER
    FILTER --> CONTEXT
    CONTEXT --> GEMINI
    GEMINI --> ANSWER
    FILTER --> SOURCE

    ANSWER --> OUTPUT["Answer + Sources"]
    SOURCE --> OUTPUT
```

---

# 🔄 Detailed RAG Request Flow

When a member asks a question:

```text
1. User submits question
          ↓
2. Authentication middleware verifies user
          ↓
3. User question is stored in messages table
          ↓
4. Knowledge base is checked
          ↓
5. Documents are chunked if required
          ↓
6. Document embeddings are generated
          ↓
7. Embeddings are stored in pgvector
          ↓
8. User question is converted to an embedding
          ↓
9. match_kb_chunks() performs vector search
          ↓
10. Top relevant chunks are retrieved
          ↓
11. Similarity threshold removes weak matches
          ↓
12. Retrieved context is passed to Gemini
          ↓
13. Gemini generates a grounded answer
          ↓
14. Relevant source documents are attached
          ↓
15. Assistant response is stored
          ↓
16. Answer + sources are displayed to member
```

---

# 🗄️ Database Architecture

The project uses **Supabase PostgreSQL** with the **pgvector** extension.

## Main Tables

### `messages`

Stores user and assistant conversations.

```text
messages
│
├── id
├── user_id
├── role
├── content
├── sources
├── feedback
└── created_at
```

### `kb_chunks`

Stores the document chunks and their embeddings.

```text
kb_chunks
│
├── id
├── doc
├── heading
├── content
├── embedding
└── created_at
```

The embedding field uses:

```text
vector(1536)
```

---

# 🔐 Database Security

Row Level Security is enabled on the message table.

A user can manage only their own messages.

Conceptually:

```text
Authenticated User
       │
       ▼
auth.uid()
       │
       ▼
messages.user_id
       │
       ▼
Access only own messages
```

The knowledge base is available for authenticated users, while service-role operations are kept server-side.

---

# 🛠️ Tech Stack

## Frontend

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| React 19          | UI development                 |
| TypeScript        | Type-safe development          |
| TanStack Router   | Routing                        |
| TanStack Start    | Full-stack React framework     |
| Tailwind CSS      | Styling                        |
| Radix UI          | Accessible UI components       |
| Lucide React      | Icons                          |
| React Markdown    | Markdown rendering             |
| Three.js          | 3D visual elements             |
| React Three Fiber | React integration for Three.js |
| React Three Drei  | Three.js helper components     |

---

## Backend

| Technology            | Purpose                            |
| --------------------- | ---------------------------------- |
| TanStack Start Server | Server-side application            |
| TypeScript            | Backend development                |
| Server Functions      | Secure client-server communication |
| Zod                   | Request validation                 |
| Supabase              | Backend platform                   |
| PostgreSQL            | Persistent database                |

---

## Authentication

```text
Supabase Auth
```

Used for:

* Sign up
* Login
* Email verification
* Password reset
* Session management
* JWT-based authentication

---

## AI / Generative AI

### Embeddings

```text
OpenAI text-embedding-3-small
```

Used to convert document chunks and user questions into vectors.

### Chat Model

```text
Google Gemini 3.5 Flash
```

Used to generate grounded answers from retrieved context.

### AI Gateway

```text
https://ai.gateway.lovable.dev/v1
```

The current implementation accesses the embedding and chat models through the AI Gateway.

---

## Vector Database

```text
PostgreSQL
+
pgvector
```

Used for semantic similarity search.

---

## Development Tools

```text
Bun
Vite
ESLint
Prettier
Git
GitHub
Lovable
```

The repository includes a `bun.lock` file and project scripts for development, building, previewing, linting, and formatting.

---

# ☁️ AWS Architecture

The current repository runs the implemented application using Supabase and the AI Gateway.

However, the hackathon specification required teams to explain how the system could be deployed on AWS, while live AWS deployment was optional.

A production AWS architecture can map the application as follows:

```mermaid
flowchart TB

    USER["👤 Member"]

    CF["Amazon CloudFront"]

    APP["Web Application"]

    COG["Amazon Cognito
    Authentication"]

    SES["Amazon SES
    Password Reset Emails"]

    S3["Amazon S3
    Document Storage"]

    LAMBDA["AWS Lambda
    Backend / API"]

    BEDROCK["Amazon Bedrock
    Foundation Model"]

    OPEN["Amazon OpenSearch
    Vector Search"]

    USER --> CF
    CF --> APP

    APP --> COG
    COG --> SES

    APP --> LAMBDA

    LAMBDA --> S3
    LAMBDA --> OPEN
    LAMBDA --> BEDROCK

    S3 --> LAMBDA
    LAMBDA --> OPEN

    BEDROCK --> LAMBDA
    OPEN --> LAMBDA

    LAMBDA --> APP
```

### AWS Service Mapping

| Application Component | AWS Service          |
| --------------------- | -------------------- |
| Authentication        | Amazon Cognito       |
| Password reset email  | Amazon SES           |
| Document storage      | Amazon S3            |
| Serverless backend    | AWS Lambda           |
| API                   | API Gateway / Lambda |
| Vector search         | Amazon OpenSearch    |
| Generative AI         | Amazon Bedrock       |
| Static web hosting    | S3 + CloudFront      |
| Monitoring            | Amazon CloudWatch    |

The 70% specification specifically suggested Cognito for authentication, SES for reset emails, S3 for document storage, and an AWS-based chat/AI architecture.

---

# ⚡ Event-Day 30% Extension

The second part of the hackathon required extending the existing 70% application rather than creating a new application.

The event-day challenge introduced:

```text
Admin document publishing
        ↓
Automatic re-indexing
        ↓
Latest documents searchable within ~60 seconds
        ↓
Chatbot automatically uses latest knowledge
        ↓
Member dashboard updates
```

The 30% specification required:

* Admin page
* Document upload/paste
* Re-indexing after publishing
* Chat synchronization
* Updated document dashboard
* `event-day-briefing.md`
* Smoke tests
* `POST /ask`
* Port `8080`
* Event Wi-Fi connectivity

---

# 🔄 Proposed 30% Knowledge Sync Architecture

```mermaid
flowchart LR

    ADMIN["👨‍💼 Club Admin"]

    UI["Admin Dashboard"]

    STORE["Document Storage"]

    PROCESS["Document Processing"]

    EMBED["Embedding Generation"]

    VECTOR["Vector Database"]

    CHAT["Member Chat"]

    RETRIEVE["Semantic Retrieval"]

    LLM["AI Model"]

    ANSWER["Grounded Answer"]

    ADMIN --> UI
    UI --> STORE
    STORE --> PROCESS
    PROCESS --> EMBED
    EMBED --> VECTOR

    CHAT --> RETRIEVE
    VECTOR --> RETRIEVE
    RETRIEVE --> LLM
    LLM --> ANSWER
    ANSWER --> CHAT
```

The event-day specification states that the chatbot should use newly published documents within approximately 60 seconds and that the member dashboard should show updated documents without a full page reload.

---

# 🔌 Required Event-Day API

The 30% specification defined the following evaluator-facing endpoint:

```http
POST /ask
```

Port:

```text
8080
```

The endpoint was required to listen on:

```text
0.0.0.0:8080
```

Request:

```json
{
  "question": "..."
}
```

Response:

```json
{
  "answer": "The grounded answer...",
  "sources": [
    {
      "document": "03-builder-center-publish.md",
      "chunk_id": "optional-team-chunk-id",
      "rank": 1,
      "score": 0.91
    }
  ]
}
```

The evaluator reads `answer` and `sources` from the top level of the JSON response.

> **Repository note:** The supplied project ZIP does not currently contain an `/ask` route or the event-day admin/re-index implementation, so this section documents the hackathon's required extension rather than claiming those components are present in the supplied codebase.

---

# 📂 Project Structure

```text
club_member_portal/
│
├── docs/
│   ├── 01-onboarding-faq.md
│   ├── 02-aws-account-setup.md
│   ├── 03-builder-center-publish.md
│   ├── 04-bedrock-starter.md
│   ├── 05-hackathon-rules.md
│   ├── 06-workshop-index.md
│   ├── 07-lambda-patterns.md
│   └── 08-sbg-community.md
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── UnverifiedCard.tsx
│   │   │
│   │   ├── ui/
│   │   ├── AppHeader.tsx
│   │   ├── ClubBadge.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── SceneBackground.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   └── use-mobile.tsx
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── auth-attacher.ts
│   │       ├── auth-middleware.ts
│   │       ├── client.ts
│   │       ├── client.server.ts
│   │       └── types.ts
│   │
│   ├── lib/
│   │   ├── chat.functions.ts
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── kb.server.ts
│   │   ├── lovable-error-reporting.ts
│   │   └── utils.ts
│   │
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── chat.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── reset-password.tsx
│   │   └── signup.tsx
│   │
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
│
├── supabase/
│   ├── migrations/
│   │   ├── messages table
│   │   └── knowledge base + vector search
│   └── config.toml
│
├── .env
├── package.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── components.json
└── README.md
```

---

# 🔐 Security Considerations

The application was designed with several security principles:

### Authentication

Only authenticated members can access chat functionality.

### Authorization

Server functions use authentication middleware to validate the user's session.

### Row Level Security

Supabase RLS ensures users can access their own message history.

### Environment Variables

API keys and Supabase configuration are stored through environment variables rather than hard-coded into application logic.

### Password Safety

Passwords are handled through Supabase Auth and are not stored directly by the application.

### AI Safety

The model is instructed not to invent information outside the retrieved club documents.

### Private Student Data

The hackathon specification explicitly required that passwords and private student data should never be logged.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/SHAIKMUZKEER/club_member_portal.git
cd club_member_portal
```

## 2. Install dependencies

Using Bun:

```bash
bun install
```

Or using npm:

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file:

```env
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_URL=your_supabase_url

VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url

LOVABLE_API_KEY=your_lovable_api_key
```

> Never commit real API keys, passwords, Supabase secrets, or private credentials to GitHub.

## 4. Run the development server

```bash
bun run dev
```

Or:

```bash
npm run dev
```

## 5. Open the application

The development server will provide a local URL such as:

```text
http://localhost:3000
```

---

# 🧪 Testing the Application

Recommended demo flow:

```text
1. Open the application
2. Create a new account
3. Verify the email
4. Log in
5. Open the AI Copilot
6. Ask a question from the club documents
7. Verify the generated answer
8. Check the displayed source
9. Ask a question that is not present in the documents
10. Verify the safe fallback behavior
11. Test chat history
12. Test answer feedback
13. Test password reset
```

The 70% hackathon demo flow specifically expects a member to log in, ask about starter documents, receive a source-backed answer, and demonstrate the forgot-password flow.

---

# 📊 Core Data Flow

```text
                    ┌─────────────────┐
                    │     MEMBER      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   React UI      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Authentication  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Server Function │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Query Embedding │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │ PostgreSQL + pgvector    │
              │ Semantic Similarity      │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │ Relevant Document Chunks │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │    Gemini 3.5 Flash      │
              │     Grounded Answer      │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │ Answer + Source Metadata │
              └────────────┬─────────────┘
                           │
                           ▼
                    ┌─────────────────┐
                    │     MEMBER      │
                    └─────────────────┘
```

---

# 🌟 Why This Project Is Different

Traditional student portals generally provide static information.

This project introduces an **AI knowledge interface** on top of the club's official documentation.

Instead of:

```text
Search document
      ↓
Read multiple sections
      ↓
Find answer
```

the member can:

```text
Ask Question
      ↓
AI retrieves relevant information
      ↓
AI generates grounded response
      ↓
Source is shown
```

The system therefore combines:

```text
Authentication
      +
Knowledge Base
      +
Vector Search
      +
Generative AI
      +
Source Attribution
      +
User History
```

---

# 📈 Future Improvements

Potential future enhancements include:

* ☁️ Full AWS deployment
* 🔐 Amazon Cognito integration
* 📧 Amazon SES integration
* 📦 Amazon S3 document storage
* ⚡ AWS Lambda backend
* 🔎 Amazon OpenSearch vector search
* 🤖 Amazon Bedrock integration
* 👨‍💼 Admin dashboard
* 📤 Document upload
* 🔄 Automatic document re-indexing
* ⚡ Near-real-time knowledge synchronization
* 📊 Admin analytics dashboard
* 🧪 Automated RAG evaluation
* 📈 Retrieval-quality monitoring
* 💬 Improved conversation memory
* 🌍 Production deployment with CloudFront
* 📱 Mobile-friendly PWA support

The 30% event-day brief specifically emphasized administrator publishing, re-indexing within approximately 60 seconds, latest-index chat synchronization, and dashboard updates.

---

# 🏆 Hackathon Context

This project was developed as part of the **AWS Student Builder Groups Campus Hackathon**.

The hackathon was structured into:

```text
70% Baseline
      +
30% Event-Day Extension
      =
Final Challenge
```

The baseline focused on:

* Authentication
* Members-only chat
* Knowledge base
* RAG answers
* Source citations
* Safe fallback

The event-day extension focused on:

* Admin publishing
* Document synchronization
* Re-indexing
* Updated dashboard
* Evaluator API
* Event-network access

The 30% challenge explicitly required teams to extend the existing 70% portal rather than creating a separate application.

---

# 👥 Team

### Team Members

| Name              | Role                        | LinkedIn                                       |
| ----------------- | --------------------------- | ---------------------------------------------- |
| **Your Name**     | Developer / AI & Full-Stack | [LinkedIn Profile](YOUR_LINKEDIN_URL)          |
| **Team Member 2** | Developer                   | [LinkedIn Profile](TEAM_MEMBER_2_LINKEDIN_URL) |
| **Team Member 3** | Developer                   | [LinkedIn Profile](TEAM_MEMBER_3_LINKEDIN_URL) |

---

# 🔗 Project Links

### 💻 GitHub Repository

👉 [View Source Code](https://github.com/SHAIKMUZKEER/club_member_portal)

### 🌐 Live Application

👉 **[Open Live App](YOUR_LIVE_APP_URL)**

### 💼 LinkedIn — Project / Hackathon Post

👉 **[View LinkedIn Post](YOUR_LINKEDIN_POST_URL)**

### 👤 LinkedIn — Your Profile

👉 **[Connect with me on LinkedIn](YOUR_LINKEDIN_PROFILE_URL)**

### 📝 AWS Builder Center Article

👉 **[Read the Builder Center Article](YOUR_BUILDER_CENTER_ARTICLE_URL)**

### 🎥 Demo Video

👉 **[Watch the Demo](YOUR_DEMO_VIDEO_URL)**

---

# 📸 Screenshots

Add screenshots of the following:

### Landing Page

```text
![Landing Page](screenshots/home.png)
```

### Sign Up

```text
![Sign Up](screenshots/signup.png)
```

### Login

```text
![Login](screenshots/login.png)
```

### AI Copilot

```text
![AI Chat](screenshots/chat.png)
```

### Source Attribution

```text
![Source Attribution](screenshots/sources.png)
```

### Password Reset

```text
![Password Reset](screenshots/reset-password.png)
```

---

# 📚 Knowledge Base Documents

The current project includes the following official knowledge sources:

| Document                       | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `01-onboarding-faq.md`         | New member FAQ and club directory        |
| `02-aws-account-setup.md`      | AWS account and billing information      |
| `03-builder-center-publish.md` | Builder Center publishing                |
| `04-bedrock-starter.md`        | Getting started with Bedrock             |
| `05-hackathon-rules.md`        | Hackathon rules                          |
| `06-workshop-index.md`         | Previous workshops                       |
| `07-lambda-patterns.md`        | Serverless API patterns                  |
| `08-sbg-community.md`          | Student Builder Groups and chapter leads |

These correspond to the eight starter documents specified in the baseline challenge.

---

# 🧠 Technical Highlights

The project demonstrates practical implementation of:

```text
✓ React
✓ TypeScript
✓ TanStack Start
✓ TanStack Router
✓ Supabase Authentication
✓ PostgreSQL
✓ pgvector
✓ Vector Embeddings
✓ Semantic Search
✓ Retrieval-Augmented Generation
✓ Gemini
✓ OpenAI Embeddings
✓ Server Functions
✓ Zod Validation
✓ Row Level Security
✓ Chat History
✓ Source Attribution
✓ AI Safety / Grounding
✓ Responsive UI
✓ Git + GitHub
```

---

# 🎓 What We Learned

Building this project provided hands-on experience with:

* Designing a full-stack AI application
* Building authentication systems
* Working with PostgreSQL
* Implementing vector databases
* Understanding embeddings
* Building a RAG pipeline
* Connecting an LLM to external knowledge
* Preventing unsupported AI answers
* Managing user-specific data
* Designing secure server functions
* Thinking about AWS cloud architecture
* Working under hackathon time constraints
* Turning a problem statement into a working product

---

# 🚀 Final Outcome

The **Club Member Portal** demonstrates how an ordinary student community portal can evolve into an intelligent knowledge platform.

Instead of requiring members to manually search through multiple documents, the system provides a conversational interface that retrieves relevant information, generates grounded answers, and exposes the original source.

The architecture also provides a clear path toward a fully serverless AWS implementation using services such as:

```text
Amazon Cognito
Amazon SES
Amazon S3
AWS Lambda
Amazon Bedrock
Amazon OpenSearch
Amazon CloudFront
```

---

# 📄 License

This project was created as an original hackathon project.

Open-source libraries and frameworks used by the project remain subject to their respective licenses.

---

# ⭐ Support

If you find this project interesting, consider:

⭐ Starring the repository

🍴 Forking the project

💬 Sharing feedback

🔗 Connecting with the team on LinkedIn

---

<p align="center">
  <b>Built with ❤️, ☁️ AWS, 🤖 AI, and a lot of debugging.</b>
</p>

<p align="center">
  <b>Club Member Portal — AWS Student Builder Group · RGUKT-ONGOLE</b>
</p>
