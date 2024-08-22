import { useMutation, useQuery } from "@tanstack/react-query";
import { BackendURL } from "../configs";
import { useErrorToast } from "./useErrorToast";

const fetchAppData = async (appId: number) => {
  const response = await fetch(`${BackendURL}/applications/${appId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch application data.");
  }

  const data = await response.json();
  return data.data;
};

export const useAppDataQuery = (appId: number | null) => {
  return useQuery({
    queryKey: ["application", appId],
    queryFn: () => {
      if (!appId) {
        return Promise.reject("No application ID provided.");
      }
      return fetchAppData(appId);
    },

    enabled: !!appId, // Only fetch if appId is provided and not for new application
  });
};

const saveApp = async (name: string, description: string) => {
  const response = await fetch(`${BackendURL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ alias: name, description }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to save application");
  }

  return response.json();
};

// useAppDataMutation hook
export const useAppDataMutation = () => {
  return useMutation({
    mutationFn: (formData: {
      applicationName: string;
      applicationDescription: string;
    }) => {
      return saveApp(formData.applicationName, formData.applicationDescription);
    },
    // onSuccess: (data) => {
    //   // console.log("Application saved successfully:", data);
    // },
    onError: (error) => {
      useErrorToast()(error.message);
    },
  });
};
