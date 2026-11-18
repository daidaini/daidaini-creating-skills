---
name: build-learning-ladder
description: Build a step-by-step learning ladder (学习阶梯) for any topic, from beginner to confident practitioner, with optional HTML export.
disable-model-invocation: true
---

# Build Learning Ladder

Turn a topic into a ladder of levels the learner climbs by doing. Write in the user's language, in the voice of a coach.

## Steps

1. **Scope.** Use whatever background, goal, and weekly time the user gave. Fill gaps with a reasonable assumption stated in one line at the top. Ask only when the topic is too broad to choose a path (e.g. "math").
2. **Write the ladder.** Open with an overview table: level, name, what the learner can do after it. Then write the levels, usually 5; use more or fewer when the topic calls for it. Name levels to fit the topic. Close with a short note on what lies beyond the top level.
3. **Save** to `{topic-slug}_learning_ladder.md` in the working directory. Give the user the path and mention that an HTML version is available on request.

## Each level

- **Goal**: what the learner can do at the end, as observable "you can..." statements.
- **Core concepts**: the 3-5 things that matter at this level, one line each.
- **Exercise**: a concrete task with a time estimate and a picture of the finished result. It doubles as the milestone that proves the level is done.
- **Common mistakes**: the specific traps real learners of this topic hit, why they hit them, and the fix.
- **Self-check**: one plain question. A learner who cannot answer it confidently stays on this level.

A good ladder is concrete ("write 10 SQL queries that join 3+ tables", not "understand joins"), each level builds on the one before, each level fits roughly 1-4 weeks of the user's available time, and jargon is defined where it first appears.

## Optional: HTML export

Only when the user asks for HTML. Turn the finished markdown into one self-contained offline file, `{topic-slug}_learning_ladder.html`, keeping all content:

- Default: follow the `content-to-zen-static-html` skill (日式极简 × 侘寂 style), including its verification.
- Magazine or flip-through style (杂志风): follow the `beautiful-html` skill.
