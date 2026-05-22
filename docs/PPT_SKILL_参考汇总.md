# PPT Skill 调研汇总 — 对 slide-editor 的参考价值

> 调研时间：2026-05-22 | 来源：小红书热帖(25+) + GitHub仓库(10+) + awesome合集

## slide-editor 当前架构速览

| 层 | 实现 |
|---|---|
| 数据模型 | Slide{id, bg, bgColor, blocks[], shapes[]} |
| Block类型 | heading / text / list / image / cards / rawHtml |
| 编辑方式 | contenteditable + 拖拽排序 |
| 图形层 | SVG Shape(rect/circle/line/arrow) 绝对定位 |
| 主题 | CSS变量(ink/paper/accent×3/font)，4套预设 |
| 导出 | PPTX(已有exported.pptx) |
| 框架 | Vue3 + Vite |

---

## 一、HTML单文件派 — 最直接可参考

### 1. openrange7 (杂志风横滑HTML)
- **仓库**: github.com/openrange7
- **核心思路**: 单HTML文件，横向滑动，10种布局模板，5套策展主题，WebGL hero背景
- **对slide-editor的参考**:
  - ✅ **布局模板系统**: 10种预设layout(全屏图/左右分栏/三栏卡片/引用页/数据页等)，可直接映射为slide-editor的Block组合模板
  - ✅ **WebGL背景**: 用Three.js/shader做动态hero背景，比静态bgColor高级很多
  - ✅ **横滑交互**: CSS scroll-snap实现页面切换，比传统点击翻页更现代
  - ⚠️ 单文件不可编辑，需要拆解为数据驱动

### 2. ToseaAI/awesome-html-slide-skills (合集 Tier S)
- **Tier S 四大skill**: 
  - `frontend-slides` — 前端技术栈风格
  - `academic-slides` — 学术答辩风格
  - `business-deck` — 商务汇报风格  
  - `creative-portfolio` — 创意作品集风格
- **对slide-editor的参考**:
  - ✅ **风格分类体系**: 按场景(学术/商务/创意/技术)预设不同的排版规则和配色
  - ✅ **CSS动画库**: 入场/强调/退出动画，可集成为block级animation属性
  - ✅ **响应式网格**: 基于CSS Grid的自适应布局，比固定px定位更灵活

### 3. Slidev 派 (Claude Code + Slidev)
- **仓库**: slidevjs/slidev (Markdown→Vue幻灯片)
- **核心思路**: Markdown写内容 → Vue组件渲染 → 代码高亮/LaTeX/Mermaid内置
- **对slide-editor的参考**:
  - ✅ **Markdown快捷输入**: 用`---`分页，`#`标题，支持frontmatter元数据，可作为slide-editor的"快速输入模式"
  - ✅ **代码块渲染**: Shiki语法高亮 + 行号 + 高亮行，技术演讲必备，可新增`code` Block类型
  - ✅ **Mermaid/LaTeX集成**: 图表和公式原生支持，学术场景刚需
  - ⚠️ Slidev是开发者工具，不适合非技术用户；slide-editor应取其渲染能力而非其Markdown-only交互

---

## 二、PPTX原生派 — 导出能力参考

### 4. RehgLab/ArcDeck (论文→幻灯片)
- **仓库**: github.com/RehgLab/ArcDeck (43★)
- **核心思路**: PDF论文 → RST话语结构分析 → 叙事弧线规划 → 多Agent循环生成 → python-pptx/PptxGenJS双渲染
- **对slide-editor的参考**:
  - ✅ **叙事结构**: 用RST(修辞结构理论)分析内容逻辑关系，自动决定哪些内容放同一页、如何分层
  - ✅ **双渲染引擎**: python-pptx(后端批量) + PptxGenJS(前端实时预览)，slide-editor可借鉴PptxGenJS做浏览器端PPTX导出
  - ✅ **多Agent架构**: Planner→Writer→Reviewer循环，可作为AI辅助生成的后端pipeline
  - ✅ **图表提取**: 自动从论文PDF提取figure并放入对应slide

