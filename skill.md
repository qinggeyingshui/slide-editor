# Slide Editor Skill

> HTML-based 演示文稿编辑器。Agent 通过直接写数据文件或 CLI 操作幻灯片。

## 1. 快速开始

```bash
cd slide-editor
npm install                    # 首次
python cli.py start            # 启动 http://localhost:3001
# 然后直接写 src/model/presentationData.js 即可
```

依赖：Node.js ≥ 16 + Python ≥ 3.8。导出 PPTX 额外需要 `python-pptx` + `selenium` + Chrome。

## 2. 核心概念

- **画布**：960 × 540px（16:9）
- **数据文件**：`src/model/presentationData.js`
- **每页**：一个 `{ "innerHTML": "<html>" }` 对象
- **热更新**：修改数据文件后浏览器自动刷新

```javascript
export const slides = [
  { "innerHTML": `<div style="...">第1页内容</div>` },
  { "innerHTML": `<div style="...">第2页内容</div>` }
];
```

Agent 直接读写此文件（比 CLI 更高效）：
```python
import json, re
from pathlib import Path

data_file = Path('src/model/presentationData.js')
text = data_file.read_text(encoding='utf-8')
slides = json.loads(re.search(r'export const slides\s*=\s*(\[[\s\S]*?\n\])', text).group(1))

# 修改 slides...

data_file.write_text(f"export const slides = {json.dumps(slides, ensure_ascii=False, indent=2)};\n")
```

## 3. 两种工作流

```
收到PPT任务
  ├─ 用户提供了 PPTX 模板 → 工作流A：模板填充
  └─ 从零开始 → 工作流B：主题生成
```

### 工作流A：模板填充

1. `python cli.py import-pptx template.pptx` 导入模板
2. 解析 presentationData.js，按关键词定位占位文字
3. 替换为用户内容，写回文件
4. 预览确认

### 工作流B：主题生成

1. 读 **templates.md** 选择布局模板
2. 确定配色方案 + 页面结构
3. 如需图片 → 调用 `scripts/generate_image.py` 批量生图
4. 组装 HTML 写入 presentationData.js
5. 预览确认

## 4. CLI 命令参考

```bash
python cli.py list                              # 列出所有页
python cli.py add "<html>" [位置]               # 添加页
python cli.py edit <索引> "<html>"              # 编辑页
python cli.py delete <索引>                     # 删除页
python cli.py export-json [output.json]         # 导出JSON
python cli.py import-json input.json            # 导入JSON
python cli.py export-pptx [output.pptx]        # 导出PPTX（截图式）
python cli.py import-pptx input.pptx           # 导入PPTX模板
python cli.py start [port]                      # 启动服务
```

## 5. 创作指南

### 5.1 结构规划

典型结构：封面 → 目录 → 内容页(穿插呼吸页) → 结尾页

规则：
- 10页以内精简，每页一个核心信息
- 连续内容页不超过3页就插入呼吸页（过渡/引用/大图）
- 每页元素不超过 7±2 个视觉单元

### 5.2 配色方案

全套统一一个调色板。背景 60% / 主色 30% / 强调色 10%。

| 风格 | 主色 | 辅色 | 背景 | 文字 |
|------|------|------|------|------|
| 商务蓝 | #2563eb | #60a5fa | #f8fafc | #1e293b |
| 科技紫 | #7c3aed | #a78bfa | #faf5ff | #1e1b4b |
| 活力橙 | #ea580c | #fb923c | #fff7ed | #431407 |
| 清新绿 | #059669 | #34d399 | #ecfdf5 | #064e3b |
| 暗色 | #3b82f6 | #60a5fa | #0f172a | #f1f5f9 |

### 5.3 字体

- 标题：`'Inter', 'PingFang SC', sans-serif; font-weight:bold;` 32-48px
- 正文：同上 font-weight:400; 16-18px
- 代码：`'JetBrains Mono', monospace;`
- 间距遵循 8px 模数（8/16/24/32/48/64/96）

### 5.4 插图

优先级：用户图片 > AI生图 > 在线素材 > SVG内联

#### AI 生图（gpt-image-2）

```bash
python scripts/generate_image.py "描述" --output name.png --size 1536x1024
```

```python
from scripts.generate_image import generate
path = generate("抽象科技背景", "tech_bg.png", "1536x1024")
# 返回 "/images/tech_bg.png"
```

