---
name: product-analysis
description: >-
  Analyze a product's essence via first-principles deconstruction and historical evolution, then generate a client-ready HTML report.
  Trigger on: 产品分析, 拆解产品, 产品报告, 产品第一性原理, 产品演化, product analysis, "what should X really be", "why is X the way it is".
  NOT for: investment-specific analysis (use ljg-invest), feature-only analysis, abstract concept analysis, quick factual lookups, or marketing overviews.
---

# Product Analysis: First Principles + Historical Evolution

## Overview

This skill produces a focused product analysis report. 
The entire analysis revolves around one **核心锚点（Core Anchor）**— a single sentence that captures the most essential truth about the product. 
Every section exists to support, explain, or challenge this anchor.

Three phases:

1. **First Principles Deconstruction** — strip to the core need, reconstruct the ideal form, identify the gap
2. **Historical Evolution** — trace 3–6 key turning points that shaped the product into what it is (count depends on product complexity)
3. **HTML Report** — synthesize into a client-ready report with the "电子杂志 × 电子墨水" aesthetic

## When to Use

- A user mentions a product and wants to understand its essence
- A user asks "what should X really be?" or "why is X the way it is?"
- A user wants a visual product analysis for presentation
- A user is evaluating whether to build, buy, or compete with a product

**Do NOT use for:**
- Quick factual lookups — those are search queries
- Investment-specific analysis — use ljg-invest
- Single-feature analysis — this skill analyzes the whole product
- Abstract concept analysis — use ljg-think

## Workflow

### Preflight: Clarify the Analysis Frame

Before starting, quickly align on what's being analyzed. You don't need a long questionnaire — one short clarifying sentence is usually enough.

| Input | When to clarify |
|---|---|
| **Product name** | Always needed — the exact product or company-product (e.g., "微信支付" vs "微信") |
| **Scope** | Only if ambiguous — whole product by default |
| **Audience** | Only if unusual — founder, investor, product team, client, or general reader |
| **Depth** | Only if they might want a short verbal analysis — full HTML report by default |
| **Angle** | Only if they have a clear bent — strategy by default; alternatives: growth, UX, business model, competition, roadmap |
| **Theme** | Only if they explicitly mention dark mode — light template by default |

**Default rule**: If the user clearly names a product and asks for "分析" or "analysis", proceed with the full workflow. Ask one short question only when the product identity, scope, or expected deliverable is genuinely ambiguous — don't stall with form-filling.

### Quality Boundaries: What NOT to Do

- Do not write a product introduction or marketing overview. The report must reveal a structural tension.
- Do not list features as if features explain the product. Features are evidence, not the analysis.
- Do not treat every launch, funding round, redesign, or metric milestone as a historical turning point.
- Do not use generic Core Anchors that could apply to any product in the category.
- Do not make the competitive chart a subjective scorecard with arbitrary dimensions.
- Do not end with vague advice like "be more focused", "improve experience", or "use AI better" unless it follows directly from the Core Anchor.
- Do not overfill the HTML with decorative sections. Keep the report focused on the 5-section structure.
- Do not let insights restate the obvious. If an insight could appear in a competitor's analysis unchanged, it's not sharp enough.
- Do not pick turning points by recency. A funding round is not automatically a turning point — the true structural choice may be older and quieter.

### Output Risk Profile

This skill produces a client-facing HTML report. Guard against these common failure modes:

| Risk | Guard |
|---|---|
| **Core Anchor too generic** — fits any product in the category | Test: would this sentence embarrass you if the product's founder read it? If not, rewrite. |
| **Turning points by recency** — latest launches chosen over structural choices | For each: "Did this choice permanently close an alternative future?" If no, replace it. |
| **Chart axes from convenience, not analysis** — dimensions not tied to Phase 1 | Every axis must trace to the Core Need or Ideal Form. No free variables. |
| **Insights restate the obvious** — "needs better UX" | Each insight should surprise a casual observer. If it fits a competitor unchanged, it's not sharp. |
| **Stats are decorative** — don't support the Core Anchor narrative | Each stat must illuminate a tension in the analysis. Non-obvious stats beat vanity metrics. |
| **Chart.js CDN failure** — network blocks the CDN | Templates include a CDN fallback (see Phase 3). |

> Full reference: [references/output-risk-profile.md](references/output-risk-profile.md)

### Phase 1: First Principles Deconstruction (3 Steps)

The goal: discover the **Core Anchor** — one sentence describing what this product *should* be at its most fundamental level.

#### Step 1: Core Need

Ask: What fundamental human desire does this product address? Strip away ALL implementation details.

