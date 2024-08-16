import { Button, HStack, Td } from "@chakra-ui/react";
import { FaRegSave } from "react-icons/fa";
import { TbPencil, TbPencilCancel } from "react-icons/tb";

interface Props {
  isEditingMode: boolean;
  isEditing: boolean;
  isDisabled: boolean;
  handleEditToggle: () => void;
  revertEdit: () => void;
  saveEdit: () => void;
}

const TdEditButton = ({
  isEditingMode,
  isEditing,
  isDisabled,
  handleEditToggle,
  revertEdit,
  saveEdit,
}: Props) => {
  return (
    <Td textAlign="center">
      {isEditing ? (
        <HStack>
          <Button
            onClick={() => {
              handleEditToggle();
              saveEdit();
            }}
            isDisabled={isDisabled}
            variant={"ghost"}
          >
            <FaRegSave color="green" size={20} />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              handleEditToggle();
              revertEdit();
            }}
          >
            <TbPencilCancel color="red" size={20} />
          </Button>
        </HStack>
      ) : (
        <Button
          variant={"ghost"}
          onClick={handleEditToggle}
          isDisabled={isEditingMode}
        >
          <TbPencil color="blue" size={20} />
        </Button>
      )}
    </Td>
  );
};

export default TdEditButton;
