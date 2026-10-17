import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.reject();Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Document.prototype.exitPointerLock=()=>{};});
 await page.goto('http://127.0.0.1:5173/research/fixtures/admin-preview.html');
 await page.getByRole('heading',{name:'Welcome home A place to belong.'}).waitFor();
 assert.match(await page.locator('.sunday-strip').innerText(),/10 AM/);
 assert.match(await page.locator('.sunday-strip').innerText(),/123 Example Street/);
 assert.match(await page.locator('.close-email').getAttribute('href'),/hello@example.org/);
 assert.match(await page.locator('.footer-bottom').innerText(),/Example City/);
 assert.match(await page.locator('meta[name=description]').getAttribute('content'),/10 AM/);
 await page.locator('.hero-actions a[href="/about-us/who-we-are"]').click();
 await page.getByRole('heading',{name:'A church. A community. A family.'}).waitFor();
 assert.match(await page.locator('.location-plate').innerText(),/123 Example Street/);
 assert.match(await page.locator('.location-plate').innerText(),/10 AM/);
 await page.screenshot({path:'output/playwright/admin-content-override.png',fullPage:true});
 const result={status:'pass',updatedFields:['hero heading','service time','city','street','contact email','metadata','footer address','inner-page service details']};
 await fs.writeFile('output/playwright/admin-content-report.json',JSON.stringify(result,null,2));
 console.log('Admin content provider propagation passed.');
} finally {await browser.close();}
