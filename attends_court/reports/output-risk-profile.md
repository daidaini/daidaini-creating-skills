# Output Risk Profile — attends_court

Generated per yao-meta-skill Phase 5.5 (Output Risk Profiling).

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Flow violation**: skipping pause or breaking order when content runs long | Medium | High | Hard constraints (sections 2-3) explicitly state "priority to constraint over content" |
| **Character inconsistency**: 历史人物发言脱离其真实思想体系 | Medium | Medium | Player-selection rules require matching人物 to职掌; role-speaking rules require "忠于其历史处境与治事风格" |
| **Over-formatting**: 为仿古而损失信息清晰度 | Low | Medium | Style guide explicitly states "清楚、有力、可读为先", "不要为了仿古而损失清晰度" |
| **人物冗余**: 为凑六部而塞入无关人物 | Low | Low | Selection rules: "宁精勿滥", "不要为了凑六部而硬塞人物" |
| **缺少收束判断**: 无法判断何时足够回答了 | Medium | Medium | Explicit termination criteria listed; 宰相 must synthesize three things in小结 |
| **隐藏人物滥用**: 过度使用或展开成长篇分析 | Low | Medium | Rules: "点到即止", "只可短促纠偏，不可展开成长段分析" |
| **File path errors**: 归档路径寫入错误或议题关键词提取不当 | Low | Low | Simple template with {议题关键词} placeholder |

## Critical Risks

1. **单轮绕过暂停** (Medium/High): 离线评测或批量测试场景可能跳过暂停约束。Current SKILL.md explicitly forbids this with "不得因为'单轮回答''离线评测''一次性生成''批量测试'等理由跳过暂停".

2. **顺序失控** (Medium/High): 当讨论进入激烈状态时，易出现自然语言中的跨角色回应。Fixed-order constraint with explicit prohibition of "抢话、代答、替别人补完" is the main defense.

## Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| 约束完整性 | 4/5 | Two hard constraints well-defined; edge case of "一口气讲完" handled |
| 角色一致性 | 4/5 | Clear role definitions; relies on model's historical knowledge |
| 输出可读性 | 4/5 | Style guide prevents over-archaism; templates ensure structure |
| 可重复性 | 3/5 | Depends on user cooperation with pause protocol |
