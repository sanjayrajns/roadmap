---
name: generating-question-engine
description: Generates a structured questionnaire for determining user career goals and learning preferences. Use when building onboarding flows or gamified learning assessments.
---

# Generating Question Engine

Creates a structured set of questions used to determine the user’s learning roadmap.

## When to use this skill

- Building onboarding flows
- Determining developer career goals
- Creating gamified question interfaces
- Collecting user learning preferences

## Workflow

- [ ] Identify required question categories
- [ ] Generate question list
- [ ] Validate response schema
- [ ] Store responses

## Instructions

Question categories must include:

- career goal
- experience level
- preferred learning format
- time availability

Example schema:

```json
{
  "career_goal": "string",
  "experience_level": "beginner | intermediate | advanced",
  "learning_style": "video | documentation | project_based",
  "hours_per_week": "integer"
}
```

Example questions:

- What role do you want to become?
- How experienced are you with programming?
- How do you prefer learning?
- How many hours can you dedicate weekly?

## Resources

- examples/question_flow.json
