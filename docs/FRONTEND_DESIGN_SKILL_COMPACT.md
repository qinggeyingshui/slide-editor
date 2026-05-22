# 前端审美 Skill（精炼版）

> 本文件定义"好看的前端"的审美标准。作为 system prompt 使用时，AI 会自动按这些标准输出代码。

---

## 核心审美观：克制即高级

好看的前端 = 大量留白 + 极少装饰 + 强信息层级 + 微妙细节

丑的前端 = 塞满内容 + 过度装饰 + 层级模糊 + 动画泛滥

---

## 一、绝对禁止（出现即丑）

- 渐变色背景（尤其蓝紫渐变）
- 圆角 > 16px
- 阴影 rgba 透明度 > 0.15
- 纯黑 #000 文字 + 纯白 #fff 背景
- 超过 3 种颜色
- 每个元素都有动画
- Lorem ipsum 占位文字
- 所有卡片等大等间距排列
- 弹跳/果冻动画效果
- 彩虹色/霓虹色

---

## 二、间距（最影响观感的单一因素）

```
规则：所有间距必须是 8 的倍数。

元素内部 padding: 16-24px
卡片之间 gap: 16-24px
区块之间 section gap: 64-128px（这是关键！大多数AI给32px，太挤）
页面两侧 padding: 24-64px（随屏幕宽度）
容器最大宽度: 1280px 居中

留白占比 ≥ 40%。宁可空着，不要填满。
```

---

## 三、颜色

```
全页只用 3 种颜色：
- 主色 60%（通常是背景：浅灰/米白/深灰）
- 辅色 30%（文字/边框/次要元素）
- 强调色 10%（CTA按钮/链接/高亮，只出现1-2处）

文字颜色：
- 主文字：#1a1a1a 或 #0f172a（不要纯黑）
- 次文字：#64748b（slate-500）
- 弱文字：#94a3b8（slate-400）

背景颜色：
- 主背景：#fafafa / #f8fafc（不要纯白）
- 卡片背景：#ffffff（白色只用在卡片上，和灰底形成层次）
- 深色模式背景：hsl(220, 13%, 10%)（带蓝调的深灰，不要纯黑）

强调色只选一个，面积越小越有力：
- 蓝：#2563eb  - 紫：#7c3aed  - 绿：#059669
- 橙：#ea580c  - 靛：#4f46e5
```

---

## 四、字体与文字

```
字号阶梯（必须有明确层级）：
- 大标题：48-64px, font-weight: 700-800
- 小标题：24-32px, font-weight: 600
- 正文：16px, font-weight: 400, line-height: 1.6-1.75
- 辅助文字：12-14px, font-weight: 400

字体选择：
- 英文首选：Inter / Geist / DM Sans
- 中文首选：系统默认（-apple-system, "PingFang SC", "Microsoft YaHei"）
- 等宽/代码：JetBrains Mono / Fira Code

字间距：标题可加 letter-spacing: -0.02em（紧凑感=高级感）
段落最大宽度：max-width: 65ch（超过就难读）
```

---

## 五、阴影与边框

```
阴影原则：越淡越高级。

卡片默认：box-shadow: 0 1px 3px rgba(0,0,0,0.04)
悬浮状态：box-shadow: 0 4px 16px rgba(0,0,0,0.06)
弹窗/Modal：box-shadow: 0 8px 32px rgba(0,0,0,0.08)

永远不要超过 rgba(0,0,0,0.15)。

边框：
- 用 1px solid #e2e8f0（极淡灰线）分隔区域
- 或者不用边框，用背景色差异区分层次（更高级）
- 渐变边框（高级技巧）：
  background: linear-gradient(#fff,#fff) padding-box,
              linear-gradient(135deg, #667eea, #764ba2) border-box;
  border: 1px solid transparent;
```

---

## 六、布局与构图

```
核心：不对称 > 对称，层次 > 平铺

好的布局特征：
- 有一个明确的视觉焦点（最大/最亮/最不同的那个元素）
- 元素大小有对比（大标题 vs 小正文，大图 vs 小图标）
- 网格不必等分（2:1 / 3:2 比 1:1:1 更有张力）
- 内容分组明确（相关的靠近，无关的拉远）

卡片布局：
- 不要所有卡片一样大 → 用 Bento Grid（便当盒）：有大有小
- grid-template-columns: repeat(4, 1fr) 然后让某些 span 2

页面节奏：
- 密 → 疏 → 密 → 疏（呼吸感）
- 每个 section 之间 64-128px，这是"高级感"的最大来源
- 首屏信息密度高，往下逐渐稀疏
```

---

## 七、动效（少即是多）

```
只在这3个时机加动画：
1. 页面滚动进入视口时 → fade-up（opacity 0→1 + translateY 20px→0）
2. 鼠标 hover 时 → 微位移/微放大/颜色变化
3. 状态切换时 → 平滑过渡

动画参数：
- 时长：200-400ms（不要超过 500ms）
- 缓动：cubic-bezier(0.16, 1, 0.3, 1)（快出慢停）
- 位移量：10-20px（不要超过 30px）
- 缩放：1.02-1.05（不要超过 1.1）

绝对不要：
- 所有元素同时动（应该有 stagger 错开 50-100ms）
- 无限循环动画
- 弹跳/果冻/摇晃效果
- 3D翻转
```

