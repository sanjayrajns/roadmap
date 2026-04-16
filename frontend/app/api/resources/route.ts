import { NextResponse } from 'next/server';
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

    // Firebase dependency has been removed. Local caching is handled within the client component.

    return NextResponse.json({ resources: mappedResources });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
