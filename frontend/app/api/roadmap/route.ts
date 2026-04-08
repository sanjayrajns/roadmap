import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

// ── Native Typescript Deterministic Roadmap Generator ─────────────────────────
function generateMockRoadmap(role: string) {
  return {
    role,
    stages: [
      {
        stage_name: `Fundamentals of ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        skills: role === 'frontend' ? ["HTML", "CSS", "Basic DOM Manipulation"] : ["Internet Basics", "HTTP Protocols", "Basic Terminal"],
        recommended_projects: ["Personal Portfolio", "Basic CRUD Script"]
      },
      {
        stage_name: `Advanced ${role.charAt(0).toUpperCase() + role.slice(1)} Patterns`,
        skills: role === 'frontend' ? ["Frameworks", "State Management"] : ["Databases", "APIs", "Scaling"],
        recommended_projects: ["Fullstack Clone", "Microservice Wrapper"]
      }
    ]
  };
}

function trimRoadmap(rawRoadmap: any, userGoals: any) {
  const experience = userGoals.experience_level || "beginner";
  const timeCommit = userGoals.time_commitment || 10;
  
  let stages = rawRoadmap.stages || [];
  
  // AI Logic: remove fundamentals for advanced users
  if (experience === 'advanced') {
    stages = stages.filter((s: any) => !s.stage_name.toLowerCase().includes('fundamental'));
  }
  
  // AI Logic: reduce recommended projects if low time commitment
  if (timeCommit < 10) {
    stages.forEach((stage: any) => {
      if (stage.recommended_projects?.length > 1) {
        stage.recommended_projects = [stage.recommended_projects[0]];
      }
    });
  }

  return {
    role: rawRoadmap.role || "unknown",
    stages
  };
}

// ── Native Typescript Resource Engine ──────────────────────────────────────────
const RESOURCE_DB: Record<string, any[]> = {
  "html": [
      {"title": "MDN HTML Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML"},
      {"title": "HTML Crash Course", "type": "video", "url": "https://www.youtube.com/watch?v=UB1O30fR-EE"},
      {"title": "Build a Portfolio", "type": "project", "url": "https://www.freecodecamp.org/"},
  ],
  "css": [
      {"title": "MDN CSS Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS"},
      {"title": "CSS Flexbox & Grid", "type": "video", "url": "https://www.youtube.com/watch?v=JJSoEo8JSnc"},
      {"title": "CSS Challenges", "type": "project", "url": "https://www.frontendmentor.io/challenges"},
  ],
  "react": [
      {"title": "React Official Docs", "type": "documentation", "url": "https://react.dev/learn"},
      {"title": "React Full Course", "type": "video", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8"},
      {"title": "Build a Movie App", "type": "project", "url": "https://github.com/adrianhajdin/project_movie_app"},
  ],
  "javascript": [
      {"title": "javascript.info", "type": "documentation", "url": "https://javascript.info/"},
      {"title": "JavaScript Course", "type": "video", "url": "https://www.youtube.com/watch?v=PkZNo7MFNFg"},
      {"title": "30 Days of JS", "type": "project", "url": "https://github.com/Asabeneh/30-Days-Of-JavaScript"},
  ],
  "node": [
      {"title": "Node.js Official Docs", "type": "documentation", "url": "https://nodejs.org/en/docs/"},
      {"title": "Node.js Crash Course", "type": "video", "url": "https://www.youtube.com/watch?v=fBNz5xF-Kx4"},
  ],
  "python": [
      {"title": "Python Official Tutorial", "type": "documentation", "url": "https://docs.python.org/3/tutorial/"},
      {"title": "Python for Everybody", "type": "video", "url": "https://www.youtube.com/watch?v=8DvywoWv6fI"},
  ],
  "databases": [
      {"title": "PostgreSQL Tutorial", "type": "documentation", "url": "https://www.postgresqltutorial.com/"},
      {"title": "SQL Full Course", "type": "video", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY"},
  ],
  "apis": [
      {"title": "REST API Design", "type": "documentation", "url": "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design"},
      {"title": "REST API Tutorial", "type": "video", "url": "https://www.youtube.com/watch?v=pKd0Rpw7O48"},
  ],
  "frameworks": [
      {"title": "Next.js Official Docs", "type": "documentation", "url": "https://nextjs.org/docs"},
      {"title": "Next.js Full Course", "type": "video", "url": "https://www.youtube.com/watch?v=wm5gMKuwSYk"},
  ],
  "state management": [
      {"title": "Redux Official Docs", "type": "documentation", "url": "https://redux.js.org/introduction/getting-started"},
      {"title": "Redux Toolkit Tutorial", "type": "video", "url": "https://www.youtube.com/watch?v=bbkBuqC1rU4"},
  ],
  "scaling": [
      {"title": "System Design Primer", "type": "documentation", "url": "https://github.com/donnemartin/system-design-primer"},
      {"title": "System Design Video", "type": "video", "url": "https://www.youtube.com/c/GauravSensei"},
  ],
  "basic dom manipulation": [
      {"title": "MDN DOM Manipulation", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents"},
      {"title": "DOM Tutorial", "type": "video", "url": "https://www.youtube.com/watch?v=FIORjGvT0kk"},
  ],
  "internet basics": [
      {"title": "How Does the Internet Work?", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work"},
  ],
  "http protocols": [
      {"title": "MDN HTTP Guide", "type": "documentation", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP"},
  ],
  "basic terminal": [
      {"title": "Linux Command Line Basics", "type": "documentation", "url": "https://ubuntu.com/tutorials/command-line-for-beginners"},
  ],
};

function fetchResources(topics: string[]): Record<string, any[]> {
  const result: Record<string, any[]> = {};
  for (const topic of topics) {
      const key = topic.trim().toLowerCase();
      if (RESOURCE_DB[key]) {
          result[key] = RESOURCE_DB[key];
      } else {
          let found = false;
          for (const dbKey in RESOURCE_DB) {
              if (key.includes(dbKey) || dbKey.includes(key)) {
                  result[key] = RESOURCE_DB[dbKey];
                  found = true;
                  break;
              }
          }
          if (!found) {
              result[key] = [
                  {"title": `${topic} – MDN Search`, "type": "documentation", "url": `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(topic)}`},
                  {"title": `${topic} – YouTube Search`, "type": "video", "url": `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+tutorial`},
              ];
          }
      }
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role_goal, experience_level, learning_style, time_commitment, interest_area, userId } = body;

    if (!role_goal) {
      return NextResponse.json({ error: 'Missing role_goal' }, { status: 400 });
    }

    const userGoals = { experience_level, learning_style, time_commitment };

    // Step 1: Generate Roadmap
    const rawRoadmap = generateMockRoadmap(role_goal);

    // Step 2: Tailor Roadmap
    const roadmapPayload = trimRoadmap(rawRoadmap, userGoals);

    // Step 3: Collect skills and fetch resources
    const allSkills: string[] = [];
    for (const stage of roadmapPayload.stages) {
      for (const skill of stage.skills || []) {
        allSkills.push(skill);
      }
    }

    const resourceMap = fetchResources(allSkills);

    // Step 4: Attach resources
    const flatResources: any[] = [];
    for (const stage of roadmapPayload.stages) {
      stage.resources = {};
      for (const skill of stage.skills || []) {
        const key = skill.toLowerCase();
        if (resourceMap[key]) {
          stage.resources[skill] = resourceMap[key];
          
          Object.values(resourceMap[key]).forEach(res => {
            flatResources.push({ ...res, topic: key });
          });
        }
      }
    }

    // Step 5: Save to Firebase
    const db = getDb();
    const finalUserId = userId || generateUserId();
    const docData = {
      userId: finalUserId,
      role_goal,
      experience_level: experience_level || 'beginner',
      learning_style: learning_style || 'video',
      interest_area: interest_area || '',
      time_commitment: time_commitment || 10,
      roadmap: roadmapPayload,
      resources: flatResources,
      progress: {
        completed_stages: 0,
        total_stages: roadmapPayload.stages?.length || 0,
      },
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('roadmaps').add(docData);

    return NextResponse.json({ 
      roadmap: roadmapPayload, 
      resources: flatResources,
      progress: { completed_stages: 0, total_stages: roadmapPayload.stages?.length || 0 },
      firebaseId: docRef.id,
      userId: finalUserId,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
