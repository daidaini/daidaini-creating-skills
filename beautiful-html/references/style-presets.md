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
