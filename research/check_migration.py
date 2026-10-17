"""Audit migrated facts, media, series membership, and local image files."""
import json
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from extract_content import Document

root=Path(__file__).resolve().parent.parent
core=json.loads((root/'src/data/core.json').read_text())
archive=json.loads((root/'src/data/sermons.json').read_text())
gallery=json.loads((root/'src/data/gallery.json').read_text())
source=json.loads((root/'research/content-archive.json').read_text())
by_route={p['route']:p for p in source}
assert core['mission']==next(b['text'] for b in by_route['/']['blocks'] if b['tag']=='p')
assert core['pastor']==next(b['text'] for b in by_route['/about-us/meet-our-staff']['blocks'] if b['tag']=='p')
assert core['give']==next(b['text'] for b in by_route['/give']['blocks'] if b['tag']=='p')
assert core['houseChurch']==[b['text'] for b in by_route['/house-church']['blocks'] if b['tag']=='p']
assert len(core['churches'])==10
assert [b['number'] for b in core['beliefs']]==list(range(1,14))
source_points={b['text'] for b in by_route['/about-us/our-core-values']['blocks'] if b['tag']=='li'}-{'About Us','Who We Are','Meet Our Staff','Our Core Beliefs'}
assert source_points=={p for b in core['beliefs'] for p in b['points']}
assert {p['url'] for a in gallery for p in a['photos']}=={p['url'] for p in by_route['/gallery']['images']}
expected_videos=set();expected_audio=set();membership={}
for page in source:
 if not page['route'].startswith('/listen') and page['route']!='/':continue
 filename='home' if page['route']=='/' else page['route'].strip('/').replace('/','__')
 doc=Document((root/'research/source'/f'{filename}.html').read_text())
 found=set()
 for node in doc.root.walk():
  if node.attrs.get('data-asset-url'):
   expected_audio.add(node.attrs['data-asset-url']);found.add(node.attrs['data-asset-url'])
  if '<iframe' in node.attrs.get('data-html',''):
   for iframe in Document(node.attrs['data-html']).root.walk():
    src=iframe.attrs.get('src','')
    if 'cdn.embedly.com' in src:src=parse_qs(urlparse(src).query).get('src',[''])[0]
    if 'youtube.com/embed/' in src:
     expected_videos.add(src.split('?')[0]);found.add(src.split('?')[0])
 membership[page['route']]=found
actual_video={s['src'].split('?')[0] for s in archive['sermons'] if s['kind']=='video'}
actual_audio={s['src'] for s in archive['sermons'] if s['kind']=='audio'}
assert actual_video==expected_videos,expected_videos-actual_video
assert actual_audio==expected_audio,expected_audio-actual_audio
for slug in ['galatians','1-corinthians']:
 expected=membership['/listen/'+slug]
 actual={s['src'].split('?')[0] for s in archive['sermons'] if slug in s['series']}
 assert expected==actual,(slug,expected^actual)
local=[]
for album in gallery:local.extend(p['local'] for p in album['photos'])
local.extend(s['localImage'] for s in archive['sermons'] if s.get('localImage'))
local.extend(s['localImage'] for s in archive['series'] if s.get('localImage'))
local.extend(c['image'] for c in core['churches'])
for path in local:assert (root/'public'/path.lstrip('/')).is_file(),path
report={'houseChurches':len(core['churches']),'doctrines':len(core['beliefs']),'doctrinalStatements':len(source_points),'galleryPhotos':sum(len(a['photos']) for a in gallery),'videos':len(actual_video),'audio':len(actual_audio),'originalSeriesMembership':'Galatians and 1 Corinthians match their individual original pages','referencedLocalImages':len(set(local)),'status':'pass'}
(root/'research/migration-audit.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
