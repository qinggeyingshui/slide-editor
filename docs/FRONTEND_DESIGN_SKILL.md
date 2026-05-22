# 前端页面设计 Skill（让 AI 写出好看的前端）

> 综合小红书高赞帖（小盖2801⭐ / 生活自动挡2513⭐ / 远方的青鸟1751⭐ / 七七7725⭐ / Day07子圭1090⭐）+ 业界UI设计规范整理

---

## 一、核心原则：为什么 AI 写的前端总是"AI味"很重？

### 1.1 AI味的本质

| AI味特征 | 根因 | 解法 |
|---|---|---|
| 所有元素等间距排列 | AI默认均匀分布 | 建立视觉层级，主次分明 |
| 渐变色滥用 | 模型训练数据中渐变=高级 | 克制用色，单色系为主 |
| 圆角过大 | 默认border-radius过高 | 控制在8-12px，不超过16px |
| 阴影过重 | box-shadow值过大 | 用极淡阴影或无阴影 |
| 字体大小单一 | 缺乏字号阶梯意识 | 建立3-4级字号体系 |
| 内容假/空 | 用Lorem ipsum | 用真实内容填充 |
| 动画过多 | 每个元素都加动画 | 只在关键交互点加微动画 |
| 配色花哨 | 用了太多颜色 | 全页不超过3种颜色 |

### 1.2 反AI味黄金法则

```
❌ 禁止：渐变背景 + 大圆角 + 重阴影 + 多色混搭 + 全员动画
✅ 追求：大留白 + 强对比 + 克制用色 + 真实内容 + 精准动效
```

---

## 二、与 AI 协作的正确方法论（来源：小盖+远方的青鸟）

### 2.1 先画骨架，再写 Prompt

**不要直接告诉 AI "做一个好看的网页"。** AI 不是你心里的蛔虫。

正确流程：
1. 用 Excalidraw / 纸笔画出页面骨架（方块+文字位置）
2. 导出截图，告诉 AI：「严格按照这个结构来实现」
3. AI 在"复制结构"方面远比"自由创作"擅长

> "很多时候页面难看不是细节问题，而是一开始骨架就错了" —— 小盖

### 2.2 给具体参考，不用抽象形容词

| ❌ 模糊指令 | ✅ 具体指令 |
|---|---|
| "做得高级一点" | "参考 Linear.app 的设计风格，深色背景+低饱和蓝色强调" |
| "简洁大气" | "留白占60%，只用黑白+一个强调色，标题48px粗体" |
| "现代感" | "使用 Inter 字体，8px圆角，1px细边框，无阴影" |
| "好看点" | "参考这个截图的配色和间距"（附截图） |
| "科技感" | "深色渐变背景(#0a0a0f→#1a1a2e)，等宽字体做数据，蓝色光晕点缀" |

### 2.3 截图驱动开发

去这些地方找参考：
- **Dribbble** — 视觉设计灵感
- **Mobbin** — 移动端真实产品截图
- **Landingfolio** — 落地页设计集合
- **Awwwards** — 获奖网站
- **Refero.design** — 按组件分类的参考库

截取你想要的具体部分（导航栏/卡片/Hero区），贴给 AI 说「照这个风格做」。

### 2.4 一次只做一个组件

❌ "帮我做一个完整的SaaS官网"
✅ "先做Hero区：左边标题+副标题+按钮，右边产品截图，参考Linear首页"

分模块开发 → 每个模块截图确认 → 再组合

### 2.5 用真实内容，不要占位符

- 用真实的产品名、真实的数据、真实的用户头像
- "John Doe" 和 "Lorem ipsum" 会让整个页面看起来像模板
- 真实内容能暴露布局问题（文字过长/图片比例不对）

### 2.6 迭代而非重写

当某个部分不满意时：
- ✅ "把Hero区的按钮改成圆角更小的，颜色换成#2563EB"
- ❌ "重新做一个更好看的页面"

逐步微调 > 推倒重来。每次只改一个变量，才能找到问题所在。

---

## 三、字体系统（Web端）

### 3.1 字号阶梯（8px基准）

| 层级 | 用途 | 字号 | 行高 | 字重 |
|---|---|---|---|---|
| H1 | 页面主标题/Hero | 48-72px | 1.1 | 700-900 |
| H2 | 区块标题 | 32-40px | 1.2 | 600-700 |
| H3 | 卡片标题 | 24-28px | 1.3 | 600 |
| Body | 正文 | 16-18px | 1.5-1.6 | 400 |
| Caption | 辅助说明 | 12-14px | 1.4 | 400 |
| Overline | 标签/分类 | 11-12px | 1.3 | 500-600 |

