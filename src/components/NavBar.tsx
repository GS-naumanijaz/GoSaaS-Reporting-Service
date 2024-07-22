import { Button, HStack, Image } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { GoSaaSLabsLogo, primaryColor, secondaryColor } from "../configs";

const NavBar = () => {
  return (
    <HStack justify={"space-between"}>
      <Image padding={2} width={200} src={GoSaaSLabsLogo} />
      <HStack marginRight={5} spacing={8}>
        <Button
          variant="ghost"
          color={secondaryColor}
          _active={{ color: primaryColor }}
          onClick={() => console.log("Notification Clicked")}
        >
          <FaBell size={33} />
        </Button>
        <Button
          variant="ghost"
          color={secondaryColor}
          _active={{ color: primaryColor }}
          onClick={() => console.log("Avatar Clicked")}
        >
          <RxAvatar size={36} />
        </Button>
      </HStack>
    </HStack>
  );
};

export default NavBar;
