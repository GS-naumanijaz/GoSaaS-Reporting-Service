import { useProductsQuery } from "../../hooks/useProductsQuery";
import { ProductTable } from "../../models/ProductTable";
import { TableManager } from "../../models/TableManager";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import useProductStore from "../../store/ProductStore";
import CustomTable from "../Shared/CustomTable";

const ProductTableData = () => {
  const allFilters = ["All", "Active", "Inactive"];

  const {
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    searchField,
    reset,
    setSelectedFilter,
    selectedFilter,
    currentPage,
    setCurrentPage,
    setSearchTerm,
    setSearchField,
    setSortField,
    setSortOrder,
  } = useProductStore();

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data, isFetching, isError } = useProductsQuery(
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField
  );
  const { content: products, totalPages, totalElements } = data || {};

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

  //* implementing

  function handleSearch(searchTerm: string, field: string): void {
    setSearchTerm(searchTerm);
    setSearchField(field);
  }

  function handleSort(field: string, order: string): void {
    const mappedField = fieldMapping[field as FieldMappingKey] || field;
    setSortField(mappedField);
    setSortOrder(order);
  }

  //* to implement later

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

  function handlePageChange(newPage: number): void {
    throw new Error("Function not implemented.");
  }

  function handlePageSizeChange(newPageSize: number): void {
    throw new Error("Function not implemented.");
  }

  function handleClearSearch(): void {
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
      page={totalPages ?? 1} // Set the current page
      pageSize={pageSize} // Set the page size
      totalElements={totalElements ?? 1} // Set the total number of elements
      searchObject={{
        searchField: "", // Set search field
        searchTerm: "", // Set search term
      }}
      onAddNew={handleAddNew}
      handleClearSearch={handleClearSearch}
    />
  );
};

export default ProductTableData;
