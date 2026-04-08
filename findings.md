# Research Findings

## 1. roadmap.sh Roadmap Structure
- **Data Source**: roadmaps are maintained in the `kamranahmedse/developer-roadmap` GitHub repository.
- **Format**: Content is primarily stored as Markdown files and JSON metadata that dictatates the graph visualization. There is no public, structured JSON API natively available.
- **Node Classification**: Roadmaps have "core" topics, "alternative" topics, and "optional" topics. 
- **Mapping Requirement**: To represent this as our `Roadmap Schema`, we must extract the sequential "stages" and "skills" from the repository’s markdown hierarchical structure.

## 2. Developer Learning Resource Repositories
- **GitHub Curated Lists (Awesome Lists)**: The "Awesome" lists on GitHub (e.g., `sindresorhus/awesome`) provide highly vetted, community-approved learning resources (articles, videos, documentation).
- **Reputable Repositories**: freeCodeCamp, MDN Web Docs, and popular OSS repositories often have high-quality curated lists of tutorials. 
- **Anti-Hallucination Strategy**: To avoid AI hallucination, the system should either query a trusted knowledge base (like curated awesome lists) or strictly limit the AI to a predefined vocabulary of vetted URLs.

## 3. UI Dashboard Best Practices
- **Establish Visual Hierarchy**: Place critical KPIs and high-level summaries (like the unified progress percentage) in the top-left area. Use visual weight (bold, distinct font types) for primary metrics.
- **Maintain a Structured Grid**: Use a consistent CSS Grid / Flexbox layout to align charts, widgets, and lists. 
- **Manage Cognitive Load**: Aim for 6-8 visual elements per view. Use Progressive Disclosure — allow users to see stage overviews and drill down into specific resource lists or projects on demand.
- **Context & Interaction**: Provide clear contextual milestones (e.g., "70% of Stage 1 complete"). Support interactive filters to toggle between video, text, and project-based resources depending on user input schema preferences.
