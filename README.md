# Daidaini's Creating Skills

一套面向 Claude Code / Zed AI Agent 的自定义技能集合，涵盖学习方法论、内容创作、数据可视化、产品分析等多个领域。每个技能都是自包含的 `SKILL.md` 定义，可直接加载使用。

## 技能清单

### 📚 学习方法论

| 技能 | 描述 |
|------|------|
| [20-hour-focus-learning](./20-hour-focus-learning/) | 基于 80/20 原则的 20 小时（10 节 × 2 小时）加速学习计划，含逐节路线图、练习和结业项目 |
| [build-learning-ladder](./build-learning-ladder/) | 为任意主题搭建 5 级渐进式学习阶梯，每级含掌握标准、核心概念、实操练习、常见误区和自测清单 |
| [feyman-learning-method](./feyman-learning-method/) | 交互式费曼学习法对话——用 12 岁孩子能懂的话讲解，邀请你教回来，定位薄弱点，循环直到真正掌握 |
| [high-leverage-resources](./high-leverage-resources/) | 精选 Top 5 高杠杆学习资源（书/课/视频等）并附详细理由，再用这些资源规划 7 天学习路径 |
| [one-page-cheat-sheet](./one-page-cheat-sheet/) | 生成任意主题的一页速查表——可视化、易扫读、初学者友好，5 分钟可复习完。适用于备考、面试、会议和快速回顾 |

### ✍️ 内容创作

| 技能 | 描述 |
|------|------|
| [my-summarize](./my-summarize/) | 批量摘要工作流：读取目录下所有 `.md` 文章，每篇生成 5–8 句中文摘要，保留作者和来源链接，输出为 `summarize.md` |
| [my-writing](./my-writing/) | 把一个观点写成 1000–1500 字中文分析文章——一篇只处理一个核心判断，用具体场景、连续追问、换角度验证和温和共情的口吻写深写透 |
| [tiaowu-writing-style](./tiaowu-writing-style/) | 模仿网文作者「跳舞」的风格创作小说——幽默修仙、腹黑主角、西式黑暗奇幻或权谋叙事 |

### 🗺️ 可视化与地图

| 技能 | 描述 |
|------|------|
| [d3-offline-map](./d3-offline-map/) | 基于 D3.js + Natural Earth TopoJSON/GeoJSON 构建零依赖离线自定义地图（分级填色 / 自绘区域），单文件 HTML 双击即可打开 |
| [leaflet-route-map](./leaflet-route-map/) | 构建完整的 Leaflet 路线图 Demo（HTML）或 Google My Maps 兼容的 KML，含测试路线数据、标记点、路线折线、本地 Leaflet 资源和浏览器验证 |
| [svg-generation](./svg-generation/) | 从结构化 JSON 或自然语言生成 SVG 图表——三条路径：LLM 直出（简单图标）、JSON + 布局引擎（流程图/架构图）、视觉管线（复杂插画） |
| [beautiful-html](./beautiful-html/) | 生成设计感十足、杂志级别的静态 HTML 知识手册，单文件自包含——定制字体、偏移阴影、贴纸徽章、侧边栏目录和丰富组件 |

### 🔍 分析与研究

| 技能 | 描述 |
|------|------|
| [product-analysis](./product-analysis/) | 通过第一性原理拆解和历史演化分析产品本质，生成以一个核心锚点洞见为中心的客户级 HTML 报告 |
| [attends-court](./attends-court/) | 模拟北宋朝堂讨论的结构化思辨框架——以君主主导、多角色对话的形式，从大臣、儒生到现代顾问多角度探讨议题 |

### 🛠️ 工具类

| 技能 | 描述 |
|------|------|
| [youtube-audio-downloader](./youtube-audio-downloader/) | 使用 yt-dlp + Node.js 运行时 + 远程 EJS 挑战求解器下载 YouTube 音频为 MP3，绕过机器人检测、403 错误和 n-challenge 防护 |

## 目录结构

```
daidaini-creating-skills/
├── 20-hour-focus-learning/    # 20小时聚焦学习
├── attends-court/             # 朝议思辨
├── beautiful-html/            # 精美HTML生成
├── build-learning-ladder/     # 学习阶梯
├── d3-offline-map/            # D3离线地图
├── examples/                  # 技能运行示例输出
├── feyman-learning-method/    # 费曼学习法
├── high-leverage-resources/   # 高杠杆资源
├── leaflet-route-map/         # Leaflet路线图
├── my-summarize/              # 批量摘要
├── my-writing/                # 深度写作
├── one-page-cheat-sheet/      # 一页速查表
├── product-analysis/          # 产品分析
├── svg-generation/            # SVG生成
├── testing/                   # 测试输出（自动生成，勿手动编辑）
├── tiaowu-writing-style/      # 跳舞文风
├── youtube-audio-downloader/  # YouTube音频下载
├── CLAUDE.md                  # Claude Code 配置
└── README.md                  # 本文件
```

## 使用方式

### 在 Claude Code 中使用

将技能目录复制到 Claude Code 的技能目录下：

```bash
# macOS
cp -r <skill-name> ~/.claude/skills/

# Windows
xcopy /E /I <skill-name> %APPDATA%\Claude\skills\<skill-name>
```

重启 Claude Code 后即可通过触发词调用对应技能。

### 在 Zed 中使用

将技能目录放置到 Zed 的 agent skills 目录下：

```bash
# Windows
cp -r <skill-name> ~/.agents/skills/
```

## 约定

- 每个技能在独立目录中，入口为 `SKILL.md`，含 YAML frontmatter（name, description 等）
- 技能目录自包含所需的 `assets/`、`references/` 等资源
- 输出文件默认保存到当前工作目录
- `testing/` 目录存放测试生成的文件，不纳入版本管理
