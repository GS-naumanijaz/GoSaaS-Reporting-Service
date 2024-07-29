import { Button, HStack, Td } from "@chakra-ui/react";
import { FaRegSave } from "react-icons/fa";
import { TbPencil, TbPencilCancel } from "react-icons/tb";

interface Props {
  isEditing: boolean;
  rowIndex: number;
  handleEditToggle: (index: number) => void;
  revertEdit: (index: number) => void;
}

const TdEditButton = ({
  isEditing,
  rowIndex,
  handleEditToggle,
  revertEdit,
}: Props) => {
  return (
    <Td textAlign="center">
      {isEditing ? (
        <HStack>
          <Button onClick={() => handleEditToggle(rowIndex)}>
            <FaRegSave color="green" size={20} />
          </Button>
          <Button
            onClick={() => {
              handleEditToggle(rowIndex);
              revertEdit(rowIndex);
            }}
          >
            <TbPencilCancel color="red" size={20} />
          </Button>
        </HStack>
      ) : (
        <Button onClick={() => handleEditToggle(rowIndex)}>
          <TbPencil color="blue" size={20} />
        </Button>
      )}
    </Td>
  );
};

export default TdEditButton;
