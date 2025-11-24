// hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientService } from "@/app/(main)/lib/services/client.service";
import {
  Client,
  ClientFormData,
  ClientsFilter,
  AIClientAnalysis,
} from "@/app/(main)/types/client.types";
import { toast } from "react-hot-toast";

export const useClients = (filter: ClientsFilter) => {
  const queryClient = useQueryClient();

  // O(1) Cache lookup for clients
  const clientsQuery = useQuery({
    queryKey: ["clients", filter],
    queryFn: () => clientService.getClients(filter),
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  // O(1) Cache lookup for stats
  const statsQuery = useQuery({
    queryKey: ["client-stats"],
    queryFn: clientService.getClientStats,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // O(1) Mutation operations
  const createClientMutation = useMutation({
    mutationFn: clientService.createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });

      toast.success("Client created successfully!", {
        duration: 4000,
        icon: "🎉",
      });

      // Show AI analysis if available
      if (data.analysis) {
        toast.success("AI analysis completed!", {
          duration: 5000,
          icon: "🤖",
        });
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to create client: ${error.message}`);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientFormData> }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      toast.success("Client deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });

  const analyzeClientMutation = useMutation({
    mutationFn: clientService.analyzeClient,
    onSuccess: (analysis) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("AI analysis completed!", {
        duration: 5000,
        icon: "🤖",
      });

      // Show analysis summary
      setTimeout(() => {
        toast.success(
          `Priority: ${analysis.priority.toUpperCase()} | Sentiment: ${
            analysis.sentiment
          }`,
          {
            duration: 6000,
          }
        );
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(`AI analysis failed: ${error.message}`);
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[];
      status: Client["status"];
    }) => clientService.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      toast.success(`Updated ${ids.length} clients`);
    },
  });

  // O(1) Search operation using cached data
  const searchClients = (searchTerm: string): Client[] => {
    const cachedData = queryClient.getQueryData(["clients", filter]) as
      | { clients: Client[] }
      | undefined;

    if (!cachedData || !searchTerm) return cachedData?.clients || [];

    const searchLower = searchTerm.toLowerCase();
    return cachedData.clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchLower) ||
        client.company.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.industry.toLowerCase().includes(searchLower)
    );
  };

  return {
    // Query data
    clients: clientsQuery.data?.clients || [],
    total: clientsQuery.data?.total || 0,
    stats: statsQuery.data,

    // Loading states
    isLoading: clientsQuery.isLoading,
    isError: clientsQuery.isError,
    isStatsLoading: statsQuery.isLoading,

    // Mutations
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    analyzeClient: analyzeClientMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,

    // Mutation states
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
    isAnalyzing: analyzeClientMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,

    // Utilities
    searchClients,
    refetch: clientsQuery.refetch,
    refetchStats: statsQuery.refetch,
  };
};
