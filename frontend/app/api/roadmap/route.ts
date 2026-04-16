import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
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

    // Step 2: Collect all skills across stages
    const allSkills: string[] = [];
    for (const stage of roadmapPayload.stages) {
      for (const skill of stage.skills || []) {
        allSkills.push(skill);
      }
    }

    // Step 3: Fetch Resources using curated + GitHub engine
    let resourceMap: Record<string, any[]> = {};
    try {
      const pythonPath = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
      const scriptPath = path.join(process.cwd(), '..', 'tools', 'fetch_resources.py');
      const topicsParam = allSkills.join(',');
      const cmd = `${pythonPath} "${scriptPath}" --topics "${topicsParam}" --style "${learning_style || 'video'}" --experience "${experience_level || 'beginner'}"`;
      const output = execSync(cmd, { encoding: 'utf-8' });
      resourceMap = JSON.parse(output);
    } catch (e: any) {
      console.warn("Failed to fetch resources:", e.message);
    }

    // Step 4: Map resources back to stages using normalized key matching
    const flatResources: any[] = [];
    for (const stage of roadmapPayload.stages) {
      stage.resources = {};
      for (const skill of stage.skills || []) {
        const normalizedKey = skill.trim().toLowerCase().replace(/\s+/g, ' ');
        // Try exact match first, then partial match
        const matchedKey = resourceMap[normalizedKey]
          ? normalizedKey
          : Object.keys(resourceMap).find(k => normalizedKey.includes(k) || k.includes(normalizedKey));
        if (matchedKey && resourceMap[matchedKey]) {
          stage.resources[skill] = resourceMap[matchedKey];
          resourceMap[matchedKey].forEach((res: any) => {
            flatResources.push({ ...res, topic: normalizedKey });
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

    let firebaseId = "mock-id";
    try {
      const docRef = await db.collection('roadmaps').add(docData);
      firebaseId = docRef.id;
    } catch (e: any) {
      console.warn("Firebase save error:", e.message);
    }

    return NextResponse.json({ 
      roadmap: roadmapPayload, 
      resources: flatResources,
      progress: { completed_stages: 0, total_stages: roadmapPayload.stages?.length || 0 },
      firebaseId,
      userId: finalUserId,
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
