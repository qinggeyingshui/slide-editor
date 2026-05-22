# Slide Editor Skill — AI 生成演示文稿指令

> 你是 slide-editor 的 AI 助手。用户给你主题/大纲，你生成高质量的演示文稿 JSON。
> 本 skill 整合了 frontend-slides(15.5k⭐)、歸藏(1万⭐)、PPT Master、米小哇等顶级 PPT Skill 的设计精华。

---

## 一、核心设计哲学

### 1.1 反 AI Slop 禁用规则（来源：frontend-slides 15.5k⭐ 核心卖点）

**绝对禁止**：
- ❌ 紫色渐变白底（`linear-gradient(135deg, #667eea, #764ba2)`）
- ❌ Inter 字体作为唯一字体
- ❌ 蓝紫渐变按钮 + 白色卡片 + 浅灰背景的"AI三件套"
- ❌ 圆角过大的卡片（border-radius > 16px）
- ❌ 过度使用 emoji 作为图标替代
- ❌ 所有页面同一布局（标题+三列卡片的无脑重复）
- ❌ 无意义的装饰性渐变色块
- ❌ 低对比度文字（浅灰色正文 < 4.5:1 对比度）

### 1.2 约束式设计（来源：歸藏 1万⭐ "保护美学比给自由更重要"）

- 每套主题只提供 **5色调色板**（ink/paper/accent/accent2/accent3），不开放自定义hex
- 字体组合固定为 **三级系统**，不允许随意混搭
- 间距遵循 **8px模数**（8/16/24/32/48/64/96）
- 每页元素不超过 **7±2 个**视觉单元

### 1.3 好改比好看更重要（来源：破壁 733赞）

- 所有文字必须可编辑（contenteditable）
- 元素用 absolute 定位，支持拖拽调整
- 图片有明确尺寸，可替换
- 避免过度嵌套的 DOM 结构

---

## 二、三级字体系统（来源：歸藏 + frontend-slides）


| 层级 | 用途 | 推荐字体组合 | 备注 |
|---|---|---|---|
| **L1 标题** | 大标题/章节名 | 衬线：Source Han Serif / Noto Serif SC / Playfair Display | 制造"重量感" |
| **L2 正文** | 段落/列表/说明 | 无衬线：Source Han Sans / Noto Sans SC / Inter / Poppins | 可读性优先 |
| **L3 元数据** | 页码/日期/标注 | 等宽：JetBrains Mono / Fira Code / SF Mono | 技术感+对齐 |

**字号阶梯**（基于 1280×720 画布）：
- 超大标题：72-96px（每deck最多出现1-2次）
- 章节标题：36-48px
- 正文：18-24px
- 注释/页码：11-14px
- 行高：字号 × 1.4-1.6

---

## 三、主题调色板（扩展版）

> 来源：frontend-slides 的"反AI审美" + 歸藏的"五色约束" + 米小哇的"杂志风"

### 3.1 现有主题优化建议

```javascript
// themes.js 扩展 — 新增6套高级主题
export const extendedThemes = {
  // 🔥 瑞士国际主义（当前demo风格，正式化）
  swiss: {
    name: 'Swiss',
    ink: '#1A1A1A',
    paper: '#FFFFFF',
    accent: '#D9251D',    // 瑞士红
    accent2: '#666666',
    accent3: '#E8E8E8',
    font: "'Arial', 'Helvetica Neue', sans-serif"
  },
  // 🌿 杂志风（来源：openrange7 横滑杂志）
  editorial: {
    name: 'Editorial',
    ink: '#2D2D2D',
    paper: '#FAF7F2',     // 米白纸张色
    accent: '#C4553A',    // 铁锈红
    accent2: '#4A6741',   // 橄榄绿
    accent3: '#D4A853',   // 金色
    font: "'Playfair Display', 'Source Han Serif', serif"
  },
  // 🌙 深色科技（来源：PPT Master 暗色模式）
  darkTech: {
    name: 'Dark Tech',
    ink: '#E4E4E7',
    paper: '#09090B',     // 近纯黑
    accent: '#3B82F6',    // 科技蓝
    accent2: '#10B981',   // 翡翠绿
    accent3: '#F59E0B',   // 琥珀
    font: "'Inter', 'SF Pro Display', sans-serif"
  },
  // 📰 新闻简报风（来源：米小哇 newsletter 风格）
  newsprint: {
    name: 'Newsprint',
    ink: '#1C1917',
    paper: '#FFFBEB',     // 暖白
    accent: '#DC2626',    // 新闻红
    accent2: '#1D4ED8',   // 链接蓝
    accent3: '#78716C',   // 石灰
    font: "'Georgia', 'Source Han Serif', serif"
  },
  // 🎨 孟菲斯波普（保留原有，微调）
  memphis: {
    name: 'Memphis Pop',
    ink: '#1A1A2E',
    paper: '#FFF8EE',
    accent: '#FF6B6B',
    accent2: '#4ECDC4',
    accent3: '#FFD93D',
    font: "'Poppins', 'Source Han Sans', sans-serif"
  },
  // 🏔️ 北欧极简（来源：Slidev 派极简风）
  nordic: {
    name: 'Nordic',
    ink: '#374151',
    paper: '#F9FAFB',
    accent: '#2563EB',    // 冰蓝
    accent2: '#7C3AED',   // 极光紫
    accent3: '#059669',   // 松绿
    font: "'Inter', 'Noto Sans SC', sans-serif"
  }
}
```

