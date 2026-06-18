---
name: feyman-learning-method
description: Engages the user in an interactive Feynman Technique dialogue — first explains any topic in ultra-simple language (as if to a 12-year-old), then invites the user to teach it back, identifies gaps/mistakes/confusions, re-teaches only the weak parts, and loops until the user's explanation is simple, accurate, and complete. Ends with a saved final summary note. Use when the user says "费曼学习法", "Feynman technique", "用费曼法教我", "深入理解X", "像教小孩一样解释", "explain X to me like I'm 12", "ELI12", "我想真正理解X", "互动学习", "teaching back", "learn by teaching", or asks to deeply understand a concept through iterative explanation and feedback.
---

# Feynman Learning Method

## Overview

This skill implements the **Feynman Technique** — one of the most effective methods for achieving deep understanding, named after Nobel physicist Richard Feynman. The core idea is deceptively simple: **if you can't explain something simply, you don't truly understand it.**

The skill runs an **interactive dialogue loop**:

1. **Teach** — Claude explains the topic in ultra-simple language (as if to a 12-year-old)
2. **Teach-back** — The user explains it back in their own words
3. **Diagnose** — Claude reviews the explanation, points out gaps/errors/confusions
4. **Re-teach** — Only the weak parts are re-explained
5. **Repeat** — The loop continues until the user's explanation is simple, accurate, and complete
6. **Save** — A final clean summary is saved as notes

This is **not a lecture**. It's a coaching conversation where the user does the heavy lifting of understanding, and Claude guides, corrects, and fills gaps.

## When to Use

- User says "费曼学习法", "Feynman technique", "用费曼法"
- User says "像教小孩一样解释X", "explain X to me like I'm 12", "ELI12"
- User says "我想真正理解X", "深入理解X", "帮我吃透X"
- User asks to learn through "teaching back", "learn by teaching"
- User wants an interactive, iterative explanation with feedback

**Do NOT use for:**
- Quick definitions or fact lookups
- One-pass explanations (a single explanation without the teach-back loop is just a tutorial)
- Topics the user needs a comprehensive curriculum on (use `build-learning-ladder`)
- Resource recommendations (use `high-leverage-resources`)

## Preflight: Clarify the Topic

Before starting, assess the topic:

- **If the topic is vague or too broad** (e.g., "quantum physics", "economics", "AI"): ask the user to narrow it — "That's a big topic. Can you narrow it down? For example, 'how quantum entanglement works' or 'supply and demand in economics'."
- **If the topic is clear** (e.g., "how blockchain works", "the carbon cycle", "REST API design"): proceed directly to Phase 1.
- **If the user's intent is unclear** (e.g., they want understanding vs. they want practical application): ask briefly.

## The Feynman Loop

### Phase 1: Initial Explanation (Claude Teaches)

Explain the topic as if the user is a 12-year-old. This sets the model for the entire dialogue.

**Rules for the initial explanation:**

- Use simple vocabulary. If you must use a technical term, define it immediately in plain language.
- Use at least one **real-life analogy** (something a 12-year-old has experienced).
- Use at least one **concrete example** from everyday life.
- Keep it to **3-5 short paragraphs**. If it needs more, the topic is too broad.
- End with a **one-sentence summary** — the "if you remember one thing" line.

**Tone**: Warm, patient, encouraging. Like a favorite teacher, not a professor.

**Format:**

```markdown
## 🧑‍🏫 Let Me Explain: [Topic]

[3-5 paragraph explanation using simple words, analogies, and examples.]

**In one sentence**: [The core idea boiled down.]

---

Now it's your turn! ✋

**In your own words, tell me what [topic] is all about.**

Write it like you're explaining it to a friend who knows nothing about it. Don't worry about getting it perfect — this is how we find out what really clicked and what didn't.
```

### Phase 2: User Teaches Back

The skill must **wait for the user's response**. Do not proceed until the user has provided their explanation.

If the user is hesitant or says "I don't know where to start", prompt gently: "That's totally fine. Just start with whatever you remember. What's the first thing that comes to mind?"

### Phase 3: Diagnose & Review

When the user provides their explanation, review it against these dimensions:

1. **Accuracy** — Is anything factually wrong?
2. **Completeness** — Are there important concepts missing?
3. **Simplicity** — Could parts of their explanation be phrased more clearly?
4. **Connections** — Do they link concepts together, or just list facts?
5. **Jargon** — Are they using technical terms without really understanding them?

**Response structure:**

```markdown
## 🔍 Let Me Review Your Explanation

### ✅ What You Got Right
- [Specific thing they explained correctly]
- [Another correct point]
- [Another one]

### 🔧 What Needs Work

**1. Gap / Error / Confusion: [Name it]**
You said: "[Quote their words or paraphrase their understanding]"
The issue is: [What's wrong or missing — in one sentence]
Let me clarify: [Re-teach ONLY this part in 2-3 sentences]

**2. Gap / Error / Confusion: [Name it]**
[Same structure]

### 📝 Missing Pieces
- [One concept they completely missed]
- [Another one, if applicable]

---

Now try again! 🔄

**Re-explain [topic] to me**, this time making sure to include [the thing they missed] and clarify [the thing they got wrong].

You're getting closer!
```

**Important rules for diagnosis:**

