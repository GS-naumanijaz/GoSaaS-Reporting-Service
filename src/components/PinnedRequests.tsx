import {
  Box,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { navbarHeight, pinnedRequestHeight, sx } from "../configs"; // Make sure this import is correct
import { IoIosArrowForward } from "react-icons/io";

const PinnedRequests = () => {
  const pinnedRequests = [
    {
      alias: "Request 1",
      description: "This is the first request Lorem ipsum dolor sit amet",
      creationDate: "2021-06-01",
    },
    {
      alias: "Request 2",
      description: "This is the second request",
      creationDate: "2021-06-02",
    },
    {
      alias: "Request 3",
      description: "This is the third request",
      creationDate: "2021-06-03",
    },
    {
      alias: "Request 4",
      description: "This is the fourth request",
      creationDate: "2021-06-04",
    },
    {
      alias: "Test",
      description: "Lorem ipsum dolor sit amet",
      creationDate: "2021-06-04",
    },
    {
      alias: "Test",
      description: "Lorem ipsum dolor sit amet",
      creationDate: "2021-06-04",
    },
    {
      alias: "Test",
      description: "Lorem ipsum dolor sit amet",
      creationDate: "2021-06-04",
    },
    {
      alias: "Test",
      description: "Lorem ipsum dolor sit amet",
      creationDate: "2021-06-04",
    },
    {
      alias: "Last",
      description: "LAST",
      creationDate: "2021-06-04",
    },
  ];
  return (
    <Box
      height={pinnedRequestHeight}
      borderLeftColor={"lightgrey"}
      borderLeftWidth={1}
      p={2}
    >
      <Box
        bg={"white"}
        borderColor={"lightgrey"}
        borderWidth={2}
        borderRadius="md"
        textAlign="center"
        h="100%"
        overflowY="auto"
      >
        <Text fontSize={20} p={1}>
          Pinned Requests
        </Text>
        <Divider width="80%" bg="black" mx="auto" />

        <TableContainer
          // Adjust maxH calculation to include navbarHeight
          maxH={`calc(100% - ${navbarHeight})`}
          overflowY="auto"
          sx={sx}
        >
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Alias</Th>
                <Th>Description</Th>
                <Th width="5%"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {pinnedRequests.map((request, index) => (
                <Tr key={index}>
                  <Td fontSize={{ sm: "xs" }}>{request.alias}</Td>
                  <Td fontSize={{ sm: "xs" }}>
                    {request.description.length > 25
                      ? `${request.description.substring(0, 25)}...`
                      : request.description}
                  </Td>
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

export default PinnedRequests;
