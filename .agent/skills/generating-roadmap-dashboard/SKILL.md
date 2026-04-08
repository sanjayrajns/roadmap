---
name: generating-roadmap-dashboard
description: Generates a responsive roadmap dashboard UI using Next.js, Tailwind, and Framer Motion. Use when displaying structured learning paths to users.
---

# Generating Roadmap Dashboard

Creates the user interface used to visualize learning roadmaps.

## When to use this skill

- Building roadmap dashboards
- Rendering roadmap stages
- Displaying learning resources

## Workflow

- [ ] Validate roadmap payload
- [ ] Generate layout
- [ ] Render stages
- [ ] Attach resource cards
- [ ] Apply animations

## Instructions

Dashboard components must include:

- roadmap timeline
- stage cards
- resource cards
- progress indicators

Example layout structure:

```
Dashboard
├── RoadmapTimeline
├── StageCard
├── ResourceCard
└── ProgressTracker
```

Framework requirements:

```
Next.js
Tailwind CSS
Framer Motion
```

Animations must use Framer Motion.

Example:

```jsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

## Resources

- DesignGuidelines/dashboard_layout.md
