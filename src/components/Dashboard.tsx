import { Grid, GridItem } from "@chakra-ui/react";
import PinnedRequests from "./PinnedRequests";
import StatusSummary from "./StatusSummary";

const Dashboard = () => {
  return (
    <Grid
      templateAreas={{
        base: `"products"`,
        lg: `"products requests" "products summary"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "2.7fr 1fr",
      }}
    >
      <GridItem area="products" bg={"brown"}>
        Products
      </GridItem>
      <GridItem
        display={{ base: "none", lg: "block" }}
        area="requests"
        bg={"pink"}
      >
        <PinnedRequests />
      </GridItem>
      <GridItem
        display={{ base: "none", lg: "block" }}
        area="summary"
        bg={"purple"}
      >
        <StatusSummary />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
