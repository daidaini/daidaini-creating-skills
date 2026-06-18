---
name: one-page-cheat-sheet
description: Generates a one-page cheat sheet (一页速查表) for any topic — a scannable, visual, beginner-friendly summary that can be reviewed in 5 minutes. Use when the user asks for "cheat sheet", "速查表", "quick reference", "复习资料", "cram sheet", "备忘录", "知识点总结", "面试准备", "考前速览", "one-pager", "study guide", "记忆卡", or says they need to quickly review a topic before an exam, interview, meeting, or presentation. Also trigger when the user asks for a concise summary of a topic with examples and common mistakes, or says "帮我整理一下重点" / "给我一个浓缩版".
---

# One-Page Cheat Sheet

## Overview

This skill transforms any topic into a **one-page cheat sheet** — a dense, scannable, visually structured summary that a learner can review in 5 minutes. It's designed for exam prep, interview cramming, meeting pre-reads, and last-minute refreshers.

The output is a **浓缩学习地图 (condensed learning map)**, not a long explanation. Every section earns its place. If it doesn't help rapid recall, cut it.

## When to Use

- User asks for a "cheat sheet", "quick reference", "速查表", "复习资料"
- User says "考前速览", "面试准备", "知识点总结", "帮我整理重点"
- User says "give me the condensed version", "cram sheet", "study guide", "one-pager"
- User wants to review a topic quickly before an exam, interview, or meeting

**Do NOT use for:**
- Deep dives or comprehensive tutorials (use `build-learning-ladder` instead)
- Step-by-step learning paths
- Single definitions or quick lookups (those are search queries)
- Persuasive or argumentative writing

## Preflight: Clarify the Topic

Before generating, assess the topic:

- **If the topic is too broad** (e.g., "math", "programming", "history"), narrow it: "Would you like to narrow this down? For example, 'Python list methods' instead of 'all of programming'?"
- **If the topic is clear and scoped** (e.g., "React hooks", "SQL joins", "standard deviation"), proceed directly.
- **If the user gives a topic in Chinese**, output the entire cheat sheet in Chinese (matching their language).

## Domain Adaptation

Adjust emphasis based on topic type:

| Domain | Emphasis | Visual Style |
|---|---|---|
| **Technical** (code, tools, commands) | Syntax, common patterns, CLI flags, code snippets | Code blocks, comparison tables |
| **Knowledge** (concepts, theories, history) | Definitions, key figures, timelines, causal chains | Timelines, mind maps, comparison tables |
| **Language** (grammar, vocabulary, phrases) | Rules, exceptions, usage examples, false friends | Tables, color-coded patterns |
| **Quantitative** (formulas, stats, math) | Formulas, units, when-to-use which formula | Formula cards, decision trees |
| **Procedural** (steps, workflows, processes) | Step order, decision points, inputs/outputs | Flowcharts, checklists |

## Output Format

### Opening Header

```markdown
# 📋 [Topic] — One-Page Cheat Sheet

*Review in 5 minutes. Last updated: [date].*
```

### Then the 8 Sections — IN THIS ORDER

Each section is mandatory. Do not reorder, rename, or merge.

```markdown
## 1. What It Is (In One Sentence)

[A single sentence that defines the topic in plain language. Assume zero prior knowledge. No jargon without explanation.]

## 2. Core Concepts / Rules / Formulas

- **[Bold term]**: One-sentence explanation. Include the most critical facts only.
- Keep to 4-7 items maximum. If you need more, the topic is too broad.
- For formulas: use inline code or LaTeX-style notation, e.g. `A = πr²`
- For code: use short code blocks showing the most common pattern

## 3. Visual Reference

[Include at least ONE visual element. Pick the format that best fits the topic:]

**Option A — Table:**
| Concept | What It Means | Why It Matters |
|---|---|---|
| ... | ... | ... |

**Option B — Mermaid Diagram:**
```mermaid
[flowchart, mindmap, or timeline — whichever clarifies the topic best]
```

**Option C — Mental Model / Mnemonic:**
> **[Acronym or catchphrase]**: Break down what each letter/piece stands for.

**Option D — Decision Tree (text-based):**
```
Question?
├── If Yes → Do X
└── If No → Do Y
    ├── Edge case A → Do Z
    └── Edge case B → Do W
