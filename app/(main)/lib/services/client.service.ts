// services/client.service.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  limit,
} from "firebase/firestore";
import { db } from "@/app/(main)/lib/firebase/config";
import {
  Client,
  ClientFormData,
  ClientsFilter,
  ClientService,
} from "@/app/(main)/types/client.types";
import { aiService } from "./ai.service";
import { qualifAIService, QARequirement } from "./qualifai.service";

const CLIENTS_COLLECTION = "clients";
const CLIENT_SERVICES_COLLECTION = "client-services";

// Helper function to get service display name
function getServiceName(serviceType: string): string {
  const serviceNames: Record<string, string> = {
    wordpress: "WordPress QA",
    seo: "SEO QA",
    ppc: "PPC QA",
    "ai-automation": "AI Automation QA",
    content: "Content QA",
    "social-media": "Social Media QA",
  };
  return serviceNames[serviceType] || serviceType;
}

// Helper function to create client services
async function createClientServices(
  clientId: string,
  serviceTypes: string[]
): Promise<ClientService[]> {
  const services: ClientService[] = [];

  // Only create services if there are service types provided
  if (!serviceTypes || serviceTypes.length === 0) {
    return services;
  }

  const batch = writeBatch(db);

  for (const serviceType of serviceTypes) {
    const serviceId = `${clientId}-${serviceType}`;
    const serviceRef = doc(db, CLIENT_SERVICES_COLLECTION, serviceId);

    const service: ClientService = {
      id: serviceId,
      type: serviceType as any,
      name: getServiceName(serviceType),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    services.push(service);
    batch.set(serviceRef, {
      ...service,
      clientId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  return services;
}

export const clientService = {
  // Enhanced create client with service setup and AI analysis
  async createClient(
    data: ClientFormData & {
      initialServices?: string[];
      subscriptionTier?: string;
      billingCycle?: string;
    }
  ): Promise<{ id: string; services: ClientService[]; analysis?: any }> {
    try {
      const clientRef = doc(collection(db, CLIENTS_COLLECTION));
      const clientId = clientRef.id;

      // Generate AI analysis for new clients
      const aiAnalysisData = {
        company: data.company,
        industry: "Technology",
        serviceType: data.serviceType,
        serviceTier: data.subscriptionTier || "standard",
        monthlyRetainer: 0,
        projectDescription: "Client onboarding and service setup",
        projectGoals: [
          "Establish quality assurance processes",
          "Ensure service delivery quality",
        ],
        technologies: [data.serviceType],
        contractDuration: 12,
        teamSize: 5,
        previousSuccessRate: 75,
      };

      let aiAnalysis;
      try {
        aiAnalysis = await aiService.analyzeClient(aiAnalysisData);
      } catch (error) {
        console.warn("AI analysis failed, continuing without it:", error);
        aiAnalysis = {
          analysis: {},
          reasoning: "AI analysis unavailable",
          confidence: 0,
        };
      }

      // Create initial services - handle empty or undefined services
      const services: ClientService[] = await createClientServices(
        clientId,
        data.initialServices || []
      );

      // Build client data with optional fields
      const clientData: any = {
        id: clientId,
        name: data.name,
        email: data.email,
        company: data.company,
        status: data.status,
        serviceType: data.serviceType,
        logo: data.logo || "",
        color: data.color,
        services,
        totalQARuns: 0,
        averageQAScore: 0,
        criticalIssues: 0,
        openIssues: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastContact: serverTimestamp(),
      };

      // Add optional fields if they exist
      if (data.subscriptionTier) {
        clientData.subscriptionTier = data.subscriptionTier;
      }

      if (data.billingCycle) {
        clientData.billingCycle = data.billingCycle;
      }

      // Add AI analysis if available
      if (aiAnalysis?.analysis) {
        clientData.aiAnalysis = {
          ...aiAnalysis.analysis,
          lastAnalyzed: serverTimestamp(),
        };
        clientData.reasoning = aiAnalysis.reasoning;
        clientData.confidence = aiAnalysis.confidence;
      }

      await setDoc(clientRef, clientData);

      return {
        id: clientId,
        services,
        analysis: aiAnalysis?.analysis,
      };
    } catch (error: any) {
      console.error("Error creating client:", error);
      throw new Error(`Failed to create client: ${error.message}`);
    }
  },

  // Create client services - now as a regular method
  async createClientServices(
    clientId: string,
    serviceTypes: string[]
  ): Promise<ClientService[]> {
    return createClientServices(clientId, serviceTypes);
  },

  // Get service display name - now as a regular method
  getServiceName(serviceType: string): string {
    return getServiceName(serviceType);
  },

  // O(1) Get client by ID
  async getClient(id: string): Promise<Client | null> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastContact: data.lastContact?.toDate() || new Date(),
          services: data.services || [],
          subscriptionTier: data.subscriptionTier || "basic",
          billingCycle: data.billingCycle || "monthly",
        } as Client;
      }
      return null;
    } catch (error) {
      console.error("Error getting client:", error);
      return null;
    }
  },

  // O(n) Get clients with advanced filtering
  async getClients(
    filter: ClientsFilter
  ): Promise<{ clients: Client[]; total: number }> {
    try {
      let q = query(collection(db, CLIENTS_COLLECTION));
      const conditions = [];

      // Search filter
      if (filter.search) {
        conditions.push(
          where("name", ">=", filter.search),
          where("name", "<=", filter.search + "\uf8ff")
        );
      }

      // Status filter
      if (filter.status && filter.status !== "all") {
        conditions.push(where("status", "==", filter.status));
      }

      // Service type filter
      if (filter.serviceType && filter.serviceType !== "all") {
        conditions.push(where("serviceType", "==", filter.serviceType));
      }

      // Build query
      if (conditions.length > 0) {
        q = query(q, ...conditions, orderBy("name"));
      } else {
        q = query(q, orderBy("createdAt", "desc"));
      }

      const snapshot = await getDocs(q);
      const clients: Client[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        clients.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastContact: data.lastContact?.toDate() || new Date(),
          services: data.services || [],
          subscriptionTier: data.subscriptionTier || "basic",
          billingCycle: data.billingCycle || "monthly",
        } as Client);
      });

      // Client-side pagination
      const startIndex = (filter.page - 1) * filter.limit;
      const paginatedClients = clients.slice(
        startIndex,
        startIndex + filter.limit
      );

      return {
        clients: paginatedClients,
        total: clients.length,
      };
    } catch (error) {
      console.error("Error fetching clients:", error);
      return { clients: [], total: 0 };
    }
  },

  // O(1) Update client
  async updateClient(id: string, data: Partial<ClientFormData>): Promise<void> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Error updating client:", error);
      throw new Error(`Failed to update client: ${error.message}`);
    }
  },

  // O(1) Delete client
  async deleteClient(id: string): Promise<void> {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);

      // First, delete all associated services
      const servicesQuery = query(
        collection(db, CLIENT_SERVICES_COLLECTION),
        where("clientId", "==", id)
      );
      const servicesSnapshot = await getDocs(servicesQuery);

      const batch = writeBatch(db);
      servicesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete the client
      batch.delete(docRef);

      await batch.commit();
    } catch (error: any) {
      console.error("Error deleting client:", error);
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  },

  // Add service to existing client
  async addClientService(
    clientId: string,
    serviceType: string,
    credentials?: any
  ): Promise<ClientService> {
    try {
      const serviceId = `${clientId}-${serviceType}`;
      const serviceRef = doc(db, CLIENT_SERVICES_COLLECTION, serviceId);

      const service: ClientService = {
        id: serviceId,
        type: serviceType as any,
        name: getServiceName(serviceType),
        status: "active",
        credentials,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(serviceRef, {
        ...service,
        clientId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update client's services array
      const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
      await updateDoc(clientRef, {
        services: arrayUnion(service),
        updatedAt: serverTimestamp(),
      });

      return service;
    } catch (error: any) {
      console.error("Error adding client service:", error);
      throw new Error(`Failed to add service: ${error.message}`);
    }
  },

  // Remove service from client
  async removeClientService(
    clientId: string,
    serviceId: string
  ): Promise<void> {
    try {
      // Remove from services collection
      const serviceRef = doc(db, CLIENT_SERVICES_COLLECTION, serviceId);
      await deleteDoc(serviceRef);

      // Remove from client's services array
      const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
      const client = await this.getClient(clientId);

      if (client) {
        const updatedServices = client.services.filter(
          (service) => service.id !== serviceId
        );
        await updateDoc(clientRef, {
          services: updatedServices,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.error("Error removing client service:", error);
      throw new Error(`Failed to remove service: ${error.message}`);
    }
  },

  // Update service status
  async updateServiceStatus(
    clientId: string,
    serviceId: string,
    status: ClientService["status"]
  ): Promise<void> {
    try {
      const serviceRef = doc(db, CLIENT_SERVICES_COLLECTION, serviceId);
      await updateDoc(serviceRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      // Also update in client's services array
      const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
      const client = await this.getClient(clientId);
      if (client) {
        const updatedServices = client.services.map((service) =>
          service.id === serviceId ? { ...service, status } : service
        );

        await updateDoc(clientRef, {
          services: updatedServices,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.error("Error updating service status:", error);
      throw new Error(`Failed to update service status: ${error.message}`);
    }
  },

  // Update service credentials
  async updateServiceCredentials(
    clientId: string,
    serviceId: string,
    credentials: any
  ): Promise<void> {
    try {
      const serviceRef = doc(db, CLIENT_SERVICES_COLLECTION, serviceId);
      await updateDoc(serviceRef, {
        credentials,
        updatedAt: serverTimestamp(),
      });

      // Also update in client's services array
      const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
      const client = await this.getClient(clientId);
      if (client) {
        const updatedServices = client.services.map((service) =>
          service.id === serviceId ? { ...service, credentials } : service
        );

        await updateDoc(clientRef, {
          services: updatedServices,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error: any) {
      console.error("Error updating service credentials:", error);
      throw new Error(`Failed to update service credentials: ${error.message}`);
    }
  },

  // Get client with detailed services
  async getClientWithServices(
    id: string
  ): Promise<(Client & { detailedServices: ClientService[] }) | null> {
    try {
      const client = await this.getClient(id);
      if (!client) return null;

      // Get detailed service information
      const servicesQuery = query(
        collection(db, CLIENT_SERVICES_COLLECTION),
        where("clientId", "==", id)
      );
      const servicesSnapshot = await getDocs(servicesQuery);
      const detailedServices = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ClientService[];

      return {
        ...client,
        detailedServices,
      };
    } catch (error) {
      console.error("Error getting client with services:", error);
      return null;
    }
  },

  // Run QA for specific client service
  async runServiceQA(
    clientId: string,
    serviceType: string,
    requirements: QARequirement[]
  ): Promise<{ runId: string; results: any }> {
    try {
      const client = await this.getClientWithServices(clientId);
      if (!client) throw new Error("Client not found");

      const service = client.detailedServices.find(
        (s) => s.type === serviceType
      );
      if (!service) throw new Error("Service not found for client");

      // Create QA run record
      const runRef = doc(collection(db, "qa-runs"));
      const runId = runRef.id;

      const qaRun = {
        id: runId,
        clientId,
        serviceType,
        serviceId: service.id,
        requirements,
        status: "running",
        startedAt: serverTimestamp(),
      };

      await setDoc(runRef, qaRun);

      // Run the appropriate QA based on service type
      let results;
      try {
        switch (serviceType) {
          case "wordpress":
            if (!service.credentials?.value)
              throw new Error("Website URL required");
            results = await qualifAIService.runWordPressQA(
              service.credentials.value,
              requirements
            );
            break;
          case "seo":
            if (!service.credentials?.value)
              throw new Error("Website URL required");
            results = await qualifAIService.runSEOQA(
              service.credentials.value,
              requirements
            );
            break;
          case "ppc":
            results = await qualifAIService.runPPCQA(
              service.credentials,
              requirements
            );
            break;
          case "content":
            results = await qualifAIService.runContentQA(
              service.credentials,
              requirements
            );
            break;
          default:
            throw new Error(
              `QA not implemented for service type: ${serviceType}`
            );
        }

        // Update QA run with results
        await updateDoc(runRef, {
          results,
          status: "completed",
          completedAt: serverTimestamp(),
        });

        // Update service with QA results
        await this.updateServiceQAResults(service.id, results);

        // Update client QA metrics
        await this.updateClientQAMetrics(clientId, results);

        return { runId, results };
      } catch (error: any) {
        // Mark QA run as failed
        await updateDoc(runRef, {
          status: "failed",
          error: error.message,
          completedAt: serverTimestamp(),
        });
        throw error;
      }
    } catch (error: any) {
      console.error("Error running service QA:", error);
      throw new Error(`Failed to run service QA: ${error.message}`);
    }
  },

  // Update service with QA results
  async updateServiceQAResults(
    serviceId: string,
    results: any[]
  ): Promise<void> {
    try {
      const serviceRef = doc(db, CLIENT_SERVICES_COLLECTION, serviceId);

      const passed = results.filter((r: any) => r.status === "pass").length;
      const total = results.length;
      const qaScore = total > 0 ? Math.round((passed / total) * 100) : 0;

      await updateDoc(serviceRef, {
        lastQARun: serverTimestamp(),
        qaScore,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Error updating service QA results:", error);
      throw new Error(`Failed to update service QA results: ${error.message}`);
    }
  },

  // Update client QA metrics
  async updateClientQAMetrics(clientId: string, results: any[]): Promise<void> {
    try {
      const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
      const client = await this.getClient(clientId);

      if (!client) return;

      const criticalIssues = results.filter(
        (r: any) =>
          r.requirement?.priority === "critical" && r.status === "fail"
      ).length;

      const totalQARuns = (client.totalQARuns || 0) + 1;

      // Calculate new average QA score
      const currentServices = await this.getClientServices(clientId);
      const activeServices = currentServices.filter(
        (s) => s.status === "active"
      );
      const totalScore = activeServices.reduce(
        (sum, service) => sum + (service.qaScore || 0),
        0
      );
      const averageQAScore =
        activeServices.length > 0
          ? Math.round(totalScore / activeServices.length)
          : 0;

      await updateDoc(clientRef, {
        totalQARuns,
        averageQAScore,
        criticalIssues: (client.criticalIssues || 0) + criticalIssues,
        openIssues:
          (client.openIssues || 0) +
          results.filter((r: any) => r.status === "fail").length,
        lastQADate: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Error updating client QA metrics:", error);
      throw new Error(`Failed to update client QA metrics: ${error.message}`);
    }
  },

  // Get all services for a client
  async getClientServices(clientId: string): Promise<ClientService[]> {
    try {
      const servicesQuery = query(
        collection(db, CLIENT_SERVICES_COLLECTION),
        where("clientId", "==", clientId)
      );
      const servicesSnapshot = await getDocs(servicesQuery);
      return servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ClientService[];
    } catch (error) {
      console.error("Error getting client services:", error);
      return [];
    }
  },

  // Get clients by service type
  async getClientsByServiceType(serviceType: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, CLIENTS_COLLECTION),
        where("serviceType", "==", serviceType),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        services: doc.data().services || [],
        subscriptionTier: doc.data().subscriptionTier || "basic",
        billingCycle: doc.data().billingCycle || "monthly",
      })) as Client[];
    } catch (error) {
      console.error("Error getting clients by service type:", error);
      return [];
    }
  },

  // O(1) Run AI analysis on client
  async analyzeClient(id: string): Promise<any> {
    try {
      const client = await this.getClient(id);
      if (!client) {
        throw new Error("Client not found");
      }

      const analysis = await aiService.analyzeClient(client);

      // Update client with new analysis
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await updateDoc(docRef, {
        aiAnalysis: {
          ...analysis.analysis,
          lastAnalyzed: serverTimestamp(),
        },
        reasoning: analysis.reasoning,
        confidence: analysis.confidence,
        updatedAt: serverTimestamp(),
      });

      return analysis.analysis;
    } catch (error: any) {
      console.error("Error analyzing client:", error);
      throw new Error(`Failed to analyze client: ${error.message}`);
    }
  },

  // O(n) Get client statistics
  async getClientStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
    revenue: number;
    activeClients: number;
    totalQARuns: number;
    averageQAScore: number;
  }> {
    try {
      const snapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
      const stats = {
        total: 0,
        byStatus: {} as Record<string, number>,
        byService: {} as Record<string, number>,
        revenue: 0,
        activeClients: 0,
        totalQARuns: 0,
        averageQAScore: 0,
      };

      let totalScore = 0;
      let clientsWithQA = 0;

      snapshot.forEach((doc) => {
        const client = doc.data() as Client;
        stats.total++;
        stats.revenue += clientService.calculateRevenue(client);

        // Count by status
        stats.byStatus[client.status] =
          (stats.byStatus[client.status] || 0) + 1;

        // Count by service type
        stats.byService[client.serviceType] =
          (stats.byService[client.serviceType] || 0) + 1;

        // Count active clients
        if (client.status === "active") {
          stats.activeClients++;
        }

        // QA metrics
        stats.totalQARuns += client.totalQARuns || 0;
        if (client.averageQAScore && client.averageQAScore > 0) {
          totalScore += client.averageQAScore;
          clientsWithQA++;
        }
      });

      stats.averageQAScore =
        clientsWithQA > 0 ? Math.round(totalScore / clientsWithQA) : 0;

      return stats;
    } catch (error) {
      console.error("Error getting client stats:", error);
      return {
        total: 0,
        byStatus: {},
        byService: {},
        revenue: 0,
        activeClients: 0,
        totalQARuns: 0,
        averageQAScore: 0,
      };
    }
  },

  // Calculate revenue based on subscription tier
  calculateRevenue(client: Client): number {
    const tierPricing: Record<string, number> = {
      basic: 99,
      professional: 299,
      enterprise: 799,
    };

    const basePrice = tierPricing[client.subscriptionTier || "basic"] || 99;

    // Adjust for billing cycle
    if (client.billingCycle === "annual") {
      return basePrice * 12 * 0.8; // 20% discount for annual
    } else if (client.billingCycle === "quarterly") {
      return basePrice * 3;
    }

    return basePrice;
  },

  // O(1) Bulk operations
  async bulkUpdateStatus(
    ids: string[],
    status: Client["status"]
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      ids.forEach((id) => {
        const docRef = doc(db, CLIENTS_COLLECTION, id);
        batch.update(docRef, {
          status,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error: any) {
      console.error("Error bulk updating status:", error);
      throw new Error(`Failed to bulk update status: ${error.message}`);
    }
  },

  // O(1) Generate insights for all clients
  async generateBusinessInsights(): Promise<any> {
    try {
      const snapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return await aiService.generateClientInsights(clients);
    } catch (error: any) {
      console.error("Error generating business insights:", error);
      throw new Error(`Failed to generate insights: ${error.message}`);
    }
  },

  // Get QA runs for a client
  async getClientQARuns(clientId: string, limit: number = 10): Promise<any[]> {
    try {
      const q = query(
        collection(db, "qa-runs"),
        where("clientId", "==", clientId),
        orderBy("startedAt", "desc"),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting client QA runs:", error);
      return [];
    }
  },

  // Get service-specific analytics
  async getServiceAnalytics(serviceType: string): Promise<{
    totalClients: number;
    averageScore: number;
    commonIssues: string[];
    successRate: number;
  }> {
    try {
      const clients = await this.getClientsByServiceType(serviceType);
      const services = await Promise.all(
        clients.map((client) => this.getClientServices(client.id))
      );

      const allServices = services.flat();
      const typeServices = allServices.filter(
        (s) => s.type === serviceType && s.qaScore
      );

      const totalScore = typeServices.reduce(
        (sum, service) => sum + (service.qaScore || 0),
        0
      );
      const averageScore =
        typeServices.length > 0
          ? Math.round(totalScore / typeServices.length)
          : 0;

      return {
        totalClients: clients.length,
        averageScore,
        commonIssues: [],
        successRate:
          typeServices.length > 0
            ? (typeServices.filter((s) => (s.qaScore || 0) >= 80).length /
              typeServices.length) *
            100
            : 0,
      };
    } catch (error) {
      console.error("Error getting service analytics:", error);
      return {
        totalClients: 0,
        averageScore: 0,
        commonIssues: [],
        successRate: 0,
      };
    }
  },
};
