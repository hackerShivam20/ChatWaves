import {
  Box,
  Button,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuPositioner,
  Portal,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { IoChevronDownCircle } from "react-icons/io5";
import React, { useState } from "react";
import { Tooltip } from "../../components/ui/tooltip.jsx";
import { ChatState } from "../../context/ChatProvider.jsx";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const { user } = ChatState();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="5px 10px"
      bg="#fff"
      borderRadius="lg"
      border="2px solid #e7e4e4"
      w="100%"
    >
      <Tooltip label="Search Users to chat" placement="bottom-end" hasArrow>
        <Button
          variant="ghost"
          color="black"
          _hover={{ bg: "#E8E8E8" }}
          _active={{ bg: "#E8E8E8" }}
          _focus={{ boxShadow: "none" }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text
            display={{ base: "none", md: "flex" }}
            px={4}
            fontSize="15px"
            fontWeight="bold"
          >
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Text
        fontSize="2xl"
        fontFamily="Work sans"
        color="black"
        textAlign="center"
      >
        Chat Waves
      </Text>

      <div style={{ display: "flex", gap: "10px" }}>
        {/* Bell Notification */}
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              p={1}
              mr={2}
              variant="ghost"
              color="black"
              _hover={{ bg: "#E8E8E8" }}
              _active={{ bg: "#E8E8E8" }}
              _focus={{ boxShadow: "none" }}
              size={"md"}
            >
              <FaBell />
            </Button>
          </MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent
                color="white"
                bg={"white"}
                borderRadius="lg"
                boxShadow="md"
              >
                <MenuItem
                  variant="ghost"
                  // bg="white"
                  color="black"
                  _hover={{ bg: "#E8E8E8" }}
                  _active={{ bg: "#E8E8E8" }}
                  _focus={{ boxShadow: "none" }}
                  p={1}
                  mr={2}
                >
                  Notification 1
                </MenuItem>
                <Box height="1px" bg="gray.200" my="2" />
                <MenuItem
                  variant="ghost"
                  // bg="white"
                  color="black"
                  _hover={{ bg: "#E8E8E8" }}
                  _active={{ bg: "#E8E8E8" }}
                  _focus={{ boxShadow: "none" }}
                  p={1}
                  mr={2}
                >
                  Notification 2
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>

        {/* Profile Menu */}
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              variant="ghost"
              color="black"
              _hover={{ bg: "#E8E8E8" }}
              _active={{ bg: "#E8E8E8" }}
              _focus={{ boxShadow: "none" }}
              p={1}
              mr={2}
              rightIcon={<IoChevronDownCircle />}
            >
              {/* to show the profile picture */}
              <Avatar.Root size={"sm"} bg={"gray.200"}>
                <Avatar.Fallback name={user.name} />
                <Avatar.Image src={user.pic} />
              </Avatar.Root>
            </Button>
          </MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent bg={"white"} borderRadius="lg" boxShadow="md">
                <MenuItem
                  variant="ghost"
                  color="black"
                  _hover={{ bg: "#E8E8E8" }}
                  _active={{ bg: "#E8E8E8" }}
                  _focus={{ boxShadow: "none" }}
                  p={1}
                  mr={2}
                >
                  My Profile
                </MenuItem>
                {/* <MenuItem>Settings</MenuItem> */}
                <Box height="1px" bg="gray.200" my="2" />
                <MenuItem
                  variant="ghost"
                  // bg="white"
                  color="black"
                  _hover={{ bg: "#E8E8E8" }}
                  _active={{ bg: "#E8E8E8" }}
                  _focus={{ boxShadow: "none" }}
                  p={1}
                  mr={2}
                >
                  Logout
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>
      </div>
    </Box>
  );
};

export default SideDrawer;
