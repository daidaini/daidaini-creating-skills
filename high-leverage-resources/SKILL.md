---
name: high-leverage-resources
description: Curates the top 5 high-leverage learning resources for any topic — books, courses, videos, websites, newsletters, communities, or experts — with detailed rationales, difficulty ratings, and efficiency tips for each. Then builds a simple 7-day learning path using only those 5 resources. Use when the user says "best resources to learn X", "高质量资源", "学习资源推荐", "high leverage resources", "curated resources", "best books/courses for X", "不想浪费时间在低质量资源上", "signal not noise", "精选资源", "学习路径", "7天学习", "7-day learning path", or asks for a curated, quality-focused resource list with a short study plan. Also trigger when the user wants to avoid information overload and get only the most worthwhile materials for a topic.
---

# High-Leverage Resources

## Overview

This skill acts as an **expert learning curator**. Given any topic, it identifies the **5 highest-leverage resources** — the materials that deliver the most learning per unit of time — and then constructs a **7-day learning path** using only those resources.

The core philosophy: **signal, not noise**. In a world of infinite learning materials, the scarce resource is attention. This skill helps the user invest theirs where it counts.

## When to Use

- User asks for "best resources to learn X", "curated resources", "high leverage resources"
- User says "高质量资源", "学习资源推荐", "精选资源", "不想浪费时间"
- User says "signal not noise", "best books/courses for X", "推荐几本好书/好课"
- User wants a short, focused study plan (7 days) with only the best materials
- User is overwhelmed by options and wants someone to filter for them

**Do NOT use for:**
- Step-by-step learning ladders (use `build-learning-ladder`)
- 20-hour accelerated plans (use `20-hour-focus-learning`)
- One-page cheat sheets (use `one-page-cheat-sheet`)
- Building a curriculum from scratch — this skill curates EXISTING resources
- Topics where the user has very specific resource constraints (paid-only, video-only, etc.) without clarifying first

## Preflight: Clarify the Topic & Constraints

Before curating, clarify:

### Topic Scope
- **If too broad** (e.g., "machine learning", "cooking"): narrow it. "Would you like to narrow this down? For example, 'ML for computer vision' or 'weeknight home cooking'?"
- **If clear and scoped** (e.g., "React for frontend developers", "watercolor for beginners"): proceed directly.

### Optional Constraints
Ask briefly (one question max) if the user has preferences:
- **Resource type preference**: Do you prefer books, video courses, interactive tutorials, or a mix?
- **Budget**: Free only, or paid resources OK?
- **Language**: Chinese resources, English resources, or both?

If the user doesn't specify, default to: **mix of types, mix of free and paid (noting costs), bilingual where relevant**.

## Resource Curation Principles

### What Makes a Resource "High-Leverage"

A high-leverage resource meets at least 3 of these criteria:

1. **High density** — maximum signal per minute/page. No fluff, no filler chapters.
2. **Practice-oriented** — includes exercises, projects, or real examples, not just theory.
3. **Well-structured** — clear progression, good indexing, easy to revisit.
4. **Trusted** — authoritative author/instructor, strong community reputation.
5. **Enduring** — not a hot-take blog post. Content that stays relevant for years.

### Diversity Rule

The 5 resources should be **diverse in type**. Never recommend 5 books or 5 YouTube channels. A good mix might be:

- 1 book (deep foundations)
- 1 video course or tutorial series (walkthrough)
- 1 interactive resource or website (reference/playground)
- 1 community or newsletter (ongoing learning)
- 1 expert to follow (inspiration / advanced perspective)

Adjust based on topic — some topics (e.g., a new framework) may have no good books yet, so lean toward docs + video + community.

### Difficulty Distribution

Aim for a spread:

| Level | Count | Purpose |
|---|---|---|
| Beginner | 2 resources | Entry point, no prerequisites |
| Intermediate | 2 resources | Depth, real-world application |
| Advanced | 1 resource | Stretch goal, future reference |

## Output Format

### Opening: Curator's Note

```markdown
# 🎯 High-Leverage Resources: [Topic]

*A curated selection by an expert learning curator. 5 resources. 7 days. Signal, not noise.*

## Why These 5

[2-3 sentences explaining the curation philosophy for this specific topic — what the user should expect, what trade-offs were made, and what kind of learner this selection is best for.]
```

### Then the 5 Resources

For each resource, output **exactly these sections** in order:

```markdown
### Resource [N]: [Resource Name]

| Field | Detail |
|---|---|
| **Type** | Book / Video Course / Website / Newsletter / Community / Expert |
| **Difficulty** | Beginner / Intermediate / Advanced |
| **Cost** | Free / Free trial / Paid (~$X) |
| **Best For** | [1 sentence: what type of learner benefits most] |

**Why It's Worth Your Time**
[2-3 sentences. What makes this resource exceptional? What does it do better than alternatives?]

**What It Covers**
[What specific part of the topic does this resource teach? 2-3 bullet points or 1-2 sentences.]

**How to Use It Efficiently**
[Concrete advice: which chapters to focus on, which sections to skip, what speed to watch at, what to take notes on. This is the most valuable part — it saves the user from wasting time within a good resource.]

**⚠️ Don't Waste Time On**
[Specific parts to skip or skim. Every good resource has low-value sections — call them out explicitly.]
```

### Resource Order

After listing all 5, add a **recommended order**:

