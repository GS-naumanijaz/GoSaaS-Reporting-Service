import { Button, HStack, Td, Tooltip } from "@chakra-ui/react";
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
          <Tooltip hasArrow label="Save" bg="green">
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
          </Tooltip>
          <Tooltip hasArrow label="Cancel" bg="red  ">
            <Button
              variant={"ghost"}
              onClick={() => {
                handleEditToggle();
                revertEdit();
              }}
            >
              <TbPencilCancel color="red" size={20} />
            </Button>
          </Tooltip>
        </HStack>
      ) : (
        <Tooltip hasArrow label="Edit" bg="blue">
          <Button
            variant={"ghost"}
            onClick={handleEditToggle}
            isDisabled={isEditingMode}
          >
            <TbPencil color="blue" size={20} />
          </Button>
        </Tooltip>
      )}
    </Td>
  );
};

export default TdEditButton;
