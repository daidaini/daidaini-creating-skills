---
name: beautiful-html
description: "Create a design-conscious, flip-through-able static HTML knowledge manual from long text (summaries, notes, methodology): one self-contained .html file that opens by double-clicking, skinnable via an optional style parameter, avoiding the generic AI-template look. Trigger on: 有设计感的 HTML 知识手册, 杂志感排版 HTML 页面, 风格化的 HTML 静态页面, 知识手册生成器, 优雅复古/复古印刷风页面, vintage/old-print style HTML, stylish HTML documentation, designed static HTML manual/page, 把长笔记/总结/方法论做成精美单页 HTML 手册. Use the `style` parameter to select a preset (e.g. style=zen, style=cyberpunk, style=vintage). NOT for: interactive web apps, JS-framework SPAs (React/Vue), live data dashboards, multi-page websites, email HTML, or anything requiring a build server/runtime."
license: MIT
disable-model-invocation: true
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

## Style parameter（风格参数）

One optional `style` parameter may be passed to select a preset; otherwise default to the Scandinavian + pop-art preset with a warm oatmeal base.

| Parameter value | Preset |
|---|---|
| `zen` | Delegates to `content-to-zen-static-html` skill (Japanese Minimalism × Wabi-Sabi × Futuristic Tech). See [Zen routing](#zen-routing). |
| `cyberpunk` | Cyberpunk preset |
| `swiss` | Swiss preset |
| `vintage` / `elegant` | Elegant Vintage variant |
| A color keyword (e.g. `style=莫兰迪绿`) | Re-skin the default preset with that palette |

### Zen routing

When `style=zen` is passed, the beautiful-html skill does **not** generate the page itself. Instead, it delegates to the `content-to-zen-static-html` skill, which produces a single-file static HTML with a Japanese Minimalism × Wabi-Sabi × Futuristic Tech visual language and zero external dependencies. The beautiful-html design rules (offset shadows, rotated stickers, hollow chapter numbers, Google Fonts) do not apply in this case; the zen skill's own rules govern the output.

### Manual trigger only

This skill is **user-manual-trigger only**. It must not be invoked automatically by an agent. The user must explicitly request it (e.g., "帮我生成一个设计感的 HTML 手册" or "用 beautiful-html 生成一个知识手册").

## Core flow (5 steps)

1. **Confirm target + design variables.** Target file/folder, style parameter (see [Style Presets](references/style-presets.md)) or custom style keywords, color keywords, and whether Google Fonts over the network is acceptable. If the user only says "有设计感" without details, default to the Scandinavian + pop-art preset with warm oatmeal base. If the user passes `style=vintage` / `style=elegant`, use the Elegant Vintage structural variant: start from [template/skeleton-vintage.html](template/skeleton-vintage.html) instead of the default skeleton, and follow [Style Presets → 优雅复古](references/style-presets.md#优雅复古-presetelegant-vintage专属骨架). If the user passes `style=zen`, delegate to the `content-to-zen-static-html` skill instead — do not use the beautiful-html skeleton or presets.
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

- **Zen delegation:** if `style=zen` is passed, the beautiful-html skill must not be used. The `content-to-zen-static-html` skill owns the visual rules for those styles. Attempting to apply beautiful-html presets (offset shadows, Google Fonts, sticker badges) to a zen request produces a mismatched result.
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
- [content-to-zen-static-html](../../content-to-zen-static-html/SKILL.md) — delegated skill for `style=zen` requests.
