import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "../Shared/CustomTable";
import { TableManager } from "../../models/TableManager";
import { ReportsConnection } from "../../models/ReportsConnection";
import { Product } from "../Dashboard/Products";
import {
  useBulkDeleteReport,
  useDeleteReport,
  useReports,
  useBulkUpdateReportStatus,
} from "../../hooks/useReportsQuery";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useReportsConnectionStore from "../../store/ReportsStore";

interface ReportsConnectionDataProps {
  product: Product | null;
}

const ReportsConnectionData = ({ product }: ReportsConnectionDataProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (product === null) {
      navigate("/homepage");
    }
  }, [product, navigate]);

  if (product === null) {
    return null;
  }

  const productId = product.id;
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
  } = useReportsConnectionStore();

  useEffect(() => {
    return () => {
      reset(); // Reset store state when component unmounts
    };
  }, [reset]);

  const { mutate: deleteReport } = useDeleteReport(productId);
  const { mutate: bulkDeleteReport } = useBulkDeleteReport(productId);
  const { mutate: bulkUpdateReportStatus } =
    useBulkUpdateReportStatus(productId);

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data, isLoading } = useReports(
    productId,
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );

  const reportsConnections = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

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
        reportConnection.application,
        reportConnection.isActive,
        reportConnection.isPinned,
        reportConnection.xslTemplate
      )
  );

  const handleSort = (field: FieldMappingKey, order: string) => {
    const mappedField = fieldMapping[field];
    setSortField(mappedField);
    setSortOrder(order);
  };

  function handleClearSort(): void {
    setSortField("updatedAt");
    setSortOrder("desc");
    setPage(0);
  }

  const handleSearch = (searchTerm: string, field: string) => {
    setSearchTerm(searchTerm);
    setSearchField(field);
  };

  const handleDelete = (reportId: number) => {
    deleteReport(reportId);
  };

  const handleBulkDelete = (reportIds: number[]) => {
    bulkDeleteReport(reportIds);
  };

  const handleBulkUpdateStatus = (reportIds: number[], isActive: boolean) => {
    bulkUpdateReportStatus({ reportIds, status: isActive });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleEdit = (report: ReportsConnection) => {
    let productDetails = product;

    localStorage.setItem("isEditingMode", JSON.stringify(true));
    localStorage.setItem("productDetails", JSON.stringify(productDetails));
    localStorage.setItem("reportDetails", JSON.stringify(report));

    navigate("/addreports");
  };

  const handleClearSearch = () => {
    setSearchField("");
    setSearchTerm("");
  };

  const manager = new TableManager(
    new ReportsConnection(),
    reportsConnectionsList,
    product
  );

  return (
    <CustomTable
      tableManager={manager}
      onSort={handleSort}
      onSearch={handleSearch}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      onBulkUpdateStatus={handleBulkUpdateStatus}
      onClickEdit={handleEdit}
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
      onAddNew={() => navigate("/addreports", { state: { product } })}
      handleClearSearch={handleClearSearch}
      handleClearSort={handleClearSort}
      onDateSearch={function (date: string[]): void {
        throw new Error("onDateSearch function not implemented." + date);
      }}
      handleClearDates={function (): void {
        throw new Error("Function not implemented.");
      }}
      isLoading={isLoading}
    />
  );
};

export default ReportsConnectionData;
