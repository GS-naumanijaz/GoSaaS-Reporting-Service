import { useEffect, useState } from "react";
import { useProductsQuery } from "../../hooks/useProductsQuery";
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
    selectedFilter // Pass the selected filter
  );

  const { content: products, totalElements } = data || {};

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

  const [dates, setDates] = useState<Date[] | undefined>();
  function handleDateSearch(date: Date[]): void {
    setDates(date);
    //! Search Dates Received
  }

  function handleClearDate(): void {
    setDates(undefined);
  }

  // Placeholder functions for other table actions
  function handleDelete(deleteId: number): void {
    throw new Error("Function not implemented.");
  }

  function handleBulkDelete(deleteIds: number[]): void {
    throw new Error("Function not implemented.");
  }

  function handleBulkStatusUpdate(updateIds: number[], status: boolean): void {
    throw new Error("Function not implemented.");
  }

  function handleTest(appId: number, connectionId: number): void {
    throw new Error("Function not implemented.");
  }

  function handleEdit(itemId: number, editedItem: any): void {
    throw new Error("Function not implemented.");
  }

  function handleAddNew(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <CustomTable
      tableManager={manager}
      appId={1}
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
      }}
      onAddNew={handleAddNew}
      handleClearSearch={handleClearSearch}
      onDateSearch={handleDateSearch}
      handleClearDates={handleClearDate}
    />
  );
};

export default ProductTableData;
