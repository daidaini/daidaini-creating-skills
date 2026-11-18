---
name: beautiful-html
description: Turn notes, summaries, or long-form text into a single self-contained, publication-grade static HTML manual with preset or bespoke editorial styling.
license: MIT
disable-model-invocation: true
---

# Beautiful HTML

Turn source text into one self-contained `.html` file that opens over `file://` and reads like an art-directed publication, not a generic SaaS template.

## Style & Routing

Choose a visual direction from the optional `style` parameter, the user's aesthetic cues, or the nature of the subject matter:

- **`style=zen` (or wabi-sabi / 日式极简 / 侘寂)**: Stop here and follow [`content-to-zen-static-html`](../content-to-zen-static-html/SKILL.md) instead; its own workflow and verification govern the output.
- **Bundled presets** — read the matching skeleton in `template/` as a starting foundation, then adapt its tokens, rhythm, and components (or add custom components) to fit the material rather than mechanically filling slots:
  - `vintage` / `elegant` *(default when no style is specified)*: [`template/skeleton-vintage.html`](template/skeleton-vintage.html) — early-20th-century print, aged paper, double-rule frame, roman numerals, wax/rubber seals.
  - `inkwash` / `shuimo` (水墨 / 宣纸 / 古风): [`template/skeleton-inkwash.html`](template/skeleton-inkwash.html) — xuan paper, vertical-rl title slip, vermilion seal, Chinese numerals, ink-wash SVG motifs.
  - `cyberpunk`: [`template/skeleton-cyberpunk.html`](template/skeleton-cyberpunk.html) — dark engineering grid, neon signal accents, display + mono + CJK sans type.
  - `pop` / `scandi`: [`template/skeleton.html`](template/skeleton.html) — warm oatmeal ground, bold pop accents, offset solid shadows, rotated stickers, organic blobs.
- **Any other direction** (`style=swiss`, Bauhaus, financial broadsheet, botanical field guide, color/mood keywords, or a custom aesthetic suited to the topic): either re-skin the closest skeleton or write bespoke HTML/CSS from scratch faithful to that tradition's real grid, rules, and typography. Never force pop-art stickers or outline numbers onto an aesthetic where they do not belong.

## Craft & Content Rules

1. **Preserve 100% of substantive content.** Keep every fact, argument, category, code snippet, and table row from the source. Organize into well-paced chapters with navigable TOC links, and vary layout rhythm across sections (prose, cards, comparison tables, numbered steps, pull-quotes, callouts, code/formula blocks) instead of repeating one component down the whole page.
2. **Parse Markdown and diagrams cleanly.** Convert all Markdown syntax into semantic HTML (`aside`, `nav`, `main`, `section`, `article`, `table`, etc.) with code properly escaped; for large or deeply nested Markdown, `pandoc input.md -f gfm -t html --no-highlight` may be used at build time. When flows, architectures, or multi-branch logic read better visually (or appear as Mermaid/ASCII diagrams, unless the source is teaching diagram syntax), render them as responsive inline `<svg viewBox="...">` with `<title>`/`<desc>` styled in the page's palette.
3. **Commit to deliberate typography and color.** Pair distinct display, emphasis, and body typefaces (via Google Fonts `<link>` with sensible CJK fallbacks, or local/system stacks when fully offline output is requested). Define palette tokens in `:root`: restrained ground, crisp ink, and decisive accents—avoiding default blue-purple gradients and uniform blur-shadow card grids.
4. **Single-file, responsive, print-clean, unbranded.** Inline all CSS (and any minimal vanilla JS if needed); use no external JS/CSS frameworks. Collapse navigation cleanly on mobile, wrap wide tables and preformatted blocks in horizontal scroll (`overflow-x: auto`), and strip navigation chrome and heavy background textures in `@media print`. Include zero generator branding (`beautiful-html` / `Beautiful HTML` or template slogans) anywhere in markup, comments, title, sidebar, or footer; colophon holds real document metadata only or is omitted.

## Workflow

1. **Read & art-direct.** Read the source, pick the preset skeleton or bespoke aesthetic direction (handing off `style=zen`), and plan chapter divisions and component variety around the content's natural structure.
2. **Generate the `.html`.** Write the complete single-file HTML with all source content intact and no `REPLACE` placeholders left behind.
3. **Verify before delivery.**
   - Run `python3 <skill-dir>/scripts/verify-html.py <output.html>` and fix any `FAIL`.
   - Open `file://<abs-path>` in a real browser: verify desktop and mobile widths (TOC anchor navigation, no clipped overflow, legible SVG diagrams, 0 console errors) and check a screenshot. If no browser tool is available, state that visual verification was not run.
   - Report the output path, visual direction, and any structural reorganizations made.
