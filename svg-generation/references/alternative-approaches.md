# Alternative SVG Generation Approaches

Reference for Route 1 and Route 3. Use when Route 2 (Glyphic + structured JSON) doesn't fit.

---

## Route 1: Direct LLM SVG

**Best for**: Simple icons (< 30 elements), UI elements (dividers, waves, blobs), SVG animations.

**Tools**: Claude (Artifacts), ChatGPT, Gemini.

### Key Technique: SCSS Framework

| Element | Purpose | Example |
|---|---|---|
| **S**ubject | What exactly to draw | "a sitting Siamese cat, minimalist line art" |
| **C**ontext | Usage scenario | "for a vinyl decal on a car window" |
| **S**tyle | Named art style | "geometric low-poly" / "kawaii" |
| **S**pecifications | Tech constraints | "single color black, no fill, thin stroke" |

### Prompt Template

```
Create an SVG: {subject} in {style} style, for {context}.

Technical requirements:
{specifications}

Constraints:
- Single <svg> element with xmlns
- viewBox="0 0 24 24"
- Use only path, circle, rect, line elements
- No embedded styles, use attributes only
```

### Post-Processing (Required)

```
1. Validate: any SVG validator
2. Optimize: npx svgo input.svg -o output.svg
3. Color adjust: batch update if needed
```

### Limitations

- Spatial reasoning fails after ~5-10 elements
- No consistency across multiple generations
- High token cost for detailed SVGs (compared to Route 2 JSON)
- Path data is never optimized

---

## Route 3: Visual Pipeline

**Best for**: Complex illustrations, logos, organic shapes, photorealistic-adjacent vector art.

**Tools**: SVG Genie, Recraft V4.1 Vector.

### When to Use

- User asks for a "logo" or "illustration" (not diagram)
- Visual composition matters more than structural accuracy
- Need to match an existing brand style by reference image
- Organic/natural shapes (animals, plants, people)

### What to Watch For

| Tool | Strength | Caveat |
|---|---|---|
| **SVG Genie** | Clean paths, production-ready | Requires API, not local |
| **Recraft V4.1** | Native SVG (not traced PNG) | Brand-focused, subscription |
| **DALL-E/Stable Diffusion → vectorize** | High visual quality | Result is often PNG in SVG wrapper |

### Integration Pattern

When Route 3 is selected, the agent should:

1. Delegates to the external tool/API
2. Returns the result to the user
3. Does NOT attempt to modify SVG paths directly (unlike Route 2 where JSON is editable)
