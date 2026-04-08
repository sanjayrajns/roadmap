---
name: fetching-roadmap-data
description: Retrieves structured learning roadmap data from roadmap.sh. Use when generating developer roadmaps or when the user asks for structured learning paths.
---

# Fetching Roadmap Data

Retrieves roadmap structures from roadmap.sh and converts them into structured payloads for roadmap generation.

## When to use this skill

- Generating a developer learning roadmap
- Retrieving structured role roadmaps
- Building roadmap visualizations
- User asks for roadmap suggestions

## Workflow

- [ ] Identify target developer role
- [ ] Validate role exists in roadmap.sh
- [ ] Retrieve roadmap structure
- [ ] Parse roadmap stages
- [ ] Convert to internal schema

## Instructions

1. Determine the developer role.

Examples:

- frontend
- backend
- full-stack
- ai-engineer
- devops

2. Retrieve roadmap data.

Example:

```bash
python scripts/fetch_roadmap.py --role frontend
```

3. Validate the retrieved roadmap structure.

Required fields:

```json
[
  "stage_name",
  "skills",
  "dependencies"
]
```

4. Convert the roadmap into the system schema.

Example payload:

```json
{
  "role": "frontend",
  "stages": [
    {
      "stage_name": "HTML Fundamentals",
      "skills": ["semantic html", "forms", "accessibility"]
    }
  ]
}
```

## Resources

- scripts/fetch_roadmap.py
