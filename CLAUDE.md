# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code skills repository** containing two custom skills. Skills are Markdown-based definitions that extend Claude Code's capabilities with structured workflows and domain-specific knowledge.

## Directory Structure

```
attends_court/          # Court deliberation skill (朝议)
  SKILL.md              # Skill definition
product-analysis/       # Product analysis skill (产品分析)
  SKILL.md              # Skill definition
  assets/               # HTML report templates
    report-template-light.html
    report-template-dark.html
  references/
    first-principles.md # Methodology reference
examples/               # Example outputs from skill runs
testing/                # Test outputs (generated HTML files)
```

## Skills

### attends_court
Structured court-deliberation framework modeled on Northern Song dynasty state discussions. Transforms topics into role-based deliberations with ministers, philosophers, and modern advisers. Triggered by: "朝议", "廷议", "朝堂讨论", "皇上".

### product-analysis
Product first-principles analysis + historical evolution research + HTML report generation. Produces client-ready reports with "电子杂志 × 电子墨水" aesthetic. Three phases: deconstruction, historical turning points, HTML report. Triggered by: "分析产品", "产品报告", "拆解产品", "product analysis".

## Key Conventions

- Skills are defined in `SKILL.md` files with YAML frontmatter (name, description)
- Each skill directory is self-contained with its own assets and references
- Output files are saved to the working directory (e.g., `{product_name}_analysis.html`)
- Court deliberation outputs are saved as `./议事-{议题关键词}.md`
- The `testing/` directory contains generated outputs and should not be edited manually
