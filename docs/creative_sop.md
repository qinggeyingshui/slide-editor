# HTML Presentation SOP (全Absolute定位HTML幻灯片)

## 适用场景
生成全 absolute 定位的 HTML 幻灯片，配合 slide-editor 编辑器使用（拖拽/编辑/导出PPT）

## 一、整体流程
1. **内容规划** → 确定页数、每页主题、需要的插图
2. **AI生图** → 用 gpt-image-2 生成插图（见第八节）
3. **HTML生成** → 按全absolute规范逐页写入 presentationData.js
4. **编辑器预览** → `npm run dev` 启动 slide-editor，浏览器查看效果
5. **微调** → 编辑器内拖拽调整位置、双击编辑文字
6. **导出PPT** → 运行 `tools/export_pptx.py` 截图导出（见第九节）

## 二、页面结构规范（全Absolute定位）

### 2.1 数据格式（presentationData.js）

**⚠️ 文件路径**：`src/model/presentationData.js`（不是 `src/presentationData.js`！App.vue import 的是 model/ 下的文件）

```javascript
// src/model/presentationData.js
export const slides = [
  {
    "id": "slide_1",  // id 可选，无则按数组索引
    "innerHTML": "<div style=\"position:absolute; left:60px; top:40px;\">...</div>"
  },
  {
    "innerHTML": "<div style=\"position:absolute; ...\">...</div>"
  }
];

export const presentationCSS = '';
```

**格式要点**：
- 导出变量名为 `slides`（App.vue 通过 `import { slides as presentationSlides }` 引用）
- 每页是 `{ "innerHTML": "..." }` 对象，`id` 字段可选
- innerHTML 中的双引号必须用 `\"` 转义（外层是 JSON 字符串）
- 数组末尾用 `];` 结束，后跟 `export const presentationCSS = '';`
- 保存时编辑器通过 `/api/save` 写回此文件

### 2.2 单页HTML结构
```html
<!-- 每个顶层元素都是 position:absolute，用 left/top/width/height 定位 -->
<div style="position:absolute; left:60px; top:40px; width:400px; font-size:32px; font-weight:700; color:#1a1a2e;">
  标题文字
</div>
<div style="position:absolute; left:60px; top:120px; width:600px; font-size:16px; color:#555;">
  正文内容
</div>
<img src="/images/fig1.png" style="position:absolute; left:700px; top:150px; width:450px; border-radius:12px;">
```

### 2.3 核心约束
- **画布尺寸**：960×540px（16:9）
- **所有顶层元素必须 `position:absolute`**（编辑器拖拽依赖此属性）
- **样式全内联**：不依赖外部 CSS class，所有样式写在 style 属性里
- **嵌套限制**：允许容器内嵌套（如卡片内有标题+列表），但容器本身必须 absolute
- **容器内部**：内部元素可用 relative/static 正常流布局
- **图片路径**：`/images/xxx.png`（放在 slide-editor/public/images/ 下）
- **SVG 拆分原则**：需要用户交互编辑（移动/改色/改文字）的内容 → 拆成独立 absolute 元素（每个圆圈、文字、图形各自独立）；纯装饰性/不需要编辑的复杂图形（背景花纹、装饰图案）→ 保持单个 SVG。拆分约增加 1 倍字符但换来完全可编辑，对总体 token 开销影响微小（<2%）

### 2.4 编辑器交互规则
- 点击选中 → 拖拽移动（仅 absolute 元素）
- 双击文字 → contentEditable 编辑（无块级子元素时）
- Delete键 → 删除选中元素
- 选中后点击内部子元素 → 深入选择（可克隆行/列）

## 三、配色规范（蓝白色系 + 5色卡片）

### 3.1 卡片/div背景色（5色循环）
| 序号 | 色值 | 用途 |
|------|------|------|
| 1 | `#e3f2fd` | 浅蓝（主色，高频） |
| 2 | `#e8f5e9` | 浅绿 |
| 3 | `#fff3e0` | 浅橙 |
| 4 | `#fce4ec` | 浅粉 |
| 5 | `#ede7f6` | 浅紫 |

- 每页内div按顺序循环使用
- ≥7个同类卡片的页面统一用 `#e3f2fd`
- **禁止**用单一 `#f8fbff` 铺满所有卡片（无区分度）

### 3.2 数据表格样式
```
thead: background: linear-gradient(135deg, #1a73e8, #1565c0); color: white
th: padding: 12px 14px; font-size: 13px
td: padding: 10px 14px; font-size: 12px
数据行交替: 奇数行 #ffffff / 偶数行 #f5f8ff
高亮行(如GA/Ours): background: #e3f2fd + border-left: 4px solid #1a73e8
```

### 3.3 Table标题（如 "Table 6: xxx"）
```css
font-size: 14px; color: #78909c; font-style: italic; font-weight: 400;
```

### 3.4 特殊语义色（非表格区域，保留不动）
- 绿色 `#43a047` / `#2e7d32`：正面/成功
- 红色 `#c62828` / `#ef5350`：对比/警告
- 紫色 `#6a1b9a`：特殊类别
- 橙色 `#f57c00`：中间状态

### 3.5 分层记忆等带左边框的卡片
```css
background: linear-gradient(90deg, 色值 4px, 浅底色 4px);
```


## 四、布局规范

