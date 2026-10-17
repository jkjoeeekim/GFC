import fs from 'node:fs/promises';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const key=url=>createHash('sha256').update(url).digest('hex').slice(0,16);
const gallery=JSON.parse(await fs.readFile('src/data/gallery.json','utf8'));
const archive=JSON.parse(await fs.readFile('src/data/sermons.json','utf8'));
const tasks=[];
for(const album of gallery)for(const photo of album.photos){
 photo.local=`/images/gallery/${key(photo.url)}.webp`;
 tasks.push({url:photo.url,path:'public'+photo.local,width:1200});
}
const posters=new Map();
for(const sermon of archive.sermons)if(sermon.image){
 if(!posters.has(sermon.image))posters.set(sermon.image,`/images/sermons/${key(sermon.image)}.webp`);
 sermon.localImage=posters.get(sermon.image);
}
for(const series of archive.series)if(series.image){
 if(!posters.has(series.image))posters.set(series.image,`/images/sermons/${key(series.image)}.webp`);
 series.localImage=posters.get(series.image);
}
for(const [url,path] of posters)tasks.push({url,path:'public'+path,width:900});
let cursor=0,done=0;const errors=[];
async function worker(){while(cursor<tasks.length){const task=tasks[cursor++];try{
 try{await fs.access(task.path);done++;continue;}catch{}
 const response=await fetch(task.url+(task.url.includes('?')?'&':'?')+`format=${task.width===1200?'1500w':'1000w'}`);
 if(!response.ok)throw new Error(`HTTP ${response.status}`);
 await sharp(Buffer.from(await response.arrayBuffer())).resize({width:task.width,withoutEnlargement:true}).webp({quality:82}).toFile(task.path);done++;
 }catch(error){errors.push({url:task.url,path:task.path,error:String(error)});}
 if((done+errors.length)%75===0)console.log(`${done}/${tasks.length} cached, ${errors.length} errors`);
}}
await Promise.all(Array.from({length:4},worker));
for(const album of gallery)for(const photo of album.photos)if(errors.some(e=>e.path==='public'+photo.local))delete photo.local;
for(const sermon of archive.sermons)if(errors.some(e=>e.path==='public'+sermon.localImage))delete sermon.localImage;
await fs.writeFile('src/data/gallery.json',JSON.stringify(gallery,null,2));
await fs.writeFile('src/data/sermons.json',JSON.stringify(archive,null,2));
await fs.writeFile('src/data/latest.json',JSON.stringify(archive.sermons.find(s=>s.series.includes('recent-sermons')),null,2));
await fs.writeFile('research/media-cache-errors.json',JSON.stringify(errors,null,2));
console.log(`Cached ${done}/${tasks.length} images. Errors: ${errors.length}`);
