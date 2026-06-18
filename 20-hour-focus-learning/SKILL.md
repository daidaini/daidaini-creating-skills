---
name: 20-hour-focus-learning
description: Creates a focused 20-hour (10 sessions × 2 hours) accelerated learning plan for any topic — based on the 80/20 principle. Identifies the most impactful 20% of concepts that deliver 80% of real-world results, then structures them into a session-by-session roadmap with practice exercises, review questions, and a final capstone project. Use when the user says "20小时学会", "20 hours to learn", "想快速入门", "accelerated learning", "快速学习计划", "crash course", "20-hour challenge", "how to learn X fast", "从零快速上手", "速成计划", "高效学习路线", or asks for a structured short-term learning plan with limited time commitment. Also trigger when the user wants to prioritize the most useful parts of a topic and skip the rest, or says "我只想学最有用的" / "先学最核心的" / "给我一个20小时的学习计划".
---

# 20-Hour Focus Learning

## Overview

This skill creates a **20-hour accelerated learning plan** — 10 sessions of 2 focused hours each — based on the **Pareto Principle (80/20)**. Instead of trying to cover everything, it identifies the 20% of concepts that deliver 80% of real-world utility, and structures them into a practical, session-by-session roadmap.

This is NOT a comprehensive curriculum. It's a **最短路径 (shortest path)** to functional competence — designed for people who want to go from zero to "can actually use it" in 20 focused hours.

## When to Use

- User says "20 hours to learn X", "crash course", "accelerated learning"
- User says "想快速入门", "20小时学会", "速成计划", "高效学习路线"
- User says "我只想学最有用的", "先学最核心的", "从零快速上手"
- User asks for a structured short-term learning plan with limited time
- User wants to prioritize the most impactful parts of a topic

**Do NOT use for:**
- Deep, comprehensive mastery paths (use `build-learning-ladder` instead)
- One-page quick references (use `one-page-cheat-sheet` instead)
- Topics that are inherently dangerous without full training (surgery, aviation, heavy machinery)
- Single-session tutorials or quick tips

## Preflight: Clarify the Topic

Before generating the plan, assess the topic:

- **If the topic is too broad** (e.g., "learn programming", "learn math", "learn business"): narrow it. "Would you like to narrow this down? For example, 'build a web app with Python' instead of 'all of programming'?"
- **If the user insists on keeping it broad**: build the plan around the most practical sub-path and note the scope assumption upfront: "This plan focuses on [sub-path] because it gives the fastest path to real results. If you meant something else, let me know."
- **If the topic is clear and scoped** (e.g., "React for frontend", "watercolor portraits", "SQL for data analysis"): proceed directly.

**Special case — topics with prerequisites**: If the topic requires foundational knowledge the user likely doesn't have (e.g., "machine learning" without knowing Python), note the prerequisite and either (a) include a brief pre-session 0, or (b) recommend a prerequisite topic first.

## Domain Adaptation

Adjust the plan's emphasis based on topic type:

| Domain | 80/20 Focus | Practice Style | Final Project Type |
|---|---|---|---|
| **Technical** (code, tools, software) | Most-used commands/APIs, common patterns, debug workflow | Build a small working feature | A working app/script/tool |
| **Creative** (drawing, music, writing) | Core techniques, imitation of masters, muscle memory | Copy → modify → create | A finished piece/performance |
| **Physical** (sports, cooking, crafts) | Form, key movements, safety, one reliable technique | Deliberate repetition with feedback | A completed dish/make/round |
| **Knowledge** (theory, history, science) | Key frameworks, causal chains, why-it-matters | Explain, debate, write | A written analysis or presentation |
| **Language** (spoken/written) | Most common 500 words, core grammar patterns, survival phrases | Speak/write from day 1 | A real conversation or short text |
| **Business/Soft Skills** | Mental models, decision frameworks, common scenarios | Roleplay, case study analysis | A real application (negotiation, pitch, plan) |

## The 20-Hour Framework

### Core Philosophy

The 20-hour plan is built on four principles:

1. **Deconstruct the skill** — identify the 20% that matters
2. **Learn enough to self-correct** — get just enough theory to know when you're wrong
3. **Remove practice barriers** — eliminate friction (setup, tools, prep time)
4. **Practice at least 10 hours** — the first 10 hours are the steepest part of the curve

### Session Structure (10 × 2 hours)

Each session follows a fixed rhythm:

