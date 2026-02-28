<p align="center">
  <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/skillshub-logo-jvqKdRTAaGhKVNvcaysStw.webp" width="80" alt="SkillsHub Logo" />
</p>

<h1 align="center">SkillsHub</h1>

<p align="center">
  <strong>The Skills Community Building the Future</strong>
</p>

<p align="center">
  A full-stack platform for sharing, discovering, and running reusable AI skills, context datasets, and interactive playgrounds.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#database-schema">Database Schema</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Features

**Core Platform**

- **Skills Marketplace** — Browse, search, and filter 1000+ reusable AI skills across 50 categories with trending, most-liked, and recently-updated sorting.
- **Skill Editor & Version Control** — Create and edit skills with a built-in editor, commit history, version comparison (diff view), and rollback capabilities.
- **Context Datasets** — Share and discover curated context datasets for grounding AI models.
- **Interactive Playgrounds** — Run and test skills in a live sandbox environment.
- **Agent Builder (Deps)** — Compose multi-skill AI agents with configurable models, API keys, and task dispatching.

**AI Integration**

- **Real LLM Chat** — Agent runtime powered by real LLM APIs (OpenAI, Anthropic, Google, Mistral, DeepSeek, Alibaba) with automatic fallback to built-in LLM.
- **Multi-Provider Support** — Per-provider API key configuration with validation and status indicators (Required / Not Completed / Configured).
- **Task Dispatching** — Intelligent skill-based task routing with real-time status tracking (idle → active → done/error).

**Community**

- **User Profiles** — Personal pages showing created skills, favorites, and agents with tab navigation.
- **Reviews & Ratings** — 5-star review system for skills with detailed feedback.
- **Collections** — Curate and share themed skill collections.
- **Organizations** — Team-based skill management and collaboration.
- **Discussions** — Community forum with threaded replies.
- **Blog** — Platform news and tutorials.

**User Experience**

- **Dark/Light Theme** — System-aware theme switching with persistent preference.
- **Responsive Design** — Mobile-first layout with adaptive navigation.
- **Manus OAuth** — Secure authentication with session management.
- **Favorites & Forks** — Bookmark skills and fork them for customization.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 19.2 |
| **Styling** | Tailwind CSS + shadcn/ui (53 components) | 4.1 |
| **Routing** | Wouter | 3.x |
| **State** | TanStack React Query + tRPC React | 5.x / 11.x |
| **Backend** | Express + tRPC Server | 4.x / 11.x |
| **Database** | MySQL (TiDB) + Drizzle ORM | 0.44 |
| **Auth** | Manus OAuth + JWT Sessions | — |
| **AI** | OpenAI / Anthropic / Google / Mistral APIs + Built-in LLM | — |
| **Storage** | AWS S3 (via Manus Forge) | — |
| **Build** | Vite + esbuild | 7.x |
| **Testing** | Vitest | 2.x |
| **Fonts** | Space Grotesk, DM Sans, IBM Plex Mono | — |

---

## Project Structure

