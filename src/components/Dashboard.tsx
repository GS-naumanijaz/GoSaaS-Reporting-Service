import { Grid, GridItem } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Grid
      templateAreas={{
        base: `"products"`, 
        lg: `"products reports" "products summary"`,
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
        area="reports"
        bg={"pink"}
      >
        reports
      </GridItem>
      <GridItem
        display={{ base: "none", lg: "block" }}
        area="summary"
        bg={"purple"}
      >
        Summary
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