### 3.2 字体选择推荐

**英文：**
- 无衬线（现代）：Inter / Plus Jakarta Sans / Geist
- 衬线（高级）：Playfair Display / Fraunces
- 等宽（技术）：JetBrains Mono / Fira Code

**中文：**
- 无衬线：思源黑体 / 苹方 / HarmonyOS Sans
- 衬线：思源宋体 / 霞鹜文楷

### 3.3 字体使用规则

```css
/* 黄金组合：最多2种字体 */
--font-heading: 'Plus Jakarta Sans', sans-serif;
--font-body: 'Inter', sans-serif;

/* 中文场景 */
--font-cn-heading: 'HarmonyOS Sans SC', sans-serif;
--font-cn-body: 'Source Han Sans SC', sans-serif;
```

---

## 四、间距系统（来源：七七7725⭐ + 业界规范）

### 4.1 8px网格系统

所有间距必须是 **8的倍数**：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128

| 场景 | 推荐间距 |
|---|---|
| 元素内部padding | 8-16px |
| 相关元素间距 | 8-16px |
| 卡片内padding | 16-24px |
| 区块间距（section间） | 64-128px |
| 页面边距（桌面） | 80-120px |
| 页面边距（移动） | 16-24px |

### 4.2 留白的力量

> "高级感 = 大留白。" 内容只占页面 60%，剩余 40% 是呼吸空间。

```
❌ 塞满型：每个像素都有内容 → 廉价感
✅ 呼吸型：关键内容周围大量留白 → 高级感
```

---

## 五、配色系统

### 5.1 色彩数量控制

**黄金法则：全页不超过 3 种颜色**

| 角色 | 占比 | 示例 |
|---|---|---|
| 主色（背景/大面积） | 60% | 白色/#FAFAFA/深色 |
| 辅色（文字/结构） | 30% | #1a1a1a / #374151 |
| 强调色（CTA/重点） | 10% | #2563EB / #7C3AED |

### 5.2 经典配色方案

```css
/* 1. 极简白（最安全） */
--bg: #FFFFFF; --text: #1a1a1a; --accent: #2563EB;

/* 2. 暖白（柔和高级） */
--bg: #FEFCF9; --text: #292524; --accent: #D97706;

/* 3. 冷灰（科技感） */
--bg: #F8FAFC; --text: #0F172A; --accent: #6366F1;

/* 4. 深色模式（专业） */
--bg: #0A0A0F; --text: #E2E8F0; --accent: #38BDF8;

/* 5. 奶油色（温暖） */
--bg: #FDF6E3; --text: #3D3D3D; --accent: #E07A5F;
```

### 5.3 配色禁忌

