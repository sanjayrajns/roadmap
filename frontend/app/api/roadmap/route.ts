import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { db } from '@/lib/firebase-admin';
const execFileAsync = promisify(execFile);

function generateUserId(): string {
  // Simple random ID generator for anonymous users
  return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role_goal, experience_level, learning_style, time_commitment, interest_area, userId } = body;

    if (!role_goal) {
      return NextResponse.json({ error: 'Missing role_goal' }, { status: 400 });
    }

    // Paths
    const rootDir = path.resolve(process.cwd(), '..');
    const tmpDir = path.join(rootDir, '.tmp');
    const ingestScript = path.join(rootDir, 'tools', 'ingest_roadmap.py');
    const trimmerScript = path.join(rootDir, 'tools', 'ai_roadmap_trimmer.py');
    const resourceScript = path.join(rootDir, 'tools', 'fetch_resources.py');
    
    const userGoalsJson = JSON.stringify({
      experience_level,
      learning_style,
      time_commitment
    });

    // ── Layer 2: Navigation ─────────────────────────────────────
    
    // Step 1: Ingest roadmap
    await execFileAsync('python', [ingestScript, '--role', role_goal], { cwd: rootDir });

    // Step 2: Tailor via AI tool
    await execFileAsync('python', [trimmerScript, '--role', role_goal, '--user_goals', userGoalsJson], { cwd: rootDir });

    // Step 3: Read deterministic output
    const outputFile = path.join(tmpDir, `${role_goal}_customized.json`);
    if (!fs.existsSync(outputFile)) {
      throw new Error(`Output file not generated: ${outputFile}`);
    }

    const customizedData = fs.readFileSync(outputFile, 'utf-8');
    const roadmapPayload = JSON.parse(customizedData);

    // Step 4: Collect all skills from all stages for resource fetching
    const allSkills: string[] = [];
    for (const stage of roadmapPayload.stages || []) {
      for (const skill of stage.skills || []) {
        allSkills.push(skill);
      }
    }

    // Step 5: Fetch resources for all skills
    let resourceMap: Record<string, any[]> = {};
    if (allSkills.length > 0) {
      try {
        const topicsArg = allSkills.join(',');
        const { stdout } = await execFileAsync('python', [resourceScript, '--topics', topicsArg], { cwd: rootDir });
        resourceMap = JSON.parse(stdout);
      } catch (resErr: any) {
        console.warn('Resource fetch warning:', resErr.message);
        // Non-fatal: continue without resources
      }
    }

    // Step 6: Attach resources directly to each stage
    for (const stage of roadmapPayload.stages || []) {
      stage.resources = {};
      for (const skill of stage.skills || []) {
        const key = skill.toLowerCase();
        if (resourceMap[key]) {
          stage.resources[skill] = resourceMap[key];
        }
      }
    }

    // Flatten resources into a single array for the top-level response
    const flatResources: any[] = [];
    for (const [topic, resList] of Object.entries(resourceMap)) {
      for (const res of resList) {
        flatResources.push({ ...res, topic });
      }
    }

    // ── Step 7: Save to Firebase ────────────────────────────────
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
    console.error('Orchestration error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
