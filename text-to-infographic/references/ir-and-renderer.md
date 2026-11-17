# Visual IR 与渲染器

渲染器只读 Visual IR，不理解原文。IR 里只写语义，不写坐标。

---

## 1. 单页形态

```json
{
  "canvas": { "aspect_ratio": "16:9" },
  "theme": { "theme": "professional", "primary": "#2563EB" },
  "page": {
    "title": "结论式页面标题",
    "subtitle": "可选的一句补充",
    "eyebrow": "PROCESS",
    "pattern": "process",
    "layout": "horizontal-steps",
    "footer": { "note": "来源或限制说明（≤40 字）", "source": "出处（≤50 字）" }
  },
  "elements": [ { "id": "n1", "title": "第一步做什么", "body": "一句解释" } ],
  "connections": [ { "from": "n1", "to": "n2", "type": "precedes" } ]
}
```

**注意**：单页形态下 `elements` 和 `connections` 在**顶层**，`page` 只放元信息。
放错层级会导致元素静默丢失。

## 2. 多页形态

```json
{
  "canvas": { "aspect_ratio": "16:9" },
  "theme": { "theme": "professional" },
  "pages": [
    { "title": "第 1 页", "pattern": "overview", "elements": [], "connections": [] },
    { "title": "第 2 页", "pattern": "process",  "elements": [], "connections": [] }
  ]
}
```

`canvas` 与 `theme` 多页共用。`page_note` 是给自己看的批注，不会被渲染。

## 3. element 字段

| 字段 | 适用 | 说明 |
|---|---|---|
| `id` | 全部 | 缺省自动生成 `node-N`，作为 `<g>` 的稳定 ID |
| `title` | 全部 | 必填，结论短语，≤24 字 |
| `body` | 全部 | 次要文本，建议 ≤90 字 |
| `emphasis` | 全部 | `high` / `medium`（默认）/ `low`，控制边框粗细、色带、虚线 |
| `value` | 全部 | 大数字，渲染为强调字号（漏斗的比例、指标卡的数值） |
| `icon` | 全部 | 见 §6；拼错会被 `validate-ir.js` 报 WARN |
| `index` | process | 徽标序号，缺省按顺序自动编号 |
| `label` | timeline | 时间或时期标记；也可用 `date` / `meta` |
| `items` | comparison | `[{label, value}]` 或字符串数组；`pros-cons` 靠它填充 |
| `role` | 全部 | 输出到 `data-role`；缺省按 pattern 自动命名 |

连接 `type` 只有层级类会被渲染器读取：`parent` / `contains` / `child` / `belongs_to`。
其余类型（`precedes` 等）对渲染无影响，但保留它们有助于自己检查结构，
`validate-ir.js` 也会用它判断 pattern 与节点数是否匹配。

## 4. canvas / theme

`aspect_ratio`：`16:9`（1600×900，默认）/ `4:3` / `1:1` / `9:16` / `3:2`。
`margin` 缺省为宽度的 4.2%。

主题：`professional`（默认）/ `tech` / `minimal` / `paper`。
可覆盖任一颜色键：`bg` `surface` `primary` `secondary` `accent` `text` `muted` `border`，
另有 `font_family`。

渲染器把颜色输出为 CSS 变量 `--ttig-*`，因此 HTML 壳可以免重渲染换肤：

```
--ttig-bg  --ttig-surface  --ttig-primary  --ttig-secondary
--ttig-accent  --ttig-text  --ttig-muted  --ttig-border
```

`validate-ir.js` 会检查正文/背景 ≥4.5:1、次要文字/背景 ≥3:1。

## 5. 自定义版式（内置 17 种不够用时）

`render-svg.js --layout-file <file.js>` 加载外部模块，导出一个或多个版式函数：

```js
// my-layouts.js
module.exports = {
  'process:z-shape'(ctx) {
    const { els, box, u } = ctx;
    // 返回 SVG 字符串；可复用脚本内部件（见下）
    return els.map((e, i) => `<!-- ... -->`).join('');
  }
};
```

`ctx` 提供：`els`（已归一化，含 `id/role/unit_ref/title/body/value/index/emphasis/icon/items/label`）、
`conns`、`box`（`{x,y,w,h}` 内容区）、`u`（缩放因子，1600 宽时为 1）、`theme`、`page`。

通过 `require('./render-svg.js')` 可取到 `LAYOUTS`、`normalize`、`THEMES`。
需要 `card()`、`fitText()`、`arrow()` 等内部绘图件时，从 `render-svg.js` 导出再加，
不要复制一份。

`element` 也可直接用 `layout_file` 里的名字，无需改 IR 结构。

## 6. 图标名

`document` `search` `users` `chart` `gear` `check` `warning` `lightbulb`
`rocket` `target` `clock` `shield` `database` `chat` `sparkles` `arrow-right`

写错不渲染图形（`validate-ir.js` 会报 WARN）。图标为内联 24×24 路径，无外部字体或外链。

## 7. 脚本

```bash
node validate-ir.js <ir.json> [--semantic|--visual] [--strict]
node render-svg.js  <visual-ir.json> [-o out.svg] [--stdout] [--stdin] [--layout-file <js>]
node check-bounds.js <a.svg | 目录>
node build-html.js  <out.html> <p1.svg> [p2.svg ...] [--title T] [--subtitle S] [--json ir.json]
```

- `validate-ir.js`：退出码 0 通过（或有 WARN）/ 1 有 ERROR / 2 无法解析。
  未指定模式时按文件形态判断（含 `units` 数组 → Semantic IR）。
  检查必填字段、id 唯一、单元数区间、标题正文长度、引用完整性、
  pattern 与节点数匹配、时间线缺日期、漏斗缺数值、对比不足两实体、
  层级无父子连线、未知图标、非法 emphasis、WCAG 对比度。
- `render-svg.js`：只做排版与测量，不做任何内容理解。
  输出结构与预期不符时改 IR，不要改脚本。
- `build-html.js`：单文件预览壳，具备翻页、换肤、导出当前页 SVG、
  导出 PNG（2 倍）、折叠查看内联 IR、节点 hover 高亮。
- `check-bounds.js`：校验所有图形坐标落在 viewBox 内。

脚本均为 Node 零依赖实现。

## 8. 渲染器自动处理的事（不要写进 IR）

节点尺寸与间距、文本换行（CJK 逐字 / 西文按词）、字号自适应收缩以不溢出盒子、
连线与箭头、徽标序号、页眉页脚占位、竖版画布的版式切换、主题 CSS 变量。

## 9. 可选：语义留痕

如果希望保留「为什么留下这 3–7 个单元」的痕迹，可另存一份 `<topic>.semantic.json`
（`units` / `relations` / `core_message` 结构），用 `validate-ir.js` 单独校验。
它不进入渲染管线，只在需要回溯压缩决策时有用。
