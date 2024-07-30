import { Input, Td } from "@chakra-ui/react";

interface Props {
  isEditing: boolean;
  isEditable: boolean;
  data: string;
  type: string;
  handleInputChange: (value: string) => void;
}

const TdData = ({
  isEditing,
  isEditable,
  data,
  type,
  handleInputChange,
}: Props) => {
  return (
    <Td textAlign="center">
      {isEditing && isEditable ? (
        <Input
          type={type}
          textAlign="center"
          value={data}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      ) : (
        data
      )}
    </Td>
  );
};

export default TdData;
