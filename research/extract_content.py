"""Extract a reviewable content archive without executing source-site scripts."""
import json
import re
from html import unescape
from html.parser import HTMLParser
from pathlib import Path


class Node:
    def __init__(self, tag, attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.children = []

    def text(self):
        return re.sub(r"\s+", " ", " ".join(
            child if isinstance(child, str) else child.text()
            for child in self.children
            if isinstance(child, str) or child.tag not in ("script", "style")
        )).strip()

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()


class Document(HTMLParser):
    void = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.void:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.void:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def main():
    base = Path(__file__).parent
    inventory = json.loads((base / "site-inventory.json").read_text())
    archive = []
    for page in inventory:
        document = Document((base / "source" / page["source"]).read_text())
        main = next((n for n in document.root.walk() if n.tag == "main"), document.root)
        blocks = []
        images = []
        embeds = []
        for node in main.walk():
            attrs = node.attrs
            if node.tag in ("h1", "h2", "h3", "h4", "p", "li") and node.text():
                blocks.append({"tag": node.tag, "text": node.text()})
            if node.tag == "img":
                url = attrs.get("data-src") or attrs.get("data-image") or attrs.get("src")
                if url:
                    images.append({"url": url, "alt": attrs.get("alt", "")})
            for key in ("data-html", "data-config-url", "data-url", "data-audio-url"):
                if attrs.get(key):
                    embeds.append({"attribute": key, "value": unescape(attrs[key])})
        links = [{"text": n.text() or n.attrs.get("aria-label", ""), "href": n.attrs["href"]}
                 for n in document.root.walk() if n.tag == "a" and n.attrs.get("href")]
        archive.append({"route": page["route"], "sourceUrl": page["url"], "blocks": blocks,
                        "images": images, "embeds": embeds, "links": links})
    (base / "content-archive.json").write_text(json.dumps(archive, ensure_ascii=False, indent=2))
    for page in archive:
        print(f"{page['route']}: {len(page['blocks'])} text blocks, {len(page['images'])} images, {len(page['embeds'])} embeds")

if __name__ == '__main__':
    main()
