<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/skills-566+-orange.svg" alt="Skills" />
  <img src="https://img.shields.io/badge/categories-50+-purple.svg" alt="Categories" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React" />
</p>

# SkillsHub

**The Skills Community Building the Future.**

SkillsHub is an enterprise-grade, open-source platform for discovering, sharing, and deploying AI agent skills. It aggregates skills from leading AI organizations — including **OpenAI**, **Anthropic**, **Hugging Face**, and **Vercel** — into a unified, searchable marketplace with a rich developer experience.

> Share, discover, and run reusable prompts, agent logic, and automation scripts.

---

## Features

| Feature | Description |
|---------|-------------|
| **566+ Skills** | Curated skills across 50 professional domains with hierarchical categorization |
| **Multi-Source Import** | Skills imported from `openai/skills`, `anthropics/skills`, `huggingface/skills`, `vercel-labs/skills` |
| **Hierarchical Categories** | 3-level taxonomy: Domain → Subdomain → Specialty (673 categories) |
| **Skill Detail Pages** | 5-tab interface: README, Files, Community, History, Inference API |
| **Deps / Agents Market** | Build custom agents by combining multiple skills with LLM models |
| **One-Click Sandbox Deploy** | Deploy agents to isolated sandbox environments |
| **User Favorites** | Bookmark skills and manage collections from your profile |
| **Social Sharing** | Share skills to Twitter/X, LinkedIn, Facebook, or copy link |
| **Sorting & Filtering** | Sort by trending, latest, alphabetical; filter by category |
| **Dark / Light / Tech Themes** | Three built-in themes with system preference detection |
| **OAuth Authentication** | Manus OAuth integration with session management |
| **tRPC End-to-End Type Safety** | Full-stack type safety from database to UI |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5.9, Tailwind CSS 4, Vite 7 |
| **Backend** | Express 4, tRPC 11, Node.js 22 |
| **Database** | MySQL / TiDB (Drizzle ORM) |
| **Auth** | Manus OAuth 2.0, JWT sessions |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons, Framer Motion |
| **Data Fetching** | TanStack React Query, SuperJSON |
| **Routing** | Wouter (lightweight client-side routing) |
| **AI Integration** | AI SDK (Vercel), OpenAI-compatible LLM helpers |
| **File Storage** | AWS S3 (via platform helpers) |
| **Testing** | Vitest |

---

## Project Structure