### 5. ppt-master (hugohe3)
- **仓库**: github.com/hugohe3/ppt-master (450MB+大仓库)
- **核心思路**: 大上下文模型(200K token)一次性生成完整PPT，内含大量高质量模板JSON
- **对slide-editor的参考**:
  - ✅ **模板JSON库**: 数百个预设模板，每个模板定义了布局、配色、字体、动画参数
  - ✅ **一次性生成策略**: 给AI完整的模板schema + 用户需求 → 直接输出符合schema的JSON
  - ✅ **样式token压缩**: 用缩写/引用减少重复样式定义，降低AI生成的token消耗
  - ⚠️ 依赖超大上下文窗口，成本高；slide-editor可取其模板库但用分步生成策略

### 6. Anthropic 官方 PPTX Skill
- **来源**: Anthropic官方示例 / altinity-skills文档
- **核心思路**: python-pptx封装，支持读取/生成/调整slides、layouts、templates
- **对slide-editor的参考**:
  - ✅ **PPTX Schema映射**: 官方定义了slide→layout→placeholder的层级关系
  - ✅ **母版/版式系统**: 每个slide引用一个layout，layout定义placeholder位置和样式
  - ✅ **增量编辑**: 支持"调整已有PPT"而非只能从零生成，slide-editor的导出应保留可再编辑性

---

## 三、学术/专业派 — 内容生成逻辑参考

### 7. K-Dense-AI/scientific-agent-skills (学术PPT)
- **核心思路**: 论文/文献 → 结构化提取(摘要/方法/结果/结论) → 学术风格PPT
- **对slide-editor的参考**:
  - ✅ **内容结构模板**: 学术PPT固定结构(Title→Outline→Background→Method→Results→Conclusion→Q&A)
  - ✅ **图表自动布局**: 根据figure数量自动选择1图/2图并排/4图网格布局
  - ✅ **引用格式**: 自动生成参考文献slide，带编号和格式化

### 8. 女娲/花叔 PPT工作流
- **来源**: 小红书216赞帖子，将"女娲"AI装进PPT工作流
- **核心思路**: AI生成内容大纲 → 逐页细化 → 配图建议 → 排版微调
- **对slide-editor的参考**:
  - ✅ **渐进式生成**: 先大纲→再逐页展开，而非一次性全量生成(降低AI幻觉)
  - ✅ **配图建议系统**: AI根据内容推荐图片关键词/风格，用户确认后搜索或生成
  - ✅ **人机协作循环**: 每步都有用户确认点，不是全自动黑盒

---

## 四、综合平台/工具派 — 架构设计参考

### 9. BehiSecc/awesome-claude-skills 分类体系
- **PPT相关skill分类**: pptx(读写调整) / xlsx(数据图表) / diagram(流程图) / chart(可视化)
- **对slide-editor的参考**:
  - ✅ **能力分层**: 将PPT能力拆为独立skill(布局/配色/动画/导出/数据可视化)，按需加载
  - ✅ **跨格式联动**: xlsx数据 → chart图表 → slide嵌入，形成数据驱动的演示

### 10. altinity-skills (文档→PPT)
- **核心思路**: 已有文档(Markdown/Word/PDF) → 自动提取关键内容 → 生成PPT
- **对slide-editor的参考**:
  - ✅ **导入pipeline**: 支持从多种格式导入内容，自动拆分为slides
  - ✅ **智能分页**: 根据内容量和逻辑断点自动决定分页位置
  - ✅ **保留层级**: 文档的H1→分节，H2→slide标题，H3→要点

---

## 五、对 slide-editor 的优先级建议

### 🔴 高优先级（立即可做）

| 参考来源 | 具体改进 | 实现难度 |
|---|---|---|
| openrange7 | 新增10+种**布局模板**(全屏/左右/上下/三栏/引用页) | ⭐⭐ |
| ppt-master | **模板JSON库**：预设20+套完整演示模板 | ⭐⭐ |
| Slidev | 新增`code` Block类型(语法高亮) | ⭐⭐ |
| altinity | **Markdown导入**：粘贴MD自动拆分为slides | ⭐⭐ |
| ArcDeck | **PptxGenJS导出**：浏览器端直接生成.pptx | ⭐⭐⭐ |

### 🟡 中优先级（显著提升体验）

