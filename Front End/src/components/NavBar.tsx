import { HStack, Image } from "@chakra-ui/react";
import { GoSaaSLabsLogo, navbarHeight } from "../configs";
import NotificationPopup from "./NotificationPopup";
import AvatarPopup from "./AvatarPopup";

const NavBar = () => {
  return (
    <HStack
      justify={"space-between"}
      height={navbarHeight}
      borderBottomColor={"lightgrey"}
      borderBottomWidth={1}
    >
      <Image marginLeft={3} padding={2} width={200} src={GoSaaSLabsLogo} />
      <HStack marginRight={5} spacing={8}>
        <NotificationPopup />
        <AvatarPopup />
      </HStack>
    </HStack>
  );
};

export default NavBar;
