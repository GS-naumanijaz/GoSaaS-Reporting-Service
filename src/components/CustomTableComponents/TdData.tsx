import { Input, Td } from "@chakra-ui/react";

interface Props {
  isEditing: boolean;
  data: string;
  handleInputChange: (value: string) => void;
}

const TdData = ({ isEditing, data, handleInputChange }: Props) => {
  return (
    <Td textAlign="center">
      {isEditing ? (
        <Input
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
