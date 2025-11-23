// lib/firebase/admin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Firebase Admin configuration
const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

// Initialize Firebase Admin
let adminApp;

try {
  if (!getApps().length) {
    adminApp = initializeApp(adminConfig);
    console.log("✅ Firebase Admin initialized successfully");
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error("❌ Firebase Admin initialization failed:", error);

  if (process.env.NODE_ENV === "production") {
    throw error;
  } else {
    console.warn("⚠️  Continuing without Firebase Admin in development mode");
    adminApp = {} as any;
  }
}

// Initialize Admin services
export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminStorage = adminApp ? getStorage(adminApp) : null;

// Admin service functions
export const adminService = {
  get isInitialized() {
    return !!adminApp;
  },

  async createUser(userData: {
    email: string;
    password: string;
    displayName?: string;
  }) {
    if (!adminAuth) throw new Error("Firebase Admin not initialized");

    try {
      const user = await adminAuth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: false,
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async saveAnalysis(clientId: string, serviceType: string, analysis: any) {
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    try {
      const analysisRef = adminDb.collection("serviceAnalytics").doc();
      const analysisData = {
        id: analysisRef.id,
        clientId,
        serviceType,
        analysis,
        score: analysis.score,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await analysisRef.set(analysisData);
      await this.updateClientMetrics(clientId, serviceType, analysis);
      return analysisData;
    } catch (error) {
      console.error("Error saving analysis:", error);
      throw error;
    }
  },

  async updateClientMetrics(
    clientId: string,
    serviceType: string,
    analysis: any
  ) {
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    try {
      const clientRef = adminDb.collection("clients").doc(clientId);
      const updates = {
        [`services.${serviceType}.lastAnalysis`]: new Date(),
        [`services.${serviceType}.lastScore`]: analysis.score,
        [`services.${serviceType}.totalQARuns`]: (
          adminDb as any
        ).FieldValue.increment(1),
        updatedAt: new Date(),
      };

      await clientRef.update(updates);
    } catch (error) {
      console.error("Error updating client metrics:", error);
      throw error;
    }
  },

  async getClientAnalytics(clientId: string, limit = 50) {
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    try {
      const snapshot = await adminDb
        .collection("serviceAnalytics")
        .where("clientId", "==", clientId)
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting client analytics:", error);
      throw error;
    }
  },
};

export default adminApp;
