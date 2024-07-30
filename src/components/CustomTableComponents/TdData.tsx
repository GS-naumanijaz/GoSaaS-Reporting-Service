// src/components/TdData.tsx
import { Input, Td, FormControl, FormErrorMessage } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { validateField, ValidationRule } from "../../models/ValidationRule"; // Adjust the import path as needed

interface Props {
  isEditing: boolean;
  isEditable: boolean;
  data: string;
  type: string;
  handleInputChange: (value: string, error: string) => void;
  validation?: ValidationRule;
}

const TdData = ({
  isEditing,
  isEditable,
  data,
  type,
  handleInputChange,
  validation,
}: Props) => {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isEditing) {
      setError(""); // Reset the error state when isEditing changes
    }
  }, [isEditing]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const error = validateField(value, validation);
    setError(error);
    handleInputChange(value, error); // Always apply changes
  };

  return (
    <Td textAlign="center">
      {isEditing && isEditable ? (
        <FormControl isInvalid={!!error}>
          <Input
            type={type}
            textAlign="center"
            value={data}
            onChange={handleChange}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
      ) : (
        data
      )}
    </Td>
  );
};

export default TdData;
