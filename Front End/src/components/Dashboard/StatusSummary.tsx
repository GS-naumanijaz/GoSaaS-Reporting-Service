import { Box, Divider, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { statusSummaryHeight, sx } from "../../configs";
import { useRequestCount } from "../../hooks/useRequestsQuery";

const StatusSummary = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["In Progress", "Successful", "Failed"],
    dataLabels: {
      enabled: false,
    },
  };

  const { data } = useRequestCount();
  if (!data) return null;

  // format: inprogress, completed, failed
  const series: number[] = Object.values(data) ?? [0, 0, 0];

  return (
    <Box height={statusSummaryHeight} p={2}>
      <Box
        bg={"white"}
        borderColor={"lightgrey"}
        borderWidth={2}
        borderRadius="md"
        textAlign="center"
        h="95%"
        marginRight={2}
        overflowY="auto"
        sx={sx}
      >
        <Text fontSize={20} p={1}>
          Status Summary
        </Text>
        <Divider width="80%" bg="black" mx="auto" />
        <Box paddingTop={5}>
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={"100%"}
          />
          <Text fontSize={15} p={1} pt={5}>
            Total Reports: {series.reduce((a, b) => a + b, 0)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default StatusSummary;