| Time | Activity | Purpose |
|---|---|---|
| 0:00–0:10 | Review previous session's review questions | Spaced repetition + warm-up |
| 0:10–0:30 | Learn new concepts (minimal theory) | Just enough to practice |
| 0:30–1:30 | Hands-on practice / mini project | The real learning happens here |
| 1:30–1:50 | Troubleshoot, refine, repeat | Deepen understanding |
| 1:50–2:00 | Review session's 5 questions + preview next | Consolidate + set context |

## Output Format

### Opening: The Big Picture

Start with an orientation that sets expectations:

```markdown
# 🎯 20-Hour Focus Plan: [Topic]

*10 sessions × 2 focused hours = functional competence. Not mastery — but enough to use it for real.*

## The 80/20 Core

The **20% of this topic** that delivers **80% of real-world results**:

1. **[Core concept 1]** — [1-line why it matters]
2. **[Core concept 2]** — [1-line why it matters]
3. **[Core concept 3]** — [1-line why it matters]
4. **[Core concept 4]** — [1-line why it matters]
5. **[Core concept 5]** — [1-line why it matters]

*Everything else can wait until after these are solid.*

## Session Overview

| Session | Topic | Outcome |
|---|---|---|
| 1 | [Topic] | [What you'll be able to do] |
| 2 | [Topic] | [What you'll be able to do] |
| 3 | [Topic] | [What you'll be able to do] |
| 4 | [Topic] | [What you'll be able to do] |
| 5 | [Topic] | [What you'll be able to do] |
| 6 | [Topic] | [What you'll be able to do] |
| 7 | [Topic] | [What you'll be able to do] |
| 8 | [Topic] | [What you'll be able to do] |
| 9 | [Topic] | [What you'll be able to do] |
| 10 | [Topic] | [What you'll be able to do] |
| **Final** | Capstone Project | Prove you can use it |
```

### Then the 10 Sessions

For each session, output **exactly these sections** in order:

```markdown
### Session [N]: [Session Title]

**🎯 Learning Objective**
[1-2 sentences. What will the learner be able to do after this session?]

**📚 Key Concepts**
- **[Concept]**: 1-sentence explanation with real-world context
- **[Concept]**: 1-sentence explanation with real-world context
- **[Concept]**: 1-sentence explanation with real-world context
[3-5 concepts max. Focus on the minimum viable knowledge to start practicing.]

**✋ Practice Exercise**
[A concrete exercise that takes about 45-60 minutes. Include: what to do, what the output should look like, and a hint for when they get stuck. Make it specific — not "practice more" but "build X that does Y".]

**📖 Recommended Resource**
[1 resource only — prioritize free. Name + 1-line why it's good for THIS session. If no free option exists, note the cost.]

**✅ After This Session**
[What the learner can confidently do now. 1-2 sentences. Concrete and verifiable.]

**❓ Review Questions**
1. [Question 1]?
2. [Question 2]?
3. [Question 3]?
4. [Question 4]?
5. [Question 5]?

[Questions should test the session's key concepts. Mix recall ("what is X?") and application ("how would you do Y?").]
```

### Final Project

After session 10, include the capstone:

```markdown
## 🏆 Final Project: [Project Name]

**Goal**: [1 sentence — what does this project prove?]

**Scenario**: [Real-world context. 2-3 sentences describing the situation.]

**Requirements**:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
- [Requirement 4]
- [Requirement 5]

**Estimated Time**: [2-4 hours, spread across 1-2 sessions]

**Success Criteria**: [How to know it's done. Concrete and verifiable. Example: "The app loads data from an API and displays it in a table with search and filter."]

**Stretch Goal** (optional): [An extra challenge if the learner finishes early.]
```

### Closing

```markdown
## 📌 What's Next

After 20 hours, you won't be an expert — but you'll be **functional**. You'll know enough to:
- [Real-world capability 1]
- [Real-world capability 2]
- [Real-world capability 3]

From here, the fastest path to mastery is **real projects**. Pick something you actually need to do, and use it. Come back when you hit a wall — that's where deeper learning begins.

*Remember: the first 20 hours are about building confidence and momentum. The next 200 are about depth. But you can't get to 200 without the first 20.*
```

## Quality Guidelines

### Must Do

