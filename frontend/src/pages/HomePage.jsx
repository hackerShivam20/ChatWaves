import { Box, Container, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import SignUp from "../component/authentication/SignUp";
import Login from "../component/authentication/Login";
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={2}
        bg={"white"}
        w={"100%"}
        m={"40px 0 -20px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"Work sans"}
          color={"black"}
          textAlign={"center"}
          fontWeight={"bolder"}
        >
          ChatWaves
        </Text>
      </Box>
      <Box
        p={4}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Tabs.Root variant="subtle" fitted defaultValue={"tab-1"} justify={"center"} bgColor={"white"}>
          <Tabs.List mb={"1em"}>
            <Tabs.Trigger value="tab-1">SignUp</Tabs.Trigger>
            <Tabs.Trigger value="tab-2">Login</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1"><SignUp /></Tabs.Content>
          <Tabs.Content value="tab-2"><Login /></Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
}

export default HomePage