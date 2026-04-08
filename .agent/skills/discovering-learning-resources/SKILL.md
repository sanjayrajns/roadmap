---
name: discovering-learning-resources
description: Retrieves high-quality learning resources for specific technologies. Use when generating developer learning roadmaps or recommending educational material.
---

# Discovering Learning Resources

Finds curated learning resources for roadmap topics.

Sources may include:

- official documentation
- GitHub repositories
- developer learning platforms

## When to use this skill

- Generating resource lists
- Enriching roadmap stages
- Recommending tutorials

## Workflow

- [ ] Identify topic
- [ ] Query resource sources
- [ ] Rank resources
- [ ] Return top resources

## Instructions

Input example:

```json
{
  "topic": "react"
}
```

Retrieve resources using:

```bash
python scripts/fetch_resources.py --topic react
```

Returned payload format:

```json
{
  "topic": "react",
  "resources": [
    {
      "title": "React Official Docs",
      "type": "documentation",
      "url": "https://react.dev"
    }
  ]
}
```

## Resources

- scripts/fetch_resources.py
