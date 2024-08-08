import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { ReportsConnection } from "../../models/ReportsConnection";
import { Product } from "../Dashboard/Products";
import { useReportsQuery } from "../../hooks/useReportsQuery";

interface ReportsConnectionDataProps {
  product: Product;
}

const ReportsConnectionData = ({ product }: ReportsConnectionDataProps) => {
  const {
    data: reportsConnections,
    isLoading,
    isError,
    error,
  } = useReportsQuery(product.id);

  // Map reportsConnections to ReportsConnection objects
  const reportsConnectionsList: ReportsConnection[] = [];
  if (reportsConnections) {
    reportsConnections.forEach((reportConnection: any) => {
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
      {isLoading ? (
        <Spinner size="xl" />
      ) : isError ? (
        <Alert status="error">
          <AlertIcon />
          {error instanceof Error
            ? error.message
            : "Failed to fetch reports connection data."}
        </Alert>
      ) : (
        <CustomTable tableManager={manager} />
      )}
    </>
  );
};

export default ReportsConnectionData;
