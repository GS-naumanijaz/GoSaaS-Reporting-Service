import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { ReportsConnection } from "../../models/ReportsConnection";
import { Product } from "../Dashboard/Products";
import { useReportsQuery } from "../../hooks/useReportsQuery";
import { useState } from "react";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";

interface ReportsConnectionDataProps {
  product: Product | null;
}

const ReportsConnectionData = ({ product }: ReportsConnectionDataProps) => {
  const productId = product?.id ?? null;
  const [sortField, setSortField] = useState<FieldMappingKey>("Alias");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");

  const {
    data: reportsConnections,
    isLoading,
    isError,
    error,
  } = useReportsQuery(productId, sortField, sortOrder);

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  // Apply filtering based on searchTerm and searchField
  const filteredReportsConnections =
    reportsConnections?.filter((reportConnection: any) => {
      if (actualSearchField && searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();

        if (
          ["source_connection", "destination_connection"].includes(
            actualSearchField
          )
        ) {
          const connectionField = reportConnection[actualSearchField];
          return connectionField.alias.toLowerCase().includes(searchTermLower);
        }

        const fieldValue = reportConnection[actualSearchField];

        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchTermLower);
        }

        if (typeof fieldValue === "number") {
          return fieldValue.toString().includes(searchTermLower);
        }

        if (typeof fieldValue === "boolean") {
          const searchBoolean = searchTermLower === "active";
          return fieldValue === searchBoolean;
        }

        if (Array.isArray(fieldValue)) {
          const searchArray = fieldValue.join(" ").toLowerCase();
          return searchArray.includes(searchTermLower);
        }
      }

      // If actualSearchField or searchTerm is not set, include this item
      return true;
    }) || [];

  // Map reportsConnections to ReportsConnection objects
  const reportsConnectionsList: ReportsConnection[] =
    filteredReportsConnections.map(
      (reportConnection: any) =>
        new ReportsConnection(
          reportConnection.id,
          reportConnection.alias,
          reportConnection.description,
          reportConnection.source_connection.alias,
          reportConnection.destination_connection.alias,
          reportConnection.storedProcedure,
          reportConnection.params,
          reportConnection.application
        )
    );

  const manager = new TableManager(
    new ReportsConnection(),
    reportsConnectionsList,
    product ?? undefined
  );

  const handleSort = (field: FieldMappingKey, order: string) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

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
        <CustomTable
          tableManager={manager}
          onSort={handleSort}
          onSearch={handleSearch}
        />
      )}
    </>
  );
};

export default ReportsConnectionData;
