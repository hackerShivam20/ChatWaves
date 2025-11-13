// import React, { useEffect, useRef } from "react";
import { Box, Tooltip, Avatar, Button } from "@chakra-ui/react";
import {
  isSameSender,
  // isSameSenderMargin,
  // isSameUser,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics"; // adjust path as needed
import { ChatState } from "../context/ChatProvider";
import { useEffect, useRef } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

    // const bottomRef = useRef(null);

    // useEffect(() => {
    //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

  return (
    <Box
      overflowY="auto"
      height="100%"
      padding="10px"
      display="flex"
      flexDirection="column"
    >
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
            //   <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Button
                  variant="ghost"
                  color="black"
                  _hover={{ bg: "#E8E8E8" }}
                  _active={{ bg: "#E8E8E8" }}
                  _focus={{ boxShadow: "none" }}
                  p={1}
                  mr={2}
                  // rightIcon={<IoChevronDownCircle />}
                >
                {/* to show the profile picture */}
                <Avatar.Root size={"sm"} bg={"gray.200"}>
                  <Avatar.Fallback name={m.sender.name} />
                  <Avatar.Image src={m.sender.pic} />
                </Avatar.Root>
                </Button>
            //   </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "8px 15px",
                // gap:"2px",

                // marginLeft: "10px",
                paddingLeft: "10px",
                maxWidth: "75%",

              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      {/* <div ref={bottomRef} /> */}
    </Box>
  );
};

export default ScrollableChat;