// app/(main)/lib/firebase/admin.ts
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Validate environment variables
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    "❌ Missing required Firebase environment variables:",
    missingVars
  );
  throw new Error(`Missing Firebase configuration: ${missingVars.join(", ")}`);
}

// Format private key (replace escaped newlines)
const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

class AdminService {
  private db: Firestore;
  public isInitialized = false;

  constructor() {
    this.initialize();
  }

  initialize() {
    try {
      let app: App;

      if (getApps().length === 0) {
        console.log("🟡 Initializing Firebase Admin...");
        app = initializeApp({
          credential: cert(serviceAccount),
          databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
        });
        console.log("✅ Firebase Admin initialized successfully");
      } else {
        app = getApps()[0];
      }

      this.db = getFirestore(app);
      this.isInitialized = true;

      // Test connection
      this.testConnection();
    } catch (error) {
      console.error("❌ Firebase Admin initialization failed:", error);
      throw error;
    }
  }

  private async testConnection() {
    try {
      // Test Firestore connection with a simple operation
      await this.db.collection("_test").limit(1).get();
      console.log("✅ Firestore connection test passed");
    } catch (error) {
      console.error("❌ Firestore connection test failed:", error);
      throw error;
    }
  }

  getDb(): Firestore {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.db;
  }

  // Client operations
  async getClients(limit: number = 50, page: number = 1) {
    const db = this.getDb();
    const offset = (page - 1) * limit;

    try {
      const clientsSnapshot = await db
        .collection("clients")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .offset(offset)
        .get();

      const clients = clientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
        updatedAt: doc.data().updatedAt?.toDate?.(),
      }));

      // Get total count
      const countSnapshot = await db.collection("clients").count().get();
      const total = countSnapshot.data().count;

      return {
        clients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  async createClient(clientData: any) {
    const db = this.getDb();

    try {
      const clientRef = db.collection("clients").doc();

      const client = {
        id: clientRef.id,
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await clientRef.set(client);
      return client;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  }

  async getClient(clientId: string) {
    const db = this.getDb();

    try {
      const doc = await db.collection("clients").doc(clientId).get();

      if (!doc.exists) {
        throw new Error("Client not found");
      }

      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate?.(),
        updatedAt: doc.data()?.updatedAt?.toDate?.(),
      };
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  }

  async updateClient(clientId: string, clientData: any) {
    const db = this.getDb();

    try {
      const clientRef = db.collection("clients").doc(clientId);

      await clientRef.update({
        ...clientData,
        updatedAt: new Date(),
      });

      return this.getClient(clientId);
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  }

  async deleteClient(clientId: string) {
    const db = this.getDb();

    try {
      await db.collection("clients").doc(clientId).delete();
      return { success: true };
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
export const adminDb = adminService.getDb();
