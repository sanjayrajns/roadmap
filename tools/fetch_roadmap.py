"""
fetch_roadmap.py — Roadmap Structure Ingestion Engine

Provides structured roadmap data (stages/skills) mapping to roadmap.sh patterns.
Top 6 roadmaps are fully canonical; all others use heuristic generation.

Usage:
    python tools/fetch_roadmap.py --role frontend
    python tools/fetch_roadmap.py --role devops --experience intermediate
"""

import argparse
import json
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CANONICAL ROADMAP REGISTRY — Top 6 Roadmaps
# Based on roadmap.sh structures
# ─────────────────────────────────────────────────────────────────────────────
ROADMAP_REGISTRY = {

    # ── 1. FRONTEND ───────────────────────────────────────────────────────────
    "frontend": {
        "stages": [
            {
                "stage_name": "Internet & Web Fundamentals",
                "skills": ["How the internet works", "HTTP/HTTPS", "DNS", "Browsers", "Domain Names"],
                "recommended_projects": ["Setup a simple landing page on a custom domain"]
            },
            {
                "stage_name": "The Core Trio (HTML, CSS, JS)",
                "skills": ["Semantic HTML", "CSS Box Model", "Flexbox & Grid", "JavaScript Basics", "DOM Manipulation", "ES6+"],
                "recommended_projects": ["Responsive Portfolio Site", "Interactive Calculator"]
            },
            {
                "stage_name": "Modern Ecosystem & Build Tools",
                "skills": ["Git & Version Control", "Package Managers (npm/pnpm)", "Vite / Webpack", "ESLint & Prettier"],
                "recommended_projects": ["Clone a GitHub repo, set up ESLint and build with Vite"]
            },
            {
                "stage_name": "Frameworks & State Management",
                "skills": ["React", "Vue / Angular", "State Management (Redux/Zustand/Pinia)", "Tailwind CSS", "CSS Modules"],
                "recommended_projects": ["E-commerce Frontend with Cart State", "Dashboard with REST API integration"]
            },
            {
                "stage_name": "Testing & Web Performance",
                "skills": ["Unit Testing (Vitest/Jest)", "Core Web Vitals", "Lighthouse", "PWA Basics", "Accessibility (A11Y)"],
                "recommended_projects": ["Optimize a slow app to 90+ Lighthouse score", "Write unit tests for a React component library"]
            },
            {
                "stage_name": "Advanced: TypeScript & Architecture",
                "skills": ["TypeScript", "Design Patterns", "Micro-Frontends", "Monorepos (Turborepo/Nx)"],
                "recommended_projects": ["Refactor a JavaScript codebase to full TypeScript", "Set up a Turborepo monorepo"]
            }
        ]
    },

    # ── 2. BACKEND ────────────────────────────────────────────────────────────
    "backend": {
        "stages": [
            {
                "stage_name": "Internet & API Fundamentals",
                "skills": ["HTTP/HTTPS", "REST APIs", "JSON/XML", "Web Servers (Nginx/Apache)", "Status Codes"],
                "recommended_projects": ["Set up a local server with custom routing"]
            },
            {
                "stage_name": "Programming Language & Logic",
                "skills": ["Node.js / Python / Go", "OOP & Functional Patterns", "Concurrency & Async", "Error Handling"],
                "recommended_projects": ["CLI tool to parse and filter log files"]
            },
            {
                "stage_name": "Relational & NoSQL Databases",
                "skills": ["PostgreSQL / MySQL", "MongoDB / Redis", "ACID Transactions", "Normalization & Indexing", "ORM (Prisma/SQLAlchemy)"],
                "recommended_projects": ["Schema design for a social media platform", "User CRUD with Prisma + PostgreSQL"]
            },
            {
                "stage_name": "Authentication & Security",
                "skills": ["JWT / OAuth2", "bcrypt Hashing", "CORS", "Rate Limiting", "Input Validation"],
                "recommended_projects": ["Full auth system with access + refresh tokens"]
            },
            {
                "stage_name": "Caching, Queues & Scaling",
                "skills": ["Redis Caching", "Message Brokers (RabbitMQ/Kafka)", "WebSockets", "Load Balancers", "Horizontal Scaling"],
                "recommended_projects": ["Real-time chat with WebSockets and Redis Pub/Sub"]
            },
            {
                "stage_name": "Architecture & Deployment",
                "skills": ["Microservices", "Docker", "Docker Compose", "CI/CD Pipelines", "API Gateway"],
                "recommended_projects": ["Containerize a microservice with Docker Compose"]
            }
        ]
    },

    # ── 3. FULLSTACK ──────────────────────────────────────────────────────────
    "fullstack": {
        "stages": [
            {
                "stage_name": "Web Fundamentals",
                "skills": ["HTML", "CSS", "JavaScript", "HTTP/HTTPS", "Git & Version Control"],
                "recommended_projects": ["Static website with form submission", "Personal portfolio"]
            },
            {
                "stage_name": "Frontend: React & Ecosystem",
                "skills": ["React", "React Router", "State Management (Zustand/Redux)", "Tailwind CSS", "TypeScript"],
                "recommended_projects": ["Task manager SPA with local state", "Weather app consuming a public API"]
            },
            {
                "stage_name": "Backend: Node.js & APIs",
                "skills": ["Node.js + Express", "REST API Design", "Middleware", "Authentication (JWT)", "Error Handling"],
                "recommended_projects": ["RESTful CRUD API for a blog platform"]
            },
            {
                "stage_name": "Databases & Data Modeling",
                "skills": ["PostgreSQL", "MongoDB", "Prisma ORM", "Database Design", "Redis Sessions"],
                "recommended_projects": ["Full-stack app with persistent user data"]
            },
            {
                "stage_name": "Full-Stack Integration",
                "skills": ["Next.js (App Router)", "Server Actions / tRPC", "File Uploads (S3/Cloudinary)", "Real-time (WebSockets/SSE)"],
                "recommended_projects": ["SaaS starter with auth, DB, and payments"]
            },
            {
                "stage_name": "Deployment & DevOps Basics",
                "skills": ["Docker", "Vercel / Railway / Render", "CI/CD with GitHub Actions", "Environment Variables & Secrets"],
                "recommended_projects": ["Deploy a full-stack app with a CI/CD pipeline"]
            }
        ]
    },

    # ── 4. DEVOPS ─────────────────────────────────────────────────────────────
    "devops": {
        "stages": [
            {
                "stage_name": "Linux & Shell Fundamentals",
                "skills": ["Linux CLI", "Bash Scripting", "File Permissions", "Process Management", "SSH & Networking basics"],
                "recommended_projects": ["Write a bash script to automate server setup"]
            },
            {
                "stage_name": "Version Control & Collaboration",
                "skills": ["Git (advanced)", "GitHub Flow / Trunk-Based Development", "Pull Requests & Code Review", "Branching Strategies"],
                "recommended_projects": ["Set up a GitFlow workflow for a team project"]
            },
            {
                "stage_name": "Containers & Docker",
                "skills": ["Docker Architecture", "Dockerfile", "Docker Compose", "Container Networking", "Image Optimization"],
                "recommended_projects": ["Containerize a multi-service app with Docker Compose"]
            },
            {
                "stage_name": "Container Orchestration (Kubernetes)",
                "skills": ["Kubernetes Architecture", "Pods, Deployments & Services", "ConfigMaps & Secrets", "Helm Charts", "Ingress Controllers"],
                "recommended_projects": ["Deploy a microservice app on a local k8s cluster (minikube)"]
            },
            {
                "stage_name": "CI/CD Pipelines",
                "skills": ["GitHub Actions", "Jenkins / GitLab CI", "Automated Testing in CI", "Artifact Publishing", "Blue-Green Deployments"],
                "recommended_projects": ["Build a CI/CD pipeline that tests, builds, and deploys on merge"]
            },
            {
                "stage_name": "Cloud & Infrastructure as Code",
                "skills": ["AWS / GCP / Azure Core Services", "Terraform", "Ansible", "Monitoring (Prometheus/Grafana)", "Logging (ELK Stack)"],
                "recommended_projects": ["Provision a VPC + EC2 + RDS with Terraform"]
            }
        ]
    },

    # ── 5. AI ENGINEER ────────────────────────────────────────────────────────
    "ai-engineer": {
        "stages": [
            {
                "stage_name": "Foundations & Math",
                "skills": ["Python for Data Science", "Linear Algebra", "Calculus", "Probability & Statistics", "NumPy / Pandas"],
                "recommended_projects": ["Exploratory Data Analysis on a public dataset"]
            },
            {
                "stage_name": "Machine Learning Core",
                "skills": ["Supervised Learning", "Unsupervised Learning", "Scikit-Learn", "Feature Engineering", "Model Evaluation"],
                "recommended_projects": ["Housing price prediction model", "Customer churn classifier"]
            },
            {
                "stage_name": "Deep Learning & Neural Networks",
                "skills": ["PyTorch / TensorFlow", "CNNs", "RNNs & LSTMs", "Transformers Architecture", "Transfer Learning"],
                "recommended_projects": ["Handwritten digit recognizer (MNIST)", "Image classifier with ResNet transfer learning"]
            },
            {
                "stage_name": "LLMs & Prompt Engineering",
                "skills": ["GPT Architectures", "Prompt Engineering", "RAG (Retrieval Augmented Generation)", "Vector Databases (Pinecone/Milvus)", "LangChain / LlamaIndex"],
                "recommended_projects": ["Custom PDF Q&A bot with RAG", "Semantic search engine over a personal knowledge base"]
            },
            {
                "stage_name": "MLOps & Model Deployment",
                "skills": ["Model Serving (FastAPI / BentoML)", "CI/CD for ML (MLflow)", "On-device AI (ONNX)", "Monitoring & Drift Detection"],
                "recommended_projects": ["Deploy a model as a scalable REST API", "Build a model monitoring dashboard"]
            }
        ]
    },

    # ── 6. DATA SCIENTIST ─────────────────────────────────────────────────────
    "data-scientist": {
        "stages": [
            {
                "stage_name": "Programming & Data Wrangling",
                "skills": ["Python", "NumPy", "Pandas", "SQL", "Data Cleaning & Transformation"],
                "recommended_projects": ["Clean and analyze a messy real-world dataset (Kaggle)"]
            },
            {
                "stage_name": "Statistics & Probability",
                "skills": ["Descriptive Statistics", "Probability Distributions", "Hypothesis Testing", "Bayesian Thinking", "A/B Testing"],
                "recommended_projects": ["Run an A/B test analysis on sample marketing data"]
            },
            {
                "stage_name": "Data Visualization",
                "skills": ["Matplotlib / Seaborn", "Plotly", "Tableau / Power BI", "Dashboard Design", "Storytelling with Data"],
                "recommended_projects": ["Interactive dashboard for COVID-19 time-series data"]
            },
            {
                "stage_name": "Machine Learning & Modeling",
                "skills": ["Regression & Classification", "Decision Trees & Random Forests", "XGBoost / LightGBM", "Hyperparameter Tuning", "Cross-Validation"],
                "recommended_projects": ["Titanic survival prediction (end-to-end pipeline)", "Sales forecasting model"]
            },
            {
                "stage_name": "Advanced Analytics & NLP",
                "skills": ["Time Series Analysis", "NLP (NLTK / spaCy)", "Topic Modeling", "Recommender Systems", "Dimensionality Reduction (PCA/t-SNE)"],
                "recommended_projects": ["Sentiment analysis on customer reviews", "Movie recommendation engine"]
            },
            {
                "stage_name": "Big Data & Production",
                "skills": ["Spark / Dask", "Cloud Data Warehouses (BigQuery/Snowflake)", "Airflow / Prefect", "MLflow", "Model Serving"],
                "recommended_projects": ["ETL pipeline with Airflow", "End-to-end ML experiment tracking with MLflow"]
            }
        ]
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# INTEREST SPECIALIZATION STAGES
# Injected near the end of the roadmap based on user's interest area
# ─────────────────────────────────────────────────────────────────────────────
INTEREST_STAGES = {
    # Web specializations
    "3d_animations": {
        "stage_name": "Specialization: Interactive Animations & 3D",
        "skills": ["Framer Motion", "GSAP", "Three.js Basics", "SVG Animations", "CSS Keyframes"],
        "recommended_projects": ["Immersive portfolio with 3D elements", "Animated data visualization"]
    },
    "perf_seo": {
        "stage_name": "Specialization: Performance & SEO",
        "skills": ["Core Web Vitals", "Code Splitting", "Lazy Loading", "Image Optimization", "Structured Data / Schema.org"],
        "recommended_projects": ["Refactor a slow app to achieve 95+ Lighthouse", "Implement structured data for an e-commerce site"]
    },
    "design_engineering": {
        "stage_name": "Specialization: Design Engineering",
        "skills": ["Design Systems", "Storybook", "Figma-to-Code", "Component API Design", "Accessibility (WCAG 2.1)"],
        "recommended_projects": ["Build and publish a component library to npm"]
    },
    # Infra specializations
    "architect": {
        "stage_name": "Specialization: System Design",
        "skills": ["CAP Theorem", "Event-Driven Architecture", "CQRS / Event Sourcing", "API Gateway Patterns", "Service Mesh (Istio)"],
        "recommended_projects": ["Design a distributed URL shortener", "Design a real-time notification system"]
    },
    "devops_spec": {
        "stage_name": "Specialization: Cloud Infrastructure",
        "skills": ["AWS Solutions Architecture", "Multi-Region Deployments", "Cost Optimization", "FinOps", "Disaster Recovery"],
        "recommended_projects": ["Architect a multi-region AWS setup with Terraform"]
    },
    "databases": {
        "stage_name": "Specialization: High-Performance Databases",
        "skills": ["Query Optimization", "Database Sharding", "Read Replicas", "TimescaleDB", "Vector Search (pgvector)"],
        "recommended_projects": ["Benchmark and optimize a slow query to <10ms"]
    },
    # AI specializations
    "nlp": {
        "stage_name": "Specialization: Natural Language Processing",
        "skills": ["LLM Fine-tuning (LoRA/QLoRA)", "RAG Pipeline", "Semantic Search", "Named Entity Recognition", "Text Summarization"],
        "recommended_projects": ["Fine-tune a local LLM on domain-specific data", "Local RAG chatbot for personal docs"]
    },
    "cv": {
        "stage_name": "Specialization: Computer Vision",
        "skills": ["Object Detection (YOLO)", "Image Segmentation", "OpenCV", "Depth Estimation", "Vision Transformers (ViT)"],
        "recommended_projects": ["Real-time object detector with webcam feed", "Medical image classification pipeline"]
    },
    "gen": {
        "stage_name": "Specialization: Generative AI",
        "skills": ["Diffusion Models (Stable Diffusion)", "GANs", "VAEs", "ControlNet", "AI Image Pipelines"],
        "recommended_projects": ["Text-to-image pipeline with Stable Diffusion", "Train a custom LoRA model"]
    },
    # Security specializations
    "web_sec": {
        "stage_name": "Specialization: Web Application Security",
        "skills": ["OWASP Top 10", "XSS / CSRF / SQLi", "Burp Suite", "Secure Code Review", "Bug Bounty Methodology"],
        "recommended_projects": ["OWASP Juice Shop CTF walkthrough", "Security audit on a sample web application"]
    },
    "network_sec": {
        "stage_name": "Specialization: Network Security",
        "skills": ["Wireshark", "Firewall Rules", "IDS/IPS (Snort)", "VPN Architecture", "Zero Trust Networking"],
        "recommended_projects": ["Build a monitored home lab network", "Analyze a packet capture for anomalies"]
    },
    "forensics": {
        "stage_name": "Specialization: Digital Forensics",
        "skills": ["File Carving", "Memory Forensics (Volatility)", "Log Analysis", "Chain of Custody", "Autopsy Tool"],
        "recommended_projects": ["Investigate a mock incident using Autopsy", "Extract artifacts from a memory dump"]
    },
    # Generic / fallback specializations
    "animations": {
        "stage_name": "Specialization: Interactive Animations",
        "skills": ["Framer Motion", "GSAP", "Three.js Basics", "SVG Animations"],
        "recommended_projects": ["Immersive landing page with 3D elements"]
    },
    "security": {
        "stage_name": "Specialization: Security Hardening",
        "skills": ["OWASP Top 10", "JWT Security", "Rate Limiting", "CORS Mastery"],
        "recommended_projects": ["Security audit on an existing application"]
    },
    "performance": {
        "stage_name": "Specialization: Performance Optimization",
        "skills": ["Core Web Vitals", "Code Splitting", "Lazy Loading", "Image Optimization"],
        "recommended_projects": ["Refactor a slow app to achieve 95+ Lighthouse"]
    },
    "ml_ai": {
        "stage_name": "Specialization: ML Integration",
        "skills": ["REST APIs for ML Models", "Hugging Face Inference API", "Prompt Engineering", "Streaming Responses"],
        "recommended_projects": ["Integrate GPT-4 into a web application with streaming"]
    },
    "infra_deploy": {
        "stage_name": "Specialization: Infrastructure & Deployment",
        "skills": ["Docker", "GitHub Actions CI/CD", "Environment Secrets Management", "Zero-downtime Deployments"],
        "recommended_projects": ["Fully automated CI/CD pipeline for a web app"]
    },
    "mobile_apps": {
        "stage_name": "Specialization: Mobile Integration",
        "skills": ["React Native Basics", "Expo", "Push Notifications", "Offline-first Patterns"],
        "recommended_projects": ["Port a web app to React Native"]
    },
    "web_interfaces": {
        "stage_name": "Specialization: Advanced Web Interfaces",
        "skills": ["Micro-animations", "Component Design Systems", "Accessible Rich Components", "CSS Architecture"],
        "recommended_projects": ["Build a fully accessible, animated design system"]
    },
    "apis_servers": {
        "stage_name": "Specialization: API Architecture",
        "skills": ["GraphQL", "gRPC", "API Versioning", "OpenAPI / Swagger", "Webhook Design"],
        "recommended_projects": ["Build a GraphQL API with subscriptions"]
    },
}


def generate_roadmap(role: str, experience: str = "beginner", interest: str = "") -> dict:
    """Returns the structured roadmap for the role, filtered by experience and specialised by interest."""
    role_key = role.lower()

    # 1. Get Base Roadmap from registry or generate heuristic fallback
    if role_key in ROADMAP_REGISTRY:
        stages = list(ROADMAP_REGISTRY[role_key]["stages"])
    else:
        stages = [
            {
                "stage_name": f"{role.capitalize()} Fundamentals",
                "skills": ["Introduction", "Core Syntax", "Development Setup"],
                "recommended_projects": [f"Hello World in {role}", f"Basic {role} implementation"]
            },
            {
                "stage_name": "Intermediate Concepts",
                "skills": ["Advanced Syntax", "Functional Patterns", "Error Handling", "Testing"],
                "recommended_projects": [f"Logic-heavy {role} project"]
            },
            {
                "stage_name": "Ecosystem & Integration",
                "skills": ["Libraries & Packages", "API Integration", "Database Connection"],
                "recommended_projects": [f"Full-featured {role} application"]
            },
            {
                "stage_name": "Production & Deployment",
                "skills": ["Containerization", "CI/CD", "Monitoring", "Performance Optimization"],
                "recommended_projects": [f"Deploy {role} project with automated CI/CD"]
            },
        ]

    # 2. Filter by Experience Level
    if experience == "advanced":
        # Remove stages that are purely foundational
        BEGINNER_KEYWORDS = ["fundamental", "basics", "foundation", "getting started", "introduction", "web fundamentals", "programming & data wrangling"]
        stages = [s for s in stages if not any(kw in s["stage_name"].lower() for kw in BEGINNER_KEYWORDS)]
    elif experience == "intermediate":
        # Remove only the very first setup stage if it exists
        SETUP_KEYWORDS = ["setup", "getting started", "fundamentals", "core trio"]
        if stages and any(kw in stages[0]["stage_name"].lower() for kw in SETUP_KEYWORDS):
            stages = stages[1:]

    # 3. Inject Interest Specialization Stage
    if interest and interest in INTEREST_STAGES:
        spec_stage = INTEREST_STAGES[interest]
        # Insert before last stage so it feels like a branching point
        if len(stages) > 1:
            stages.insert(-1, spec_stage)
        else:
            stages.append(spec_stage)

    return {"role": role, "stages": stages}


def main():
    parser = argparse.ArgumentParser(description="Fetch roadmap structure for a given role.")
    parser.add_argument("--role", required=True, help="Target developer role (e.g. frontend, devops)")
    parser.add_argument("--experience", default="beginner", help="Experience level: beginner | intermediate | advanced")
    parser.add_argument("--interest", default="", help="Specific interest area (e.g. nlp, 3d_animations)")
    args = parser.parse_args()

    # Ensure .tmp directory exists
    tmp_dir = Path(".tmp")
    tmp_dir.mkdir(exist_ok=True)

    result = generate_roadmap(args.role, args.experience, args.interest)

    out_file = tmp_dir / f"{args.role}_roadmap.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
