import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { execSync } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topics, learning_style, experience_level, firebaseId, stageIndex } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: 'Missing or empty topics array' }, { status: 400 });
    }

    let resourceMap: Record<string, any[]> = {};
    try {
      const pythonPath = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
      const scriptPath = path.join(process.cwd(), '..', 'tools', 'fetch_resources.py');
      const topicsParam = topics.join(',');
      const cmd = `${pythonPath} "${scriptPath}" --topics "${topicsParam}" --style "${learning_style || 'video'}" --experience "${experience_level || 'beginner'}"`;
      const output = execSync(cmd, { encoding: 'utf-8' });
      resourceMap = JSON.parse(output);
    } catch (e: any) {
      console.warn("Failed to fetch resources:", e.message);
      return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }

    // Map resources to a flat list returning with mapped topics
    const mappedResources: Record<string, any[]> = {};
    for (const skill of topics) {
      const normalizedKey = skill.trim().toLowerCase().replace(/\s+/g, ' ');
      // Try exact match first, then partial match
      const matchedKey = resourceMap[normalizedKey]
        ? normalizedKey
        : Object.keys(resourceMap).find(k => normalizedKey.includes(k) || k.includes(normalizedKey));
      
      if (matchedKey && resourceMap[matchedKey]) {
        mappedResources[skill] = resourceMap[matchedKey];
      } else {
        mappedResources[skill] = [];
      }
    }

    // Optionally: Update firebase document silently if firebaseId and stageIndex are provided
    // To keep it fast, we can do this without awaiting.
    if (firebaseId && typeof stageIndex === 'number') {
      const db = getDb();
      db.collection('roadmaps').doc(firebaseId).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            if (data?.roadmap?.stages && data.roadmap.stages[stageIndex]) {
                const stages = [...data.roadmap.stages];
                if (!stages[stageIndex].resources) {
                    stages[stageIndex].resources = {};
                }
                stages[stageIndex].resources = {
                    ...stages[stageIndex].resources,
                    ...mappedResources
                };
                
                // Append flat resources
                const newFlatResources = [...(data.resources || [])];
                Object.values(mappedResources).flat().forEach((res: any) => {
                   if (!newFlatResources.find(r => r.url === res.url)) {
                       newFlatResources.push(res);
                   }
                });

                doc.ref.update({
                    'roadmap.stages': stages,
                    'resources': newFlatResources
                });
            }
        }
      }).catch(e => console.error("Failed to async-update firebase:", e));
    }

    return NextResponse.json({ resources: mappedResources });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