- State it in one sentence a prehistoric human would also understand
- **Bad**: "People need a way to share photos" (describes a solution)
- **Good**: "People need to feel connected when apart" (describes the desire)

#### Step 2: Ideal Form

Given the core need + today's technological and social constraints, what is the most natural form this product should take?

Don't list features. Describe the *experience*: what does the user feel, what friction disappears, what capability emerges? 
Include what the product should NOT do — negative space is as important as positive.

#### Step 3: The Gap (This IS the Core Anchor)

Compare the ideal form to reality. The single most important tension between "should be" and "is" — that's your Core Anchor.

State it as: **"[Product] 的本质矛盾是 ___"** or **"[Product] is ___ pretending to be ___"**

This sentence drives the entire report. If you can't state it crisply, your analysis isn't deep enough.

### Phase 2: Historical Evolution (3–6 Turning Points)

Don't write a comprehensive history. Identify **3–6 key turning points** — moments where the product made an irreversible choice that shaped everything after.

**Count heuristics:**
- **3** → A focused product (1–2 major features, <5 year history). Lean toward 3.
- **4** → Moderate complexity (clear category shifts, 5–10 years).
- **5** → Complex product (multiple platform pivots, 10+ years, regulatory drama).
- **6** → Landscape-defining product (shaped the category itself, 15+ years). Use only if each point carries unique causal weight.

**Selection test**: For each candidate, ask: "Did this choice *permanently close* an alternative future?" If no, it's an event, not a turning point. Prefer older, structural choices over recent, visible ones.

For each turning point:

| Element | Question |
|---|---|
| **Context** | What constraint or opportunity appeared? |
| **Choice** | What did they decide to do? |
| **Trade-off** | What did they gain, and what did they permanently give up? |
| **Connection to Gap** | How does this choice explain the current gap from the ideal form? |

#### Research Method

Use web search. Prefer primary sources (founder interviews, launch announcements, earnings call transcripts) over summaries or second-hand analysis.

**When sources conflict**, note the disagreement in the report and state which interpretation you're following and why. Do not fabricate a consensus.

**When search results are thin** (obscure product, young product, or closed platform):
- If you can identify 2+ turning points from available sources, proceed and note which are inferred vs documented.
- If you can identify <2 turning points, switch to "structural analysis only" mode: skip Phase 2, explain why in the report, and use the space to deepen Phase 1 and Phase 3.

The goal is not completeness but **causal clarity** — understanding *why* each turning point happened. A 3-point story with clear causality beats a 6-point timeline with filler.

### Phase 3: HTML Report Generation

Read the chosen template first, then populate it. Two templates are available:

