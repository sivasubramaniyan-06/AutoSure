/**
 * AUTOSURE — Auth Context
 * Connects to Firebase Auth to provide user state globally.
 *
 * Uses onAuthStateChanged to reactively update state whenever the user
 * signs in, signs out, or their token is refreshed. Auth state persists
 * across page reloads via browserLocalPersistence (set in firebase.ts).
 */

import { createContext, useEffect, useState, useMemo } from 'react';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          // Force-refresh the token to always get the latest custom claims
          // (e.g., the 'role' claim set by the backend after registration)
          const idTokenResult = await fbUser.getIdTokenResult(/* forceRefresh */ true);

          // Default to 'customer' if the role claim hasn't been set yet
          // (e.g., in the brief window between Firebase Auth creation and the
          // backend /auth/register call that sets the custom claim)
          const role = (idTokenResult.claims['role'] as UserRole) || 'customer';

          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            role,
            emailVerified: fbUser.emailVerified,
          });
        } catch {
          // Token refresh failed (e.g., network error) — keep user signed in
          // with defaults so they're not silently logged out
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            role: 'customer',
            emailVerified: fbUser.emailVerified,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
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
