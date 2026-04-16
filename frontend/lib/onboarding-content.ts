import { 
  Sprout, Zap, Network, LayoutTemplate, Database, Bot, CloudCog, Smartphone, 
  BrainCircuit, Layout, Server, Gauge, Shield, Cpu, Code2, Globe, Boxes, Search,
  MonitorPlay, FileText, Wrench, MousePointerClick, Layers, Lock, Binary, 
  Terminal, Globe2, Palette, Activity
} from 'lucide-react';

export const DEFAULT_CONTENT: any = {
  2: {
    title: "What is your experience level?",
    description: "This determines the fundamental depth of your roadmap.",
    options: [
      { id: 'beginner', label: 'Beginner', description: 'Includes core fundamentals and foundational programming concepts.', icon: Sprout },
      { id: 'intermediate', label: 'Intermediate', description: 'Skips basic topics. Jumps straight into frameworks and advanced tooling.', icon: Zap },
      { id: 'advanced', label: 'Advanced', description: 'Heavily includes system design, architecture, and scaling principles.', icon: Network },
    ]
  },
  3: {
    title: "What interests you the most?",
    description: "This helps us refine your roadmap with powerful specializations.",
    options: [
      { id: 'web_interfaces', label: 'Building web interfaces', icon: LayoutTemplate },
      { id: 'apis_servers', label: 'Working with APIs & servers', icon: Database },
      { id: 'ml_ai', label: 'Machine learning & AI', icon: Bot },
      { id: 'infra_deploy', label: 'Infrastructure & deployment', icon: CloudCog },
      { id: 'mobile_apps', label: 'Mobile apps', icon: Smartphone },
    ]
  },
  4: {
    title: "How do you prefer learning?",
    description: "We map exact resources based on how you consume information.",
    options: [
      { id: 'video', label: 'Watching videos', description: 'High-quality YouTube courses and visual walkthroughs.', icon: MonitorPlay },
      { id: 'documentation', label: 'Reading docs', description: 'Deep-dives into official documentation and texts.', icon: FileText },
      { id: 'project_based', label: 'Building projects', description: 'Project-based tutorials focused on building real apps.', icon: Wrench },
      { id: 'interactive', label: 'Interactive', description: 'Hands-on quizzes and interactive learning environments.', icon: MousePointerClick },
    ]
  }
};

