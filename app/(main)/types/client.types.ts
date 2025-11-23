// types/client.types.ts
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive" | "pending";
  serviceType: ServiceType;
  logo?: string;
  color: string;
  services: ClientService[];
  subscriptionTier: "basic" | "professional" | "enterprise";
  billingCycle: "monthly" | "quarterly" | "annual";
  totalQARuns: number;
  averageQAScore: number;
  criticalIssues: number;
  openIssues: number;
  aiAnalysis?: AIClientAnalysis;
  reasoning?: string;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
  lastContact: Date;
  detailedServices?: ClientService[];
}

export interface ClientService {
  id: string;
  type: ServiceType;
  name: string;
  status: "active" | "inactive" | "pending";
  credentials?: ServiceCredentials;
  configuration?: ServiceConfiguration;
  lastQARun?: Date;
  qaScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceType =
  | "wordpress"
  | "ppc"
  | "seo"
  | "ai-automation"
  | "content"
  | "social-media";

export interface ServiceCredentials {
  // Common credentials
  url?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  accessToken?: string;

  // WordPress specific
  wpAdminUrl?: string;
  databaseHost?: string;
  environment?: "production" | "staging" | "development";

  // PPC specific
  adAccountId?: string;
  campaignIds?: string[];
  platform?: "google-ads" | "facebook-ads" | "linkedin-ads";

  // SEO specific
  searchConsoleUrl?: string;
  analyticsViewId?: string;
  targetKeywords?: string[];

  // AI Automation (n8n) specific
  n8nWebhookUrl?: string;
  workflowIds?: string[];
  apiCredentials?: Record<string, any>;

  // Content specific
  cmsType?: "wordpress" | "contentful" | "custom";
  contentRepository?: string;

  // Social Media specific
  socialPlatforms?: ("facebook" | "twitter" | "linkedin" | "instagram")[];
  pageIds?: string[];
}

export interface ServiceConfiguration {
  // WordPress configuration
  wordpress?: {
    theme: string;
    plugins: string[];
    performance: {
      caching: boolean;
      cdn: boolean;
      imageOptimization: boolean;
    };
    security: {
      ssl: boolean;
      firewall: boolean;
      backups: boolean;
    };
  };

  // PPC configuration
  ppc?: {
    dailyBudget: number;
    targetAudience: string[];
    adFormats: string[];
    conversionTracking: boolean;
  };

  // SEO configuration
  seo?: {
    targetKeywords: string[];
    competitorUrls: string[];
    localSeo: boolean;
    technicalSeo: boolean;
  };

  // AI Automation (n8n) configuration
  aiAutomation?: {
    workflowTesting: boolean;
    dataValidation: boolean;
    errorHandling: boolean;
    performanceMonitoring: boolean;
  };

  // Content configuration
  content?: {
    contentType: "blog" | "product" | "landing-page";
    tone: "professional" | "casual" | "technical";
    seoOptimization: boolean;
    grammarCheck: boolean;
  };

  // Social Media configuration
  socialMedia?: {
    platforms: {
      facebook?: { pageId: string; autoPost: boolean };
      twitter?: { handle: string; autoTweet: boolean };
      linkedin?: { companyId: string; autoPost: boolean };
      instagram?: { accountId: string; autoPost: boolean };
    };
    scheduling: boolean;
    analytics: boolean;
  };
}

export interface ClientFormData {
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive" | "pending";
  serviceType: ServiceType;
  logo?: string;
  color: string;
}

export interface ClientsFilter {
  search: string;
  status: string;
  serviceType: string;
  page: number;
  limit: number;
}

export interface AIClientAnalysis {
  priority: "high" | "medium" | "low";
  sentiment: "positive" | "neutral" | "negative";
  riskScore: number;
  opportunities: string[];
  recommendations: string[];
  lastAnalyzed: Date;
}
