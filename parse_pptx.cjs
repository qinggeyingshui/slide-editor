
const fs = require('fs');
const { parse } = require('pptxtojson');

const pptxBuf = fs.readFileSync('E:\\2026\\x-fudan\\new\\GenericAgent\\temp\\13.pptx');

parse(pptxBuf).then(result => {
  console.log('Keys:', Object.keys(result));
  console.log('Slides:', result.slides.length);
  console.log('Size:', JSON.stringify(result.size));
  
  const s1 = result.slides[0];
  console.log('\n--- Slide 1 ---');
  console.log('Slide keys:', Object.keys(s1));
  console.log('Elements:', s1.elements?.length);
  
  if (s1.elements && s1.elements.length > 0) {
    for (let i = 0; i < Math.min(3, s1.elements.length); i++) {
      const el = s1.elements[i];
      console.log(`\n[${i}] type=${el.type}, name=${el.name}`);
      console.log(`    pos: left=${el.left}, top=${el.top}, w=${el.width}, h=${el.height}`);
      console.log(`    keys: ${Object.keys(el).join(',')}`);
      if (el.content) console.log(`    content: ${JSON.stringify(el.content).slice(0, 300)}`);
    }
  }
  
  fs.writeFileSync('E:\\2026\\x-fudan\\new\\GenericAgent\\temp\\pptx_parsed.json', 
    JSON.stringify(result, null, 2));
  console.log('\n✅ Full JSON saved to pptx_parsed.json');
}).catch(err => console.error('Error:', err.message));