export const ARCHETYPE_CONTENT: Record<string, any> = {
  'WEB': {
    2: {
      title: "How deep is your UI/UX knowledge?",
      description: "Specify your aesthetic and technical baseline for web design.",
      options: [
        { id: 'beginner', label: 'Visual Explorer', description: 'Focus on HTML/CSS and basic layouts.', icon: Palette },
        { id: 'intermediate', label: 'Component Master', description: 'Hooks, State, and Component Architecture.', icon: Layers },
        { id: 'advanced', label: 'Design System Pro', description: 'Atomic design, accessibility, and micro-animations.', icon: LayoutTemplate },
      ]
    },
    3: {
      title: "Where do you want to specialize?",
      description: "Web development is vast. Pick your core focus.",
      options: [
        { id: '3d_animations', label: 'Animations & 3D', icon: Zap },
        { id: 'perf_seo', label: 'Performance & SEO', icon: Activity },
        { id: 'design_engineering', label: 'Design Engineering', icon: MousePointerClick },
      ]
    },
    4: {
      title: "Your Web Learning Medium?",
      description: "Frontend is highly visual. Choose how you want to see the code.",
      options: [
        { id: 'video', label: 'Visual Tutorials', description: 'Figma-to-Code and UI interaction videos.', icon: MonitorPlay },
        { id: 'documentation', label: 'Library Docs', description: 'Deep dives into React/Next/Vue official documentation.', icon: FileText },
        { id: 'project_based', label: 'UI Lab Sprints', description: 'Building real interface clones and UI Kits.', icon: Wrench },
        { id: 'interactive', label: 'Live Playgrounds', description: 'Interactive sandbox exercises (CodeSandbox/StackBlitz).', icon: MousePointerClick },
      ]
    }
  },
  'DATA': {
    2: {
      title: "Your Math & Python Baseline?",
      description: "Data fields require a strong core in logic and mathematics.",
      options: [
        { id: 'beginner', label: 'Logic Fundamental', description: 'Linear Algebra, Statistics, and Python basics.', icon: BrainCircuit },
        { id: 'intermediate', label: 'Pipeline Architect', description: 'Scikit-learn, Pandas, and Model Tuning.', icon: Binary },
        { id: 'advanced', label: 'ML Lead', description: 'Distributed Training, RAG, and Large Language Models.', icon: Cpu },
      ]
    },
    3: {
      title: "Your AI Interest Area?",
      description: "The AI field is exploding. Where do you fit in?",
      options: [
        { id: 'nlp', label: 'Natural Language (LLMs)', icon: Bot },
        { id: 'cv', label: 'Computer Vision', icon: Layout },
        { id: 'gen', label: 'Generative Models', icon: Zap },
      ]
    },
    4: {
      title: "How do you study Research?",
      description: "AI moves fast. How do you keep up with the state-of-the-art?",
      options: [
        { id: 'video', label: 'Paper Walkthroughs', description: 'Simplified visual explanations of complex papers.', icon: MonitorPlay },
        { id: 'documentation', label: 'Research Papers', description: 'Reading raw ArXiv papers and technical documentation.', icon: FileText },
        { id: 'project_based', label: 'Model Building', description: 'Training and fine-tuning models in Jupyter/Colab.', icon: Wrench },
        { id: 'interactive', label: 'Lab Notebooks', description: 'Hands-on coding in interactive Kaggle environments.', icon: MousePointerClick },
      ]
    }
  },
  'INFRA': {
    2: {
      title: "Your Backend & Ops Mastery?",
      description: "Scale and reliability are the core of infrastructure.",
      options: [
        { id: 'beginner', label: 'Logic Basics', description: 'Core Python/Go/Node and Simple Databases.', icon: Terminal },
        { id: 'intermediate', label: 'System Builder', description: 'Distributed DBs, Caching, and Docker.', icon: Boxes },
        { id: 'advanced', label: 'SRE / Architect', description: 'Kubernetes, High Availability, and Cloud Architecture.', icon: CloudCog },
      ]
    },
    3: {
      title: "What part of the system?",
      description: "Backend development covers everything from data to servers.",
      options: [
        { id: 'architect', label: 'System Design', icon: Network },
        { id: 'devops', label: 'Cloud Infrastructure', icon: CloudCog },
        { id: 'databases', label: 'High Performance DBs', icon: Database },
      ]
    },
    4: {
      title: "How do you learn Architecture?",
      description: "Infra is about patterns. Choose your learning style.",
      options: [
        { id: 'video', label: 'System Deep Dives', description: 'Architectural walkthroughs and high-level overviews.', icon: MonitorPlay },
        { id: 'documentation', label: 'Technical Specs', description: 'Reading RFCs, whitepapers, and official documentation.', icon: FileText },
        { id: 'project_based', label: 'System Building', description: 'Building distributed systems and microservices.', icon: Wrench },
        { id: 'interactive', label: 'Interactive Labs', description: 'Hands-on cloud sandboxes and terminal challenges.', icon: MousePointerClick },
      ]
    }
  },
  'MOBILE': {
    2: {
      title: "Your App Development Level?",
      description: "Mobile is about lifecycle, performance, and hardware.",
      options: [
        { id: 'beginner', label: 'Native Basic', description: 'Swift/Kotlin basics and Simple UI.', icon: Smartphone },
        { id: 'intermediate', label: 'App Architect', description: 'Navigation, Context, and Local Storage.', icon: Activity },
        { id: 'advanced', label: 'Platform Expert', description: 'Native Bridges, Performance, and App Store Lead.', icon: Globe2 },
      ]
    },
    3: {
      title: "Mobile Platform Interest",
      description: "Pick your focus within the mobile ecosystem.",
      options: [
        { id: 'ui', label: 'Animations & UI', icon: Palette },
        { id: 'logic', label: 'Native Performance', icon: Cpu },
        { id: 'cross', label: 'Cross-Platform', icon: Layers },
      ]
    },
    4: {
      title: "Mobile Study Style?",
      description: "App building is best learned hands-on.",
      options: [
        { id: 'video', label: 'Speed Coding', description: 'Visual guides on building app screens and features.', icon: MonitorPlay },
        { id: 'documentation', label: 'Apple/Google Docs', description: 'Reading official HIG and Material design specs.', icon: FileText },
        { id: 'project_based', label: 'Building Apps', description: 'Publishing simple apps to your own device/stores.', icon: Wrench },
        { id: 'interactive', label: 'Code Sandboxes', description: 'Interactive mobile components and playground demos.', icon: MousePointerClick },
      ]
    }
  },
  'SECURITY': {
    2: {
      title: "Security & Network Baseline?",
      description: "Cyber security requires a deep understanding of low-level protocols.",
      options: [
        { id: 'beginner', label: 'Net Fundamentals', description: 'TCP/IP, Ports, and basic Networking concepts.', icon: Globe },
        { id: 'intermediate', label: 'Security Analyst', description: 'Firewalls, Encryptions, and Pentesting tools.', icon: Shield },
        { id: 'advanced', label: 'Sec / Red Team', description: 'Malware Analysis, Kernel Exploitation, and Advanced Sec.', icon: Lock },
      ]
    },
    3: {
      title: "Cyber Security Domain",
      description: "Security is a vast field with many specialized paths.",
      options: [
        { id: 'web_sec', label: 'Web / App Security', icon: Globe },
        { id: 'network_sec', label: 'Network Security', icon: Network },
        { id: 'forensics', label: 'Digital Forensics', icon: Search },
      ]
    },
    4: {
      title: "How do you Hack?",
      description: "Security is an interactive art. Choose your learning path.",
      options: [
        { id: 'video', label: 'Exploit Walkthroughs', description: 'Visual breakdowns of famous hacks and patches.', icon: MonitorPlay },
        { id: 'documentation', label: 'CVE Database', description: 'Reading official security advisories and RFCs.', icon: FileText },
        { id: 'project_based', label: 'CTF Challenges', description: 'Building labs and solving Capture The Flag events.', icon: Wrench },
        { id: 'interactive', label: 'Interactive Hacks', description: 'Hands-on labs in controlled testing environments.', icon: MousePointerClick },
      ]
    }
  }
};

