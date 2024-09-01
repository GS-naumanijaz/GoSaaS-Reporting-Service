import {
  Box,
  Divider,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import {
  navbarHeight,
  pinnedRequestHeight,
  primaryColor,
  sx,
} from "../../configs";
import { IoIosArrowForward } from "react-icons/io";
import { useGetPinnedReports } from "../../hooks/useReportsQuery";
import { ReportsConnection } from "../../models/ReportsConnection";
import { useNavigate } from "react-router-dom";

const PinnedReports = () => {
  const navigate = useNavigate();
  const { data: pinnedReports, isLoading, isError } = useGetPinnedReports();

  const handleRowClick = (report: ReportsConnection) => {
    localStorage.setItem("isEditingMode", JSON.stringify(true));
    localStorage.setItem("reportDetails", JSON.stringify(report));

    navigate("/addreports");
  };

  return (
    <Box height={pinnedRequestHeight} p={2}>
      <Box
        bg={"white"}
        borderColor={"lightgrey"}
        borderWidth={2}
        borderRadius="md"
        marginRight={2}
        marginTop={2}
        textAlign="center"
        h="100%"
        overflowY="auto"
      >
        <Text fontSize={20} p={1}>
          Pinned Reports
        </Text>
        <Divider width="80%" bg="black" mx="auto" marginBottom={2} />

        <TableContainer
          maxH={`calc(100% - ${navbarHeight})`}
          overflowY="auto"
          sx={sx}
        >
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th fontSize={18}>Alias</Th>
                <Th fontSize={18}>Description</Th>
                <Th width="5%"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isError && (
                <Tr>
                  <Td colSpan={3}>
                    <Text>Failed to fetch Pinned Reports</Text>
                  </Td>
                </Tr>
              )}
              {isLoading && (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {pinnedReports &&
                pinnedReports.map((report, index) => (
                  <Tr key={index} onClick={() => handleRowClick(report)}>
                    <Td cursor="pointer" fontSize={15}>
                      {report.alias}
                    </Td>
                    <Tooltip label={report.description} bg={primaryColor}>
                      <Td cursor="pointer" fontSize={15}>
                        {report.description.length > 25
                          ? `${report.description.substring(0, 25)}...`
                          : report.description}
                      </Td>
                    </Tooltip>
                    <Td textAlign="center">
                      <IoIosArrowForward />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PinnedReports;
