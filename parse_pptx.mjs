
import fs from 'fs';
import { parse } from 'pptxtojson/dist/index.js';

const pptxBuf = fs.readFileSync('../13.pptx');
const result = await parse(pptxBuf);

console.log('Keys:', Object.keys(result));
console.log('Slides:', result.slides.length);
console.log('Size:', JSON.stringify(result.size));

const s1 = result.slides[0];
console.log('\n--- Slide 1 ---');
console.log('Slide keys:', Object.keys(s1));
console.log('Elements:', s1.elements?.length);

if (s1.elements && s1.elements.length > 0) {
  const el = s1.elements[0];
  console.log('\nFirst element keys:', Object.keys(el));
  console.log(JSON.stringify(el, null, 2).slice(0, 800));
}

fs.writeFileSync('../pptx_parsed.json', JSON.stringify(result, null, 2));
console.log('\n✅ Full JSON saved');
