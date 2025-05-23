import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider"
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={"3"}
      bg={"white"}
      width={{ base: "97.5%", md: "68%" }}
      height={{ base: "90%", md: "100%" }}
      position={{ base: "fixed", md: "relative" }}
      // ml={2}
      // mt={-5}
      // mr={2}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox