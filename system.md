# System Constitution

## North Star
Generate personalized developer roadmaps using AI and roadmap.sh.

## User Type
Students and early-stage developers.

## Primary Data Source
roadmap.sh role roadmaps.

## Output Format
An interactive dashboard that displays:
- learning stages
- recommended resources
- progress indicators

## Behavior Rules
The system must:
- produce structured roadmaps
- avoid hallucinated resources
- prioritize reputable learning materials

---

## Data Schemas

### User Input Schema
```json
{
  "role_goal": "string",
  "experience_level": "beginner | intermediate | advanced",
  "learning_style": "video | documentation | project_based",
  "time_commitment": "hours_per_week"
}
```

### Roadmap Schema
```json
{
  "role": "string",
  "stages": [
    {
      "stage_name": "string",
      "skills": ["string"],
      "recommended_projects": ["string"]
    }
  ]
}
```

### Resource Schema
```json
{
  "topic": "string",
  "resources": [
    {
      "title": "string",
      "type": "documentation | video | course",
      "url": "string",
      "difficulty": "beginner | intermediate | advanced"
    }
  ]
}
```

### UI Payload Schema
```json
{
  "roadmap": {},
  "resources": [],
  "progress": {}
}
```

---

## Architecture Rules
1. **Frontend**: Next.js App Router (React), keeping interactive dashboard responsive and modular.
2. **Backend**: Node.js/Express or Next.js API routes serving generated roadmaps.
3. **Data Sync**: Implement an ingestion service that parses raw roadmap.sh markdown into our internal schema.
4. **LLM Integration**: Use an AI service to contextualize user goals and trim the raw roadmap tree down.

## Design Constraints
- High-contrast, dynamic aesthetic consistent with instructions. Use Google Fonts (Inter/Outfit) and non-generic color palettes (e.g., dark mode with glassmorphism).
- Dashboards must be responsive.

## MCP Definitions
Currently no external Model Context Protocol implementations are strictly required. If third-party integrations are needed to pull top resources without hallucination, they will be defined here.

## Skill Definitions
- **Roadmap Ingestion**: Scrapes or loads the kamranahmedse/developer-roadmap repo and converts MD outlines to the JSON Schema.
- **AI Customization**: AI analyzes User input + Graph Schema to prune unnecessary branches and recommend an optimal path.