- ❌ 纯黑(#000000)做文字 → 用 #1a1a1a 或 #0F172A
- ❌ 纯白(#FFFFFF)做背景配纯黑文字 → 对比度过高刺眼
- ❌ 高饱和度大面积使用 → 用低饱和版本
- ❌ 多种强调色同时出现 → 只用一种
- ❌ 渐变色做背景（AI味重灾区）→ 纯色或极微渐变

---

## 六、组件库推荐（来源：小盖+远方的青鸟）

### 6.1 基础组件库（必装）

| 库名 | 特点 | 适合场景 |
|---|---|---|
| **shadcn/ui** | 可复制代码，不是npm包，完全可定制 | 所有项目首选 |
| **Radix UI** | 无样式原语，自己控制外观 | 需要完全自定义 |
| **Headless UI** | Tailwind官方，无样式 | Tailwind项目 |

### 6.2 高级动效/视觉库（加分项）

| 库名 | 特点 | 用途 |
|---|---|---|
| **Aceternity UI** | 炫酷动效组件集合 | Hero区/展示页 |
| **Magic UI** | 精美动画组件 | Landing Page |
| **Framer Motion** | React动画库 | 任何需要动画的地方 |
| **GSAP** | 专业级动画引擎 | 复杂滚动动画 |
| **Lottie** | JSON动画播放 | 图标/插画动画 |

### 6.3 使用原则

```
1. 先用 shadcn/ui 搭好基础结构
2. 在关键展示区（Hero/Feature）加入 Aceternity/Magic UI 的动效组件
3. 用 Framer Motion 做页面过渡和微交互
4. 不要每个组件都加动画——克制是高级感的核心
```

---

## 七、布局模式（来源：生活自动挡 + 业界最佳实践）

### 7.1 经典布局公式

**Landing Page 万能结构：**
```
Hero（标题+副标题+CTA+视觉）
  ↓ 64-128px间距
Logo Bar（合作品牌）
  ↓
Feature Grid（3-4列特性卡片）
  ↓
Bento Grid（便当盒不规则网格）
  ↓
Testimonials（用户评价）
  ↓
Pricing（定价卡片）
  ↓
CTA Section（最终号召）
  ↓
Footer
```

### 7.2 便当盒布局（Bento Grid）

2024-2025最流行的布局方式，Apple/Linear/Vercel都在用：

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 16px;
}
/* 大卡片占2x2，小卡片占1x1，形成不规则但有序的视觉 */
.bento-large { grid-column: span 2; grid-row: span 2; }
.bento-wide { grid-column: span 2; }
.bento-tall { grid-row: span 2; }
```

### 7.3 视觉效果技巧（来源：生活自动挡2513⭐）

| 效果名称 | CSS实现 | 适用场景 |
|---|---|---|
| **玻璃拟态** | `backdrop-filter: blur(12px); background: rgba(255,255,255,0.7);` | 卡片/导航栏 |
| **柔和阴影** | `box-shadow: 0 4px 24px rgba(0,0,0,0.06);` | 卡片悬浮 |
| **细边框** | `border: 1px solid rgba(0,0,0,0.06);` | 区域分隔 |
| **渐变文字** | `background: linear-gradient(...); -webkit-background-clip: text;` | 标题强调 |
| **光晕效果** | `box-shadow: 0 0 60px rgba(99,102,241,0.3);` | 按钮/重点 |
| **噪点纹理** | `background-image: url(noise.svg); opacity:0.03;` | 背景质感 |

---

## 八、动效规范（来源：远方的青鸟 "加微动画"）

### 8.1 动效黄金法则

```
1. 只在用户交互时触发动画（hover/click/scroll进入）
2. 时长控制在 150-400ms（太快看不到，太慢拖沓）
3. 使用 ease-out 或 cubic-bezier(0.16, 1, 0.3, 1) 缓动
4. 同一页面最多 3 种不同动画类型
5. 首屏加载动画 ≤ 1秒完成
```

### 8.2 推荐微动画

```css
/* 1. 按钮hover：微上移+阴影加深 */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* 2. 卡片hover：微放大 */
.card:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-out;
}

