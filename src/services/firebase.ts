import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, Firestore, collection, getDocs, addDoc, onSnapshot, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseConfigured = false;

// Initialize Firebase App safely with config
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else if (firebaseConfig && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
  }
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseConfigured = true;
  }
} catch (e) {
  console.info("Firebase app config not loaded yet, running in flexible fallback mode:", e);
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Check connection to Firestore as instructed in skill
export async function testFirestoreConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client is offline or project pending initialization.");
    }
    return false;
  }
}

export { app, auth, db, isFirebaseConfigured };
