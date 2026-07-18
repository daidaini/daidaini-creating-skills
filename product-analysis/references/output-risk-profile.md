# Output Risk Profile — Product Analysis HTML Report

## Overview

This skill generates a client-facing HTML report. Mistakes are high-visibility because the output is designed for presentation, not internal notes.

## Known Risk Patterns

### 1. Core Anchor Too Generic

**Risk**: The Core Anchor sentence fits any product in the category (e.g., "X is a tool pretending to be a platform").

**Guard**:
- Test: would this sentence embarrass you if the product's founder read it?
- Test: does removing the product name from the sentence still clearly identify which product?
- If both answers are "no", the anchor is specific enough.

### 2. Turning Points Picked by Recency, Not Causality

**Risk**: The most recent launches or funding rounds get selected because they're easy to research, while the truly structural choices are missed.

**Guard**:
- For each turning point, ask: "Did this choice permanently close an alternative future?"
- If the answer is "no" for any candidate, replace it.
- Look for the choice that *removed* optionality, not the one that *added* features.

### 3. Positioning Chart Axes Are Arbitrary

**Risk**: Radar chart dimensions are chosen for convenience (e.g., "UX", "Features", "Price") rather than derived from the first-principles analysis.

**Guard**:
- Every axis must trace back to a dimension identified in the Core Need or Ideal Form.
- If an axis is not mentioned in Phase 1, it doesn't belong in the chart.

### 4. Insights Are Restatements of the Obvious

**Risk**: "Insights" that any industry observer would say, e.g., "X needs to improve its user experience."

**Guard**:
- Each insight should surprise someone who knows the product casually.
- An insight passes if: the product team would learn something from reading it.
- An insight fails if: it could appear in a competitor's analysis unchanged.

### 5. Stats Are Decorative

**Risk**: Hero stats (MAU, revenue, rating) that don't support the Core Anchor narrative.

**Guard**:
- Each stat must illuminate a tension identified in the analysis.
- If a stat doesn't make the reader think "aha, that's why the product is the way it is", drop it.
- Consider non-obvious stats: churn rate, time-to-value, feature adoption %, support ticket ratio.

### 6. Chart.js CDN Failure

**Risk**: The CDN for Chart.js is unreachable (network restriction, outage), rendering both charts invisible.

**Guard**:
- Template includes fallback: if `window.Chart` is undefined after CDN load, render a plain-text summary of chart data.
- See template `<script>` section for fallback implementation.

### 7. Accent Color Clash

**Risk**: The chosen product accent color creates poor contrast against the parchment/dark background.

**Guard**:
- If the product's brand color is very light (e.g., #f0f0f0) on light template, or very dark on dark template, fall back to a neutral accent derived from the analysis theme.
- Use the product's secondary color or a complementary neutral.
