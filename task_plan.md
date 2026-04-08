# Task Plan Blueprint

## Project Phases

### Phase 1: Discovery & Architecture (Current)
- Define User Goals and target system scope (Discovery Questions)
- Output `findings.md` mapping roadmap.sh constraints
- Solidify Data Schema and Architecture Rules in `system.md`
- Wait for user approval before next phase

### Phase 2: Core Platform & Ingestion Build 
- Create Next.js boilerplate and backend routes
- Build ingestion utility to parse/map roadmap.sh structure to JSON schemas
- Develop AI Integration to tailor the internal schema based on user preferences

### Phase 3: Dashboard & Interactive UI Construction
- Build design system in `/designGuidelines` standardizing dark mode + glassmorphism themes
- Implement responsive roadmap visualization components
- Build the discovery questionnaire form

### Phase 4: Integration & Polish
- Wire the frontend Questionnaire with the backend generator
- Wire the generated graph to the visualization UI
- Ensure animations and responsive constraints are met

## Milestones
1. **M1 (Completed Requirements)**: Core schemas set, roadmap.sh architecture analyzed.
2. **M2**: Functional parsing of at least one roadmap.sh role into internal JSON.
3. **M3**: Working AI prompt chain generating a personalized tree.
4. **M4**: Interactive visualization dashboard running locally.

## Validation Checkpoints
- [ ] Discovery questions answered by user.
- [ ] Schema is approved and validated against roadmap.sh model.
- [ ] Ingested graph has no orphaned data nodes.
- [ ] Frontend successfully handles dynamic graphs.
