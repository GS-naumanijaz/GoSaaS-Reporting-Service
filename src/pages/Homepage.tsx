import { Grid, GridItem, Show } from "@chakra-ui/react";
import { secondaryColor, tertiaryColor } from "../configs";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import { useState } from "react";
import AuditTrail from "../components/AuditTrail";
import Reports from "../components/Reports";

const Homepage = () => {
  const [selectedComponent, setSelectedComponent] =
    useState<string>("Dashboard");

  const onSelected = (passedSelection: string) => {
    setSelectedComponent(passedSelection);
  };
  return (
    <Grid
      templateAreas={`"nav nav" "sidebar main"`}
      templateColumns={{ base: "0fr", lg: "200px 1fr" }}
    >
      <GridItem area="nav" bg={secondaryColor}>
        <NavBar />
      </GridItem>
      <Show above="lg">
        <GridItem area="sidebar">
          <Sidebar onSelected={onSelected} />
        </GridItem>
      </Show>
      <GridItem area="main" bg={tertiaryColor}>
        {selectedComponent === "Dashboard" ? (
          <Dashboard />
        ) : selectedComponent === "AuditTrail" ? (
          <AuditTrail />
        ) : (
          <Reports />
        )}
      </GridItem>
    </Grid>
  );
};

export default Homepage;