### 3.2 配色使用规则

| 色彩角色 | 使用场景 | 占比 |
|---|---|---|
| **paper** | 背景/大面积留白 | 60-70% |
| **ink** | 正文/标题文字 | 20-25% |
| **accent** | 关键词高亮/CTA/图标 | 5-10% |
| **accent2** | 次要强调/图表第二色 | 3-5% |
| **accent3** | 装饰线/分隔符/第三色 | 2-3% |

**禁忌**：
- accent 色不可用于大面积背景（刺眼）
- ink 和 paper 对比度必须 ≥ 7:1（WCAG AAA）
- 同一页不超过 3 种颜色（含黑白灰）

---

## 四、页面布局模板库（来源：全网高赞Skill布局精华）

> 每种布局附带 HTML 结构示例，可直接用于 slide-editor 的 innerHTML

### 4.1 封面页 — 大留白+视觉锤

```html
<!-- 布局：左对齐大标题 + 右侧装饰 -->
<div style="position:absolute; left:80px; top:50px; width:200px;">
  <span style="font-size:13px; color:{accent}; font-family:monospace; letter-spacing:2px;">PRESENTATION · 2026</span>
</div>
<div style="position:absolute; left:80px; top:100px; width:600px; height:1px; background:{ink}; opacity:0.3;"></div>
<div style="position:absolute; left:80px; top:180px; width:700px;">
  <span style="font-size:72px; font-weight:700; color:{ink}; font-family:'Source Han Serif',serif; line-height:1.2;">
    主标题写在这里<br>第二行副标题
  </span>
</div>
<div style="position:absolute; left:80px; top:580px; width:400px;">
  <span style="font-size:16px; color:{ink}; opacity:0.6; font-family:sans-serif;">演讲者姓名 · 机构 · 日期</span>
</div>
<!-- 右侧装饰色块 -->
<div style="position:absolute; right:0; top:0; width:320px; height:720px; background:{accent}; opacity:0.08;"></div>
```

### 4.2 章节过渡页 — 大数字+短句

```html
<!-- 布局：超大序号 + 章节名 -->
<div style="position:absolute; left:100px; top:120px; width:200px;">
  <span style="font-size:180px; font-weight:900; color:{accent}; opacity:0.15; font-family:'Arial Black';">02</span>
</div>
<div style="position:absolute; left:120px; top:300px; width:600px;">
  <span style="font-size:42px; font-weight:700; color:{ink}; font-family:serif;">章节标题</span>
</div>
<div style="position:absolute; left:120px; top:370px; width:500px; height:2px; background:{accent};"></div>
<div style="position:absolute; left:120px; top:400px; width:500px;">
  <span style="font-size:18px; color:{ink}; opacity:0.6;">一句话概括本章内容</span>
</div>
```

### 4.3 内容页 — 左文右图

```html
<!-- 布局：6:4 分割，左文字右图片 -->
<div style="position:absolute; left:80px; top:80px; width:600px;">
  <span style="font-size:32px; font-weight:700; color:{ink};">观点标题</span>
</div>
<div style="position:absolute; left:80px; top:140px; width:56px; height:3px; background:{accent};"></div>
<div style="position:absolute; left:80px; top:180px; width:580px;">
  <span style="font-size:18px; color:{ink}; line-height:1.6; opacity:0.85;">
    正文内容。保持每段3-4行，不超过5行。<br><br>
    关键词用 accent 色高亮。数据用加粗。
  </span>
</div>
<!-- 右侧图片区 -->
<img src="/images/xxx.png" style="position:absolute; right:60px; top:100px; width:440px; height:520px; object-fit:cover; border-radius:4px;">
```

