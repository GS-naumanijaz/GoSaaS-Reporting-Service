import { useEffect } from "react";
import {
  useBulkDeleteApplications,
  useDeleteApplication,
  useProductsQuery,
  useUpdateApplicationStatus,
} from "../../hooks/useProductsQuery";
import { ProductTable } from "../../models/ProductTable";
import { TableManager } from "../../models/TableManager";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useProductStore from "../../store/ProductStore";
import CustomTable from "../Shared/CustomTable";

const ProductTableData = () => {
  const {
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    searchField,
    setSelectedFilter,
    selectedFilter,
    setCurrentPage,
    setSearchTerm,
    setSearchField,
    setSortField,
    setSortOrder,
    setPageSize,
    setPage,
    selectedDates,
    setSelectedDates,
  } = useProductStore();

  useEffect(() => {
    setSelectedFilter("All");
  }, [setSelectedFilter]);

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data, isError } = useProductsQuery(
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField,
    selectedFilter,
    selectedDates
  );

  const { content: products, totalElements } = data || {};

  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus();
  const { mutate: bulkDeleteApplications } = useBulkDeleteApplications();

  const ProductsList: ProductTable[] =
    products?.map(
      (product: any) =>
        new ProductTable(
          product.id,
          product.alias,
          product.updatedAt,
          product.isActive
        )
    ) || [];

  const manager = new TableManager(new ProductTable(), ProductsList);

  function handleSearch(searchTerm: string, field: string): void {
    setSearchTerm(searchTerm);
    setSearchField(field);
    setCurrentPage(0);
  }

  function handleSort(field: string, order: string): void {
    const mappedField = fieldMapping[field as FieldMappingKey] || field;
    setSortField(mappedField);
    setSortOrder(order);
    setCurrentPage(0);
  }

  function handleClearSearch(): void {
    setSearchTerm("");
    setSearchField("");
    setCurrentPage(0);
  }

  function handlePageChange(newPage: number): void {
    setPage(newPage);
    setCurrentPage(newPage);
  }

  function handlePageSizeChange(newPageSize: number): void {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }

  const handleDateSearch = (date: string[]) => {
    setSelectedDates(date);
  };

  function handleClearDate(): void {
    setSelectedDates(["0000-01-01", "9999-12-31"]);
    setCurrentPage(0);
  }

  function handleBulkStatusUpdate(updateIds: number[], status: boolean): void {
    updateApplicationStatus({ updateIds, status });
  }

  function handleBulkDelete(deleteIds: number[]): void {
    bulkDeleteApplications(deleteIds);
  }

  const deleteApplication = useDeleteApplication();

  function handleDelete(deleteId: number): void {
    deleteApplication.mutate(deleteId);
  }

  //! Placeholder functions for other table actions

  function handleTest(appId: number): void {
    throw new Error("Function not implemented.");
  }

  function handleEdit(itemId: number, editedItem: any): void {
    console.log("Edit", itemId, editedItem);
    throw new Error("Function not implemented.");
  }

  function handleAddNew(): void {
    throw new Error("Function not implemented.");
  }

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
      totalElements={totalElements ?? 0}
      searchObject={{
        searchField: searchField || "",
        searchTerm: searchTerm || "",
        selectedDates: selectedDates || ["0000-01-01", "9999-12-31"],
      }}
      onAddNew={handleAddNew}
      handleClearSearch={handleClearSearch}
      onDateSearch={handleDateSearch}
      handleClearDates={handleClearDate}
    />
  );
};

export default ProductTableData;