| 参考来源 | 具体改进 | 实现难度 |
|---|---|---|
| ToseaAI合集 | **CSS动画系统**：block级入场/强调/退出动画 | ⭐⭐⭐ |
| 女娲工作流 | **AI渐进生成**：大纲→逐页→配图建议 | ⭐⭐⭐ |
| K-Dense-AI | **场景模板**：学术/商务/技术/创意4套预设结构 | ⭐⭐ |
| Anthropic官方 | **母版/版式系统**：slide引用layout模板 | ⭐⭐⭐ |
| openrange7 | **主题扩展**：从4套→12+套，含暗色/渐变/纹理 | ⭐⭐ |

### 🟢 低优先级（锦上添花）

| 参考来源 | 具体改进 | 实现难度 |
|---|---|---|
| openrange7 | WebGL动态背景(粒子/渐变流动) | ⭐⭐⭐⭐ |
| Slidev | Mermaid/LaTeX渲染(学术场景) | ⭐⭐⭐ |
| ArcDeck | 多Agent内容规划(RST话语分析) | ⭐⭐⭐⭐⭐ |
| ppt-master | 超大上下文一次性生成(需200K模型) | ⭐⭐ |

---

## 六、关键技术选型建议

1. **PPTX导出**: 推荐 PptxGenJS (浏览器端，MIT协议，slide-editor的JSON模型可直接映射)
2. **代码高亮**: 推荐 Shiki (Slidev同款，支持150+语言，体积小)
3. **动画系统**: 推荐 CSS Animation + Intersection Observer (轻量，不依赖库)
4. **AI生成接口**: 推荐分步策略(女娲模式) > 一次性全量(ppt-master模式)
5. **模板格式**: 推荐JSON Schema定义(与现有Block模型兼容)，参考ppt-master的模板结构

---

## 七、小红书深度调研补充（2026-05-22 第二轮）

> 来源：小红书6个高赞帖子详情 + 20+搜索结果标题分析

### 11. zarazhang/frontend-slides ⭐15.5k（最热门HTML Skill）
- **来源**: salt(3985赞) + Kett(775赞对比帖) + Anthropic官方推荐
- **核心特点**:
  - 12套精选风格（深色/浅色/特色三类）
  - **反AI slop哲学**：明确禁用Inter、Roboto和紫渐变白底等烂大街组合
  - 支持PPT→HTML双向转换
  - salt的工作流：HTML当审美指导 → 提取设计方案 → python-pptx执行生成可编辑PPTX
- **对slide-editor的参考**:
  - ✅ **反AI审美约束**: 建立"禁用列表"(字体/配色/布局组合)，避免千篇一律
  - ✅ **HTML→PPTX桥接**: 先用HTML做视觉原型，再转为可编辑格式
  - ✅ **风格分类**: 深色系/浅色系/特色系三级分类，用户按场景选择


### 12. lewislulu/html-ppt-skill ⭐1.98k（功能最全HTML Skill）
- **来源**: Kett对比帖(775赞)
- **核心特点**:
  - 36个主题（Catppuccin/Dracula/Nord/Solarized等开发者经典配色 + 架构图专用主题）
  - 31种布局模板 + 演讲者模式（按S键）
  - 47个动画：27个CSS动画 + 20个Canvas特效
  - 内置逐字稿功能
- **对slide-editor的参考**:
  - ✅ **动画分层**: CSS动画(轻量入场) vs Canvas特效(重度视觉)，按性能需求分级
  - ✅ **演讲者模式**: 双屏显示(演示屏+备注屏)，slide-editor可新增presenter view
  - ✅ **开发者配色**: 直接复用Catppuccin/Nord等成熟配色方案作为主题预设
  - ✅ **逐字稿**: 每页slide关联speaker notes，导出时可选是否包含

### 13. Faustus 多Agent答辩PPT工作流（1474赞）
- **核心思路**: 4个独立Agent分工协作，避免单Agent上下文污染
  - Agent 1: 模板提取（从参考PPT截图提取设计规范）
  - Agent 2: 素材库管理（图片/图表/数据整理）
  - Agent 3: PRD大纲（结构化内容规划）
  - Agent 4: 最终生成（Beamer LaTeX渲染）
- **对slide-editor的参考**:
  - ✅ **多Agent架构**: AI生成PPT时拆分为独立步骤，每步专注单一任务
  - ✅ **模板提取能力**: 从截图/参考PPT反向提取设计规范(配色/字体/布局比例)
  - ✅ **上下文隔离**: 每个生成步骤独立上下文，避免前序内容干扰后续生成质量
  - ⚠️ Beamer LaTeX路线对非学术用户不友好，但多Agent思路通用