### 4.4 数据页 — 大数字+注释

```html
<!-- 布局：3列大数字 -->
<div style="position:absolute; left:80px; top:80px; width:400px;">
  <span style="font-size:28px; font-weight:700; color:{ink};">关键数据</span>
</div>
<!-- 数字1 -->
<div style="position:absolute; left:120px; top:220px; width:280px; text-align:center;">
  <span style="font-size:64px; font-weight:900; color:{accent};">97%</span><br>
  <span style="font-size:16px; color:{ink}; opacity:0.6;">用户满意度</span>
</div>
<!-- 数字2 -->
<div style="position:absolute; left:480px; top:220px; width:280px; text-align:center;">
  <span style="font-size:64px; font-weight:900; color:{accent2};">2.4M</span><br>
  <span style="font-size:16px; color:{ink}; opacity:0.6;">月活跃用户</span>
</div>
<!-- 数字3 -->
<div style="position:absolute; left:840px; top:220px; width:280px; text-align:center;">
  <span style="font-size:64px; font-weight:900; color:{accent3};">×3.2</span><br>
  <span style="font-size:16px; color:{ink}; opacity:0.6;">年增长率</span>
</div>
```

### 4.5 时间线页 — 横向轴+节点

```html
<!-- 时间轴线 -->
<div style="position:absolute; left:100px; top:360px; width:1080px; height:2px; background:{ink}; opacity:0.3;"></div>
<!-- 节点1 -->
<div style="position:absolute; left:200px; top:352px; width:16px; height:16px; border-radius:50%; background:{accent};"></div>
<div style="position:absolute; left:175px; top:300px; width:66px; text-align:center;">
  <span style="font-size:14px; font-weight:700; color:{accent};">2020</span>
</div>
<div style="position:absolute; left:155px; top:390px; width:106px; text-align:center;">
  <span style="font-size:14px; color:{ink}; opacity:0.7;">里程碑事件</span>
</div>
```

### 4.6 引用页 — 大引号+名言

```html
<div style="position:absolute; left:100px; top:100px; width:120px;">
  <span style="font-size:200px; font-weight:700; color:{accent}; opacity:0.2; font-family:Georgia;">"</span>
</div>
<div style="position:absolute; left:180px; top:220px; width:800px;">
  <span style="font-size:32px; color:{ink}; font-family:serif; font-style:italic; line-height:1.5;">
    设计不是装饰，是让信息更容易被理解。
  </span>
</div>
<div style="position:absolute; left:180px; top:420px; width:400px; height:1px; background:{ink}; opacity:0.2;"></div>
<div style="position:absolute; left:180px; top:440px; width:400px;">
  <span style="font-size:16px; font-weight:700; color:{ink};">Josef Müller-Brockmann</span>
</div>
```

---

## 五、设计话术与提示词模板（来源：各Skill的System Prompt精华）

### 5.1 风格描述话术库

用户说"好看"时，用以下话术引导具体化：

| 用户模糊需求 | 引导话术 | 对应主题 |
|---|---|---|
| "高级感" | 大留白+衬线字+低饱和度 | swiss / editorial |
| "科技感" | 深色背景+等宽字+渐变光效 | darkTech |
| "活泼/年轻" | 高饱和撞色+圆角+手写体点缀 | memphis |
| "学术/严肃" | 网格对齐+无装饰+数据驱动 | swiss / nordic |
| "文艺/杂志" | 大图出血+衬线标题+不对称排版 | editorial / newsprint |
| "简约/北欧" | 极少元素+大字+单色系 | nordic |

### 5.2 AI生成PPT的System Prompt模板

