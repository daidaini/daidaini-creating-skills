# Component Library（零件清单）

生成手册时从以下组件中挑选组合，避免结构单调。每节至少用 2 种不同组件；整页交替使用，不连续重复。

所有组件共享模板里的设计令牌与基础样式（描边、偏移投影、旋转装饰）。下面给出结构要点，完整实现见 `template/skeleton.html`。

## 1. Hero 区

装饰色块（blob）+ 旋转标签 + 大标题 + 简介。

```html
<header class="hero">
  <span class="blob blob-a" aria-hidden="true"></span>
  <span class="blob blob-b" aria-hidden="true"></span>
  <span class="sticker" data-rot="-4">FIELD NOTES · 2025</span>
  <h1 class="hero-title">…大标题…</h1>
  <p class="hero-lede">…简介…</p>
</header>
```

blob：不规则圆角有机色块，叠在 Hero 背景上；大号无衬线标题（Archivo Black / Bebas Neue 类）。

## 2. 概念卡片组（grid-3 / grid-2）

短小结论卡片。网格 + 卡片描边 + 偏移投影 + hover 位移。

```html
<div class="card-grid">
  <article class="card">
    <span class="card-kicker">标签</span>
    <h3>…</h3>
    <p>…</p>
  </article>
</div>
```

## 3. 对比表格

任务 vs 推荐档位/方案。宽表用 `.table-scroll` 包裹以支持移动端横向滚动。

```html
<div class="table-scroll">
  <table>
    <thead><tr><th>…</th></tr></thead>
    <tbody>…</tbody>
  </table>
</div>
```

表头用点缀色背景，行 hover 高亮。

## 4. 决策流程条

编号圆圈 + 标题 + 说明，纵向排列，连接线或编号大写数字。

```html
<ol class="steps">
  <li><span class="step-num">01</span><div><h4>…</h4><p>…</p></div></li>
</ol>
```

## 5. 公式/伪代码框

深色背景 + 等宽字体，展示流程、口诀、公式、命令。

```html
<figure class="formula"><pre><code>…</code></pre></figure>
```

深色底（如 `--ink` 近黑色）反白文字，`overflow-x: auto`。

## 6. 强调引用块

大字号一句话结论，描边 + 偏移投影。

```html
<blockquote class="pullquote">…一句话结论…</blockquote>
```

## 7. 提示 / 警告 Callout

`callout info`（中性提醒）与 `callout warn`（风险提示）两种。

```html
<aside class="callout info"><strong>提示</strong> …</aside>
<aside class="callout warn"><strong>注意</strong> …</aside>
```

左侧用点缀色粗边条区分，warn 用更重的警示色。

## 8. 贴纸徽章

分类标签，轻微旋转角度，实色边框，手作贴纸感。

```html
<span class="sticker" data-rot="2">CORE CONCEPT</span>
```

## 9. 章节大数字

描边空心数字，营造出版物质感。实现：透明填充 + `-webkit-text-stroke` 描边（或 SVG 描边文字）。

```html
<section class="chapter">
  <div class="chapter-num" aria-hidden="true">01</div>
  <h2>…章节标题…</h2>
  …
</section>
```

## 10. 总结卡片 / 落款

章节末尾的一句话收束 + 页面结尾的风格化分隔与落款。

```html
<div class="wrap-up">…一句话总结…</div>
<footer class="colophon">…风格化落款…</footer>
```

## 11. 内联 SVG 流程图

源内容有 Mermaid、ASCII 流程，或存在多分支/反馈回路等用图更易理解的关系时，可将该部分绘制为**内联 `<svg>`**；简单线性步骤仍优先用 `.steps`，不必为装饰而画图。先核对节点、方向、条件、回路与标签，图中不新增源内容未表达的关系；若源内容是在讲解图语法，则保留转义后的原始代码。

```html
<figure class="diagram">
  <svg viewBox="0 0 640 240" role="img" aria-labelledby="flow-title flow-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="flow-title">流程标题</title>
    <desc id="flow-desc">用文字说明节点、方向及分支条件。</desc>
    <!-- 内联节点、箭头和标签；所有来自输入的文字须进行 HTML/XML 转义 -->
  </svg>
  <figcaption>简短文字说明；复杂流程可在图后补充逐步说明。</figcaption>
</figure>
```

给 SVG 设 `viewBox` 与 `width: 100%; height: auto;`，在手机和打印视图检查标签及箭头不重叠、文字可读；过宽时为容器提供横向滚动或改为纵向排布。使用当前风格的配色/线条，不加载 Mermaid 运行时、外链图片或外部脚本。`<title>`/`<desc>` 和图外说明应让不看图的人也能理解关键逻辑；重复使用多张图时确保各 SVG 的 ID 唯一。

## 组合建议

- 概念密集段 → 卡片组
- 对比/分级 → 表格
- 决策/操作顺序 → 流程条；复杂分支/循环 → 内联 SVG 流程图
- 口诀/公式/命令 → 公式框
- 关键结论 → 强调引用块 + 贴纸徽章
- 边界/风险 → warn callout；补充说明 → info callout
- 章节切换 → 海报感空心大数字

