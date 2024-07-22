import { Grid, GridItem, Show } from "@chakra-ui/react";

const Homepage = () => {
  return (
    <Grid templateAreas={`"nav nav" "sidebar main"`}>
      <GridItem area="nav" bg={"coral"}>
        Nav
      </GridItem>
      <Show above="lg">
        <GridItem area="sidebar" bg={"gold"}>
          Sidebar
        </GridItem>
      </Show>
      <GridItem area="main" bg={"dodgerblue"}>
        Main
      </GridItem>
    </Grid>
  );
};

export default Homepage;