### 14. 米小哇"模板适配器"工作流（2394赞）
- **核心思路**: 不从零生成，而是"视觉克隆"参考模板 + 内容适配
  - 视觉克隆：严格复刻模板的布局比例/配色方案/元素形状
  - 内容适配：结构对齐 + 智能精简 + 逻辑增强(图标匹配)
  - 技术规范：16:9(1280×720)、Montserrat/Inter字体、40px页边距
- **对slide-editor的参考**:
  - ✅ **模板克隆模式**: 用户上传参考图 → AI提取布局比例/配色/形状 → 生成同风格新内容
  - ✅ **智能精简**: AI自动将长文本精炼为适合PPT的短句，保留核心意思
  - ✅ **图标自动匹配**: 根据内容语义自动推荐图标(风险⚠️/成功⭐/流程➔)
  - ✅ **留白规范**: 强制40px+页边距，避免内容堆叠

### 15. PPT Master 深度补充（Kett 3741赞详解）
- **三角色架构**:
  - 策略师：内容分析+设计规划，确认8件事(画布/页数/受众/风格/配色/图标/字体/图片策略)
  - 图片生成师：AI生成配图(可选)
  - 执行师：SVG代码逐页生成 → 后处理脚本转DrawingML(PowerPoint原生格式)
- **关键数据**: 15个示例项目/229页，覆盖咨询风/学术风/像素复古风/杂志风/发布会风
- **对slide-editor的参考**:
  - ✅ **SVG中间格式**: 先生成SVG(AI擅长) → 转目标格式，比直接生成PPTX XML更可控
  - ✅ **8项确认清单**: 生成前强制用户确认关键参数，减少返工
  - ✅ **6000+ Tabler图标库**: 内置图标搜索，AI自动匹配
  - ✅ **多格式输出**: 同一内容适配16:9/4:3/小红书竖版/朋友圈方图/A4打印

### 16. 歸藏 guizang-ppt-skill 深度补充（1万⭐，2小时前宣布）
- **设计哲学**: "保护美学比给自由更重要"
  - 不允许自定义hex值，只能五选一主题
  - 衬线大标题 + 非衬线正文 + 等宽元数据 = 三级字体分工
  - 6步结构化工作流：强制需求澄清 + checklist自检
- **对slide-editor的参考**:
  - ✅ **约束式设计**: 限制用户自由度反而提升整体美感(如只提供预设主题不开放自定义色)
  - ✅ **三级字体系统**: heading用衬线/body用无衬线/meta用等宽，层次分明
  - ✅ **结构化工作流**: 生成前强制走需求澄清→方案确认→生成→自检的完整流程


---

## 八、小红书热度趋势与生态洞察

> 基于30+搜索结果的标题/赞数/时间分析

### 当前PPT Skill生态格局（2026年5月）

| 项目 | Star | 赞数(小红书) | 路线 | 热度趋势 |
|---|---|---|---|---|
| zarazhang/frontend-slides | 15.5k | 3985 | HTML单文件 | 🔥🔥🔥 最热门 |
| op7418/guizang-ppt-skill | 10k+ | 1040 | HTML杂志风 | 🔥🔥🔥 刚破万星 |
| hugohe3/ppt-master | - | 3741 | SVG→DrawingML | 🔥🔥 技术最深 |
| lewislulu/html-ppt-skill | 1.98k | 775 | HTML全功能 | 🔥🔥 功能最全 |

### 社区共识趋势

1. **HTML派压倒性胜出**: 高赞帖子90%推荐HTML路线，原因：AI生成HTML比生成PPTX XML容易10倍
2. **"可编辑"成刚需**: ZzzzzU(2192赞)"直出可编辑PPT"、破壁(733赞)"可编辑HTML PPT 2.0"——用户最痛点是AI生成的不能改
3. **模板克隆>从零生成**: 米小哇(2394赞)证明"适配参考模板"比"凭空生成"效果好得多
4. **多Agent分工成主流**: Faustus的4Agent模式被广泛认可，单Agent生成质量不稳定
5. **约束式设计受追捧**: 歸藏"不给自由反而更美"的哲学获1万Star验证

