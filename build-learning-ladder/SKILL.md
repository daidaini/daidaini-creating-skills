---
name: build-learning-ladder
description: Builds a 5-level progressive learning ladder (学习阶梯) for any topic — from complete beginner to confident practitioner. Each level includes mastery standards, concepts, a hands-on exercise, common mistakes, and a self-check. Use when the user wants to learn something step-by-step, asks "how to learn X", "learning roadmap for X", "帮我拆解学X的路线", "一步步学X", "怎么学X", "从零学X", or asks for structured curriculum design, learning stages, difficulty tiers, or a "学习阶梯"/"学习路线"/"skill tree".
---

# Build Learning Ladder

## Overview

This skill transforms any learning topic into a **5-level progressive ladder** — from complete beginner to confident practitioner. The output is a practical, exercise-driven learning path that focuses on real progress, not theory overload.

## When to Use

- User mentions wanting to learn something step-by-step
- User asks "how should I learn X?" or "learning roadmap for X"
- User asks for difficulty tiers, learning stages, or a curriculum
- User says "从零学X", "怎么一步步学X", "学习路线"

**Do NOT use for:**
- Quick fact checks or definitions
- Single-session tutorials (this is a long-term learning path)
- Academic course design with formal assessments

## Preflight: Clarify the Topic

Before building the ladder, assess the user's topic. If it's too broad (e.g., "learn math", "learn programming"), narrow it first:

- Ask: "Would you like to narrow this down? For example, 'calculus for engineering' instead of 'all of math'?"
- If the user insists on keeping it broad, build the ladder around the most practical sub-path and note the scope assumption upfront.

If the topic is clear and scoped (e.g., "learn React", "learn Italian A1", "learn watercolor painting"), proceed directly.

## Domain Detection: Adapt the Ladder Style

Before writing the 5 levels, determine which domain the topic belongs to. This affects level naming, exercise style, and mistake patterns:

- **Technical skills** (coding, tools, software): emphasize build → debug → ship. Levels naturally named around projects. Exercises are "build X". Mistakes are about config, syntax, tooling.
- **Creative skills** (drawing, writing, music, design): emphasize imitation → experimentation → voice. Exercises are "copy then modify". Mistakes are about perfectionism, comparison, theory without practice.
- **Physical skills** (sports, cooking, crafts, instruments): emphasize form → fluency → flow. Exercises are about repetition and muscle memory. Mistakes are about rushing, bad posture, skipping warm-up.
- **Knowledge domains** (history, philosophy, science, theory): emphasize facts → connections → arguments. Exercises are about writing, explaining, debating. Mistakes are about passive reading, memorization without understanding, jumping to conclusions.

**If the domain is mixed** (e.g., "machine learning" — both technical and knowledge), lean into the hybrid nature. Note it explicitly: "This topic straddles technical implementation and conceptual understanding — the ladder reflects both."

## The 5-Level Structure

Build the ladder with these 5 levels. The level names below are defaults — adapt them to feel natural for the domain while keeping the intent:

| Level | Default Name | Intent |
|---|---|---|
| 1 | Complete Beginner | First exposure, zero prior knowledge |
| 2 | Basic Understanding | Grasp core concepts, can follow along |
| 3 | Practical User | Can produce real output independently |
| 4 | Problem Solver | Can debug, adapt, handle non-trivial tasks |
| 5 | Confident Practitioner | Can self-direct learning, teach others, handle ambiguity |

### Level Naming by Domain

Use these as inspiration, not prescription. The right names depend on the specific topic:

| Domain | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|---|---|---|---|---|---|
| Technical | Hello World | First Project | Real Feature | Architecture | Ship It |
| Creative | Copying | Understanding | Experimenting | Finding Voice | Expression |
| Physical | Form | Repetition | Adaptation | Flow | Teaching |
| Knowledge | Anchors | Connections | Questions | Arguments | Synthesis |

**If none of these fit**, use the default names (Complete Beginner → Confident Practitioner) — they work for everything.

## Output Format

### Opening: The Big Picture

Start with a one-paragraph orientation. Include a quick visual overview of all 5 levels so the learner sees the full path:

