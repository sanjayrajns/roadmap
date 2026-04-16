<div align="center">

# 🗺️ AI Dev Roadmap

### A deterministic, AI-personalized developer learning roadmap platform

*Built autonomously with [Antigravity](https://antigravity.google) — Google DeepMind's agentic AI coding assistant*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-ff69b4?style=flat-square&logo=framer)](https://framer.com/motion)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org)

</div>

---

## 📖 What is this project?

**AI Dev Roadmap** is a full-stack learning platform that generates highly personalized developer roadmaps in real-time. A user answers 5 structured onboarding questions (role, experience, interests, learning style, time commitment), and the system deterministically constructs a learning roadmap with curated, depth-tiered resources — videos, official documentation, and starred GitHub repositories — tailored to exactly who they are.

This is not a static roadmap site. Resources are **context-aware** (your experience level changes what you see), **style-adapted** (prefer videos over docs? the system reorders accordingly), and displayed **per skill within each stage** — not as a generic dump.

**North Star:** *"Generate personalized developer roadmaps using AI and roadmap.sh — without hallucinated resources."*

---

## 🤖 Built with Antigravity

This entire project was architected and built using **[Antigravity](https://antigravity.google)** — Google DeepMind's agentic AI coding assistant. Antigravity is a pair-programming AI that:

- Plans complex software architectures before writing a single line of code
- Reads, understands, and evolves an entire codebase autonomously
- Uses **Skills** (specialized capability modules) to execute specific tasks such as fetching roadmap data, generating UI dashboards, and discovering learning resources
- Writes production-grade TypeScript, Python, and configuration files — and verifies them with type checks before completion
- Uses a persistent **Knowledge Item (KI)** system to remember context across conversations

### How Antigravity built this project

The development followed a structured agentic workflow:

```
Phase 1: Discovery & Architecture
  → Antigravity read roadmap.sh's GitHub structure, analyzed the data format,
    wrote findings.md, and defined strict JSON schemas in system.md.

Phase 2: Core Platform Build
  → Generated the Next.js 16 boilerplate, Firebase Admin integration,
    and Python data pipeline tools (fetch_roadmap.py, fetch_resources.py).

Phase 3: Dashboard & Onboarding UI
  → Used the generating-roadmap-dashboard and generating-question-engine Skills
    to build the 5-step onboarding wizard and the full workspace dashboard.

Phase 4: Contextual Resources Integration
  → Executed the fetching-roadmap-data skill to expand from 3 → 6 canonical
    roadmaps, built a curated 40+ skill resource registry, and wired skill-level
    resource filtering into the UI.

Phase 5: Polish
  → Added the GeneratingScreen animated progress indicator, fixed Firebase
    credentials, upgraded the resource display with grouped type sections and
    depth badges.
```

All architectural decisions, file structures, component designs, and data schemas were proposed and executed by Antigravity — with the human developer providing direction and approvals.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **5-Step Onboarding Wizard** | Role → Experience → Interests → Learning Style → Time Commitment |
| **Archetype-Based Personalization** | Questions adapt to your role (WEB / DATA / INFRA / MOBILE / SECURITY archetypes) |
| **6 Canonical Roadmaps** | Frontend, Backend, Full Stack, DevOps, AI Engineer, Data Scientist |
| **Tiered Resource Discovery** | Beginner vs Advanced resources per skill — not one-size-fits-all |
| **Multi-Source Resources** | Video tutorials, official docs, GitHub repos — all curated, zero hallucination |
| **Skill Filter Pills** | Click any skill inside a stage to see only its resources |
| **Deep Dive** | Fetches and renders the GitHub README of the top repository for any stage |
| **Project Recommendations** | Curated hands-on projects at every stage |
| **Stage Verification** | Built-in quiz/checklist to mark stages as complete |
| **Animated Progress Indicator** | Full-page dark loading screen while the roadmap generates |
| **Firebase Persistence** | Generated roadmaps are saved per user session |
| **Workspace Dashboard** | Multi-section navigation: Dashboard, Roadmap, Courses, Paths, Playground, Profile |

---

## 🗂️ Full Project Structure

```
Roadmap/
│
├── 📁 .agent/                          # Antigravity AI agent configuration
│   └── skills/                         # Skill modules used by the agent
│       ├── fetching-roadmap-data/      # Skill: fetch & parse roadmap.sh structures
│       ├── discovering-learning-resources/ # Skill: curate tiered learning resources
│       ├── applying-design-guidelines/ # Skill: enforce design system in UI generation
│       ├── generating-roadmap-dashboard/ # Skill: build the roadmap visualization UI
│       └── generating-question-engine/ # Skill: build the 5-step onboarding questionnaire
│
├── 📁 architecture/                    # Standard Operating Procedures (SOPs)
│   ├── 01-data-ingestion-sop.md       # How roadmap.sh data is ingested → JSON schema
│   └── 02-ai-customization-sop.md     # How AI trims + personalizes the roadmap graph
│
├── 📁 designGuidelines/               # Design system specification
│   ├── README.md                      # Typography, color system, component patterns
│   ├── design.md                      # Concise design token reference
│   └── designingUI.webp               # Visual reference mockup
│
├── 📁 tools/                          # Python data pipeline scripts
│   ├── fetch_roadmap.py               # ⭐ Core: generates roadmap stage/skill structure
│   ├── fetch_resources.py             # ⭐ Core: discovers tiered, multi-source resources
│   ├── ingest_roadmap.py              # Ingests raw roadmap.sh markdown → internal schema
│   └── ai_roadmap_trimmer.py          # LLM-based roadmap pruning based on user goals
│
├── 📁 docs/                           # Extended project documentation
├── 📁 backend/                        # Backend services (reserved for future expansion)
├── 📁 mcps/                           # Model Context Protocol definitions
│
├── system.md                          # ⭐ System Constitution — schemas, rules, constraints
├── findings.md                        # Research findings (roadmap.sh analysis, UI best practices)
├── task_plan.md                       # Phase-by-phase project blueprint
├── progress.md                        # Development milestone tracker
│
└── 📁 frontend/                       # Next.js 16 Application (main deliverable)
    │
    ├── 📁 app/                        # Next.js App Router
    │   ├── layout.tsx                 # Root layout (fonts, Navbar, global styles)
    │   ├── page.tsx                   # Landing page with hero, features, testimonials
    │   ├── globals.css                # Global CSS + Tailwind + design tokens
    │   ├── 📁 onboarding/
    │   │   └── page.tsx               # ⭐ 5-step onboarding wizard (client component)
    │   └── 📁 api/
    │       └── roadmap/
    │           └── route.ts           # ⭐ POST /api/roadmap — orchestrates the full pipeline
    │
    ├── 📁 components/
    │   ├── GeneratingScreen.tsx       # ⭐ Animated loading progress indicator
    │   ├── RoadmapView.tsx            # Main roadmap dashboard (header + stage rail + panels)
    │   │
    │   ├── 📁 roadmap/               # Roadmap sub-components
    │   │   ├── RoadmapProgress.tsx    # Horizontal stage node rail (click to navigate)
    │   │   ├── TopicDetailPanel.tsx   # ⭐ Stage detail: skill pills + resource tabs
    │   │   ├── ResourceList.tsx       # ⭐ Grouped resource display (VIDEO / DOCS / GITHUB)
    │   │   ├── SupportingPanel.tsx    # Sidebar: related skills, projects, next stage preview
    │   │   ├── ProgressTracker.tsx    # Completed / total stages badge
    │   │   └── VerificationPanel.tsx  # Stage completion quiz/checklist
    │   │
    │   ├── 📁 workspace/             # Post-generation workspace shell
    │   │   ├── Workspace.tsx          # Navigation shell wrapping all workspace sections
    │   │   ├── NavigationSidebar.tsx  # Left sidebar with section icons
    │   │   ├── DashboardSection.tsx   # Overview dashboard (progress, stats, recent activity)
    │   │   ├── CoursesSection.tsx     # Flat resource list across all stages
    │   │   ├── LearningPathsSection.tsx # Alternative learning paths view
    │   │   ├── PlaygroundSection.tsx  # Code playground / exercise area
    │   │   └── ProfileSection.tsx     # User profile and progress summary
    │   │
    │   └── 📁 ui/                    # Shared UI primitives
    │       ├── navbar.tsx             # Global pinned navigation bar
    │       ├── button.tsx             # Shadcn-style button primitive
    │       └── grid-feature-cards.tsx # AnimatedContainer + feature card components
    │
    ├── 📁 lib/                        # Shared utilities and data
    │   ├── firebase-admin.ts          # Firebase Admin SDK initialization (server-side)
    │   ├── onboarding-content.ts      # ⭐ Archetype-based step content (WEB/DATA/INFRA/MOBILE/SECURITY)
    │   └── utils.ts                   # cn() utility (clsx + tailwind-merge)
    │
    ├── .env                           # Environment variables (GitHub token, Firebase credentials)
    ├── tailwind.config.ts             # Tailwind extended config
    ├── next.config.ts                 # Next.js configuration
    └── package.json                   # Dependencies
```

---

## 🧠 How It Works — The Full Pipeline

When a user clicks **Generate Roadmap**, the following deterministic pipeline executes:

```
User Form Data
      │
      ▼
POST /api/roadmap
      │
      ├─► 1. fetch_roadmap.py
      │        --role "devops"
      │        --experience "intermediate"
      │        --interest "databases"
      │        → Returns JSON: { role, stages: [{ stage_name, skills[], recommended_projects[] }] }
      │        → Filters stages by experience level (removes beginner stages for advanced users)
      │        → Injects an interest specialization stage near the end
      │
      ├─► 2. Collect all skills across all stages → flat skill list
      │
      ├─► 3. fetch_resources.py
      │        --topics "Docker,Kubernetes,GitHub Actions,Terraform"
      │        --style "documentation"      ← user's preferred learning style
      │        --experience "intermediate"  ← filters resource depth tier
      │        → Returns JSON: { "docker": [...resources], "kubernetes": [...resources] }
      │        → Looks up CURATED registry first (40+ skills, no API needed)
      │        → Falls back to GitHub Search API for uncurated topics
      │        → Resources sorted: preferred style first, then supplemental types
      │
      ├─► 4. Map resources back to stages
      │        → stage.resources = { "Docker": [...], "Kubernetes": [...] }
      │        → Uses normalized key matching (partial match) for compound skill names
      │
      ├─► 5. Save to Firebase Firestore
      │        → Document: { userId, role_goal, roadmap, resources, progress, createdAt }
      │
      └─► 6. Return UI Payload
               → { roadmap, resources (flat), progress }
               → Frontend: loading=true → GeneratingScreen → uiPayload set → Workspace
```

---

## 🏗️ Skill Modules (`.agent/skills/`)

The project is powered by **Antigravity Skills** — modular instruction sets that define exactly how the AI agent should execute specific tasks. Each skill is a folder containing a `SKILL.md` with workflow steps and examples.

### `fetching-roadmap-data`
- **Purpose**: Retrieves structured roadmap data (stages + skills) for any developer role
- **Implementation**: `tools/fetch_roadmap.py` — a Python script with a canonical `ROADMAP_REGISTRY` for the top 6 roles, plus heuristic generation for any other role
- **Importance**: This is the foundation of the entire system. Without a structured stage graph, resources cannot be mapped per-skill, personalization has no context, and the dashboard has nothing to render. Every other layer depends on this skill producing a clean, ordered stage sequence.

### `discovering-learning-resources`
- **Purpose**: Finds and ranks curated learning resources for each skill/topic
- **Implementation**: `tools/fetch_resources.py` — a static `CURATED` registry of 40+ skills with tiered resources (`beginner`/`advanced`/`all`), plus a GitHub Search API fallback
- **Importance**: Resources are the *value* of the platform. The anti-hallucination strategy (curated static registry + trusted GitHub repos instead of LLM-generated URLs) ensures every link is real, reputable, and appropriate to the user's depth level. This is what separates a useful tool from a generic chatbot response.

### `generating-roadmap-dashboard`
- **Purpose**: Builds the interactive roadmap visualization UI (timeline, stage cards, resource cards, progress tracking)
- **Implementation**: `RoadmapView.tsx` + all `components/roadmap/` sub-components
- **Importance**: Data without presentation is unusable. The dashboard translates the structured JSON roadmap into an interactive learning experience with stage navigation, skill-level resource filtering, progress tracking, and a Deep Dive mode with real GitHub README content.

### `generating-question-engine`
- **Purpose**: Generates the 5-step onboarding questionnaire that captures user goals
- **Implementation**: `app/onboarding/page.tsx` + `lib/onboarding-content.ts`
- **Importance**: The quality of personalization is entirely determined by the quality of user input capture. The archetype system (WEB / DATA / INFRA / MOBILE / SECURITY) adapts every question's language, options, and framing to the user's chosen role — making the questions feel specifically relevant rather than generic.

### `applying-design-guidelines`
- **Purpose**: Enforces the project design system when generating any new UI component
- **Implementation**: Applied across all components; reference is `designGuidelines/`
- **Importance**: Visual consistency is what makes a platform feel professional vs. cobbled together. The design system (zinc palette, uppercase tracking labels, sharp corners, Plus Jakarta Sans, Framer Motion animations) creates a coherent identity that users trust.

---

## 🛣️ The 6 Canonical Roadmaps

Each roadmap has a fully specified, ordered stage sequence inside `tools/fetch_roadmap.py`:

| Role | Stages | Key Milestones |
|---|---|---|
| **Frontend Developer** | 6 stages | HTML/CSS/JS → Frameworks → TypeScript & Architecture |
| **Backend Developer** | 6 stages | APIs → Databases → Auth → Microservices & Docker |
| **Full Stack Developer** | 6 stages | Web Fundamentals → React → Node.js → Next.js → Deployment |
| **DevOps Engineer** | 6 stages | Linux CLI → Docker → Kubernetes → CI/CD → Terraform & Cloud |
| **AI Engineer** | 5 stages | Math Foundations → ML Core → Deep Learning → LLMs/RAG → MLOps |
| **Data Scientist** | 6 stages | Python/SQL → Statistics → Visualization → ML → NLP → Big Data |

Additionally, **13 interest specialization stages** can be injected into any roadmap based on user interest (animations, NLP, computer vision, system design, forensics, etc.).

---

## 📦 Resource Discovery Engine

`tools/fetch_resources.py` is the heart of the learning platform. It uses a multi-layered strategy:

### Layer 1: Curated Static Registry (40+ skills)
```
skill key → [ { title, type, url, depth, description } ]
```
- **Depth tiers**: `"beginner"` | `"advanced"` | `"all"`
- **Types**: `"video"` | `"documentation"` | `"github"`
- **Sources**: freeCodeCamp, MDN Web Docs, official docs, Traversy/TechWorld courses, awesome-* repos
- No API key required. Zero latency. Zero hallucination.

### Layer 2: GitHub Search API Fallback
For any skill not in the curated registry, the engine queries the GitHub Search API for top-starred repositories, filtered by learning style keywords (e.g., `tutorial walkthrough` for video style).

### Personalization logic
```python
# Filter by experience
if experience == "beginner":
    # only return depth: "beginner" or "all"
elif experience == "advanced":
    # only return depth: "advanced" or "all"

# Sort by style preference
style_match = [r for r in resources if r["type"] == preferred_style]
other = [r for r in resources if r["type"] != preferred_style]
final = style_match + other  # preferred type first
```

---

## 🎨 Design System

The project uses a strict, minimal design language derived from the `designGuidelines/` specification:

| Token | Value | Usage |
|---|---|---|
| **Primary bg** | `zinc-50` / `zinc-950` | Page backgrounds |
| **Brand bg** | `#0D0C22` | Dark mode surfaces |
| **Accent purple** | `#655C7A` | VIDEO badges, supporting panel headers |
| **Typography** | Plus Jakarta Sans (thin / bold) | All headings and UI text |
| **Labels** | `text-[10px] tracking-widest uppercase` | All metadata labels |
| **Borders** | `border-zinc-100` / `border-zinc-200` | All card borders |
| **Border-radius** | None (`rounded-none`) | Sharp, architectural feel |
| **Animations** | Framer Motion | All transitions (0.25–0.5s) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.10+
- A Firebase project (Firestore enabled)
- Optional: GitHub Personal Access Token (for resource fallback API)

### 1. Clone and install
```bash
git clone <repo-url>
cd Roadmap/frontend
npm install
```

### 2. Configure environment variables
Create `frontend/.env`:
```env
GITHUB_TOKEN=your_github_pat_token
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Install Python dependencies
```bash
pip install requests python-dotenv
```

### 4. Run the development server
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and navigate to `/onboarding`.

---

## 🔌 API Reference

### `POST /api/roadmap`

Generates a personalized roadmap and saves it to Firebase.

**Request body:**
```json
{
  "role_goal": "devops",
  "experience_level": "intermediate",
  "interest_area": "databases",
  "learning_style": "documentation",
  "time_commitment": 10
}
```

**Response:**
```json
{
  "roadmap": {
    "role": "devops",
    "stages": [
      {
        "stage_name": "Containers & Docker",
        "skills": ["Docker Architecture", "Dockerfile", "Docker Compose"],
        "resources": {
          "Docker Architecture": [
            { "title": "Docker Official Docs", "type": "documentation", "depth": "all", "url": "..." }
          ]
        },
        "recommended_projects": ["Containerize a multi-service app with Docker Compose"]
      }
    ]
  },
  "resources": [...],
  "progress": { "completed_stages": 0, "total_stages": 5 },
  "firebaseId": "abc123",
  "userId": "user_lk3j2_x8f"
}
```

---

## 🧪 Testing the Python Tools

Run any tool directly from the project root:

```bash
# Generate a roadmap structure
python tools/fetch_roadmap.py --role fullstack --experience intermediate --interest apis_servers

# Fetch tiered resources for specific skills
python tools/fetch_resources.py --topics "React,TypeScript,Node.js" --style video --experience beginner

# Ingest raw roadmap.sh data (legacy)
python tools/ingest_roadmap.py --role frontend
```

---

## 🔮 Architecture Principles

1. **Determinism over hallucination** — The system uses a curated static registry and structured Python scripts rather than LLM-generated content. The AI layer only trims the roadmap graph, never invents resource URLs.

2. **Archetype-based personalization** — Rather than one generic flow, each question in the onboarding wizard adapts its labels, descriptions, and options based on the user's chosen role archetype. A DevOps user sees "Logic Basics → System Builder → SRE/Architect" while a Web user sees "Visual Explorer → Component Master → Design System Pro".

3. **Skill-level resource mapping** — Resources are not stored globally per roadmap. They are mapped at the individual skill level (`stage.resources["Docker"]`, `stage.resources["Kubernetes"]`), enabling the skill filter pill UI in the dashboard.

4. **Experience depth tiers** — Every curated resource has a `depth` property. Beginner users see foundational tutorials; advanced users see architecture papers, performance deep-dives, and the "hard way" guides.

5. **Progressive disclosure** — The UI progressively reveals complexity: first the stage overview, then skills within the stage, then skill-specific resources, then the GitHub README deep-dive. Cognitive load is always managed.

---

## 📄 License

MIT — built for learning, by learning.

---

<div align="center">

*Designed and built with ❤️ using [Antigravity](https://antigravity.google) by Google DeepMind*

*"The best roadmap is the one built specifically for you."*

</div>
