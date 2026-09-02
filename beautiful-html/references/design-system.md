# Design System

The complete visual rules for a `beautiful-html` manual. Generate against these rules; the [Quick Checklist](#快速检查清单) at the end is the self-check gate.

> **结构变体**：本文件描述默认风格（贴纸拼贴）的规则。若用户指定「优雅复古 / vintage / 老式印刷品」，改用结构变体模板 `template/skeleton-vintage.html`，其装饰规则见 [Style Presets → 优雅复古](style-presets.md#优雅复古-presetelegant-vintage专属骨架)。若用户指定「禅 / 侘寂 / 日式极简 / 未来科技」，则委托给 `content-to-zen-static-html` 技能，不使用 beautiful-html 骨架或预设。下面的「人做的设计」痕迹在复古变体中以等价物达成（贴纸→橡皮章/蜡封、blob→双线外框、偏移投影→低透明度做旧投影），校验脚本对两者同样适用。

## 1. 设计风格（Design Style）

整体美术方向由「风格关键词」驱动（例如：斯堪的纳维亚极简 + 波普艺术拼贴）。

**明确排斥「AI 生成模板感」：**

- ❌ 常见的蓝紫渐变卡片
- ❌ 统一圆角 + 模糊阴影卡片
- ❌ 千篇一律的居中大标题布局

**要求有「人做的设计」痕迹（任选 2-3 个，越多越好）：**

- ✅ 手作贴纸式描边阴影：`box-shadow` 用偏移实色而非模糊（如 `box-shadow: 6px 6px 0 var(--ink)`）
- ✅ 旋转角度的标签 / 徽章（`transform: rotate(-3deg)`）
- ✅ 海报感的大号数字 / 字体（超大 display 字号、描边空心数字）
- ✅ 有机形状的背景装饰色块（blob：`border-radius: 40% 60% 55% 45% / 45% 40% 60% 55%` 之类的不规则圆）

## 2. 配色系统（Color System）

- **基础背景色**：克制内敛（如温暖米白/燕麦色），占页面绝大部分。
- **点缀色（3-4 个跳跃色）**：大胆、与基础色形成反差（如珊瑚红、芥末黄、青绿、薰衣草紫）。
- **禁则**：不要用系统默认的蓝色系或紫色渐变作为主色调。

建议实现方式：把颜色定义为一组 CSS 变量，便于整体换装：

```css
:root {
  --paper: #f6f1e7;      /* 基础背景 */
  --ink: #2b2622;        /* 主文字 */
  --accent-1: #e8553f;   /* 珊瑚红 */
  --accent-2: #e0b23c;   /* 芥末黄 */
  --accent-3: #2f9e8f;   /* 青绿 */
  --accent-4: #9d7fd4;   /* 薰衣草紫 */
  --sticker-line: #2b2622;
}
```

## 3. 字体系统（Font System）

三种角色，必须从 Google Fonts `<link>` 引入，不能只用系统字体：

| 角色 | 示例 | 用途 |
|---|---|---|
| 标题字体（个性衬线/展示） | Fraunces, Playfair Display | 大标题、章节标题 |
| 强调/数字字体（粗体无衬线展示） | Archivo Black, Bebas Neue | 大号数字、贴纸徽章、口号 |
| 正文字体（易读人文无衬线） | Inter, Source Sans 3 | 正文、表格、说明 |

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,900&family=Archivo+Black&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
```

中文内容注意：中文字形回退到有衬线/无衬线的系统中文栈（如 `"Songti SC", "Noto Serif SC", serif` 或 `"PingFang SC", "Noto Sans SC", sans-serif`），西文用 Google Fonts 出效果。

## 4. 结构要求（Structure）

- **左侧固定侧边栏**（`<aside>` + `<nav>`）：品牌标签 + 标题 + 目录导航（锚点跳转）。
- **顶部 Hero 区**：装饰色块、口号标签（旋转）、大标题、简介。
- **正文分章节**（每节 `<section>`）：
  - 大号描边空心数字作为章节编号（杂志感）
  - 章节标题
  - 内容：概念卡片 / 表格 / 决策流程 / 公式或伪代码框 / 引用强调块 / 提示与警告框 **交替使用**，避免整篇同一种组件。
- **卡片**：描边 + 偏移投影，hover 时轻微位移动效。
- **关键结论**：使用「贴纸风格」徽章（rotate 一点角度，实色边框）。
- **结尾**：一句话总结 + 风格化的分隔/落款。

## 5. 技术要求（Technical）

- 单文件 HTML，内联 `<style>`，不依赖外部 JS 框架。
- 响应式：移动端侧边栏转为顶部条；多栏表格转为可横向滚动（`.table-scroll` 包裹）。
- 打印样式：`@media print` 隐藏侧边栏、去掉交互装饰。
- 语义化 HTML：`section`、`aside`、`nav`、`article`、`table` 等。
- class 命名清晰、结构扁平，方便后续修改配色和内容。

## 6. 内容要求（Content）

- 保留原内容的所有关键信息、表格、分类和逻辑结构，不要遗漏。
- 可适当拆分/合并章节以适应「可翻阅手册」的阅读节奏。
- 每个章节控制在「一屏到一屏半」的信息密度，避免单节过长。
- 结尾一句话总结。

## 快速检查清单

生成后逐项自查（`scripts/verify-html.py` 自动检查其中可静态判断的部分，浏览器人工复查视觉部分）：

- [ ] 是否用了 Google Fonts 而非系统默认字体？
- [ ] 配色是否避开了「默认蓝紫渐变」？
- [ ] 卡片阴影是否为偏移实色而非模糊高斯阴影？
- [ ] 是否存在至少一处旋转角度的元素（标签/徽章）？
- [ ] 章节编号是否有海报感（大号/描边）？
- [ ] 是否用了语义化标签（aside / nav / section / table）？
- [ ] 是否响应式（移动端侧边栏折叠、表格横向滚动）？
- [ ] 是否支持打印（`@media print` 隐藏侧边栏）？
- [ ] 是否单文件、无外部 JS 框架？
- [ ] 内容信息是否完整保留，没有因为排版牺牲内容？
