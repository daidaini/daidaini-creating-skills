#!/usr/bin/env python3
"""Assemble the existing Zen template without regenerating its CSS/JS.

python render.py --markdown input.md -o output.html
python render.py --model content.json -o output.html
Model file references are relative to the JSON file, not the current directory.
"""
import argparse
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def plain(value):
    parser = Text()
    parser.feed(value)
    return ''.join(parser.parts).strip()


def esc(value):
    return html.escape(str(value), quote=True)


def markdown(path):
    pandoc = shutil.which('pandoc')
    if not pandoc:
        raise ValueError('pandoc unavailable: use --model with html/html_file; do not install dependencies automatically')
    result = subprocess.run(
        [pandoc, str(path), '-f', 'gfm', '-t', 'html', '--no-highlight', '--wrap=none'],
        capture_output=True, encoding='utf-8', check=True)
    return result.stdout


def from_markdown(path, title):
    source = markdown(path)
    first = re.match(r'\s*<h1\b[^>]*>(.*?)</h1>\s*', source, re.S)
    if first:
        title = title or plain(first[1])
        source = source[first.end():]
    title = title or path.stem
    # Pandoc escapes fenced code, so heading-like code cannot split sections.
    headings = list(re.finditer(r'^<h2\b([^>]*)>(.*?)</h2>\s*', source, re.M | re.S))
    entries = []
    intro = source[:headings[0].start()] if headings else source
    if intro.strip():
        entries.append({'title': '导读' if headings else title, 'html': intro})
    for i, heading in enumerate(headings):
        end = headings[i + 1].start() if i + 1 < len(headings) else len(source)
        anchor = re.search(r'\bid="([^"]+)"', heading[1])
        entry = {'title': plain(heading[2]), 'title_html': heading[2],
                 'html': source[heading.end():end]}
        if anchor:
            entry['id'] = html.unescape(anchor[1])
        entries.append(entry)
    return {'title': title, 'entries': entries}


def replace_one(source, pattern, replacement):
    source, count = re.subn(pattern, lambda _: replacement, source, flags=re.S)
    if count != 1:
        raise ValueError(f'template contract changed ({count} matches): {pattern}')
    return source


