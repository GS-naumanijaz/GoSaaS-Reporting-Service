import { Box, Button, Text } from "@chakra-ui/react";

const AddProductButton = () => {
  return (
    <Box
      position="relative"
      bg="white"
      height={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={20}
    >
      <Text fontSize="xx-large">product</Text>
      <Button position="absolute" top="5px" right="5px" size="sm">
        Hover Me
      </Button>
    </Box>
  );
};

export default AddProductButton;
