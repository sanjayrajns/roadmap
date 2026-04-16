import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

function trimRoadmap(rawRoadmap: any, userGoals: any) {
  const experience = userGoals.experience_level || "beginner";
  const timeCommit = userGoals.time_commitment || 10;
  
  let stages = rawRoadmap.stages || [];
  
  if (experience === 'advanced') {
    stages = stages.filter((s: any) => !s.stage_name.toLowerCase().includes('fundamental'));
  }
  
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role_goal, experience_level, learning_style, time_commitment, interest_area, userId } = body;

    if (!role_goal) {
      return NextResponse.json({ error: 'Missing role_goal' }, { status: 400 });
    }

    const userGoals = { experience_level, learning_style, time_commitment };

    // Step 1: Generate Roadmap Structure using Python Tool
    let roadmapPayload: any;
    try {
      const pythonPath = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
      const scriptPath = path.join(process.cwd(), '..', 'tools', 'fetch_roadmap.py');
      const cmd = `${pythonPath} "${scriptPath}" --role "${role_goal}" --experience "${experience_level || 'beginner'}" --interest "${interest_area || ''}"`;
      const output = execSync(cmd, { encoding: 'utf-8' });
      const rawRoadmap = JSON.parse(output);
      roadmapPayload = trimRoadmap(rawRoadmap, userGoals);
    } catch (e: any) {
      console.warn("Failed to fetch real roadmap, using fallback:", e.message);
      roadmapPayload = trimRoadmap({
        role: role_goal,
        stages: [{ stage_name: "Getting Started", skills: [role_goal], recommended_projects: ["Initial Setup"] }]
      }, userGoals);
    }

    // Step 2: Skip Resource Fetching (Lazy Loaded sequentially)
    const flatResources: any[] = [];
    for (const stage of roadmapPayload.stages) {
      stage.resources = {};
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
