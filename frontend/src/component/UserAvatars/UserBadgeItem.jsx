import { Box, CloseButton } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={14}
      backgroundColor="purple.500"
      cursor={"pointer"}
      onClick={handleFunction}
      color="white"
      justifyContent="space-between"
      alignItems="center"
      maxW="max-content"
      display="inline-flex"
      _hover={{ bg: "white", color: "orange" }}
    >
      {user.name}
      <CloseButton
        ml={1}
        size="xs"
        _hover={{ bg: "red", color: "white" }}
        onClick={(e) => {
          e.stopPropagation(); // prevent event bubbling to parent
          handleFunction();
        }}
      />
    </Box>
  );
}

export default UserBadgeItem