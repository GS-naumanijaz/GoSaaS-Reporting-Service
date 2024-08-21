import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { SourceConnection } from "../../models/SourceConnection";
import {
  useAddSourceConnection,
  useBulkDeleteSourceConnections,
  useDeleteSourceConnection,
  useEditSourceConnection,
  useSourceConnections,
  useTestSourceConnection,
  useUpdateSourceConnectionStatus,
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

  // const { mutate: deleteSourceConnection } =
  //   useDeleteSourceConnectionMutation();

  const { mutate: deleteSourceConnection } = useDeleteSourceConnection(appId);
  const { mutate: bulkDeleteSourceConnection } =
    useBulkDeleteSourceConnections(appId);
  const { mutate: updateSourceConnectionStatus } =
    useUpdateSourceConnectionStatus(appId);
  const { mutateAsync: testSourceConnection} = useTestSourceConnection(appId);
  const { mutate: addSourceConnection } = useAddSourceConnection(appId);
  const { mutate: editSourceConnection } = useEditSourceConnection(appId);

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data } = useSourceConnections(
    appId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );
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
        sourceConnection.isActive,
        sourceConnection.lastTestResult
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
    deleteSourceConnection(sourceId);
  };

  const handleBulkDelete = (sourceIds: number[]) => {
    bulkDeleteSourceConnection(sourceIds);
  };

  const handleBulkStatusUpdate = (sourceIds: number[], status: boolean) => {
    updateSourceConnectionStatus({ sourceIds, status });
  };

  const handleTest = async (testId: number) => {
    return testSourceConnection(testId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };  

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleAddNew = (formData: Record<string, string>) => {
    let sourceForm = mapFormDataKeys(formData);
    let newSource = new SourceConnection(
      undefined,
      sourceForm.alias,
      sourceForm.type,
      sourceForm.databaseName,
      sourceForm.host,
      sourceForm.port,
      sourceForm.username,
      sourceForm.password
    );
    addSourceConnection(newSource);
  };

  const handleEdit = (sourceId: number, updatedSource: any) => {
    editSourceConnection({ sourceId, updatedSource });
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
