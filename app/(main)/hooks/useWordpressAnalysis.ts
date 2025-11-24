// hooks/useWordpressAnalysis.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/(main)/lib/firebase/config";
import { useState } from "react";

export interface AnalysisResult {
  id?: string;
  websiteUrl: string;
  score: number;
  grade: string;
  summary: string;
  insights: any[];
  problems: Problem[];
  timestamp: Date;
  analysisTime: number;
  clientId?: string;
  customInstructions?: string;
  uploadedFiles?: any[];
  similarSites?: any[];
  aiRecommendations?: any;
  performance?: any;
  security?: any;
  seo?: any;
  content?: any;
  technical?: any;
  accessibility?: any;
  ecommerce?: any;
  analytics?: any;
  mobile?: any;
  coreWebVitals?: any;
  apiTests?: any[];
  emailTest?: any;
}

export interface Problem {
  type: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  position: { x: number; y: number };
  fix: string;
  element?: string;
  screenshot?: string;
}

export interface AnalysisRequest {
  url: string;
  tests: string[];
  customInstructions: string;
  isLocalhost: boolean;
  clientId?: string;
  mode: string;
  uploadedFiles: any[];
}

class WordPressAnalysisService {
  async runAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    console.log("Starting analysis for:", request.url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch("/api/qualifai/wordpress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 408) {
          throw new Error(
            "Analysis timeout - website may be too slow. Try again with fewer tests."
          );
        } else if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please wait a minute before trying again."
          );
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Analysis failed with status: ${response.status}`
          );
        }
      }

      const data = await response.json();
      console.log("Analysis completed successfully:", data);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Analysis error:", error);

      if (error.name === "AbortError") {
        throw new Error(
          "Analysis timeout - the website took too long to respond. Try a quicker analysis mode."
        );
      }

      throw new Error(
        error.message ||
          "Analysis failed. Please check the website URL and try again."
      );
    }
  }

  async saveAnalysis(analysis: AnalysisResult): Promise<string> {
    try {
      if (!db) {
        console.warn("Firestore not available, skipping save");
        return "local-save";
      }

      const docRef = await addDoc(collection(db, "analyses"), {
        ...analysis,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Analysis saved to Firestore:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Failed to save analysis to Firestore:", error);
      return "local-save";
    }
  }

  async getAnalyses(clientId?: string, limitCount: number = 10) {
    try {
      if (!db) {
        console.warn("Firestore not available, returning empty array");
        return [];
      }

      let q;
      if (clientId) {
        q = query(
          collection(db, "analyses"),
          where("clientId", "==", clientId),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
      } else {
        q = query(
          collection(db, "analyses"),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      const analyses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
        updatedAt: doc.data().updatedAt?.toDate?.(),
      }));

      return analyses;
    } catch (error) {
      console.error("Error fetching analyses:", error);
      return [];
    }
  }

  async getAnalysis(analysisId: string) {
    try {
      if (!db) {
        throw new Error("Firestore not available");
      }

      const docRef = doc(db, "analyses", analysisId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new Error("Analysis not found");
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.(),
        updatedAt: snapshot.data().updatedAt?.toDate?.(),
      };
    } catch (error) {
      console.error("Error fetching analysis:", error);
      throw error;
    }
  }

  async updateAnalysis(analysisId: string, updates: Partial<AnalysisResult>) {
    try {
      if (!db) {
        throw new Error("Firestore not available");
      }

      const docRef = doc(db, "analyses", analysisId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating analysis:", error);
      throw error;
    }
  }

  async deleteAnalysis(analysisId: string) {
    try {
      if (!db) {
        throw new Error("Firestore not available");
      }

      const docRef = doc(db, "analyses", analysisId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting analysis:", error);
      throw error;
    }
  }
}

export const wordPressAnalysisService = new WordPressAnalysisService();

export const useWordPressAnalysis = () => {
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = useState(false);

  const runAnalysisMutation = useMutation({
    mutationFn: (request: AnalysisRequest) =>
      wordPressAnalysisService.runAnalysis(request),
    onMutate: () => {
      setIsRunning(true);
      console.log("Starting analysis mutation...");
    },
    onSuccess: async (data) => {
      console.log("Analysis successful, saving...", data);
      try {
        await wordPressAnalysisService.saveAnalysis(data);
        queryClient.invalidateQueries({ queryKey: ["analyses"] });
      } catch (saveError) {
        console.error("Failed to save analysis:", saveError);
      }
    },
    onError: (error: any) => {
      console.error("Analysis mutation failed:", error);
    },
    onSettled: () => {
      setIsRunning(false);
      console.log("Analysis mutation settled");
    },
  });

  const saveAnalysisMutation = useMutation({
    mutationFn: (analysis: AnalysisResult) =>
      wordPressAnalysisService.saveAnalysis(analysis),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });

  const useAnalyses = (clientId?: string, limitCount?: number) => {
    return useQuery({
      queryKey: ["analyses", clientId, limitCount],
      queryFn: () => wordPressAnalysisService.getAnalyses(clientId, limitCount),
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useAnalysis = (analysisId: string) => {
    return useQuery({
      queryKey: ["analysis", analysisId],
      queryFn: () => wordPressAnalysisService.getAnalysis(analysisId),
      enabled: !!analysisId && analysisId !== "local-save",
      retry: 2,
    });
  };

  return {
    runAnalysis: runAnalysisMutation.mutateAsync,
    saveAnalysis: saveAnalysisMutation.mutateAsync,
    useAnalyses,
    useAnalysis,
    isRunning: isRunning || runAnalysisMutation.isPending,
    error: runAnalysisMutation.error,
    data: runAnalysisMutation.data,
  };
};
