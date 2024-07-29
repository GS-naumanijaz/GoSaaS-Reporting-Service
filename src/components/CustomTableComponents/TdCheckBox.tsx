import { Td, Checkbox } from "@chakra-ui/react";

interface Props {
  checkedState: boolean;
  rowIndex: number;
  selectCheckBox: (index: number) => void;
}

const TdCheckBox = ({ checkedState, rowIndex, selectCheckBox }: Props) => {
  return (
    <Td textAlign="center">
      <Checkbox
        colorScheme="red"
        isChecked={checkedState}
        onChange={() => selectCheckBox(rowIndex)}
      />
    </Td>
  );
};

export default TdCheckBox;