- 耗时 60-120s，适合提前批量生成
- 尺寸：`1024x1024`(方) | `1536x1024`(横) | `1024x1536`(竖)
- Prompt 要点：明确风格 + 配色 + 内容 + "无文字"

#### 在线素材

Unsplash/Pexels 免费图片（Pollinations 已收费不可用）。

#### 引用方式

```html
<img src="/images/xxx.png" style="position:absolute;left:Xpx;top:Ypx;width:Wpx;height:Hpx;object-fit:cover;" />
```

### 5.5 图表

#### ECharts（推荐，交互式）

```html
<div data-echarts='{"xAxis":{"type":"category","data":["A","B","C"]},"yAxis":{"type":"value"},"series":[{"type":"bar","data":[10,20,30]}]}'
     style="position:absolute;left:Xpx;top:Ypx;width:Wpx;height:Hpx;"></div>
```

编辑器自动初始化 ECharts（SVG renderer，不模糊）。演示模式同样支持。

#### SVG 图表（轻量，导出兼容好）

直接写 SVG，适合简单的柱状/饼图/折线。完整示例见 templates.md。

### 5.6 动画

Slide 内容是纯 HTML/CSS 渲染，支持任意 CSS 动画。演示模式切页时动画自动重播。

```html
<style>
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes slideUp { from { opacity:0;transform:translateY(30px) } to { opacity:1;transform:translateY(0) } }
@keyframes scaleIn { from { opacity:0;transform:scale(0.8) } to { opacity:1;transform:scale(1) } }
@keyframes bounce { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
</style>

<h1 style="animation:fadeIn 0.8s ease both">淡入</h1>
<div style="animation:slideUp 0.6s ease 0.3s both">延迟入场</div>
<span style="animation:bounce 1s infinite">持续弹跳</span>
```

技巧：`animation-delay` 递增实现逐步入场；`both` 保持结束状态；`infinite` 用于装饰。

### 5.7 特殊元素

**形状**：编辑器内置矩形/圆形/三角/箭头/星形，也可直接写 SVG。

**公式**（KaTeX）：
```html
<div class="latex-block" data-latex="E=mc^2" style="position:absolute;left:Xpx;top:Ypx;"></div>
```

**代码块**：用 `<pre><code>` + 深色背景 + monospace 字体。

## 6. 质检清单

### 必过项（不过则重做）

- [ ] **反AI Slop**：无紫色渐变白底、无千篇一律三列卡片、无过度emoji
- [ ] **对比度**：正文 ≥ 7:1，标题 ≥ 4.5:1
- [ ] **字号层级**：标题 > 正文 > 注释，至少3级
- [ ] **留白**：每页至少40%空白
- [ ] **节奏**：连续内容页 ≤ 3页
- [ ] **对齐**：基于网格，无随意偏移
- [ ] **配色一致**：全套同一调色板
- [ ] **圆角**：border-radius ≤ 16px

### 加分项

- [ ] 数据可视化（ECharts/SVG图表）
- [ ] 高质量插图（AI生图/素材）
- [ ] CSS动画/过渡
- [ ] 封面有视觉冲击力
- [ ] 结尾有CTA

## 7. 常见问题

| 问题 | 解决 |
|------|------|
| 修改数据文件后无变化 | 清 localStorage 或 Ctrl+Shift+R |
| `npm install` 失败 | `npm install --legacy-peer-deps` |
| 导出PPTX超时 | 确认 Chrome 已装，`pip install chromedriver-autoinstaller` |
| 导入PPTX无反应 | Windows需PowerPoint；无Office用python-pptx fallback |
| 端口被占 | `python cli.py start 3002` |
| 图片不显示 | 图片放 `public/images/`，引用 `/images/xxx` |
| ECharts不渲染 | 确认 `data-echarts` 是合法JSON字符串 |
| KaTeX不渲染 | 需要 `class="latex-block"` + `data-latex` |
| 导出PPTX背景丢失 | 用纯色或图片背景替代渐变 |
| 双击文本无法编辑 | 双击具体的 span/p 节点 |

## 8. 文件结构

```
slide-editor/
├── cli.py                       # CLI入口
├── SKILL.md                     # 本文档
├── templates.md                 # 布局模板库
├── src/model/presentationData.js  # 核心数据
├── scripts/
│   ├── generate_image.py        # AI生图(gpt-image-2)
│   ├── export_pptx.py           # 导出PPTX
│   └── pptx2slides.py           # 导入PPTX
└── public/images/               # 图片资源
```
