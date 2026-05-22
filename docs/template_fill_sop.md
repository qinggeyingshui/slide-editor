# 模板填充 SOP

## 适用场景
已转换的PPT模板（presentationData.js）需要用用户内容替换占位文字。

## 文件格式
```
export const slides = [ { "innerHTML": "..." }, ... ];
export const presentationCSS = '';
```

## 解析方法
```python
import json
with open('src/model/presentationData.js', 'r', encoding='utf-8') as f:
    content = f.read()
prefix = 'export const slides = '
arr_start = content.index(prefix) + len(prefix)
arr_end = content.index('];\n', arr_start) + 1
slides = json.loads(content[arr_start:arr_end])
trailing = content[arr_end:]
```

## 执行步骤

1. **提取结构**（1轮）：用正则从每页innerHTML提取`<span>`文本，输出每页摘要
2. **制定映射**：根据模板页面类型（封面/目录/成绩/奖学金/科研/竞赛/实践/规划/结尾/素材）与用户简历对应
3. **批量替换**（1轮）：用`str.replace()`全局+按页替换，一个脚本完成所有替换
4. **写回**：`prefix + json.dumps(slides, ensure_ascii=False) + trailing`
5. **验证**：检查关键词是否存在于输出文件

## 常见模板页面类型（保研PPT）
| 页面类型 | 典型关键词 | 对应简历章节 |
|---------|-----------|------------|
| 封面(多变体) | 申请人、申请专业、时间 | 姓名/院校/专业/日期 |
| 目录 | 章节标题 | 各章节名 |
| 学业成绩 | GPA、排名、均分、CET | 教育背景 |
| 奖学金荣誉 | 奖学金、标兵、荣誉 | 奖学金与荣誉 |
| 科研/大创 | 国家级大学生、课题 | 科研经历 |
| 竞赛 | 数学建模、英语竞赛 | 竞赛经历 |
| 实习实践 | 实习、实践、社会 | 项目经历/校园经历 |
| 未来规划 | 知识储备、科研衔接 | 研究方向/目标 |
| 结尾 | 敬请老师批评指正 | 保持/微调 |
| 素材页 | 高质量学术图标 | 不改 |

## 替换策略
- **全局替换**：姓名、院校、专业、日期、座右铭（所有页面统一）
- **按关键词定位页面**：用`if '关键词' in h`找到对应页面再替换具体数据
- **不改的页面**：素材页(S31-33)、纯装饰页

## Token优化
- 跳过探测步骤如果模板类型已知（保研PPT结构固定）
- 用户简历建议结构化输入（JSON/分段Markdown）
- 目标：~5k tokens完成（1轮结构提取 + 1轮替换 + 验证）
