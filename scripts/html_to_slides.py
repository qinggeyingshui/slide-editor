"""HTML Presentation → slide-editor presentationData.js 转换工具
用法: python tools/html_to_slides.py <input.html> [--output path]

规范: 960×540画布, 全absolute定位, 全内联样式, 无<style>/class
"""
import sys, re, json, copy
from pathlib import Path
from bs4 import BeautifulSoup

DEFAULT_OUTPUT = Path(__file__).parent.parent / 'slide-editor/src/model/presentationData.js'

def parse_css(css_text):
    """解析CSS为 [(selector, {prop: val})] 有序列表"""
    css_text = re.sub(r'/\*.*?\*/', '', css_text, flags=re.DOTALL)
    rules = []
    for m in re.finditer(r'([^{}]+)\{([^{}]+)\}', css_text):
        sel = m.group(1).strip()
        props = {}
        for prop in m.group(2).split(';'):
            prop = prop.strip()
            if ':' in prop:
                k, v = prop.split(':', 1)
                props[k.strip()] = v.strip()
        if sel and props and sel not in ('*', 'body'):
            rules.append((sel, props))
    return rules

def inline_css(slide_el, rules):
    """将所有CSS规则内联到匹配元素（含复合选择器）"""
    for sel, props in rules:
        if '::' in sel or ':nth' in sel or ':hover' in sel or ':not(' in sel:
            continue
        try:
            for match in slide_el.select(sel):
                existing = match.get('style', '')
                new_props = [f"{k}: {v}" for k, v in props.items() if k not in existing]
                if new_props:
                    combined = existing.rstrip('; ') + '; ' + '; '.join(new_props) if existing else '; '.join(new_props)
                    match['style'] = combined.lstrip('; ')
        except Exception:
            pass

def remove_classes(el):
    """递归删除所有class属性"""
    for node in el.find_all(True):
        if node.get('class'):
            del node['class']
    if el.get('class'):
        del el['class']

def convert(input_html, output_path=None):
    """主转换函数"""
    output_path = Path(output_path) if output_path else DEFAULT_OUTPUT
    
    with open(input_html, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    css_rules = parse_css(soup.find('style').string or '')
    slides_raw = soup.select('.slide')
    
    slides_data = []
    for i, slide in enumerate(slides_raw):
        slide_copy = BeautifulSoup(str(slide), 'html.parser').find(class_='slide')
        inline_css(slide_copy, css_rules)
        
        children = [c for c in slide_copy.children if c.name]
        result_parts = []
        for child in children:
            cls = ' '.join(child.get('class', []))
            remove_classes(child)
            
            if 'cover' in cls:
                child['style'] = f"position:absolute; left:0; top:0; width:960px; height:540px; background:linear-gradient(145deg,#0b2660 0%,#1040a0 50%,#2878d8 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; {child.get('style','')}"
            elif 'slide-header' in cls:
                child['style'] = f"position:absolute; left:0; top:0; width:960px; height:48px; {child.get('style','')}"
            elif 'slide-body' in cls:
                child['style'] = f"position:absolute; left:28px; top:58px; width:904px; height:454px; overflow:hidden; {child.get('style','')}"
            elif 'pn' in cls:
                child['style'] = f"position:absolute; right:20px; bottom:10px; {child.get('style','')}"
            
            result_parts.append(str(child))
        
        slides_data.append({"id": f"slide_{i+1}", "innerHTML": '\n'.join(result_parts)})
    
    output = '// Auto-saved by slide-editor\nexport const slides = ' + json.dumps(slides_data, ensure_ascii=False, indent=2) + '\n\nexport const presentationCSS = ""\n'
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(output, encoding='utf-8')
    print(f"Done: {len(slides_data)} slides -> {output_path} ({len(output)} bytes)")

if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else None
    output_file = None
    if '--output' in sys.argv:
        idx = sys.argv.index('--output')
        output_file = sys.argv[idx + 1]
    if not input_file:
        print(__doc__)
        sys.exit(1)
    convert(input_file, output_file)
