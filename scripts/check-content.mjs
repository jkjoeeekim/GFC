import assert from 'node:assert/strict';
import fs from 'node:fs';
import { applySiteContentPatch } from '../src/content/editableFields.ts';
const content=JSON.parse(fs.readFileSync('src/content/site.json','utf8'));
const patched=applySiteContentPatch(content,{'service.time':'10 AM','contactEmail':'hello@example.org','home.hero.headingLine1':'Welcome home'});
assert.equal(patched.service.time,'10 AM');
assert.equal(patched.contactEmail,'hello@example.org');
assert.equal(patched.home.hero.headingLine1,'Welcome home');
assert.equal(content.service.time,'11 AM','Patch must not mutate default content');
for(const patch of [ {'__proto__.polluted':'yes'}, {'service.unknown':'x'}, {'links.giving':'javascript:alert(1)'}, {'home.hero.mainPhoto':'data:image/svg+xml;base64,xxx'}, {'home.hero.mainPhoto':'//unsafe.example/image.jpg'}, {'contactEmail':'bad email'}, {'service.time':42}, {'home.hero.headingLine1':'x'.repeat(33)} ]) assert.throws(()=>applySiteContentPatch(content,patch));
assert.equal(applySiteContentPatch(content,{'home.hero.mainPhoto':'/images/home-1.webp'}).home.hero.mainPhoto,'/images/home-1.webp');
console.log('Content contract: immutable updates, field allowlist, length/type checks, email validation, and unsafe URL rejection pass.');
const {prioritizeAlbumPhotos}=await import('../src/lib/gallery.ts');
for(const size of [0,1,12,18,19,251]){const original=Array.from({length:size},(_,i)=>i);const ordered=prioritizeAlbumPhotos(original);assert.equal(ordered.length,size);assert.equal(new Set(ordered).size,size);assert.deepEqual([...ordered].sort((a,b)=>a-b),original);if(size>18)assert.equal(ordered[17],size-1);}
console.log('Gallery curation retains every photo exactly once across empty, short, and full albums.');
