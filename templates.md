# Slide Editor 排版模板库

> 画布尺寸：960×540px，所有元素 `position:absolute` 定位。

## 封面页

### 渐变封面
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:linear-gradient(135deg,#667eea,#764ba2);">
  <div style="position:absolute;left:80px;top:180px;font-size:48px;color:#fff;font-weight:bold;">主标题</div>
  <div style="position:absolute;left:80px;top:250px;font-size:24px;color:rgba(255,255,255,0.8);">副标题说明</div>
  <div style="position:absolute;left:80px;top:460px;font-size:16px;color:rgba(255,255,255,0.6);">演讲者 · 2026.01</div>
</div>
```

### 图片封面（带蒙版）
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;">
  <img src="/images/cover.jpg" style="width:960px;height:540px;object-fit:cover;" />
  <div style="position:absolute;left:0;top:0;width:960px;height:540px;background:rgba(0,0,0,0.4);"></div>
  <div style="position:absolute;left:80px;top:200px;font-size:48px;color:#fff;font-weight:bold;">主标题</div>
  <div style="position:absolute;left:80px;top:270px;font-size:22px;color:rgba(255,255,255,0.85);">副标题</div>
</div>
```

### 极简封面
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:80px;top:220px;font-size:52px;color:#1a1a1a;font-weight:700;">主标题</div>
  <div style="position:absolute;left:80px;top:290px;width:120px;height:4px;background:#2563eb;"></div>
  <div style="position:absolute;left:80px;top:320px;font-size:20px;color:#666;">副标题描述文字</div>
</div>
```

## 内容页

### 左文右图
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:40px;font-size:32px;font-weight:bold;color:#333;">标题</div>
  <div style="position:absolute;left:60px;top:100px;width:400px;font-size:18px;color:#555;line-height:1.8;">
    正文内容，支持多行排版。<br/>• 要点一<br/>• 要点二<br/>• 要点三
  </div>
  <img src="/images/xxx.png" style="position:absolute;right:40px;top:80px;width:400px;height:380px;object-fit:cover;border-radius:12px;" />
</div>
```

### 上标题下内容
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#f8f9fa;">
  <div style="position:absolute;left:60px;top:40px;font-size:32px;font-weight:bold;color:#1a1a1a;">标题</div>
  <div style="position:absolute;left:60px;top:100px;width:840px;font-size:18px;color:#444;line-height:2;">
    详细内容段落，适合纯文字说明页面。可以包含多段文字，每段之间用换行分隔。
  </div>
</div>
```

### 三栏并列
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#f8f9fa;">
  <div style="position:absolute;left:60px;top:40px;font-size:32px;font-weight:bold;">标题</div>
  <div style="position:absolute;left:60px;top:120px;width:260px;height:360px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="font-size:36px;margin-bottom:12px;">🎯</div>
    <div style="font-size:20px;font-weight:bold;margin-bottom:8px;">栏目1</div>
    <div style="font-size:15px;color:#666;line-height:1.6;">描述内容</div>
  </div>
  <div style="position:absolute;left:350px;top:120px;width:260px;height:360px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="font-size:36px;margin-bottom:12px;">🚀</div>
    <div style="font-size:20px;font-weight:bold;margin-bottom:8px;">栏目2</div>
    <div style="font-size:15px;color:#666;line-height:1.6;">描述内容</div>
  </div>
  <div style="position:absolute;left:640px;top:120px;width:260px;height:360px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="font-size:36px;margin-bottom:12px;">💡</div>
    <div style="font-size:20px;font-weight:bold;margin-bottom:8px;">栏目3</div>
    <div style="font-size:15px;color:#666;line-height:1.6;">描述内容</div>
  </div>
</div>
```

### 四宫格
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">标题</div>
  <div style="position:absolute;left:60px;top:90px;width:400px;height:190px;background:#f0f4ff;border-radius:12px;padding:20px;">
    <div style="font-size:18px;font-weight:bold;color:#2563eb;">模块1</div>
    <div style="font-size:15px;color:#555;margin-top:8px;">说明文字</div>
  </div>
  <div style="position:absolute;left:500px;top:90px;width:400px;height:190px;background:#f0fdf4;border-radius:12px;padding:20px;">
    <div style="font-size:18px;font-weight:bold;color:#059669;">模块2</div>
    <div style="font-size:15px;color:#555;margin-top:8px;">说明文字</div>
  </div>
  <div style="position:absolute;left:60px;top:310px;width:400px;height:190px;background:#fef3c7;border-radius:12px;padding:20px;">
    <div style="font-size:18px;font-weight:bold;color:#d97706;">模块3</div>
    <div style="font-size:15px;color:#555;margin-top:8px;">说明文字</div>
  </div>
  <div style="position:absolute;left:500px;top:310px;width:400px;height:190px;background:#fce7f3;border-radius:12px;padding:20px;">
    <div style="font-size:18px;font-weight:bold;color:#db2777;">模块4</div>
    <div style="font-size:15px;color:#555;margin-top:8px;">说明文字</div>
  </div>
</div>
```

## 图表页

### 柱状图
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">数据对比</div>
  <svg style="position:absolute;left:80px;top:80px;width:800px;height:400px;" viewBox="0 0 800 400">
    <line x1="60" y1="350" x2="760" y2="350" stroke="#e5e7eb" stroke-width="1"/>
    <line x1="60" y1="250" x2="760" y2="250" stroke="#e5e7eb" stroke-width="0.5" stroke-dasharray="4"/>
    <line x1="60" y1="150" x2="760" y2="150" stroke="#e5e7eb" stroke-width="0.5" stroke-dasharray="4"/>
    <rect x="120" y="150" width="80" height="200" fill="#2563eb" rx="4"/>
    <rect x="260" y="200" width="80" height="150" fill="#60a5fa" rx="4"/>
    <rect x="400" y="100" width="80" height="250" fill="#2563eb" rx="4"/>
    <rect x="540" y="180" width="80" height="170" fill="#60a5fa" rx="4"/>
    <text x="160" y="375" text-anchor="middle" font-size="14" fill="#666">Q1</text>
    <text x="300" y="375" text-anchor="middle" font-size="14" fill="#666">Q2</text>
    <text x="440" y="375" text-anchor="middle" font-size="14" fill="#666">Q3</text>
    <text x="580" y="375" text-anchor="middle" font-size="14" fill="#666">Q4</text>
  </svg>
</div>
```

### 饼图
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">占比分析</div>
  <svg style="position:absolute;left:250px;top:80px;width:360px;height:360px;" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" stroke-width="35" stroke-dasharray="150 503" stroke-dashoffset="0"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="#60a5fa" stroke-width="35" stroke-dasharray="120 503" stroke-dashoffset="-150"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="#93c5fd" stroke-width="35" stroke-dasharray="233 503" stroke-dashoffset="-270"/>
  </svg>
  <div style="position:absolute;right:80px;top:180px;font-size:16px;line-height:2.2;">
    <span style="display:inline-block;width:12px;height:12px;background:#2563eb;border-radius:2px;margin-right:8px;"></span>类别A 30%<br/>
    <span style="display:inline-block;width:12px;height:12px;background:#60a5fa;border-radius:2px;margin-right:8px;"></span>类别B 24%<br/>
    <span style="display:inline-block;width:12px;height:12px;background:#93c5fd;border-radius:2px;margin-right:8px;"></span>类别C 46%
  </div>
</div>
```

### 折线图
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">趋势变化</div>
  <svg style="position:absolute;left:80px;top:80px;width:800px;height:400px;" viewBox="0 0 800 400">
    <line x1="60" y1="350" x2="760" y2="350" stroke="#e5e7eb" stroke-width="1"/>
    <polyline points="100,300 220,250 340,180 460,200 580,120 700,80" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="100,300 220,250 340,180 460,200 580,120 700,80" fill="url(#grad)" stroke="none" opacity="0.1"/>
    <circle cx="100" cy="300" r="5" fill="#2563eb"/><circle cx="220" cy="250" r="5" fill="#2563eb"/>
    <circle cx="340" cy="180" r="5" fill="#2563eb"/><circle cx="460" cy="200" r="5" fill="#2563eb"/>
    <circle cx="580" cy="120" r="5" fill="#2563eb"/><circle cx="700" cy="80" r="5" fill="#2563eb"/>
  </svg>
</div>
```

## 特殊页

### 时间线
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">发展历程</div>
  <div style="position:absolute;left:100px;top:270px;width:760px;height:3px;background:#e5e7eb;"></div>
  <div style="position:absolute;left:150px;top:260px;width:16px;height:16px;background:#2563eb;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb;"></div>
  <div style="position:absolute;left:130px;top:200px;font-size:14px;font-weight:bold;color:#2563eb;">2020</div>
  <div style="position:absolute;left:120px;top:290px;font-size:13px;color:#666;width:80px;text-align:center;">项目启动</div>
  <div style="position:absolute;left:350px;top:260px;width:16px;height:16px;background:#2563eb;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb;"></div>
  <div style="position:absolute;left:330px;top:200px;font-size:14px;font-weight:bold;color:#2563eb;">2022</div>
  <div style="position:absolute;left:320px;top:290px;font-size:13px;color:#666;width:80px;text-align:center;">产品发布</div>
  <div style="position:absolute;left:550px;top:260px;width:16px;height:16px;background:#2563eb;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #2563eb;"></div>
  <div style="position:absolute;left:530px;top:200px;font-size:14px;font-weight:bold;color:#2563eb;">2024</div>
  <div style="position:absolute;left:520px;top:290px;font-size:13px;color:#666;width:80px;text-align:center;">规模扩张</div>
  <div style="position:absolute;left:750px;top:260px;width:16px;height:16px;background:#059669;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #059669;"></div>
  <div style="position:absolute;left:730px;top:200px;font-size:14px;font-weight:bold;color:#059669;">2026</div>
  <div style="position:absolute;left:720px;top:290px;font-size:13px;color:#666;width:80px;text-align:center;">未来展望</div>
</div>
```

### 对比页（VS）
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">方案对比</div>
  <div style="position:absolute;left:60px;top:90px;width:400px;height:400px;background:#f0f4ff;border-radius:16px;padding:30px;">
    <div style="font-size:22px;font-weight:bold;color:#2563eb;margin-bottom:16px;">方案 A</div>
    <div style="font-size:16px;color:#555;line-height:2;">• 优势一<br/>• 优势二<br/>• 优势三</div>
  </div>
  <div style="position:absolute;left:440px;top:250px;width:60px;height:60px;background:#1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;color:#fff;line-height:60px;text-align:center;">VS</div>
  <div style="position:absolute;left:500px;top:90px;width:400px;height:400px;background:#fef3c7;border-radius:16px;padding:30px;">
    <div style="font-size:22px;font-weight:bold;color:#d97706;margin-bottom:16px;">方案 B</div>
    <div style="font-size:16px;color:#555;line-height:2;">• 优势一<br/>• 优势二<br/>• 优势三</div>
  </div>
</div>
```

### 数据卡片
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#f8f9fa;">
  <div style="position:absolute;left:60px;top:30px;font-size:28px;font-weight:bold;">核心数据</div>
  <div style="position:absolute;left:60px;top:100px;width:200px;height:160px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="font-size:36px;font-weight:bold;color:#2563eb;">98%</div>
    <div style="font-size:14px;color:#888;margin-top:8px;">用户满意度</div>
  </div>
  <div style="position:absolute;left:290px;top:100px;width:200px;height:160px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="font-size:36px;font-weight:bold;color:#059669;">50K+</div>
    <div style="font-size:14px;color:#888;margin-top:8px;">活跃用户</div>
  </div>
  <div style="position:absolute;left:520px;top:100px;width:200px;height:160px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="font-size:36px;font-weight:bold;color:#d97706;">3.2s</div>
    <div style="font-size:14px;color:#888;margin-top:8px;">平均响应</div>
  </div>
  <div style="position:absolute;left:750px;top:100px;width:200px;height:160px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="font-size:36px;font-weight:bold;color:#dc2626;">99.9%</div>
    <div style="font-size:14px;color:#888;margin-top:8px;">可用性</div>
  </div>
</div>
```

### 全图页（带文字叠加）
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;">
  <img src="/images/fullpage.jpg" style="width:960px;height:540px;object-fit:cover;" />
  <div style="position:absolute;left:0;bottom:0;width:960px;height:200px;background:linear-gradient(transparent,rgba(0,0,0,0.7));"></div>
  <div style="position:absolute;left:60px;bottom:80px;font-size:36px;color:#fff;font-weight:bold;">引用或金句</div>
  <div style="position:absolute;left:60px;bottom:50px;font-size:16px;color:rgba(255,255,255,0.7);">—— 来源</div>
</div>
```

### 引用/金句页
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#0f172a;">
  <div style="position:absolute;left:120px;top:140px;font-size:72px;color:#334155;">"</div>
  <div style="position:absolute;left:120px;top:180px;width:720px;font-size:28px;color:#f1f5f9;line-height:1.8;font-style:italic;">
    这里放一段有力的引用或核心观点，用大字体突出展示。
  </div>
  <div style="position:absolute;left:120px;top:380px;font-size:16px;color:#64748b;">—— 引用来源</div>
</div>
```

## 结尾页

### 感谢页
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:linear-gradient(135deg,#1e293b,#334155);">
  <div style="position:absolute;left:0;top:200px;width:960px;text-align:center;font-size:48px;color:#fff;font-weight:bold;">Thank You</div>
  <div style="position:absolute;left:0;top:280px;width:960px;text-align:center;font-size:20px;color:rgba(255,255,255,0.6);">联系方式 · email@example.com</div>
</div>
```

### CTA 结尾
```html
<div style="position:absolute;left:0;top:0;width:960px;height:540px;background:#fff;">
  <div style="position:absolute;left:0;top:180px;width:960px;text-align:center;font-size:36px;font-weight:bold;color:#1a1a1a;">下一步行动</div>
  <div style="position:absolute;left:280px;top:280px;width:400px;height:56px;background:#2563eb;border-radius:28px;text-align:center;line-height:56px;font-size:20px;color:#fff;font-weight:bold;">立即开始 →</div>
  <div style="position:absolute;left:0;top:370px;width:960px;text-align:center;font-size:16px;color:#888;">扫码了解更多 | www.example.com</div>
</div>
```

## 图片处理技巧

### 圆角 + 阴影
```html
<img src="/images/x.png" style="position:absolute;left:Xpx;top:Ypx;width:Wpx;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.15);" />
```

### 圆形裁剪（头像）
```html
<img src="/images/avatar.jpg" style="position:absolute;left:Xpx;top:Ypx;width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />
```

### 蒙版叠加
```html
<div style="position:absolute;left:Xpx;top:Ypx;width:Wpx;height:Hpx;overflow:hidden;border-radius:12px;">
  <img src="/images/x.jpg" style="width:100%;height:100%;object-fit:cover;" />
  <div style="position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(37,99,235,0.3);"></div>
</div>
```
