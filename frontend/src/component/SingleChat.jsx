import React from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Button, IconButton, Text } from '@chakra-ui/react';
import { ArrowLeft } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();

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
              {/* Messages here */}
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