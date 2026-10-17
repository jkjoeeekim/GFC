import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.GFC_PREVIEW_URL || 'http://127.0.0.1:4173';
const out='output/playwright/functional';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report={routes:[],accessibility:[],interactions:[],errors:[],externalPlayback:[]};
async function context(options={}){
 const ctx=await browser.newContext({viewport:{width:1440,height:900},...options});
 await ctx.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject(new Error('Disabled for verification'));Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
 return ctx;
}
async function load(page,path){const response=await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(response.status(),200,path);await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);}
async function walk(page){
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
 const size=await page.evaluate(()=>({height:document.documentElement.scrollHeight,vh:innerHeight}));
 for(let y=0;y<size.height;y+=Math.round(size.vh*.75)){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(90);}
 await page.waitForTimeout(650);
 const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
 assert.equal(state.overflow,false,'Horizontal page overflow');assert.deepEqual(state.broken,[],'Broken images');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(100);
 return state;
}
async function audit(page,label){await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});report.accessibility.push({label,violations:result});}
async function count(page,selector,total){await page.waitForFunction(({selector,total})=>document.querySelectorAll(selector).length===total,{selector,total});}
try {
const desktop=await context();const page=await desktop.newPage();
page.on('pageerror',e=>report.errors.push(String(e)));
const source=JSON.parse(await fs.readFile('research/site-inventory.json','utf8'));
const paths=process.argv.includes('--interactions-only') ? [] : [...new Set([...source.map(p=>p.route),'/who-we-are','/joseph','/listen/sermon-topics'])];
for(const path of paths){await load(page,path);await walk(page);report.routes.push({path,h1:await page.locator('main h1').innerText()});if(['/','/house-church','/gallery','/listen','/about-us/our-core-values','/give','/events','/about-us/meet-our-staff','/about-us/who-we-are'].includes(path)){await audit(page,path);await page.screenshot({path:`${out}/${path==='/'?'home':path.slice(1).replaceAll('/','-')}.png`,fullPage:true});}}
console.log(`Inspected ${paths.length} production routes.`);
await load(page,'/house-church');
await page.getByRole('button',{name:'College',exact:true}).click();await count(page,'.church-entry',1);
await page.getByRole('button',{name:'Youth',exact:true}).click();await count(page,'.church-entry',2);
await page.getByRole('button',{name:'All life stages',exact:true}).click();
await page.getByRole('searchbox').fill('Osaka');await count(page,'.church-entry',1);
assert.match(await page.locator('.church-entry a').getAttribute('href'),/^mailto:gfchousechurches@gmail.com\?subject=/);
await page.getByRole('button',{name:'Clear filters'}).click();await page.getByRole('combobox').selectOption('orange, ca');await count(page,'.church-entry',2);
await page.getByRole('button',{name:'Clear filters'}).click();await count(page,'.church-entry',10);
report.interactions.push('House church: life stage, name search, city filter, reset, and selected-group email destination.');
await load(page,'/');await page.getByRole('button',{name:'College',exact:true}).click();await page.locator('.season-result a').click();assert.match(page.url(),/stage=college/);await page.locator('.church-entry').first().waitFor();await count(page,'.church-entry',1);report.interactions.push('Homepage life-stage choice carries into the directory.');
await load(page,'/gallery');const first=page.locator('.gallery-photo').first();await first.click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('ArrowRight');assert.match(await page.locator('.lightbox-bottom p').innerText(),/^2 /);await page.keyboard.press('Escape');await count(page,'dialog[open]',0);const galleryFocus=await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'));report.interactions.push(`Gallery dialog: arrows, Escape, focus returns to ${galleryFocus}.`);assert.match(galleryFocus||'',/^View Winter Retreat/);
await page.getByRole('button',{name:'Load more photos'}).click();await count(page,'.gallery-photo',36);await page.getByRole('button',{name:'Winter Retreat 2025',exact:true}).click();await count(page,'.gallery-photo',18);report.interactions.push('Gallery album changes and progressive loading.');
await load(page,'/listen');await page.getByRole('searchbox').fill('logos');await page.waitForTimeout(250);await count(page,'.sermon-item',1);await page.locator('.sermon-item .sermon-poster').click();await page.locator('dialog[open] audio').waitFor();
try{await page.waitForFunction(()=>document.querySelector('audio')?.readyState>=1,{},{timeout:12000});await page.locator('audio').evaluate(async a=>{a.muted=true;await a.play()});await page.waitForTimeout(600);report.externalPlayback.push({audioMetadata:'loaded',time:await page.locator('audio').evaluate(a=>a.currentTime)});}catch(error){report.externalPlayback.push({audioMetadata:'unverified',reason:String(error).slice(0,250)});}
await page.keyboard.press('Escape');await count(page,'dialog[open]',0);report.interactions.push('Sermon search and native audio player dialog.');
await load(page,'/listen');await page.locator('.sermon-item .sermon-poster').first().click();const iframe=page.locator('dialog[open] iframe');await iframe.waitFor();assert.match(await iframe.getAttribute('src'),/^https:\/\/www.youtube.com\/embed\//);await page.waitForTimeout(1200);report.externalPlayback.push({videoEmbed:await iframe.getAttribute('src'),frames:page.frames().map(f=>f.url()).filter(u=>u.includes('youtube.com'))});await page.keyboard.press('Escape');report.interactions.push('Video player opens the original YouTube embed and closes by keyboard.');
await load(page,'/about-us/our-core-values');await count(page,'.belief-list details',13);await page.locator('.belief-list summary').nth(9).click();assert.equal(await page.locator('.belief-list details').nth(9).getAttribute('open'),'');report.interactions.push('All 13 original doctrines are available in operable disclosures.');
await load(page,'/give');assert.equal(await page.getByRole('link',{name:'Give via Tithe.ly',exact:true}).getAttribute('href'),'https://tithe.ly/give?c=8208913');report.interactions.push('Giving retains the original Tithe.ly destination. No payment submitted.');
const phoneContext=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await phoneContext.newPage();
for(const path of ['/','/house-church','/gallery','/listen','/about-us/who-we-are','/about-us/meet-our-staff','/about-us/our-core-values','/events','/give']){await load(phone,path);await walk(phone);await phone.screenshot({path:`${out}/phone-${path==='/'?'home':path.slice(1).replaceAll('/','-')}.png`,fullPage:true});report.routes.push({path,viewport:'390 × 844'});if(['/','/house-church','/listen','/gallery'].includes(path))await audit(phone,'phone '+path);}
await load(phone,'/');await phone.getByRole('button',{name:'Open navigation'}).click();await phone.getByRole('navigation',{name:'Mobile navigation'}).waitFor();await phone.keyboard.press('Escape');assert.equal(await phone.getByRole('navigation',{name:'Mobile navigation'}).count(),0);await phone.getByRole('button',{name:'Open navigation'}).click();await phone.locator('#mobile-navigation a[href="/house-church"]').click();await phone.locator('.directory-section').waitFor();assert.equal(await phone.getByRole('navigation',{name:'Mobile navigation'}).count(),0);report.interactions.push('Mobile navigation opens, closes with Escape, and navigates to a page.');
const compactContext=await context({viewport:{width:360,height:640},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const compact=await compactContext.newPage();for(const path of ['/','/house-church','/listen','/give']){await load(compact,path);await walk(compact);await compact.screenshot({path:`${out}/compact-${path==='/'?'home':path.slice(1)}.png`,fullPage:true});report.routes.push({path,viewport:'360 × 640 reduced motion'});}
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({routes:report.routes.length,audits:report.accessibility.length,violations:report.accessibility.flatMap(a=>a.violations.map(v=>({page:a.label,...v}))),interactions:report.interactions,externalPlayback:report.externalPlayback,errors:report.errors},null,2));
} finally {
 await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
 await browser.close();
}
