import { Button, Td } from "@chakra-ui/react";

interface Props {
  onClick: () => void;
}

const TdTestButton = ({ onClick }: Props) => {
  return (
    <Td textAlign="center">
      <Button
        onClick={onClick}
        bg={"white"}
        borderColor={"black"}
        borderWidth={1}
        height={8}
        width={20}
      >
        Test
      </Button>
    </Td>
  );
};

export default TdTestButton;
