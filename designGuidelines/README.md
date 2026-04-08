# Dashboard Layout & Design System Guidelines

## 1. Typography Rules
- **Primary Font**: `Inter` (sans-serif) for body text and small UI elements.
- **Display Font**: `Outfit` or `Clash Display` for headers and significant callouts.
- **Hierarchy**: Clear distinction between node titles (bold, large), meta resources (semi-bold, small), and descriptions (regular, medium).

## 2. Color Systems
- **Theme**: Dark mode prioritized with high-contrast vibrant accents.
- **Background**: Deep space black (#0a0a0a) to dark slate (#1a1a1a).
- **Primary Accents**: Neon cyan (#00f4f4), electric purple (#a855f7) for active paths/nodes.
- **Glassmorphism**: Panels and cards should use `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(10px)` to establish depth.

## 3. Component Structures
- **Skill Nodes**: Rounded rectangles or circular hubs. Completed nodes are brightly filled, active nodes have a pulsing glow, pending nodes have subdued borders.
- **Connecting Edges**: SVG paths with animated dashed strokes to simulate progression.
- **Resource Modals**: Floating side-sheets or centered modal overlays with frosted glass effect, revealing curated videos/articles when a node is clicked.

## 4. Interaction Patterns
- **Hover Effects**: Slight scale bump (e.g., `scale(1.02)`) on roadmap nodes. Glow intensity increases.
- **Micro-animations**: Checkmarks appear dynamically when a goal is completed. Smooth, physics-based dragging if the roadmap canvas is pannable.
- **Transitions**: 0.3s cubic-bezier easing for all state changes.