```markdown
## 🪜 Learning Ladder: [Topic]

*This 5-level path takes you from zero to confident practice. Each level builds on the previous one. Don't skip levels — the foundation matters more than speed.*

| Level | Name | What You'll Be Able To Do |
|---|---|---|
| 1 | [Name] | [1-line summary] |
| 2 | [Name] | [1-line summary] |
| 3 | [Name] | [1-line summary] |
| 4 | [Name] | [1-line summary] |
| 5 | [Name] | [1-line summary] |
```

### Then the 5 Levels

For each level, output **exactly these 8 sections** in order. Do not reorder, rename, or merge sections:

```markdown
### Level [N]: [Level Name]

**1. What This Level Is About**
[A 2-4 sentence paragraph. What does the learner need to understand at this stage? What's the mental model shift? Keep it warm and encouraging, not dry and academic.]

**2. Mastery Standard**
[Concrete, observable criteria. What can the learner actually DO when they've reached this level? Use "You can..." statements. Example: "You can set up a React project from scratch and build a page with 3 components."]

**3. Core Concepts & Skills**
[A focused list of 3-5 items. These are the non-negotiable things to learn at this stage. Brief explanations — one sentence each. Quality over quantity.]

**4. Milestone: Prove You're Ready**
[One clear, specific deliverable that proves this level is complete. Should be concrete enough that someone else can verify it. Example: "Record a 2-minute video of yourself cooking a dish from memory."]

**5. Hands-On Exercise / Mini Project**
[A practical exercise that applies this level's concepts. Include: what to build/do, roughly how long it should take, and what the finished result should look like. Make it specific — no vague "practice more" instructions.]

**6. Most Common Mistakes at This Level**
[3-4 common pitfalls. For each: what the mistake looks like, WHY learners make it, and a brief fix. This is one of the most valuable sections — it prevents wasted time.]

**7. Self-Check Question Before Moving On**
[One question the learner should honestly answer. If they can't answer it confidently, they should stay at this level longer. Use plain language, not an exam question. Example: "Can you explain why X happens without looking at notes?"]

**8. What's Next**
[A 1-sentence bridge to the next level. Creates anticipation and shows the path forward.]
```

### Closing: The Road Ahead

End with:

```markdown
## 🎯 The Road Ahead

[2-3 sentences of encouragement. Reinforce that progress is not linear. Remind them that returning to earlier levels is normal and healthy. Point to the next step: diving into Level 1.]
```

## Quality Guidelines

### Must Do

- **Every piece of advice must be actionable.** "Understand the fundamentals" is not actionable. "Write 10 SQL queries that join 3+ tables" is.
- **Mistakes must be real.** Don't list generic mistakes. Think about what actual beginners in this specific domain trip over.
- **Milestones must be verifiable.** A stranger should be able to look at the milestone deliverable and say "yes, you're ready for the next level."
- **Exercises must have a time estimate.** "Practice for a while" is not helpful. "This takes most learners 2-3 hours over 3 days" is.
- **Each level must build on the previous one.** Level 3 should reference concepts from Level 1 and 2. The ladder should feel connected, not like 5 separate lists.

### Must NOT Do

- **Don't over-theorize.** This is a practical climbing guide, not a textbook outline. Cut theoretical backstory unless it directly helps action.
- **Don't list 10+ concepts per level.** 3-5 is the sweet spot. If you need more, split the level.
- **Don't skip the mistakes section.** It's the most high-leverage part of the output. Learners waste 80% of their time on the same 4 mistakes.
- **Don't make levels too wide or too narrow.** Each level should take a dedicated learner roughly 1-4 weeks of part-time effort. If a level would take 3 months, split it.
- **Don't use jargon without explaining it.** At Level 1 especially, every term gets a parenthetical definition.
- **Don't write the same level twice.** If two levels have similar mastery standards or overlapping concepts, merge them or split the topic differently.
- **Don't pad with filler.** Every sentence should earn its place. If a section doesn't add real guidance for the learner, cut it.

### Output Language

- Match the user's language. If they ask in Chinese, output in Chinese. If they ask in English, output in English. If they mix, match their dominant language.
- Use a warm, coach-like tone. You're a guide, not a lecturer.
- Use markdown formatting for readability: bullet lists, bold for key terms, code blocks for commands or code snippets.

