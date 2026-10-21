# 边界与验证

## 目标与范围

- 目标目录：`story-co-creation/`，身份 `story-co-creation`，版本 0.1.0，Scaffold。
- 默认共同创作；通用故事与小说，优先适配儿童口述。创作者年龄与读者年龄分别处理。
- 正文前确认框架和篇幅，正文完成后确认配图实际方案；沿用用户已有明确决定。
- 不承接纯摘要、翻译、润色、评论、诗歌、营销文案、软件用户故事、纯教学、仅绘图或技能创建。
- 支持通用 Markdown harness；文件与图片是可选能力，不依赖绝对路径、专用脚本、特定模型或 API。

## 资源取舍

入口只保留阶段与交付契约。两份 reference 分别承担创作判断和文件/插画操作。`evals/` 用于区分相邻写作任务与阶段确认；不为开放式创作添加状态机程序、依赖安装器或固定字数档位。

参考扫描使用本地 skill-creator（渐进披露与通用 skill 格式）、my-writing（划清分析文章与小说）、feyman-learning-method（儿童对话与逐轮等待）、imagegen（真实图片能力与图像核对）。仅借鉴工作流，不依赖这些技能安装；没有开展外部资料研究。

## 验证与边界

2026-10-21 验证：

- Yao `validate_skill.py`：通过，无失败或警告。
- Codex `quick_validate.py`：通过。移除了其不接受的非必需 `user_invocable` 字段，以标准 frontmatter 保持可移植。
- `resource_boundary_check.py --max-initial-tokens 700`：通过，无未使用资源目录；token 数为检查器的字符长度启发式估计，不是实际模型消耗。检查器没有 manifest 时默认显示 production 标签，本包仍为 Scaffold。
- 触发代理：26/26，通过 11 条正例、9 条负例和 6 条近邻；详见 `trigger-eval-report.json`，仅使用关键词概念及排除项，不能代表真实模型语义路由。
- 包内 Markdown 引用：无断链；`git diff --check` 通过。
- `behavior_cases.md`：11 个待执行行为验收场景；作者已走查阶段边界，未开展独立模型多轮测试，不宣称场景已通过。

结构校验依赖的 PyYAML 仅安装到系统临时目录，未增加技能运行依赖。跨 harness 自动发现、儿童实际体验、完整长篇创作与跨图角色一致性仍需真实使用验证。

可复跑触发代理（将 `<yao-scripts>` 替换为本机 yao-meta-skill/scripts 路径）：

```text
python <yao-scripts>/trigger_eval.py --description-file story-co-creation/SKILL.md --cases story-co-creation/evals/trigger_cases.json --semantic-config story-co-creation/evals/semantic_config.json
```

没有发布、提交、推送或调用真实图片服务。
