"""
fetch_resources.py — Multi-Source, Tiered Resource Discovery Engine

Provides curated learning resources (video, documentation, github) for each skill,
tiered by experience depth. Falls back to GitHub API for uncurated topics.

Usage:
    python tools/fetch_resources.py --topics "React,TypeScript" --style video --experience beginner
"""

import argparse
import json
import os
import re
import sys
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# ─────────────────────────────────────────────────────────────────────────────
# CURATED RESOURCE REGISTRY
# Format per resource:
#   { title, type, url, depth, description }
#   depth: "beginner" | "advanced" | "all"
#   type:  "video" | "documentation" | "github"
# ─────────────────────────────────────────────────────────────────────────────
CURATED = {

    # ── HTML ──────────────────────────────────────────────────────────────────
    "html": [
        {"title": "HTML Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=pQN-pnXPaVg", "description": "4-hour complete HTML course for beginners."},
        {"title": "MDN: HTML Reference", "type": "documentation", "depth": "all", "url": "https://developer.mozilla.org/en-US/docs/Web/HTML", "description": "The definitive HTML reference by Mozilla."},
        {"title": "Semantic HTML Guide – web.dev", "type": "documentation", "depth": "beginner", "url": "https://web.dev/learn/html", "description": "Google's structured HTML learning path."},
        {"title": "HTML Best Practices (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/hail2u/html-best-practices", "description": "Community-vetted HTML coding best practices."},
    ],

    # ── CSS ───────────────────────────────────────────────────────────────────
    "css": [
        {"title": "CSS Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=1Rs2ND1ryYc", "description": "Comprehensive CSS course from scratch."},
        {"title": "CSS Tricks – A Complete Guide to Flexbox", "type": "documentation", "depth": "beginner", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", "description": "The internet's most referenced Flexbox guide."},
        {"title": "MDN CSS Reference", "type": "documentation", "depth": "all", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS", "description": "Full CSS property reference."},
        {"title": "You Don't Know CSS (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/wesbos/css-grid", "description": "CSS Grid + advanced layout patterns."},
        {"title": "CSS Architecture – cube.fyi", "type": "documentation", "depth": "advanced", "url": "https://cube.fyi/", "description": "A pragmatic CSS methodology for scale."},
    ],

    # ── JavaScript ────────────────────────────────────────────────────────────
    "javascript": [
        {"title": "JavaScript Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=PkZNo7MFNFg", "description": "Full beginner JS course — 3.5 hours."},
        {"title": "The Modern JavaScript Tutorial (javascript.info)", "type": "documentation", "depth": "all", "url": "https://javascript.info/", "description": "The most comprehensive free JS textbook online."},
        {"title": "You Don't Know JS (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/getify/You-Dont-Know-JS", "description": "Book series going deep into JS internals."},
        {"title": "JavaScript – MDN Web Docs", "type": "documentation", "depth": "all", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "description": "The authoritative JavaScript language reference."},
        {"title": "30 Days of JavaScript (GitHub)", "type": "github", "depth": "beginner", "url": "https://github.com/Asabeneh/30-Days-Of-JavaScript", "description": "Beginner-friendly 30-day JS challenge."},
    ],

    # ── TypeScript ────────────────────────────────────────────────────────────
    "typescript": [
        {"title": "TypeScript Full Course – Matt Pocock", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=SpwzRDUQ1GI", "description": "TypeScript from scratch with Matt Pocock."},
        {"title": "TypeScript Official Handbook", "type": "documentation", "depth": "all", "url": "https://www.typescriptlang.org/docs/handbook/intro.html", "description": "Official TypeScript learning handbook."},
        {"title": "Type Challenges (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/type-challenges/type-challenges", "description": "Collection of TypeScript type-level challenges."},
        {"title": "Total TypeScript – Free Workshops", "type": "documentation", "depth": "advanced", "url": "https://www.totaltypescript.com/tutorials", "description": "Advanced TypeScript patterns and workshops."},
    ],

    # ── React ─────────────────────────────────────────────────────────────────
    "react": [
        {"title": "React Official Docs – Learn React", "type": "documentation", "depth": "beginner", "url": "https://react.dev/learn", "description": "The official interactive React tutorial."},
        {"title": "React Full Course 2024 – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=x4rFhThSX04", "description": "Complete React course with hooks and modern patterns."},
        {"title": "Awesome React (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/enaqx/awesome-react", "description": "Curated list of React libraries and resources."},
        {"title": "React Patterns – patterns.dev", "type": "documentation", "depth": "advanced", "url": "https://www.patterns.dev/react", "description": "Design patterns for modern React applications."},
        {"title": "Epic React – Kent C. Dodds", "type": "video", "depth": "advanced", "url": "https://epicreact.dev/", "description": "The most thorough advanced React training available."},
    ],

    # ── Next.js ───────────────────────────────────────────────────────────────
    "next.js": [
        {"title": "Next.js Official Learn Course", "type": "documentation", "depth": "beginner", "url": "https://nextjs.org/learn", "description": "The official interactive Next.js tutorial."},
        {"title": "Next.js Full Course – Lee Robinson", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=wm5gMKuwSYk", "description": "Complete Next.js course from a Vercel engineer."},
        {"title": "Awesome Next.js (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/unicodeveloper/awesome-nextjs", "description": "Curated collection of Next.js resources."},
        {"title": "Next.js Docs – App Router", "type": "documentation", "depth": "advanced", "url": "https://nextjs.org/docs/app", "description": "Complete App Router API reference."},
    ],

    # ── Tailwind CSS ──────────────────────────────────────────────────────────
    "tailwind css": [
        {"title": "Tailwind CSS Official Docs", "type": "documentation", "depth": "all", "url": "https://tailwindcss.com/docs", "description": "Full Tailwind utility class reference."},
        {"title": "Tailwind CSS Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=ft30zcMlFao", "description": "Beginner-friendly Tailwind video course."},
        {"title": "Awesome Tailwind (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/aniftyco/awesome-tailwindcss", "description": "Awesome list of Tailwind plugins and tools."},
    ],

    # ── Git ───────────────────────────────────────────────────────────────────
    "git": [
        {"title": "Git & GitHub Crash Course – Traversy Media", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=SWYqp7iY_Tc", "description": "1-hour Git fundamentals crash course."},
        {"title": "Pro Git Book (free)", "type": "documentation", "depth": "all", "url": "https://git-scm.com/book/en/v2", "description": "The complete, free Pro Git book."},
        {"title": "Git Flight Rules (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/k88hudson/git-flight-rules", "description": "A guide for what to do when things go wrong in Git."},
    ],
    "git & version control": [
        {"title": "Git & GitHub Crash Course – Traversy Media", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=SWYqp7iY_Tc", "description": "1-hour Git fundamentals crash course."},
        {"title": "Pro Git Book (free)", "type": "documentation", "depth": "all", "url": "https://git-scm.com/book/en/v2", "description": "The complete, free Pro Git book."},
        {"title": "Git Flight Rules (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/k88hudson/git-flight-rules", "description": "A guide for what to do when things go wrong in Git."},
    ],

    # ── Node.js ───────────────────────────────────────────────────────────────
    "node.js": [
        {"title": "Node.js Crash Course – Traversy Media", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=fBNz5xF-Kx4", "description": "60-min Node.js crash course."},
        {"title": "Node.js Official Docs", "type": "documentation", "depth": "all", "url": "https://nodejs.org/en/docs", "description": "Official Node.js API documentation."},
        {"title": "Awesome Node.js (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/sindresorhus/awesome-nodejs", "description": "Delightful Node.js packages and resources."},
        {"title": "Node.js Best Practices (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/goldbergyoni/nodebestpractices", "description": "51,000★ repo of Node.js production best practices."},
    ],
    "node.js + express": [
        {"title": "Node.js & Express Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=Oe421EPjeBE", "description": "Complete backend course with Node + Express."},
        {"title": "Express.js Official Docs", "type": "documentation", "depth": "all", "url": "https://expressjs.com/en/guide/routing.html", "description": "Official Express.js routing and middleware guide."},
        {"title": "Node.js Best Practices (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/goldbergyoni/nodebestpractices", "description": "51k★ production Node.js best practices."},
    ],

    # ── Python ────────────────────────────────────────────────────────────────
    "python": [
        {"title": "Python for Beginners – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=rfscVS0vtbw", "description": "4-hour complete Python beginner course."},
        {"title": "Python Official Tutorial", "type": "documentation", "depth": "beginner", "url": "https://docs.python.org/3/tutorial/", "description": "The official Python language tutorial."},
        {"title": "Fluent Python (Code samples on GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/fluentpython/example-code-2e", "description": "Code examples from the advanced Fluent Python book."},
        {"title": "Real Python Tutorials", "type": "documentation", "depth": "all", "url": "https://realpython.com/", "description": "Practical Python tutorials for all levels."},
    ],
    "python for data science": [
        {"title": "Python for Data Science – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=LHBE6Q9XlzI", "description": "Data science with Python, NumPy, and Pandas."},
        {"title": "Kaggle Python Course (free)", "type": "documentation", "depth": "beginner", "url": "https://www.kaggle.com/learn/python", "description": "Hands-on Python course with exercises."},
        {"title": "Data Science Cheatsheets (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/FavioVazquez/ds-cheatsheets", "description": "Comprehensive data science cheatsheets collection."},
    ],

    # ── PostgreSQL ────────────────────────────────────────────────────────────
    "postgresql": [
        {"title": "PostgreSQL Tutorial (full)", "type": "documentation", "depth": "beginner", "url": "https://www.postgresqltutorial.com/", "description": "Comprehensive free PostgreSQL tutorial."},
        {"title": "PostgreSQL: Learn the Basics – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=qw--VYLpxG4", "description": "Beginner PostgreSQL with practical examples."},
        {"title": "Awesome PostgreSQL (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/dhamaniasad/awesome-postgres", "description": "Curated list of PostgreSQL resources and tools."},
        {"title": "Use The Index, Luke!", "type": "documentation", "depth": "advanced", "url": "https://use-the-index-luke.com/", "description": "A guide to database indexing and query optimization."},
    ],
    "postgresql / mysql": [
        {"title": "SQL Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY", "description": "Complete SQL course covering PostgreSQL & MySQL."},
        {"title": "PostgreSQL Tutorial", "type": "documentation", "depth": "beginner", "url": "https://www.postgresqltutorial.com/", "description": "Comprehensive free PostgreSQL tutorial site."},
        {"title": "Awesome PostgreSQL (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/dhamaniasad/awesome-postgres", "description": "Curated PostgreSQL tools and resources."},
        {"title": "Use The Index, Luke – SQL optimization", "type": "documentation", "depth": "advanced", "url": "https://use-the-index-luke.com/", "description": "A guide to SQL indexing and performance tuning."},
    ],

    # ── MongoDB ───────────────────────────────────────────────────────────────
    "mongodb": [
        {"title": "MongoDB Full Course – Beau Carnes (freeCodeCamp)", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=ExcRbA7fy_A", "description": "Complete MongoDB beginner course."},
        {"title": "MongoDB Official Docs", "type": "documentation", "depth": "all", "url": "https://www.mongodb.com/docs/", "description": "The official MongoDB documentation."},
        {"title": "Awesome MongoDB (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/ramnes/awesome-mongodb", "description": "Curated MongoDB libraries and resources."},
    ],
    "mongodb / redis": [
        {"title": "MongoDB & Mongoose Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=ExcRbA7fy_A", "description": "MongoDB with Mongoose crash course."},
        {"title": "Redis University (free)", "type": "documentation", "depth": "all", "url": "https://university.redis.com/", "description": "Free Redis courses from Redis Labs."},
        {"title": "Redis Official Docs", "type": "documentation", "depth": "advanced", "url": "https://redis.io/docs/", "description": "Complete Redis command and pattern reference."},
    ],

    # ── Docker ────────────────────────────────────────────────────────────────
    "docker": [
        {"title": "Docker Full Course – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=3c-iBn73dDE", "description": "3-hour complete Docker course."},
        {"title": "Docker Official Docs", "type": "documentation", "depth": "all", "url": "https://docs.docker.com/", "description": "Official Docker documentation and guides."},
        {"title": "Awesome Docker (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/veggiemonk/awesome-docker", "description": "Curated list of Docker resources and tools."},
        {"title": "Docker Deep Dive (Nigel Poulton samples)", "type": "github", "depth": "advanced", "url": "https://github.com/nigelpoulton/docker-deep-dive", "description": "Code samples from the Docker Deep Dive book."},
    ],
    "dockerfile": [
        {"title": "Dockerfile Best Practices – Docker Docs", "type": "documentation", "depth": "all", "url": "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", "description": "Official Dockerfile best practices guide."},
        {"title": "Docker Full Course – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=3c-iBn73dDE", "description": "Complete Docker tutorial covering Dockerfiles."},
    ],
    "docker compose": [
        {"title": "Docker Compose Documentation", "type": "documentation", "depth": "all", "url": "https://docs.docker.com/compose/", "description": "Official Docker Compose reference."},
        {"title": "Docker Compose Tutorial – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=SXwC9fSwct8", "description": "Hands-on Docker Compose crash course."},
        {"title": "Awesome Compose (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/docker/awesome-compose", "description": "Docker Compose example apps for many stacks."},
    ],

    # ── Kubernetes ────────────────────────────────────────────────────────────
    "kubernetes": [
        {"title": "Kubernetes Full Course – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=X48VuDVv0do", "description": "4-hour complete Kubernetes beginner course."},
        {"title": "Kubernetes Official Docs", "type": "documentation", "depth": "all", "url": "https://kubernetes.io/docs/home/", "description": "The official Kubernetes documentation."},
        {"title": "Kubernetes The Hard Way (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/kelseyhightower/kubernetes-the-hard-way", "description": "Bootstrap k8s the hard way — no scripts, full learning."},
        {"title": "Awesome Kubernetes (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/ramitsurana/awesome-kubernetes", "description": "Curated collection of Kubernetes resources."},
    ],
    "kubernetes architecture": [
        {"title": "Kubernetes Architecture Explained – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=umXEmn3cMWY", "description": "Visual breakdown of the Kubernetes control plane."},
        {"title": "Kubernetes Docs – Cluster Architecture", "type": "documentation", "depth": "all", "url": "https://kubernetes.io/docs/concepts/architecture/", "description": "Official k8s cluster architecture concepts."},
    ],
    "helm charts": [
        {"title": "Helm Docs – Getting Started", "type": "documentation", "depth": "beginner", "url": "https://helm.sh/docs/intro/quickstart/", "description": "Official Helm quickstart guide."},
        {"title": "Helm Full Course – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=-ykwb1d0DXU", "description": "Complete Helm video course."},
        {"title": "Artifact Hub – Helm Charts", "type": "documentation", "depth": "all", "url": "https://artifacthub.io/", "description": "Browse and discover Helm charts."},
    ],

    # ── CI/CD ─────────────────────────────────────────────────────────────────
    "github actions": [
        {"title": "GitHub Actions Full Course – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=R8_veQiYBjI", "description": "Complete GitHub Actions tutorial."},
        {"title": "GitHub Actions Docs", "type": "documentation", "depth": "all", "url": "https://docs.github.com/en/actions", "description": "Official GitHub Actions documentation."},
        {"title": "Awesome GitHub Actions (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/sdras/awesome-actions", "description": "Curated list of reusable GitHub Actions."},
    ],

    # ── Terraform ─────────────────────────────────────────────────────────────
    "terraform": [
        {"title": "Terraform Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=SLB_c_ayRMo", "description": "Complete Terraform Infrastructure as Code course."},
        {"title": "Terraform Official Docs", "type": "documentation", "depth": "all", "url": "https://developer.hashicorp.com/terraform/docs", "description": "Official Terraform language and provider docs."},
        {"title": "Terraform Best Practices (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/ozbillwang/terraform-best-practices", "description": "Terraform best practices guide for teams."},
    ],

    # ── AWS ───────────────────────────────────────────────────────────────────
    "aws": [
        {"title": "AWS Beginner Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=3hLmDS179YE", "description": "Complete AWS fundamentals for beginners."},
        {"title": "AWS Documentation", "type": "documentation", "depth": "all", "url": "https://docs.aws.amazon.com/", "description": "Official AWS service documentation."},
        {"title": "Awesome AWS (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/donnemartin/awesome-aws", "description": "Curated list of AWS resources and tools."},
        {"title": "AWS Solutions Architect – Study Guide (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/keenanromain/AWS-SAA-C02-Study-Guide", "description": "Community study guide for AWS Solutions Architect."},
    ],
    "aws / gcp / azure core services": [
        {"title": "AWS Beginner Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=3hLmDS179YE", "description": "Complete AWS fundamentals for beginners."},
        {"title": "Google Cloud Skills Boost (free tier)", "type": "documentation", "depth": "all", "url": "https://cloudskillsboost.google/", "description": "Free hands-on GCP labs and courses."},
        {"title": "Microsoft Learn – Azure", "type": "documentation", "depth": "all", "url": "https://learn.microsoft.com/en-us/azure/", "description": "Free Azure learning paths from Microsoft."},
    ],

    # ── Linux CLI ─────────────────────────────────────────────────────────────
    "linux cli": [
        {"title": "Linux Command Line Tutorial – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=ZtqBQ68cfJc", "description": "Complete Linux CLI tutorial for beginners."},
        {"title": "The Linux Command Line (free book)", "type": "documentation", "depth": "all", "url": "https://linuxcommand.org/tlcl.php", "description": "Free comprehensive Linux CLI book."},
        {"title": "Linux Journey (interactive)", "type": "documentation", "depth": "beginner", "url": "https://linuxjourney.com/", "description": "Interactive Linux fundamentals learning site."},
    ],

    # ── PyTorch / Deep Learning ───────────────────────────────────────────────
    "pytorch / tensorflow": [
        {"title": "PyTorch Full Course – Daniel Bourke", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=Z_ikDlimN6A", "description": "25-hour complete PyTorch for deep learning."},
        {"title": "PyTorch Official Tutorials", "type": "documentation", "depth": "all", "url": "https://pytorch.org/tutorials/", "description": "Official PyTorch tutorials and guides."},
        {"title": "TensorFlow Official Tutorials", "type": "documentation", "depth": "all", "url": "https://www.tensorflow.org/tutorials", "description": "Official TensorFlow tutorials and quickstarts."},
        {"title": "d2l.ai – Dive into Deep Learning (GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/d2l-ai/d2l-en", "description": "Interactive deep learning textbook (50k+ stars)."},
    ],

    # ── LLMs / RAG ────────────────────────────────────────────────────────────
    "langchain / llamaindex": [
        {"title": "LangChain Crash Course – Greg Kamradt", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=_v_fgW2SkkQ", "description": "LangChain fundamentals for LLM application building."},
        {"title": "LangChain Official Docs", "type": "documentation", "depth": "all", "url": "https://python.langchain.com/docs/get_started/introduction", "description": "Complete LangChain documentation."},
        {"title": "LlamaIndex Docs", "type": "documentation", "depth": "advanced", "url": "https://docs.llamaindex.ai/", "description": "Build RAG applications with LlamaIndex."},
        {"title": "Awesome LLM (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/Hannibal046/Awesome-LLM", "description": "Curated list of LLM papers, tools, and projects."},
    ],
    "rag (retrieval augmented generation)": [
        {"title": "RAG from Scratch – LangChain", "type": "video", "depth": "intermediate", "url": "https://www.youtube.com/watch?v=sVcwVQRHIc8", "description": "Build RAG from scratch step-by-step with LangChain."},
        {"title": "Vector Database Intro – Pinecone", "type": "documentation", "depth": "beginner", "url": "https://www.pinecone.io/learn/vector-database/", "description": "Understanding vector databases for RAG systems."},
        {"title": "RAG Survey Paper", "type": "documentation", "depth": "advanced", "url": "https://arxiv.org/abs/2312.10997", "description": "Comprehensive academic survey on RAG systems."},
    ],

    # ── Scikit-Learn / ML Core ────────────────────────────────────────────────
    "scikit-learn": [
        {"title": "Scikit-Learn Crash Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=pqNCD_5r0IU", "description": "Complete scikit-learn beginner tutorial."},
        {"title": "Scikit-Learn User Guide", "type": "documentation", "depth": "all", "url": "https://scikit-learn.org/stable/user_guide.html", "description": "The official scikit-learn user guide."},
        {"title": "Hands-On ML (code on GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/ageron/handson-ml3", "description": "Code for Hands-On Machine Learning book (3rd ed)."},
    ],

    # ── SQL ───────────────────────────────────────────────────────────────────
    "sql": [
        {"title": "SQL Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY", "description": "Complete SQL course — 4 hours."},
        {"title": "SQLZoo – Interactive SQL", "type": "documentation", "depth": "beginner", "url": "https://sqlzoo.net/", "description": "Interactive SQL exercises directly in the browser."},
        {"title": "Mode SQL Tutorial", "type": "documentation", "depth": "all", "url": "https://mode.com/sql-tutorial/", "description": "Mode's structured SQL tutorial for data analysis."},
        {"title": "SQL Antipatterns (GitHub examples)", "type": "github", "depth": "advanced", "url": "https://github.com/bill-roth/sql-antipatterns", "description": "Common SQL mistakes and how to avoid them."},
    ],

    # ── JWT / Authentication ──────────────────────────────────────────────────
    "jwt / oauth2": [
        {"title": "JWT Authentication – Web Dev Simplified", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=mbsmsi7l3r4", "description": "JWT authentication with Node.js explained."},
        {"title": "JWT.io Introduction", "type": "documentation", "depth": "beginner", "url": "https://jwt.io/introduction", "description": "Official JWT introduction and debugger."},
        {"title": "OAuth 2.0 Simplified", "type": "documentation", "depth": "all", "url": "https://www.oauth.com/", "description": "A comprehensive, readable OAuth 2.0 guide."},
    ],
    "authentication (jwt)": [
        {"title": "JWT Authentication – Web Dev Simplified", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=mbsmsi7l3r4", "description": "JWT auth with Node.js, access + refresh tokens."},
        {"title": "JWT.io Introduction", "type": "documentation", "depth": "beginner", "url": "https://jwt.io/introduction", "description": "Official JWT spec and debugger tool."},
    ],

    # ── Redux / State Management ───────────────────────────────────────────────
    "state management (redux/zustand/pinia)": [
        {"title": "Redux Toolkit Tutorial – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=bbkBuqC1rU4", "description": "Complete Redux Toolkit course."},
        {"title": "Redux Official Docs", "type": "documentation", "depth": "all", "url": "https://redux.js.org/introduction/getting-started", "description": "Official Redux documentation."},
        {"title": "Zustand GitHub Repo", "type": "github", "depth": "all", "url": "https://github.com/pmndrs/zustand", "description": "Zustand – minimal state management for React."},
    ],
    "state management (redux/zustand)": [
        {"title": "Redux Toolkit Tutorial – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=bbkBuqC1rU4", "description": "Complete Redux Toolkit tutorial."},
        {"title": "Zustand GitHub Repo", "type": "github", "depth": "all", "url": "https://github.com/pmndrs/zustand", "description": "Bear-minimum state management for React."},
    ],

    # ── Pandas / NumPy ────────────────────────────────────────────────────────
    "pandas": [
        {"title": "Pandas Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=gtjxAH8uaP0", "description": "Complete Pandas for data analysis."},
        {"title": "Pandas Official Docs", "type": "documentation", "depth": "all", "url": "https://pandas.pydata.org/docs/user_guide/index.html", "description": "Official Pandas user guide."},
        {"title": "Pandas Exercises (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/guipsamora/pandas_exercises", "description": "Practice Pandas with real exercises."},
    ],
    "numpy / pandas": [
        {"title": "NumPy & Pandas Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=LHBE6Q9XlzI", "description": "NumPy and Pandas for data science."},
        {"title": "NumPy Official Docs", "type": "documentation", "depth": "all", "url": "https://numpy.org/doc/stable/", "description": "Official NumPy documentation."},
        {"title": "Pandas Exercises (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/guipsamora/pandas_exercises", "description": "Practice exercises for Pandas mastery."},
    ],

    # ── HTTP/HTTPS / Networking ───────────────────────────────────────────────
    "http/https": [
        {"title": "HTTP Crash Course – Traversy Media", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=iYM2zFP3Zn0", "description": "HTTP & HTTPS explained clearly."},
        {"title": "MDN HTTP Overview", "type": "documentation", "depth": "all", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "description": "MDN's authoritative HTTP reference."},
        {"title": "HTTP: The Definitive Guide (summaries on GitHub)", "type": "github", "depth": "advanced", "url": "https://github.com/alex/what-happens-when", "description": "What happens when you type a URL – deep dive."},
    ],

    # ── Framer Motion ────────────────────────────────────────────────────────
    "framer motion": [
        {"title": "Framer Motion Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=znbCa4Rr054", "description": "Complete Framer Motion animation course."},
        {"title": "Framer Motion Official Docs", "type": "documentation", "depth": "all", "url": "https://www.framer.com/motion/", "description": "Official Framer Motion API documentation."},
    ],

    # ── Microservices / Architecture ──────────────────────────────────────────
    "microservices": [
        {"title": "Microservices Explained – TechWorld with Nana", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=rv4LlmLmVWk", "description": "Microservices architecture explained visually."},
        {"title": "Microservices Patterns – Chris Richardson", "type": "documentation", "depth": "advanced", "url": "https://microservices.io/patterns/index.html", "description": "Catalog of microservices design patterns."},
        {"title": "Awesome Microservices (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/mfornos/awesome-microservices", "description": "Curated list of microservices tools and frameworks."},
    ],

    # ── GraphQL ───────────────────────────────────────────────────────────────
    "graphql": [
        {"title": "GraphQL Full Course – freeCodeCamp", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=ed8SzALpx1Q", "description": "Complete GraphQL course — queries, mutations, subscriptions."},
        {"title": "GraphQL Official Docs", "type": "documentation", "depth": "all", "url": "https://graphql.org/learn/", "description": "Official GraphQL learning guide."},
        {"title": "Awesome GraphQL (GitHub)", "type": "github", "depth": "all", "url": "https://github.com/chentsulin/awesome-graphql", "description": "Curated list of GraphQL resources and tools."},
    ],

    # ── Redis ─────────────────────────────────────────────────────────────────
    "redis": [
        {"title": "Redis Crash Course – Traversy Media", "type": "video", "depth": "beginner", "url": "https://www.youtube.com/watch?v=jgpVdJB2sKQ", "description": "Redis basics in under an hour."},
        {"title": "Redis University", "type": "documentation", "depth": "all", "url": "https://university.redis.com/", "description": "Free Redis training and certifications."},
        {"title": "Redis Official Docs", "type": "documentation", "depth": "all", "url": "https://redis.io/docs/", "description": "Redis commands and patterns reference."},
    ],
    "redis caching": [
        {"title": "Redis Caching Strategies – Fireship", "type": "video", "depth": "all", "url": "https://www.youtube.com/watch?v=jgpVdJB2sKQ", "description": "Redis caching patterns explained quickly."},
        {"title": "Redis – Caching Use Cases", "type": "documentation", "depth": "all", "url": "https://redis.io/docs/manual/patterns/", "description": "Official Redis caching and pattern guide."},
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# GITHUB FALLBACK
# ─────────────────────────────────────────────────────────────────────────────
def get_github_repos(topic: str, style: str = "video", limit: int = 3) -> list:
    """Fetch top-starred GitHub repos as a fallback for uncurated topics."""
    if not HAS_REQUESTS:
        return []

    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    style_keywords = {
        "video": "course tutorial walkthrough",
        "documentation": "docs documentation guide handbook awesome",
        "project_based": "example project sample clone boilerplate",
        "interactive": "interactive playground exercise lab",
    }
    keywords = style_keywords.get(style, "")
    query = f"{topic} {keywords} stars:>50"
    url = f"https://api.github.com/search/repositories?q={query}&sort=stars&order=desc"

    try:
        resp = requests.get(url, headers=headers, timeout=8)
        resp.raise_for_status()
        items = resp.json().get("items", [])[:limit]
        results = []
        for item in items:
            title = item["full_name"].split("/")[-1].replace("-", " ").replace("_", " ").title()
            results.append({
                "title": title,
                "type": "github",
                "depth": "all",
                "url": item["html_url"],
                "description": item.get("description") or "",
                "stars": item["stargazers_count"],
                "readme_url": f"https://raw.githubusercontent.com/{item['full_name']}/{item['default_branch']}/README.md",
            })
        return results
    except Exception as e:
        print(f"[fetch_resources] GitHub fallback failed for '{topic}': {e}", file=sys.stderr)
        return []


def normalize_key(skill: str) -> str:
    """Normalize a skill string to a registry key."""
    return re.sub(r"\s+", " ", skill.strip().lower())


def filter_by_depth(resources: list, experience: str) -> list:
    """Filter curated resources by experience depth."""
    if experience == "beginner":
        return [r for r in resources if r.get("depth") in ("beginner", "all")]
    elif experience == "advanced":
        return [r for r in resources if r.get("depth") in ("advanced", "all")]
    else:
        # intermediate: return all depths, sort so beginner comes first
        return resources


def fetch_resources(topics: list, style: str = "video", experience: str = "beginner") -> dict:
    """
    Retrieve resources for a list of topics.
    Returns a dict: { topic_key: [resource, ...] }
    """
    result = {}
    for topic in topics:
        key = normalize_key(topic)
        if not key:
            continue

        # 1. Try exact match in curated registry
        resources = CURATED.get(key)

        # 2. Try partial match (for compound keys like "node.js + express")
        if not resources:
            for curated_key, curated_resources in CURATED.items():
                if key in curated_key or curated_key in key:
                    resources = curated_resources
                    break

        if resources:
            # Filter by experience depth, then filter by style preference
            depth_filtered = filter_by_depth(resources, experience)
            # Prefer matching style but always include documentation as fallback
            style_match = [r for r in depth_filtered if r["type"] == style]
            other = [r for r in depth_filtered if r["type"] != style]
            ordered = style_match + other
            result[key] = ordered[:5]  # max 5 per topic
        else:
            # 3. Fallback to GitHub API
            github_results = get_github_repos(topic, style)
            result[key] = github_results

    return result


def main():
    parser = argparse.ArgumentParser(description="Fetch resources for given topics.")
    parser.add_argument("--topics", required=True, help="Comma-separated list of topics")
    parser.add_argument("--style", default="video", help="Learning style: video | documentation | project_based | interactive")
    parser.add_argument("--experience", default="beginner", help="Depth tier: beginner | intermediate | advanced")
    args = parser.parse_args()

    topics = [t.strip() for t in args.topics.split(",") if t.strip()]
    resources = fetch_resources(topics, args.style, args.experience)
    print(json.dumps(resources, indent=2))


if __name__ == "__main__":
    main()
