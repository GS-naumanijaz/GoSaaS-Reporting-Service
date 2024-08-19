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
  onAddNew: () => void;
}

const TableHeader = ({
  tableHeading,
  isSelectingRows,
  inputFields,
  handleBulkSwitchActions,
  handleBulkDeleteRows,
  productDetails,
  onAddNew,
}: Props) => {
  const navigate = useNavigate();
  // const showErrorToast = useErrorToast();

  console.log(inputFields);
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
        {tableHeading !== "Reports" && isSelectingRows && (
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
            header={"Add New " + tableHeading}
            inputFields={inputFields}
            onSubmit={onAddNew}
          />
        ) : (
          <Button
            variant={"ghost"}
            onClick={() => {
              localStorage.setItem("isEditingMode", JSON.stringify(false));
              localStorage.setItem(
                "productDetails",
                JSON.stringify(productDetails)
              );
              localStorage.removeItem("reportDetails");
              navigate("/addreports");
            }}
          >
            <FaPlus color={primaryColor} />
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default TableHeader;
