import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { toaster } from "../../components/ui/toaster"; // adjust path as per your project
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation
import axios from "axios"; // Make sure to install axios if you haven't already

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(""); // Assuming you're using react-router-dom for navigation

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
        if (!email || !password) {
          toaster.create({
            title: "Please fill all the fields",
            status: "warning",
            type: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
    
        // API request to store it into database
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
    
          const { data } = await axios.post(
            "/api/user/login", // Added slash to avoid relative issues
            { email, password },
            config
          );
    
          toaster.create({
            title: "Login Successful",
            status: "success",
            type: "success",
            duration: 5000,
            position: "bottom",
          });
    
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate("/chats");
        } 
        catch (error) {
          toaster.create({
            title: "Error Occurred!",
            status: "error",
            type: "error",
            duration: 5000,
            description: error.response?.data?.message || "Something went wrong.",
            isClosable: true,
            position: "bottom",
          });
          console.log(error.response.data.message);
        } finally {
          setLoading(false);
        }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  };

  return (
      <VStack spacing={"5px"} color={"black"} width={"100%"}>
        {/* Email */}

        <Box id="email" datarequired={"Email is required"} w={"100%"}>
          <Text color={"black"} fontSize={"sm"} fontWeight={"bolder"}>
            Email
          </Text>
          <Input
            borderColor="gray.300"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 2px rgba(65, 137, 214, 0.5)",
            }}
            placeholder="Enter Your Email"
            value={email}
            w="100%"
            color={"black"}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Box>

        {/* password */}

        <Box
          datarequired={"Password is required"}
          w={"100%"}
          position={"relative"}
        >
          <Text color={"black"} fontSize={"sm"} fontWeight={"bolder"}>
            Password
          </Text>
          <Input
            borderColor="gray.300"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 2px rgba(65, 137, 214, 0.5)",
            }}
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            pr="3.5rem"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            w="100%"
          />
          <Button
            size="xs"
            position="absolute"
            right="8px"
            top="40%"
            // transform="translateY(-50%)"
            bg="gray.200"
            _hover={{ bg: "gray.300" }}
            onClick={handleClick}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </Box>

        {/* Login button */}
        <Button
          colorScheme="blue"
          bgColor={"blue.600"}
          borderRadius={"lg"}
          _hover={{ bg: "blue.700" }}
          _active={{ bg: "blue.800" }}
          _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
          color={"white"}
          type="button"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          colorScheme="red"
          bgColor={"red.600"}
          borderRadius={"lg"}
          _hover={{ bg: "red.700" }}
          _active={{ bg: "red.800" }}
          _focus={{ boxShadow: "0 0 0 3px rgba(228, 86, 79, 0.93)" }}
          color={"white"}
          type="submit"
          width="100%"
          style={{ marginTop: 5 }}
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
          isLoading={false}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
  );
}

export default Login