- **Every session must have a hands-on exercise.** Theory-only sessions are not allowed. If a session is purely conceptual, merge it with a practical session.
- **The 80/20 core must be explicit and specific.** Not "learn the basics" but "learn these 5 specific concepts that cover 80% of real usage."
- **Each session builds on the previous one.** Session 3 should reference or require concepts from session 1-2. The plan should feel cumulative, not like 10 separate lessons.
- **Resources must be 1 per session max.** The learner has 2 hours — they don't have time to evaluate 5 resources. Pick the single best one.
- **Review questions must test real understanding**, not trivia. "What is X?" is fine. "When would you use X instead of Y?" is better.
- **The final project must integrate multiple sessions' learning.** It's the proof that the 20 hours worked.
- **Match the user's language.** Chinese prompt → Chinese output. English prompt → English output.

### Must NOT Do

- **Don't try to cover everything.** The whole point is 20% of the topic. If a concept isn't in the top 20% most useful, cut it.
- **Don't assign more than 2 hours per session.** The plan is 20 hours total. If a session needs more, split it into two sessions.
- **Don't skip the review questions.** They're the only way the learner knows they're actually learning, not just reading.
- **Don't recommend paid resources without noting the cost.** Free first, paid only if there's no good free alternative.
- **Don't make the final project optional.** It's the capstone — the proof point that the 20 hours delivered.
- **Don't pad with filler.** Every sentence should earn its place. If a section doesn't directly help the learner make progress, cut it.

## Save Output

After generating the plan, save it:

- File name: `{topic-slug}_20hour_plan.md`
- Location: current working directory
- Content: The full plan (80/20 core + session overview table + 10 sessions + final project + closing)

Tell the user the file path after saving.

## Example (Abbreviated)

**User**: "20小时学会 Python 基础，用来处理 Excel 数据"

**Output** (showing opening + Session 1 to demonstrate tone and structure):

```markdown
# 🎯 20-Hour Focus Plan: Python for Excel Data Processing

*10 sessions × 2 focused hours = functional competence. Not mastery — but enough to use it for real.*

## The 80/20 Core

The **20% of Python** that delivers **80% of what you need for Excel data work**:

1. **Data types & variables** — everything in Python starts here
2. **Lists & dicts** — the two structures you'll use for 90% of data work
3. **Loops & conditionals** — automate repetitive Excel tasks
4. **Functions** — write once, reuse everywhere
5. **pandas basics** — read, filter, group, export — the Excel killer

## Session Overview

| Session | Topic | Outcome |
|---|---|---|
| 1 | Python Setup & First Steps | Write and run your first Python script |
| 2 | Variables & Data Types | Store and manipulate data |
| 3 | Lists & Loops | Process multiple values at once |
| 4 | Conditionals & Logic | Make decisions in code |
| 5 | Functions | Package reusable logic |
| 6 | Reading & Writing Files | Load and save data |
| 7 | pandas: Loading Data | Read Excel/CSV files into Python |
| 8 | pandas: Filtering & Sorting | Find and organize data |
| 9 | pandas: Grouping & Aggregation | Summarize data like pivot tables |
| 10 | pandas: Export & Automation | Write results back to Excel |
| **Final** | Real Excel Report Automation | Build a script that cleans, analyzes, and exports a real dataset |

### Session 1: Python Setup & First Steps

**🎯 Learning Objective**
Set up Python on your computer and write your first script that prints output and does basic math.

**📚 Key Concepts**
- **Python is an interpreter**: you write code in a .py file, and Python reads it line by line — no compilation needed
- **`print()` is your best friend**: it shows output, and you'll use it constantly to check what your code is doing
- **Variables store values**: `price = 100` means "put the number 100 into a box named price"
- **Basic math works like Excel**: `+`, `-`, `*`, `/` all do what you expect

**✋ Practice Exercise**
Install Python (python.org), open VS Code or any text editor, and write a script that:
1. Creates a variable `sales = 1500`
2. Creates a variable `cost = 800`
3. Calculates `profit = sales - cost` and prints it
4. Calculates `margin = profit / sales` and prints it as a percentage

**📖 Recommended Resource**
Python.org's official tutorial — just the first 3 pages. Free, authoritative, and directly from the source.

**✅ After This Session**
You can install Python, write a script with variables and math, and run it from the terminal. You've done what Excel does with formulas — but in code.

**❓ Review Questions**
1. What does `print()` do?
2. What's the difference between `sales = 1500` and `1500 = sales`?
3. If `a = 10` and `b = 3`, what is `a / b`?
4. Why do we use variables instead of typing numbers directly?
5. What happens when you run a .py file?
```

## Bundled Resources

This skill is self-contained and requires no external assets or scripts. The entire plan is generated inline as formatted markdown and saved to a file.

Output file: `{topic-slug}_20hour_plan.md` in the working directory.
