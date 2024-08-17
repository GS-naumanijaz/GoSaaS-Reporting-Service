import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { ReportsConnection } from "../../models/ReportsConnection";
import { Product } from "../Dashboard/Products";
import {
  useBulkDeleteReportMutation,
  useDeleteReportMutation,
  useReportsQuery,
} from "../../hooks/useReportsQuery";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useReportsConnectionStore from "../../store/ReportsStore";
import { useNavigate } from "react-router-dom";

interface ReportsConnectionDataProps {
  product: Product | null;
}

const ReportsConnectionData = ({ product }: ReportsConnectionDataProps) => {
  const navigate = useNavigate();

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

  const { mutate: deleteReport } = useDeleteReportMutation();
  const { mutate: bulkDeleteReport } = useBulkDeleteReportMutation();
  // const { mutate: editSourceConnection } = useEditSourceConnectionMutation();

  // Determine the actual field to search by, using fieldMapping if it exists
  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data: { content: reportsConnections = [], totalElements = 0 } = {} } =
    useReportsQuery(
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
        reportConnection.sourceConnection,
        reportConnection.destinationConnection,
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

  const handleDelete = (reportId: number) => {
    let appId = product!.id;
    deleteReport({ appId, reportId });
  };

  const handleBulkDelete = (reportIds: number[]) => {
    let appId = product!.id;
    bulkDeleteReport({ appId, reportIds });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleEdit = (report: ReportsConnection) => {
    let productDetails = product;
    navigate("/addreports", { state: { productDetails, report } });
  };

  const manager = new TableManager(
    new ReportsConnection(),
    reportsConnectionsList,
    product ?? undefined
  );

  return (
    <CustomTable
      tableManager={manager}
      appId={product!.id}
      onSort={handleSort}
      onSearch={handleSearch}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      onClickEdit={handleEdit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      page={page}
      pageSize={pageSize}
      totalElements={totalElements}
      searchObject={{
        searchField: actualSearchField,
        searchTerm: searchTerm,
      }}
      onAddNew={() => navigate("/addreports", { state: { product } })}
    />
  );
};

export default ReportsConnectionData;