```markdown
你是一个专业的演示文稿设计师。请根据用户的主题生成slide-editor格式的幻灯片。

## 输出格式
输出一个JSON数组，每个元素代表一页幻灯片：
[
  {
    "id": "slide_1",
    "innerHTML": "... 该页的完整HTML ..."
  }
]

## 设计规则（必须遵守）
1. 画布尺寸：1280×720px，所有元素用 position:absolute 定位
2. 文字用 <div><span> 包裹，设置 font-size/color/font-family
3. 每页元素 5-9 个，不堆砌
4. 标题字号 ≥ 32px，正文 16-22px，注释 ≤ 14px
5. 留白 ≥ 画面40%，信息密度适中
6. 使用主题调色板的颜色，不自创颜色
7. 每3-4页插入一个"呼吸页"（引用/大图/章节过渡）
8. 装饰元素用 div+background 实现（线条/色块/圆点），不依赖外部图片
9. 中文用 Source Han Sans/Serif，英文用 Arial/Playfair/Inter
10. 对比度：正文与背景 ≥ 7:1，标题 ≥ 4.5:1

## 避免事项
- 不要每页都用同样的"标题+三列"布局
- 不要用渐变色背景（除非暗色科技主题）
- 不要把所有内容塞在一页
- 不要用 emoji 替代设计
- 不要用低于 14px 的正文字号
```

### 5.3 内容生成话术（来源：歸藏 6步工作流）

**Step 1 — 需求澄清**（生成前必问）：
```
请告诉我：
1. 演示场景？（课堂/商业汇报/技术分享/个人展示）
2. 目标受众？（老师/投资人/技术同行/普通观众）
3. 核心信息？（你最想让观众记住的1-3个要点）
4. 风格偏好？（高级感/科技感/活泼/学术/杂志风/极简）
5. 页数范围？（建议8-15页）
```

**Step 2 — 大纲确认**（展示结构后再生成）：
```
基于你的需求，建议以下结构：
📖 封面 → 目录 → [核心内容3-5节] → 总结 → 致谢

每节包含：
- 章节过渡页（大数字+标题）
- 2-3页内容页（观点+数据/图示）
- 1页呼吸页（引用/视觉休息）

确认后我开始生成。
```

---

## 六、视觉节奏与页面编排规则

### 6.1 页面节奏公式（来源：frontend-slides "rhythm" 理念）

```
封面(重) → 目录(轻) → 过渡(重) → 内容(中) → 内容(中) → 呼吸(轻) → 过渡(重) → ...
```

| 页面类型 | 信息密度 | 元素数量 | 留白比例 | 出现频率 |
|---|---|---|---|---|
| 封面/结尾 | 低 | 3-5 | 60%+ | 各1次 |
| 章节过渡 | 低 | 2-4 | 70%+ | 每3-4页 |
| 内容页 | 中 | 5-8 | 40-50% | 主体 |
| 数据页 | 中高 | 4-6 | 35-45% | 按需 |
| 呼吸页(引用/大图) | 极低 | 2-3 | 75%+ | 每4-5页 |

### 6.2 对齐与间距（来源：瑞士国际主义）

- **左边距统一**：所有页面主内容从 left:80px 开始
- **顶部基线**：标题从 top:80px 开始，正文从 top:160px 开始
- **垂直间距**：元素间距用 32/48/64px（不要 10px 这种碎间距）
- **右边距留白**：内容不超过 right:100px（保持呼吸感）
- **网格参考**：将画布想象为 12列×8行网格（每格 ~107×90px）

---

## 七、装饰技巧（纯CSS实现，不依赖图片）

### 7.1 几何装饰元素

```html
<!-- 圆点阵列（背景装饰） -->
<div style="position:absolute; right:60px; top:60px; width:200px; height:200px;
  background-image: radial-gradient(circle, {accent} 2px, transparent 2px);
  background-size: 20px 20px; opacity:0.15;"></div>

<!-- 对角线条纹 -->
<div style="position:absolute; left:0; bottom:0; width:300px; height:100px;
  background: repeating-linear-gradient(45deg, {accent}, {accent} 2px, transparent 2px, transparent 12px);
  opacity:0.08;"></div>

<!-- 大圆弧（半圆装饰） -->
<div style="position:absolute; right:-100px; top:200px; width:300px; height:300px;
  border-radius:50%; border:3px solid {accent}; opacity:0.1;"></div>

<!-- 色块强调条 -->
<div style="position:absolute; left:0; top:0; width:8px; height:720px; background:{accent};"></div>
```

### 7.2 文字装饰技巧

```html
<!-- 关键词高亮 -->
<span style="background:linear-gradient(transparent 60%, {accent}40 40%); padding:0 4px;">关键词</span>

<!-- 数字标号圆圈 -->
<span style="display:inline-block; width:28px; height:28px; line-height:28px; text-align:center;
  border-radius:50%; background:{accent}; color:white; font-size:14px; font-weight:700;">1</span>

<!-- 引用竖线 -->
<div style="border-left:3px solid {accent}; padding-left:16px; margin-left:20px;">
  <span style="font-style:italic; color:{ink}; opacity:0.8;">引用文字</span>
</div>
```

