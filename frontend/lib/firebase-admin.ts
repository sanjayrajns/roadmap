import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(process.cwd(), '..', 'roadmap-348e4-firebase-adminsdk-fbsvc-067cce9e9f.json');

export function getDb() {
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
          // Create dummy app to prevent immediate crash during Vercel Build (which invokes imports statically)
          // Though typically it's better to throw here at runtime.
          throw new Error('Missing Firebase Credentials');
        }
      }
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }
  return getFirestore();
}
