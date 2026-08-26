---
name: build-learning-ladder
description: Builds a progressive learning ladder (学习阶梯) for any topic — from complete beginner to confident practitioner. Each level includes mastery standards, concepts, a hands-on exercise, common mistakes, and a self-check. Output is structured markdown, optionally converted to a designed single-page HTML. Use when the user wants to learn something step-by-step, asks "how to learn X", "learning roadmap for X", "帮我拆解学X的路线", "一步步学X", "怎么学X", "从零学X", "学习路线", "学习阶梯", or asks for structured curriculum design, learning stages, difficulty tiers, or a "skill tree".
---

# Build Learning Ladder

Transform any learning topic into a **progressive ladder** — from zero to confident practitioner. Output is exercise-driven and focused on real progress, not theory overload.

## When to Use

- User wants to learn something step-by-step
- "how should I learn X?" / "learning roadmap for X" / "从零学X"
- User asks for difficulty tiers, learning stages, or curriculum design
- "一步步学X" / "学习路线" / "学习阶梯" / "skill tree"

**Do NOT use for:** Quick fact checks, single-session tutorials, formal academic course design.

## Workflow

1. **Clarify topic.** If too broad (e.g. "math", "programming"), ask to narrow. If user insists, build around the most practical sub-path and note the scope assumption.
2. **Detect domain.** Determine which domain the topic belongs to — this shapes level naming, exercise style, and mistake patterns. See [Domain Patterns](references/domain-patterns.md).
3. **Build the ladder.** Generate the 5-level structure with all 8 sections per level. See [Level Structure](references/level-structure.md).
4. **Quality check.** Verify against the quality checklist before delivering. See [Quality Checklist](references/quality-checklist.md).
5. **Save output.** Write to `{topic-slug}_learning_ladder.md` in the working directory. Tell the user the file path.
6. **Optional: Convert to HTML.** If the user wants a designed flip-through page, use the `beautiful-html` skill to convert the markdown ladder into a single self-contained HTML file. See [HTML Output Guide](references/html-output-guide.md).

## The 5-Level Structure (Summary)

| Level | Default Name | Intent |
|-------|-------------|--------|
| 1 | Complete Beginner | First exposure, zero prior knowledge |
| 2 | Basic Understanding | Grasp core concepts, can follow along |
| 3 | Practical User | Can produce real output independently |
| 4 | Problem Solver | Can debug, adapt, handle non-trivial tasks |
| 5 | Confident Practitioner | Can self-direct, teach others, handle ambiguity |

Level names adapt by domain. See [Domain Patterns](references/domain-patterns.md) for naming tables.

## Output Format (Summary)

Each level has **exactly 8 sections** in order:

1. What This Level Is About
2. Mastery Standard
3. Core Concepts & Skills
4. Milestone: Prove You're Ready
5. Hands-On Exercise / Mini Project
6. Most Common Mistakes at This Level
7. Self-Check Question Before Moving On
8. What's Next

See [Level Structure](references/level-structure.md) for the full template with section-level detail.

## Output Language

Match the user's language. Warm, coach-like tone — you're a guide, not a lecturer.

## Bundled References

- [Domain Patterns](references/domain-patterns.md) — domain detection and level naming tables
- [Level Structure](references/level-structure.md) — the full 8-section template
- [Quality Checklist](references/quality-checklist.md) — must-do / must-not-do rules
- [HTML Output Guide](references/html-output-guide.md) — converting to designed HTML via `beautiful-html`