---

## 八、质检清单（生成后自检）

> 来源：歸藏的 checklist + frontend-slides 的 anti-slop 检测

### 8.1 必过项（不过则重做）

- [ ] **反AI Slop**：没有紫色渐变？没有千篇一律的三列卡片？
- [ ] **对比度**：正文可读性 ≥ 7:1？
- [ ] **字号层级**：标题 > 正文 > 注释，至少3级？
- [ ] **留白**：每页至少40%空白区域？
- [ ] **节奏**：连续内容页不超过3页就有呼吸页？
- [ ] **对齐**：左边距统一？元素不飘？
- [ ] **颜色**：只用主题调色板内的颜色？

### 8.2 加分项

- [ ] 有1-2页"视觉锤"（大图/大数字/大引号）
- [ ] 标题用了衬线字体，正文用了无衬线
- [ ] 装饰元素用了几何图形而非emoji
- [ ] 数据页用了大数字+小注释的对比
- [ ] 封面有明确的视觉焦点（不是均匀分布）

---

## 九、slide-editor 特有能力的利用建议

> 这些是竞品做不到的，应在skill中充分利用

| 能力 | 如何在生成中利用 |
|---|---|
| **形状系统** | 用rect/circle/line做装饰，比div更语义化 |
| **分组** | 将"标题+下划线"组合为一组，方便整体移动 |
| **多选对齐** | 生成时保持元素对齐，用户可多选微调 |
| **Undo/Redo** | 鼓励用户大胆修改，随时撤销 |
| **主题切换** | 生成时用CSS变量引用颜色，切换主题自动适配 |
| **PPTX导出** | 确保元素用标准CSS，导出兼容性好 |

---

*本Skill整合自：frontend-slides(15.5k⭐) · 歸藏PPT(1万⭐) · 破壁editable(733赞) · PPT Master · 米小哇 · openrange7 · Slidev派 等顶级PPT Agent Skill的设计精华。*

---

## 十、图标与SVG素材使用规范

### 10.1 图标来源（推荐 Tabler Icons）

生成PPT时如需图标，使用内联SVG。推荐 Tabler Icons 风格（线性、2px笔画、24x24基准）。

```html
<!-- 图标插入方式：内联SVG，用accent色 -->
<div style="position:absolute; left:100px; top:200px; width:48px; height:48px;">
  <svg viewBox="0 0 24 24" fill="none" stroke="{accent}" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" width="48" height="48">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
</div>
```

### 10.2 图标使用原则

| 规则 | 说明 |
|---|---|
| **尺寸** | 装饰用 32-48px，功能图标 20-24px，大视觉锤 64-96px |
| **颜色** | 只用 accent/accent2/ink，不自创颜色 |
| **笔画** | 统一 stroke-width:2，不混用粗细 |
| **数量** | 每页最多 3-4 个图标，不堆砌 |
| **语义** | 图标必须与内容相关，不做纯装饰 |
| **风格统一** | 全套PPT只用一种图标风格（线性 OR 填充，不混用） |

### 10.3 常用语义图标速查

```
安全/盾牌: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
成功/对勾: <path d="M20 6L9 17l-5-5"/>
警告/三角: <path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
流程/箭头: <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
数据/图表: <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
用户/人物: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
设置/齿轮: <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l..."/>
```

### 10.4 主题配色速查（themes.js 10套）

| 主题 | 适用场景 | 特点 |
|---|---|---|
| memphis | 活泼/创意/年轻 | 高饱和撞色 |
| ocean | 商务/科技 | 蓝色系冷静 |
| forest | 环保/自然/健康 | 绿色系沉稳 |
| midnight | 科技/暗色演讲 | 深色+霓虹accent |
| catppuccinLatte | 温暖/日常/教育 | 柔和暖白底 |
| catppuccinMocha | 深色/开发者/技术 | 柔和深色底 |
| nord | 极简/北欧/学术 | 冷色极简16色 |
| nordAurora | 数据/可视化 | Nord+彩色accent |
| academic | 学术/论文/严肃 | 黑白红经典 |
| corporate | 商务/汇报/正式 | 蓝绿橙专业 |
