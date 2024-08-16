import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { DestinationConnection } from "../../models/DestinationConnection";
import {
  useBulkDeleteDestinationConnectionMutation,
  useDeleteDestinationConnectionMutation,
  useDestinationConnectionsQuery,
  useEditDestinationConnectionMutation,
  useTestDestinationConnectionMutation,
  useUpdateDestinationConnectionStatusMutation,
  useAddDestinationonnectionMutation,
} from "../../hooks/useDestinationConnectionQuery";
import {
  fieldMapping,
  FieldMappingKey,
  mapFormDataKeys,
} from "../../services/sortMappings";
import useDestinationConnectionStore from "../../store/DestinationConnStore";

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
  } = useDestinationConnectionStore();

  const { mutate: deleteDestinationConnection } =
    useDeleteDestinationConnectionMutation();
  const { mutate: bulkDeleteDestinationConnection } =
    useBulkDeleteDestinationConnectionMutation();
  const { mutate: updateDestinationConnectionStatus } =
    useUpdateDestinationConnectionStatusMutation();
  const testDestinationMutation = useTestDestinationConnectionMutation();
  const { mutate: addDestinationConnection } =
    useAddDestinationonnectionMutation();
  const { mutate: editDestinationConnection } =
    useEditDestinationConnectionMutation();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const {
    data: { content: destinationConnections = [], totalElements = 0 } = {},
  } = useDestinationConnectionsQuery(
    appId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );

  const destinationConnectionsList: DestinationConnection[] =
    destinationConnections.map(
      (destinationConnection: any) =>
        new DestinationConnection(
          destinationConnection.id,
          destinationConnection.alias,
          destinationConnection.secretKey,
          destinationConnection.accessKey,
          destinationConnection.bucketName,
          destinationConnection.region,
          destinationConnection.application,
          destinationConnection.isActive
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
    deleteDestinationConnection({ appId, destinationId });
  };

  const handleBulkDelete = (destinationIds: number[]) => {
    bulkDeleteDestinationConnection({ appId, destinationIds });
  };

  const handleBulkStatusUpdate = (
    destinationIds: number[],
    status: boolean
  ) => {
    updateDestinationConnectionStatus({ appId, destinationIds, status });
  };

  const handleTest = async (appId: number, testId: number) => {
    return testDestinationMutation.mutateAsync({ appId, testId });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleAddNew = (formData: Record<string, string>) => {
    addDestinationConnection({
      appId,
      data: mapFormDataKeys(formData),
    });
  };

  const handleEdit = (editId: number, editedItem: any) => {
    editDestinationConnection({ appId, editId, editedItem });
  };

  const manager = new TableManager(
    new DestinationConnection(),
    destinationConnectionsList
  );
  return (
    <CustomTable
      tableManager={manager}
      appId={appId}
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
      }}
      onAddNew={handleAddNew}
    />
  );
};

export default DestinationConnectionData;
