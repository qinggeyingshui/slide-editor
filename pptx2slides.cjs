/**
 * 一键 PPTX → slide-editor presentationData.js
 * Usage: node pptx2slides.js <input.pptx>
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('pptxtojson');

const inputFile = process.argv[2] || path.resolve(__dirname, '../../13.pptx');
const outDir = path.resolve(__dirname, 'public/images');
const outJs = path.resolve(__dirname, 'src/model/presentationData.js');

fs.mkdirSync(outDir, { recursive: true });

let imgIdx = 0;

function saveImage(base64, slideIdx) {
  const match = base64.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return null;
  const ext = match[1] === 'jpeg' ? 'jpeg' : match[1];
  const fname = `s${slideIdx}_${imgIdx++}.${ext}`;
  fs.writeFileSync(path.join(outDir, fname), Buffer.from(match[2], 'base64'));
  return `/images/${fname}`;
}

function escapeFill(fill) {
  if (!fill || fill.type === 'noFill') return '';
  if (fill.type === 'color' || typeof fill === 'string') {
    const c = fill.color || fill.value || fill;
    return c ? `background:${c.startsWith('#') ? c : '#' + c};` : '';
  }
  if (fill.type === 'gradient' && fill.value) {
    const stops = fill.value.colors || [];
    const angle = fill.value.rot || 0;
    const css = stops.map(s => `${s.color.startsWith('#') ? s.color : '#' + s.color} ${s.pos}%`).join(',');
    return css ? `background:linear-gradient(${angle}deg,${css});` : '';
  }
  return '';
}

function renderElement(el, slideIdx, offsetX = 0, offsetY = 0) {
  const x = (el.left || 0) + offsetX;
  const y = (el.top || 0) + offsetY;
  const w = el.width || 0;
  const h = el.height || 0;

  if (el.type === 'group') {
    return (el.elements || []).map(child => renderElement(child, slideIdx, x, y)).join('\n');
  }

  const base = `position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${w.toFixed(1)}px;`;

  if (el.type === 'image') {
    const src = el.base64 ? saveImage(el.base64, slideIdx) : '';
    if (!src) return '';
    return `<img src="${src}" style="${base}height:${h.toFixed(1)}px;object-fit:cover;">`;
  }

  // text or shape
  const fill = escapeFill(el.fill);
  const hStyle = `min-height:${h.toFixed(1)}px;`;
  const overflow = 'overflow:visible;';
  const content = el.content || '';

  return `<div style="${base}${hStyle}${overflow}${fill}">${content}</div>`;
}

async function main() {
  const buf = fs.readFileSync(inputFile);
  const result = await parse(buf);
  console.log(`✅ Parsed: ${result.slides.length} slides, size ${result.size.width}x${result.size.height}`);

  const slides = result.slides.map((slide, si) => {
    imgIdx = 0;
    const els = (slide.elements || []).map(el => renderElement(el, si)).join('\n');
    // slide background
    let bg = '';
    if (slide.fill) {
      const f = escapeFill(slide.fill);
      if (f) bg = `<div style="position:absolute;left:0;top:0;width:100%;height:100%;${f}"></div>\n`;
    }
    return { innerHTML: bg + els };
  });

  const js = `export const slides = ${JSON.stringify(slides, null, 2)};\n`;
  fs.writeFileSync(outJs, js);
  console.log(`✅ Output: ${outJs} (${(js.length/1024).toFixed(0)}KB, ${slides.length} slides)`);
}

main().catch(e => { console.error(e); process.exit(1); });
