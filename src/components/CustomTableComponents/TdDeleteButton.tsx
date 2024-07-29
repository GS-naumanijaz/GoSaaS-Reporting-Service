import { Td } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import AlertDialogButton from "../General/AlertDialogButton";

interface Props {
  handleDeleteRow: () => void;
}

const TdDeleteButton = ({ handleDeleteRow }: Props) => {
  return (
    <Td textAlign="center">
      <AlertDialogButton
        header="Delete Connection"
        body="Are you sure you want to delete this connection?"
        cancelText="Cancel"
        confirmText="Confirm"
        onDelete={handleDeleteRow}
      >
        <FaRegTrashCan color="red" size={20} />
      </AlertDialogButton>
    </Td>
  );
};

export default TdDeleteButton;
