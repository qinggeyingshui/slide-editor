
import { parse } from './_pptxtojson_bundle.mjs';
import fs from 'fs';
const buf = fs.readFileSync('E:/2026/x-fudan/new/GenericAgent/temp/蓝色-保研推免自我陈述顶部导航-无校徽版本.pptx');
const r = await parse(buf);
fs.writeFileSync('E:/2026/x-fudan/new/GenericAgent/temp/pptx_parsed.json', JSON.stringify(r));
console.log('parsed');