def render(model, base):
    title = model['title']
    entries = model['entries']
    if not isinstance(title, str) or not title.strip() or not isinstance(entries, list) or not entries:
        raise ValueError('model needs a nonempty title and entries list')
    categories, anchors, articles, toc = {}, set(), [], []
    reserved = set(re.findall(r'\bid="([^"]+)"', (ROOT / 'template/zen-base.html').read_text(encoding='utf-8')))
    reserved -= {'entry-01', 'entry-02', 'entry-03'}
    for i, entry in enumerate(entries, 1):
        anchor = entry.get('id', f'entry-{i:02d}')
        if not isinstance(anchor, str) or not anchor or re.search(r'[\s#<>"\']', anchor) or anchor in anchors or anchor in reserved:
            raise ValueError(f'invalid, duplicate or reserved entry id: {anchor!r}')
        anchors.add(anchor)
        heading = entry['title']
        if not isinstance(heading, str) or not heading.strip():
            raise ValueError(f'entry {i}: title required')
        keys = [key for key in ('html', 'html_file', 'markdown_file') if key in entry]
        if len(keys) != 1:
            raise ValueError(f'entry {i}: provide exactly one of html/html_file/markdown_file')
        key = keys[0]
        if key == 'html':
            body = entry[key]
        else:
            path = (base / entry[key]).resolve()
            body = markdown(path) if key == 'markdown_file' else path.read_text(encoding='utf-8-sig')
        if not isinstance(body, str):
            raise ValueError(f'entry {i}: body must be HTML text')
        category = entry.get('category', '')
        if category:
            categories.setdefault(category, f'cat-{len(categories) + 1}')
        cat = categories.get(category, 'all')
        subtitle = f'<span class="entry-en">{esc(entry["subtitle"])}</span>' if entry.get('subtitle') else ''
        tags = ''.join(f'<span class="tag">{esc(tag)}</span>' for tag in entry.get('tags', []))
        tags = f'<div class="entry-tags">{tags}</div>' if tags else ''
        articles.append(
            f'<article class="entry" id="{esc(anchor)}" data-cat="{cat}">\n'
            f'<div class="entry-no" aria-hidden="true">{i:02d}</div>\n'
            f'<h2>{entry.get("title_html", esc(heading))}</h2>\n{subtitle}\n'
            f'<div class="entry-content">\n{body}\n</div>\n{tags}\n</article>')
        toc.append(f'<a href="#{esc(anchor)}">{i:02d} {esc(heading)}</a>')
    source = (ROOT / 'template/zen-base.html').read_text(encoding='utf-8')
    source = replace_one(source, r'<!--.*?-->\s*(?=<html)', '')
    for old, value in {
        'ZEN:EDIT 页面标题': title,
        'ZEN:EDIT 文档或站点名': model.get('brand', title),
        'ZEN:EDIT 文档主标题': title,
    }.items():
        if source.count(old) != 1:
            raise ValueError(f'template field changed: {old}')
        source = source.replace(old, esc(value))
    for css, key in [('hero-kicker', 'kicker'), ('hero-en', 'subtitle'), ('hero-lede', 'lede')]:
        value = model.get(key)
        source = replace_one(source, rf'<p class="{css}">.*?</p>',
                             f'<p class="{css}">{esc(value)}</p>' if value else '')
    buttons = '<button class="cat active" data-cat="all">全部</button>\n'
    buttons += '\n'.join(f'<button class="cat" data-cat="{cat}">{esc(label)}</button>' for label, cat in categories.items())
    source = replace_one(source, r'(<nav class="cats" id="catNav"[^>]*>).*?</nav>',
                         f'<nav class="cats" id="catNav" aria-label="分类筛选">\n{buttons}\n</nav>')
    source = replace_one(source, r'<nav class="toc" id="tocNav"[^>]*>.*?</nav>',
                         '<nav class="toc" id="tocNav" aria-label="条目目录">\n' + '\n'.join(toc) + '\n</nav>')
    source = replace_one(source, r'<section class="entries" id="entries">.*?(?=<div class="no-results")',
                         '<section class="entries" id="entries">\n' + '\n'.join(articles) + '\n')
    source = replace_one(source, r'<span>单文件 · 离线可用</span>', '')
    source = replace_one(source, r'<b id="entryCount">.*?</b>', f'<b id="entryCount">{len(entries)}</b>')
    source = replace_one(source, r'<b id="visibleCount">.*?</b>', f'<b id="visibleCount">{len(entries)}</b>')
    footer = model.get('footer')
    source = replace_one(source, r'<footer>.*?</footer>',
                         f'<footer><span class="foot-style">{esc(footer)}</span></footer>' if footer else '')
    if 'ZEN:EDIT' in source:
        raise ValueError('unresolved template marker')
    return source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    inputs = parser.add_mutually_exclusive_group(required=True)
    inputs.add_argument('--model', type=Path)
    inputs.add_argument('--markdown', type=Path)
    parser.add_argument('--title', help='override document title')
    parser.add_argument('-o', '--output', type=Path, required=True)
    args = parser.parse_args()
    try:
        input_path = (args.model or args.markdown).resolve()
        if args.output.resolve() == input_path:
            raise ValueError('output must differ from input')
        if args.model:
            model = json.loads(input_path.read_text(encoding='utf-8-sig'))
        else:
            model = from_markdown(input_path, args.title)
        if args.title:
            model['title'] = args.title
        result = render(model, input_path.parent)
        # Verify the candidate before replacing a previously delivered output.
        import tempfile
        with tempfile.TemporaryDirectory(prefix='zen-render-') as tmp:
            candidate = Path(tmp) / 'candidate.html'
            candidate.write_text(result, encoding='utf-8')
            check = subprocess.run([sys.executable, str(ROOT / 'scripts/verify-html.py'),
                                    str(candidate), '--expect-entries', str(len(model['entries']))],
                                   capture_output=True, encoding='utf-8')
            if check.returncode:
                print(check.stdout, end='')
                print(check.stderr, end='', file=sys.stderr)
                return check.returncode
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(result, encoding='utf-8')
        print(f'PASS: {len(model["entries"])} entries; static verification exit 0; {args.output.resolve()}')
        for line in check.stdout.splitlines():
            if line.startswith('WARN'):
                print(line)
        return 0
    except (OSError, ValueError, KeyError, TypeError, subprocess.CalledProcessError) as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        if isinstance(exc, subprocess.CalledProcessError) and exc.stderr:
            print(exc.stderr, file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
