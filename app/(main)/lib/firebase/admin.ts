// app/(main)/lib/firebase/admin.ts
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

/* ------------------------------------------------------------------ */
/*  Validate env vars (PUBLIC – insecure but requested)                 */
/* ------------------------------------------------------------------ */
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL",
  "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY",
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  throw new Error(`❌ Missing Firebase env vars: ${missingVars.join(", ")}`);
}

/* ------------------------------------------------------------------ */
/*  Normalize private key                                               */
/* ------------------------------------------------------------------ */
const privateKey = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY!.replace(
  /\\n/g,
  "\n",
);

/* ------------------------------------------------------------------ */
/*  Admin Service                                                       */
/* ------------------------------------------------------------------ */
class AdminService {
  private db!: Firestore;
  private app!: App;
  public isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;

    try {
      if (!getApps().length) {
        console.log("🟡 Initializing Firebase Admin (PUBLIC ENV)...");

        this.app = initializeApp({
          credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
            privateKey,
          }),
        });

        console.log("✅ Firebase Admin initialized");
      } else {
        this.app = getApps()[0];
      }

      this.db = getFirestore(this.app);
      this.isInitialized = true;
    } catch (err) {
      console.error("❌ Firebase Admin init failed:", err);
      throw err;
    }
  }

  getDb(): Firestore {
    if (!this.isInitialized) this.initialize();
    return this.db;
  }

  /* ------------------------------------------------------------------ */
  /*  Client CRUD                                                        */
  /* ------------------------------------------------------------------ */
  async getClients(limit = 50, page = 1) {
    const offset = (page - 1) * limit;

    const snapshot = await this.db
      .collection("clients")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset(offset)
      .get();

    const clients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.(),
      updatedAt: doc.data().updatedAt?.toDate?.(),
    }));

    const countSnap = await this.db.collection("clients").count().get();

    return {
      clients,
      pagination: {
        page,
        limit,
        total: countSnap.data().count,
        pages: Math.ceil(countSnap.data().count / limit),
      },
    };
  }

  async createClient(data: any) {
    const ref = this.db.collection("clients").doc();

    const client = {
      id: ref.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ref.set(client);
    return client;
  }

  async getClient(id: string) {
    const doc = await this.db.collection("clients").doc(id).get();

    if (!doc.exists) throw new Error("Client not found");

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate?.(),
      updatedAt: doc.data()?.updatedAt?.toDate?.(),
    };
  }

  async updateClient(id: string, data: any) {
    await this.db
      .collection("clients")
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date(),
      });

    return this.getClient(id);
  }

  async deleteClient(id: string) {
    await this.db.collection("clients").doc(id).delete();
    return { success: true };
  }
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */
export const adminService = new AdminService();
export const adminDb = adminService.getDb();
