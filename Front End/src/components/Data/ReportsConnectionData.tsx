import { useEffect, useState } from "react";
import { ReportsConnection } from "../../models/ReportsConnection";
import { TableManager } from "../../models/TableManager";
import CustomTable from "../Shared/CustomTable";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { Product } from "../Dashboard/Products";

interface ReportsConnectionDataProps {
  product: Product;
}

interface ReportCons {
  forEach: any;
  reports: ReportsConnection[];
}

const ReportsConnectionData = ({ product }: ReportsConnectionDataProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportsConnections, setReportsConnections] =
    useState<ReportCons | null>(null);

  useEffect(() => {
    const fetchReportsConnections = async () => {
      if (product) {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/reports`, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          setReportsConnections(data.data.content);
          console.log("ReportsData: ", data.data.content);
        } catch (error) {
          console.error(error);
          setError("Failed to fetch reports connection data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReportsConnections();
  }, [product]);

  // Map reportsConnections to ReportsConnection objects
  const reportsConnectionsList: ReportsConnection[] = [];
  if (reportsConnections) {
    reportsConnections.forEach((reportConnection: any) => {
      if (reportConnection.application.id !== product.id) return;
      reportsConnectionsList.push(
        new ReportsConnection(
          reportConnection.id,
          reportConnection.alias,
          reportConnection.description,
          reportConnection.source_connection.alias,
          reportConnection.destination_connection.alias,
          reportConnection.stored_procedure,
          reportConnection.params,
          reportConnection.application
        )
      );
    });
  }

  const manager = new TableManager(reportsConnectionsList, product);

  return (
    <>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <CustomTable tableManager={manager} />
      )}
    </>
  );
};

export default ReportsConnectionData;
