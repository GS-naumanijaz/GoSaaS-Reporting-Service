import { Button, HStack, Text } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import AlertDialogButton from "../AlertDialogButton";
import AddRowDialogButton from "./AddRowDialogButton";
import { InputField } from "../../../models/TableManagementModels";
import { FaPlus } from "react-icons/fa";
import { primaryColor } from "../../../configs";
import { useNavigate } from "react-router-dom";
import { Product } from "../../Dashboard/Products";

interface Props {
  tableHeading: string;
  isSelectingRows: boolean;
  inputFields: InputField[];
  handleBulkSwitchActions: (status: boolean) => void;
  handleBulkDeleteRows: () => void;
  productDetails?: Product;
}

const TableHeader = ({
  tableHeading,
  isSelectingRows,
  inputFields,
  handleBulkSwitchActions,
  handleBulkDeleteRows,
  productDetails,
}: Props) => {
  const navigate = useNavigate();
  return (
    <HStack
      marginX={10}
      marginTop={4}
      height={12}
      display="flex"
      justifyContent="space-between"
    >
      <Text fontSize={"x-large"}>{tableHeading}</Text>
      <HStack>
        {isSelectingRows && (
          <HStack spacing={6}>
            <Button onClick={() => handleBulkSwitchActions(true)}>
              Activate All
            </Button>
            <Button onClick={() => handleBulkSwitchActions(false)}>
              Deactivate All
            </Button>
            <AlertDialogButton
              header="Delete Connection"
              body="Are you sure you want to delete this connection?"
              cancelText="Cancel"
              confirmText="Confirm"
              onDelete={handleBulkDeleteRows}
            >
              <FaRegTrashCan color="red" size={20} />
            </AlertDialogButton>
          </HStack>
        )}

        {tableHeading !== "Reports" ? (
          <AddRowDialogButton
            header={"Add New"}
            inputFields={inputFields}
            onSubmit={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ) : (
          <Button
            variant={"ghost"}
            onClick={() => navigate("/addreport", { state: productDetails })}
          >
            <FaPlus color={primaryColor} />
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default TableHeader;
