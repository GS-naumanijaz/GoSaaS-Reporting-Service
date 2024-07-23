import { HStack, Image } from "@chakra-ui/react";
import { GoSaaSLabsLogo } from "../configs";
import NotificationPopup from "./NotificationPopup";
import AvatarPopup from "./AvatarPopup";

const NavBar = () => {
  return (
    <HStack justify={"space-between"}>
      <Image padding={2} width={200} src={GoSaaSLabsLogo} />
      <HStack marginRight={5} spacing={8}>
        <NotificationPopup />
        <AvatarPopup />
      </HStack>
    </HStack>
  );
};

export default NavBar;
