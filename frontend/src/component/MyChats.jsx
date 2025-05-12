import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider'
import { toaster } from '../components/ui/toaster';
import axios from 'axios';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import Chatloading from '../component/Chatloading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
// import { FaUserGroup } from "react-icons/fa6";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // yahan par sare chat ke data hai chahe wo single chat ho ya group chat ho
      const { data } = await axios.get("/api/chat", config);
      // console.log(data);

      setChats(data);
    } catch (error) {
      toaster.error("Failed to fetch chats", {
        position: "top-right",
        autoClose: 5000,
        status: "warning",
        title: "Same users selected!",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      // d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      // flexDir="column"
      // alignItems="center"
      // p={3}
      // ml={2}
      // mr={2}
      // mt={-5}
      // bg="#F8F8F8"
      // w={{ base: "100%", md: "31%" }}
      // borderRadius="lg"
      // borderWidth="1px"
      // h={{ base: "100%", md: "96%" }}
      // position={{ base: "fixed", md: "relative" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        // display="flex"
        // pb={3}
        // px={3}
        // fontSize={{ base: "28px", md: "30px" }}
        // fontFamily="Work sans"
        // fontWeight="bold"
        // w={"100%"} // full width
        // justifyContent="space-between"
        // alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            // display={"flex"}
            // onClick={() => setSelectedChat("")}
            // border={"1px solid black"}
            // borderRadius={"full"}
            // _hover={{ border: "2px solid #38B2AC" }}
            // fontSize={{ base: "17px", md: "15px", lg: "17px" }}
          >
            {/* <FaUserGroup size={20} /> */}
            <i className="fa-solid fa-user-plus"></i>
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        padding={3}
        bg="#F8F8F8"
        width="100%"
        height="90%"
        borderRadius="lg"
        overflowY="hidden"
        // d={"flex"}
        // flexDir={"column"}
        // p={3}
        // bg="#F8F8F8"
        // w={"100%"}
        // h={"90%"} // full height
        // borderRadius="lg"
        // overflow={"hidden"} // hide overflow
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                // mb={2}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats