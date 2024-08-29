import { useMutation, useQuery } from "@tanstack/react-query";
import { useErrorToast } from "./useErrorToast";
import APIClient from "../services/apiClient";

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