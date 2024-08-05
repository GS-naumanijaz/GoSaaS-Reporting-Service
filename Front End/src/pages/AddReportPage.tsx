import { Grid, GridItem, Show } from "@chakra-ui/react";
import { secondaryColor, tertiaryColor } from "../configs";

import { useState } from "react";
import NavBar from "../components/Common/NavBar";
import Sidebar from "../components/Common/Sidebar";
import { useNavigate } from "react-router-dom";
import AddReportDashboard from "../components/ApplicationPage/AddReportDashboard";

const AddReportPage = () => {
  const navigate = useNavigate();

  const [selectedComponent, setSelectedComponent] =
    useState<string>("AddReport");

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
        {selectedComponent === "AddReport" ? (
          <AddReportDashboard />
        ) : (
          <>{navigate("/homepage")}</>
        )}
      </GridItem>
    </Grid>
  );
};

export default AddReportPage;