/* 3. 滚动进入：从下方淡入 */
.fade-up {
  opacity: 0; transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up.visible { opacity: 1; transform: translateY(0); }

/* 4. 文字逐字出现 */
.stagger-text span {
  opacity: 0; animation: fadeIn 0.4s forwards;
  animation-delay: calc(var(--i) * 0.05s);
}
```

### 8.3 动效禁忌

- ❌ 所有元素同时动 → 只让重点元素动
- ❌ 无限循环动画 → 触发一次即可
- ❌ 大幅度位移(>50px) → 微位移(10-20px)
- ❌ 弹跳效果(bounce) → AI味重灾区

---

## 九、给 AI 的 System Prompt 模板

### 9.1 通用前端设计 Prompt

```markdown
你是一个高级前端设计师。请根据需求生成 React/HTML 代码。

## 设计规则（必须遵守）
1. 使用 8px 网格系统，所有间距为 8 的倍数
2. 全页最多 3 种颜色：主色60% + 辅色30% + 强调色10%
3. 字号阶梯：标题48px / 副标题24px / 正文16px / 注释12px
4. 留白 ≥ 40%，section间距 64-128px
5. 圆角统一 8-12px，不超过 16px
6. 阴影极淡：0 4px 24px rgba(0,0,0,0.06)
7. 动画只在 hover/scroll进入 时触发，时长 200-400ms
8. 使用 Inter/Plus Jakarta Sans 字体
9. 按钮、卡片有 hover 状态（微上移+阴影变化）
10. 移动端优先，响应式断点：640/768/1024/1280px

## 禁止事项
- 禁止渐变色做大面积背景
- 禁止 border-radius > 16px
- 禁止 box-shadow 过重（rgba alpha > 0.15）
- 禁止使用 Lorem ipsum，用真实内容
- 禁止所有元素同时有动画
- 禁止纯黑(#000)文字或纯白(#FFF)背景
```

### 9.2 风格快捷指令

| 一句话指令 | 效果 |
|---|---|
| "Linear风格" | 深色+低饱和蓝+细边框+微光效 |
| "Vercel风格" | 纯黑白+极简+大字+无装饰 |
| "Stripe风格" | 白底+渐变色标题+精致插图+网格 |
| "Apple风格" | 大留白+产品居中+极简文案+动态滚动 |
| "Notion风格" | 暖白底+圆润图标+柔和阴影+内容密集 |
| "Figma风格" | 紫色强调+深色侧栏+工具感+精致图标 |

---

## 十、质检清单

### 10.1 必过项（不过则重做）

- [ ] 颜色不超过3种（含黑白灰）
- [ ] 间距全部是8的倍数
- [ ] 字号有明确层级（至少3级）
- [ ] 留白 ≥ 40%
- [ ] 无纯黑文字/纯白背景的刺眼组合
- [ ] 移动端可正常浏览
- [ ] 无 Lorem ipsum 占位文字
- [ ] 按钮/链接有 hover 状态

### 10.2 加分项

- [ ] 有微动画（scroll进入/hover反馈）
- [ ] 使用了便当盒布局或不对称网格
- [ ] 有视觉焦点（一个最大/最亮的元素）
- [ ] 图片有统一的圆角和阴影处理
- [ ] 深色/浅色模式都考虑了

---

*本Skill整合自：小盖(2801⭐) · 生活自动挡(2513⭐) · 远方的青鸟(1751⭐) · 七七(7725⭐) · Day07子圭(1090⭐) 等小红书高赞前端设计帖 + 业界UI设计规范。*


---

## 十一、Skill 库精华补充（来源：GitHub 105K Skill 库 Top Skills）

> 以下内容提取自 dicklesworthstone/frontend-design (0.80⭐) + diegosouzapw/frontend-design-2 (0.81⭐) 两个评分最高的开源 Agent Skill，筛选出**与前十节不重复的高价值增量**。

---

### 11.1 反 AI Slop 美学（Anti-Generic AI Aesthetics）

**核心哲学**：AI 默认生成的界面是「所有训练数据的平均值」，因此天然平庸。要做出好看的前端，必须做出**极端选择**。

**关键策略——选择一个极端方向并贯彻到底：**

| 方向 | 关键词 | 代表风格 |
|---|---|---|
| Brutally Minimal | 大量留白、极少元素、单色 | Apple、Dieter Rams |
| Maximalist Chaos | 堆叠、碰撞、不规则网格 | 90年代杂志、Y2K |
| Retro-Futuristic | CRT屏幕感、赛博霓虹 | Blade Runner |
| Organic/Natural | 手绘线条、纸质纹理、暖色 | 独立咖啡馆 |
| Luxury/Refined | 衬线字体、金色点缀、暗色 | Cartier官网 |
| Editorial/Magazine | 大字重排版、不对称栅格 | NYT Interactive |
| Brutalist/Raw | 系统字体、无装饰、功能暴露 | Craigslist but cool |
| Industrial/Utilitarian | 等宽字体、数据面板感 | 控制室 |

> "Bold maximalism and refined minimalism both work - the key is **intentionality, not intensity**."

### 11.2 Design Thinking 流程（编码前必做）

**编码前的5步设计思考：**

```
1. Mood Board → 收集3-5个参考网站截图
2. Design Token → 确定颜色/字体/间距/圆角的具体数值
3. Component Inventory → 列出页面需要的所有组件
4. Layout Wireframe → 用线框确定信息层级
5. Interaction Map → 标注哪些元素需要动画/hover效果
```

### 11.3 高级配色技巧（补充第五节）

**来自 dicklesworthstone skill 的 metric-based 规则：**

```
色彩对比度硬性要求：
- 正文文字 vs 背景：WCAG AA ≥ 4.5:1
- 大标题 vs 背景：≥ 3:1
- 交互元素(按钮/链接)：≥ 3:1

高级配色手法：
- 用 HSL 而非 HEX 思考颜色（更容易调和谐）
- 同色相不同明度 = 安全的层次感
- 强调色面积 < 5% 时最有冲击力
- 深色模式不是简单反转，是降低对比度+暖化阴影
```

**深色模式专用规则：**
```css
/* 不要用纯黑 #000，用深灰 */
--bg-dark: hsl(220, 13%, 10%);  /* 带一点蓝调的深灰 */
--surface-dark: hsl(220, 13%, 14%);
--text-dark: hsl(220, 13%, 90%);  /* 不要纯白，用浅灰 */
--border-dark: hsl(220, 13%, 20%);

/* 阴影在深色模式下用更深的黑+更大扩散 */
--shadow-dark: 0 8px 32px rgba(0, 0, 0, 0.4);
```

### 11.4 字体配对进阶（补充第三节）

**来自 diegosouzapw skill 的完整字体推荐：**

| 类别 | 推荐字体 |
|---|---|
| Sans-serif | Inter, Plus Jakarta Sans, Geist, DM Sans, Space Grotesk |
| Monospace | JetBrains Mono, Fira Code, Source Code Pro, Geist Mono |
| Serif | Merriweather, Playfair Display, Lora, Libre Baskerville |
| Display | Architects Daughter, Oxanium |

**字体配对公式：**

```
标题(Display/Serif) + 正文(Sans-serif) = 经典学术感
标题(Sans-serif Bold) + 正文(Sans-serif Regular) = 现代科技感
标题(Monospace) + 正文(Sans-serif) = 开发者/工具感
全站统一(Inter/Geist) = 安全牌，永远不出错
```

### 11.5 阴影与层次系统

**来自 diegosouzapw skill 的4层阴影体系：**

```css
/* 阴影阶梯 - 从低到高 */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);    /* 卡片默认 */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.06);    /* 悬浮卡片 */
--shadow-md: 0 4px 16px rgba(0,0,0,0.08);   /* 弹窗/下拉 */
--shadow-lg: 0 8px 32px rgba(0,0,0,0.12);   /* Modal/Toast */

