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
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json"; // Import your animation data

const ENDPOINT = "http://localhost:5000"; // Backend URL
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  // const[ sendMessage, setSendMessage] = useState(false);
  const[ socketConnected, setSocketConnected] = useState(false);

  // states for typing indicator functionality
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

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

      // connect socket.io
      socket.emit("join chat", selectedChat._id);

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
    socket = io(ENDPOINT);
    socket.emit("setup", user); // take form server.js line 63
    socket.on("connected", () => setSocketConnected(true));

    // for typing indicator
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // for show real-time message
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // agar selected chat nhi hai matlab right wala khali hai usme koi bhi chat open nhi hai
      // ya fir jo message aaya hai uske alwa kisi aur ka chat khula hai then uske liye niche wali condition hai
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // Show notification or update UI for new message in different chat
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
      else{
        // append new message to old message
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      // FOR TYPING INDICATOR
      socket.emit("stop typing", selectedChat._id)
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

        // here we are sending message to all users in the chat
        socket.emit("new message", data); // send message to all users in the chat

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
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 4000; // 4 seconds

    setTimeout(() => {
      var currentTime = new Date().getTime();
      if (currentTime - lastTypingTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
            overflow={"hidden"}
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
              <Box
              flex={1}
                className="messages"
                display={"flex"}
                flexDir={"column"}
                overflowY={"auto"}
              >
                {/* Messages will be displayed here */}
                <ScrollableChat messages={messages} />
              </Box>
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
              {/* Typing indicator */}
              {isTyping ? <div>
                <Lottie
                options={defaultOptions}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div> : (<></>)}
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