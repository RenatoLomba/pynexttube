import type { NextPage } from 'next'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <Flex
      alignItems="center"
      maxWidth="780px"
      w="100%"
      mx="auto"
      h="100vh"
      px="4"
    >
      <Box
        as="main"
        w="100%"
        bgColor="gray.700"
        p={{ base: '5', md: '8' }}
        borderRadius="md"
      >
        <Flex as="header" mx="auto" width="fit-content">
          <Heading
            size={{ base: 'lg', sm: 'xl', md: '2xl' }}
            color="yellow.500"
          >
            Py
          </Heading>
          <Heading size={{ base: 'lg', sm: 'xl', md: '2xl' }} color="black">
            Next
          </Heading>
          <Heading size={{ base: 'lg', sm: 'xl', md: '2xl' }} color="red.500">
            Tube
          </Heading>
        </Flex>

        <Flex
          as="form"
          mt="10"
          flexDir="column"
          alignItems="flex-start"
          gap="8"
        >
          <FormControl isInvalid>
            <FormLabel>Url do vídeo: </FormLabel>

            <Input
              _placeholder={{
                color: 'gray.400',
              }}
              variant="flushed"
              focusBorderColor="purple.500"
              placeholder="https://youtube.com/watch?v="
            />

            <FormErrorMessage fontSize="lg" fontWeight="semibold">
              teste
            </FormErrorMessage>
          </FormControl>

          <Button
            w={{ base: '100%', sm: 'fit-content' }}
            type="submit"
            colorScheme="purple"
          >
            Download
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default Home
