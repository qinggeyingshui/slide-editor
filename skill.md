# Slide Editor Skill

> HTML-based 演示文稿编辑器，支持创建、编辑、导入导出 PPT。Agent 通过 CLI 或直接修改数据文件操作。

## 1. 环境要求

| 依赖 | 用途 | 必须？ |
|------|------|--------|
| Node.js >= 16 | 前端服务 + PPTX解析 | ✓ |
| Python >= 3.8 | CLI + 导出脚本 | ✓ |
| python-pptx | 导出PPTX时组装 | 仅导出PPTX |
| selenium | 导出PPTX时截图 | 仅导出PPTX |
| Chrome/Chromium | selenium驱动 | 仅导出PPTX |
| PowerPoint (Windows) | 导入PPTX高保真模式 | 可选，有则自动用 |

### 环境检测（Agent 首先执行）
```bash
node -v && python --version && npm -v
```

### 首次安装
```bash
cd slide-editor
npm install
# 仅导出PPTX功能需要：
pip install python-pptx selenium
```

## 2. 启动服务

```bash
python cli.py start          # 启动 http://localhost:3001
# 或手动：
npm run dev
```

服务启动后可在浏览器中预览和交互编辑。

## 3. CLI 命令参考

```bash
python cli.py list                              # 列出所有页
python cli.py add "<html内容>" [位置]            # 添加页（位置可选）
python cli.py edit <索引> "<html内容>"           # 编辑指定页
python cli.py delete <索引>                     # 删除指定页
python cli.py export-json [output.json]         # 导出JSON
python cli.py import-json input.json            # 导入JSON
python cli.py export-pptx [output.pptx]        # 导出PPTX（自动启服务+截图）
python cli.py import-pptx input.pptx           # 导入PPTX模板
python cli.py start [port]                      # 启动服务
```

## 4. 数据格式

文件：`src/model/presentationData.js`

```javascript
export const slides = [
  { "innerHTML": "<div style='...'>内容HTML</div>" },
  { "innerHTML": "..." }
];
```

每页是一个对象，`innerHTML` 包含该页所有元素的 HTML。画布尺寸 960×540px。所有元素用 `position:absolute` 定位。

### 直接修改数据（无需CLI）

Agent 也可以直接读写 `presentationData.js`，适合批量生成：
```python
import json, re
from pathlib import Path

data_file = Path('src/model/presentationData.js')
text = data_file.read_text(encoding='utf-8')
slides = json.loads(re.search(r'export const slides\s*=\s*(\[[\s\S]*\]);?\s*$', text).group(1))

# 修改后写回
data_file.write_text(f"export const slides = {json.dumps(slides, ensure_ascii=False, indent=2)};\n")
```

## 5. 创作指南

### 5.1 PPT 结构规划

典型结构：
1. **封面页** — 标题 + 副标题 + 背景图
2. **目录页** — 章节列表
3. **内容页** — 标题 + 正文/图表/图片
4. **过渡页** — 章节分隔
5. **结尾页** — 总结/致谢/联系方式

建议：10页以内精简，每页一个核心信息。

### 5.2 排版模板

> 完整模板库见 **templates.md**（封面/内容/图表/时间线/对比/数据卡片/结尾等 15+ 种布局）

