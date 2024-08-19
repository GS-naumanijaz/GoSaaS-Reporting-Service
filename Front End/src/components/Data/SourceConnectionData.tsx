import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import {
  useAddSourceConnectionMutation,
  useBulkDeleteSourceConnectionMutation,
  useDeleteSourceConnectionMutation,
  useEditSourceConnectionMutation,
  useSourceConnections,
  useSourceConnectionsQuery,
  useTestSourceConnectionMutation,
  useUpdateSourceConnectionStatusMutation,
} from "../../hooks/useSourceConnectionQuery";
import {
  fieldMapping,
  FieldMappingKey,
  mapFormDataKeys,
} from "../../services/sortMappings";
import useSourceConnectionStore from "../../store/SourceConnStore";
import { useEffect } from "react";

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
    reset,
  } = useSourceConnectionStore();

  useEffect(() => {
    return () => {
      reset(); // Reset store state when component unmounts
    };
  }, [reset]);

  const { mutate: deleteSourceConnection } =
    useDeleteSourceConnectionMutation();
  const { mutate: bulkDeleteSourceConnection } =
    useBulkDeleteSourceConnectionMutation();
  const { mutate: updateSourceConnectionStatus } =
    useUpdateSourceConnectionStatusMutation();
  const testSourceConnection = useTestSourceConnectionMutation();
  const { mutate: addSourceConnection } = useAddSourceConnectionMutation();
  const { mutate: editSourceConnection } = useEditSourceConnectionMutation();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;


  const { data } = useSourceConnections(appId, sortField, sortOrder, page, pageSize, searchTerm, actualSearchField);
  const sourceConnections = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

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

  const handleAddNew = (formData: Record<string, string>) => {
    addSourceConnection({
      appId,
      data: mapFormDataKeys(formData),
    });
  };

  const handleEdit = (editId: number, editedItem: any) => {
    editSourceConnection({ appId, editId, editedItem });
  };

  const handleClearSearch = () => {
    setSearchField("");
    setSearchTerm("");
  };

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
        onAddNew={handleAddNew}
        handleClearSearch={handleClearSearch}
      />
  );
};

export default SourceConnectionData;
