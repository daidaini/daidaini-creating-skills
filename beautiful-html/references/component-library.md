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

## 组合建议

- 概念密集段 → 卡片组
- 对比/分级 → 表格
- 决策/操作顺序 → 流程条
- 口诀/公式/命令 → 公式框
- 关键结论 → 强调引用块 + 贴纸徽章
- 边界/风险 → warn callout；补充说明 → info callout
- 章节切换 → 海报感空心大数字
