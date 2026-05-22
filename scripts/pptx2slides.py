"""
一键 PPTX → slide-editor presentationData.js
两步: 1) node解析pptx→json  2) python转json→presentationData.js

Usage: python pptx2slides.py [input.pptx]
  如果传入.pptx会先调用node解析，如果传入.json直接转换
"""
import json, base64, sys, os, subprocess
from pathlib import Path

PROJ = Path(__file__).parent.parent
OUT_JS = PROJ / 'src/model/presentationData.js'
IMG_DIR = PROJ / 'public/images'

def hex_rgba(c):
    """Convert #RRGGBBAA to rgba() string; pass through 6-char hex."""
    if not c or len(c) != 9 or not c.startswith('#'):
        return c or 'none'
    r, g, b, a = int(c[1:3],16), int(c[3:5],16), int(c[5:7],16), int(c[7:9],16)
    return f'rgba({r},{g},{b},{a/255:.3f})'

def css_color(fill):
    if not fill: return ''
    if fill.get('type') == 'color': return f"background:{hex_rgba(fill['value'])};"
    if fill.get('type') == 'gradient':
        colors = fill.get('value', {}).get('colors', [])
        angle = fill.get('value', {}).get('angle', 0)
        stops = ','.join(f"{hex_rgba(c['color'])} {c.get('pos','0%')}" for c in colors)
        return f"background:linear-gradient({angle}deg,{stops});" if stops else ''
    return ''

def render_el(el, ox=0, oy=0, slide_idx=0, img_counter=[0]):
    if el.get('type') == 'group':
        parts = [render_el(c, (el.get('left') or 0) + ox, (el.get('top') or 0) + oy, slide_idx, img_counter) for c in el.get('elements', [])]
        return '\n'.join(p for p in parts if p)

    l = (el.get('left') or 0) + ox
    t = (el.get('top') or 0) + oy
    w = el.get('width') or 0
    h = el.get('height') or 0
    rot = el.get('rotate') or 0
    transform = f"transform:rotate({rot}deg);" if rot else ""
    base = f"position:absolute;left:{l:.1f}px;top:{t:.1f}px;width:{w:.1f}px;{transform}"

    if el.get('type') == 'image':
        src = save_image(el, slide_idx, img_counter)
        return f'<img src="{src}" style="{base}height:{h:.1f}px;" />'

    if el.get('type') == 'table':
        rows = el.get('data', [])
        col_ws = el.get('colWidths', [])
        row_hs = el.get('rowHeights', [])
        tbl = f'<table style="{base}height:{h:.1f}px;border-collapse:collapse;table-layout:fixed;">'
        tbl += '<colgroup>' + ''.join(f'<col style="width:{cw:.1f}px">' for cw in col_ws) + '</colgroup>'
        for ri, row in enumerate(rows):
            rh = row_hs[ri] if ri < len(row_hs) else 30
            tbl += f'<tr style="height:{rh:.1f}px;">'
            for cell in row:
                txt = (cell.get('text') or '').replace('pt;', 'px;').replace('pt"', 'px"')
                va = {'mid': 'middle', 'bottom': 'bottom'}.get(cell.get('vAlign'), 'top')
                tbl += f'<td style="vertical-align:{va};border:1px solid #ccc;padding:2px;overflow:hidden;">{txt}</td>'
            tbl += '</tr>'
        tbl += '</table>'
        return tbl

    # Shape rendering
    path = el.get('path')
    fill_data = el.get('fill') or {}
    content = (el.get('content') or '').replace('pt;', 'px;').replace('pt\"', 'px\"')
    border_c = el.get('borderColor', 'none')
    border_w = el.get('borderWidth', 0) or 0
    if not border_w and el.get('borderType') == 'dashed':
        border_w = 1
    shape_type = el.get('shapType') or ''

    # Compute fill (shared by all shape branches)
    fill_val = 'none'
    grad_def = ''
    if fill_data:
        if fill_data.get('type') == 'gradient':
            colors = fill_data.get('value', {}).get('colors', [])
            angle = fill_data.get('value', {}).get('angle', 0)
            gid = f"g{slide_idx}_{id(el)}"
            stops = ''.join(f'<stop offset="{c.get("pos","0%")}" stop-color="{hex_rgba(c["color"])}" stop-opacity="1"/>' for c in colors)
            grad_def = f'<defs><linearGradient id="{gid}" gradientTransform="rotate({angle})">{stops}</linearGradient></defs>'
            fill_val = f'url(#{gid})'
        elif fill_data.get('type') == 'color':
            fill_val = hex_rgba(fill_data.get('value', 'none'))
        elif fill_data.get('color'):
            fill_val = hex_rgba(fill_data['color'])
    dash_attr = ' stroke-dasharray="4 3"' if el.get('borderType') == 'dashed' else ''
    stroke_s = f'stroke="{hex_rgba(border_c)}" stroke-width="{border_w}"{dash_attr}' if border_w else ''

    # roundRect → use <rect> with proper rx/ry
    if shape_type == 'roundRect':
        r = min(w, h) * 0.1
        inner = f'{grad_def}<rect x="0" y="0" width="{w}" height="{h}" rx="{r:.1f}" ry="{r:.1f}" fill="{fill_val}" {stroke_s}/>'
        svg = f'<svg style="{base}height:{h:.1f}px;overflow:visible;" viewBox="0 0 {w} {h}">{inner}</svg>'
        if content:
            svg += f'\n<div style="{base}min-height:{h:.1f}px;overflow:visible;display:flex;align-items:center;justify-content:center;">{content}</div>'
        return svg

    # ellipse → use <ellipse>
    if shape_type == 'ellipse':
        inner = f'{grad_def}<ellipse cx="{w/2:.1f}" cy="{h/2:.1f}" rx="{w/2:.1f}" ry="{h/2:.1f}" fill="{fill_val}" {stroke_s}/>'
        svg = f'<svg style="{base}height:{h:.1f}px;overflow:visible;" viewBox="0 0 {w} {h}">{inner}</svg>'
        if content:
            svg += f'\n<div style="{base}min-height:{h:.1f}px;overflow:visible;display:flex;align-items:center;justify-content:center;">{content}</div>'
        return svg

    # All other shapes with path → SVG path
    if path:
        svg = f'<svg style="{base}height:{h:.1f}px;overflow:visible;" viewBox="0 0 {w} {h}">{grad_def}<path d="{path}" fill="{fill_val}" {stroke_s}/></svg>'
        if content:
            svg += f'\n<div style="{base}min-height:{h:.1f}px;overflow:visible;display:flex;align-items:center;justify-content:center;">{content}</div>'
        return svg

    # Fallback: div
    fill = css_color(fill_data)
    border_style = 'dashed' if el.get('borderType') == 'dashed' else 'solid'
    border_css = f'border:{border_w}px {border_style} {hex_rgba(border_c)};' if border_w else ''
    return f'<div style="{base}min-height:{h:.1f}px;overflow:visible;{fill}{border_css}">{content}</div>'

