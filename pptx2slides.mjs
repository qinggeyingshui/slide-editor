/**
 * 一键 PPTX → slide-editor presentationData.js
 * Usage: node pptx2slides.mjs <input.pptx>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'pptxtojson';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputFile = process.argv[2] || path.resolve(__dirname, '../13.pptx');
const outDir = path.resolve(__dirname, 'public/images');
const outJs = path.resolve(__dirname, 'src/model/presentationData.js');

function cssColor(fill) {
  if (!fill) return '';
  if (fill.type === 'color') return `background:${fill.value};`;
  if (fill.type === 'gradient') {
    const stops = fill.value?.colors?.map(c => `${c.color} ${c.pos}%`).join(',') || '';
    const angle = fill.value?.angle || 0;
    return stops ? `background:linear-gradient(${angle}deg,${stops});` : '';
  }
  return '';
}

function renderEl(el, ox = 0, oy = 0) {
  const l = (el.left || 0) + ox, t = (el.top || 0) + oy;
  const w = el.width || 0, h = el.height || 0;
  const base = `position:absolute;left:${l.toFixed(1)}px;top:${t.toFixed(1)}px;width:${w.toFixed(1)}px;`;

  if (el.type === 'group') {
    return (el.elements || []).map(c => renderEl(c, l, t)).join('\n');
  }
  if (el.type === 'image') {
    const src = el._localSrc || `data:image/png;base64,${el.base64 || ''}`;
    return `<img src="${src}" style="${base}height:${h.toFixed(1)}px;" />`;
  }
  // text or shape
  const fill = cssColor(el.fill);
  const overflow = 'overflow:visible;';
  const content = el.content || '';
  return `<div style="${base}min-height:${h.toFixed(1)}px;${overflow}${fill}">${content}</div>`;
}

async function main() {
  const buf = fs.readFileSync(inputFile);
  const result = await parse(buf);
  
  // Save images
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  let imgIdx = 0;

  const slides = result.slides.map((slide, si) => {
    // Process images - save base64 to files
    const processImg = (el) => {
      if (el.type === 'image' && el.base64) {
        const ext = (el.base64.startsWith('/9j') || el.base64.startsWith('/9J')) ? 'jpg' : 'png';
        const fname = `s${si + 1}_${imgIdx++}.${ext}`;
        fs.writeFileSync(path.join(outDir, fname), Buffer.from(el.base64, 'base64'));
        el._localSrc = `/images/${fname}`;
      }
      if (el.type === 'group' && el.elements) el.elements.forEach(processImg);
    };
    (slide.elements || []).forEach(processImg);

    // Render all elements
    const els = (slide.elements || []).map(el => renderEl(el)).join('\n');
    
    // Slide background
    let bg = '';
    if (slide.fill) bg = `<div style="position:absolute;left:0;top:0;width:100%;height:100%;${cssColor(slide.fill)}"></div>\n`;
    
    return { innerHTML: bg + els };
  });

  const js = `export const slides = ${JSON.stringify(slides, null, 2)};\n`;
  fs.writeFileSync(outJs, js);
  console.log(`✅ ${slides.length} slides → ${outJs} (${(js.length/1024).toFixed(0)}KB)`);
  console.log(`   Images: ${imgIdx} saved to ${outDir}`);
}

main().catch(e => { console.error(e); process.exit(1); });
