# HTML Output Guide

## When to Convert to HTML

Markdown (`{topic-slug}_learning_ladder.md`) is the primary deliverable. Only produce HTML when the user explicitly asks: "生成HTML", "导出HTML", "做成网页", "HTML版本", "单文件 HTML", "offline HTML", or simply "HTML".

Two routes — pick by the user's wording, do not mix:

| Route | When | Basis |
|-------|------|-------|
| **A — Zen static (default)** | Plain HTML export request with no style preference, or "单文件/离线/静态 HTML" | Generation method and "日式极简 × 侘寂 × 未来科技" style of the `content-to-zen-static-html` skill |
| **B — Magazine flip-through** | User asks for 杂志风, 可翻阅, 海报感, poster-like designed pages | The `beautiful-html` skill |

## Route A (default): via content-to-zen-static-html

Delegate to the sibling skill `content-to-zen-static-html` and follow its workflow against its own `SKILL.md`. Ladder-specific notes:

1. **Source**: the markdown ladder just generated. Content must pass through verbatim — the HTML is a design transformation, not an edit.
2. **Content model**: the ladder is a linear long-form document, not an item archive. Do not force条目化. Organize as: opening 5-level overview → one chapter per level (Levels 1–5, each chapter holding its 8 sections in order) → closing "Road Ahead". Use the level names for `#tocNav` links. Categories (`#catNav`) are optional; if uncertain, ship only 「全部」.
3. **Generation path**: the skill's default 方式 A — copy its `template/zen-base.html`, replace every `ZEN:EDIT` marker, keep the template CSS/JS and interactions (search, TOC highlight, progress bar, theme toggle, mobile drawer) intact. 方式 B (embedded JSON) only if its stated conditions are met — normally they are not for a 5-level ladder.
4. **Style**: keep the default 「日式极简 × 侘寂 × 未来科技」. If the topic suggests a different feel, only swap the single accent color and font variables in `:root` / `[data-theme="dark"]` per the skill's 风格定制 invariants (system fonts, no CDN, charcoal not pure black in dark mode).
5. **Verification (mandatory)**: run `python <content-to-zen-static-html目录>/scripts/verify-html.py <输出文件>.html` until exit 0, then do the skill's browser check over file:// (anchors, search, theme, mobile, console clean).
6. **Save**: `{topic-slug}_learning_ladder.html` in the working directory.

## Route B: via beautiful-html

Use the `beautiful-html` skill's 5-step flow (confirm design variables → plan structure → generate → verify → deliver), with these mappings and defaults.

### Confirm Design Direction

- **Style preset**: default "Scandinavian + pop-art" with warm oatmeal base (the beautiful-html default)
- **Color keywords**: match the topic's feel (e.g., "coffee" → warm browns; "coding" → deep navy + electric blue)
- **Language**: HTML labels match the ladder's language (Chinese ladder → Chinese UI)

### Map Content to Components

| Ladder Section | Beautiful-HTML Component |
|---------------|--------------------------|
| Opening table (5-level overview) | `.comparison-table` or `.level-grid` cards |
| Each level (1-5) | A `<section>` with hollow outline chapter number |
| "What This Level Is About" | `.callout` or `.lead-paragraph` |
| "Mastery Standard" | `.checklist` or `.highlight-box` |
| "Core Concepts & Skills" | `.bullet-cards` or `.icon-list` |
| "Milestone" | `.milestone-badge` (rotated sticker) |
| "Hands-On Exercise" | `.exercise-box` or `.process-steps` |
| "Common Mistakes" | `.warning-cards` or `.mistake-grid` |
| "Self-Check Question" | `.quote` or `.question-callout` |
| "What's Next" | `.bridge-ribbon` or `.next-level-teaser` |
| Closing "Road Ahead" | `.sign-off` section |

**Critical:** Mix at least 2-3 different component types per level section. Don't use the same component for everything — that creates the "AI template" look.

### Design Tips for Learning Ladders

- Use **offset solid shadows** for level cards (not blur shadows)
- Use **rotated sticker badges** for level numbers or "Level 1" labels
- Use **hollow outline chapter numbers** for the 5 levels (large, poster-like)
- The **sidebar TOC** should show all 5 levels for quick navigation
- **Each level should have a distinct visual rhythm** — alternate between dense and airy sections
- Use **warm encouraging colors** — this is a motivational document, not a corporate report

## Content Preservation Rule (both routes)

**All source content must be preserved.** Every section, every bullet point, every mistake from the markdown must appear in the HTML. Re-flow into sections, don't delete. Both routes require the output to be a single self-contained `.html` that opens by double-click with no server, and both must pass their verification steps (script + real-browser check) before delivery.