```
skillshub/
├── client/                          # Frontend (React + Vite)
│   ├── index.html                   # HTML entry point with Google Fonts
│   ├── public/                      # Static assets (favicon, robots.txt)
│   └── src/
│       ├── App.tsx                  # Route definitions (26 routes)
│       ├── main.tsx                 # React entry with tRPC/QueryClient providers
│       ├── const.ts                 # Frontend constants & OAuth helpers
│       ├── index.css                # Global styles, Tailwind theme, custom fonts
│       ├── components/
│       │   ├── Navbar.tsx           # Main navigation with mega dropdown
│       │   ├── Footer.tsx           # Site footer
│       │   ├── Logo.tsx             # SkillsHub logo component
│       │   ├── ThemeSwitcher.tsx    # Dark/light theme toggle
│       │   ├── SkillVersionControl.tsx  # Git-like version control UI
│       │   ├── AIChatBox.tsx        # AI chat interface
│       │   ├── Markdown.tsx         # Markdown renderer
│       │   ├── DashboardLayout.tsx  # Admin dashboard shell
│       │   ├── ManusDialog.tsx      # Reusable dialog component
│       │   └── ui/                  # 53 shadcn/ui components
│       ├── pages/
│       │   ├── Home.tsx             # Landing page with hero & stats
│       │   ├── Skills.tsx           # Skills marketplace (browse/filter/search)
│       │   ├── SkillDetail.tsx      # Skill detail with files, versions, reviews
│       │   ├── SkillCreate.tsx      # Skill creation form
│       │   ├── Contexts.tsx         # Context datasets listing
│       │   ├── Playgrounds.tsx      # Interactive playgrounds
│       │   ├── Deps.tsx             # Agent marketplace
│       │   ├── DepsCreate.tsx       # Agent builder with model config
│       │   ├── DepsDetail.tsx       # Agent detail page
│       │   ├── AgentRun.tsx         # Agent runtime with LLM chat
│       │   ├── UserProfile.tsx      # User profile (skills/favorites/agents)
│       │   ├── Profile.tsx          # Account settings
│       │   ├── Blog.tsx             # Blog listing
│       │   ├── Community.tsx        # Community hub
│       │   ├── Organizations.tsx    # Organization listing
│       │   ├── Collections.tsx      # Skill collections
│       │   ├── Docs.tsx             # Documentation
│       │   └── ...                  # Models, Datasets, Tasks, Pricing, etc.
│       ├── contexts/
│       │   └── ThemeContext.tsx      # Theme provider (dark/light/system)
│       ├── hooks/                   # Custom React hooks
│       └── lib/
│           ├── trpc.ts              # tRPC client binding
│           ├── data.ts              # Static data (models, languages)
│           ├── skillReadme.ts       # README template generator
│           └── utils.ts             # Utility functions (cn, formatters)
│
├── server/                          # Backend (Express + tRPC)
│   ├── routers.ts                   # All tRPC procedures (~450 lines)
│   ├── db.ts                        # Database query helpers (~670 lines)
│   ├── storage.ts                   # S3 file storage helpers
│   ├── _core/
│   │   ├── index.ts                 # Express server entry point
│   │   ├── chat.ts                  # AI chat streaming endpoint
│   │   ├── oauth.ts                 # Manus OAuth flow
│   │   ├── context.ts               # tRPC context builder
│   │   ├── trpc.ts                  # tRPC initialization
│   │   ├── llm.ts                   # Built-in LLM helper (Manus Forge)
│   │   ├── env.ts                   # Environment variable config
│   │   └── ...                      # cookies, vite, notification, etc.
│   ├── seed/                        # Database seed scripts
│   │   ├── seed.mjs                 # Main seed runner
│   │   ├── seed-categories-skills.mjs
│   │   ├── seed-skill-files.mjs
│   │   ├── categories.ts            # 50 category definitions
│   │   └── skills-data-*.ts         # Skill data files
│   └── *.test.ts                    # Vitest test files
│
├── drizzle/                         # Database schema & migrations
│   ├── schema.ts                    # 18 table definitions
│   ├── relations.ts                 # Table relationships
│   └── 0000_*.sql                   # Generated SQL migration
│
├── shared/                          # Shared between client & server
│   ├── const.ts                     # Shared constants (cookie name, etc.)
│   └── types.ts                     # Shared TypeScript types
│
├── skills-repository/               # 506 skill template directories
│   ├── academic-paper-reviewer/
│   ├── api-documentation-generator/
│   ├── ...
│   └── youtube-script-writer/
│
├── vite.config.ts                   # Vite build configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── tsconfig.json                    # TypeScript configuration
├── vitest.config.ts                 # Vitest test configuration
├── components.json                  # shadcn/ui configuration
└── package.json                     # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 22.x
- **pnpm** >= 10.x
- **MySQL** 8.0+ or **TiDB** (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Eli-yu-first/skillshub.git
cd skillshub

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}

# Authentication (Manus OAuth)
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# Owner info
OWNER_OPEN_ID=your-open-id
OWNER_NAME=your-name

# Built-in LLM (Manus Forge)
BUILT_IN_FORGE_API_URL=https://forge-api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://forge-api.manus.im
```

### Database Setup

```bash
# Generate and apply database migrations
pnpm db:push

# (Optional) Seed the database with sample data
node server/seed/seed.mjs
node server/seed/seed-categories-skills.mjs
node server/seed/seed-skill-files.mjs
```

### Development

```bash
# Start the development server (frontend + backend)
pnpm dev

# The app will be available at http://localhost:3000
```

### Testing

```bash
# Run all tests
pnpm test

# Run a specific test file
npx vitest run server/auth.logout.test.ts
```

### Production Build

```bash
# Build for production
pnpm build

# Start the production server
pnpm start
```

---

## Database Schema

The application uses 18 MySQL tables managed by Drizzle ORM:

