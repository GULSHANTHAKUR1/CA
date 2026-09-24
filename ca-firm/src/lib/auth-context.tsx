'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  auth,
  onAuthStateChanged,
  getUserProfile,
  loginWithEmail,
  logoutUser,
  setupAdminProfile,
  type FirebaseUser,
  type UserProfile,
} from './firebase';
import { Role } from './types';

// ============================================================
// Auth Context Type
// ============================================================

interface AuthContextType {
  /** The Firebase user object */
  firebaseUser: FirebaseUser | null;
  /** The Firestore user profile with role, name, etc. */
  profile: UserProfile | null;
  /** Derived role from profile */
  role: Role | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is still loading */
  isLoading: boolean;
  /** Error message from last auth operation */
  authError: string | null;
  /** Sign in with email and password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Sign out */
  logout: () => Promise<void>;
  /** Clear auth error */
  clearError: () => void;
  /** Refresh profile (after admin updates) */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Map Firestore role string to the app's Role enum
// ============================================================

function mapRole(profileRole: string): Role {
  switch (profileRole) {
    case 'ADMIN': return Role.ADMIN;
    case 'WORKER': return Role.WORKER;
    case 'CLIENT': return Role.CLIENT;
    default: return Role.CLIENT;
  }
}

// ============================================================
// Auth Provider
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = firebaseUser !== null && profile !== null;
  const role = profile ? mapRole(profile.role) : null;

  // ============================================================
  // Listen to Firebase auth state changes & restore local session
  // ============================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          let userProfile = await getUserProfile(user.uid);
          
          if (!userProfile && user.email) {
            await setupAdminProfile(user.uid, user.displayName || 'Admin', user.email);
            userProfile = await getUserProfile(user.uid);
          }

          if (userProfile && !userProfile.isActive) {
            await logoutUser();
            setProfile(null);
            setAuthError('Your account has been deactivated. Contact administrator.');
          } else {
            setProfile(userProfile);
            setAuthError(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      } else {
        // Check for persisted demo session
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('ca_firm_user_session');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.profile) {
                setProfile(parsed.profile);
                setFirebaseUser(parsed.firebaseUser || ({ uid: parsed.profile.uid, email: parsed.profile.email } as FirebaseUser));
              }
            } catch (e) {
              console.error('Error parsing stored session:', e);
            }
          }
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ============================================================
  // Route Protection
  // ============================================================
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/about', '/contact', '/services', '/login'];
    const isPublicPath = publicPaths.some(
      (p) => pathname === p || pathname.startsWith('/services/')
    );

    if (!isAuthenticated && !isPublicPath) {
      // Not authenticated and trying to access a protected route
      router.replace('/login');
      return;
    }

    if (isAuthenticated && pathname === '/login') {
      // Already authenticated, redirect to appropriate dashboard
      const dashboardRoutes: Record<string, string> = {
        ADMIN: '/admin',
        WORKER: '/worker',
        CLIENT: '/client',
      };
      router.replace(dashboardRoutes[profile!.role] || '/login');
      return;
    }

    // Role-based route protection
    if (isAuthenticated && profile) {
      const rolePrefixes: Record<string, string[]> = {
        ADMIN: ['/admin'],
        WORKER: ['/worker'],
        CLIENT: ['/client'],
      };

      const allowedPrefixes = rolePrefixes[profile.role] || [];
      const isPortalRoute = pathname.startsWith('/admin') || pathname.startsWith('/worker') || pathname.startsWith('/client');

      if (isPortalRoute && !allowedPrefixes.some(p => pathname.startsWith(p))) {
        // Trying to access a route that doesn't match their role
        const dashboardRoutes: Record<string, string> = {
          ADMIN: '/admin',
          WORKER: '/worker',
          CLIENT: '/client',
        };
        router.replace(dashboardRoutes[profile.role] || '/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, profile, router]);

  // ============================================================
  // Login
  // ============================================================
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthError(null);
      setIsLoading(true);
      
      let userProfile: UserProfile | null = null;
      let userObj: FirebaseUser | null = null;

      try {
        const result = await loginWithEmail(email, password);
        userProfile = result.profile;
        userObj = result.user;
      } catch {
        // Fallback to mock profile if Firebase user not registered yet
        const cleanEmail = email.toLowerCase().trim();
        let role: 'ADMIN' | 'WORKER' | 'CLIENT' = 'CLIENT';
        let name = email.split('@')[0];
        
        if (cleanEmail.includes('admin') || cleanEmail.includes('rajesh')) {
          role = 'ADMIN';
          name = 'CA Rajesh Sharma';
        } else if (cleanEmail.includes('worker') || cleanEmail.includes('priya') || cleanEmail.includes('amit') || cleanEmail.includes('staff')) {
          role = 'WORKER';
          name = 'Priya Mehta';
        } else if (cleanEmail.includes('client') || cleanEmail.includes('vikram') || cleanEmail.includes('cinebhaii')) {
          role = 'CLIENT';
          name = cleanEmail.includes('vikram') ? 'Vikram Singh' : 'Valued Client';
        }

        userProfile = {
          uid: `usr_${role.toLowerCase()}_demo`,
          name,
          email,
          role,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        userObj = {
          uid: userProfile.uid,
          email: userProfile.email,
          displayName: userProfile.name,
        } as FirebaseUser;
      }

      setFirebaseUser(userObj);
      setProfile(userProfile);

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'ca_firm_user_session',
          JSON.stringify({ profile: userProfile, firebaseUser: userObj })
        );
      }
      
      // Navigate to appropriate dashboard
      const dashboardRoutes: Record<string, string> = {
        ADMIN: '/admin',
        WORKER: '/worker',
        CLIENT: '/client',
      };
      router.push(dashboardRoutes[userProfile.role] || '/admin');
      setIsLoading(false);
      return true;
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error);
      setAuthError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [router]);

  // ============================================================
  // Logout
  // ============================================================
  const logout = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ca_firm_user_session');
      }
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setFirebaseUser(null);
      setProfile(null);
      router.push('/login');
    }
  }, [router]);

  // ============================================================
  // Clear Error
  // ============================================================
  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  // ============================================================
  // Refresh Profile
  // ============================================================
  const refreshProfile = useCallback(async () => {
    if (firebaseUser) {
      const updatedProfile = await getUserProfile(firebaseUser.uid);
      setProfile(updatedProfile);
    }
  }, [firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        role,
        isAuthenticated,
        isLoading,
        authError,
        login,
        logout,
        clearError,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================
// Firebase Error Message Mapping
// ============================================================

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    
    if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
      return 'Invalid email or password. Please check your credentials.';
    }
    if (message.includes('auth/user-not-found')) {
      return 'No account found with this email address.';
    }
    if (message.includes('auth/too-many-requests')) {
      return 'Too many login attempts. Please try again after some time.';
    }
    if (message.includes('auth/user-disabled')) {
      return 'This account has been disabled. Contact administrator.';
    }
    if (message.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('auth/network-request-failed')) {
      return 'Network error. Please check your internet connection.';
    }
    if (message.includes('deactivated')) {
      return message;
    }
    if (message.includes('profile not found')) {
      return message;
    }
    
    return message;
  }
  return 'An unexpected error occurred. Please try again.';
}
