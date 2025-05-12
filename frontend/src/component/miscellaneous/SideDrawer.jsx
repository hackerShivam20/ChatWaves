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
  Drawer,
  CloseButton,
  Input,
  Spinner,
} from "@chakra-ui/react";

import axios from "axios";
import { FaBell } from "react-icons/fa";
import { IoChevronDownCircle } from "react-icons/io5";
import React, { useState } from "react";
import { Tooltip } from "../../components/ui/tooltip.jsx";
import { ChatState } from "../../context/ChatProvider.jsx";
import ProfileModal from "./ProfileModal.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import Chatloading from "../Chatloading.jsx";
import UserListItem from "../UserAvatars/UserListItem.jsx";

const SideDrawer = () => {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  // logout button functionality
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    // console.log("Searching for:", search);
    if (!search) {
      toaster.create({
        title: "Please enter something in the search",
        position: "top",
        status: "warning",
        type: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // API request to search for users
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config); // Added slash to avoid relative issues

      setLoading(false);
      setSearchResult(data);
      console.log("Search Results:", data);
    } catch (error) {
      // setLoading(false);
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to fetch users",
        position: "bottom-left",
        status: "error",
        type: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // function to access chat
  // this function will be called when user clicks on the user in the search result
  // it will create a new chat if it doesn't exist or access the existing chat
  // and then navigate to the chat page
  // open chat on right half of the screen
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      // use to chek valid users and access chat and information
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      };

      // it returns chat that we created or accessed
      const { data } = await axios.post("/api/chat", { userId }, config );

      // if chat already exist then we append it to the chats array
      if(!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
      // onclose();
    } catch (error) {
      // setLoadingChat(false);
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to access chat",
        position: "bottom-left",
        status: "error",
        type: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="5px 10px"
        bg="#fff"
        borderRadius="lg"
        border="2px solid #e7e4e4"
        w="100%"
        position={"sticky"}
        top="0"
        zIndex="10"
        // boxShadow="xs"
      >
        <Tooltip label="Search Users to chat" placement="bottom-end" hasArrow>
          <Button
            variant="ghost"
            color="black"
            _hover={{ bg: "#E8E8E8" }}
            _active={{ bg: "#E8E8E8" }}
            _focus={{ boxShadow: "none" }}
            onClick={() => setOpen(true)}
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
                  <ProfileModal user={user}>
                    <MenuItem
                      variant="ghost"
                      color="black"
                      _hover={{ bg: "#E8E8E8" }}
                      _active={{ bg: "#E8E8E8" }}
                      _focus={{ boxShadow: "none" }}
                      p={1}
                      mr={2}
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      My Profile
                    </MenuItem>
                  </ProfileModal>
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
                    onClick={logoutHandler}
                  >
                    Logout
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </Portal>
          </MenuRoot>
        </div>
      </Box>

      {/* ######################################################################################################################################################################################################################## */}

      {/* Search Box */}
      {/* Drawer Section or Search User Section */}
      <Drawer.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="left"
        isLazy
        transition="all 0.5s ease-in-out"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="white">
              <Drawer.Header
                maxW="300px"
                h="100vh"
                // boxShadow="lg"
                // transform="translateX(-100%)"
                animation="slideInLeft 0.3s ease forwards"
                position="relative"
                color={"blackAlpha.900"}
                fontFamily={"Work sans"}
                fontWeight={"bold"}
                borderBottom="1px solid #E7E4E4"
              >
                <Drawer.Title>Search Users</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={2}
                  mb={5}
                >
                  <Input
                    placeholder={"Search by name or email"}
                    mr={2}
                    borderRadius="lg"
                    value={search}
                    fontFamily={"Work sans"}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    color={"black"}
                    _hover={{ bg: "#E8E8E8", border: "3px solid #38B2AC" }}
                  />
                  <Button
                    border={"1px solid black"}
                    color={"blackAlpha.900"}
                    fontWeight={"bold"}
                    fontFamily={"Work sans"}
                    bg="#E8E8E8"
                    _hover={{ bg: "white", border: "3px solid #38B2AC" }}
                    _active={{ bg: "#E8E8E8" }}
                    _focus={{ boxShadow: "none" }}
                    onClick={handleSearch}
                  >
                    Go
                  </Button>
                </Box>

                {/* for load or show chats and users */}
                {loading ? (
                  <Chatloading />
                ) : (
                  // to show all users or say result by using map
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}

                {loadingChat && (
                  <Spinner
                    d={"flex"}
                    ml={"auto"}
                    size="lg"
                    color="#38B2AC"
                    thickness="4px"
                    speed="0.65s"
                    mt={4}
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                    display="flex"
                  />
                )}
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    color={"blackAlpha.900"}
                    _hover={{ bg: "#E8E8E8" }}
                    _active={{ bg: "#E8E8E8" }}
                    _focus={{ boxShadow: "none" }}
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </Drawer.ActionTrigger>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton
                  size="md"
                  color={"blackAlpha.900"}
                  _hover={{ bg: "#E8E8E8" }}
                  _active={{ bg: "#E8E8E8" }}
                  _focus={{ boxShadow: "none" }}
                  border={"1px solid black"}
                  onClick={() => setOpen(false)}
                />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Profile Modal */}
      {/* <ProfileModal
        user={user}
        open={isProfileModalOpen}
        setOpen={setIsProfileModalOpen}
      /> */}
    </>
  );
};

export default SideDrawer;