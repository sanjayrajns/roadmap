"""
fetch_resources.py — Deterministic Resource Discovery Engine

Accepts a comma-separated list of topics and returns curated learning
resources (documentation, tutorials, projects) for each.

Usage:
    python tools/fetch_resources.py --topics "HTML,CSS,React"
"""

import argparse
import json

# ── Deterministic Resource Database ──────────────────────────────────
# Maps lowercase topic keys to curated resource arrays.
# This is the authoritative source; no LLM randomness involved.

RESOURCE_DB: dict[str, list[dict]] = {
    "html": [
        {"title": "MDN HTML Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML"},
        {"title": "HTML Crash Course – Traversy Media", "type": "video", "url": "https://www.youtube.com/watch?v=UB1O30fR-EE"},
        {"title": "Build a Personal Portfolio", "type": "project", "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/"},
    ],
    "css": [
        {"title": "MDN CSS Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS"},
        {"title": "CSS Flexbox & Grid – Kevin Powell", "type": "video", "url": "https://www.youtube.com/watch?v=JJSoEo8JSnc"},
        {"title": "CSS Challenges – Frontend Mentor", "type": "project", "url": "https://www.frontendmentor.io/challenges"},
    ],
    "javascript": [
        {"title": "javascript.info", "type": "documentation", "url": "https://javascript.info/"},
        {"title": "JavaScript Full Course – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=PkZNo7MFNFg"},
        {"title": "30 Days of JavaScript", "type": "project", "url": "https://github.com/Asabeneh/30-Days-Of-JavaScript"},
    ],
    "react": [
        {"title": "React Official Docs", "type": "documentation", "url": "https://react.dev/learn"},
        {"title": "React Full Course – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8"},
        {"title": "Build a Movie App with React", "type": "project", "url": "https://github.com/adrianhajdin/project_movie_app"},
    ],
    "typescript": [
        {"title": "TypeScript Handbook", "type": "documentation", "url": "https://www.typescriptlang.org/docs/handbook/"},
        {"title": "TypeScript Course – Net Ninja", "type": "video", "url": "https://www.youtube.com/watch?v=2pZmKW9-I_k&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI"},
        {"title": "Type Challenges", "type": "interactive", "url": "https://github.com/type-challenges/type-challenges"},
    ],
    "node": [
        {"title": "Node.js Official Docs", "type": "documentation", "url": "https://nodejs.org/en/docs/"},
        {"title": "Node.js Crash Course – Traversy Media", "type": "video", "url": "https://www.youtube.com/watch?v=fBNz5xF-Kx4"},
        {"title": "Build a REST API with Express", "type": "project", "url": "https://expressjs.com/en/starter/hello-world.html"},
    ],
    "python": [
        {"title": "Python Official Tutorial", "type": "documentation", "url": "https://docs.python.org/3/tutorial/"},
        {"title": "Python for Everybody – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=8DvywoWv6fI"},
        {"title": "100 Days of Code – Python", "type": "project", "url": "https://www.udemy.com/course/100-days-of-code/"},
    ],
    "git": [
        {"title": "Git Official Book", "type": "documentation", "url": "https://git-scm.com/book/en/v2"},
        {"title": "Git & GitHub Crash Course – Traversy Media", "type": "video", "url": "https://www.youtube.com/watch?v=SWYqp7iY_Tc"},
        {"title": "Learn Git Branching", "type": "interactive", "url": "https://learngitbranching.js.org/"},
    ],
    "docker": [
        {"title": "Docker Official Docs", "type": "documentation", "url": "https://docs.docker.com/get-started/"},
        {"title": "Docker Crash Course – TechWorld with Nana", "type": "video", "url": "https://www.youtube.com/watch?v=3c-iBn73dDE"},
        {"title": "Dockerize a Node.js App", "type": "project", "url": "https://nodejs.org/en/docs/guides/nodejs-docker-webapp"},
    ],
    "kubernetes": [
        {"title": "Kubernetes Official Docs", "type": "documentation", "url": "https://kubernetes.io/docs/home/"},
        {"title": "Kubernetes Crash Course – TechWorld with Nana", "type": "video", "url": "https://www.youtube.com/watch?v=s_o8dwzRlu4"},
        {"title": "Kubernetes the Hard Way", "type": "project", "url": "https://github.com/kelseyhightower/kubernetes-the-hard-way"},
    ],
    "databases": [
        {"title": "PostgreSQL Tutorial", "type": "documentation", "url": "https://www.postgresqltutorial.com/"},
        {"title": "SQL Full Course – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY"},
        {"title": "Build a CRUD App with PostgreSQL", "type": "project", "url": "https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/"},
    ],
    "apis": [
        {"title": "RESTful API Design – Microsoft", "type": "documentation", "url": "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design"},
        {"title": "REST API Tutorial – Programming with Mosh", "type": "video", "url": "https://www.youtube.com/watch?v=pKd0Rpw7O48"},
        {"title": "Build a REST API from Scratch", "type": "project", "url": "https://expressjs.com/en/starter/hello-world.html"},
    ],
    "frameworks": [
        {"title": "Next.js Official Docs", "type": "documentation", "url": "https://nextjs.org/docs"},
        {"title": "Next.js Full Course – JavaScript Mastery", "type": "video", "url": "https://www.youtube.com/watch?v=wm5gMKuwSYk"},
        {"title": "Build a Full Stack App with Next.js", "type": "project", "url": "https://nextjs.org/learn"},
    ],
    "state management": [
        {"title": "Redux Official Docs", "type": "documentation", "url": "https://redux.js.org/introduction/getting-started"},
        {"title": "Redux Toolkit Tutorial – Net Ninja", "type": "video", "url": "https://www.youtube.com/watch?v=bbkBuqC1rU4"},
        {"title": "Build a Shopping Cart with Redux", "type": "project", "url": "https://github.com/reduxjs/redux/tree/master/examples/shopping-cart"},
    ],
    "scaling": [
        {"title": "System Design Primer", "type": "documentation", "url": "https://github.com/donnemartin/system-design-primer"},
        {"title": "System Design – Gaurav Sen", "type": "video", "url": "https://www.youtube.com/c/GauravSensei"},
        {"title": "Design a URL Shortener", "type": "project", "url": "https://github.com/donnemartin/system-design-primer#design-pastebin.com-or-bit.ly"},
    ],
    "basic dom manipulation": [
        {"title": "MDN DOM Manipulation", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents"},
        {"title": "JavaScript DOM Tutorial – Net Ninja", "type": "video", "url": "https://www.youtube.com/watch?v=FIORjGvT0kk&list=PL4cUxeGkcC9gfoKa5la9dsdCNpuey2C-6"},
        {"title": "Build a Todo App with Vanilla JS", "type": "project", "url": "https://freshman.tech/todo-list/"},
    ],
    "internet basics": [
        {"title": "How Does the Internet Work? – MDN", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work"},
        {"title": "How The Internet Works – Fireship", "type": "video", "url": "https://www.youtube.com/watch?v=7_LPdttKXPc"},
    ],
    "http protocols": [
        {"title": "MDN HTTP Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP"},
        {"title": "HTTP Crash Course – Traversy Media", "type": "video", "url": "https://www.youtube.com/watch?v=iYM2zFP3Zn0"},
    ],
    "basic terminal": [
        {"title": "Linux Command Line Basics – Ubuntu", "type": "documentation", "url": "https://ubuntu.com/tutorials/command-line-for-beginners"},
        {"title": "Command Line Crash Course – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=yz7nYlnXLfE"},
    ],
    "semantic html": [
        {"title": "MDN Semantic HTML", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html"},
        {"title": "Semantic HTML5 Elements – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=kGW8Al_cga4"},
    ],
    "forms": [
        {"title": "MDN Web Forms Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/Forms"},
        {"title": "HTML Forms Crash Course – Traversy Media", "type": "video", "url": "https://www.youtube.com/watch?v=fNcJuPIZ2WE"},
    ],
    "accessibility": [
        {"title": "MDN Accessibility Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Web/Accessibility"},
        {"title": "Web Accessibility – Udacity (Free)", "type": "video", "url": "https://www.udacity.com/course/web-accessibility--ud891"},
    ],
    # ── Machine Learning / AI ──
    "machine learning": [
        {"title": "Google ML Crash Course", "type": "documentation", "url": "https://developers.google.com/machine-learning/crash-course"},
        {"title": "Machine Learning – Andrew Ng (Coursera)", "type": "video", "url": "https://www.coursera.org/learn/machine-learning"},
        {"title": "Scikit-Learn Tutorial", "type": "project", "url": "https://scikit-learn.org/stable/tutorial/"},
    ],
    "deep learning": [
        {"title": "Deep Learning Book – Goodfellow", "type": "documentation", "url": "https://www.deeplearningbook.org/"},
        {"title": "Deep Learning Specialization – Andrew Ng", "type": "video", "url": "https://www.coursera.org/specializations/deep-learning"},
        {"title": "PyTorch Tutorials", "type": "project", "url": "https://pytorch.org/tutorials/"},
    ],
    "tensorflow": [
        {"title": "TensorFlow Official Docs", "type": "documentation", "url": "https://www.tensorflow.org/learn"},
        {"title": "TensorFlow in 10 Minutes – Fireship", "type": "video", "url": "https://www.youtube.com/watch?v=tPYj3fFJGjk"},
    ],
    # ── Mobile ──
    "react native": [
        {"title": "React Native Official Docs", "type": "documentation", "url": "https://reactnative.dev/docs/getting-started"},
        {"title": "React Native Crash Course – Traversy Media", "type": "video", "url": "https://www.youtube.com/watch?v=Hf4MJH0jDb4"},
        {"title": "Build a Weather App with React Native", "type": "project", "url": "https://github.com/nathvarun/React-Native-Weather-App"},
    ],
    "flutter": [
        {"title": "Flutter Official Docs", "type": "documentation", "url": "https://docs.flutter.dev/"},
        {"title": "Flutter Course – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=VPvVD8t02U8"},
        {"title": "Build a Chat App with Flutter", "type": "project", "url": "https://firebase.google.com/codelabs/flutter-firebase"},
    ],
    # ── DevOps / Infra ──
    "ci/cd": [
        {"title": "GitHub Actions Docs", "type": "documentation", "url": "https://docs.github.com/en/actions"},
        {"title": "GitHub Actions Tutorial – TechWorld with Nana", "type": "video", "url": "https://www.youtube.com/watch?v=R8_veQiYBjI"},
        {"title": "Setup CI/CD for a Node.js App", "type": "project", "url": "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs"},
    ],
    "aws": [
        {"title": "AWS Getting Started", "type": "documentation", "url": "https://aws.amazon.com/getting-started/"},
        {"title": "AWS Certified Cloud Practitioner – freeCodeCamp", "type": "video", "url": "https://www.youtube.com/watch?v=3hLmDS179YE"},
    ],
}


def fetch_resources(topics: list[str]) -> dict[str, list[dict]]:
    """Retrieve resources for a list of topics from the deterministic database."""
    result = {}
    for topic in topics:
        key = topic.strip().lower()
        if key in RESOURCE_DB:
            result[key] = RESOURCE_DB[key]
        else:
            # Fallback: try partial match
            for db_key in RESOURCE_DB:
                if key in db_key or db_key in key:
                    result[key] = RESOURCE_DB[db_key]
                    break
            # If still not found, generate a generic search link
            if key not in result:
                result[key] = [
                    {"title": f"{topic} – MDN Search", "type": "documentation", "url": f"https://developer.mozilla.org/en-US/search?q={topic.replace(' ', '+')}"},
                    {"title": f"{topic} – YouTube Search", "type": "video", "url": f"https://www.youtube.com/results?search_query={topic.replace(' ', '+')}+tutorial"},
                ]
    return result


def main():
    parser = argparse.ArgumentParser(description='Fetch curated learning resources for given topics.')
    parser.add_argument('--topics', required=True, help='Comma-separated list of topics')
    args = parser.parse_args()

    topics = [t.strip() for t in args.topics.split(',') if t.strip()]
    resources = fetch_resources(topics)
    print(json.dumps(resources, indent=2))


if __name__ == "__main__":
    main()
