# AGENTS.md — 仓库工作指南

本文件是 daidaini-creating-skills 仓库的权威 agent 指南。Claude Code 通过 `CLAUDE.md` 中的 `@AGENTS.md` 引用加载本文件；其他 agent（Zed、pi 等）直接读取本文件。

## 仓库是什么

个人 Claude Code / 通用 agent 技能（skills）集合，共 15 个技能。每个技能是一个自包含目录，入口为 `SKILL.md`。

在本机（Windows），`C:\Users\admin\.agents\skills\daidaini-skills` 是指向本仓库根目录的符号链接：编辑仓库即生效，无需复制安装。harness 只扫描每个子目录的 `SKILL.md`。

## 技能清单与触发模式

| 技能 | 职责 | 触发 |
|------|------|------|
| build-learning-ladder | 任意主题的 5 级学习阶梯 | 模型自动 |
| content-to-zen-static-html | 长文 → 日式极简×侘寂单文件 HTML | 模型自动 |
| d3-offline-map | Natural Earth + D3 离线自绘/分级填色地图 | 模型自动 |
| geographic-map-artifact | 地图产物统一入口（路由到下面两个地图技能 + 路线图×着色合成） | 模型自动 |
| leaflet-route-map | Leaflet 路线图 HTML / Google My Maps KML | 仅手动（`disable-model-invocation: true`） |
| my-summarize | 目录批量中文摘要 → `summarize.md`（可选路由 beautiful-html 出 HTML） | 手动+自动（`user_invocable: true`） |
| my-writing | 单一核心判断写成 1000–1500 字中文深度文 | 手动+自动 |
| youtube-audio-downloader | yt-dlp 下载 YouTube 音频 MP3（绕过 403/n-challenge） | 手动+自动 |
| attends-court | 北宋朝堂式多角色思辨（朝议/廷议） | 仅手动 |
| beautiful-html | 杂志级可翻阅单文件 HTML 知识手册 | 仅手动 |
| feyman-learning-method | 交互式费曼学习对话 | 仅手动 |
| high-leverage-resources | Top-5 学习资源精选 + 7 天计划 | 仅手动 |
| one-page-cheat-sheet | 一页速查表（5 分钟复习） | 仅手动 |
| product-analysis | 第一性原理 + 历史演化 → 客户交付 HTML 报告 | 仅手动 |
| product-mind | Jobs 式产品判断（GO/NO GO/MVP） | 仅手动 |

「仅手动」的技能不会自动触发，只能由用户显式点名。不要为了让技能自动触发而擅自移除 `disable-model-invocation`。

## 技能目录结构（yao-meta-skill 打包约定）

```
<skill>/
├── SKILL.md                  # 必需。入口，YAML frontmatter + 工作流正文
├── manifest.json             # 可选。包级元数据（目前仅 one-page-cheat-sheet）
├── agents/interface.yaml     # 机器可读契约：triggers/inputs/outputs/exclusions/mode
├── references/               # 按需加载的知识文件（不要塞进 SKILL.md 正文）
├── assets/ 或 template/      # 输出模板（HTML 骨架、报告模板等）
├── scripts/                  # 确定性辅助脚本（数据打包、格式转换、校验）
├── evals/                    # trigger_cases.json、semantic_config.json
└── reports/                  # boundary-and-gates.md、*-risk-profile.md、trigger-eval-report.json
```

不是每个技能都有全部目录；新增内容时按此约定放置，参考 `my-summarize/`、`one-page-cheat-sheet/`（production 档）和 `geographic-map-artifact/`（scaffold 档）。

## SKILL.md 约定

- frontmatter `name` 与目录名一致（kebab-case）。
- `description` 为单行 YAML 字符串，且必须同时包含：做什么、正向触发词（中英文）、明确的排除项（"Do NOT use for…" 或「排除：…」）。历史上做过全库规范化（单行化、全角冒号统一），保持这个格式。
- 可选键：`license`、`version`、`user_invocable`、`disable-model-invocation`。
- 正文保持精简，重资料放 `references/`，模板放 `assets/`/`template/`。

## 输出文件约定

技能产物默认写入用户当前工作目录：

- attends-court → `./议事-{议题关键词}.md`
- my-summarize → `{目录}/summarize.md`（要求 HTML 时再出 `{目录}/summarize.html`，由 beautiful-html 生成）
- product-analysis → `{product_name}_analysis.html`
- 地图/HTML 类技能 → 单文件、可双击直接打开、不依赖服务器

## 校验脚本（改动后运行）

```bash
# beautiful-html 产物静态检查（exit 0 = 无 FAIL）
python beautiful-html/scripts/verify-html.py <path-to.html> [--strict]

# content-to-zen-static-html 产物静态检查（exit 0 = 无 FAIL）
python content-to-zen-static-html/scripts/verify-html.py <path-to.html> [--expect-entries N]

# d3-offline-map：把 TopoJSON/GeoJSON 内联为 window.MAPS（绕开 file:// CORS）
node d3-offline-map/scripts/build-data.js <file[:alias] ...> [-o data.js]

# leaflet-route-map：OSRM 路线 JSON → My Maps KML
python leaflet-route-map/scripts/convert-kml.py <route.json> <out.kml> [--waypoints wp.json]

# one-page-cheat-sheet 触发词回归（正/负/近邻用例）
python one-page-cheat-sheet/scripts/trigger_eval.py

# my-summarize 触发评分（结果写入 reports/trigger-eval-report.json）
python my-summarize/evals/run_trigger_eval.py
```

凡是 HTML 产物，静态检查之外还要真实浏览器验证：打开文件、锚点跳转、移动端折叠、console 无报错、截图确认。

## 开发工作流

1. 新建/改进/评测技能走 `yao-meta-skill`（位于 `C:\Users\admin\.agents\skills\yao-meta-skill`）。
2. 修改触发词或职责边界时，同步更新该技能的 `agents/interface.yaml` 与 `evals/trigger_cases.json`，并重跑对应 trigger eval。
3. `description` 的改动直接影响路由，改后必须用正反例验证，不要凭感觉改。
4. 跨技能路由关系要维护：my-summarize → beautiful-html；geographic-map-artifact → leaflet-route-map / d3-offline-map。改上游先查下游引用。
5. HTML 类技能的样式规则在各自 `references/`（design-system、style-presets、soul 等），改模板与改文档一起提交。

## 注意事项

- `testing/` 与 `.playwright-mcp/`、`.workbuddy/`、`.claude/`、`.pi/`、`.agents/` 均在 `.gitignore` 中；`testing/` 是临时产物目录，不要手动编辑或提交。
- `examples/` 已在 `.gitignore` 中，但早期文件已被跟踪；新增示例不会自动入库，属正常现象。
- 不要执行 `git commit`/`git push`，除非用户明确要求。
- 技能正文语言中英混用是现状（面向中文用户 + agent 可读性），不要求统一；但同一文件内保持一致。
