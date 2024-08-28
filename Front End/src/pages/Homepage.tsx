import { Grid, GridItem, Show } from "@chakra-ui/react";
import { secondaryColor, tertiaryColor } from "../configs";
import Dashboard from "../components/Dashboard/Dashboard";
import { useState, useEffect } from "react";
import AuditTrail from "../components/AuditTrail/AuditTrail";
import Requests from "../components/Requests/Requests";
import NavBar from "../components/Common/NavBar";
import Sidebar from "../components/Common/Sidebar";
import { useUser } from "../components/Login/UserContext";

const Homepage = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>(
    () => localStorage.getItem("selectedComponent") || "Dashboard"
  );

  const onSelected = (passedSelection: string) => {
    setSelectedComponent(passedSelection);
    localStorage.setItem("selectedComponent", passedSelection);
  };

  const user = useUser();

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
          <Requests />
        )}
      </GridItem>
    </Grid>
  );
};

export default Homepage;
