import { useQuery } from "@tanstack/react-query";

const fetchAppData = async (appId: number) => {
  const response = await fetch(`http://localhost:8080/applications/${appId}`, {
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
    enabled: !!appId, // Only fetch if appId is provided
  });
};
