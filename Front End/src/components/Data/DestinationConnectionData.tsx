import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import {
  useDestinationConnections,
  useDeleteDestinationConnection,
  useBulkDeleteDestinationConnections,
  useUpdateDestinationConnectionStatus,
  useTestDestinationConnection,
  useAddDestinationConnection,
  useEditDestinationConnection,
} from "../../hooks/useDestinationConnectionQuery";
import {
  fieldMapping,
  FieldMappingKey,
  mapFormDataKeys,
} from "../../services/sortMappings";
import useDestinationConnectionStore from "../../store/DestinationConnStore";
import { useEffect } from "react";

interface DestinationConnectionDataProps {
  appId: number;
}

const DestinationConnectionData = ({
  appId,
}: DestinationConnectionDataProps) => {
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
    reset,
  } = useDestinationConnectionStore();

  useEffect(() => {
    return () => {
      reset(); // Reset store state when component unmounts
    };
  }, [reset]);

  const { mutate: deleteDestinationConnection } =
    useDeleteDestinationConnection(appId);
  const { mutate: bulkDeleteDestinationConnection } =
    useBulkDeleteDestinationConnections(appId);
  const { mutate: updateDestinationConnectionStatus } =
    useUpdateDestinationConnectionStatus(appId);
  const testDestinationMutation = useTestDestinationConnection(appId);
  const { mutateAsync: addDestinationConnection } =
    useAddDestinationConnection(appId);
  const { mutate: editDestinationConnection } =
    useEditDestinationConnection(appId);

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data } = useDestinationConnections(
    appId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );
  const destinationConnections = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  const destinationConnectionsList: DestinationConnection[] =
    destinationConnections.map(
      (destinationConnection: any) =>
        new DestinationConnection(
          destinationConnection.id,
          destinationConnection.alias,
          destinationConnection.accessKey,
          destinationConnection.secretKey,
          destinationConnection.bucketName,
          destinationConnection.region,
          destinationConnection.application,
          destinationConnection.isActive,
          destinationConnection.lastTestResult
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

  const handleDelete = (destinationId: number) => {
    deleteDestinationConnection(destinationId);
  };

  const handleBulkDelete = (destinationIds: number[]) => {
    bulkDeleteDestinationConnection(destinationIds);
  };

  const handleBulkStatusUpdate = (
    destinationIds: number[],
    status: boolean
  ) => {
    updateDestinationConnectionStatus({ destinationIds, status });
  };

  const handleTest = async (testId: number) => {
    return testDestinationMutation.mutateAsync(testId);
  };

  function handleClearSort(): void {
    setSortField("updatedAt");
    setSortOrder("desc");
    setPage(0);
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleAddNew = async (formData: Record<string, string>) => {
    let destinationForm = mapFormDataKeys(formData);
    let newDestination = new DestinationConnection(
      undefined,
      destinationForm.alias,
      destinationForm.accessKey,
      destinationForm.secretKey,
      destinationForm.bucketName,
      destinationForm.region
    );
    await addDestinationConnection(newDestination);
  };

  const handleEdit = (destinationId: number, updatedDestination: any) => {
    editDestinationConnection({ destinationId, updatedDestination });
  };

  const handleClearSearch = () => {
    setSearchField("");
    setSearchTerm("");
  };

  const manager = new TableManager(
    new DestinationConnection(),
    destinationConnectionsList
  );
  return (
    <CustomTable
      tableManager={manager}
      onSort={handleSort}
      onSearch={handleSearch}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      onBulkUpdateStatus={handleBulkStatusUpdate}
      onTestConnection={handleTest}
      onEdit={handleEdit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      page={page}
      pageSize={pageSize}
      totalElements={totalElements}
      searchObject={{
        searchField: actualSearchField,
        searchTerm: searchTerm,
        sortField: sortField,
        sortOrder: sortOrder,
      }}
      onAddNew={handleAddNew}
      handleClearSearch={handleClearSearch}
      handleClearSort={handleClearSort}
      onDateSearch={function (date: string[]): void {
        throw new Error("onDateSearch function not implemented." + date);
      }}
      handleClearDates={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
};

export default DestinationConnectionData;
