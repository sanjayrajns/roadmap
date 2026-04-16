import { NextResponse } from 'next/server';
import roadmapsData from '@/lib/roadmaps.json';
import resourcesData from '@/lib/resources.json';

const ROADMAP_REGISTRY: any = roadmapsData.roadmaps;
const INTEREST_STAGES: any = roadmapsData.interests;
const CURATED_RESOURCES: any = resourcesData;

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

function generateRoadmapNative(role: string, experience: string, interest: string) {
  const role_key = role.toLowerCase();
  
  let stages: any[] = [];
  if (ROADMAP_REGISTRY[role_key]) {
    stages = JSON.parse(JSON.stringify(ROADMAP_REGISTRY[role_key].stages));
  } else {
    stages = [
      {
        stage_name: `${role} Fundamentals`,
        skills: ["Introduction", "Core Syntax", "Development Setup"],
        recommended_projects: [`Hello World in ${role}`, `Basic ${role} implementation`]
      },
      {
        stage_name: "Intermediate Concepts",
        skills: ["Advanced Syntax", "Functional Patterns", "Error Handling", "Testing"],
        recommended_projects: [`Logic-heavy ${role} project`]
      },
      {
        stage_name: "Ecosystem & Integration",
        skills: ["Libraries & Packages", "API Integration", "Database Connection"],
        recommended_projects: [`Full-featured ${role} application`]
      },
      {
        stage_name: "Production & Deployment",
        skills: ["Containerization", "CI/CD", "Monitoring", "Performance Optimization"],
        recommended_projects: [`Deploy ${role} project with automated CI/CD`]
      }
    ];
  }

  // Filter by experience
  if (experience === 'advanced') {
    const beginKw = ["fundamental", "basics", "foundation", "getting started", "introduction", "web fundamentals", "programming & data wrangling"];
    stages = stages.filter((s: any) => !beginKw.some(kw => s.stage_name.toLowerCase().includes(kw)));
  } else if (experience === 'intermediate') {
    const setupKw = ["setup", "getting started", "fundamentals", "core trio"];
    if (stages.length > 0 && setupKw.some(kw => stages[0].stage_name.toLowerCase().includes(kw))) {
      stages.shift();
    }
  }

  // Inject interest
  if (interest && INTEREST_STAGES[interest]) {
    const spec = INTEREST_STAGES[interest];
    if (stages.length > 1) {
      stages.splice(stages.length - 1, 0, spec);
    } else {
      stages.push(spec);
    }
  }

  return { role, stages };
}

function fetchResourcesNative(topics: string[], style: string, experience: string) {
  const result: any = {};
  for (const topic of topics) {
    const key = topic.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!key) continue;

    let resources = CURATED_RESOURCES[key];
    if (!resources) {
      for (const [cKey, cRes] of Object.entries(CURATED_RESOURCES)) {
        if (cKey.includes(key) || key.includes(cKey)) {
          resources = cRes;
          break;
        }
      }
    }

    if (resources) {
      const depthFiltered = experience === 'beginner' 
        ? resources.filter((r: any) => r.depth === 'beginner' || r.depth === 'all')
        : experience === 'advanced'
        ? resources.filter((r: any) => r.depth === 'advanced' || r.depth === 'all')
        : resources;

      const styleMatch = depthFiltered.filter((r: any) => r.type === style);
      const other = depthFiltered.filter((r: any) => r.type !== style);
      result[key] = [...styleMatch, ...other].slice(0, 5);
    } else {
      // Fallback
      result[key] = [{
        title: `${topic} GitHub Search Overview`,
        type: "github",
        depth: "all",
        url: `https://github.com/search?q=${encodeURIComponent(topic)}&type=repositories`,
        description: `Explore top GitHub repositories for ${topic}.`
      }];
    }
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role_goal, experience_level, learning_style, time_commitment, interest_area, userId } = body;

    if (!role_goal) return NextResponse.json({ error: 'Missing role_goal' }, { status: 400 });

    const timeCommit = time_commitment || 10;
    const expLvl = experience_level || 'beginner';
    const style = learning_style || 'video';

    // 1. Generate Roadmap Native
    const roadmapPayload = generateRoadmapNative(role_goal, expLvl, interest_area);
    
    // Trim projects if low time commitment
    if (timeCommit < 10) {
      roadmapPayload.stages.forEach((stage: any) => {
        if (stage.recommended_projects?.length > 1) {
          stage.recommended_projects = [stage.recommended_projects[0]];
        }
      });
    }

    // 2. Load Resources for the First Stage
    const flatResources: any[] = [];
    if (roadmapPayload.stages.length > 0) {
      const firstStage = roadmapPayload.stages[0];
      const topics = [role_goal, ...(firstStage.skills || [])].slice(0, 5);
      
      const fetchedResources = fetchResourcesNative(topics, style, expLvl);
      firstStage.resources = fetchedResources;
      
      Object.values(fetchedResources).forEach((arr: any) => {
        if (Array.isArray(arr)) flatResources.push(...arr);
      });

      for (let i = 1; i < roadmapPayload.stages.length; i++) {
        roadmapPayload.stages[i].resources = {};
      }
    }

    // Step 3: No Firebase Save (Local Cache Only)
    const finalUserId = userId || generateUserId();
    const localId = "local-" + Date.now().toString(36);

    return NextResponse.json({ 
      roadmap: roadmapPayload, 
      resources: flatResources,
      progress: { completed_stages: 0, total_stages: roadmapPayload.stages?.length || 0 },
      firebaseId: localId,
      userId: finalUserId,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
