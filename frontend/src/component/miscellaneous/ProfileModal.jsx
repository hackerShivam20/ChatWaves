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

const ProfileModal = ({ user, open, setOpen, children }) => {
//   const [open, setOpen] = useState(false);

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(!open)}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<IoEyeSharp />} // nahi dikh raha hai kuch karenge baad me
          onClick={() => setOpen(!open)} // toggle the modal
          fontSize="20px"
          color="black" // icon color
          aria-label="View Profile"
          variant="ghost" // optional: makes background transparent
          _hover={{
            color: "white", // icon color on hover
            bg: "blackAlpha.700", // background on hover
          }}
        />
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
            <Dialog.Content>
              <Dialog.Header display={"flex"} justifyContent={"center"}>
                <Dialog.Title fontSize={"40px"} fontFamily={"Work Sans"}>
                  {user.name}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                display={"flex"}
                flexDir={"column"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={4}
                padding={"20px"}
              >
                <Image
                  borderRadius={"full"}
                  boxSize={"150px"}
                  src={user.pic}
                  alt={user.name}
                />
                <Text
                  fontSize={{ base: "20px", md: "30px" }}
                  fontFamily={"Work Sans"}
                >
                  Email: {user.email}
                </Text>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default ProfileModal;  