const ARCHETYPE_MAP: Record<string, string> = {
  // Web
  'frontend': 'WEB',
  'fullstack': 'WEB',
  'ux-design': 'WEB',
  'react': 'WEB',
  'vue': 'WEB',
  'angular': 'WEB',
  'javascript': 'WEB',
  'typescript': 'WEB',
  'nextjs': 'WEB',
  'frontend-beginner': 'WEB',
  // Data / AI
  'ai-engineer': 'DATA',
  'data-scientist': 'DATA',
  'python': 'DATA',
  'prompt-engineering': 'DATA',
  // Infra / Backend
  'backend': 'INFRA',
  'devops': 'INFRA',
  'software-architect': 'INFRA',
  'node': 'INFRA',
  'java': 'INFRA',
  'go': 'INFRA',
  'rust': 'INFRA',
  'sql': 'INFRA',
  'postgresql': 'INFRA',
  'mongodb': 'INFRA',
  'aws': 'INFRA',
  'docker': 'INFRA',
  'kubernetes': 'INFRA',
  'backend-beginner': 'INFRA',
  'devops-beginner': 'INFRA',
  'qa': 'INFRA',
  // Mobile
  'android': 'MOBILE',
  'ios': 'MOBILE',
  'smartphone': 'MOBILE',
  // Security
  'cyber-security': 'SECURITY',
  'security': 'SECURITY',
  // Modern / Specialized
  'blockchain': 'INFRA',
};

export function getStepContent(roleId: string, step: number) {
  const archetypeKey = ARCHETYPE_MAP[roleId];
  const archetypeContent = archetypeKey ? ARCHETYPE_CONTENT[archetypeKey] : null;

  if (archetypeContent && archetypeContent[step]) {
    return archetypeContent[step];
  }
  
  return DEFAULT_CONTENT[step];
}

export function getOptionLabel(roleId: string, step: number, optionId: string) {
  const content = getStepContent(roleId, step);
  const option = content.options.find((o: any) => o.id === optionId);
  return option ? option.label : 'Not Selected';
}
