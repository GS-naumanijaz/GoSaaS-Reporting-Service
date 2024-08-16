import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import {
  useBulkDeleteSourceConnectionMutation,
  useDeleteSourceConnectionMutation,
  useEditSourceConnectionMutation,
  useSourceConnectionsQuery,
  useTestSourceConnectionMutation,
  useUpdateSourceConnectionStatusMutation,
} from "../../hooks/useSourceConnectionQuery";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useSourceConnectionStore from "../../store/SourceConnStore";
interface SourceConnectionDataProps {
  appId: number;
}

const SourceConnectionData = ({ appId }: SourceConnectionDataProps) => {
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
  } = useSourceConnectionStore();

  const { mutate: deleteSourceConnection } =
    useDeleteSourceConnectionMutation();
  const { mutate: bulkDeleteSourceConnection } =
    useBulkDeleteSourceConnectionMutation();
  const { mutate: updateSourceConnectionStatus } =
    useUpdateSourceConnectionStatusMutation();
  const testSourceConnection = useTestSourceConnectionMutation();
  const { mutate: editSourceConnection } = useEditSourceConnectionMutation();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data: { content: sourceConnections = [], totalElements = 0 } = {} } =
    useSourceConnectionsQuery(
      appId,
      sortField,
      sortOrder,
      page,
      pageSize,
      searchTerm,
      actualSearchField
    );

  const sourceConnectionsList: SourceConnection[] = sourceConnections!.map(
    (sourceConnection: any) =>
      new SourceConnection(
        sourceConnection.id,
        sourceConnection.alias,
        sourceConnection.type ?? "",
        sourceConnection.databaseName,
        sourceConnection.host,
        sourceConnection.port.toString(),
        sourceConnection.username,
        sourceConnection.password,
        sourceConnection.application,
        sourceConnection.isActive
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

  const handleDelete = (sourceId: number) => {
    deleteSourceConnection({ appId, sourceId });
  };

  const handleBulkDelete = (sourceIds: number[]) => {
    bulkDeleteSourceConnection({ appId, sourceIds });
  };

  const handleBulkStatusUpdate = (sourceIds: number[], status: boolean) => {
    updateSourceConnectionStatus({ appId, sourceIds, status });
  };

  const handleTest = async (appId: number, testId: number) => {
    return testSourceConnection.mutateAsync({ appId, testId });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleEdit = (editId: number, editedItem: any) => {
    editSourceConnection({appId, editId, editedItem})
  }

  const manager = new TableManager(
    new SourceConnection(),
    sourceConnectionsList
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
    />
  );
};

export default SourceConnectionData;
