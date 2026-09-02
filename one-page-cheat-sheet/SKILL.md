---
name: one-page-cheat-sheet
description: Generates a one-page cheat sheet (一页速查表) for any topic — a scannable, visual, beginner-friendly summary that can be reviewed in 5 minutes. Use when the user asks for "cheat sheet", "速查表", "quick reference", "复习资料", "cram sheet", "备忘录", "知识点总结", "面试准备", "考前速览", "one-pager", "study guide", "记忆卡", or says they need to quickly review a topic before an exam, interview, meeting, or presentation. Also trigger when the user asks for a concise summary of a topic with examples and common mistakes, or says "帮我整理一下重点" / "给我一个浓缩版" / "整理重点".
disable-model-invocation: true
---

# One-Page Cheat Sheet

## Overview

Transforms any topic into a **one-page cheat sheet** — a dense, scannable, visually structured summary reviewable in 5 minutes. Designed for exam prep, interview cramming, meeting pre-reads, and last-minute refreshers.

Output is a **浓缩学习地图 (condensed learning map)**. Every section earns its place. If it doesn't help rapid recall, cut it.

## When to Use

- User asks for "cheat sheet", "quick reference", "速查表", "复习资料"
- User says "考前速览", "面试准备", "知识点总结", "帮我整理重点"
- User says "give me the condensed version", "cram sheet", "study guide", "one-pager"
- User wants a quick topic review before exam, interview, or meeting

**Do NOT use for:**
- Deep dives or comprehensive tutorials
- Step-by-step learning paths
- Single definitions or quick lookups
- Persuasive or argumentative writing

## Preflight

- **If topic is too broad** (e.g., "math", "programming"): narrow it before generating.
- **If topic is scoped** (e.g., "React hooks", "SQL joins"): proceed directly.
- **If user's topic is in Chinese**: output the entire cheat sheet in Chinese.

## Domain Adaptation

Adjust emphasis by topic type. See [references/best-practices.md](references/best-practices.md) for detailed guidance.

| Domain | Emphasis | Visual Style |
|---|---|---|
| **Technical** | Syntax, patterns, CLI flags, code snippets | Code blocks, comparison tables |
| **Knowledge** | Definitions, key figures, timelines, causal chains | Timelines, mind maps |
| **Language** | Rules, exceptions, usage examples, false friends | Tables, color-coded patterns |
| **Quantitative** | Formulas, units, when-to-use-which | Formula cards, decision trees |
| **Procedural** | Step order, decision points, inputs/outputs | Flowcharts, checklists |

## Output Structure

8 mandatory sections in this order (details in [references/output-template.md](references/output-template.md)):

1. **What It Is (In One Sentence)** — plain-language definition, zero prior knowledge
2. **Core Concepts / Rules / Formulas** — 4-7 items max
3. **Visual Reference** — table, mermaid diagram, mnemonic, or decision tree
4. **Real-World Examples (3-5)** — concrete scenarios with context
5. **Common Mistakes & Confusions** — 3-4 real beginner mistakes
6. **Before You Use This — Checklist** — 4-6 prerequisite checks
7. **Rapid-Fire Questions (Test Yourself)** — 5 recall questions
8. **One More Thing** — one memorable closing sentence

## Quality Rules

### Must Do
- Fit on one printed page (or one screen without much scrolling)
- Include at least one visual element (table, diagram, mnemonic, decision tree)
- Examples must be concrete and realistic
- Mistakes must be real beginner mistakes
- Bullet points, not paragraphs
- Match user's language (Chinese → Chinese, English → English)

### Must NOT Do
- No long explanations (max 5 bullets per section)
- No unnecessary theory
- No jargon without explanation
- No empty filler
- Don't skip sections (all 8 mandatory)

## Save Output

- File: `{topic-slug}_cheat_sheet.md` in working directory
- Content: full cheat sheet output
- Tell the user the file path after saving

## Bundled Resources

Self-contained. Detailed template and examples in `references/output-template.md`. Domain adaptation depth in `references/best-practices.md`.

---

*This cheat sheet is a quick-reference tool — not a replacement for practice. Use it to refresh, not to learn from scratch.*
