# SkillsHub 设计方案头脑风暴

## 项目背景
SkillsHub 是一个对标 Hugging Face 的技能共享平台，共享 Skills（技能）、Contexts（语境/数据集）和 Playgrounds（演练场）。需要体现开发者社区、技术前沿、开放协作的气质。

---

<response>
<idea>

## 方案一：Neo-Terminal 终端美学

### Design Movement
受 Terminal/CLI 文化与赛博朋克美学启发，融合 Hacker News 的极简信息密度与 GitHub 的专业感。

### Core Principles
1. **信息优先**：高密度信息展示，减少装饰性元素
2. **代码即美学**：等宽字体、终端配色、代码块作为视觉元素
3. **暗色沉浸**：深色背景为主，减少视觉疲劳
4. **层级分明**：通过亮度和色彩饱和度区分信息层级

### Color Philosophy
- 主色：Electric Green (#00FF41) — 终端绿，象征代码运行、活力
- 辅色：Cyan (#00D4FF) — 数据流动、连接
- 背景：Deep Black (#0D1117) 到 Dark Gray (#161B22)
- 警告/热门：Amber (#FFB000)

### Layout Paradigm
左侧固定侧边栏导航 + 右侧内容区，模拟 IDE 布局

### Signature Elements
- 闪烁光标动画
- 终端风格的卡片边框（虚线/点阵）
- ASCII art 装饰

### Interaction Philosophy
键盘快捷键优先，命令面板（Cmd+K）交互

### Animation
打字机效果、光标闪烁、矩阵雨背景微动画

### Typography System
- 标题：JetBrains Mono Bold
- 正文：JetBrains Mono Regular
- 辅助：IBM Plex Sans

</idea>
<probability>0.05</probability>
<text>极客终端风格，适合硬核开发者但可能门槛较高</text>
</response>

<response>
<idea>

## 方案二：Bauhaus Industrial 工业包豪斯

### Design Movement
受包豪斯运动与 Swiss Design 启发，强调功能主义、几何纯粹性和网格系统的力量。融合现代 SaaS 平台的专业感。

### Core Principles
1. **功能决定形式**：每个视觉元素都服务于功能目的
2. **几何秩序**：严格的网格系统、对齐和比例关系
3. **对比张力**：大面积留白与密集信息区域形成节奏
4. **色彩克制**：有限的色彩调色板，每种颜色有明确语义

### Color Philosophy
- 主色：Vivid Coral (#FF6B4A) — 温暖、活力、创造力，区别于科技蓝的冷感
- 辅色：Deep Indigo (#1E1B4B) — 深邃、专业、可信赖
- 中性色：Warm Gray 系列 (#F5F3F0 → #2D2A26)
- 强调色：Electric Teal (#14B8A6) — 用于成功状态和互动反馈

### Layout Paradigm
**不对称网格系统**：打破传统居中布局，使用 12 列不对称网格。Hero 区域采用 7:5 分割，内容区域使用交错的卡片瀑布流。侧边留出"呼吸空间"，让内容自然流动而非被框架束缚。

### Signature Elements
1. **几何装饰线条**：细线条在页面间穿梭，连接不同区块，暗示"技能连接"
2. **色块标签系统**：每种技能类型用独特的几何色块标识（圆形=Prompt，三角=Agent，方形=Tool）
3. **动态网格背景**：极淡的点阵网格随滚动微妙变化

### Interaction Philosophy
精确而克制的交互：hover 时元素微移（2-4px），点击时短促的缩放反馈。所有过渡都是线性的，体现机械精确感。

### Animation
- 页面进入：元素从网格交叉点向外扩展
- 滚动：视差效果仅用于装饰线条，内容保持稳定
- 卡片 hover：边框从一侧滑入，背景色微变
- 数字计数器：机械翻牌效果

### Typography System
- 显示标题：Space Grotesk Bold (几何无衬线，包豪斯气质)
- 正文标题：Space Grotesk Medium
- 正文：DM Sans Regular (高可读性)
- 代码/数据：IBM Plex Mono

</idea>
<probability>0.08</probability>
<text>工业包豪斯风格，专业而独特，几何美学与功能主义的完美结合</text>
</response>

<response>
<idea>

## 方案三：Luminous Depth 光影深度

### Design Movement
受 Apple Design Language 与 Glassmorphism 2.0 启发，融合微软 Fluent Design 的深度系统。追求"数字物理感"——让界面元素仿佛有真实的光照和材质。

### Core Principles
1. **光影叙事**：通过光源方向和阴影深度传达层级关系
2. **材质真实**：毛玻璃、微妙纹理、渐变让界面有触感
3. **空间深度**：前景-中景-背景的三层空间系统
4. **优雅过渡**：所有状态变化都有流畅的动画衔接

### Color Philosophy
- 主色：Royal Blue (#3B5BDB) → Violet (#7048E8) 渐变 — 科技感与创造力
- 辅色：Warm Amber (#F59F00) — 社区温度、活跃度
- 背景：从 #FAFBFC（浅模式）到 #0F0F23（深模式）
- 玻璃效果：白色 8-15% 透明度叠加

### Layout Paradigm
**浮动卡片系统**：内容以不同高度的浮动卡片呈现，通过阴影深度暗示重要性。首页采用全宽 Hero + 错落有致的卡片网格，避免死板的等分布局。

### Signature Elements
1. **光晕效果**：鼠标移动时，附近元素产生微妙的光晕响应
2. **毛玻璃导航栏**：固定顶部导航带有背景模糊效果
3. **渐变边框**：重要卡片使用彩色渐变边框

### Interaction Philosophy
流体响应：元素像水面一样对交互产生涟漪反应。hover 产生光晕，click 产生波纹，scroll 产生视差。

### Animation
- 入场：元素从模糊到清晰，从远到近
- hover：光晕扩散 + 微妙上浮（translateY -2px）
- 页面切换：淡入淡出 + 微缩放
- 加载：骨架屏带有光泽扫过效果

### Typography System
- 显示标题：Plus Jakarta Sans ExtraBold
- 正文标题：Plus Jakarta Sans SemiBold
- 正文：Plus Jakarta Sans Regular
- 代码：Fira Code

</idea>
<probability>0.07</probability>
<text>光影深度风格，Apple 级别的精致感，适合追求高端体验的平台</text>
</response>

---

## 最终选择：方案二 - Bauhaus Industrial 工业包豪斯

选择理由：
1. 与 Hugging Face 的黄色暖色调形成差异化，同时保持专业感
2. 不对称网格布局打破常规，让 SkillsHub 在视觉上独树一帜
3. Coral + Indigo 的配色方案既温暖又专业，适合开发者社区
4. 几何标签系统为不同技能类型提供了直观的视觉区分
5. Space Grotesk 字体完美契合包豪斯的几何美学
