import { Button, Td } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";

interface Props {
  rowIndex: number;
  handleDeleteRow: (index: number) => void;
}

const TdDeleteButton = ({ rowIndex, handleDeleteRow }: Props) => {
  return (
    <Td textAlign="center">
      <Button onClick={() => handleDeleteRow(rowIndex)}>
        <FaRegTrashCan color="red" size={20} />
      </Button>
    </Td>
  );
};

export default TdDeleteButton;
