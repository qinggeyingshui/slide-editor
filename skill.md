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

#### 标题页
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:linear-gradient(135deg,#667eea,#764ba2);">
  <div style="position:absolute;left:80px;top:180px;font-size:48px;color:#fff;font-weight:bold;">主标题</div>
  <div style="position:absolute;left:80px;top:250px;font-size:24px;color:rgba(255,255,255,0.8);">副标题说明</div>
</div>
```

#### 左文右图
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:40px;font-size:32px;font-weight:bold;color:#333;">标题</div>
  <div style="position:absolute;left:60px;top:100px;width:400px;font-size:18px;color:#555;line-height:1.8;">
    正文内容，支持多行排版。要点用列表呈现。
  </div>
  <img src="/images/xxx.png" style="position:absolute;right:40px;top:80px;width:400px;height:380px;object-fit:cover;border-radius:12px;" />
</div>
```

#### 三栏并列
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#f8f9fa;">
  <div style="position:absolute;left:60px;top:40px;font-size:32px;font-weight:bold;">标题</div>
  <div style="position:absolute;left:60px;top:120px;width:260px;height:360px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="font-size:20px;font-weight:bold;margin-bottom:12px;">栏目1</div>
    <div style="font-size:16px;color:#666;">内容描述</div>
  </div>
  <div style="position:absolute;left:350px;top:120px;width:260px;height:360px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="font-size:20px;font-weight:bold;margin-bottom:12px;">栏目2</div>
    <div style="font-size:16px;color:#666;">内容描述</div>
  </div>
  <div style="position:absolute;left:640px;top:120px;width:260px;height:360px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="font-size:20px;font-weight:bold;margin-bottom:12px;">栏目3</div>
    <div style="font-size:16px;color:#666;">内容描述</div>
  </div>
</div>
```

### 5.3 图表插入

使用内联 SVG 或 Canvas（推荐 SVG，截图兼容性好）：

#### 柱状图示例
```html
<svg style="position:absolute;left:100px;top:150px;width:760px;height:320px;" viewBox="0 0 760 320">
  <!-- 坐标轴 -->
  <line x1="50" y1="280" x2="720" y2="280" stroke="#ccc" stroke-width="1"/>
  <!-- 柱子 -->
  <rect x="100" y="80" width="60" height="200" fill="#667eea" rx="4"/>
  <rect x="220" y="140" width="60" height="140" fill="#764ba2" rx="4"/>
  <rect x="340" y="60" width="60" height="220" fill="#f093fb" rx="4"/>
  <rect x="460" y="120" width="60" height="160" fill="#4facfe" rx="4"/>
  <!-- 标签 -->
  <text x="130" y="300" text-anchor="middle" font-size="14" fill="#666">Q1</text>
  <text x="250" y="300" text-anchor="middle" font-size="14" fill="#666">Q2</text>
  <text x="370" y="300" text-anchor="middle" font-size="14" fill="#666">Q3</text>
  <text x="490" y="300" text-anchor="middle" font-size="14" fill="#666">Q4</text>
</svg>
```

#### 饼图示例
```html
<svg style="position:absolute;left:300px;top:120px;width:360px;height:360px;" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="none" stroke="#667eea" stroke-width="40" stroke-dasharray="150 503" stroke-dashoffset="0"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#f093fb" stroke-width="40" stroke-dasharray="100 503" stroke-dashoffset="-150"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#4facfe" stroke-width="40" stroke-dasharray="253 503" stroke-dashoffset="-250"/>
</svg>
```

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
