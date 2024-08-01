import { Td, Checkbox } from "@chakra-ui/react";

interface Props {
  checkedState: boolean;
  selectCheckBox: () => void;
}

const TdCheckBox = ({ checkedState, selectCheckBox }: Props) => {
  return (
    <Td textAlign="center">
      <Checkbox
        colorScheme="red"
        isChecked={checkedState}
        onChange={selectCheckBox}
      />
    </Td>
  );
};

export default TdCheckBox;
