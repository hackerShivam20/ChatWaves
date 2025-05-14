import {
  IconButton,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Image,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

if (!user) return null;

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(!open)}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          onClick={() => setOpen(!open)} // toggle the modal
          fontSize="20px"
          color="black" // icon color
          aria-label="View Profile"
          variant="ghost" // optional: makes background transparent
          _hover={{
            color: "white", // icon color on hover
            bg: "blackAlpha.700", // background on hover
          }}
        >
          <IoEyeSharp />
        </IconButton>
      )}

      {/* main thing is here */}

      <Dialog.Root
        size={"md"}
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        isCentered
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content height={"410px"} bg={"orange"}>
              <Dialog.Header display={"flex"} justifyContent={"center"}>
                <Dialog.Title
                  fontSize={{ base: "30px", md: "40px" }}
                  fontFamily={"Work Sans"}
                  fontWeight={"extrabold"}
                  color={"blackAlpha.900"}
                >
                  {user.name}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                display={"flex"}
                flexDir={"column"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={2}
                padding={"35px"}
              >
                <Image
                  borderRadius={"full"}
                  boxSize={"150px"}
                  src={user.pic}
                  alt={user.name}
                />
                <Text
                  fontSize={{ base: "18px", md: "24px" }}
                  fontFamily={"Work Sans"}
                  fontWeight={"medium"}
                  color={"blackAlpha.900"}
                  textAlign="center"
                  wordBreak="break-word"
                >
                  Email: {user.email}
                </Text>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    color={"blackAlpha.900"}
                    _hover={{ bg: "red", color: "orange" }}
                  >
                    Close
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="md"
                  color={"blackAlpha.900"}
                  _hover={{ bg: "red", color: "orange" }}
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default ProfileModal;  