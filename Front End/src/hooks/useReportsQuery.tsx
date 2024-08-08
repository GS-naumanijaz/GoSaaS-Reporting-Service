import { useQuery } from "@tanstack/react-query";
import { ReportsConnection } from "../models/ReportsConnection";

const fetchReportsConnections = async (
  productId: number
): Promise<ReportsConnection[]> => {
  const response = await fetch(`http://localhost:8080/reports`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reports connection data.");
  }

  const data = await response.json();
  return data.data.content.filter(
    (report: any) => report.application.id === productId
  );
};

export const useReportsQuery = (productId: number | null) => {
  return useQuery({
    queryKey: ["reportsConnections", productId],
    queryFn: () => {
      if (!productId) {
        return Promise.reject("No product ID provided.");
      }
      return fetchReportsConnections(productId);
    },
    enabled: !!productId, // Only fetch if productId is provided
  });
};
