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
- [x] 主题切换改为单个图标+下拉选择模式（Light/Dark/Tech）→ 提交到 GitHub
- [x] 右上角 GitHub 图标改为实色背景 → 提交到 GitHub
- [x] 登录后右上角只显示用户头像，点击头像显示设置等操作的下拉框 → 提交到 GitHub

## 数据库与数据
- [x] 创建 skill_reviews 评价表（评分+评论）→ 提交到 GitHub
- [x] 为所有技能填充真实 README 内容和文件数据（模仿 anthropics/skills 结构）→ 提交到 GitHub

## 技能详情页完善
- [x] README tab 完善（渲染真实 Markdown 内容）→ 提交到 GitHub
- [x] Files tab 完善（展示技能描述文件目录结构）→ 提交到 GitHub
- [x] Community tab 完善（评论/讨论功能）→ 提交到 GitHub
- [x] History tab 完善（版本历史/提交记录）→ 提交到 GitHub
- [x] Inference API tab 完善 → 提交到 GitHub

## 用户评价系统
- [x] 用户对技能打分和评论功能 → 提交到 GitHub
- [x] 相关技能推荐（基于分类和标签）→ 提交到 GitHub

## 搜索功能
- [x] 全文搜索引擎（支持 README 内容和标签搜索）→ 提交到 GitHub
- [x] 顶部搜索框模糊搜索（模仿 Hugging Face）→ 提交到 GitHub

## 技能创建与发布
- [x] 在线技能创建编辑器（Markdown 实时预览）→ 提交到 GitHub
- [x] 技能发布到平台功能 → 提交到 GitHub
- [x] Skills 仓库评论功能 → 提交到 GitHub
- [x] Skills 收藏功能 → 提交到 GitHub
- [x] Skills Fork 功能 → 提交到 GitHub

## 社交分享
- [x] 技能社交媒体分享功能 → 提交到 GitHub

## Agent 创建与运行
- [x] Agent 创建页面重构：去掉先选 Skills/Models 步骤，在 Agent Summary 中直接添加 Skills/Models 下拉选择 → 提交到 GitHub
- [x] Agent Summary 中 Skills 下拉框：支持多选、搜索、点击"All Skills"跳转 Skills 页面 → 提交到 GitHub
- [x] Agent Summary 中 Models 下拉框：支持多选、搜索、点击"Models"跳转 Models 页面 → 提交到 GitHub
- [x] Agent 发布后运行页面：左侧对话框 + 右侧已选 Skills 角色面板 → 提交到 GitHub
- [x] Agent 运行页面：AI 任务调度系统，指令智能分派给对应技能模块 → 提交到 GitHub
- [x] Agent 后端 API：创建/保存/运行/对话接口 → 提交到 GitHub

## 模型 API Key 配置
- [x] Agent 创建页面：选择模型后显示 API Key 配置区域 → 提交到 GitHub
- [x] 每个模型提供商显示对应的 API Key 输入框（如 OpenAI API Key、Anthropic API Key 等）→ 提交到 GitHub
- [x] API Key 输入支持密码遮罩和显示切换 → 提交到 GitHub
- [x] API Key 存储到 Agent 配置中传递给运行页面 → 提交到 GitHub

# New Feature Requests - Round 3

## Skills 专业化内容
- [x] 创建 skills-repository 文件夹存储所有 Skills 的 Markdown 文件 → 提交到 GitHub
- [x] 为所有 Skills 编写专业、详细、符合行业规范的 README 内容 → 提交到 GitHub
- [x] 将 Skills 内容提交到数据库 skill_files 表中 → 提交到 GitHub
- [x] Skills 详情页展示完整专业内容 → 提交到 GitHub

## Agent 真实 LLM 接入
- [ ] Agent 运行页面接入真实大语言模型 API → 提交到 GitHub
- [ ] 利用用户配置的 API Key 实现 AI 对话 → 提交到 GitHub
- [ ] 实现任务调度：根据技能角色分派指令 → 提交到 GitHub

## 用户个人主页
- [ ] 创建用户个人主页页面 → 提交到 GitHub
- [ ] 展示用户创建的技能列表 → 提交到 GitHub
- [ ] 展示用户收藏的技能列表 → 提交到 GitHub
- [ ] 展示用户创建的 Agent 列表 → 提交到 GitHub

## 技能版本控制
- [ ] 技能编辑器增加版本控制功能 → 提交到 GitHub
- [ ] 查看技能变更历史 → 提交到 GitHub
- [ ] 对比不同版本的技能差异 → 提交到 GitHub
- [ ] 回滚到之前的版本 → 提交到 GitHub

# New Feature Requests - Round 4

## AgentRun 真实 LLM 前端
- [x] AgentRun 前端调用 agentChat.send tRPC API 实现真实对话 → 提交到 GitHub
- [x] 支持用户 API Key 和内置 LLM 双模式 → 提交到 GitHub
- [x] 任务调度：根据技能角色分派指令并显示状态 → 提交到 GitHub

## Model API Key 配置弹窗
- [x] 每个模型名称右边添加“配置按钮”，点击弹出配置弹窗 → 提交到 GitHub
- [x] 不同模型使用特定的配置内容（API Key、Base URL、Organization ID 等）→ 提交到 GitHub
- [x] 配置弹窗中支持验证 API Key → 提交到 GitHub
- [x] 模型右边显示配置状态：Required / Not Completed / Configured → 提交到 GitHub

## Agent Summary 下拉框优化
- [x] 下拉框搜索上方添加“All / 收藏 / 自创”标签筛选 → 提交到 GitHub
- [x] 下拉框底部 "Browse All Skills" 点击后出现全屏弹窗，支持多选和搜索 → 提交到 GitHub
- [x] 下拉框底部 "Browse All Models" 点击后出现全屏弹窗，支持多选和搜索 → 提交到 GitHub

## 用户个人主页
- [x] 创建 UserProfile 页面 → 提交到 GitHub
- [x] 展示用户创建的技能列表 → 提交到 GitHub
- [x] 展示用户收藏的技能列表 → 提交到 GitHub
- [x] 展示用户创建的 Agent 列表 → 提交到 GitHub

## 技能版本控制
- [ ] 技能编辑器版本控制功能 → 提交到 GitHub
- [ ] 查看技能变更历史 → 提交到 GitHub
- [ ] 对比不同版本差异 → 提交到 GitHub
- [ ] 回滚到之前版本 → 提交到 GitHub
