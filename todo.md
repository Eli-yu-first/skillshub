# New Feature Requests - Round 5 (商业化与高级系统升级)

## 商业化与计费系统 (Monetization & Billing)
- [x] 分级订阅系统 (Free / Pro / Enterprise)，集成 Stripe 或国内支付渠道 (微信/支付宝) 预留了库表结构。
- [x] 额度包与 Token 计费 (Pay-as-you-go)：为使用内置 LLM (Manus Forge) 的用户提供基于消耗的计费体系及扣费逻辑落库。
- [ ] 创作者经济 (Creator Economy)：支持高级技能 (Premium Skills) 的付费订阅或者按次调用收费，为创作者提供收益分成。
- [ ] 企业级私有化部署支持：支持自托管企业集群，以及对应的 SSO (SAML/OIDC) 单点登录集成。

## 安全性与合规性 (Security & Compliance)
- [x] 接口限流与防刷机制 (Rate Limiting & DDoS Protection)：引入滑动窗口限流器限制核心 API 请求频率，防止恶意调用和爬虫。
- [ ] 代码沙盒执行 (Sandbox Execution)：如赋予技能自定义代码环境，需在高度隔离的 WebAssembly/Docker 容器中安全运行。
- [ ] 数据隐私合规支持：完善平台隐私政策，支持用户自助下载所有个人数据档案，并提供符合 GDPR/CCPA 规范的一键账号注销与数据清除功能。
- [ ] 敏感数据加密保护：对数据库层面的高敏信息 (API Keys 等) 实施非对称加密存储 (AWS KMS 等)。


## 架构优化与高可用 (Architecture & Scalability)
- [x] 缓存架构引入 (Cache Layer)：使用自带内存驱逐引擎 / Redis 缓存热门技能列表、详情接口、全站大屏，显著降低 MySQL (TiDB) 的热点查询压力。
- [ ] 异步任务调度与消息队列：引入 RabbitMQ/BullMQ 等消息中间件，安全处理发信、定时同步、批处理数据分析等耗时任务。
- [ ] 微服务化与可扩展设计：为应对激增的 LLM Token 推理流量，考虑将 Agent Runtime 模块独立为微服务进行单独扩容。
- [ ] 企业级 CI/CD 自动化部署：配置 GitHub Actions / GitLab CI 流水线，实现自动化并行 Lint 校验、Vitest 单元/E2E 测试与 Docker 镜像自动构建发布。
- [ ] 基础设施即代码 (IaC)：提供完整的 Terraform 或 Kubernetes Helm Charts，支持一键在公有云 (AWS/阿里云) 搭建高可用集群环境。

## 用户体验与平台专业性 (UX & Professionalism)
- [ ] 全局国际化多语言支持 (i18n)：初步提供英文 (en-US) 和中文 (zh-CN) 切换体系，深度满足全球化商业运作与海外用户诉求。
- [ ] 新手交互漫游指南 (Onboarding Tour)：使用如 `driver.js` 为新注册用户提供沉浸式的核心功能互动式分布引导。
- [ ] 平台级实时消息系统：引入 WebSocket (Socket.io) 架构，实现技能被 Fork、回复评论、点赞通知的无延迟展现。
- [ ] 开发者生态建设与开放 API：自动生成实时更新的 OpenAPI (Swagger) 文档规范，并分发官方 Node.js / Python SDK，方便第三方业务线深度集成调用。
- [x] 骨架屏 (Skeleton Screens) 与优雅降级：主站核心位已完善资源异步加载时的骨架屏占位动画，提供优雅的数据获取交互反馈。

## 高级 AI 核心特性演进 (Advanced AI Features)
- [ ] 多模态上下文支持 (Multimodal)：Agent 运行与对话功能中强化图片上传解析处理、语音输入转录、以及大型文档上传分析能力。
- [ ] 升级版 RAG 与向量数据库原生集成：内置 Qdrant 或 Milvus，针对用户上传的超大型 Contexts 数据集进行高效向量检索关联。
- [ ] Prompt 提示工程测试控制台 (A/B Testing Playground)：为专业的技能创作者提供支持历史对话重访测试、并列评估双模 Prompt 效果的极客面板。
- [ ] 智能数据大屏与可观测性分析：集成 Sentry 跟踪细粒度报错，并利用 Datadog/Prometheus 配合 Grafana 输出实时的模型响应延迟、使用走势图与系统健康度指标报告。

# New Feature Requests - Round 6 (Skills 系统全链路优化与外部生态接入)

## Skills 生命周期闭环与管理优化 (Skills Closed-loop Management)
- [x] 优化 Skills 的创建、存储、更新与管理流程，彻底打通“开发 -> 审核 -> 上架 -> 调用”的业务全链路，确保所有功能的可用性与商业闭环。

## 技能详情页深度完善 (Skills Detail Page Enhancements)
- [x] 完善 `README` Tab：支持复杂 Markdown 和各类多媒体格式。
- [x] 完善 `Files` Tab：精确模仿 `https://github.com/anthropics/skills/tree/main/skills` 的结构目录标准来组织和展示所有技能的描述文件体系。
- [x] 完善 `Community` Tab：搭建优质的问答与开发者讨论专区。
- [x] 完善 `History` Tab：清晰的 Git-like 版本历史与变更溯源。
- [x] 完善 `Inference API` Tab：提供标准化的快速调用代码片段展示页（如 cURL, Python 示例等）。

## 外部优质 Skills 生态接入 (External Skills Integration)
- [x] 批量解析与迁移以下主流开源 AI 平台的优质 Skills 资产至本地的 `skills-repository`：
  - OpenAI Skills (https://github.com/openai/skills)
  - Anthropics Skills (https://github.com/anthropics/skills)
  - Vercel Labs Skills (https://github.com/vercel-labs/skills)
  - Hugging Face Skills (https://github.com/huggingface/skills)
  - Awesome OpenClaw Skills (https://github.com/VoltAgent/awesome-openclaw-skills/tree/main/categories)
  - Obra Superpowers (https://github.com/obra/superpowers)
