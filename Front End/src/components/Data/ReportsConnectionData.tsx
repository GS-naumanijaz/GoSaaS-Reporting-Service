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
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  const {
    data: { content: reportsConnections } = {},
    data: { totalElements = 0 } = {},
    isLoading,
    isError,
    error,
  } = useReportsQuery(productId, sortField, sortOrder, page, pageSize);

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  // Apply filtering based on searchTerm and searchField
  const filteredReportsConnections =
    reportsConnections?.filter((reportConnection: any) => {
      if (actualSearchField && searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
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
      return true;
    }) || [];

  const reportsConnectionsList: ReportsConnection[] =
    filteredReportsConnections.map(
      (reportConnection: any) =>
        new ReportsConnection(
          reportConnection.id,
          reportConnection.alias,
          reportConnection.description,
          reportConnection.sourceConnection.alias,
          reportConnection.destinationConnection.alias,
          reportConnection.storedProcedure,
          reportConnection.params,
          reportConnection.application
        )
    );

  const handleSort = (field: FieldMappingKey, order: string) => {
    const mappedField = fieldMapping[field];
    setSortField(mappedField);
    setSortOrder(order);
  };

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  const manager = new TableManager(
    new ReportsConnection(),
    reportsConnectionsList,
    product ?? undefined
  );

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
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements}
        />
      )}
    </>
  );
};

export default ReportsConnectionData;
