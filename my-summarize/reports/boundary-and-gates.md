# my-summarize 边界与门禁（v1.1.0 优化记录）

日期：2026-04（本次优化）
模式：Scaffold（个人复用，低运营风险）

## 核心用意

本 skill 是每日文章抓取管线（`ai_news` 等，按日期输出 `output/YYYY-MM-DD/`）末端的消化步骤：把当日一批英文文章 `.md` 变成**忠实、可溯源、可快速扫读**的中文摘要汇总 `summarize.md`。读者是没读过原文的用户，摘要质量 = 忠实度 + 溯源（来源超链接、作者）+ 扫读节奏。

## 边界

- 拥有的任务：对一个目录内全部文章 `.md` 做批量中文摘要，输出单一汇总文件
- 输入：目录路径（必填）；`-n` 句数、`-o` 输出文件名（可选）
- 输出：`<目录>/summarize.md`；每篇含标题、来源（超链接）、作者、5–8 句摘要
- 细节归属：文章抓取、目录生成本身不在本 skill 内

## 排除项（路由边界）

- 单篇文章/单文件摘要 -> 直接内联完成
- 对话、会议纪要、非 `.md` 内容总结 -> 一般总结流程
- 观点展开、深读评论写作 -> my-writing
- 产品分析报告 -> product-analysis

## 本次优化依据（真实运行的证据）

对 `ai_news/output/` 实际产物的检查发现：

| 证据 | 位置 | 结论 |
|------|------|------|
| 03-18 运行：无来源/作者、无链接、每篇 2–3 句 | `output/2026-03-18/summarize.md` | skill 的质量要求方向正确 |
| 03-24 运行：来源全部是纯文本，未按规则做成超链接 | `output/2026-03-24/summarize.md` | 超链接要求埋在正文中太弱，改为输出模板内的硬性格式 |
| 03-24 eval 运行：`’` 弯引号文件名读取失败，退化为「内容根据标题推断」 | `summarize_eval.md` 条目 7、12 | 特殊字符兜底顺序改为：读取工具 -> 复制为安全文件名 -> 最后才标题推断并标注 |
| 文档写的元数据格式（YAML frontmatter）与实际文章格式（blockquote 元数据头）不符 | 对比 SKILL.md 旧版与任意文章源文件 | 修正为实际格式，frontmatter 作为兼容 |
| 文内 `## 摘要` 是 RSS 截断片段（`output/2026-03-18/AOL_history.md` 截断在半句） | 文章源文件 | 明确：中文摘要唯一依据是 `## 正文` 全文 |
| 两次运行排序不一致（`[Sponsor]`/`★` 位置漂移） | 03-24 三个汇总文件对比 | 固化排序规则：文件名排序、忽略大小写与前导符号 |

## 门禁与结果

| 门禁 | 结果 | 证据 |
|------|------|------|
| trigger_eval（17 例：7 正 / 6 负 / 4 近邻，阈值 0.35） | 通过：0 FP / 0 FN，precision 1.0，recall 1.0；对比旧 description 无回退（Δ=0/0） | `evals/run_trigger_eval.py`、`reports/trigger-eval-report.json` |
| 上下文体量 | SKILL.md 5603 字节 / 128 行（旧版 4268 字节），增幅可控 | 文件系统 |
| 结构校验 | frontmatter（name/description/user_invocable/version）完整；description 含任务、触发词、排除项 | SKILL.md |

## Missing Evidence（如实标注）

- 无自动化输出质量评测（摘要忠实度只能人工抽检；`run_output_eval.py` 未在本 skill 上配置）
- 无真实路由遥测（触发命中率依赖实际使用观察；trigger_eval 是词法级冒烟测试，不模拟真实 LLM 路由对排除项措辞的反应）
- 无 holdout 评测集

## 回滚边界

旧版 SKILL.md（v1.0.0）如需恢复：正文结构未变，可直接回退 frontmatter description 与第 2/3/4/5 步的修改；`agents/interface.yaml`、`evals/`、`reports/` 为新增文件，删除即回滚。两处安装位置（本仓库与 `~/.pi/agent/skills/my-summarize/`）需同步回退。
