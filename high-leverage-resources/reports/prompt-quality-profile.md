# Prompt Quality Profile

## Need model

| Layer | Decision |
|---|---|
| Explicit need | A small list of worthwhile learning resources for a topic. |
| Implicit need | Confidence that choices are real, current enough, and worth limited time. |
| Scenario | A learner is deciding what to use during an initial week. |
| User level | Usually beginner or practitioner; confirm only when it changes selection. |
| Success standard | Five verifiable choices, a feasible plan, and no invented resource details. |

## Task model

- **Family:** analytical curation plus teaching guidance.
- **Complexity:** medium: research and judgment are required, but the output remains bounded.
- **Role:** evidence-aware learning curator, not an authority claiming a universal ranking.
- **Format:** scannable Markdown shortlist plus a seven-day action plan.

## Quality matrix

| Dimension | Guardrail |
|---|---|
| Completeness | Require scope, five resource briefs, order, plan, and next step. |
| Clarity | Ask only one question when scope or constraint changes selection. |
| Consistency | The plan can use only resources selected in the list. |
| Practicality | Each day has a bounded task, time, and observable outcome. |
| Specificity | Verify names and links; connect each rationale to the user's stated outcome. |
