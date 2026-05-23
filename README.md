# 🎨 Slide Editor

> HTML-based 演示文稿编辑器，专为 AI Agent 设计。  
> 每页幻灯片 = 一段 HTML，AI 天然会写，零学习成本。

---

## 💡 设计理念

HTML 是最好的演示格式——AI 最擅长生成、浏览器原生支持、表现力无上限。

PPTX 仅作为**输入源**（提取配色/布局）和**分发格式**（图片式导出），编辑和演示始终在 HTML 中完成。

---

## ✨ 特性一览

| 类别 | 能力 |
|------|------|
| **编辑** | 拖拽移动/缩放、浮动工具栏（字体/字号/颜色/对齐/加粗/斜体）、撤销重做 |
| **图层** | 上移/下移图层、缩略图面板、组合/解组（Ctrl 多选 + Ctrl+G） |
| **内容** | 全 HTML/CSS、CSS 动画、ECharts 图表、SVG 矢量图、表格、KaTeX 公式 |
| **AI 生图** | gpt-image-2 集成，一行命令生成配图 |
| **导入** | PPTX（含视频提取）、HTML、JSON |
| **导出** | PPTX（截图式）、HTML（独立单文件）、JSON |
| **演示** | 全屏自适应、键盘翻页、动画自动播放 |

---

## ⚡ 低 Token 开销

幻灯片即 HTML——AI 无需学习私有 DSL 或复杂 API，直接用最熟悉的语言生成内容，天然高效。

> **🚀 搭配 [GenericAgent](https://github.com/lsdefine/GenericAgent) 效果更佳，token开销更小**  

---

## 🚀 快速开始

```bash
cd slide-editor
npm install
npm run dev   # → http://localhost:3001
```

把 `SKILL.md` 喂给你的 AI Agent，它就知道怎么操作了。  
可在 `template.md` 和 `SKILL.md` 中约束风格与制作思路。
如需要AI生图功能，需要在scripts/generate_iamge.py中配置API_KEY。

---

## 📂 项目结构

```
slide-editor/
├── src/                    # Vue 前端源码
│   ├── components/         # 编辑器组件
│   ├── composables/        # useFileIO.js 等组合式函数
│   └── model/              # presentationData.js（幻灯片数据）
├── scripts/                # 转换脚本
│   ├── pptx2slides.py      # PPTX → presentationData.js（含视频提取）
│   ├── html_to_slides.py   # HTML → presentationData.js
│   ├── slides_to_html.py   # presentationData.js → 独立 HTML
│   └── generate_image.py   # AI 生图（gpt-image-2）
├── public/                 # 静态资源
│   ├── images/             # 图片（含 AI 生成）
│   └── videos/             # 从 PPTX 提取的视频
├── SKILL.md                # AI Agent 操作指南（~3K tokens）
└── template.md             # 布局模板库
```

---

## 🔄 两种工作流

1. **上传 PPTX 模板** → AI 识别风格 → 按模板配色/布局填充新内容  
2. **从零生成** → AI 参考 `template.md` 布局库 → 直接写 HTML


## 📄 License

MIT
