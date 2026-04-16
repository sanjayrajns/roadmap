import { NextResponse } from 'next/server';
import resourcesData from '@/lib/resources.json';

const CURATED_RESOURCES: any = resourcesData;

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
    const { topics, learning_style, experience_level, firebaseId, stageIndex } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: 'Missing or empty topics array' }, { status: 400 });
    }

    let resourceMap: Record<string, any[]> = {};
    try {
      resourceMap = fetchResourcesNative(topics, learning_style || 'video', experience_level || 'beginner');
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
