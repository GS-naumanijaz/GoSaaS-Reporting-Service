import { Button, HStack, Text } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import AlertDialogButton from "../General/AlertDialogButton";
import AddRowDialogButton from "./AddRowDialogButton";
import InputField from "../../models/InputField";

interface Props {
  tableHeading: string;
  isSelectingRows: boolean;
  inputFields: InputField[];
  handleBulkSwitchActions: (status: boolean) => void;
  handleBulkDeleteRows: () => void;
}

const TableHeader = ({
  tableHeading,
  isSelectingRows,
  inputFields,
  handleBulkSwitchActions,
  handleBulkDeleteRows,
}: Props) => {
  return (
    <HStack
      marginX={10}
      marginTop={4}
      height={12}
      display="flex"
      justifyContent="space-between"
    >
      <HStack spacing={4}>
        <Text fontSize={"x-large"}>{tableHeading}</Text>
        <AddRowDialogButton
          header={"Add New"}
          inputFields={inputFields}
          onSubmit={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </HStack>
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
    </HStack>
  );
};

export default TableHeader;
