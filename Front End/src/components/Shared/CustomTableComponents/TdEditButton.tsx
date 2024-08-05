import { Button, HStack, Td } from "@chakra-ui/react";
import { FaRegSave } from "react-icons/fa";
import { TbPencil, TbPencilCancel } from "react-icons/tb";

interface Props {
  isEditing: boolean;
  isDisabled: boolean;
  handleEditToggle: () => void;
  revertEdit: () => void;
}

const TdEditButton = ({
  isEditing,
  isDisabled,
  handleEditToggle,
  revertEdit,
}: Props) => {
  return (
    <Td textAlign="center">
      {isEditing ? (
        <HStack>
          <Button
            onClick={handleEditToggle}
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
        <Button variant={"ghost"} onClick={handleEditToggle}>
          <TbPencil color="blue" size={20} />
        </Button>
      )}
    </Td>
  );
};

export default TdEditButton;
