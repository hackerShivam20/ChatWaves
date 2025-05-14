// Problem not resolved till now
// 1. when we add user to group chat then it not suddenly reflect update in UI
// 2. when we remove user box anywhere then it will be delete , jabki sirf cross ko click karne se hi delete hona chahiye

import {
  IconButton,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  Input,
  Spinner
} from "@chakra-ui/react";
import React, { useState } from 'react'
import { IoEyeSharp } from 'react-icons/io5';
import { toaster } from "../../components/ui/toaster.jsx";
import { ChatState } from "../../context/ChatProvider.jsx";
import UserBadgeItem from "../UserAvatars/UserBadgeItem";
import { FormControl } from "@chakra-ui/form-control";
import axios from "axios";
import UserListItem from "../UserAvatars/UserListItem.jsx";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { user, selectedChat, setSelectedChat } = ChatState();

    const handleAddUser = async (user1) => {
      // if user already exists in selected users
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toaster.create({
                title: "User Already in Group!",
                status: "warning",
                type: "warning",
                duration: 4000,
                description: "User Already in Group!",
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        // check user is admin or not
        if (selectedChat.groupAdmin._id !== user._id) {
            toaster.create({
                title: "Only admins can add someone!",
                status: "warning",
                type: "warning",
                duration: 4000,
                description: "Only admins can add someone!",
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
              "/api/chat/groupadd",
              {
                groupChatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );

            setFetchAgain(!fetchAgain);
            setSelectedChat(data);
            setLoading(false);
        } catch (error) {
          toaster.create({
            title: "Error Occurred!",
            status: "error",
            type: "error",
            duration: 5000,
            description: error.response?.data?.message || "Something went wrong.",
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          // console.log(error);
        }
    };

    const handleRemove = async (user1) => {
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toaster.create({
          title: "Only admins can remove someone!",
          status: "error",
          type: "error",
          duration: 4000,
          description: "Only admins can remove someone!",
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put(
          "/api/chat/groupremove",
          {
            groupChatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );

        // agar jo user login hai wo hi apne aap ko remove kar de then jo chat hai wo emoty ho jayega
        user1._id === user._id
        ? setSelectedChat(): setSelectedChat(data);
        
        setFetchAgain(!fetchAgain);
        // setSelectedChat(data);
        setLoading(false);
      } catch (error) {
        toaster.create({
          title: "Error Occurred!",
          status: "error",
          type: "error",
          duration: 5000,
          description: error.response?.data?.message || "Something went wrong.",
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        // console.log(error);
      }
    };
    
    const handleRename = async () => {
        if (!groupChatName) {
          toaster.create({
            title: "Error Occurred!",
            status: "error",
            type: "error",
            duration: 1000,
            description:"Enter Chat Name.",
            // isClosable: true,
            position: "bottom",
          });
            return;
        }
        
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                "/api/chat/rename",
                {
                    groupChatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);    
            toaster.create({
              title: "Whoa!",
              status: "success",
              // status: "error",
              type: "success",
              duration: 5000,
              description: "Group Chat Name Updated Successfully.",
              isClosable: true,
              position: "top",
            });
        } catch (error) {
          toaster.create({
            title: "Error Occurred!",
            status: "error",
            type: "error",
            duration: 5000,
            description: error.response?.data?.message || "Something went wrong.",
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
          console.log(error);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/api/user?search=${search}`, config);

        setSearchResult(data);
        setLoading(false);
        console.log(data);
      } catch (error) {
        toaster.create({
          title: "Error Occurred!",
          status: "error",
          type: "error",
          duration: 5000,
          description: error.response?.data?.message || "Something went wrong.",
          isClosable: true,
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={() => setOpen(!open)} // toggle the modal
        fontSize="20px"
        color="black" // icon color
        aria-label="View Profile"
        variant="ghost" // optional: makes background transparent
        _hover={{
          color: "white", // icon color on hover
          bg: "blackAlpha.700", // background on hover
        }}
      >
        <IoEyeSharp />
      </IconButton>

      {/* main thing is here */}

      <Dialog.Root
        size={"md"}
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        isCentered
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg={"white"}>
              <Dialog.Header display={"flex"} justifyContent={"center"}>
                <Dialog.Title
                  fontSize={{ base: "30px", md: "40px" }}
                  fontFamily={"Work Sans"}
                  fontWeight={"extrabold"}
                  color={"blackAlpha.900"}
                >
                  {selectedChat.chatName}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
              // display={"flex"}
              // flexDir={"column"}
              // justifyContent={"space-between"}
              // alignItems={"center"}
              // gap={2}
              // padding={"35px"}
              >
                {/* show users which are currently in the group chat */}
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexWrap={"wrap"}
                  pb={3}
                  // justifyContent={"space-evenly"}
                >
                  {selectedChat.users.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleRemove(user)}
                    />
                  ))}
                </Box>

                <FormControl display={"flex"} gap={15}>
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    bg="lightblue"
                    fontWeight={"bold"}
                    isLoading={renameLoading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add Users e.g.- Shivam, Shiva"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>

                {/* render users */}
                {loading ? (
                  <Spinner
                    d={"flex"}
                    ml={"auto"}
                    size="xl"
                    color="#38B2AC"
                    thickness="4px"
                    speed="0.65s"
                    mt={4}
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                    display="flex"
                  />
                ) : (
                  searchResult
                    ?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    bg={"red.600"}
                    _hover={{ bg: "red.400", color: "black" }}
                    onClick={() => handleRemove(user)}
                    fontWeight={"bold"}
                    color={"white"}
                    mt={-3}
                  >
                    Leave Group
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="md"
                  color={"red.900"}
                  _hover={{ bg: "red.400", color: "black" }}
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UpdateGroupChatModal