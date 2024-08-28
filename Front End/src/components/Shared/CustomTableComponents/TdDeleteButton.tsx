import { Td } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import AlertDialogButton from "../AlertDialogButton";

interface Props {
  handleDeleteRow: () => void;
  isConnection?: boolean;
}

const TdDeleteButton = ({ handleDeleteRow, isConnection = false }: Props) => {
  return (
    <Td textAlign="center">
      <AlertDialogButton
        header="Delete Connection"
        body={isConnection ? "Are you sure you want to delete this connection? Any associated reports will also be deleted" :"Are you sure you want to delete this connection?"}
        cancelText="Cancel"
        confirmText="Confirm"
        onConfirm={handleDeleteRow}
        tooltipLabel="Delete"
        tooltipColor="red"
        tooltipHasArrow
      >
        <FaRegTrashCan color="red" size={20} />
      </AlertDialogButton>
    </Td>
  );
};

export default TdDeleteButton;
