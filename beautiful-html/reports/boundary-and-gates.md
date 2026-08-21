# Beautiful HTML — Boundary and Gates Summary

## Mode

`Scaffold`（接近 Production）

Reason: a project-local reusable workflow derived from the "设计感 HTML 知识手册生成器" spec. Reused across different content and visual presets, but not yet a team/library/governed release.

## Owned job

Turn arbitrary long text into one design-conscious, single-file static HTML knowledge manual:

- distinctive visual identity (style preset + color system + Google Fonts)
- magazine/studio-grade typography, explicitly avoiding the "AI template" look
- flip-through structure: fixed sidebar TOC + hero + numbered chapters + mixed components
- responsive, print-friendly, semantic HTML, no external JS framework

## Output contract

Required (single generated file):

- `*.html` — self-contained manual, inline `<style>`, Google Fonts via `<link>`, all content preserved.

Recommended alongside:

- verification evidence: `python scripts/verify-html.py <file>` output + a browser screenshot
- a short note of content-structure decisions (chapters merged/split)

Skill package layout:

- `SKILL.md` — lean routing + core flow + success criteria + boundaries
- `agents/interface.yaml` — adapter metadata + degradation behavior
- `references/design-system.md` — full visual rules + quick checklist
- `references/style-presets.md` — 换装 reference table + default preset
- `references/component-library.md` — component inventory with markup recipes
- `template/skeleton.html` — verified single-file starting point implementing the design language
- `scripts/verify-html.py` — static checklist runner

## Near-neighbor exclusions

Do not route here for:

- interactive web apps / React/Vue SPAs or anything needing a runtime framework
- live data dashboards with dynamic data binding
- multi-page sites, CMS templates, or email HTML
- plain Markdown→HTML dumps with no design intent (use a simpler renderer)
- diagrams, charts, or data-visualization pages (see `diagram-design`)

## Asset design justification

- `SKILL.md` stays lean so activation cost stays low; detail lives in references.
- `references/design-system.md` is the normative spec; `style-presets.md` makes re-skinning explicit; `component-library.md` prevents monotone output.
- `template/skeleton.html` is the highest-value asset: it embeds the whole design language (tokens + all components) so generation is fast, consistent, and verifiable.
- `scripts/verify-html.py` automates the static part of the quick checklist (heuristic only; browser pass remains authoritative).

## Gates applied

- structure check: `SKILL.md`, `agents/interface.yaml`, `references/*`, `template/*`, `scripts/*`, report exist
- boundary check: description includes both positive triggers and exclusions
- output-risk check: design-system warns about template feel, blur shadows, system fonts, monotone pages, content loss, overflow
- verification: verify-html.py exercised against the skeleton (see below)
- template check: skeleton passes the checklist (modulo placeholders by design)

## Current-session evidence

Validated in `test_skill/` with a filled sample manual (`demo-git-manual.html`):

- filled the skeleton into a real Git collaboration manual (4 chapters, default preset)
- `scripts/verify-html.py demo-git-manual.html` → 11/11 PASS, 0 warn, 0 fail
- opened in a real browser (Chrome DevTools):
  - 4 sections, 3 cards, 1 table, 4 sidebar nav links
  - chapter numbers render hollow (`-webkit-text-stroke 2.5px`)
  - hero title resolves to Fraunces; `document.fonts` shows Fraunces + Archivo Black loaded
  - sidebar `position: fixed` at desktop width; `.table-scroll` has `overflow-x: auto`
  - anchor nav smooth-scrolls to the target section (`scrollY` 457, section top at viewport 0)
  - no console errors

## Gates deferred

Deferred until Production/Library promotion:

- `trigger_eval.py` / route-confusion holdout set
- `validate_skill.py`
- generated-output regression fixtures (one per style preset)
- visual regression / screenshot-based acceptance
- governance / trust report
- packaging (registry entry, install simulation)

## Promotion triggers

Promote beyond Scaffold if any of these happen:

- reused for multiple projects or teammates
- users confuse it with other HTML/design skills (route confusion)
- generated pages start drifting in visual quality
- a second verified preset beyond the default is proven and committed
- deterministic rendering (JS templating) becomes a repeated requirement
