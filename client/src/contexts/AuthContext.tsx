/**
 * AUTOSURE — Auth Context
 * Connects to Firebase Auth to provide user state globally.
 *
 * Uses onAuthStateChanged to reactively update state whenever the user
 * signs in, signs out, or their token is refreshed. Auth state persists
 * across page reloads via browserLocalPersistence (set in firebase.ts).
 */

import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import type { UserRole } from '../types/auth.types';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  emailVerified: boolean;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authBootstrapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const safeSetUser = (nextUser: AuthUser | null) => {
    if (isMountedRef.current) {
      setUser(nextUser);
    }
  };

  const safeSetIsLoading = (nextLoading: boolean) => {
    if (isMountedRef.current) {
      setIsLoading(nextLoading);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    authBootstrapTimeoutRef.current = setTimeout(() => {
      // Firebase auth can occasionally stall on slow networks; never keep the
      // whole app blocked on the initial loading spinner.
      safeSetIsLoading(false);
    }, 8000);

    const clearBootstrapTimeout = () => {
      if (authBootstrapTimeoutRef.current) {
        clearTimeout(authBootstrapTimeoutRef.current);
        authBootstrapTimeoutRef.current = null;
      }
    };

    const readRoleWithTimeout = async (fbUser: FirebaseUser): Promise<UserRole> => {
      const tokenPromise = fbUser.getIdTokenResult(true);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Firebase token refresh timed out')), 3000);
      });

      try {
        const idTokenResult = await Promise.race([tokenPromise, timeoutPromise]);
        return (idTokenResult.claims['role'] as UserRole) || 'customer';
      } catch {
        return 'customer';
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      try {
        if (fbUser) {
          const role = await readRoleWithTimeout(fbUser);

          safeSetUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            role,
            emailVerified: fbUser.emailVerified,
          });
        } else {
          safeSetUser(null);
        }
      } finally {
        clearBootstrapTimeout();
        safeSetIsLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      clearBootstrapTimeout();
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
