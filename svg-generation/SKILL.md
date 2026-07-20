---
name: svg-generation
description: >
  Generate SVG diagrams from structured JSON or natural language.
  Three routes: Route 1 — direct LLM SVG for simple icons/UI;
  Route 2 — structured JSON + layout engine (Glyphic) for flowcharts/architecture/ERD/UML/sequence etc. (recommended);
  Route 3 — visual pipeline (SVG Genie/Recraft) for complex illustrations/logos.
  Route by diagram structure: structured chart → Route 2; simple icon ≤30 elements → Route 1; complex visual/logo → Route 3.
  Exclude raster-only image generation, photorealistic SVG demands, pixel editing, non-vector output.
metadata:
  author: agent_explore
  archetype: production
  created: 2026-07-17
---

# SVG Generation Skill

Core principle: **separate description from layout**. LLMs describe what a diagram *means*; a deterministic engine handles *where things go*. Research (VGBench, Glyphic, SVG Genie) and hands-on validation confirm this avoids LLMs' fundamental spatial-reasoning weakness.

## Route Selection

| Diagram type | Route |
|---|---|
| Structured charts: flowchart, architecture, ERD, UML, sequence, state machine, mindmap, Gantt, C4, Kanban, timeline, journey, Sankey, git, treemap | **Route 2** → JSON + Glyphic engine |
| Simple icons/UI elements: ≤30 elements, geometric, standard viewBox | **Route 1** → Direct LLM SVG with SCSS prompt |
| Complex illustrations/logos: organic shapes, shading, visual composition | **Route 3** → SVG Genie / Recraft |

**Tiebreaker**: When in doubt, pick Route 2. It scales, produces deterministic output, and avoids blind-pixel-placement failure.

## Route 2 — Core Workflow (Glyphic)

### Installation
```bash
npm install @glyphicjs/core @glyphicjs/schema
```

Or MCP (Claude Code/Cursor/Claude Desktop):
```json
{"mcpServers":{"glyphic":{"command":"npx","args":["-y","@glyphicjs/mcp-server"]}}}
```

### Core API
```javascript
import { processDiagram } from '@glyphicjs/core';

const result = await processDiagram({
  type: "flowchart",  // 18 types supported
  direction: "TB",
  theme: { background: "#0f172a", surface: "#1e293b", primary: "#818cf8", textColor: "#f1f5f9" },
  style: "compact",   // compact / clean / minimal / sketch
  nodes: [ { id: "a", label: "Node A", shape: "rounded", metadata: { color: "#22c55e" } } ],
  edges: [ { source: "a", target: "b", label: "connects", style: "solid" } ]
});
// result.svg, result.png, result.metadata, result.reactFlow
```

### Validation Loop (Critical)
```javascript
import { DiagramInput } from '@glyphicjs/schema';
const parsed = DiagramInput.safeParse(llmOutput);
if (!parsed.success) {
  // Send parsed.error.issues back to LLM for self-correction
  // e.g. "edges[2].to references unknown node 'foo'"
  return fixPrompt(parsed.error.issues);
}
```
Key advantage over Mermaid-style DSLs: errors are precise and fixable, not parse-or-crash.

### Supported Types
All 18 types documented in [references/glyphic-workflow.md](references/glyphic-workflow.md): flowchart/architecture, sequence, state, erd, class, c4, mindmap, gantt, timeline, journey, kanban, pie, quadrant, sankey, git, treemap, canvas (freeform).

### Edge & Node Styling
- **Edge styles**: `solid` / `dashed` / `dotted`
- **Arrows**: `forward` / `back` / `both` / `none` / `open` / `inheritance` / `composition` / `aggregation` / `dependency` / crow variants
- **Node shapes** (flowchart/architecture): rectangle, rounded, cylinder, cloud, diamond, hexagon, person, database, service, table, class, state_start, state_end
- **Icons**: any FontAwesome free icon (`fas-*`, `fab-*`, `far-*`)

### Theme & Style
```javascript
theme: "dark"  // preset: light / dark / pastel / mono, or object with fontFamily/background/surface/primary/textColor/nodeStroke/edgeStroke
style: "compact"  // preset: compact / clean / minimal / sketch — controls geometry & stroke
aspectRatio: "16:9"  // 16:9 / 9:16 / 1:1 / 4:3 / 3:4 / auto / none
```

## Route 1 — SCSS Prompt Framework

| Element | What to specify |
|---|---|
| **S**ubject | Exact object, pose, composition |
| **C**ontext | Usage scenario (vinyl decal, coloring page, logo) |
| **S**tyle | Named art style (minimalist line art, kawaii, geometric low-poly) |
| **S**pecifications | viewBox, colors, fills, stroke, orientation |

Post-processing: always run `npx svgo input.svg -o output.svg` (reduces 30-50%).

## Output Contract

### Input
- Route 2: JSON conforming to `DiagramInput` schema
- Route 1: Natural language structured via SCSS
- Route 3: Natural language (delegated)

### Output
- `result.svg` — SVG string (accessible: role="img" + `<title>`)
- `result.png` — PNG Buffer (high-res, 2x by default, Route 2 only)
- `result.reactFlow` — interactive JSON (graph types, Route 2 only)

### Acceptance Criteria
- SVG must be valid XML
- All nodes/labels visible without overlap
- Edges must not cut through unrelated nodes
- Title must be set for accessibility

## Constraints
- Max 1000 nodes (Glyphic hard limit). Larger: split into sub-diagrams.
- Route 2 requires Node.js 18+ with `@glyphicjs/core`
- No Chromium/Puppeteer needed — only Node + resvg (Rust)
- fontFamily must be a single identifier (no commas/fallback chains)
- Icons limited to FontAwesome Free set by default; custom via `customIcons`

## Known Risks & Mitigations
See [reports/output-risk-profile.md](reports/output-risk-profile.md) for full matrix. Top 3:
1. **Spatial overlap** → prefer Route 2 (ELK auto-routing)
2. **Zod rejection** → mandatory validation loop
3. **Token overflow** → Route 2 JSON is 5-10x more compact than raw SVG
