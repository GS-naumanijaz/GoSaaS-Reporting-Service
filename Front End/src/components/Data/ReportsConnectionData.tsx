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

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data } =
    useReports(
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
    deleteReport(reportId);
  };

  const handleBulkDelete = (reportIds: number[]) => {
    bulkDeleteReport(reportIds);
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
      handleClearSearch={handleClearSearch} onDateSearch={function (date: Date[]): void {
        throw new Error("Function not implemented.");
      } } handleClearDates={function (): void {
        throw new Error("Function not implemented.");
      } }    />
  );
};

export default ReportsConnectionData;
