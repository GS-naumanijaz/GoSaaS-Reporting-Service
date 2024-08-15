import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { ReportsConnection } from "../../models/ReportsConnection";
import { Product } from "../Dashboard/Products";
import { useReportsQuery } from "../../hooks/useReportsQuery";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useReportsConnectionStore from "../../store/ReportsStore";

interface ReportsConnectionDataProps {
  product: Product | null;
}

const ReportsConnectionData = ({ product }: ReportsConnectionDataProps) => {
  const productId = product?.id ?? null;
  const {
    sortField,
    sortOrder,
    searchTerm,
    searchField,
    page,
    pageSize,
    setSortField,
    setSortOrder,
    setSearchTerm,
    setSearchField,
    setPage,
    setPageSize,
  } = useReportsConnectionStore();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const {
    data: { content: reportsConnections = [], totalElements = 0 } = {},
    isLoading,
    isError,
    error,
  } = useReportsQuery(
    productId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );

  const reportsConnectionsList: ReportsConnection[] = reportsConnections.map(
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
          searchObject={{
            searchField: actualSearchField,
            searchTerm: searchTerm,
          }}
        />
      )}
    </>
  );
};

export default ReportsConnectionData;
