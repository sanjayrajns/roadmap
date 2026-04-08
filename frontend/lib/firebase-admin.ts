import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), '..', 'roadmap-348e4-firebase-adminsdk-fbsvc-067cce9e9f.json');

import fs from 'fs';

// Only initialize if no apps exist yet (avoids duplicate initialization in dev)
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      // Vercel deployment environment variables
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Local development with JSON file
      if (fs.existsSync(serviceAccountPath)) {
        const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
        initializeApp({
          credential: cert(JSON.parse(fileContent)),
        });
      } else {
        console.warn('Firebase Service account not found locally, and no ENV vars provided.');
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export const db = getFirestore();