- Always lead with what they got RIGHT. This builds confidence.
- Never re-teach the entire topic — only the parts that need work.
- Be specific about what was wrong. Don't say "it's not clear" — say "you said X, but actually it's Y because..."
- If the user is genuinely confused, introduce a NEW example or analogy (not the same one again).
- If the user's explanation is very wrong in a fundamental way, don't list every error — focus on the 1-2 biggest misunderstandings first.

### Phase 4: Repeat the Loop

Continue the loop (Phases 2-3) until the user's explanation meets all four completion criteria:

1. **Simple** — Could a 12-year-old understand it?
2. **Accurate** — No factual errors
3. **Complete** — All key concepts covered, no major gaps
4. **Connected** — Ideas link together, not just a list of isolated facts

**Typical number of loops**: 2-4 iterations. If it goes beyond 5, the topic may be too broad or the user may need a different approach (consider suggesting a narrower scope).

**To keep the loop going:**

- Each iteration should feel like progress. If the user is stuck on the same issue, change approach: use a different analogy, a drawing (ASCII art), or a concrete "imagine this scenario..."
- If the user makes only a small improvement, acknowledge it: "You clarified X much better this time. Now let's work on Y."
- Don't rush. Let the user sit with the material between iterations if needed.

### Phase 5: Final Summary

When the user's explanation meets the criteria, congratulate them and provide a clean, saveable summary:

```markdown
## 🎉 You've Got It!

Your explanation is now simple, accurate, and complete. Here's your final summary — save this as your study notes:

---

# [Topic] — Study Notes

## What It Is
[A clean, 2-3 sentence explanation in simple language]

## Core Idea (One Sentence)
[The one-sentence version]

## Key Concepts
- [Concept 1]: [1-line explanation]
- [Concept 2]: [1-line explanation]
- [Concept 3]: [1-line explanation]

## Best Analogy
[The analogy that worked best during the session]

## Common Pitfall to Avoid
[The biggest mistake or confusion point you worked through]

## In 30 Seconds (Elevator Pitch)
[A version you can say out loud in 30 seconds]

---

*Generated via the Feynman Technique — teach it to learn it.*
```

## Quality Guidelines

### Must Do

- **Wait for the user's response after the initial explanation.** This is an interactive dialogue, not a monologue. Do not produce the entire loop in one output.
- **Lead with what they got right.** The Feynman Technique only works when the learner feels safe to be wrong. Always start feedback with genuine praise.
- **Re-teach only the broken parts.** Never re-explain the entire topic. The point is targeted gap-filling.
- **Use different analogies when the first one didn't land.** If a water analogy failed, try a money analogy or a sports analogy.
- **Be warmly honest about gaps.** Soft truth: "You've got the main idea, but there's one thing that's not quite right." Not harsh, but never misleading.
- **Match the user's language.** Chinese input → conduct the entire dialogue in Chinese. English → English.

### Must NOT Do

- **Don't lecture.** The Feynman Technique is about the learner teaching back. If Claude is doing 80% of the talking, something is wrong.
- **Don't rush through the loop.** The user needs time to think and write. Don't jump to the conclusion after one iteration unless their explanation is genuinely solid.
- **Don't add extra theory.** If the user got the core idea, don't say "and here's some more advanced stuff you didn't ask for." Only fill gaps.
- **Don't use the same analogy twice.** If the user didn't get it the first time with "it's like a library system," don't try "it's like a library system" again with slightly different words.
- **Don't skip the final summary.** The user asked for saved notes — deliver them.

## Save Output

After the interactive session concludes, save the final summary:

- File name: `{topic-slug}_feynman_notes.md`
- Location: current working directory
- Content: The final summary from Phase 5 (the clean study notes)

Tell the user: "Your notes are saved at [file path]."

## Example (Abbreviated)

**User**: "用费曼学习法帮我理解 REST API"

**Claude (Phase 1 — Initial Explanation)**:

```markdown
## 🧑‍🏫 Let Me Explain: REST API

Imagine you walk into a restaurant. You sit down and look at the menu. You decide what you want and tell the waiter. The waiter takes your order to the kitchen. A few minutes later, the waiter brings your food to the table.

A REST API works the same way.

Your phone (or web browser) is like you sitting at the table. It wants something — maybe a list of your Instagram posts, or today's weather. It makes a "request" (like telling the waiter your order). The server is the kitchen — it has all the data and does all the heavy work. The API is the waiter — it takes your request to the server, and brings the response back to you.

The key rules that make it "REST" are simple:
1. Every piece of data has its own address (a URL), like every house on a street has a number.
2. You use the same 4 verbs for everything: GET (read data), POST (create new data), PUT (update data), DELETE (remove data). Just like in the restaurant: order, change an order, check on an order, cancel an order.
3. Each request is independent — the waiter doesn't remember what you ordered last time. If you want something, you ask for it fresh each time.

**In one sentence**: A REST API is a waiter that takes requests from your app to a server and brings data back.

---

Now it's your turn! ✋

**In your own words, tell me what a REST API is.**
```

*(The dialogue continues with Phase 2-5 as described.)*

## Bundled Resources

This skill is self-contained and requires no external assets or scripts. The entire Feynman dialogue is conducted inline, and only the final summary is saved to a file.

Output file: `{topic-slug}_feynman_notes.md` in the working directory.
