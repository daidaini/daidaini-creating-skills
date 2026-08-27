---
name: beautiful-html
description: "Create a design-conscious, flip-through-able static HTML knowledge manual as a single self-contained file: magazine/studio-grade typography, custom Google Fonts, hand-crafted offset shadows (not blur), rotated sticker badges, hollow outline chapter numbers, fixed sidebar TOC, hero section, and a mixed component palette — explicitly avoiding the generic `AI template` look of blue-purple gradients and uniform rounded shadow cards. Includes an Elegant Vintage structural variant (early-20th-century print aesthetic: aged paper texture, double-rule frames, wax seal, roman-numeral engravings, serif-only typography) with its own ready-made skeleton. Accepts an optional style argument: passing a preset name or style keyword (e.g. `beautiful-html 赛博朋克`, `vintage`, `swiss`) selects that style preset from the 换装 table; if no style argument is given, defaults to the Scandinavian + pop-art warm-oatmeal look. Use when the user wants 有设计感的 HTML 知识手册, 杂志感排版 HTML 页面, 风格化的 HTML 静态页面, 知识手册生成器, 优雅复古风格页面, 复古印刷风手册, vintage/old-print style HTML, stylish HTML documentation, a designed static HTML manual/page, or to transform long notes/summaries/methodologies into a polished single-page HTML handbook. Do NOT use for interactive web apps or JS-framework SPAs (React/Vue), live data dashboards with dynamic data binding, multi-page websites, email HTML, or anything requiring a build server or runtime backend."
license: MIT
---

# Beautiful HTML

Turn arbitrary long text (technical summaries, knowledge points, methodology) into one visually distinctive, paged-style static HTML manual that opens by double-clicking. The goal is "designed by a human" — magazine/design-studio quality, never generic AI template styling.

## When to use

- User wants a designed, 设计感 static HTML page or manual from text content.
- Content is a long summary / notes / methodology that benefits from a flip-through handbook layout (sidebar TOC + hero + numbered chapters + mixed components).
- A single self-contained `.html` file is acceptable (inline styles, Google Fonts via `<link>`).
- The user wants a specific visual identity (style keyword + color keyword), or wants to re-skin the same structure with a different preset.

## When NOT to use

- Interactive web app, React/Vue SPA, or anything needing a runtime framework → out of scope.
- Live data dashboard / dynamic data binding → out of scope.
- Multi-page site or CMS template → out of scope.
- Email HTML (no inline CSS constraints here, but also no need for this design system).
- The user just wants a quick plain Markdown-to-HTML dump without design intent.

## Core flow (5 steps)