/* 彩色阴影 - 用主色调的淡版本做阴影 */
--shadow-brand: 0 4px 14px rgba(var(--primary-rgb), 0.25);
/* 用在CTA按钮上，比灰色阴影更有品牌感 */

/* 内阴影 - 制造凹陷/输入框效果 */
--shadow-inset: inset 0 2px 4px rgba(0,0,0,0.06);
```

### 11.6 高级实现模式（来自 dicklesworthstone skill）

**渐变边框（比 border 高级10倍）：**
```css
.gradient-border {
  background: linear-gradient(var(--bg), var(--bg)) padding-box,
              linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
  border: 1px solid transparent;
  border-radius: 12px;
}
```

**文字渐变（标题杀手锏）：**
```css
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Noise Texture 底噪（去除纯色的数字感）：**
```css
.noise-bg {
  position: relative;
}
.noise-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,...") repeat;
  opacity: 0.03;  /* 极淡，只增加质感 */
  pointer-events: none;
}
```


### 11.7 响应式设计硬规则

**来自 thebushidocollective/tailwind-responsive-design skill：**

```
断点策略（Mobile First）：
- sm: 640px  → 手机横屏
- md: 768px  → 平板
- lg: 1024px → 笔记本
- xl: 1280px → 桌面
- 2xl: 1536px → 大屏

关键规则：
1. 容器最大宽度 max-w-7xl (1280px)，两侧 padding
2. 网格列数随断点变化：1→2→3→4
3. 字号用 clamp()：clamp(1rem, 2.5vw, 1.5rem)
4. 间距用 rem 不用 px（随字号缩放）
5. 图片必须有 aspect-ratio 防止布局抖动
6. 触摸目标最小 44x44px（移动端）
```

### 11.8 性能与感知速度

```
加载性能直接影响用户对"好看"的感知：
- 首屏必须 < 1.5s 可交互
- 字体用 font-display: swap 防闪烁
- 图片用 loading="lazy" + 占位色块/blur
- 动画用 transform/opacity（GPU加速），避免触发layout
- 大背景图用 WebP/AVIF，控制在 200KB 以内
- 骨架屏(Skeleton) > 空白等待 > Loading Spinner
```

---

### 11.9 汇总：Skill 库 vs 小红书帖子的互补关系

| 维度 | 小红书帖子(1-10节) | Skill库(第11节) |
|---|---|---|
| **定位** | 实操经验、避坑指南 | 系统性规范、代码实现 |
| **配色** | 5套现成方案 + 禁忌 | WCAG对比度标准 + HSL方法论 |
| **字体** | 推荐列表 + 中英搭配 | 配对公式 + 完整分类 |
| **布局** | 便当盒 + Landing结构 | 响应式断点 + 容器策略 |
| **动效** | 4种推荐微动画 | GPU加速 + 性能约束 |
| **风格** | 反AI味8特征 | 8种极端方向 + 选择哲学 |
| **深色模式** | 未涉及 | 完整HSL方案 |
| **阴影** | 极淡单层 | 4层阶梯 + 彩色阴影 |
| **高级CSS** | 玻璃拟态/视差 | 渐变边框/文字渐变/Noise |

---

*第11节来源：GitHub Agent Skill库 105K+ Skills 中评分 Top 3 前端设计 Skill (dicklesworthstone · diegosouzapw · thebushidocollective)，与前十节小红书经验形成「感性+理性」互补。*