---

## 八、什么是"高级感"（审美本质）

```
高级感 = 克制 + 对比 + 细节

克制：
- 颜色少（3种以内）
- 装饰少（无多余线条/图标/背景图案）
- 动画少（只在关键处）
- 文字少（能删就删）

对比：
- 大小对比（48px标题 vs 14px注释）
- 粗细对比（800 vs 400 font-weight）
- 疏密对比（大留白区 vs 紧凑信息区）
- 明暗对比（深色文字 vs 浅色背景，但不要纯黑纯白）

细节：
- 文字 letter-spacing: -0.02em（标题紧凑感）
- 图片统一圆角 8-12px
- hover 时 translateY(-2px) + 阴影加深
- 分割线用 1px 半透明而非实色
- 按钮有 active 状态（scale 0.98）
```

---

## 九、风格方向速查（选一个贯彻到底）

| 风格 | 关键词 | 配色 | 字体 |
|---|---|---|---|
| 极简科技 | 大留白、线条感、冷色 | 白+深灰+蓝 | Inter/Geist |
| 温暖人文 | 圆润、暖色、亲和 | 米白+棕+橙 | DM Sans |
| 暗黑专业 | 深底、发光点缀、数据感 | 深灰+白+紫/蓝 | Space Grotesk |
| 编辑杂志 | 大字重排版、不对称 | 黑+白+一个强调色 | Playfair+Inter |
| 玻璃拟态 | 毛玻璃、半透明、光影 | 浅色+白色模糊层 | Inter |

选定后所有页面统一，不要混搭。

---

## 十、一句话总结

> **好看 = 大间距 + 少颜色 + 强层级 + 微细节。**
> 
> 当你不确定时，删掉一些东西，加大一些间距，减淡一些颜色。
> 做减法永远比做加法更容易变好看。

---

## 十一、视觉层级诊断（来源：Refactoring UI）

```
诊断方法：把页面截图转灰度图，如果层级消失 → 你只靠颜色在做层级，不合格。

正确的层级构建（按优先级）：
1. 大小差异（最强）：标题 vs 正文的字号差 ≥ 16px
2. 字重差异：700 vs 400，不要用 300 以下
3. 颜色明度差异：主文字 #1a1a1a，次文字 #6b7280，辅助 #9ca3af
4. 间距分组：相关元素靠近，无关元素远离（亲密性原则）
5. 背景区分：用极微的背景色差（#f9fafb vs #ffffff）划分区域

常见错误：
- 用 label 在 value 上方 → 应该弱化 label，强调 value
- 所有按钮同样式 → 必须有 primary/secondary/ghost 三级
- 侧边栏每项都加图标+文字+badge → 信息过载，减到最少
```

## 十二、CRAP 四原则（来源：oiloil-ui-ux-guide）

```
C - Contrast（对比）：重要的东西必须明显不同，不要"差一点点"
R - Repetition（重复）：同类元素保持完全一致的样式，建立节奏感
A - Alignment（对齐）：页面上每个元素都必须与另一个元素有视觉连接
P - Proximity（亲密）：相关的东西靠近，不相关的东西远离

硬规则：
- 禁止用 emoji 当图标（不专业）
- 图标必须来自同一套图标库（Lucide/Heroicons），禁止混用
- 每个页面只有一个主要 CTA（Call to Action）
- 表单 label 永远在 input 上方，不要放左边
```

## 十三、微交互必备清单（来源：animation-interaction-validator）

```
每个可交互元素必须有以下反馈（缺任何一个 = 不合格）：

按钮：
  hover → scale(1.02) + shadow 加深, transition 200ms
  active → scale(0.98), transition 100ms
  loading → 显示 spinner + 禁用点击
  disabled → opacity: 0.5 + cursor: not-allowed

输入框：
  focus → border-color 变主色 + 外发光 ring
  error → border-color 变红 + 错误文字出现（带 transition）
  success → 短暂绿色 ✓ 图标

卡片：
  hover → translateY(-2px) + shadow 加大, transition 300ms

页面切换：
  进入 → opacity 0→1 + translateY(10px→0), duration 300ms
  列表项 → 依次延迟 stagger 50ms

禁止：
  - duration > 500ms（感觉迟钝）
  - bounce/elastic 缓动（幼稚感）
  - 同时超过 3 个元素在动（混乱）
```

---

## 十四、一句话总结（升级版）

> **好看 = 大间距 + 少颜色 + 强层级 + 微细节 + 每个交互有反馈。**
> 
> 判断标准：截图转灰度仍有层级 → 合格。
> 每个按钮 hover 都有变化 → 合格。
> 全页颜色不超过 3 种 → 合格。
> 
> 当你不确定时，删掉一些东西，加大一些间距，减淡一些颜色。

---

*综合来源：小红书高赞帖 + GitHub Skill库 (Refactoring UI / design-ui-ux-pro-max / oiloil-ui-ux-guide / animation-interaction-validator)*
