/**
 * AUTOSURE — Firebase Admin Service
 * Wrapper around Firebase Admin SDK operations.
 * Business logic to be implemented in Phase 2.
 */

import { adminAuth, adminDb } from '../config/firebase.config';
import { logger } from '../config/logger.config';

export class FirebaseAdminService {
  /**
   * Verify a Firebase ID token and return the decoded token.
   * Used internally by auth middleware.
   */
  async verifyToken(idToken: string) {
    return adminAuth.verifyIdToken(idToken, true);
  }

  /**
   * Get a user's custom claims (includes role).
   */
  async getUserClaims(uid: string) {
    const user = await adminAuth.getUser(uid);
    return user.customClaims ?? {};
  }

  /**
   * Set a user's role as a custom claim.
   * Only callable by admin-level operations.
   */
  async setUserRole(uid: string, role: string): Promise<void> {
    await adminAuth.setCustomUserClaims(uid, { role });
    logger.info(`[Firebase] Set role "${role}" for uid="${uid}"`);
  }

  /**
   * Get a Firestore document reference.
   */
  getDocRef(collection: string, docId: string) {
    return adminDb.collection(collection).doc(docId);
  }
}

export const firebaseAdminService = new FirebaseAdminService();