def save_image(el, si, counter):
    b64 = el.get('base64') or ''
    if not b64: return ''
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    # Strip data URI prefix
    ext = 'png'
    if ',' in b64:
        header, b64 = b64.split(',', 1)
        if 'jpeg' in header or 'jpg' in header: ext = 'jpg'
    elif b64[:3] in ('/9j', '/9J'): ext = 'jpg'
    fname = f"s{si+1}_{counter[0]}.{ext}"
    counter[0] += 1
    # Fix padding
    b64 += '=' * (-len(b64) % 4)
    (IMG_DIR / fname).write_bytes(base64.b64decode(b64))
    return f"/images/{fname}"

def convert(json_path):
    data = json.loads(Path(json_path).read_text(encoding='utf-8'))
    slides = []
    img_counter = [0]
    for si, slide in enumerate(data['slides']):
        bg = f'<img src="/images/bg/bg_{si+1}.png" style="position:absolute;left:0;top:0;width:960px;height:540px;" />\n'
        els = '\n'.join(render_el(el, 0, 0, si, img_counter) for el in slide.get('elements', []))
        slides.append({'innerHTML': bg + els})

    js = 'export const slides = ' + json.dumps(slides, ensure_ascii=False, indent=2) + ';\n\nexport const presentationCSS = \'\';\n'
    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text(js, encoding='utf-8')
    print(f"Done: {len(slides)} slides, {img_counter[0]} images, {len(js)//1024}KB")

def parse_pptx(pptx_path):
    """调用node+pptxtojson(esbuild bundle)解析pptx为json"""
    out_json = Path(__file__).parent / 'pptx_parsed.json'
    bundle = PROJ / '_pptxtojson_bundle.mjs'
    if not bundle.exists():
        esbuild = PROJ / 'node_modules/.bin/esbuild.cmd'
        entry = 'node_modules/pptxtojson/src/pptxtojson.js'
        subprocess.run([str(esbuild), entry, '--bundle', '--format=esm',
                        '--platform=node', '--outfile=_pptxtojson_bundle.mjs'],
                       cwd=str(PROJ), check=True)
    script = f"""
import {{ parse }} from './_pptxtojson_bundle.mjs';
import fs from 'fs';
const buf = fs.readFileSync('{pptx_path.replace(chr(92), "/")}');
const r = await parse(buf);
fs.writeFileSync('{str(out_json).replace(chr(92), "/")}', JSON.stringify(r));
console.log('parsed');
"""
    tmp = PROJ / '_parse_tmp.mjs'
    tmp.write_text(script)
    subprocess.run(['node', str(tmp)], cwd=str(PROJ), check=True)
    tmp.unlink()
    return out_json

def export_bg(pptx_path):
    """COM导出纯背景PNG(只保留图片Type==13)"""
    import shutil, win32com.client
    bg_dir = PROJ / 'public/images/bg'
    bg_dir.mkdir(parents=True, exist_ok=True)
    tmp = Path(__file__).parent / '_bg_tmp.pptx'
    shutil.copy2(pptx_path, tmp)
    ppt = win32com.client.Dispatch("PowerPoint.Application")
    pres = ppt.Presentations.Open(str(tmp.resolve()), WithWindow=False)
    for slide in pres.Slides:
        for i in range(slide.Shapes.Count, 0, -1):
            slide.Shapes(i).Delete()
        slide.Export(str(bg_dir / f"bg_{slide.SlideIndex}.png"), "PNG", 960, 540)
    pres.Close()
    tmp.unlink(missing_ok=True)
    print(f"Exported {len(list(bg_dir.glob('bg_*.png')))} background PNGs")

if __name__ == '__main__':
    inp = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).parent / 'pptx_parsed.json')
    if inp.endswith('.pptx'):
        export_bg(inp)
        inp = str(parse_pptx(inp))
    convert(inp)
