import { Input, Td } from "@chakra-ui/react";

interface Props {
  isEditing: boolean;
  data: string;
  rowIndex: number;
  index: number;
  handleInputChange: (row: number, index: number, value: string) => void;
}

const TdData = ({
  isEditing,
  data,
  rowIndex,
  index,
  handleInputChange,
}: Props) => {
  return (
    <Td textAlign="center">
      {isEditing ? (
        <Input
          textAlign="center"
          value={data}
          onChange={(e) => handleInputChange(rowIndex, index, e.target.value)}
        />
      ) : (
        data
      )}
    </Td>
  );
};

export default TdData;
