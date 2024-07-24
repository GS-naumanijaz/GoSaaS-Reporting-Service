import { Box, Divider, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { statusSummaryHeight } from "../configs";

const StatusSummary = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Successful", "In Progress", "Pending", "Failed"],
    responsive: [
      {
        breakpoint: 480,
      },
    ],
    dataLabels: {
      enabled: false,
    },
  };

  const series = [15, 23, 43, 13]; // Sample data

  return (
    <>
      <Box
        height={statusSummaryHeight}
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
            Status Summary
          </Text>
          <Divider width="80%" bg="black" mx="auto" />
          <Box paddingTop={5}>
            <ReactApexChart options={options} series={series} type="donut" />
            <Text fontSize={15} p={1}>
              Total Reports: {series.reduce((a, b) => a + b, 0)}
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StatusSummary;
