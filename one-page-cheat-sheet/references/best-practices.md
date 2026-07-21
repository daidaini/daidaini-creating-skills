# Cheat Sheet Best Practices

Domain adaptation guidance and quality heuristics for cheat sheet generation.

## Domain Adaptation — Full Reference

| Domain | Emphasis | Avoid | Recommended Visual |
|---|---|---|---|
| **Technical** (code, tools, CLI) | Syntax, common patterns, CLI flags, code snippets | Long paragraphs about architecture history | Code blocks, comparison tables, command trees |
| **Knowledge** (concepts, theories, history) | Definitions, key figures, timelines, causal chains | Over-explaining tangents | Timelines, mind maps, comparison tables |
| **Language** (grammar, vocabulary, phrases) | Rules, exceptions, usage examples, false friends | Grammar textbook depth | Tables, pattern highlight, exception lists |
| **Quantitative** (formulas, stats, math) | Formulas, units, when-to-use-which | Derivation proofs | Formula cards, decision trees |
| **Procedural** (steps, workflows, processes) | Step order, decision points, inputs/outputs | Rationale for every step | Flowcharts, checklists, decision trees |

## One-Page Constraint Heuristics

Estimate if your draft fits one page:

- **~40-50 lines** of dense markdown = ~1 printed page
- If you have more than 7 items in Section 2: cut to 4-7
- If you have more than 5 examples in Section 4: cut to 3-5
- If any section has more than 3 consecutive sentences: convert to bullets
- If a mermaid diagram exceeds 15 nodes: simplify or split

## Language Matching Rules

| User Input Language | Output Language | Format |
|---|---|---|
| Chinese (any: 中文, 帮我, 速查表) | Chinese (中文) | Chinese terms + Chinese examples |
| English / mixed | English | English terms + English examples |
| Other (Japanese, Korean, etc.) | Match user's language | But keep technical terms in original |

## Example Quality Checklist

A good example must have:
- [ ] A real-world scenario (not abstract)
- [ ] Concrete context (who, what, why)
- [ ] Shows the concept in action
- [ ] Can be understood without prior topic knowledge

**Good**: "Calculating tax on a $50 purchase with an 8% sales tax rate"
**Bad**: "2 + 2 = 4"

## Mistake Selection Heuristics

Prioritize mistakes that:
1. Real beginners make in the first week of learning
2. Cause real bugs or confusion in practice
3. Are subtle (look correct but aren't)

Avoid:
- Edge cases that require deep expertise to encounter
- Mistakes so rare even experts rarely see them
- Trivial typos that don't reflect conceptual misunderstanding

## Section 8 (One More Thing) Candidates

Choose one type, never mix:
- **Pro tip**: "The one trick that separates beginners from intermediates"
- **Mental shift**: "The most important mindset change for this topic"
- **Warning**: "The single thing that causes the most subtle bugs"
- **"If you remember nothing else"**: The single most important concept
