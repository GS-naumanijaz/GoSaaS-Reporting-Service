import { Grid, GridItem } from "@chakra-ui/react";
import PinnedReports from "./PinnedReports";
import StatusSummary from "./StatusSummary";
import { tertiaryColor } from "../../configs";
import Products from "./Products";

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
      bg={tertiaryColor}
    >
      <GridItem area="products">
        <Products />
      </GridItem>
      <GridItem display={{ base: "none", lg: "block" }} area="requests">
        <PinnedReports />
      </GridItem>
      <GridItem display={{ base: "none", lg: "block" }} area="summary">
        <StatusSummary />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
