import React from 'react'
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../component/miscellaneous/SideDrawer.jsx';
import ChatBox from '../component/ChatBox.jsx';
import MyChats from '../component/MyChats.jsx';
import { Box } from '@chakra-ui/react';

const ChatPage = () => {

  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box>
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </Box>
    </div>
  )
}

export default ChatPage