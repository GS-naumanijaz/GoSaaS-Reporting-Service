import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorToast } from "./useErrorToast";
import APIClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

const createApiClient = () => new APIClient<any>(`applications`);

// Query to fetch application data by ID
export const useAppDataQuery = (appId: number | null) => {
  const apiClient = createApiClient();

  return useQuery({
    queryKey: ["application", appId],
    queryFn: () => {
      if (!appId) {
        return Promise.reject("No application ID provided.");
      }
      return apiClient.get(`${appId}`);
    },
    enabled: !!appId, // Only fetch if appId is provided and not for new applications
  });
};


// Mutation to save a new application
export const useAppDataMutation = () => {
  const apiClient = createApiClient();

  return useMutation({
    mutationFn: (formData: { applicationName: string; applicationDescription: string }) => {
      return apiClient.create({
        alias: formData.applicationName,
        description: formData.applicationDescription,
      });
    },
    onError: (error: any) => {
      useErrorToast()(error.message);
    },
  });
};

export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const apiClient = createApiClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`${id}`),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products" || query.queryKey[0] === "application" || query.queryKey[0] === "auditLogs",
      });
      navigate(`/homepage`);
    },
    onError: (error: any) => {
      useErrorToast()(error.message);
      console.error("Error deleting application", error);
    },
  });
};

export const useSaveApplicationMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const apiClient = createApiClient();

  return useMutation({
    mutationFn: async (appData: any) => {
      const { id, ...appDataToSend } = appData;
      if (id) {
        return apiClient.update(`${id}`, appDataToSend);
      } else {
        return apiClient.create(appDataToSend);
      }
    },
    onSuccess: async (savedApplication) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products" || query.queryKey[0] === "application" || query.queryKey[0] === "auditLogs",
      });
      navigate(`/homepage`);
    },
    onError: (error: any) => {
      useErrorToast()(error.message);
      console.error("Error saving application", error);
    },
  });
};
