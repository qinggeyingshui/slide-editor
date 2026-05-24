
import { parse } from './_pptxtojson_bundle.mjs';
import fs from 'fs';
const buf = fs.readFileSync('E:/2026/x-fudan/new/GenericAgent/temp/slide-editor/scripts/_parse_15.pptx');
const r = await parse(buf);
fs.writeFileSync('E:/2026/x-fudan/new/GenericAgent/temp/slide-editor/scripts/_15_parsed.json', JSON.stringify(r, null, 2));
console.log('parsed ok');