### 对 slide-editor 的追加建议（基于社区热度）

| 优先级 | 建议 | 依据 |
|---|---|---|
| 🔴 P0 | 支持**模板克隆**：上传参考图→提取风格→生成同风格内容 | 米小哇2394赞验证 |
| 🔴 P0 | **反AI slop**：内置禁用规则(禁Inter+紫渐变白底) | frontend-slides 15.5k⭐核心卖点 |
| 🟡 P1 | **演讲者模式**：双屏(演示+备注) | lewislulu skill标配功能 |
| 🟡 P1 | **SVG中间层**：AI生成SVG→转目标格式 | PPT Master的核心技术路线 |
| 🟡 P1 | **三级字体系统**：衬线标题+无衬线正文+等宽元数据 | 歸藏1万⭐设计哲学 |
| 🟢 P2 | **多Agent生成**：拆分为规划/设计/执行三步 | Faustus 1474赞验证 |

### 17. 破壁BreakingWall frontend-slides-editable 2.0（733赞）⚡直接竞品
- **来源**: 破壁BreakingWall，基于zarazhang/frontend-slides的可编辑衍生版
- **核心痛点解决**: "好看"和"好改"同时集成在HTML文件里并保持轻量化
- **功能清单**:
  - 直接在浏览器里改文字、调字体样式/大小
  - 自由添加和删除文字/图片/视频元素
  - 带自动对齐辅助的元素拖动
  - 内置页面缩略图，快速管理并跳转页面
  - 可保存当前deck状态，下次打开还能继续改
  - 新增beautiful-html-templates中的7+30套样式预设
- **核心理念**: "不是生成完就结束的一次性工具，而是生成后还能随时修改"
- **对slide-editor的参考**:
  - ⚡ **这是slide-editor的直接竞品！** 定位高度重合
  - ✅ **自动对齐辅助**: 拖动时显示对齐线(磁吸效果)，slide-editor应优先实现
  - ✅ **状态持久化**: 保存/恢复编辑状态，支持断点续编
  - ✅ **缩略图导航**: 左侧缩略图面板快速跳转，slide-editor已有类似功能
  - ✅ **轻量化**: 单HTML文件即可运行，无需服务器
  - ⚠️ **差异化方向**: slide-editor需要在"可编辑"基础上做出差异——更强的AI辅助/更丰富的Block类型/更好的协作能力


---

## 九、slide-editor 完整功能对比与优势分析（核心输出）

> 基于slide-editor源码逐行审计 + 7个高赞竞品详情 + 26个Skill全景梳理

### A. slide-editor 已实现功能全景（基于源码审计）

| 模块 | 已实现功能 | 源码位置 |
|---|---|---|
| **画布引擎** | 1280×720画布 + ResizeObserver自适应缩放 + 溢出裁切 | App.vue |
| **元素选择** | 单击选中 + 多选 + 选中高亮轮廓 + Escape取消 | HtmlCanvas.vue |
| **自由拖拽** | 任意元素absolute定位拖动 + 实时位置更新 | HtmlCanvas.vue |
| **智能对齐** | 拖动时自动显示水平/垂直对齐辅助线(磁吸) | HtmlCanvas.vue guides |
| **8方向缩放** | 选中元素显示8个Resize手柄，支持任意方向缩放 | HtmlCanvas.vue resizeHandles |
| **分组编辑** | 双击进入组内(Group)，独立编辑子元素 | HtmlCanvas.vue enterGroup |
| **文字编辑** | 双击进入contentEditable模式，直接修改文字 | HtmlCanvas.vue onDblClick |
| **浮动工具栏** | 字体(7种)/字号/加粗/对齐(左中右)/文字色/背景色/透明度 | FloatingToolbar.vue |
| **Undo/Redo** | 50步历史栈，Ctrl+Z/Ctrl+Y | HtmlCanvas.vue history |
| **复制粘贴** | Ctrl+C/V复制元素(自动偏移20px) + 图片剪贴板粘入 | HtmlCanvas.vue clipboard |
| **克隆元素** | 向前/向后克隆选中元素 | App.vue onCloneBefore/After |
| **删除元素** | Delete键删除 + 工具栏🗑按钮 | HtmlCanvas.vue + FloatingToolbar |
| **缩略图面板** | 左侧页面缩略图列表，点击跳转 | App.vue thumbnails |
| **页面管理** | 新增页/删除页/页面排序 | App.vue addSlide |
| **主题系统** | 4套主题(Memphis/Ocean/Forest/Midnight) + CSS变量驱动 | themes.js |
| **形状工具** | 矩形/圆形/三角形/线条，可自由绘制 | useShapes.js |
| **图片上传** | 文件选择器上传 + 剪贴板粘贴 + 自由定位 | App.vue + HtmlCanvas |
| **持久化** | localStorage自动保存 + Ctrl+S保存JSON文件 | App.vue saveSlides |
| **导入导出** | JSON文件导入/导出 + PPTX导出 | App.vue |
| **自适应布局** | 窗口resize时画布自动缩放适配 | App.vue ResizeObserver |
| **键盘快捷键** | Ctrl+S/Z/Y/C/V + Delete + Escape 完整快捷键体系 | 全局 |

