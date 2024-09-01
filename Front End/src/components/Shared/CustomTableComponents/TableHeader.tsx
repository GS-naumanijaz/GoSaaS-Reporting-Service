import { Box, Button, HStack, Text, Tooltip } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import AlertDialogButton from "../AlertDialogButton"; // Import AlertDialogButton
import AddRowDialogButton from "./AddRowDialogButton";
import { InputField } from "../../../models/TableManagementModels";
import { primaryColor, secondaryColor } from "../../../configs";
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
  onAddNew: () => void;
  isConnection?: boolean;
  checkedStatuses: boolean[];
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
  checkedStatuses,
}: Props) => {
  const navigate = useNavigate();
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);
  const addProduct = () => {
    setIsAddApplicationOpen(true);
  };

  const handleAddApplicationClose = () => {
    setIsAddApplicationOpen(false);
  };

  const onclose: (() => void) | null = null;
  const saveAppMutation = useAppDataMutation(onclose ?? (() => {}));

  const queryClient = useQueryClient();

  const handleAddApplicationSubmit = async (
    formData: Record<string, string>
  ) => {
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
      console.error("Failed to save application:", error);
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
          isDisabled={checkedStatuses.length > 0}
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
              <>
                {checkedStatuses.length > 0 &&
                checkedStatuses.every((value) => value === true) ? null : (
                  <AlertDialogButton
                    header="Activate"
                    body="Are you sure you want to activate the selected items?"
                    cancelText="Cancel"
                    confirmText="Proceed"
                    onConfirm={() => handleBulkSwitchActions(true)}
                    buttonColor={"green.400"}
                  >
                    {checkedStatuses.length === 1 ? "Activate" : "Activate All"}
                  </AlertDialogButton>
                )}
                {checkedStatuses.length > 0 &&
                checkedStatuses.every((value) => value === false) ? null : (
                  <AlertDialogButton
                    header="Deactivate"
                    body="Are you sure you want to deactivate the selected items?"
                    cancelText="Cancel"
                    confirmText="Proceed"
                    onConfirm={() => handleBulkSwitchActions(false)}
                    buttonColor={"red.400"}
                  >
                    {checkedStatuses.length === 1
                      ? "Deactivate"
                      : "Deactivate All"}
                  </AlertDialogButton>
                )}
              </>
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
          isFetching={saveAppMutation.status === "pending"}
        />
      )}
    </>
  );
};

export default TableHeader;