- `assets/report-template-light.html` — **Warm parchment** (default). Serif typography, cream background, ink-dark text. Use unless the user explicitly requests a dark theme.
- `assets/report-template-dark.html` — **Dark e-ink**. Deep charcoal background (#0d0d0b), warm light text. Use when user says "深色", "暗色", "dark", "夜间", or if the product's brand identity is dark.

**Selection rule**: If the user's input does not specify a theme, always use the **light** template. Both templates share the same placeholder interface.

The aesthetic is "电子杂志 × 电子墨水":

#### Report Structure (5 sections, not 8)

1. **Hero** — Product name + Core Anchor sentence (the one-line insight) + 3 key stats
2. **Executive Summary** — 2 paragraphs: what the product is and what the Core Anchor reveals
3. **First Principles** — Visual flow: Core Need → Ideal Form → Gap. Clean, minimal.
4. **N Turning Points** — Each as a story card: context → choice → trade-off. With a timeline visualization. Dynamic count (3–6) based on Phase 2.
5. **Implications** — 3 sharp insights that follow from the Core Anchor. Each must be **actionable and non-obvious**. Read each insight with the product name blanked out: if it could apply equally to a competitor, it's not specific enough. Each insight should make someone familiar with the product say "I hadn't thought of it that way."

#### Design Philosophy: 电子杂志 × 电子墨水

The report looks like a high-end digital magazine printed on e-ink:
- **Typography**: Serif headings (Noto Serif SC / Georgia), clean sans body (Inter / system)
- **Color**: Warm parchment base (#faf8f5), ink-dark text (#1a1a1a), single accent color derived from the product's brand
- **Layout**: Magazine-style generous margins, asymmetric grids, pull-quotes for key insights
- **Charts**: Muted, data-ink-ratio-maximized. No chartjunk. Warm palette.
- **Feel**: Calm, authoritative, like reading a thoughtful long-form article

#### Chart Specifications

Only 2 charts (not 4):

- **Timeline**: Horizontal layout showing the N turning points (3–6) on a time axis. Rendered as pure HTML/CSS — no Chart.js dependency. Each point positioned by year, annotated with label, impact shown by visual weight.
- **Positioning Map**: A single radar chart (max 5 axes) showing the product vs 2-3 key competitors. Uses Chart.js. Axes derived from the first principles analysis.

#### Template Placeholders

**Text:**
| Placeholder | Content |
|---|---|
| `{{PRODUCT_NAME}}` | Product name |
| `{{CORE_ANCHOR}}` | The one-sentence core insight — the anchor of the entire report |
| `{{PRODUCT_ACCENT_COLOR}}` | Hex color from the product's brand identity |
| `{{FP_CORE_NEED}}` | 1 sentence: the fundamental human need |
| `{{FP_IDEAL_FORM}}` | 2-3 sentences: what the product should be |
| `{{FP_GAP}}` | 1-2 sentences: the core tension |
| `{{EXECUTIVE_SUMMARY_P1}}` | Executive summary, paragraph 1 |
| `{{EXECUTIVE_SUMMARY_P2}}` | Executive summary, paragraph 2 |
| `{{HISTORY_SUBTITLE}}` | Section title, e.g. "三 个不可逆的选择" / "四个关键转折" / "五个决定性时刻" — match the actual turning point count |
| `{{TURNING_POINTS_HTML}}` | Full HTML of all turning point cards (see card markup below) |
| `{{STAT_1_VALUE}}` / `{{STAT_1_LABEL}}` | Hero stat 1 |
| `{{STAT_2_VALUE}}` / `{{STAT_2_LABEL}}` | Hero stat 2 |
| `{{STAT_3_VALUE}}` / `{{STAT_3_LABEL}}` | Hero stat 3 |
| `{{INSIGHT_1_TITLE}}` / `{{INSIGHT_1_BODY}}` | Insight 1 |
| `{{INSIGHT_2_TITLE}}` / `{{INSIGHT_2_BODY}}` | Insight 2 |
| `{{INSIGHT_3_TITLE}}` / `{{INSIGHT_3_BODY}}` | Insight 3 |

**Chart data:**
| Placeholder | Format |
|---|---|
| `{{TIMELINE_DATA}}` | Array of `{ year: 2011, label: "Event", description: "...", impact: "high"\|"medium" }` — 3–6 entries |
| `{{POSITIONING_CHART_DATA}}` | `{ labels: ["维度1",...], datasets: [{ label: "Product", data: [...] }, ...] }` |

> **CDN resilience**: The positioning chart depends on Chart.js. If the primary CDN (jsdelivr) fails, a secondary CDN (unpkg) is tried. If both fail, the template renders a plain-text data summary instead. The timeline visualization is pure HTML/CSS/JS and works without Chart.js.

#### Turning Point Card Markup

Each turning point card follows this structure. Generate one per turning point and concatenate into `{{TURNING_POINTS_HTML}}`:

```html
<div class="tp-card">
    <div class="tp-year">{year}</div>
    <div class="tp-content">
        <h3>{title}</h3>
        <div class="tp-label">背景</div>
        <p>{context}</p>
        <div class="tp-label">选择</div>
        <p>{choice}</p>
        <div class="tp-label">代价</div>
        <p>{tradeoff}</p>
    </div>
</div>
```

## Output

Single HTML file saved to the working directory:

```
{product_name}_analysis.html
```

The file is self-contained (inline CSS/JS, Chart.js from CDN). Opens in any modern browser.

## Example

**Input**: "分析微信"

**Core Anchor**: "微信是一个以关系链为操作系统的封闭生态，它的本质矛盾是：用'连接'的名义构建了'围墙'"

**3 Turning Points** (simple product):
1. 2012 朋友圈 — 从工具到社交平台（获得用户粘性，失去纯粹性）
2. 2014 微信红包 — 从社交到金融基础设施（获得商业闭环，失去轻量感）
3. 2017 小程序 — 从应用到操作系统（获得生态锁定，失去开放性）

*For a more complex product you might identify 5–6 turning points instead.*

**Insights**:
1. 每次转折都在核心需求之上叠加了商业层，拉大了与"纯粹连接"的距离
2. 封闭生态是微信最大的护城河，也是最大的脆弱点
3. 下一个颠覆者不会"做更好的微信"，而是重新定义"连接"

## Bundled Resources

- `agents/interface.yaml` — Skill interface definition with triggers, inputs, outputs, and resource budgets
- `assets/report-template-light.html` — Light theme HTML template (warm parchment, default)
- `assets/report-template-dark.html` — Dark theme HTML template (charcoal e-ink)
- `references/first-principles.md` — Condensed methodology for the 3-step first principles approach
- `references/output-risk-profile.md` — Known failure modes and guards for report generation
