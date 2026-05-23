"""slide-editor presentationData.js → 独立 HTML 文件
用法: python tools/slides_to_html.py [--input presentationData.js] [--output output.html]

读取 slides 数组，生成可直接浏览器打开的完整 HTML 演示文件（960×540 每页）。
"""
import sys, re, json
from pathlib import Path

DEFAULT_INPUT = Path(__file__).parent.parent / 'slide-editor/src/model/presentationData.js'
DEFAULT_OUTPUT = Path(__file__).parent.parent / 'slide-editor/export.html'

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ background:#1a1a2e; display:flex; flex-direction:column; align-items:center; gap:40px; padding:40px 0; font-family:'PingFang SC','Microsoft YaHei','Segoe UI',sans-serif; }}
.slide-wrap {{ width:960px; height:540px; position:relative; overflow:hidden; border-radius:8px; box-shadow:0 8px 32px rgba(0,0,0,.4); }}
</style>
</head>
<body>
{slides_html}
</body>
</html>'''

def convert(input_path=None, output_path=None):
    input_path = Path(input_path) if input_path else DEFAULT_INPUT
    output_path = Path(output_path) if output_path else DEFAULT_OUTPUT

    content = input_path.read_text(encoding='utf-8')
    
    # Try JSON format first: export const slides = [...]\nexport
    match = re.search(r'export const slides = (\[.*?\])\s*\n\s*export', content, re.DOTALL)
    if match:
        slides = json.loads(match.group(1))
    else:
        # Template literal format: extract innerHTML from each { "innerHTML": `...` }
        slides = []
        # Find all innerHTML template literals
        parts = re.split(r'\{\s*"innerHTML"\s*:\s*`', content)[1:]
        for part in parts:
            end = part.rfind('`')
            if end > 0:
                slides.append({"innerHTML": part[:end]})
    
    if not slides:
        print("Error: cannot parse slides array"); sys.exit(1)
    parts = []
    for s in slides:
        parts.append(f'<div class="slide-wrap">\n{s["innerHTML"]}\n</div>')
    
    title = "Presentation"
    html = HTML_TEMPLATE.format(title=title, slides_html='\n'.join(parts))
    output_path.write_text(html, encoding='utf-8')
    print(f"Done: {len(slides)} slides -> {output_path} ({len(html)} bytes)")

if __name__ == '__main__':
    input_file = output_file = None
    args = sys.argv[1:]
    if '--input' in args:
        input_file = args[args.index('--input') + 1]
    if '--output' in args:
        output_file = args[args.index('--output') + 1]
    convert(input_file, output_file)
