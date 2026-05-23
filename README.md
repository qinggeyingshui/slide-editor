# Slide Editor

HTML-based 演示文稿编辑器，专为 AI Agent 设计。每页幻灯片 = 一段 HTML，AI 天然会写，零学习成本。

## 设计理念

HTML 是最好的演示格式——AI 最擅长生成、浏览器原生支持、表现力无上限。PPTX 仅作为输入源（提取模板配色/布局）和分发格式（图片式导出），编辑和演示始终在 HTML 中完成。

## 特性

### 编辑器

- **所见即所得**：拖拽移动/缩放元素、浮动工具栏（字体/字号/颜色/对齐/加粗/斜体）
- **组合/解组**：多选 Ctrl+G 组合，单击选整组，双击进入编辑；解组时保留容器背景
- **图层管理**：上移/下移图层顺序，缩略图面板一览所有页
- **撤销重做**：Ctrl+Z / Ctrl+Shift+Z，完整操作历史

### 内容能力

- **全 HTML/CSS**：渐变、阴影、滤镜、Grid/Flex 布局、自定义字体——浏览器能渲染的都能用
- **CSS 动画**：@keyframes 入场/循环/悬停动画，演示模式自动播放
- **ECharts 图表**：折线/柱状/饼图/雷达图，SVG 渲染不模糊，`data-echarts` 属性即用
- **SVG 矢量图**：图标、插画、数据可视化，直接内联
- **表格**：HTML table 原生支持，样式完全可控
- **数学公式**：KaTeX 渲染，`data-latex` 属性

### AI 生图

- **gpt-image-2 集成**：`python scripts/generate_image.py "描述" -o name.png`
- 自动保存到 `public/images/`，HTML 中直接 `<img src="/images/name.png">` 引用
- 支持自定义尺寸，适配封面/配图/竖版等各种场景
- 需要用户自行配置 OpenAI API 密钥（在 `scripts/generate_image.py` 中设置 `API_KEY`）

### 导入导出

- **导入 PPTX 模板**：自动提取配色方案、字体、布局结构，AI 按风格填充内容
- **导出 PPTX**：截图方式生成，保证视觉一致性（图片式，非可编辑）
- **导出 HTML**：独立单文件，可直接浏览器打开演示
- **JSON 互转**：方便版本管理和批量操作

### 演示模式

- 全屏自适应缩放，键盘/鼠标翻页
- CSS 动画自动播放，ECharts 图表自动初始化
- 支持任意分辨率屏幕

## 快速开始

```bash
git clone https://github.com/xxx/slide-editor.git
cd slide-editor
npm install
npm run dev   # → http://localhost:3001
```

把 `SKILL.md` 喂给你的 AI Agent，它就知道怎么操作了。

## 两种工作流

1. **上传 PPTX 模板** → AI 识别风格 → 按模板配色/布局填充新内容
2. **从零生成** → AI 参考 `templates.md` 布局库 → 直接写 HTML 生成任意风格

## Token 开销

Agent 只需读取 `SKILL.md`（~3K tokens）即可掌握全部操作能力。生成一页幻灯片约 300-800 tokens，7 页完整 PPT 总计约 5K tokens。

## 搭配 GenericAgent 更省 token

[GenericAgent](https://github.com/lsdefine/GenericAgent) 的记忆系统会缓存 SKILL.md 为长期技能，后续调用无需重复读取。配合 GA 的 CLI 工具链和自动验证机制，整体 token 消耗可再降 30-50%。

## License

MIT
