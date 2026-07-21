# Output Template Reference

This document defines the exact output format for cheat sheets. Used by `SKILL.md` as a detailed reference rather than inline prose.

## Opening Header

```markdown
# 📋 [Topic] — One-Page Cheat Sheet

*Review in 5 minutes. Last updated: [date].*
```

## Section-by-Section Template

### 1. What It Is (In One Sentence)

```
[A single sentence defining the topic in plain language. Assume zero prior knowledge. No jargon without explanation.]
```

### 2. Core Concepts / Rules / Formulas

```
- **[Bold term]**: One-sentence explanation. Include the most critical facts only.
- Keep to 4-7 items maximum. If you need more, the topic is too broad.
- For formulas: use inline code or LaTeX-style notation, e.g. `A = πr²`
- For code: use short code blocks showing the most common pattern
```

### 3. Visual Reference

Include at least ONE visual element. Pick the best format:

**Option A — Table:**
```
| Concept | What It Means | Why It Matters |
|---|---|---|
| ... | ... | ... |
```

**Option B — Mermaid Diagram:**
```mermaid
[flowchart, mindmap, or timeline — whichever clarifies the topic best]
```

**Option C — Mental Model / Mnemonic:**
```
> **[Acronym or catchphrase]**: Break down what each letter/piece stands for.
```

**Option D — Decision Tree (text-based):**
```
Question?
├── If Yes → Do X
└── If No → Do Y
    ├── Edge case A → Do Z
    └── Edge case B → Do W
```

### 4. Real-World Examples (3-5)

```
**Example 1: [Short name]**
- **Scenario**: [1 sentence context]
- **How it applies**: [1-2 sentences showing the concept in action]

**Example 2: [Short name]**
- **Scenario**: ...
- **How it applies**: ...
```

Mix common and edge-case examples.

### 5. Common Mistakes & Confusions

```
| Mistake / Confusion | Why It Happens | The Fix |
|---|---|---|
| ... | ... | ... |
| ... | ... | ... |
```

3-4 entries. Focus on what real beginners actually trip over, not theoretical edge cases.

### 6. Before You Use This — Checklist

```
- [ ] [Critical prerequisite check 1]
- [ ] [Critical prerequisite check 2]
- [ ] [Common gotcha to watch for]
- [ ] [Self-check: am I ready to apply this?]
```

4-6 items. "Don't forget" items that prevent the most common failures.

### 7. Rapid-Fire Questions (Test Yourself)

```
1. **[Question 1]?**
2. **[Question 2]?**
3. **[Question 3]?**
4. **[Question 4]?**
5. **[Question 5]?**
```

Mix of "define X", "what's the difference between X and Y", and "when would you use X".

### 8. One More Thing

```
[A single, memorable closing insight. One sentence only.]
```

Could be: a pro tip, a mental shift, a warning, or "if you remember only one thing, remember this".

## Closing

```markdown
---

*This cheat sheet is a quick-reference tool — not a replacement for practice. Use it to refresh, not to learn from scratch.*
```

## Complete Example (SQL JOIN)

```markdown
# 📋 SQL JOIN — One-Page Cheat Sheet

*Review in 5 minutes.*

## 1. What It Is (In One Sentence)

JOIN is how you combine rows from two or more tables based on a related column between them — like looking up a customer's name from their order without storing the name in every order row.

## 2. Core Concepts

- **INNER JOIN**: Returns only rows where both tables have a match.
- **LEFT JOIN**: Returns all rows from the left table, plus matching rows from the right.
- **RIGHT JOIN**: Same as LEFT but the other way. Rarely used.
- **FULL OUTER JOIN**: Returns everything from both tables, filling NULLs where no match exists.
- **CROSS JOIN**: Every row from table A paired with every row from table B.

## 3. Visual Reference

| JOIN Type | Left Table Rows | Right Table Rows | Use Case |
|---|---|---|---|
| INNER | Only matched | Only matched | "Show me orders with customer names" |
| LEFT | All | Only matched | "Show me all customers and their orders" |
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
- **How it applies**: `SELECT * FROM customers LEFT JOIN orders ON customers.id = orders.customer_id`

**Example 2: Employee-manager self-join**
- **Scenario**: One `employees` table with a `manager_id` column pointing to the same table.
- **How it applies**: `SELECT e.name, m.name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id`

## 5. Common Mistakes & Confusions

| Mistake | Why It Happens | The Fix |
|---|---|---|
| Forgetting ON clause | Thinking JOIN auto-matches foreign keys | Always specify ON explicitly |
| NULLs in LEFT JOIN surprise | Expecting every left row has a match | Remember: unmatched right = NULL |

## 6. Before You Use This — Checklist

- [ ] Do you know which columns link your tables?
- [ ] Have you checked for NULLs in join columns?
- [ ] Do you know INNER vs LEFT behavior?

## 7. Rapid-Fire Questions

1. What's the difference between INNER and LEFT JOIN?
2. When would you use a self-join?
3. What happens to unmatched rows in FULL OUTER JOIN?

## 8. One More Thing

If you only learn one: master LEFT JOIN — it covers 80% of real-world join needs, and once you understand it, the rest are just variations.

---
```

## Formatting Rules

- **Bold** for terms in Section 2
- Code blocks for SQL/code snippets
- Tables with alignment: `|:---|:---|:---|`
- Mermaid only when it genuinely clarifies — don't force it
- No inline HTML unless absolutely necessary for visual structure
