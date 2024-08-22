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
  Tr,
} from "@chakra-ui/react";
import { navbarHeight, pinnedRequestHeight, sx } from "../../configs"; // Make sure this import is correct
import { IoIosArrowForward } from "react-icons/io";
import { useGetPinnedReports } from "../../hooks/useReportsQuery";
import { ReportsConnection } from "../../models/ReportsConnection";
import { useNavigate } from "react-router-dom";

const PinnedReports = () => {
  
  const navigate = useNavigate()
  const { data: pinnedReports, isLoading, isError } = useGetPinnedReports();

  const handleRowClick = (report: ReportsConnection) => {

    localStorage.setItem("isEditingMode", JSON.stringify(true));
    localStorage.setItem("reportDetails", JSON.stringify(report));

    navigate("/addreports");
  }

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
            {isError && (
              <Tbody>
                <Text>Failed to fetch Pinned Reports</Text>
              </Tbody>
            )}
            {isLoading && (
              <Tbody>
                <Spinner />
              </Tbody>
            )}

            {pinnedReports && <Tbody>
              {pinnedReports.map((report, index) => (
                <Tr key={index} onClick={() => handleRowClick(report)}>
                  <Td fontSize={15}>{report.alias}</Td>
                  <Td fontSize={15}>
                    {report.description.length > 25
                      ? `${report.description.substring(0, 25)}...`
                      : report.description}
                  </Td>
                  <Td textAlign="center">
                    <IoIosArrowForward />
                  </Td>
                </Tr>
              ))}
            </Tbody>}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PinnedReports;
