# Output Risk Profile — SVG Generation

Generated 2026-07-17 based on hands-on validation with Glyphic and research.

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Spatial overlap** — labels spill past node borders, edges cut through shapes | High (Route 1) / Low (Route 2) | High — renders diagram unusable | Route 2 uses ELK engine for auto-routing; Route 1 → fallback to Route 2 |
| **Zod validation rejection** — JSON input doesn't match schema | Medium | Medium — blocks rendering | Mandatory validation loop: send `ZodError.issues` back to LLM for self-correction |
| **Empty/truncated output** — LLM hits token limit with large SVG code | Medium (Route 1) / Low (Route 2) | High — output is garbage | Route 2 JSON is 5-10x more compact than equivalent raw SVG; monitor output length |
| **Path bloat** — excessive decimal precision, redundant commands | High (Route 1) / None (Route 2) | Medium — file size, render performance | Always run SVGO optimization; Route 2 engine produces clean paths |
| **Theme mismatch** — fontFamily with comma/quote rejected | Medium | Low — fixable on next try | Font names must be single identifiers (no fallback chains). Documented in SKILL.md |
| **Missing accessibility** — no `role="img"`, no `<title>` | High (Route 1) | Low-Medium — screen reader fails | Add to post-processing checklist; Route 2 auto-adds both |
| **Wrong route selected** — using Route 1 for complex structured diagram | Medium | High — poor quality output | Route selection table in SKILL.md; if Route 1 SVG looks bad, switch to Route 2 |
| **Icon reference error** — FontAwesome icon name doesn't exist | Low | Low — icon silently omitted | Verify icon names against FontAwesome Free set; use standard names only |
| **Glyphic not installed** — calling Route 2 without `@glyphicjs/core` | Low (first use) | High — crash | Check dependency before execution; install if missing |
| **Too many nodes (> 1000)** — exceeds engine hard limit | Low | Medium — render rejected or partial | Split into sub-diagrams; Glyphic hard-caps at 1000 nodes |

---

## Self-Repair Checklist

Before delivering SVG output, verify:

- [ ] SVG is valid XML (parse without error)
- [ ] All nodes/labels are fully visible (not clipped, not overlapping other nodes)
- [ ] Edges do not cut through unrelated nodes (Route 2 is reliable; Route 1 check visually)
- [ ] `<svg>` has `xmlns`, `viewBox`, `role="img"`, and `<title>`
- [ ] No absolute file paths remain in SVG content
- [ ] SVGO optimization applied where possible
- [ ] For Route 2: JSON passed `DiagramInput.safeParse()` without issues
- [ ] Diagram title is specific to the user's domain (not generic "Diagram")

---

## Escalation

If output quality is unacceptable after two generations:
1. Check if the right route was chosen (Route 1 → Route 2, or Route 2 → Route 3)
2. For Route 2: render JSON in Glyphic playground (glyphic.web.app/generate) to isolate layout vs. content issue
3. For Route 1: reduce diagram complexity, build incrementally (skeleton first, detail later)
