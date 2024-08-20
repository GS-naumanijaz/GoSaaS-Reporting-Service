import { Box, Button } from "@chakra-ui/react";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { useState } from "react";
import { primaryColor } from "../../../configs";

interface ViewSelectorProps {
  viewType: (str: string) => void;
  selectedType?: string;
}

function ViewSelector({ viewType, selectedType }: Readonly<ViewSelectorProps>) {
  const [currentView, setCurrentView] = useState<string>(
    selectedType ?? "grid"
  );

  const handleTableViewClick = () => {
    setCurrentView("table");
    viewType("table");
  };

  const handleGridViewClick = () => {
    setCurrentView("grid");
    viewType("grid");
  };

  return (
    <Box
      border="1px"
      borderColor="black"
      borderRadius={5}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        variant="ghost"
        _hover={{
          bg: currentView === "grid" ? "rgba(255, 0, 0, 0.1)" : "transparent",
          boxShadow: "none",
        }}
        borderRight="1px"
        borderRadius={0}
        bg={currentView === "grid" ? "rgba(255, 0, 0, 0.2)" : "transparent"}
        onClick={handleGridViewClick}
      >
        <IoGridOutline
          size={17}
          // color={currentView !== "grid" ? primaryColor : "black"}
        />
      </Button>
      <Button
        variant="ghost"
        _hover={{
          bg: currentView === "table" ? "rgba(255, 0, 0, 0.1)" : "transparent",
          boxShadow: "none",
        }}
        borderLeft="1px"
        borderRadius={0}
        bg={currentView === "table" ? "rgba(255, 0, 0, 0.2)" : "transparent"}
        onClick={handleTableViewClick}
      >
        <CiViewTable
          size={20}
          // color={currentView === "table" ? primaryColor : "black"}
        />
      </Button>
    </Box>
  );
}

export default ViewSelector;
