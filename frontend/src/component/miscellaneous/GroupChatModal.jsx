import { Box, Button, CloseButton, Dialog, Image, Input, Portal, Spinner, Text } from "@chakra-ui/react"
import { useState } from "react";
import { toaster } from "../../components/ui/toaster";
import { ChatState } from "../../context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import { FaRocketchat } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from "axios";
import UserListItem from "../UserAvatars/UserListItem";
import UserBadgeItem from "../UserAvatars/UserBadgeItem";

const GroupChatModal = ({children}) => {

  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // if we have already have existing chats then we have append it to new chats
  const { user, chats, setChats } = ChatState();

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
      toaster.error("Failed to search users", {
        position: "bottom-left",
        autoClose: 5000,
        status: "warning",
        title: "Same users selected!",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGroup = (userToAdd) => {
    // if user already exists in selected users

    if(selectedUsers.includes(userToAdd)) {
      toaster.error("User already added", {
        position: "top",
        autoClose: 5000,
        // status: "warning",
        title: "Same users selected!",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title:"Please fill all the fields!",
        status: "error",
        type: "error",
        duration: 5000,
        description: error.response?.data?.message || "Something went wrong.",
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setOpen(false);
      toaster.create({
        title: "Group Chat created successfully!",
        status: "success",
        type: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
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
            <Dialog.Content
              minH="290px"
              maxH="90vh"
              maxW="600px"
              bg="orange.100"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
            >
              <Dialog.Header
                display="flex"
                justifyContent="center"
                fontSize="35px"
                bg="orange.200"
                p={4}
              >
                <Dialog.Title
                  fontSize={{ base: "30px", md: "36px" }}
                  fontFamily="Work Sans"
                  fontWeight="extrabold"
                  color="blackAlpha.900"
                >
                  Create Group Chat
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                display="flex"
                flexDir="column"
                gap={4}
                padding="25px"
                overflowY="auto"
                maxH="70vh"
              >
                <FormControl w={"100%"} display={"flex"} alignItems={"center"}>
                  <FaRocketchat
                    style={{
                      fontSize: "40px",
                      marginRight: "8px",
                      marginTop: "-8px",
                    }}
                  />
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </FormControl>
                <FormControl w={"100%"} display={"flex"} alignItems={"center"}>
                  <AiOutlineUsergroupAdd
                    style={{
                      fontSize: "40px",
                      marginRight: "8px",
                      marginTop: "-8px",
                    }}
                  />
                  <Input
                    placeholder="Add Users e.g.- Shivam, Shiva"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
                {/* list of selected users */}
                <Box display={"flex"} flexWrap={"wrap"}>
                  {selectedUsers.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleDelete(user)}
                    />
                  ))}
                </Box>

                {/* rendered user here */}
                {loading ? (
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
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    color={"orange.900"}
                    fontWeight={"bolder"}
                    mt={-3}
                    bg={"lightgreen"}
                    _hover={{ bg: "white", color: "orange" }}
                    onClick={handleSubmit}
                  >
                    Create Chat
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="md"
                  color={"blackAlpha.900"}
                  _hover={{ bg: "red", color: "orange" }}
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default GroupChatModal