import { Button, HStack, Text } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";

interface Props {
  tableHeading: string;
  isSelectingRows: boolean;
  handleBulkSwitchActions: (status: boolean) => void;
  handleBulkDeleteRows: () => void;
}

const TableHeader = ({
  tableHeading,
  isSelectingRows,
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
      <Text fontSize={"x-large"}>{tableHeading}</Text>
      {isSelectingRows && (
        <HStack spacing={6}>
          <Button onClick={() => handleBulkSwitchActions(true)}>
            Activate All
          </Button>
          <Button onClick={() => handleBulkSwitchActions(false)}>
            Deactivate All
          </Button>
          <Button onClick={handleBulkDeleteRows}>
            <FaRegTrashCan color="red" size={20} />
          </Button>
        </HStack>
      )}
    </HStack>
  );
};

export default TableHeader;
