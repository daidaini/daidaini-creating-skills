# Artifact Design Profile — attends_court

Generated per yao-meta-skill Phase 5.6 (Artifact Design Profiling).

## Artifact Family

**Markdown record + interactive dialogue.** Two artifacts:
1. Live dialogue (interactive, multi-turn) — court deliberation in real time
2. Archived markdown file (static, structured) — `议事-{议题关键词}.md`

## Visual Design Direction

### Live Dialogue
- 朝堂议事气质：有角色标记（`【宰相】`、`【王安石】`）的古今混合文体
- Not a script/screenplay — structured government record, not a drama
- White space between role paragraphs to emphasize turn-taking
- 宰相's summaries visually separated for scanability

### Archived Markdown File
- YAML frontmatter for title, date, tags
- Clear section hierarchy: 圣问 → 宰相拆题 → 与议诸人 → 廷议记录 → 宰相总括 → 知识网络图 → 未决问题
- ASCII art for knowledge network graph (final diagram only)
- Tables for人物 list if 4+ participants

## Non-Negotiables

| Requirement | Implementation |
|-------------|----------------|
| Headings specific to the issue | All headings derived from user's topic |
| Citations/footnotes not interrupting flow | No citations system —人物 speak from their known positions |
| No absolute filesystem paths | Archive path is relative `./议事-{议题}.md` |
| Mobile readable | Plain markdown, no HTML dependency |
| Design tokens coherent | Namely: 朝堂古文风格 tokens (formal address, role prefixes, 臣/圣上 register) |

## Top Quality Risks

1. **Dialogue vs document tension**: The live interaction is fluid but the archive needs structure. Solved by having the archive template separate from the live dialogue format.
2. **ASCII图质量**: 知识网络图在复杂议题中可能过于简化或难以理解. Mitigated by drawing only from the宰相总括's提炼.
3. **归档完整性**: 在交互结束后可能忘记归档. Explicit final instruction: "完成后向皇上报告文件路径".
