# daidaini-creating-skills

个人 AI Agent 技能（Skills）集合，每个子目录对应一个独立技能（`SKILL.md`），未明确声明路由关系的技能之间互不依赖。

## 快速开始

1. **安装技能**：按需将对应技能目录复制或软链接到所用 Agent 的 skills 目录（如 `~/.claude/skills/`、`~/.factory/skills/` 或项目级 `.claude/skills/`）。
2. **查看用法示例**：各技能可直接复用的提示词示例请见 **[skill-prompt-examples.md](./skill-prompt-examples.md)**。

## 技能目录

### 学习方法论

| 技能 | 说明 |
| --- | --- |
| [build-learning-ladder](./build-learning-ladder/SKILL.md) | 为任意主题拆解循序渐进的学习阶梯，含掌握标准、练习、常见误区与自测 |
| [feyman-learning-method](./feyman-learning-method/SKILL.md) | 费曼学习法互动式对话教学，通过通俗讲解、复述纠偏循环帮助真正理解概念 |
| [high-leverage-resources](./high-leverage-resources/SKILL.md) | 精选并核验 5 个高杠杆学习资源，基于所选资源制定可落地的 7 天计划 |
| [one-page-cheat-sheet](./one-page-cheat-sheet/SKILL.md) | 生成 5 分钟内可快速扫读的一页速查表（默认 Markdown，可按需输出离线 HTML） |

### 内容创作与静态排版

| 技能 | 说明 |
| --- | --- |
| [my-summarize](./my-summarize/SKILL.md) | 批量读取指定目录下的 Markdown 文章并汇总生成可溯源的中文摘要（可按需转 HTML） |
| [my-writing](./my-writing/SKILL.md) | 围绕单一核心判断撰写 1000–1500 字深度中文分析文章 |
| [story-co-creation](./story-co-creation/SKILL.md) | 将零散想法共同打磨为完整故事、童话或分章小说，先确认框架与篇幅再动笔 |
| [content-to-zen-static-html](./content-to-zen-static-html/SKILL.md) | 将长文档完整转换为日式极简侘寂风、可双击离线打开的单文件静态 HTML |
| [beautiful-html](./beautiful-html/SKILL.md) | 将长笔记或方法论排版为具有杂志/手册设计感的多风格单文件静态 HTML |

### 地图与可视化

| 技能 | 说明 |
| --- | --- |
| [d3-offline-map](./d3-offline-map/SKILL.md) | 基于 GeoJSON/TopoJSON 与本地 D3 构建免 API Key 的离线区域填色地图 |
| [leaflet-route-map](./leaflet-route-map/SKILL.md) | 构建带起终点与统计信息的 Leaflet 路线图，或导出 Google My Maps 兼容 KML |

### 研究、产品与思辨

| 技能 | 说明 |
| --- | --- |
| [evidence-led-research](./evidence-led-research/SKILL.md) | 开展证据驱动的问题调查与根因分析，区分事实、假设与未知并给出有据结论 |
| [product-mind](./product-mind/SKILL.md) | 从用户痛点、替代方案与边界出发评估需求价值、MVP 范围与成功指标 |
| [attends-court](./attends-court/SKILL.md) | 以北宋朝堂廷议形式组织多视角角色讨论，逐轮拆解复杂议题 |

### 实用工具

| 技能 | 说明 |
| --- | --- |
| [youtube-audio-downloader](./youtube-audio-downloader/SKILL.md) | 使用 `yt-dlp` 与 Node.js 环境下载 YouTube 最佳音质音频并转为 MP3 |

## 提示词示例

具体调用方式与各场景提示词模板，请直接查阅 **[skill-prompt-examples.md](./skill-prompt-examples.md)**。
