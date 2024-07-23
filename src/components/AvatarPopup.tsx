import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { primaryColor, tertiaryColor } from "../configs";
import { RxAvatar } from "react-icons/rx";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const AvatarPopup = () => {
  const navigate = useNavigate();
  return (
    <Popover placement="bottom-end" isLazy>
      <PopoverTrigger>
        <Button
          variant="link"
          p={0}
          _active={{ color: primaryColor }}
          color={primaryColor}
          onClick={() => console.log("Avatar Clicked")}
        >
          <RxAvatar size={36} />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg={tertiaryColor} maxWidth={"150px"}>
          <PopoverBody>
            <Button
              textColor={"black"}
              fontWeight={"normal"}
              width={"100%"}
              leftIcon={<RiLogoutBoxRLine />}
              size={"sm"}
              onClick={() => navigate("/")}
            >
              Logout
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default AvatarPopup;