```
skillshub-app/
├── client/                          # Frontend application
│   ├── index.html                   # HTML entry point
│   ├── public/                      # Static assets (favicon, robots.txt)
│   └── src/
│       ├── App.tsx                  # Routes & layout
│       ├── main.tsx                 # React entry + providers
│       ├── index.css                # Global styles & theme variables
│       ├── const.ts                 # Frontend constants & auth helpers
│       ├── pages/                   # 20+ page components
│       │   ├── Home.tsx             # Landing page with hero & stats
│       │   ├── Skills.tsx           # Skills browsing with sort/filter
│       │   ├── SkillDetail.tsx      # 5-tab skill detail view
│       │   ├── Contexts.tsx         # Context datasets browser
│       │   ├── Playgrounds.tsx      # Interactive playgrounds
│       │   ├── Deps.tsx             # Agents marketplace
│       │   ├── DepsCreate.tsx       # Agent builder (skills + models)
│       │   ├── DepsDetail.tsx       # Agent detail page
│       │   ├── Profile.tsx          # User profile & favorites
│       │   ├── Docs.tsx             # Documentation center
│       │   ├── Pricing.tsx          # Pricing plans
│       │   ├── Enterprise.tsx       # Enterprise solutions
│       │   ├── Community.tsx        # Community hub
│       │   ├── Blog.tsx             # Blog articles
│       │   ├── Models.tsx           # AI models directory
│       │   ├── Datasets.tsx         # Datasets browser
│       │   ├── Tasks.tsx            # Task management
│       │   ├── Organizations.tsx    # Organizations directory
│       │   ├── Collections.tsx      # Curated collections
│       │   └── Languages.tsx        # Multi-language support
│       ├── components/              # Reusable UI components
│       │   ├── Navbar.tsx           # Navigation bar with auth
│       │   ├── Footer.tsx           # Site footer
│       │   ├── Layout.tsx           # Page layout wrapper
│       │   ├── Markdown.tsx         # Markdown renderer
│       │   ├── ThemeSwitcher.tsx    # Theme toggle (Light/Dark/Tech)
│       │   ├── AIChatBox.tsx        # AI chat interface
│       │   ├── DashboardLayout.tsx  # Dashboard sidebar layout
│       │   └── ui/                  # shadcn/ui components (40+)
│       ├── hooks/                   # Custom React hooks
│       ├── contexts/                # React contexts (Theme)
│       └── lib/                     # Utilities (tRPC client, data, utils)
│
├── server/                          # Backend application
│   ├── routers.ts                   # tRPC API procedures (10 modules)
│   ├── db.ts                        # Database query helpers
│   ├── storage.ts                   # S3 file storage helpers
│   ├── _core/                       # Framework plumbing (OAuth, context, Vite)
│   │   ├── index.ts                 # Server entry point
│   │   ├── trpc.ts                  # tRPC initialization
│   │   ├── context.ts               # Request context builder
│   │   ├── oauth.ts                 # OAuth callback handler
│   │   ├── chat.ts                  # AI chat streaming endpoint
│   │   ├── llm.ts                   # LLM invocation helpers
│   │   └── env.ts                   # Environment variable management
│   └── seed/                        # Database seed scripts
│       ├── seed-categories-skills.mjs    # 50 domains + 500 skills generator
│       ├── import-github-skills.mjs      # GitHub repos importer
│       ├── seed-files-batch.mjs          # Batch file data generator
│       └── categories.ts                 # Category definitions
│
├── drizzle/                         # Database schema & migrations
│   ├── schema.ts                    # 11 core tables + extensions
│   ├── relations.ts                 # Table relationships
│   └── 0000_good_smiling_tiger.sql  # Initial migration
│
├── shared/                          # Shared types & constants
│   └── const.ts                     # Cross-stack constants
│
├── references/                      # AI SDK documentation
├── vite.config.ts                   # Vite build configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── tsconfig.json                    # TypeScript configuration
├── vitest.config.ts                 # Test configuration
└── package.json                     # Dependencies & scripts
```

---

## Database Schema

The platform uses 11+ core tables with a hierarchical category system:

| Table | Description | Records |
|-------|-------------|---------|
| `users` | User accounts with OAuth & role management | Dynamic |
| `categories` | 3-level hierarchical taxonomy (parentId self-reference) | 673 |
| `skills` | AI agent skills with metadata, README, versioning | 566 |
| `skill_files` | File tree for each skill (SKILL.md, scripts, configs) | 5,097 |
| `skill_commits` | Version history / commit log per skill | 3,547 |
| `discussions` | Community discussions on skills | Dynamic |
| `user_favorites` | User bookmark/favorite relationships | Dynamic |
| `agents` | Custom agents built from skills + models | Dynamic |
| `agent_skills` | Many-to-many: agents ↔ skills | Dynamic |
| `contexts` | Context datasets for AI training | Dynamic |
| `playgrounds` | Interactive skill execution environments | Dynamic |
| `organizations` | Team/org management | Dynamic |
| `blogs` | Blog articles and announcements | Dynamic |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22.x
- **pnpm** ≥ 10.x
- **MySQL** 8.0+ or **TiDB** (recommended for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/Eli-yu-first/skillshub.git
cd skillshub

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}

# Authentication
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Owner Info
OWNER_OPEN_ID=your-open-id
OWNER_NAME=your-name

