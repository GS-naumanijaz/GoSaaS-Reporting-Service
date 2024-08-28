import { Product } from "../../Dashboard/Products";
import { TableManager } from "../../../models/TableManager";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { Button, Tooltip } from "@chakra-ui/react";

interface Props {
  rowIndex: number;
  tableManager: TableManager;
}

const TdRedirect = ({ rowIndex, tableManager }: Props) => {
  const navigate = useNavigate();
  const handleButtonClick = (rowIndex: number) => {
    const rowData = tableManager.getRowItem(rowIndex);

    const product: Product = {
      id: rowData.productId,
      alias: rowData.alias,
      description: rowData.description,
      isActive: rowData.isActive,
      isDeleted: rowData.isDeleted,
      creationDate: rowData.creationDate,
      updatedAt: rowData.updatedAt,
      deletedBy: rowData.deletedBy || null,
      deletionDate: rowData.deletionDate || null,
    };

    navigate("/applications", { state: product });
    localStorage.setItem("selectedApplicationComponent", "Application");
  };

  return (
    <Tooltip hasArrow label="Open Application">
      <Button
        pt={4}
        variant={"ghost"}
        _hover={{
          bg: "transparent",
          boxShadow: "none",
        }}
        onClick={() => handleButtonClick(rowIndex)}
      >
        <FaEye color={"#4A4A4A"} />
      </Button>
    </Tooltip>
  );
};

export default TdRedirect;
