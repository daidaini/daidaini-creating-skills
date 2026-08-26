# HTML Output Guide

## When to Convert to HTML

After generating the markdown ladder, the user may want a designed, flip-through-able HTML page. This is especially useful for:

- Long-term reference (learners revisit the ladder over weeks/months)
- Sharing with others (a designed page is more engaging than raw markdown)
- Topics where visual hierarchy helps (e.g., comparing 5 levels side by side)

**Trigger phrases:** "生成HTML", "做成网页", "做成好看的页面", "HTML版本", "导出HTML", or simply "HTML".

## How to Convert

Use the `beautiful-html` skill to transform the markdown ladder into a single self-contained HTML file. The conversion follows these steps:

### Step 1: Confirm Design Direction

Ask the user (or default):
- **Style preset**: If the user doesn't specify, default to "Scandinavian + pop-art" with warm oatmeal base (the beautiful-html default)
- **Color keywords**: Match the topic's feel (e.g., "coffee" → warm browns; "coding" → deep navy + electric blue)
- **Language**: The HTML should match the ladder's language (Chinese ladder → Chinese UI labels in HTML)

### Step 2: Map Content to Components

The ladder's structure maps naturally to beautiful-html components:

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

### Step 3: Generate Using Beautiful-HTML Workflow

Follow the beautiful-html skill's 5-step flow:

1. **Confirm target + design variables** — style preset, color keywords, Google Fonts OK
2. **Plan content structure** — split the 5 levels into "one screen to one-and-a-half screens" each
3. **Generate the page** — use the skeleton template, fill with ladder content
4. **Verify** — run the verification script, check in browser
5. **Deliver** — save to `{topic-slug}_learning_ladder.html`

### Step 4: Save

Output file: `{topic-slug}_learning_ladder.html` in the working directory.

## Content Preservation Rule

**All source content must be preserved.** The HTML is a design transformation — not an edit. Every section, every bullet point, every mistake from the markdown must appear in the HTML. Re-flow into sections, don't delete.

## Design Tips for Learning Ladders

- Use **offset solid shadows** for level cards (not blur shadows)
- Use **rotated sticker badges** for level numbers or "Level 1" labels
- Use **hollow outline chapter numbers** for the 5 levels (large, poster-like)
- The **sidebar TOC** should show all 5 levels for quick navigation
- **Each level should have a distinct visual rhythm** — alternate between dense and airy sections
- Use **warm encouraging colors** — this is a motivational document, not a corporate report
