import {
  Box,
  Button,
  Divider,
  HStack,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { primaryColor, tertiaryColor } from "../configs";
import { FaBell } from "react-icons/fa";
import { BiSolidCircle } from "react-icons/bi";
import { useEffect, useState } from "react";

const NotificationPopup = () => {
  // implement react query here
  const [notifications, setNotifications] = useState([
    {
      header: "New Message",
      body: "You have a new message from John Doe",
      isRead: false,
    },
    {
      header: "New Message",
      body: "Important Alert",
      isRead: true,
    },
  ]);

  useEffect(() => {}, [notifications]);

  const handleAllRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, isRead: true }))
    );
  };

  return (
    <Popover placement="bottom" isLazy>
      <PopoverTrigger>
        <Button
          variant="link"
          p={0}
          _active={{ color: primaryColor }}
          color={primaryColor}
        >
          <FaBell size={33} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bg={tertiaryColor}
        maxWidth={"320px"}
        marginRight={5}
        borderWidth={1}
        borderColor={"grey"}
        paddingX={2}
        paddingBottom={1}
      >
        <HStack justifyContent={"space-between"}>
          <PopoverHeader>Notifications</PopoverHeader>
          <Button textColor={primaryColor} onClick={() => handleAllRead()}>
            Mark All as Read
          </Button>
        </HStack>
        <Divider />
        {notifications.map((n, index) => (
          <HStack key={index} justifyContent={"space-between"} p={2}>
            <Button variant={"link"} textColor={"black"} fontWeight={"normal"}>
              <Box
                maxWidth="240px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {n.body}
              </Box>
            </Button>
            <BiSolidCircle color={n.isRead ? primaryColor : "white"} />
          </HStack>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopup;
