/**
 * AUTOSURE — Firebase Admin SDK Initialization
 */

import * as admin from 'firebase-admin';
import { env } from './env.config';

let app: admin.app.App;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      privateKeyId: env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: env.FIREBASE_PRIVATE_KEY,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      clientId: env.FIREBASE_CLIENT_ID,
      authUri: env.FIREBASE_AUTH_URI as string,
      tokenUri: env.FIREBASE_TOKEN_URI as string,
    } as admin.ServiceAccount),
  });
} else {
  app = admin.app();
}

export const firebaseAdmin = app;
export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