### B. 与全网热门Skill逐项对比

#### 📊 功能维度对比矩阵

| 功能 | slide-editor | 破壁editable 2.0 | frontend-slides | guizang | PPT Master | lewislulu |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **可视化编辑** | ✅ 完整 | ✅ 基础 | ❌ | ❌ | ❌ | ❌ |
| **元素自由拖拽** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **智能对齐辅助线** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **8方向Resize** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **分组/解组编辑** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **多选操作** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Undo/Redo** | ✅ 50步 | ❌ | ❌ | ❌ | ❌ | ❌ |
| **浮动属性面板** | ✅ 完整 | 部分 | ❌ | ❌ | ❌ | ❌ |
| **图片粘贴** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **形状绘制** | ✅ 4种 | ❌ | ❌ | ❌ | ❌ | ❌ |
| **主题切换** | ✅ 4套 | ✅ 30+ | ❌ | ✅ 5套 | ✅ 20套 | ❌ |
| **缩略图导航** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **PPTX导出** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **JSON数据模型** | ✅ | ❌(纯HTML) | ❌ | ❌ | ❌ | ❌ |
| **localStorage持久化** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **键盘快捷键** | ✅ 完整 | 部分 | ❌ | ❌ | ❌ | ❌ |
| **演讲者模式** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **AI生成工作流** | 🔜 | ❌ | ✅ | ✅ | ✅ | ✅ |
| **模板数量** | 基础 | 30+ | 高审美 | 50+ | 20 | 多 |

#### 🏆 slide-editor 独有优势（竞品均无）

| 独有能力 | 技术实现 | 为什么竞品做不到 |
|---|---|---|
| **8方向精确缩放** | 8个Resize手柄 + 实时DOM尺寸更新 | 纯HTML skill无交互层，破壁只有拖动无缩放 |
| **分组深度编辑** | 双击进入Group → 编辑子元素 → 点外退出 | 需要完整的选择状态机，单HTML文件无法实现 |
| **多选批量操作** | selectedEls数组 + 批量样式应用 | 破壁仅支持单选 |
| **50步Undo/Redo** | innerHTML快照栈 + Ctrl+Z/Y | 破壁无历史记录，改错无法撤回 |
| **剪贴板图片粘贴** | clipboardData.items → FileReader → base64 img | 需要监听paste事件+DOM操作，纯HTML做不到 |
| **形状绘制工具** | useShapes.js: 矩形/圆形/三角/线条 | 竞品无绘图能力，只能编辑AI生成的内容 |
| **结构化JSON模型** | slides数组 → Block/Shape对象 → 可序列化 | 竞品用innerHTML字符串，无法做diff/merge/协作 |
| **完整快捷键体系** | Ctrl+S/Z/Y/C/V + Del + Esc | 专业编辑器级别的操作效率 |

#### 📈 架构优势对比