```

## 4. Real-World Examples (3-5)

**Example 1: [Short name]**
- **Scenario**: [1 sentence context]
- **How it applies**: [1-2 sentences showing the concept in action]

**Example 2: [Short name]**
- **Scenario**: ...
- **How it applies**: ...

[Continue for 3-5 examples. Mix common and edge-case examples.]

## 5. Common Mistakes & Confusions

| Mistake / Confusion | Why It Happens | The Fix |
|---|---|---|
| ... | ... | ... |
| ... | ... | ... |

[3-4 entries. Focus on what real beginners actually trip over, not theoretical edge cases.]

## 6. Before You Use This — Checklist

- [ ] [Critical prerequisite check 1]
- [ ] [Critical prerequisite check 2]
- [ ] [Common gotcha to watch for]
- [ ] [Self-check: am I ready to apply this?]

[4-6 checklist items. These are the "don't forget" items that prevent the most common failures.]

## 7. Rapid-Fire Questions (Test Yourself)

1. **[Question 1]?**
2. **[Question 2]?**
3. **[Question 3]?**
4. **[Question 4]?**
5. **[Question 5]?**

[Questions should test recall of the most important concepts. Cover different sections of the cheat sheet. Include a mix of "define X", "what's the difference between X and Y", and "when would you use X".]

## 8. One More Thing

[A single, memorable closing insight. Could be: a pro tip, a mental shift, a warning, or a "if you remember only one thing, remember this". One sentence only.]
```

### Closing

```markdown
---

*This cheat sheet is a quick-reference tool — not a replacement for practice. Use it to refresh, not to learn from scratch.*
```

## Quality Guidelines

### Must Do

- **Every cheat sheet must fit on one printed page** (or one screen without scrolling much). If it's too long, cut ruthlessly.
- **Must include at least one visual element** (table, diagram, mnemonic, or decision tree). A wall of text is not a cheat sheet.
- **Examples must be concrete and realistic.** "2 + 2 = 4" is not a real-world example. "Calculating tax on a $50 purchase" is.
- **Mistakes must be real beginner mistakes.** Think about what actual people get wrong, not theoretical edge cases.
- **Bullet points, not paragraphs.** No section should have more than 3 sentences of continuous text.
- **Match the user's language.** If they ask in Chinese, output entirely in Chinese. If English, output in English.

### Must NOT Do

- **No long explanations.** If a section takes more than 5 bullet points, it's too detailed — cut or split.
- **No unnecessary theory.** Don't explain the history of a concept unless it directly helps recall.
- **No jargon without explanation.** Every technical term gets a parenthetical definition on first use.
- **No empty filler.** Every sentence must earn its place. If it doesn't aid quick recall, remove it.
- **Don't skip sections.** All 8 sections are mandatory. If a section truly doesn't apply (rare), note why and provide the closest alternative.

## Save Output

After generating the cheat sheet, save it to a markdown file:

- File name: `{topic-slug}_cheat_sheet.md`
- Location: current working directory
- Content: The full cheat sheet output

Tell the user the file path after saving.

## Example (Abbreviated)

**User**: "给我一个 SQL JOIN 的速查表"

**Output** (showing the opening and first few sections to demonstrate tone and structure):

```markdown
# 📋 SQL JOIN — One-Page Cheat Sheet

*Review in 5 minutes.*

## 1. What It Is (In One Sentence)

JOIN is how you combine rows from two or more tables based on a related column between them — like looking up a customer's name from their order without storing the name in every order row.

## 2. Core Concepts

- **INNER JOIN**: Returns only rows where both tables have a match. If a customer has no orders, they don't appear.
- **LEFT JOIN**: Returns all rows from the left table, plus matching rows from the right. If no match, right-side columns are NULL.
- **RIGHT JOIN**: Same as LEFT but the other way. Rarely used — most people stick to LEFT.
- **FULL OUTER JOIN**: Returns everything from both tables, filling NULLs where no match exists.
- **CROSS JOIN**: Every row from table A paired with every row from table B (cartesian product). Use with caution.

## 3. Visual Reference

| JOIN Type | Left Table Rows | Right Table Rows | Use Case |
|---|---|---|---|
| INNER | Only matched | Only matched | "Show me orders with customer names" |
| LEFT | All | Only matched | "Show me all customers and their orders" |
| RIGHT | Only matched | All | Rare — same as LEFT with swapped tables |
| FULL OUTER | All | All | "Show me everything, even orphans" |

**Mental Model: Venn Diagram**
```
INNER = ⚪∩⚪  (overlap only)
LEFT = ⚪ + overlap (keep left, add right if exists)
FULL = ⚪∪⚪  (everything)
```

## 4. Real-World Examples

**Example 1: E-commerce orders**
- **Scenario**: You have `customers` (id, name) and `orders` (id, customer_id, total).
- **How it applies**: `SELECT * FROM customers LEFT JOIN orders ON customers.id = orders.customer_id` — shows every customer, even those who never ordered.

**Example 2: Employee-manager self-join**
- **Scenario**: One `employees` table with a `manager_id` column pointing to the same table.
- **How it applies**: `SELECT e.name, m.name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id` — shows each employee and their manager's name.
```

## Bundled Resources

This skill is self-contained and requires no external assets or scripts. The entire cheat sheet is generated inline as formatted markdown and saved to a file.

Output file: `{topic-slug}_cheat_sheet.md` in the working directory.
