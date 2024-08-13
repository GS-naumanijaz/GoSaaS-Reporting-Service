import { useQuery } from "@tanstack/react-query";
import { ReportsConnection } from "../models/ReportsConnection";

const fetchReportsConnections = async (
  productId: number,
  sortField: string,
  sortOrder: string
): Promise<ReportsConnection[]> => {
  const params = new URLSearchParams({
    sort_by: sortField,
    sort_order: sortOrder,
  });

  const response = await fetch(
    `http://localhost:8080/applications/${productId}/reports?${params.toString()}`,
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

export const useReportsQuery = (
  productId: number | null,
  sortField: string,
  sortOrder: string
) => {
  return useQuery({
    queryKey: ["reportsConnections", productId, sortField, sortOrder],
    queryFn: () => {
      if (!productId) {
        throw new Error("No product ID provided.");
      }
      return fetchReportsConnections(productId, sortField, sortOrder);
    },
    enabled: !!productId, // Only fetch if productId is provided
    staleTime: 0, // Mark data as stale as soon as it is received
    gcTime: 0, // No caching (note: 'gcTime' is an incorrect option in react-query)
  });
};