| Table | Description |
|-------|-------------|
| `users` | User accounts with OAuth identity, roles (admin/user), profile info |
| `categories` | Skill categories with icons and descriptions (50 built-in) |
| `skills` | Core skill entries with metadata, readme, stats (downloads, likes) |
| `skill_files` | File contents belonging to skills (code, configs, docs) |
| `skill_commits` | Version control commits with file snapshots for rollback |
| `contexts` | Context datasets for grounding AI models |
| `playgrounds` | Interactive sandbox environments |
| `discussions` | Community discussion threads |
| `discussion_replies` | Threaded replies to discussions |
| `likes` | Polymorphic like system (skills, contexts, playgrounds) |
| `organizations` | Team/organization entities |
| `agents` | AI agent configurations with model and skill assignments |
| `agent_skills` | Many-to-many relationship between agents and skills |
| `blog_posts` | Blog articles and tutorials |
| `collections` | Curated skill collections |
| `user_favorites` | User bookmarked skills |
| `skill_reviews` | Star ratings and text reviews for skills |
| `skill_forks` | Fork relationships between skills |

### Entity Relationship Highlights

- A **user** can create many skills, agents, collections, and reviews.
- A **skill** belongs to a category and has many files, commits, reviews, and forks.
- An **agent** references multiple skills (via `agent_skills`) and multiple model configurations.
- **Discussions** support nested replies with user attribution.

---

## API Reference

All API endpoints are served via tRPC under `/api/trpc`. Key procedure groups:

### Skills (`trpc.skills.*`)

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `list` | Query | Public | List skills with pagination, filtering, sorting |
| `byId` | Query | Public | Get skill detail by ID |
| `create` | Mutation | Protected | Create a new skill |
| `update` | Mutation | Protected | Update skill metadata |
| `delete` | Mutation | Protected | Delete a skill |
| `commits` | Query | Public | Get version history for a skill |
| `createCommit` | Mutation | Protected | Create a new version commit |
| `commitDetail` | Query | Public | Get commit detail by hash |
| `rollback` | Mutation | Protected | Rollback skill to a previous version |

### Agent Chat (`trpc.agentChat.*`)

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `send` | Mutation | Public | Send message to AI agent with skill context |

Supports `apiKey` + `modelProvider` for external LLM APIs (OpenAI, Anthropic, Google, Mistral, Cohere) with automatic fallback to built-in Manus Forge LLM.

### Categories, Contexts, Playgrounds, Discussions, Organizations, Agents, Blog, Collections, Favorites, Reviews, Stats

Each module follows the same pattern with `list`, `byId`, `create`, `update`, and `delete` procedures as applicable. See `server/routers.ts` for the complete API surface.

### Authentication (`trpc.auth.*`)

| Procedure | Type | Description |
|-----------|------|-------------|
| `me` | Query | Get current authenticated user |
| `logout` | Mutation | Clear session cookie |

OAuth flow is handled at `/api/oauth/callback` via Manus OAuth.

---

## Deployment

### Manus Platform (Recommended)

This project is designed for deployment on the [Manus](https://manus.im) platform, which provides:

- **One-click deployment** via the Publish button in the Management UI
- **Built-in database** (TiDB) with automatic connection
- **Built-in OAuth** authentication
- **Built-in LLM** access via Manus Forge API
- **S3 storage** for file uploads
- **Custom domain** support (`.manus.space` subdomain or your own domain)
- **SSL certificates** automatically provisioned

### Self-Hosted Deployment

For self-hosted deployments, you will need to:

1. **Provision a MySQL 8.0+ database** and set `DATABASE_URL` in your environment.

2. **Set up OAuth** — Replace the Manus OAuth flow in `server/_core/oauth.ts` with your preferred authentication provider (Auth0, Clerk, NextAuth, etc.).

3. **Configure LLM access** — The built-in LLM helper (`server/_core/llm.ts`) uses Manus Forge. For self-hosting, replace `invokeLLM` with direct OpenAI SDK calls or your preferred LLM provider.

4. **Set up S3 storage** — Configure `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET` environment variables for file uploads.

5. **Build and run:**

```bash
pnpm build
NODE_ENV=production node dist/index.js
```

6. **Reverse proxy** — Place behind Nginx or Caddy with SSL termination:

```nginx
server {
    listen 443 ssl;
    server_name skillshub.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker (Optional)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production (Vite + esbuild) |
| `pnpm start` | Start production server |
| `pnpm test` | Run all Vitest tests |
| `pnpm check` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm db:push` | Generate and apply database migrations |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- TypeScript strict mode enabled
- Prettier for formatting (see `.prettierrc`)
- Component files use PascalCase, utility files use camelCase
- tRPC procedures follow the pattern: query helpers in `db.ts`, procedures in `routers.ts`

### Testing

All new features should include Vitest tests. Reference `server/auth.logout.test.ts` for the testing pattern.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the SkillsHub community
</p>
