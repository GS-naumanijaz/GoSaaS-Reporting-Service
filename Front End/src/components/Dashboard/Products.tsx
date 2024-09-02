import { Box } from "@chakra-ui/react";
import { mainDashboardHeight, sx } from "../../configs";
import { useState } from "react";
import GridView from "./ApplicationViews/GridView";
import ViewSelector from "./ApplicationViews/ViewSelector";
import ProductTableData from "../Data/ProductTableData";

export interface Product {
  alias: string;
  id: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  creationDate: string;
  updatedAt: string;
  deletedBy?: string | null;
  deletionDate?: string | null;
}

const Products = () => {
  // table and grid view
  const [viewSelected, setViewSelected] = useState("grid");
  const handleSelectedView = (viewType: string) => {
    setViewSelected(viewType);
  };

  return (
    <Box height={mainDashboardHeight} p={2}>
      {viewSelected === "grid" ? (
        <GridView handleSelectedView={handleSelectedView} />
      ) : (
        <Box height={mainDashboardHeight} p={2}>
          <Box
            bg="white"
            borderColor="lightgrey"
            borderWidth={2}
            borderRadius="md"
            // marginX={3}
            marginTop={2}
            textAlign="center"
            h="96.8%"
            overflowY="auto"
            sx={sx}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              marginX={10}
              marginTop={5}
            >
              <ViewSelector
                viewType={handleSelectedView}
                selectedType={viewSelected}
              />{" "}
            </Box>
            <ProductTableData />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Products;
