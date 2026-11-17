---
name: text-to-infographic
description: 将非结构化文本（文章、会议纪要、报告、笔记）编译为结构化信息图。先识别核心结论并把内容压缩为 3–7 个信息单元，再依据单元关系选择对比、步骤、层级、漏斗或时间线结构，最后由确定性脚本输出可编辑 SVG 与单文件 HTML 预览壳。当用户要求「把这段文字做成信息图／图解／一图读懂／可视化卡片／图文摘要」，或需要把长文压缩成可传播的单页视觉产出时使用；不适用于纯装饰性海报、照片排版或已有数据表格的直接绘图。
disable-model-invocation: true
---

# text-to-infographic

把非结构化文本编译为结构化视觉叙事。核心不是绘图，是两个判断：

1. 一页保留哪 3–7 个信息单元
2. 这些单元之间是什么关系，适合哪种视觉结构

**分工**：模型负责理解、压缩、规划；脚本负责测量、换行、定位、渲染。
模型不手写 SVG 坐标，脚本不理解原文。

---

## 何时使用

- 用户给出一段文本（文章 / 纪要 / 报告 / 笔记）并要求做成图
- 需要把长文压缩成便于传播或快速理解的单页视觉产出
- 需要可编辑、可换肤、可导出的矢量信息图

**不适用**：纯装饰海报、图片排版、已有结构化数据表的直接图表化。

---

## 三步工作流

### 第一步 — 压缩并定结构

一次读完原文，直接产出判断结果（不需要单独的中转文件）：

- **一句话结论**（`core_message`）
- **3–7 个信息单元**，每个含：结论式标题（≤24 字）、一句支撑（≤80 字）、重要性、关键数字
- **单元间关系**：`precedes` / `depends_on` / `contains` / `belongs_to` /
  `contrasts_with` / `causes` / `supports` / `filters_into` / `specializes`
- **主模式**：comparison / process / hierarchy / funnel / timeline / overview

压缩规则、标题写法、五类模式判定条件（含反例）见 `references/content-and-structure.md`。
先读那一篇，再动手写 IR。

三条不可让渡：数字不得在压缩中丢失；被删信息降级到 body 或页脚，不静默丢弃；
不得改写观点强度（原文「可能」不能变成「必然」）。

### 第二步 — 写 Visual IR（JSON）

一份 Visual IR 文件即可，单页用顶层 `page/elements/connections`，多页用 `pages[]`。
字段、版式表、图标名、主题变量见 `references/ir-and-renderer.md`。

写 IR 时只管语义：标题、正文、强调、图标、数值、连接。
**坐标、字号、换行、间距交给渲染器**——它在内部用字符宽度实际测量并自适应缩字。

### 第三步 — 渲染并目检

`SKILL_DIR` 指本 Skill 的安装目录（用户级 `~/.agents/skills/text-to-infographic`，
项目级 `<仓库>/.agents/skills/text-to-infographic`）：

```bash
NODE="node"
SKILL="$SKILL_DIR/scripts"

"$NODE" "$SKILL/validate-ir.js"  <topic>.visual.json
"$NODE" "$SKILL/render-svg.js"   <topic>.visual.json -o <topic>.svg
"$NODE" "$SKILL/check-bounds.js" <topic>.svg
"$NODE" "$SKILL/build-html.js"   <topic>.html <topic>.svg --title "<标题>" --json <topic>.visual.json
```

多页时 `render-svg.js` 输出 `<topic>-p1.svg`、`-p2.svg` …，全部传给 `build-html.js`。

渲染后只看五件事，有问题回第二步改 IR，不要改脚本：

1. **交换测试**：任意交换两个信息块位置，页面含义若几乎不变，说明它是卡片网格而不是信息图——回到关系建模重做
2. 是否只有一个视觉入口和一处收束，而不是所有节点等重（`emphasis: high` 最多 1–2 个）
3. 标题是否表达结论而非主题标签（「成本问题」→「部署成本集中在人工复核」）
4. 页脚 `note` 约 40 字内、`source` 约 50 字内，超出会与页码碰撞
5. 中文换行处是否有行首标点（，；、）悬挂；有则调整措辞让断行点错开

### 降级：允许不强行画

- 结构置信度低 → 用 `overview` / `radial-hub`（核心观点 + 三个支撑点），页脚注明「结构存在歧义，可切换为 X」
- 信息不足 → 只画已确认的，缺失项写进页脚；**不自行补数据**
- 内容过长 → 先给页面目录（overview → 为什么 → 怎么做 → 证据 → 行动），逐页生成，不要塞进一张图
- 漏斗无真实收缩 → 改判 `process`，并在交付说明里记录改判原因

---

## 硬规则

1. **不在 IR 里写坐标、像素或字号**。渲染器负责排版；需要新布局时见 `ir-and-renderer.md` 的自定义版式入口。
2. **一页一个主结构**，可带一个不喧宾夺主的辅助结构。想同时放时间线 + 漏斗 + 卡片矩阵时，正确做法是分页。
3. **结构不能造假**：三个并列要点不是层级，只有步骤没有收缩不是漏斗，日期不是主轴不是时间线。
4. **视觉权重必须分级**，不能所有节点一样重。
5. **SVG 保持可编辑**：不改渲染器输出的 `<g id>` / `data-role` / `data-unit-id`，
   不把 `<text>` 转成路径，不引入外部字体或外链。

---

## 输出文件

| 文件 | 说明 |
|---|---|
| `<topic>.visual.json` | Visual IR，渲染输入 |
| `<topic>.svg` / `<topic>-p1.svg` … | 矢量源文件 |
| `<topic>.html` | 单文件预览壳（翻页 / 换肤 / 导出 SVG+PNG / 查看 IR） |

`<topic>` 用短横线小写英文或拼音，如 `ai-agent-luodi`。

---

## 交付说明

最后回复用户时给出：

1. 一句话结论（即 `core_message`）
2. 选用的视觉结构与理由（含被否决的次优结构，一句话即可）
3. 被省略或降级的信息（进了页脚 / 附录 / 未采用的原文内容）
4. 输出文件清单

不要复述 SVG 内容——用户可以直接看图。
