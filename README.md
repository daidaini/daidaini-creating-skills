# Daidaini's Creating Skills

一套面向 Claude Code / Zed AI Agent 等工具的自定义技能（Skills）集合，覆盖学习方法论、内容创作、HTML 交付物、离线地图可视化、产品分析与思辨、实用工具六个方向。每个技能是一个自包含目录，入口为 `SKILL.md`，可直接加载使用。

当前共 **15 个技能**。

## 技能清单

### 📚 学习方法论

| 技能 | 描述 |
|------|------|
| [build-learning-ladder](./build-learning-ladder/) | 为任意主题搭建 5 级渐进式学习阶梯，每级含掌握标准、核心概念、实操练习、常见误区和自测清单，可选输出设计感单页 HTML |
| [feyman-learning-method](./feyman-learning-method/) | 交互式费曼学习法对话——用 12 岁孩子能懂的话讲解，邀请你教回来，定位薄弱点，循环直到真正掌握 |
| [high-leverage-resources](./high-leverage-resources/) | 精选 Top 5 高杠杆学习资源（书/课/视频等）并附详细理由，再用这些资源规划 7 天学习路径 |
| [one-page-cheat-sheet](./one-page-cheat-sheet/) | 生成任意主题的一页速查表——可视化、易扫读、初学者友好，5 分钟可复习完。适用于备考、面试、会议和快速回顾 |

### ✍️ 内容创作

| 技能 | 描述 |
|------|------|
| [my-summarize](./my-summarize/) | 批量摘要工作流：读取目录下所有 `.md` 文章，每篇生成 5–8 句中文摘要，保留作者和来源链接，输出 `summarize.md`；明确要求 HTML 时自动路由到 beautiful-html |
| [my-writing](./my-writing/) | 把一个观点写成 1000–1500 字中文分析文章——一篇只处理一个核心判断，用具体场景、连续追问、换角度验证和温和共情的口吻写深写透 |

### 🎨 HTML 交付物

| 技能 | 描述 |
|------|------|
| [beautiful-html](./beautiful-html/) | 生成设计感十足、可翻页浏览的静态 HTML 知识手册，单文件自包含——定制字体、贴纸徽章、侧边栏目录和丰富组件，附 `verify-html.py` 静态校验 |
| [content-to-zen-static-html](./content-to-zen-static-html/) | 将 Markdown / 长文档整理为双击即开的单文件静态 HTML，默认「日式极简 × 侘寂 × 未来科技」视觉语言，不依赖服务器和外部库 |

### 🗺️ 地图与可视化

| 技能 | 描述 |
|------|------|
| [geographic-map-artifact](./geographic-map-artifact/) | 地图产物统一入口：按需求路由到路线图 / 分级填色图 / 两者合成模式，附数据契约与浏览器验证门槛 |
| [d3-offline-map](./d3-offline-map/) | 基于 D3.js + Natural Earth TopoJSON/GeoJSON 构建零依赖离线自定义地图（分级填色 / 自绘区域），单文件 HTML 双击即可打开 |
| [leaflet-route-map](./leaflet-route-map/) | 构建完整 Leaflet 路线图 Demo（HTML）或 Google My Maps 兼容 KML，含 OSRM 路线、标记点、本地化资源和 `convert-kml.py` 转换脚本 |

### 🔍 产品分析与思辨

| 技能 | 描述 |
|------|------|
| [product-analysis](./product-analysis/) | 通过第一性原理拆解和历史演化分析产品本质，生成以一个核心锚点洞见为中心的客户级 HTML 报告 |
| [product-mind](./product-mind/) | 以 Steve Jobs 为原型的「产品思维」角色——回答为什么做、为谁做、做到什么程度，给出 GO / NO GO / MVP 判断 |
| [attends-court](./attends-court/) | 模拟北宋朝堂讨论的结构化思辨框架——以君主主导、多角色对话的形式，从大臣、儒生到现代顾问多角度探讨议题 |

### 🛠️ 工具类

| 技能 | 描述 |
|------|------|
| [youtube-audio-downloader](./youtube-audio-downloader/) | 使用 yt-dlp + Node.js 运行时 + 远程 EJS 挑战求解器下载 YouTube 音频为 MP3，绕过机器人检测、403 错误和 n-challenge 防护 |

## 触发方式

技能的 frontmatter 决定其调用模式：

- **模型自动触发**：描述写在 `description` 中，agent 按语义匹配自动调用（如 build-learning-ladder、d3-offline-map、my-summarize）。
- **仅手动调用**：带 `disable-model-invocation: true` 的技能（attends-court、beautiful-html、feyman-learning-method、high-leverage-resources、leaflet-route-map、one-page-cheat-sheet、product-analysis、product-mind）不会被自动触发，需要显式点名使用。

## 目录结构

```
daidaini-creating-skills/
├── <skill-name>/              # 每个技能一个自包含目录
│   ├── SKILL.md               # 入口：YAML frontmatter + 工作流正文
│   ├── agents/interface.yaml  # 机器可读契约（触发词/输入输出/排除项）
│   ├── references/            # 按需加载的方法论、风格规范
│   ├── assets/ template/      # HTML 报告模板、页面骨架
│   ├── scripts/               # 数据打包、KML 转换、静态校验等辅助脚本
│   ├── evals/                 # 触发词正负例与语义评测配置
│   └── reports/               # 边界报告、风险画像、触发评测结果
├── examples/                  # 技能运行示例输出（部分历史示例已入库）
├── testing/                   # 测试产物（gitignore，勿手动编辑）
├── AGENTS.md                  # 面向所有 agent 的仓库工作指南
├── CLAUDE.md                  # Claude Code 入口（引用 AGENTS.md）
└── README.md                  # 本文件
```

## 安装使用

### Claude Code

将技能目录复制到 Claude Code 技能目录：

```bash
# macOS / Linux
cp -r <skill-name> ~/.claude/skills/

# Windows
xcopy /E /I <skill-name> %USERPROFILE%\.claude\skills\<skill-name>
```

### Zed / 通用 agent（Agent Client Protocol）

```bash
# macOS / Linux
cp -r <skill-name> ~/.agents/skills/

# Windows（目录链接，整仓一次接入）
mklink /J %USERPROFILE%\.agents\skills\daidaini-skills <本仓库路径>
```

用链接方式安装时，仓库编辑即时生效，无需重复复制。

### pi

pi 会扫描 `~/.agents/skills/` 下的 `SKILL.md`，与 Zed 安装方式相同。