---

## 复古变体（Elegant Vintage）组件替代对照

使用 `template/skeleton-vintage.html` 时，上述组件类名不变，但装饰语言整体替换为 20 世纪初印刷品美学。生成复古风格页面时按此对照取用，**不要混用默认风的贴纸/blob 装饰**：

| 默认风组件 | 复古风对应 | 装饰差异 |
|---|---|---|
| blob 有机色块 | 全页双线外框 `.sheet-frame` + 四角金饰 | 版面四周合围，非漂浮色块 |
| 海报左对齐 Hero | 扉页式居中 Hero + kicker 饰线 + `❦` 花饰 | 对称庄重，书籍扉页式 |
| 贴纸 `.sticker` | 朱砂橡皮章（双线内框） | 印泥透感替代实色底 |
| （无） | 封蜡印记 `.seal`（Hero 右上） | 径向渐变红蜡 + 虚线内圈 |
| 粗描边卡片 | 藏书票双线卡（`outline` 内嵌） | 居中排布 + 标题下金饰线 |
| 实色表头表格 | 三线账簿表（首尾 double 边） | 传统学术三线表 |
| 圆形步骤编号 | 铜章编号（墨绿 + 金 double 外圈） | 建议用中文数字一/二/三 |
| 深底公式框 | 打字机誊写页（Special Elite） | 米黄纸底替代近黑底 |
| 左对齐大引用块 | 居中题词式（上下 double 边） | 斜体 + 大引号 |
| 提示/注意 callout | 按語 / 箴言 callout | 用词复古化 |
| 空心阿拉伯数字 | 空心罗马数字 + `☙────❧` 花饰 | 金棕描边，居中纵向章节头 |
| （无） | 首字下沉 `.dropcap` | 每章第一段，暗红大写首字 |
| （无） | 褪色照片 `.photo` | sepia 滤镜自动处理插图 |

复古专属的全页效果（模板已内置，勿删）：纸张噪点纹理、四周晕暗、污渍斑点三层做旧；响应式与打印时自动收起。

## 水墨宣纸变体（Ink-wash Xuan Paper）

使用 `template/skeleton-inkwash.html` 时，组件类名向通用命名收敛（`.verse-*` 改为 `.card / .pullquote / .em-red`，与默认/vintage/cyberpunk 骨架同源），但装饰语言整体替换为中国水墨宣纸美学。生成水墨风格页面时按此对照取用，**不要混用默认风的贴纸/blob 装饰或 vintage 风的双线外框/罗马数字**：

| 默认风组件 | 水墨风对应 | 装饰差异 |
|---|---|---|
| blob 有机色块 | 内联 SVG 飞雁竹影 + 卷轴留白 | 装饰在右上角边角，不漂浮中心 |
| 海报左对齐 Hero | 竖排题签侧栏 + 居中对称 Hero + Hero 末尾朱砂方印 | 题签用 `writing-mode: vertical-rl` 古典排版 |
| 贴纸 `.sticker` | 朱砂方印（`.seal`，双线内框 + 印泥透感） | 印泥深红替代实色底 |
| 章节阿拉伯空心数字 | 中文大写数字「壹/贰/叁/肆」描边空心 | 朱砂色描边，居中纵向章节头，字体 Ma Shan Zheng |
| 公式深底框 | 浅米黄纸底（`--paper-2`）+ 等宽宋体 | 与宣纸底色一致，保留可读性 |
| 表格 → 账簿三线表 | 三线表（首尾 double 边，墨色描边），thead 无底色 | 比 vintage 更克制，用墨色 line 而非 accent-1 |
| 流程条 → 阿拉伯圆圈 | 铜章编号（墨绿圆章 + paper 色描边圈 + 中文数字） | `--accent-green` + Ma Shan Zheng 字号 |
| 左对齐大引用块 | 题词式（朱砂边竖线 + double 上下边 + 大引号） | 与水墨题跋意象一致 |
| 提示/注意 callout | 按语/箴言 callout（info 绿/warn 朱砂） | 用词复古化，class 名同 `.callout info` / `.callout warn` |
| 引用源句 | `.em-red` 朱砂强调 + dashed 下划线 | 替代默认的 `<strong>` 关键词高亮 |

水墨专属的全页效果（模板已内置，勿删）：宣纸米色底 + 双 radial-gradient 模拟受光不均；左侧固定竖排题签（含朱砂方印）；背景 SVG 飞雁竹影；4 个示例章节号「壹/贰/叁/肆」；卷轴式版心。响应式与打印时自动收起。

**换装提醒**：组件类名已收敛到通用命名（与默认/vintage/cyberpunk 一致），生成水墨页面时只换 Google Fonts `<link>` 与 `:root` 令牌即可，不必重写组件结构；但 SVG 装饰、竖排题签、朱砂方印、中文章节号是本风格的身份所在，不要删除。
