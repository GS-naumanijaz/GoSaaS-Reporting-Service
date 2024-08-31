import { TableManager } from "../../models/TableManager";
import { fieldMapping, FieldMappingKey } from "../../services/sortMappings";
import CustomTable from "../Shared/CustomTable";
import useRequestStore from "../../store/RequestStore";
import { Request } from "../../models/Request";
import { useRequestsQuery } from "../../hooks/useRequestsQuery";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Box } from "@chakra-ui/react";
import { sx } from "../../configs";

const RequestData = () => {
  const {
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    searchField,
    setCurrentPage,
    setSearchTerm,
    setSearchField,
    setSortField,
    setSortOrder,
    setPageSize,
    setPage,
    selectedDates,
    setSelectedDates,
  } = useRequestStore();

  const actualSearchField =
    fieldMapping[searchField as FieldMappingKey] || searchField;

  const { data, isLoading } = useRequestsQuery(
    sortField,
    sortOrder,
    page,
    pageSize,
    searchTerm,
    actualSearchField,
    selectedDates
  );

  const { content: requests, totalElements } = data || {};

  const RequestList: Request[] =
    requests?.map(
      (request: any) =>
        new Request(
          request.id,
          request.reportName,
          request.application.alias,
          request.createdAt,
          request.status,
          request.reportLink,
          request.destination_connection
        )
    ) || [];

  const manager = new TableManager(new Request(), RequestList);

  function handleSearch(searchTerm: string, field: string): void {
    setSearchTerm(searchTerm);
    setSearchField(field);
    setCurrentPage(0);
  }

  function handleSort(field: string, order: string): void {
    console.log("Order: ", order);
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

  function handleClearSort(): void {
    console.log("Clearing sort");
    setSortField("createdAt");
    setSortOrder("desc");
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

  function handleDownload(index: number) {
    let request = RequestList[index];
    let destination = request.getDestination();

    console.log(request);
    console.log(destination);

    const s3 = new S3Client({
      region: destination.region,
      credentials: {
        accessKeyId: destination.accessKey,
        secretAccessKey: destination.secretKey,
      },
    });

    async function generatePresignedUrl() {
      const command = new GetObjectCommand({
        Bucket: destination.bucketName,
        Key: request.reportLink,
      });

      return await getSignedUrl(s3, command, { expiresIn: 3600 });
    }

    generatePresignedUrl().then((downloadUrl) => {
      if (!downloadUrl) {
        console.error("Invalid index or URL not found.");
        return;
      }

      // Create an anchor element and trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  return (
    <Box
      bg={"white"}
      borderColor={"lightgrey"}
      borderWidth={2}
      borderRadius="md"
      // marginX={3}
      marginTop={2}
      textAlign="center"
      overflowY="auto"
      sx={sx}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        marginX={10}
        marginTop={5}
      >
        <CustomTable
          tableManager={manager}
          onSort={handleSort}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements ?? 0}
          searchObject={{
            searchField: searchField || "",
            searchTerm: searchTerm || "",
            selectedDates: selectedDates || ["0000-01-01", "9999-12-31"],
            sortOrder: sortOrder,
            sortField: sortField,
          }}
          handleClearSearch={handleClearSearch}
          onDateSearch={handleDateSearch}
          handleClearSort={handleClearSort}
          handleClearDates={handleClearDate}
          onDelete={function (_: number): void {
            throw new Error("request cannot delete");
          }}
          onBulkDelete={function (_: number[]): void {
            throw new Error("request cannot bulk delete");
          }}
          handleDownload={handleDownload}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default RequestData;