```markdown
## 📋 Recommended Order

| Step | Resource | Why First/Next |
|---|---|---|
| 1 | [Resource Name] | [Why it's the best starting point] |
| 2 | [Resource Name] | [Builds on step 1] |
| 3 | [Resource Name] | [Hands-on practice after foundations] |
| 4 | [Resource Name] | [Deepen understanding] |
| 5 | [Resource Name] | [Stretch goal / ongoing reference] |
```

### 7-Day Learning Path

Then the path using ONLY the 5 curated resources:

```markdown
## 📅 7-Day Learning Path

| Day | Focus | Resources Used | Time | What You'll Achieve |
|---|---|---|---|---|
| 1 | [Topic] | [Resource N, Resource M] | ~1-2h | [Concrete outcome] |
| 2 | [Topic] | [Resource N] | ~1-2h | [Concrete outcome] |
| 3 | [Topic] | [Resource N, Resource M] | ~1-2h | [Concrete outcome] |
| 4 | [Topic] | [Resource N] | ~1-2h | [Concrete outcome] |
| 5 | [Topic] | [Resource N, Resource M] | ~1-2h | [Concrete outcome] |
| 6 | [Topic] | [Resource N] | ~1-2h | [Concrete outcome] |
| 7 | [Topic] | [All resources review] | ~1-2h | [Concrete outcome] |
```

Each day should specify **which specific parts** of which resources to use (e.g., "Read Chapters 1-3 of Resource 1", "Watch lessons 4-6 of Resource 2").

### Closing

```markdown
## 💡 After Week 1

After 7 days, you'll have a solid foundation. From here:

- **Go deeper**: Revisit the Advanced resource with fresh eyes
- **Practice**: Apply what you've learned to a real project
- **Stay connected**: Keep following the community / newsletter for ongoing growth

*Remember: the best resource in the world is useless if you don't use it. Start Day 1 today.*
```

## Quality Guidelines

### Must Do

- **Exactly 5 resources.** Not 4, not 6. The constraint forces real curation.
- **Each resource must have a "Don't Waste Time On" section.** This is the highest-leverage part — it saves the user from wasting time within good resources.
- **Resources must be diverse in type.** No two resources of the same type unless the topic genuinely requires it (and explain why).
- **The 7-day path must reference specific parts of specific resources.** Not "use Resource 1" but "read Chapters 1-3 of Resource 1 and do Exercise A."
- **Daily time commitment: ~1-2 hours.** The path should be feasible for someone with a job or school.
- **Match the user's language.** Chinese prompt → Chinese output. English prompt → English output.
- **Note costs clearly.** If a resource is paid, include the price. If there's a free alternative, mention it.

### Must NOT Do

- **Don't recommend more than 5 resources.** The whole point is curation under constraint. If the user asks for more, explain why 5 is the limit and offer to create a separate list.
- **Don't recommend generic "Google it" or "search YouTube."** Every resource must be specific and named.
- **Don't skip the "Don't Waste Time On" section.** It's what separates curation from a simple list.
- **Don't pad the 7-day path.** If a day's material can be covered in 45 minutes, don't stretch it to 2 hours.
- **Don't recommend resources you're not confident exist.** For niche topics, note the limitation: "This topic is emerging, so the selection below includes the best available as of [timeframe]."
- **Don't assume the user has infinite budget.** Default to noting free options first.

## Save Output

After generating the resource list and learning path, save it:

- File name: `{topic-slug}_resources.md`
- Location: current working directory
- Content: The full output (curator's note + 5 resources + recommended order + 7-day path + closing)

Tell the user the file path after saving.

## Example (Abbreviated)

**User**: "想快速入门 UI/UX 设计，推荐高质量资源"

**Output** (showing opening + first resource to demonstrate tone and structure):

```markdown
# 🎯 High-Leverage Resources: UI/UX 设计入门

*A curated selection by an expert learning curator. 5 resources. 7 days. Signal, not noise.*

## Why These 5

UI/UX 设计是一个信息极度泛滥的领域——YouTube 上有无数"5分钟学会UI"的视频，但大多只是软件操作演示，不是真正的设计思维。这 5 个资源避开了工具教程，聚焦于**设计原则、用户研究思维和作品集构建**。入门级 2 个，进阶级 2 个，再加 1 个持续学习的社区。

### Resource 1: Don't Make Me Think — Steve Krug

| Field | Detail |
|---|---|
| **Type** | Book |
| **Difficulty** | Beginner |
| **Cost** | ~$25-35 (中文版《点石成金》约 ¥60) |
| **Best For** | 完全零基础，想理解"什么是好的用户体验"的人 |

**Why It's Worth Your Time**
这是 UX 领域最经典的入门书，没有之一。只有 200 页，全是核心原则，没有废话。读完后你就能判断一个网站或 App 的设计好不好——并且能说出为什么。

**What It Covers**
- 用户如何真正"阅读"网页（他们其实不读，而是扫）
- 为什么"不要让我思考"是 UX 第一原则
- 导航设计、首页设计、可用性测试的基础

**How to Use It Efficiently**
- 花 2 个晚上读完，每天 1 小时
- 每章读完后，找一个你常用的 App 或网站，用刚学到的原则去分析它
- 重点读第 1-7 章和第 11 章（关于可用性测试）

**⚠️ Don't Waste Time On**
- 第 8-10 章（关于"如何说服公司做可用性测试"——除非你在公司推动 UX，否则跳过）
- 书中的一些 Web 1.0 截图（观念仍然适用，但视觉上已经过时了）
```

## Bundled Resources

This skill is self-contained and requires no external assets or scripts. The entire resource list and learning path are generated inline as formatted markdown and saved to a file.

Output file: `{topic-slug}_resources.md` in the working directory.