| 维度 | slide-editor | 竞品(HTML skill系) |
|---|---|---|
| **技术栈** | Vue3 + Vite + 组件化 | 单HTML文件 + 内联JS |
| **可维护性** | 模块化(composables/components/model) | 所有代码混在一个文件 |
| **可扩展性** | 新增Block类型只需加组件 | 改一处可能破坏全局 |
| **性能** | 组件级更新，大deck不卡 | innerHTML全量重渲染 |
| **数据安全** | JSON可版本控制/备份/迁移 | HTML字符串丢了就没了 |
| **AI集成潜力** | AI直接操作JSON对象 | AI需要生成/解析HTML DOM |
| **协作可能性** | JSON支持OT/CRDT算法 | HTML字符串无法做冲突合并 |
| **测试友好** | 组件可单元测试 | 无法自动化测试 |

### C. slide-editor vs 破壁editable 2.0 — 编辑深度对比

> 破壁是唯一同样定位"可编辑"的竞品，需要重点对比

| 编辑能力 | slide-editor | 破壁editable 2.0 | 差距 |
|---|:---:|:---:|---|
| 改文字 | ✅ | ✅ | 持平 |
| 拖动元素 | ✅ | ✅ | 持平 |
| 对齐辅助线 | ✅ | ✅ | 持平 |
| 缩略图导航 | ✅ | ✅ | 持平 |
| 保存状态 | ✅ | ✅ | 持平 |
| **8方向精确缩放** | ✅ | ❌ | 🏆 slide-editor独有 |
| **多选批量操作** | ✅ | ❌ | 🏆 slide-editor独有 |
| **分组/解组编辑** | ✅ | ❌ | 🏆 slide-editor独有 |
| **50步Undo/Redo** | ✅ | ❌ | 🏆 slide-editor独有 |
| **剪贴板图片粘贴** | ✅ | ❌ | 🏆 slide-editor独有 |
| **形状绘制工具** | ✅ | ❌ | 🏆 slide-editor独有 |
| **浮动属性面板(完整)** | ✅ 字体/字号/色/透明度 | 部分 | 🏆 slide-editor更强 |
| **PPTX导出** | ✅ | ❌ | 🏆 slide-editor独有 |
| **JSON结构化模型** | ✅ | ❌(纯HTML) | 🏆 架构级优势 |
| 模板数量 | 基础 | 30+ | ⚠️ 破壁更多 |
| 轻量/无需服务器 | 需dev server | ✅ 单HTML | ⚠️ 破壁更轻 |

**结论**：破壁editable 2.0是"能用的编辑器"，slide-editor是"专业级编辑器"。两者的编辑深度差了一个量级——slide-editor多出8项核心编辑能力，且拥有JSON数据模型这个架构级优势（支撑未来的协作/版本控制/AI集成）。

破壁的优势在于**模板多+零部署**，slide-editor的优势在于**编辑能力深+架构可扩展**。

### D. 从各Skill学到的功能路线图

#### 🔴 P0 — 立即实现（用户最痛点，竞品已验证）

| 功能 | 参考来源 | 实现思路 |
|---|---|---|
| **智能对齐辅助** | 破壁2.0(733赞) | 拖动Block时显示磁吸对齐线(水平/垂直/等距) |
| **模板克隆** | 米小哇(2394赞) | 上传参考图→AI提取配色/字体/布局比例→应用到当前deck |
| **反AI slop主题** | frontend-slides(15.5k⭐) | 内置5-8套高审美主题，禁用Inter/Roboto/紫渐变白底 |
| **PPTX导出** | salt工作流 | 用PptxGenJS将JSON模型映射为PPTX(浏览器端) |
| **演讲者模式** | lewislulu(1.98k⭐) | 按S键开启双屏：主屏演示+副屏备注+计时器 |

#### 🟡 P1 — 短期实现（差异化竞争力）

| 功能 | 参考来源 | 实现思路 |
|---|---|---|
| **三级字体系统** | 歸藏(1万⭐) | 主题预设：衬线标题+无衬线正文+等宽代码/元数据 |
| **AI分步生成** | Faustus(1474赞) | 拆为3步：①大纲规划 ②逐页设计 ③内容填充，每步可人工干预 |
| **SVG Shape增强** | PPT Master | 扩展Shape系统支持更复杂的矢量图形(流程图/架构图) |
| **图标库集成** | PPT Master(6000+图标) | 集成Tabler/Lucide图标，AI根据内容自动推荐 |
| **状态持久化** | 破壁2.0 | localStorage/IndexedDB保存编辑状态，支持断点续编 |

#### 🟢 P2 — 中期实现（生态护城河）

