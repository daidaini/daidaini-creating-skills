# Style Presets（换装参考表）

用同一套结构做出不同视觉效果：只替换「风格关键词」和「配色关键词」两处变量（以及可选的字体），结构和技术要求保持不变。

| 风格方向 | 风格关键词 | 配色关键词 | 字体建议 |
|---|---|---|---|
| 本次案例 | 斯堪的纳维亚极简 + 波普拼贴 | 燕麦米白 + 珊瑚红/芥末黄/青绿/薰衣草紫 | Fraunces + Archivo Black + Inter |
| 日式极简 | Wabi-sabi 侘寂风 | 灰白/米色 + 靛蓝/朱红点缀 | Noto Serif JP + Inter |
| 包豪斯 | Bauhaus 几何构成 | 原色三原色（红黄蓝）+ 黑白 | Futura / Archivo + 几何无衬线 |
| 赛博朋克 | Cyberpunk 霓虹故障风 | 深黑背景 + 荧光青/品红/黄绿 | Orbitron / Space Mono |
| 学术手册 | 编辑排版 Editorial | 象牙白 + 深绿/暗红点缀 | Playfair Display + Source Serif |
| 瑞士国际主义 | Swiss Style 网格排版 | 纯白 + 单一强调红 | Helvetica Neue / Inter |
| 复古杂志 | 70年代复古印刷 | 卡其/砖红/橄榄绿 | Cooper / Fraunces |
| 优雅复古 ★ | 20世纪初印刷品 / Elegant Vintage | 米黄陈纸 + 深棕/暗红/古铜金/墨绿 | Playfair Display + Cinzel + Noto Serif |
| 禅意未来 ★ | 禅 / 侘寂 / 日式极简 / 未来科技 | 暖白/雾灰 + 炭黑 + 电子蓝/青绿 | 系统字体栈（无 Google Fonts） |

★ 标记的「优雅复古」和「禅意未来」是带独立路由的预设：优雅复古有专属骨架模板 `template/skeleton-vintage.html`；禅意未来则委托给 `content-to-zen-static-html` 技能，不使用 beautiful-html 的任何骨架或预设。

## 如何换装

1. 保持 `template/skeleton.html` 的结构、组件类名、布局逻辑不动。
2. 只替换模板顶部的设计令牌（CSS 变量）：

   - `--paper` / `--ink`：基础色（背景 + 文字）
   - `--accent-1..4`：3-4 个跳跃点缀色
   - `--display-font` / `--emphasis-font` / `--body-font`：字体角色
   - 装饰 blob 的形状与摆放（每个 preset 建议换一套有机形状位置）

3. 替换 Google Fonts `<link>` 中的字体为 preset 建议字体。
4. 复跑 `scripts/verify-html.py` 与浏览器检查。

## 默认 preset（Scandinavian + pop-art）

当用户只说「有设计感」、未指定风格时，用默认值：

- 风格：斯堪的纳维亚极简 + 波普艺术拼贴
- 配色：燕麦米白 `#f6f1e7` 打底，珊瑚红/芥末黄/青绿/薰衣草紫点缀
- 字体：Fraunces（标题）+ Archivo Black（强调/数字）+ Inter（正文）

## 禅意未来 preset（Zen / 侘寂 / 日式极简 / 未来科技）

当用户请求中出现禅、侘寂、wabi-sabi、日式极简、Japanese minimalism、未来科技、futuristic tech 等关键词时，**不启用 beautiful-html 的任何骨架或预设**，而是委托给 `content-to-zen-static-html` 技能。

**为什么需要独立路由**：beautiful-html 的设计语言（偏移实色投影、旋转贴纸、空心章节数字、Google Fonts 引入）本质上是"杂志拼贴风"，与禅意未来主义的"留白 × 材质 × 电子反馈"方向冲突。若强行套用 beautiful-html 骨架，会得到"贴纸拼贴穿禅服"的错误结果。`content-to-zen-static-html` 拥有独立的视觉规则（系统字体栈、单强调色、低密度布局、纸张/石材质感、未来科技点缀），输出同样是单文件静态 HTML，但遵循完全不同的美学体系。

**路由规则**：

