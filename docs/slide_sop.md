# Slide-Editor 统一入口 SOP

## 模式判断

| 条件 | 模式 | 参考SOP |
|------|------|---------|
| 用户提供 .pptx 文件 | **模板模式** | `template_fill_sop.md` |
| 用户无 .pptx，要从零创作 | **创作模式** | `creative_sop.md` |
| 需要AI生成插图 | **生图增强**（可叠加） | `creative_sop.md` 第八节 |

## 模板模式流程
```
1. python pptx2slides.py input.pptx   # 一键转换(export_bg + parse + convert)
2. npx vite --port 3001               # 启动编辑器预览
3. 按 template_fill_sop 替换内容       # 定位页面→替换文本→验证
```

## 创作模式流程
```
1. 内容规划（页数、主题、配图需求）
2. [可选] gpt-image-2 生成插图 → public/images/
3. 按 creative_sop 逐页写 presentationData.js
4. npx vite --port 3001 预览
```

## gpt-image-2 生图（可选增强）

适用于两种模式。当需要自定义插图时：

```python
from tools.image_generator import generate_and_save

path = await generate_and_save(
    prompt="扁平风格插图，描述...",
    filename="slide-editor/public/images/xxx.png",
    size="1792x1024"  # 16:9 适配幻灯片
)
```

HTML中引用：
```html
<img src="/images/xxx.png" style="position:absolute; left:50px; top:80px; width:400px;">
```

### Prompt 技巧
- 加"扁平风格/矢量风格"避免写实照片感
- 加"白底/透明背景"便于叠加
- 尺寸用 1792x1024（16:9）或 1024x1024（正方形图标）

## 共同规范
- 画布尺寸：960×540px
- 定位：所有元素 `position:absolute`
- 数据格式：`export const slides = [{ innerHTML: "..." }, ...]`
- Server：`npx vite --port 3001`

## Token 优化
- 模板模式单页替换：~5K tokens
- 创作模式单页生成：~3K tokens
- 不要读完整 presentationData.js（106K），按行号定位目标 slide