# Built-in APIs (optional)
BUILT_IN_FORGE_API_URL=https://forge-api.example.com
BUILT_IN_FORGE_API_KEY=your-api-key
```

### Database Setup

```bash
# Generate migration SQL from schema
pnpm drizzle-kit generate

# Apply migrations (or use webdev_execute_sql in Manus)
pnpm drizzle-kit migrate
```

### Seed Data

```bash
# Seed 50 domains + 500 skills + files + commits
node server/seed/seed-categories-skills.mjs

# Import skills from GitHub repositories
node server/seed/import-github-skills.mjs

# Batch insert file data
node server/seed/seed-files-batch.mjs
```

### Development

```bash
# Start development server (hot reload)
pnpm dev

# Run tests
pnpm test

# Type checking
pnpm check

# Build for production
pnpm build

# Start production server
pnpm start
```

The development server runs at `http://localhost:3000` with Vite HMR for instant frontend updates.

---

## API Reference

All API endpoints are served via tRPC at `/api/trpc`. The following procedure groups are available:

| Module | Procedures | Auth Required |
|--------|-----------|---------------|
| `auth` | `me`, `logout` | Public / Protected |
| `skills` | `list`, `bySlug`, `search`, `featured` | Public |
| `categories` | `list`, `tree` | Public |
| `favorites` | `list`, `toggle`, `check` | Protected |
| `discussions` | `list`, `create` | Public / Protected |
| `agents` | `list`, `create`, `byId` | Public / Protected |
| `contexts` | `list` | Public |
| `playgrounds` | `list` | Public |
| `organizations` | `list` | Public |
| `stats` | `platform` | Public |

### Example: Fetching Skills

```typescript
// Frontend (React)
import { trpc } from '@/lib/trpc';

const { data } = trpc.skills.list.useQuery({
  limit: 20,
  offset: 0,
  categoryId: 5,
  sort: 'trending',
  search: 'code review',
});
```

---

## Deployment

### Manus Platform (Recommended)

SkillsHub is designed for one-click deployment on the Manus platform:

1. Click the **Publish** button in the Manus Management UI
2. Configure your custom domain in **Settings → Domains**
3. Database and environment variables are automatically provisioned

### Self-Hosted

```bash
# Build the application
pnpm build

# Set environment variables
export DATABASE_URL="mysql://..."
export JWT_SECRET="..."
export NODE_ENV=production

# Start the server
pnpm start
```

The production server serves both the API and the static frontend from a single process.

---

## Skills Sources

SkillsHub aggregates skills from the following open-source repositories:

| Source | Repository | Skills Count |
|--------|-----------|-------------|
| **OpenAI** | [openai/skills](https://github.com/openai/skills) | 32 |
| **Anthropic** | [anthropics/skills](https://github.com/anthropics/skills) | 16 |
| **Hugging Face** | [huggingface/skills](https://github.com/huggingface/skills) | 10 |
| **Vercel** | [vercel-labs/skills](https://github.com/vercel-labs/skills) | 1 |
| **SkillsHub Community** | Platform-generated | 500+ |

---

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m 'Add my feature'`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

### Adding a New Skill

Skills follow the [Agent Skills](https://github.com/openai/skills) open format:

```
skills/your-skill/
├── SKILL.md          # Frontmatter (name, description) + instructions
├── scripts/          # Executable scripts (Python, JS, Bash)
├── resources/        # Reference documents, templates
└── tests/            # Test cases
```

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [OpenAI Codex Skills](https://github.com/openai/skills) for the skills format standard
- [Anthropic Skills](https://github.com/anthropics/skills) for Claude-optimized skills
- [Hugging Face Skills](https://github.com/huggingface/skills) for ML/AI training skills
- [Vercel Labs](https://github.com/vercel-labs/skills) for the skills discovery tool
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [tRPC](https://trpc.io/) for end-to-end type-safe APIs
- [Drizzle ORM](https://orm.drizzle.team/) for the TypeScript-first database toolkit

---

<p align="center">
  Built with ❤️ by the SkillsHub Community
</p>
