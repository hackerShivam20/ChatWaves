import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { toaster } from "../../components/ui/toaster"; // adjust path as per your project
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation
import axios from "axios"; // Make sure to install axios if you haven't already

function SignUp() {
  // const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(""); // Assuming you're using react-router-dom for navigation

  const handleClick = () => setShow(!show);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  };

  const postDetails = (pics) => {
    // setLoading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please select an image",
        status: "warning",
        type: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setLoading(false);
      return;
    }
    console.log(pics);
    
    // image validation by using cloudinary
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setUploading(true);
      
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatWaves");
      data.append("cloud_name", "chatwaves");

      fetch("https://api.cloudinary.com/v1_1/chatwaves/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json()) // convert to json
        .then((data) => {
          // use conerted json data
          setPic(data.url.toString());
          console.log(data.url.toString());
          // setLoading(false);
          toaster.create({
            title: "Image uploaded successfully",
            description: "File saved successfully to the server",
            status: "success",
            type: "success",
            duration: 10000,
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          });
        })
        .catch((err) => {
          // if any error occurs
          console.log(err);
          // setLoading(false);
          toaster.create({
            title: "Failed to upload image",
            status: "error",
            type: "error",
            duration: 5000,
          });
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      toaster.create({
        title: "Please select a JPEG or PNG image",
        status: "warning",
        type: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      // setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      // setLoading(true);
      toaster.create({
        title: "Passwords do not match",
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
        "/api/user", // Added slash to avoid relative issues
        { name, email, password, pic },
        config
      );

      toaster.create({
        title: "Registration Successful",
        status: "success",
        type: "success",
        duration: 5000,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
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
    } finally {
      setLoading(false);
    }
  };

    // // Add your signup logic here
    // toaster.create({
    //   title: "Sign Up successful",
    //   status: "success",
    //   type: "success",
    //   duration: 3000,
    // });

  return (
    <VStack spacing={"5px"} color={"black"} width={"100%"}>
      {/* Name */}

      <Box id="first-name" datarequired={"Name is required"} w={"100%"}>
        <Text color={"black"} fontSize={"sm"} fontWeight={"bolder"}>
          Name
        </Text>
        <Input
          borderColor="gray.300"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 2px rgba(65, 137, 214, 0.5)",
          }}
          placeholder="Enter Your Name"
          w="100%"
          color={"black"}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Box>

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
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          pr="3.5rem"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="xs"
          position="absolute"
          right="8px"
          top="40%"
          bg="gray.200"
          _hover={{ bg: "gray.300" }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
      </Box>

      {/* Confirm password */}

      <Box datarequired={"Name is required"} w={"100%"} position={"relative"}>
        <Text color={"black"} fontSize={"sm"} fontWeight={"bolder"}>
          Confirm Password
        </Text>
        <Input
          borderColor="gray.300"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 2px rgba(65, 137, 214, 0.5)",
          }}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Enter Confirm Password"
          pr="3.5rem"
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="xs"
          position="absolute"
          right="8px"
          top="40%"
          bg="gray.200"
          _hover={{ bg: "gray.300" }}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </Button>
      </Box>

      {/* profile pic */}

      <Box id="pic" datarequired={"Pic is required"} w={"100%"}>
        <Text color={"black"} fontSize={"sm"} fontWeight={"bolder"}>
          Profile Pic
        </Text>
        <Input
          borderColor="gray.300"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 2px rgba(65, 137, 214, 0.5)",
          }} // Improve focus effect
          type="file"
          accept="image/*"
          p={1.5}
          w="100%"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </Box>

      {/* Sign Up button */}
      <Button
        colorScheme="blue"
        bgColor={"blue.600"}
        borderRadius={"lg"}
        _hover={{ bg: "blue.700" }}
        _active={{ bg: "blue.800" }}
        _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
        color={"white"}
        type="submit"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading || uploading} // Show loading spinner when loading is true
        isDisabled={uploading}
      >
        {uploading ? "Uploading..." : "Sign Up"}
      </Button>
    </VStack>
  );
}

export default SignUp;