1. **Confirm target + design variables.** Target file/folder, style preset (see [Style Presets](references/style-presets.md)) or custom style keywords, color keywords, and whether Google Fonts over the network is acceptable. If the user only says "有设计感" without details, default to the Scandinavian + pop-art preset with warm oatmeal base. If the user asks for 优雅复古 / vintage / 复古印刷 / 老式杂志风格, use the Elegant Vintage structural variant: start from [template/skeleton-vintage.html](template/skeleton-vintage.html) instead of the default skeleton, and follow [Style Presets → 优雅复古](references/style-presets.md#优雅复古-presetelegant-vintage专属骨架).
2. **Plan content structure.** Read the source content. Preserve ALL key information, tables, categories, and logic. Split/merge into chapters of "one screen to one-and-a-half screens" each. Decide which components each section needs (avoid repeating one component for the whole page — see [Component Library](references/component-library.md)).
3. **Generate the page.** Start from the skeleton matching the chosen preset — [template/skeleton.html](template/skeleton.html) for the default pop-art look, [template/skeleton-vintage.html](template/skeleton-vintage.html) for Elegant Vintage: copy it, replace the design-token variables (fonts, colors, decorative shapes) and fill each chapter with the planned content using the component classes. Keep class names stable and legible so colors/content stay easy to modify.
4. **Verify against the checklist.** Run `python scripts/verify-html.py <file>` for the static checklist (fonts, no default gradient, offset shadows, rotated elements, hollow numbers, responsive, print, semantics, single-file). Then open in a real browser: check sidebar anchor jumps, mobile collapse, horizontal table scroll, console has 0 errors, take a screenshot. See [Design System → Quick Checklist](references/design-system.md#快速检查清单).
5. **Deliver.** Report the output file path, the visual identity used, and any content-structure decisions made (chapters merged/split) so nothing was silently dropped.

## Success criteria (must all pass)

- Single `.html` file; inline `<style>`; no external JS framework.
- Google Fonts `<link>` present and actually used for headings/emphasis/body (not system-font defaults).
- Color identity avoids the default blue/purple gradient; base color restrained, accent colors loud and contrasting.
- Cards use offset solid shadows (e.g. `box-shadow: 6px 6px 0 #...`), not blur shadows; hover shifts the card slightly.
- At least one rotated element (sticker badge / label, e.g. `transform: rotate(-3deg)`).
- Chapter numbers are poster-like hollow/outlined large figures (stroke, not fill).
- Every chapter uses ≥2 different component types; the page mixes cards, tables, process steps, formula boxes, callouts, quotes, badges.
- Responsive: sidebar becomes top bar on mobile; wide tables scroll horizontally. Print: `@media print` hides the sidebar.
- Semantic tags: `aside`, `nav`, `section`, `article`, `table`, etc.
- All source content preserved — no omissions for the sake of styling; ends with a one-line summary + styled sign-off.
- Browser check: 0 console errors, anchor nav works, no overflow that clips content.

## Key pitfalls

- **Template feel:** the moment you use a centered big-title hero + uniform rounded shadow cards + blue-purple gradient, you've failed the core requirement. Refer to [Design System](references/design-system.md) for the "human-made" cues list.
- **System fonts only:** must include Google Fonts `<link>`; the three roles (display serif / heavy sans emphasis / humanist sans body) must be distinct.
- **Blur shadows:** `box-shadow: 0 4px 12px rgba(...)` is the generic look. Use offset solid shadows (`box-shadow: 6px 6px 0 rgba(0,0,0,0.9)` or a solid color) for the hand-crafted sticker feel.
- **Monotone pages:** one component type across the whole page reads as a template. Rotate between cards / tables / process strips / formula boxes / callouts / quotes per section.
- **Losing content:** readability is a goal, but never cut facts, tables, or categories. Re-flow into sections, don't delete.
- **Layout overflow:** long tables need a `.table-scroll` wrapper (mobile horizontal scroll); code/formula boxes need `overflow-x: auto`.
- **Fonts are network-dependent:** the page is otherwise offline-capable, but Google Fonts requires network to render the intended type. State this clearly if the user needs fully offline output (then swap in local `@font-face` files).

## References

- [Design System](references/design-system.md) — full visual rules: style cues, color system, font system, structure, technical + content requirements, and the quick checklist.
- [Style Presets](references/style-presets.md) — the 换装 reference table (Scandinavian pop, Wabi-sabi, Bauhaus, Cyberpunk, Editorial, Swiss, Retro-print, Elegant Vintage) and how to swap style/color/font variables. Elegant Vintage has its own structural skeleton and dedicated section.
- [Component Library](references/component-library.md) — the parts inventory with concrete HTML/CSS recipes for each component, plus the vintage-variant component substitution table.
- [Skeleton Template](template/skeleton.html) — verified single-file starting point for the default design language (tokens + all components) with placeholder content.
- [Vintage Skeleton](template/skeleton-vintage.html) — Elegant Vintage structural variant: aged-paper texture layers, double-rule frame with corner ornaments, wax seal, rubber-stamp badges, hollow roman-numeral chapters, drop caps, sepia photos.
- [Verification Script](scripts/verify-html.py) — static checklist runner.