### 4.1 图片处理
- 图片必须 `position:absolute`，用 left/top/width 精确定位
- 路径统一用 `/images/xxx.png`（存放在 slide-editor/public/images/）
- 支持 border-radius、box-shadow 等装饰
```html
<img src="/images/fig1.png" style="position:absolute; left:680px; top:100px; width:500px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
```

### 4.2 容器型元素（卡片/表格）
- 外层容器 `position:absolute` + left/top/width 定位
- 内部元素用正常流布局（relative/static），允许嵌套
- 表格：直接用 `<table>` 标签，外层 absolute div 包裹
```html
<div style="position:absolute; left:60px; top:200px; width:600px; background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <div style="font-size:18px; font-weight:600; margin-bottom:12px;">卡片标题</div>
  <div style="font-size:14px; color:#555;">卡片内容，内部正常流布局</div>
</div>
```

### 4.3 内容填充度
- 每页内容应合理分布在 960×540 画布上
- 避免所有元素挤在左上角，利用全画布空间
- 标题通常在 top:30~60px，正文从 top:120px 开始

## 五、避坑指南

### 5.1 编辑器相关
- **localStorage 缓存**：编辑器会缓存 slides 到 localStorage，新生成的 presentationData.js 不会自动覆盖 → 需清 localStorage 或硬刷新
- **双击编辑**：仅对无块级子元素的文本节点生效，组合容器双击不触发
- **拖拽前提**：元素必须 `position:absolute` 才能拖拽
- **克隆行/列**：先点击容器选中→再点击内部行选中→按克隆按钮

### 5.2 数据校验
- 所有数值必须与原文逐一对应，禁止凭印象填写
- 每次修改后重新验证数据未被意外改动

### 5.3 样式注意
- 禁止全局替换颜色值（不同区域颜色有不同语义）
- 修改前必须备份，修改后逐页验证

### 5.4 数学公式（KaTeX）
- 编辑器已集成 KaTeX CDN，`renderSlide()` 后自动渲染 `$$...$$` 和 `$...$`
- **行内公式**：`$E=mc^2$`
- **独立块公式**：`$$H(p, q) = -\\sum_{x} p(x) \\log q(x)$$`
- innerHTML 中写 LaTeX 语法（反斜杠需双转义 `\\\\`），禁止用 Unicode 符号拼公式
- 公式放在普通 `<div>` 内即可，渲染时自动替换为 KaTeX HTML

## 六、快速检查清单
- [ ] 所有顶层元素 position:absolute
- [ ] 样式全内联（无外部 class 依赖）
- [ ] 画布 960×540，内容合理分布
- [ ] 图片路径 `/images/xxx.png`，文件存在于 public/images/
- [ ] 容器内部正常流布局，外层 absolute
- [ ] 数据与原文一致
- [ ] dev server 启动后浏览器可正常预览

## 七、导出PPT（截图→PPTX）

### 7.1 工具
`tools/export_pptx.py` — Selenium headless 逐页截图 + python-pptx 组装

### 7.2 用法
```bash
# 默认：截图 localhost:3001，输出 exported.pptx
python tools/export_pptx.py

# 自定义
python tools/export_pptx.py --url http://localhost:3001 --output my_slides.pptx
```

### 7.3 原理
1. Chrome headless 打开编辑器页面（`--force-device-scale-factor=2` 高清）
2. 遍历缩略图，逐页点击切换 + 截图 canvas 区域
3. 裁剪为精确 16:9 比例
4. python-pptx 将每张图片作为全屏幻灯片插入

### 7.4 前置条件
- dev server 运行中（`npm run dev -- --port 3001`）
- Chrome/Chromium 已安装
- `pip install selenium python-pptx Pillow`

### 7.5 避坑
- PPT 文件被打开时无法覆盖写入 → 换文件名或先关闭
- `--force-device-scale-factor=2` 产生 2x 高清图
- 截图前等待 0.5s 确保页面渲染完成

## 八、AI 生图（gpt-image-2）

### 8.1 工具
`tools/image_generator.py` — 调用 gpt-image-2 API 生成图片

### 8.2 用法
```python
from tools.image_generator import generate_image, generate_and_save

# 生成并保存到 slide-editor/public/images/
path = await generate_and_save(
    "扁平化风格的词法分析流程图，蓝白配色，简洁现代",
    "slide-editor/public/images/lexer_flow.png"
)
```

### 8.3 Prompt 技巧
- 明确风格：「扁平化/科技风/手绘风/3D渲染」
- 明确配色：与 PPT 主题色一致（如蓝白、暗色系）
- 明确内容：描述图中应有的元素和布局
- 尺寸：默认 1024x1024，可指定 `size="1792x1024"` 横版

### 8.4 典型场景
| 场景 | Prompt 示例 |
|------|------------|
| 封面背景 | "抽象科技感背景，深蓝渐变，几何线条，16:9" |
| 流程图 | "词法分析流程：源代码→扫描器→Token序列，扁平风格" |
| 概念图 | "有限状态自动机示意图，圆形节点+箭头，简洁白底" |
| 装饰图 | "代码编辑器界面截图风格，暗色主题，显示语法高亮" |

### 8.5 在 HTML 中引用
```html
<img src="/images/lexer_flow.png" style="position:absolute; left:650px; top:120px; width:550px; border-radius:12px;">
```