| 功能 | 参考来源 | 实现思路 |
|---|---|---|
| **多格式适配** | PPT Master | 同一deck一键适配16:9/4:3/竖版(小红书)/方图(朋友圈) |
| **WebGL特效** | 歸藏(流体背景) | 可选的Canvas/WebGL背景动画(流体/粒子/渐变流动) |
| **协作编辑** | slide-editor独有优势 | 基于JSON OT/CRDT的多人实时协作(竞品均无此能力) |
| **版本历史** | slide-editor独有优势 | Block级diff对比，支持回滚到任意版本 |
| **插件系统** | Slidev生态 | 允许社区贡献Block类型/主题/动画/导出格式 |

### E. 关键技术实现建议

#### 1. AI生成接口设计（参考Faustus多Agent + 歸藏6步工作流）

```
用户输入 → Step1: 需求澄清(确认主题/页数/风格/受众)
         → Step2: 大纲生成(返回JSON结构，用户可调整)
         → Step3: 逐页设计(每页独立生成，避免上下文污染)
         → Step4: 自检优化(检查一致性/留白/字数)
```

- 每步返回中间结果，用户可人工干预后再继续
- 生成结果直接写入slide-editor的JSON数据模型(Block数组)
- 不走"先生成HTML再解析"的弯路

#### 2. 主题系统设计（参考歸藏CSS变量 + frontend-slides反AI slop）

```json
{
  "name": "墨水经典",
  "fonts": {
    "heading": "Noto Serif SC",
    "body": "Noto Sans SC", 
    "mono": "JetBrains Mono"
  },
  "colors": {
    "primary": "#1a1a2e",
    "secondary": "#16213e",
    "accent": "#0f3460",
    "text": "#e8e8e8",
    "bg": "#0d1117"
  },
  "spacing": { "margin": 48, "gap": 24 },
  "banned": ["Inter", "Roboto", "linear-gradient(135deg, #667eea, #764ba2)"]
}
```

#### 3. 模板克隆实现（参考米小哇视觉克隆工作流）

```
输入: 参考图片(截图/模板图)
  → AI视觉分析: 提取布局比例(左40%右60%) + 配色(hex值) + 字体风格 + 元素形状
  → 生成theme.json: 映射到slide-editor主题格式
  → 应用到当前deck: 所有Block自动适配新主题
```


### F. 从社区验证的设计原则

| # | 原则 | 来源 | slide-editor应用 |
|---|---|---|---|
| 1 | **约束优于自由** | 歸藏"不给hex自定义" | 主题系统只暴露预设选项，不开放完全自定义 |
| 2 | **好改比好看更重要** | 破壁"好看+好改" | 任何AI生成的内容都必须可逐字编辑 |
| 3 | **反AI slop** | frontend-slides禁用列表 | 内置审美规则引擎，自动拒绝低质量组合 |
| 4 | **分步可控** | Faustus 4Agent | AI生成每步都返回中间结果，用户可干预 |
| 5 | **模板>从零** | 米小哇2394赞 | 默认推荐"基于模板生成"而非"空白页生成" |
| 6 | **单文件可分享** | 所有HTML skill | 支持导出为自包含HTML(内联CSS/JS/图片base64) |
| 7 | **三级字体** | 歸藏1万⭐ | 每个主题强制定义heading/body/mono三套字体 |

### G. slide-editor 的"杀手级差异化"方向

基于调研，slide-editor相比竞品的独特优势应聚焦：

1. **AI原生编辑器**（竞品都是"生成后编辑"，slide-editor可以做"边编辑边AI辅助"）
   - 选中Block → AI改写/扩展/精简
   - 拖入空Block → AI根据上下文自动填充
   - 全局一键"风格统一"（检测不一致的字号/颜色/间距并修复）

2. **协作能力**（所有HTML skill都是单人工具，无协作）
   - JSON数据模型天然支持OT/CRDT
   - Block级锁定 + 实时光标显示
   - 评论/批注系统

3. **版本控制**（竞品无此能力）
   - 每次编辑自动保存快照
   - Block级diff可视化
   - 分支/合并（适合团队迭代）

---

*第三轮调研完成。共分析17个Skill/帖子，输出系统性参考建议(竞品对比+功能路线图+技术方案+设计原则+差异化方向)。*
