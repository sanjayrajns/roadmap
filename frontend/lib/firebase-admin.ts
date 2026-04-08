import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), '..', 'roadmap-348e4-firebase-adminsdk-fbsvc-067cce9e9f.json');

// Only initialize if no apps exist yet (avoids duplicate initialization in dev)
if (!getApps().length) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(serviceAccountPath) as ServiceAccount;
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();
