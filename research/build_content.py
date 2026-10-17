"""Build application data from archived source, retaining exact source destinations."""
import json
import re
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from extract_content import Document, main as extract_archive

ROOT = Path(__file__).resolve().parent.parent
extract_archive()
archive = json.loads((ROOT / "research/content-archive.json").read_text())
by_route = {p["route"]: p for p in archive}


def source_main(page):
    raw = (ROOT / "research/source" / ("home" if page["route"] == "/" else page["route"].strip("/").replace("/", "__"))).with_suffix(".html").read_text()
    doc = Document(raw)
    return next(n for n in doc.root.walk() if n.tag == "main")


def paragraphs(route):
    return [b["text"] for b in by_route[route]["blocks"] if b["tag"] == "p"]


def image_url(node):
    return node.attrs.get("data-src") or node.attrs.get("data-image") or node.attrs.get("src", "")


def unique(items):
    return list(dict.fromkeys(items))


headings = [b["text"] for b in by_route["/house-church"]["blocks"] if b["tag"] == "h3"]
churches = []
for index in range(0, len(headings), 3):
    leader, name, area = headings[index:index + 3]
    churches.append({"id": index // 3, "leader": leader, "name": name,
                     "area": area.split(":", 1)[1].strip(),
                     "stage": "Youth" if "YOUTH" in name else "College" if "COLLEGE" in name else "Young adults & married couples",
                     "image": f"/images/house-church-{5 + index // 3}.webp"})

beliefs = []
secondary_intro = ""
for block in by_route["/about-us/our-core-values"]["blocks"]:
    if block["tag"] != "p":
        continue
    text = block["text"]
    match = re.match(r"(\d+)\s*\.\s*(.+)", text)
    if match:
        beliefs.append({"number": int(match[1]), "title": match[2], "points": []})
    elif text.startswith("The following are also important"):
        secondary_intro = text
    elif beliefs and text not in ("Primary Doctrines", "Secondary Doctrines"):
        beliefs[-1]["points"].append(text)

core = {"mission": paragraphs("/")[0], "who": paragraphs("/about-us/who-we-are"),
        "pastor": paragraphs("/about-us/meet-our-staff")[0],
        "houseChurch": paragraphs("/house-church"), "give": paragraphs("/give")[0],
        "churches": churches, "beliefs": beliefs, "secondaryIntro": secondary_intro,
        "socials": [{"label": label, "href": href} for label, href in [
            ("YouTube", "https://www.youtube.com/godsfamilychurch"),
            ("Flickr", "https://www.flickr.com/photos/140576846@N07/albums/"),
            ("Facebook", "https://facebook.com/gfchousechurches"),
            ("Instagram", "http://instagram.com/gfchouse"),
            ("Spotify", "https://open.spotify.com/show/0yKrBxniplaSHCk27aPMvj?si=EBGdCyV7SjumOIgP4b4RJA"),
            ("Apple Podcasts", "https://podcasts.apple.com/us/podcast/gods-family-church/id1833786837")]]}
(ROOT / "src/data/core.json").write_text(json.dumps(core, ensure_ascii=False, indent=2))

# Preserve each album's membership and source order, removing duplicated HTML images.
albums = []
seen_photos = set()
for node in source_main(by_route["/gallery"]).walk():
    if node.tag == "h2" and "RETREAT" in node.text().upper():
        year = re.search(r"20\d\d", node.text())[0]
        albums.append({"year": year, "title": f"Winter Retreat {year}", "photos": []})
    elif node.tag == "img" and albums:
        url = image_url(node)
        if url and url not in seen_photos:
            albums[-1]["photos"].append({"url": url, "filename": node.attrs.get("alt", "")})
            seen_photos.add(url)
(ROOT / "src/data/gallery.json").write_text(json.dumps(albums, ensure_ascii=False, indent=2))

slug_map = {"recent sermons": "recent-sermons", "the gospel of luke": "luke", "joseph: from prison to palace": "joseph",
            "the book of daniel: kingdom under fire": "daniel", "2025 bible reading plan sermons": "2025-bible-reading-plan",
            "1 peter": "1-peter", "love, sex, and dating": "love-sex-and-dating", "the elijah series": "elijah",
            "the book of ephesians": "ephesians", "the story of david": "david", "1 thessalonians": "1-thessalonians",
            "the story of ruth": "ruth", "the house church ministry": "house-church", "guest pastors": "guest-pastors",
            "the gospel of john": "john", "the book of galatians": "galatians", "‘22 series": "galatians",
            "colossians": "colossians", "controversial topics": "controversial-topics", "father’s day": "fathers-day",
            "party time": "party-time", "sermon on the mount": "sermon-on-the-mount"}