基础示例 — 渐变封面：
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:linear-gradient(135deg,#667eea,#764ba2);">
  <div style="position:absolute;left:80px;top:180px;font-size:48px;color:#fff;font-weight:bold;">主标题</div>
  <div style="position:absolute;left:80px;top:250px;font-size:24px;color:rgba(255,255,255,0.8);">副标题说明</div>
</div>
```

### 5.3 图表插入

使用内联 SVG（截图兼容性好）。完整示例见 **templates.md** 图表页部分。

基本原则：
- 柱状图/折线图/饼图均用 SVG 实现
- `viewBox` 控制坐标系，外层 `style` 控制位置大小
- 颜色与整体配色方案保持一致

### 5.4 插图获取

优先级：
1. **用户提供的图片** → 放入 `public/images/`，用 `/images/xxx.png` 引用
2. **在线素材** → Pexels/Pixabay 免费图片，下载后放入 public
3. **AI 生图** → 生成后保存到 public
4. **SVG 图形** → 直接内联，无需外部文件

图片引用格式：
```html
<img src="/images/photo.jpg" style="position:absolute;left:Xpx;top:Ypx;width:Wpx;height:Hpx;object-fit:cover;border-radius:8px;" />
```

### 5.5 配色方案

#### 商务蓝
```
主色: #2563eb  辅色: #60a5fa  背景: #f8fafc  文字: #1e293b
```

#### 科技紫
```
主色: #7c3aed  辅色: #a78bfa  背景: #faf5ff  文字: #1e1b4b
```

#### 活力橙
```
主色: #ea580c  辅色: #fb923c  背景: #fff7ed  文字: #431407
```

#### 清新绿
```
主色: #059669  辅色: #34d399  背景: #ecfdf5  文字: #064e3b
```

#### 暗色主题
```
主色: #3b82f6  辅色: #60a5fa  背景: #0f172a  文字: #f1f5f9
```

### 5.6 字体建议

- 标题：`font-family: 'Inter', 'PingFang SC', sans-serif; font-weight: bold;`
- 正文：`font-family: 'Inter', 'PingFang SC', sans-serif; font-weight: 400;`
- 代码：`font-family: 'JetBrains Mono', monospace;`
- 大小：标题 32-48px，副标题 20-24px，正文 16-18px，注释 12-14px

### 5.7 完整示例：从主题到成品

**需求：** "做一个产品发布会PPT，5页"

**Agent 执行流程：**
```bash
# 1. 清空现有内容
python cli.py delete 0  # 重复直到清空，或直接写文件

# 2. 逐页添加
python cli.py add "<封面HTML>"
python cli.py add "<产品亮点HTML>"
python cli.py add "<技术参数HTML>"
python cli.py add "<对比图表HTML>"
python cli.py add "<结尾CTA HTML>"

# 3. 启动预览确认
python cli.py start

# 4. 导出
python cli.py export-pptx product_launch.pptx
```

## 6. 形状与装饰

编辑器内置形状插入（矩形/圆形/三角/箭头/星形），也可直接写 SVG：
```html
<svg style="position:absolute;left:Xpx;top:Ypx;width:Wpx;height:Hpx;" viewBox="0 0 W H">
  <rect/circle/path ... />
</svg>
```

## 7. 公式

LaTeX 公式通过 KaTeX 渲染：
```html
<div class="latex-block" data-latex="E=mc^2" style="position:absolute;left:Xpx;top:Ypx;">
  <!-- KaTeX 渲染结果 -->
</div>
```

## 8. 常见问题

| 问题 | 解决 |
|------|------|
| `npm install` 失败 | 检查 Node 版本，尝试 `npm install --legacy-peer-deps` |
| 导出PPTX超时 | 确认 Chrome 已安装，尝试 `pip install chromedriver-autoinstaller` |
| 导入PPTX无反应 | Windows需要PowerPoint；无Office时用python-pptx fallback |
| 端口3001被占用 | `python cli.py start 3002` 换端口 |
| 图片不显示 | 确认图片在 `public/images/` 下，引用路径为 `/images/xxx` |
| 中文乱码 | 确保文件 UTF-8 编码 |

## 9. 文件结构

```
slide-editor/
├── cli.py                    # 统一CLI入口
├── skill.md                  # 本文档
├── package.json              # Node依赖
├── src/
│   ├── model/
│   │   └── presentationData.js  # 核心数据文件
│   ├── App.vue               # 主界面
│   └── composables/          # 功能模块
├── scripts/
│   ├── export_pptx.py        # 导出PPTX（selenium截图）
│   └── pptx2slides.py        # 导入PPTX（COM/node解析）
└── public/
    └── images/               # 图片资源目录
```

## 10. CSS 动画

Slide 内容是纯 HTML/CSS 渲染，支持任意 CSS 动画。在 slide HTML 中写 `<style>` 定义 keyframes，元素上加 `animation` 属性即可。

### 常用动画模板

```html
<style>
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
@keyframes slideLeft { from { opacity: 0; transform: translateX(-40px) } to { opacity: 1; transform: translateX(0) } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
@keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
@keyframes spin { to { transform: rotate(360deg) } }
</style>

<h1 style="animation: fadeIn 0.8s ease both">淡入标题</h1>
<div style="animation: slideUp 0.6s ease 0.3s both">延迟入场</div>
<span style="animation: bounce 1s infinite">持续弹跳</span>
```

### 技巧

- `animation-delay` 实现逐步入场：`0s`, `0.2s`, `0.4s`...
- `animation-fill-mode: both` 保持动画结束状态
- `infinite` 循环播放，适合装饰元素
- 演示模式自动支持（v-html 渲染，切页时动画重播）
- ECharts 图表用 `data-echarts` 属性，演示模式也自动初始化
