import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "../components/NavBar";

const Homepage = () => {
  return (
    <Grid templateAreas={`"nav nav" "sidebar main"`}>
      <GridItem area="nav">
        <NavBar />
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
