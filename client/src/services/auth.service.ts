/**
 * AUTOSURE — Auth Service
 * Wraps Firebase Auth SDK methods with friendly error messages.
 *
 * Design decision:
 *  - All methods re-throw the original FirebaseError so callers can use
 *    getFirebaseErrorMessage() or isFirebaseError() at the call site.
 *  - This keeps the error type consistent and avoids information loss
 *    from wrapping in a plain Error too early.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export class AuthService {
  /**
   * Sign in with email + password.
   * Throws the raw FirebaseError on failure — callers use getFirebaseErrorMessage().
   */
  async loginWithEmail(data: LoginCredentials) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    return userCredential.user;
  }

  /**
   * Create a new Firebase Auth user and set their displayName.
   * Throws the raw FirebaseError — callers can detect auth/email-already-in-use.
   */
  async registerWithEmail(data: RegisterCredentials) {
    // 1. Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // 2. Set their display name
    await updateProfile(userCredential.user, {
      displayName: data.displayName,
    });

    return userCredential.user;
  }

  /**
   * Sign out the current user.
   */
  async logout() {
    await firebaseSignOut(auth);
  }

  /**
   * Send a password reset email.
   */
  async resetPassword(data: { email: string }) {
    await sendPasswordResetEmail(auth, data.email);
  }
}

export const authService = new AuthService();
