import { Grid, GridItem, Show } from "@chakra-ui/react";
import { secondaryColor, tertiaryColor } from "../configs";
import { useEffect, useState } from "react";
import NavBar from "../components/Common/NavBar";
import Sidebar from "../components/Common/Sidebar";
import { useNavigate } from "react-router-dom";
import AppDashboard from "../components/ApplicationPage/AppDashboard";
import AuditLogData from "../components/Data/AuditLogData";
import RequestData from "../components/Data/RequestData";

const Application = () => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<string>(
    () => localStorage.getItem("selectedApplicationComponent") || "Application"
  );

  useEffect(() => {
    if (selectedComponent === "Dashboard") {
      navigate("/homepage");
    }
  }, [selectedComponent, navigate]);

  const onSelected = (passedSelection: string) => {
    setSelectedComponent(passedSelection);
    localStorage.setItem("selectedApplicationComponent", passedSelection);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Application":
        return <AppDashboard />;
      case "AuditTrail":
        return <AuditLogData />;
      case "Dashboard":
        navigate("/homepage");
        return null;
      default:
        return <RequestData />;
    }
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
        {renderComponent()}
      </GridItem>
    </Grid>
  );
};

export default Application;
