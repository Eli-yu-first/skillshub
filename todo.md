# SkillsHub Migration TODO

- [x] Migrate package.json (extra dependencies: ai-sdk, react-markdown, rehype, remark, streamdown plugins, etc.)
- [x] Migrate drizzle/schema.ts (all tables: skills, skillFiles, skillCommits, contexts, playgrounds, discussions, likes, organizations, agents, blogPosts, collections, userFavorites, agentSkills)
- [x] Migrate drizzle/relations.ts
- [x] Migrate drizzle migration SQL and journal
- [x] Apply database migration SQL to new project database
- [x] Migrate server/routers.ts (all tRPC procedures)
- [x] Migrate server/db.ts (all query helpers)
- [x] Migrate server/storage.ts
- [x] Migrate server/_core/env.ts updates
- [x] Migrate server/_core/chat.ts and patchedFetch.ts
- [x] Register chat routes in server/_core/index.ts
- [x] Migrate server seed data scripts
- [x] Migrate server test files (skills.test.ts, favorites.test.ts)
- [x] Migrate shared/const.ts and shared/types.ts
- [x] Migrate client/index.html (fonts, analytics)
- [x] Migrate client/src/index.css (global styles)
- [x] Migrate client/src/App.tsx (all routes)
- [x] Migrate client/src/main.tsx
- [x] Migrate client/src/const.ts
- [x] Migrate all pages (Home, Skills, SkillDetail, Contexts, Playgrounds, Deps, DepsCreate, DepsDetail, Models, Datasets, Tasks, Organizations, Collections, Languages, Blog, Community, ComingSoon, Profile, Pricing, Enterprise, Docs, NotFound)
- [x] Migrate all UI components (shadcn/ui + custom: Footer, Layout, Logo, ManusDialog, Markdown, MarkdownRenderer, Navbar, ThemeSwitcher)
- [x] Migrate all hooks (useComposition, useFileUpload, useMobile, usePersistFn)
- [x] Migrate contexts (ThemeContext)
- [x] Migrate lib files (data.ts, skillReadme.ts, trpc.ts, utils.ts)
- [x] Migrate components.json (shadcn config)
- [x] Migrate tsconfig.json and tsconfig.node.json
- [x] Migrate vite.config.ts
- [x] Migrate vitest.config.ts
- [x] Migrate patches directory
- [x] Migrate references directory
- [x] Install all extra dependencies (ai-sdk, react-markdown, rehype, remark, streamdown plugins)
- [x] Create all database tables (17 tables total)
- [x] Run seed data script (50 categories, 510 skills)
- [x] Verify build succeeds (dev server running, no TypeScript errors)
- [x] Run tests (16/16 passed: auth, skills, favorites, categories, stats)

# New Feature Requests

## UI 优化
- [ ] 主题切换改为单个图标+下拉选择模式（Light/Dark/Tech）→ 提交到 GitHub
- [ ] 右上角 GitHub 图标改为实色背景 → 提交到 GitHub
- [ ] 登录后右上角只显示用户头像，点击头像显示设置等操作的下拉框 → 提交到 GitHub

## 数据库与数据
- [ ] 创建 skill_reviews 评价表（评分+评论）→ 提交到 GitHub
- [ ] 为所有技能填充真实 README 内容和文件数据（模仿 anthropics/skills 结构）→ 提交到 GitHub

## 技能详情页完善
- [ ] README tab 完善（渲染真实 Markdown 内容）→ 提交到 GitHub
- [ ] Files tab 完善（展示技能描述文件目录结构）→ 提交到 GitHub
- [ ] Community tab 完善（评论/讨论功能）→ 提交到 GitHub
- [ ] History tab 完善（版本历史/提交记录）→ 提交到 GitHub
- [ ] Inference API tab 完善 → 提交到 GitHub

## 用户评价系统
- [ ] 用户对技能打分和评论功能 → 提交到 GitHub
- [ ] 相关技能推荐（基于分类和标签）→ 提交到 GitHub

## 搜索功能
- [ ] 全文搜索引擎（支持 README 内容和标签搜索）→ 提交到 GitHub
- [ ] 顶部搜索框模糊搜索（模仿 Hugging Face）→ 提交到 GitHub

## 技能创建与发布
- [ ] 在线技能创建编辑器（Markdown 实时预览）→ 提交到 GitHub
- [ ] 技能发布到平台功能 → 提交到 GitHub
- [ ] Skills 仓库评论功能 → 提交到 GitHub
- [ ] Skills 收藏功能 → 提交到 GitHub
- [ ] Skills Fork 功能 → 提交到 GitHub

## 社交分享
- [ ] 技能社交媒体分享功能 → 提交到 GitHub
