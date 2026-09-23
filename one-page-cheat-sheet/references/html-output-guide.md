# HTML Output Guide

Markdown (`{topic-slug}_cheat_sheet.md`) is always written first. Produce HTML only when the user explicitly asks: "HTML", "html 版", "做成网页", "导出 HTML", "单文件 HTML", "离线 HTML".

There is one route. Do not mix in `beautiful-html` or a hand-written theme.

| Route | When | Basis |
|-------|------|-------|
| Zen static | Any explicit HTML request from this skill | Generation method and 「日式极简 × 侘寂 × 未来科技」 style of `content-to-zen-static-html` |

A generic "turn this long doc into HTML" request with no cheat-sheet intent belongs to `content-to-zen-static-html` directly. Do not pull it here.

## Workflow

Delegate to the sibling skill `content-to-zen-static-html` and follow its `SKILL.md`. Cheat-sheet notes:

1. **Source**: the markdown file just saved. Copy substance through. Do not add theory, drop a mandatory section, or "improve" examples during conversion.
2. **Content model**: linear long-form, not an item archive. Hero = title + the one-sentence definition. Then one block per remaining section, in the mandatory order, with `#tocNav` links for all 8 sections. If categories are unclear, ship only 「全部」. Do not force 条目化; a 5-minute sheet is not a 50-entry archive, so 方式 B (embedded JSON) does not apply.
3. **Generation path**: 方式 A. Copy `content-to-zen-static-html/template/zen-base.html`, replace every `ZEN:EDIT` marker, delete the template comment block and sample entries, keep template CSS/JS and interactions (search, TOC highlight, progress, theme, mobile drawer).
4. **Visual reference**: the zen page must not depend on Mermaid, Chart.js, Google Fonts, or any CDN. Render tables as HTML tables. Render a decision tree or mnemonic as `<pre>` or a short inline SVG. Escape `<`, `>`, and `&` inside code.
5. **Density**: this is still a one-page cheat sheet displayed for screen reading. Do not stretch bullets into paragraphs to fill the zen layout. Language of UI labels matches the sheet (Chinese sheet → Chinese chrome).
6. **Style**: keep the default zen variables. Do not swap accent color unless the user names a color. No second design system.
7. **Save**: `{topic-slug}_cheat_sheet.html` in the working directory, next to the markdown.

## Section mapping

| Cheat sheet section | Zen page |
|---------------------|----------|
| Title + review line | Hero / brand |
| 1. What It Is | Hero lead, also the first TOC target |
| 2. Core Concepts | Section: bullets or a short definition list |
| 3. Visual Reference | Section: table, `<pre>`, or inline SVG |
| 4. Real-World Examples | Section: one subsection per example |
| 5. Common Mistakes | Section: HTML table (mistake / why / fix) |
| 6. Checklist | Section: checklist list |
| 7. Rapid-Fire Questions | Section: numbered questions, answers collapsed or listed after a rule so self-test still works |
| 8. One More Thing | Short closing block, not a new essay |

## Verification

Static check (exit 0, no FAIL):

```bash
python <content-to-zen-static-html目录>/scripts/verify-html.py <输出文件>.html
```

Omit `--expect-entries` for this linear sheet.

Then open `file://` in a real browser: console clean, offline refresh still complete, TOC anchors jump, search hits a concept and a mistake, theme toggle stays readable, mobile width does not scroll sideways.

## Done when

- Markdown and HTML both exist.
- HTML is one file, no server, no external runtime dependency.
- All 8 sections are present and match the markdown.
- `verify-html.py` exits 0 and the browser check passed.
