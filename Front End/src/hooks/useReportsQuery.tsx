import { useQuery } from "@tanstack/react-query";
import { ReportsConnection } from "../models/ReportsConnection";

const fetchReportsConnections = async (
  productId: number
): Promise<ReportsConnection[]> => {
  const response = await fetch(
    `http://localhost:8080/applications/${productId}/reports`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reports connection data.");
  }

  const data = await response.json();
  return data.data.content;
};
export const useReportsQuery = (appId: number | null) => {
  return useQuery({
    queryKey: ["reportsConnections", appId],
    queryFn: () => {
      if (!appId) {
        return Promise.reject("No product ID provided.");
      }
      return fetchReportsConnections(appId);
    },
    enabled: !!appId, // Only fetch if productId is provided
  });
};
