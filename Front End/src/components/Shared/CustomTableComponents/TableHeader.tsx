import { Button, HStack, Text, Tooltip } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import AlertDialogButton from "../AlertDialogButton";
import AddRowDialogButton from "./AddRowDialogButton";
import { InputField } from "../../../models/TableManagementModels";
import { primaryColor } from "../../../configs";
import { useNavigate } from "react-router-dom";
import { Product } from "../../Dashboard/Products";
import AddApplicationDialog from "../../ApplicationPage/AddApplicationDialog";
import { useState } from "react";
import { useAppDataMutation } from "../../../hooks/useAppDataQuery";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  tableHeading: string;
  isSelectingRows: boolean;
  inputFields: InputField[];
  handleBulkSwitchActions: (status: boolean) => void;
  handleBulkDeleteRows: () => void;
  productDetails?: Product;
  onAddNew: () => Promise<void>;
  isConnection?: boolean;
  setCanTest: (newValue: boolean) => void;
}

const TableHeader = ({
  tableHeading,
  isSelectingRows,
  inputFields,
  handleBulkSwitchActions,
  handleBulkDeleteRows,
  productDetails,
  onAddNew,
  isConnection = false,
  setCanTest
}: Props) => {
  const navigate = useNavigate();
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);

  const addProduct = () => {
    setIsAddApplicationOpen(true);
  };

  const handleAddApplicationClose = () => {
    setIsAddApplicationOpen(false);
    
  };

  const saveAppMutation = useAppDataMutation();
  const queryClient = useQueryClient();

  const handleAddApplicationSubmit = async (
    formData: Record<string, string>
  ) => {
    console.log("hello")
    try {
      await saveAppMutation.mutateAsync({
        applicationName: formData.applicationName,
        applicationDescription: formData.applicationDescription,
      });

      await queryClient.refetchQueries({
        queryKey: ["products"],
      });

      setIsAddApplicationOpen(false);

    } catch (error) {
      console.error("Failed to save987 application:", error);
    } 
  };

  const renderActionButton = () => {
    if (
      tableHeading === "Source Connections" ||
      tableHeading === "Destination Connections"
    ) {
      return (
        <AddRowDialogButton
          header={"Add New " + tableHeading}
          inputFields={inputFields}
          onSubmit={onAddNew}
          tooltipLabel="Add new"
          tooltipHasArrow
          setCanTest={setCanTest}
        />
      );
    } else if (tableHeading === "Reports") {
      return (
        <Tooltip hasArrow label="Add new" bg={primaryColor}>
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
        </Tooltip>
      );
    } else if (tableHeading === "Audit Log" || tableHeading === "Request") {
      return <></>;
    } else {
      return (
        <Button
          onClick={addProduct}
          border={"1px"}
          bg={primaryColor}
          color={"white"}
          _hover={{
            bg: "gray.100",
            color: primaryColor,
          }}
        >
          Add Application
        </Button>
      );
    }
  };

  return (
    <>
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
              {tableHeading !== "Reports" && (
                <>
                  <Button onClick={() => handleBulkSwitchActions(true)}>
                    Activate All
                  </Button>
                  <Button onClick={() => handleBulkSwitchActions(false)}>
                    Deactivate All
                  </Button>
                </>
              )}
              <AlertDialogButton
                header="Delete Connection"
                body={
                  isConnection
                    ? "Are you sure you want to delete these connections? Any associated reports will also be deleted"
                    : "Are you sure you want to delete these connections?"
                }
                cancelText="Cancel"
                confirmText="Confirm"
                onConfirm={handleBulkDeleteRows}
                tooltipLabel="Delete"
                tooltipColor="red"
                tooltipHasArrow
              >
                <FaRegTrashCan color="red" size={20} />
              </AlertDialogButton>
            </HStack>
          )}
          {renderActionButton()}
        </HStack>
      </HStack>
      {isAddApplicationOpen && (
        <AddApplicationDialog
          isOpen={isAddApplicationOpen}
          onClose={handleAddApplicationClose}
          onSubmit={handleAddApplicationSubmit}
        />
      )}
    </>
  );
};

export default TableHeader;
