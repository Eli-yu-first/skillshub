# SkillsHub 迁移 TODO

## Phase 1: 基础迁移（已完成）
- [x] 迁移数据库 schema（11个核心表）
- [x] 执行建表 SQL
- [x] 迁移 server/db.ts（所有查询函数）
- [x] 迁移 server/routers.ts（10个功能模块）
- [x] 迁移 server/storage.ts
- [x] 迁移 seed 脚本和数据文件
- [x] 迁移 shared 类型和常量
- [x] 迁移前端页面（20+页面）
- [x] 迁移前端组件（30+组件）
- [x] 迁移 hooks 和 contexts
- [x] 迁移 lib 工具函数
- [x] 迁移 CSS 样式和主题
- [x] 迁移 vite.config.ts 配置
- [x] 迁移 tsconfig 配置
- [x] 安装额外依赖（ai-sdk, react-markdown, rehype, remark 等）
- [x] 迁移 wouter patch
- [x] 执行数据库种子数据填充
- [x] 编写 vitest 测试
- [x] 验证所有页面和功能正常

# Phase 2: 大规模功能扩展

## Step 1: 数据库扩展 → 提交到 GitHub
- [x] 扩展分类系统为分级目录（父子分类、子类别）
- [x] 创建 user_favorites 收藏表
- [x] 创建 agents 表和 agent_skills 关联表
- [x] 提交到 GitHub ✅

## Step 2: 50个领域分级分类和500+ Skills → 提交到 GitHub
- [x] 生成50个专业领域的分级分类目录（含子分类，673个分类）
- [x] 为每个领域生成10个高质量专业Skills（510个技能）
- [x] 创建 skills-repository 文件存储（4076个文件、3385个提交记录）
- [x] 提交到 GitHub ✅

## Step 3: 技能详情页完善（接入真实数据） → 提交到 GitHub
- [x] README 标签页（从数据库读取真实 README 文件内容）
- [x] Files 标签页（从数据库读取真实文件树，模仿 GitHub 结构）
- [x] Community 标签页（从数据库读取真实讨论数据）
- [x] History 标签页（从数据库读取真实提交历史）
- [x] Inference API 标签页（完善 API 调用示例）
- [x] 提交到 GitHub ✅

## Step 4: 用户收藏功能 → 提交到 GitHub
- [x] 后端 API：收藏/取消收藏接口
- [x] 前端：技能详情页收藏按钮
- [x] 前端：个人主页已收藏列表页面
- [x] 提交到 GitHub ✅

## Step 5: 排序和分享功能 → 提交到 GitHub
- [x] 技能列表排序（热度、最新、字母顺序）
- [x] 技能详情页社交分享按钮（Twitter/X, LinkedIn, Facebook, 复制链接）
- [x] 提交到 GitHub ✅

## Step 6: Deps/Agents 市场 → 提交到 GitHub
- [x] Deps 标签页和 Agents 市场页面
- [x] Agent 创建页面（选择 Skills + 大模型）
- [x] 一键沙箱部署功能
- [ ] 提交到 GitHub ✅

## Step 7: GitHub Skills 导入 → 提交到 GitHub
- [x] 研究并导入 openai/skills（32个）
- [x] 研究并导入 anthropics/skills（16个）
- [x] 研究并导入 vercel-labs/skills（1个）
- [x] 研究并导入 huggingface/skills（10个）
- [ ] 提交到 GitHub ✅

## Step 8: 修复 GitHub Skills 导入并提交 → 提交到 GitHub
- [x] 修复 import-github-skills.mjs 中的列名错误（type→mimeType, isDirectory）
- [x] 成功运行导入脚本（53个 Skills 导入）
- [ ] 提交到 GitHub ✅

## Step 9: 创建专业 README 文件 → 提交到 GitHub
- [ ] 编写专业开源风格 README.md（项目结构、部署方法、技术栈）
- [ ] 提交到 GitHub ✅
