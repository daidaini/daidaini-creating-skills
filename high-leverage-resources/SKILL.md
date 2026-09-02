---
name: high-leverage-resources
description: Researches and curates exactly five high-leverage existing learning resources for a scoped topic, then creates a realistic 7-day plan using only those resources. Each resource is availability-checked and linked to a primary source. Use for “best resources to learn X”, “高质量学习资源”, “学习资源推荐”, “精选资源”, “best books/courses for X”, or “signal not noise”. Do not use for a step-by-step curriculum or skill ladder, a plan without resource curation, a cheat sheet, or a summary of supplied material.
disable-model-invocation: true
---

# High-Leverage Resources

Curate **five trustworthy resources** for limited learning time.

## Execute

1. **Scope:** identify topic, learner level, intended outcome, time, budget, language, and format. Ask one question only if an unknown constraint would change the choices; otherwise state a material assumption.
2. **Research:** verify every candidate's exact title, creator/publisher, format, access/cost, and primary-source URL. Use independent evidence only when it materially supports quality or currency. Never invent prices, chapters, lesson names, dates, or popularity claims.
3. **Select:** choose exactly five using the rubric in [Curation Standard](references/curation-standard.md). Prefer a strong duplicate format to a weak diversity quota; explain the exception.
4. **Produce:** use that reference's output contract. Explain each item's role for this learner and make the seven-day plan use only the five choices.
5. **Repair:** run the reference's final checklist. Replace unsupported claims with sourced facts, transparent goal-based advice, or `missing evidence`.
6. **Save:** write `{topic-slug}_resources.md` in the current working directory and report the path. If writing fails, return Markdown and disclose that no file was created.

## Non-negotiables

- Include a primary-source link and checked-access note for every resource.
- Match the user's language. Use only verified section names; otherwise describe the task without pretending to know internal structure.
- Keep the plan within the stated time budget (default: 1–2 hours per day) and give each day an observable outcome.
- Do not call an unverified section low-value. State a sourced limitation or goal-based deprioritization instead.

## Package resources

See [Curation Standard](references/curation-standard.md), `agents/interface.yaml`, `evals/`, and `reports/` for guidance, routing, and quality profiles.
