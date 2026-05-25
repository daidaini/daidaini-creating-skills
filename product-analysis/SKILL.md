---
name: product-analysis
description: 产品第一性原理分析 + 历史演化调研 + HTML 报告生成。当你想要了解一个产品「应该」是什么样子、拆解产品的本质、研究产品的演化历程、或制作面向客户的演示报告时，使用这个技能。即使你没有明确要求「产品分析」，只要涉及理解产品本质或制作产品报告，都应该触发。触发词：分析产品、产品报告、拆解产品、产品演化、这个产品应该是什么样的、产品第一性原理、product analysis、产品调研。
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
Simple products need 3; complex products with rich histories can go up to 6. Select the count that tells the most causally complete story without filler.

For each turning point:

| Element | Question |
|---|---|
| **Context** | What constraint or opportunity appeared? |
| **Choice** | What did they decide to do? |
| **Trade-off** | What did they gain, and what did they permanently give up? |
| **Connection to Gap** | How does this choice explain the current gap from the ideal form? |

#### Research Method

Use web search. Prefer primary sources (founder interviews, launch announcements) over summaries. When sources conflict, note it. 
The goal is not completeness but **causal clarity** — understanding *why* each turning point happened.

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
5. **Implications** — 3 sharp insights that follow from the Core Anchor. Each is actionable.

#### Design Philosophy: 电子杂志 × 电子墨水

The report looks like a high-end digital magazine printed on e-ink:
- **Typography**: Serif headings (Noto Serif SC / Georgia), clean sans body (Inter / system)
- **Color**: Warm parchment base (#faf8f5), ink-dark text (#1a1a1a), single accent color derived from the product's brand
- **Layout**: Magazine-style generous margins, asymmetric grids, pull-quotes for key insights
- **Charts**: Muted, data-ink-ratio-maximized. No chartjunk. Warm palette.
- **Feel**: Calm, authoritative, like reading a thoughtful long-form article

#### Chart Specifications

Only 2 charts (not 4):

- **Timeline**: Horizontal layout showing the N turning points (3–6) on a time axis. Each point annotated with the choice made. Use Chart.js styled `bar`.
- **Positioning Map**: A single 2D scatter plot or radar (max 5 axes) showing the product vs 2-3 key competitors. Axes derived from the first principles analysis.

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
| `{{TIMELINE_CHART_DATA}}` | Array of `{ year: 2011, label: "Event", description: "...", impact: "high"\|"medium" }` — 3–6 entries |
| `{{POSITIONING_CHART_DATA}}` | `{ labels: ["维度1",...], datasets: [{ label: "Product", data: [...] }, ...] }` |

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

- `assets/report-template-light.html` — Light theme HTML template (warm parchment, default)
- `assets/report-template-dark.html` — Dark theme HTML template (charcoal e-ink)
- `references/first-principles.md` — Condensed methodology for the 3-step first principles approach
