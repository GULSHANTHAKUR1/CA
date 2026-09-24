import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  type Timestamp,
} from 'firebase/firestore';

// ============================================================
// Firebase Configuration
// Replace these with your actual Firebase project config
// ============================================================

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA1sXywH0ixOF5tkoCiZsbywlmv2VP5M1c',
  authDomain: 'ca-firm-e3558.firebaseapp.com',
  projectId: 'ca-firm-e3558',
  storageBucket: 'ca-firm-e3558.firebasestorage.app',
  messagingSenderId: '646276290263',
  appId: '1:646276290263:web:9ea669af03285719288292',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
};

// Initialize Firebase (prevent duplicate initialization in Next.js hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================
// Firestore User Profile Types
// ============================================================

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// ============================================================
// Auth Helper Functions
// ============================================================

/** Sign in with email and password */
export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(userCredential.user.uid);
  if (!profile) {
    throw new Error('User profile not found. Contact administrator.');
  }
  if (!profile.isActive) {
    await signOut(auth);
    throw new Error('Your account has been deactivated. Contact administrator.');
  }
  return { user: userCredential.user, profile };
}

/** Sign out */
export async function logoutUser() {
  await signOut(auth);
}

/** Get user profile from Firestore */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
}

/** Create a new user (Admin creating workers/staff) */
export async function createWorkerAccount(
  email: string,
  password: string,
  name: string,
  phone?: string,
  role: 'WORKER' | 'CLIENT' = 'WORKER'
): Promise<UserProfile> {
  // We use the Firebase Admin SDK pattern via a server action/API route
  // For client-side, we'll create via a secondary auth instance
  const { initializeApp: initSecondary, deleteApp } = await import('firebase/app');
  const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createSecondaryUser, updateProfile: updateSecondaryProfile } = await import('firebase/auth');

  // Create a secondary app to avoid signing out the admin
  const secondaryApp = initSecondary(firebaseConfig, 'secondary-create-user');
  const secondaryAuth = getSecondaryAuth(secondaryApp);

  try {
    const userCredential = await createSecondaryUser(secondaryAuth, email, password);
    await updateSecondaryProfile(userCredential.user, { displayName: name });

    const profile: Omit<UserProfile, 'uid'> = {
      name,
      email,
      phone: phone || '',
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save profile to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), profile);

    // Clean up secondary app
    await deleteApp(secondaryApp);

    return { uid: userCredential.user.uid, ...profile };
  } catch (error) {
    // Clean up secondary app even on error
    try { await deleteApp(secondaryApp); } catch { /* ignore */ }
    throw error;
  }
}

/** Update user profile in Firestore */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
) {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/** Toggle user active status */
export async function toggleUserActive(uid: string, isActive: boolean) {
  await updateUserProfile(uid, { isActive });
}

/** Get all users by role */
export async function getUsersByRole(role: 'ADMIN' | 'WORKER' | 'CLIENT'): Promise<UserProfile[]> {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
}

/** Get all workers */
export async function getAllWorkers(): Promise<UserProfile[]> {
  return getUsersByRole('WORKER');
}

/** Delete user profile from Firestore (doesn't delete Auth account - that requires Admin SDK) */
export async function deleteUserProfile(uid: string) {
  await deleteDoc(doc(db, 'users', uid));
}

/** Setup the initial admin profile (run once during first setup) */
export async function setupAdminProfile(uid: string, name: string, email: string) {
  const existing = await getUserProfile(uid);
  if (!existing) {
    const profile: Omit<UserProfile, 'uid'> = {
      name,
      email,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', uid), profile);
  }
}

// ============================================================
// Exports
// ============================================================

export { app, auth, db, onAuthStateChanged, type FirebaseUser };