## Save Output

After generating the ladder, save it to a markdown file:

- File name: `{topic-slug}_learning_ladder.md`
- Location: current working directory
- Content: The full ladder output (opening table + 5 levels + closing)

Tell the user the file path after saving.

## Example (Abbreviated)

**User**: "我想一步步学做咖啡拉花"

**Output** (showing the opening table and Level 1 to demonstrate tone and structure):

```markdown
## 🪜 Learning Ladder: 咖啡拉花

*这条5级路径将带你从完全零基础，到能自信地在朋友面前做出漂亮拉花。每一级都建立在上一级的基础上。别跳级——基本功比速度重要得多。*

| Level | Name | What You'll Be Able To Do |
|---|---|---|
| 1 | 掌控牛奶 | 打出质地正确的奶泡，理解蒸汽打奶的物理原理 |
| 2 | 画出心形 | 在咖啡上稳定做出心形拉花，理解融合与流量控制 |
| 3 | 掌握基础图案 | 能做郁金香、树叶等3种基础图案，理解不同流速的拉花手法 |
| 4 | 复杂构图 | 能做组合图案、雕花，能根据咖啡油脂状态调整手法 |
| 5 | 自信出品 | 能稳定复现10+种图案，能诊断和修复失败拉花，能教别人 |

### Level 1: 掌控牛奶（完全新手）

**1. 这个阶段要理解什么**
拉花不是"画"上去的，而是牛奶和咖啡融合时自然形成的。在碰拉花缸之前，你需要先理解蒸汽打奶的物理原理——牛奶在加热、充气、旋转时发生了什么。这个阶段的目标不是做出图案，而是做出一缸质地正确的奶泡。

**2. 掌握标准**
- 你能稳定打出没有大气泡、表面像湿油漆一样反光的奶泡
- 你的奶泡温度始终在60-65°C之间（不用温度计也能凭手感判断）
- 你能说出打奶的三个阶段：充气、埋入、旋转

**3. 核心概念与技能**
- **充气 vs 旋转**：充气是让空气进入牛奶（发出"呲呲"声），旋转是把气泡打碎成微泡沫（无声漩涡）。先充气再旋转，不能同时做
- **牛奶温度感知**：手摸拉花缸侧壁——烫到只能碰3秒≈60°C，这就是目标温度
- **全脂奶的优势**：全脂奶的脂肪含量让泡沫更稳定、更有光泽。脱脂奶也能拉花但难度翻倍

**4. 证明你可以进入下一级的里程碑**
连续打出5缸合格的奶泡（不限拉花，只看奶泡质地）。拍一张奶泡表面对比图——应该看起来像融化了的冰淇淋，而不是洗洁精泡沫。

**5. 动手练习：30缸挑战**
这个阶段你需要打大约30缸奶才能找到手感。建议：买两桶2L全脂奶，每次练习打4-6缸，分5-7天完成。每打完一缸，倒进透明玻璃杯观察：有没有分层？有没有大气泡？表面光泽度如何？拍下最好的和最差的做对比记录。

**6. 这个阶段最常犯的错误**
- **牛奶打太烫（70°C+）**：蛋白质变性后奶泡失去甜味和光泽。听到"尖叫"声说明太烫了。解法：手不离缸壁，一觉得"烫到想放手"立刻停
- **充气太多导致泡沫过硬**：看起来像卡布奇诺的厚泡而不是拿铁的微泡。解法：充气只做3-5秒，然后把蒸汽头埋深做旋转
- **打完奶泡后放置不动**：奶泡和牛奶会分层。解法：打完奶泡后立刻开始拉花，如果不立刻用就持续摇晃拉花缸

**7. 进入下一阶段前的自测问题**
"你能不能闭着眼睛，仅凭手感和声音判断奶泡打得对不对？"

**8. 下一步**
当你打出来的奶泡倒进咖啡里不会"噗通"一声沉下去，而是自然地浮在表面、有丝绸般的光泽——你就准备好进入 Level 2，开始画心形了。
```

## Bundled Resources

This skill is self-contained and requires no external assets or scripts. The entire ladder is generated inline as formatted markdown and saved to a file.

Output file: `{topic-slug}_learning_ladder.md` in the working directory.