1. 检测到禅相关关键词 → 停止 beautiful-html 流程，不加载任何模板或预设。
2. 将用户内容与意图传递给 `content-to-zen-static-html` 技能。
3. 该技能以"日式极简 × 侘寂 × 未来科技"为默认视觉方向，输出单文件、可离线、无外部依赖的 HTML。
4. beautiful-html 的验证脚本 `verify-html.py` 不适用于禅意输出（因无偏移投影、空心数字等要求），应使用 `content-to-zen-static-html` 自身的验证清单。

**禅意风格的配色参考**（来自 `content-to-zen-static-html`）：

- 暖白/雾灰打底，炭黑文字
- 单一电子蓝或柔和青绿色作为强调色
- 细线、进度反馈和安静动效
- 纸张纤维、细微噪点、不完美痕迹

**禅意风格的字体参考**（来自 `content-to-zen-static-html`）：

- 仅使用系统字体栈，不加载 Google Fonts 或外部字体
- 中文：`"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`
- 等宽：`"SFMono-Regular", "Cascadia Code", Consolas, monospace`

## 优雅复古 preset（Elegant Vintage，专属骨架）

重现 20 世纪初期印刷品美学（参考 The New Yorker 与老式法国时尚杂志）。触发词：优雅复古、复古印刷、老式杂志、vintage、旧书/藏书票/铅印质感。

**与其他 preset 的本质区别**：复古的典雅来自「结构性装饰语言」，不只是配色与字体。若在默认骨架上仅换色换字体，得到的仍是贴纸拼贴风穿旧衣服，不是老印刷品。因此使用专属骨架 `template/skeleton-vintage.html`，它已实现全部下述要素：

- **配色令牌**：陈年米黄纸 `#f2ead8` 打底；深棕油墨 `#3a2d20` 文字；点缀色为暗红（封蜡/朱批）`#8c2b20`、古铜金（烫金饰线）`#a67c2e`、墨绿（账簿皮革）`#31502f`、黛蓝（老蓝图墨）`#2f4257`
- **字体角色**：Playfair Display（Didot 风标题）+ Cinzel（罗马小帽强调）+ Noto Serif（正文衬线）+ Special Elite（打字机体，公式框专用）
- **做旧三层**：SVG 噪点纸张纹理（`body::before`）+ 四周晕暗（`body::after`）+ 零星污渍（`.stains`）——纯 CSS，无外部图片
- **全页双线外框 + 四角金饰**（`.sheet-frame`）：替代默认风格的 blob 色块
- **扉页式居中对称 Hero**：栏目名 kicker 带饰线、副题斜体、花饰 `❦` 分隔——替代左对齐海报式 Hero
- **描边罗马数字章节号 + 花饰 `☙────❧`**：金棕描边，替代黑色粗描边阿拉伯数字
- **组件替代对照**（类名与默认骨架一致，装饰语言更换）：
  - 贴纸 → 朱砂橡皮章（双线内框 + 印泥透感，仍保留旋转）
  - 新增封蜡印记 `.seal`（Hero 右上，径向渐变红蜡 + 虚线内圈）
  - 卡片 → 藏书票式双线卡（`outline` 内嵌双线 + 居中排布）
  - 表格 → 三线账簿表（首尾 double 边，无整块表头底色）
  - 流程条 → 铜章编号（墨绿圆章 + 金 double 外圈，中文数字）
  - 公式框 → 打字机誊写页（米黄底 + Special Elite）
  - 引用块 → 居中题词式（上下 double 边 + 大引号）
  - callout 标签 → 按語 / 箴言
  - 新增首字下沉 `.dropcap`（每章第一段）与褪色照片 `.photo`（sepia 滤镜）
- **换装守则**：类名与布局逻辑与默认骨架一致，仍只改令牌即可微调配色；但不要删掉做旧层、外框、罗马数字这些结构性装饰——它们才是这个风格的身份所在
- **投影注意**：复古投影刻意用低透明度深棕做旧，但必须保证至少一条 `box-shadow` 以 `Npx Npx 0` 实色层**开头**（`inset` 层不能放第一位），否则 `verify-html.py` 的偏移投影检查识别不到（正则要求声明以偏移层开头）。骨架中已按此写好，改样式时保持这一点
- 响应式与打印：移动端收起外框与做旧层、侧边栏折叠为顶部条；打印隐藏全部装饰层，输出干净白纸版式

