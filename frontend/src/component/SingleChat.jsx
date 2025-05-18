import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { FormControl } from '@chakra-ui/form-control';
import { toaster } from '../components/ui/toaster';
import axios from 'axios';
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  // const[ sendMessage, setSendMessage] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  // here we fetch all messages of selected user with logged user
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);
        // it append old message with new message
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
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
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Write Indicator Logic here in Future
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
              aria-label="Go back"
              bg="#E8E8E8"
              variant="solid"
              border={"1px solid black"}
              borderRadius={"30%"}
              _hover={{ bg: "white" }}
            >
              <IoMdArrowRoundBack />
            </IconButton>

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                width={20}
                height={20}
                color={"#3b82f6"}
                // alignSelf={`center`}
                margin={"auto"}
              />
            ) : (
              <div
                className="messages"
                display={"flex"}
                flexdir={"column"}
                overflowy={"scroll"}
                scrollbarwidth={"none"}
              >
                {/* Messages will be displayed here */}
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* for input message */}
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter" && newMessage) {
              //     // sendMessage();
              //   }
              // }}
            >
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"work sans"}>
            Click on user to start chatting !
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat