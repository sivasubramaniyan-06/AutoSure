/**
 * AUTOSURE — Firebase Auth Error Mapper
 * Maps Firebase Auth error codes to human-readable messages.
 * Never surfaces raw Firebase error codes to users.
 */

import { FirebaseError } from 'firebase/app';

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Registration
  'auth/email-already-in-use':
    'An account already exists with this email. Please sign in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed':
    'Email/password sign-in is not enabled. Please contact support.',
  'auth/weak-password':
    'Password is too weak. Please choose a stronger password.',

  // Sign-in
  'auth/user-not-found':
    'No account found with this email. Please check your email or sign up.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential':
    'Invalid email or password. Please check your credentials and try again.',
  'auth/invalid-login-credentials':
    'Invalid email or password. Please check your credentials and try again.',
  'auth/user-disabled':
    'This account has been disabled. Please contact support.',

  // General
  'auth/too-many-requests':
    'Too many failed attempts. Please wait a moment and try again.',
  'auth/network-request-failed':
    'Network error. Please check your internet connection and try again.',
  'auth/requires-recent-login':
    'This action requires a recent sign-in. Please sign out and sign in again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked':
    'Sign-in popup was blocked. Please allow popups for this site.',

  // Password reset
  'auth/expired-action-code':
    'This password reset link has expired. Please request a new one.',
  'auth/invalid-action-code':
    'This password reset link is invalid. Please request a new one.',
};

/**
 * Returns a friendly error message for a Firebase Auth error.
 * Falls back to the original error message if the code is not mapped.
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return (
      FIREBASE_ERROR_MESSAGES[error.code] ??
      error.message ??
      'An unexpected error occurred. Please try again.'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Returns true if the Firebase error code matches.
 */
export function isFirebaseError(error: unknown, code: string): boolean {
  return error instanceof FirebaseError && error.code === code;
}