series_names = {}
sermons = {}
descriptions = {}
series_images = {}
category_links = {}

for page in [p for p in archive if p["route"].startswith("/listen")]:
    route_slug = page["route"].rsplit("/", 1)[-1]
    if route_slug in ("by-book", "topical"):
        category_links[route_slug] = unique(
            link["href"] for link in page["links"]
            if ("/listen/" in link["href"] or link["href"] == "/joseph")
            and link["href"] not in ("/listen/by-book", "/listen/topical"))
        continue
    main = source_main(page)
    current = route_slug if route_slug not in ("listen", "sermon-topics") else "recent-sermons"
    is_series_page = route_slug not in ("listen", "sermon-topics", "recent-sermons")
    if is_series_page:
        filename = page["route"].strip("/").replace("/", "__") + ".html"
        title_match = re.search(r"<title>(.*?)</title>", (ROOT / "research/source" / filename).read_text(), re.S)
        if title_match:
            series_names.setdefault(current, title_match[1].split(" — ")[0].strip())
    for block in main.walk():
        if block.tag == "h2":
            title = block.text()
            normalized = title.lower().strip()
            if normalized in slug_map and not is_series_page:
                current = slug_map[normalized]
                series_names.setdefault(current, title)
        if block.tag == "img" and image_url(block):
            series_images.setdefault(current, image_url(block))
        if block.tag == "p" and block.text() and "sqs-block" not in block.attrs.get("class", ""):
            if block.text().startswith(("Listen with", "Listen along", "Come as", "Come join")):
                descriptions.setdefault(current, block.text())
        # A video's nearest outer sqs-block holds its exact thumbnail and encoded iframe.
        if "sqs-block" not in block.attrs.get("class", "").split():
            continue
        nodes = list(block.walk())
        poster = next((image_url(n) for n in nodes if n.tag == "img"), "")
        for node in nodes:
            encoded = node.attrs.get("data-html", "")
            if "<iframe" in encoded:
                embed = next((n for n in Document(encoded).root.walk() if n.tag == "iframe"), None)
                if not embed:
                    continue
                src = embed.attrs.get("src", "")
                if "cdn.embedly.com/widgets/media.html" in src:
                    src = parse_qs(urlparse(src).query).get("src", [""])[0]
                if not re.match(r"https://(?:www\.)?(?:youtube\.com/embed/|player\.vimeo\.com/)", src):
                    continue
                key = src.split("?")[0]
                title = embed.attrs.get("title", "Sunday sermon")
                if title == "YouTube embed":
                    title = series_names.get(current, current.replace("-", " ")).title() + " · Sermon video"
                item = sermons.setdefault(key, {"id": key.rsplit("/", 1)[-1], "kind": "video", "src": src,
                    "title": title, "image": poster, "series": []})
                if current not in item["series"]:
                    item["series"].append(current)
            if node.attrs.get("data-asset-url"):
                attrs = node.attrs
                src = attrs["data-asset-url"]
                item = sermons.setdefault(src, {"id": f"audio-{len(sermons)}", "kind": "audio", "src": src,
                    "title": attrs.get("data-title", "Sunday sermon"), "author": attrs.get("data-author", ""),
                    "duration": int(attrs.get("data-length-in-milli-seconds") or "0"), "image": poster, "series": []})
                if current not in item["series"]:
                    item["series"].append(current)

series = [{"slug": slug, "title": title, "description": descriptions.get(slug, ""), "image": series_images.get(slug, ""),
           "count": sum(slug in s["series"] for s in sermons.values())} for slug, title in series_names.items()]
data = {"series": series, "sermons": list(sermons.values()), "categoryLinks": category_links}
(ROOT / "src/data/sermons.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))

# The homepage needs only its current feature, not the entire archive bundle.
latest = next(s for s in data["sermons"] if "recent-sermons" in s["series"])
(ROOT / "src/data/latest.json").write_text(json.dumps(latest, ensure_ascii=False, indent=2))
print(f"Built: {len(churches)} house churches, {len(beliefs)} doctrines, "
      f"{sum(len(a['photos']) for a in albums)} photos in {len(albums)} albums, "
      f"{len(sermons)} unique sermons in {len(series)} series.")
