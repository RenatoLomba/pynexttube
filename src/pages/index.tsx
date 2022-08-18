import axios, { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

const validationSchema = z.object({
  link: z.string().url('Link inválido'),
  name: z.string().min(3, 'Mín. 3 caracteres'),
})

type FormFields = z.infer<typeof validationSchema>

const api = axios.create({
  baseURL: '/api',
})

const Home: NextPage = () => {
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(validationSchema),
  })

  const { mutateAsync, isLoading } = useMutation(
    async ({ link, name }: FormFields) => {
      const { data: file } = await api.post<string>('/download-mp3', { link })

      return { file, name }
    },
    {
      onSuccess: (data) => {
        const binaryData = [data.file]
        const url = window.URL.createObjectURL(
          new Blob(binaryData, { type: 'audio/mp3' }),
        )
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${data.name}.mp3`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()

        reset()
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast({
          title: 'Erro',
          description: error.response?.data.message || error.message,
          status: 'error',
        })
      },
    },
  )

  async function onFormSubmit(data: FormFields) {
    await mutateAsync(data)
  }

  return (
    <>
      <Head>
        <title>PyNextTube | Download your favorite videos as MP3</title>
      </Head>
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
            onSubmit={handleSubmit(onFormSubmit)}
            as="form"
            mt="10"
            flexDir="column"
            alignItems="flex-start"
            gap="8"
          >
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Nome do arquivo: </FormLabel>

              <Input
                {...register('name')}
                _placeholder={{
                  color: 'gray.400',
                }}
                variant="flushed"
                focusBorderColor="purple.500"
                placeholder="Música tal"
              />

              {!!errors.name && (
                <FormErrorMessage fontSize="lg" fontWeight="semibold">
                  {errors.name.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.link}>
              <FormLabel>Url do vídeo: </FormLabel>

              <Input
                {...register('link')}
                _placeholder={{
                  color: 'gray.400',
                }}
                variant="flushed"
                focusBorderColor="purple.500"
                placeholder="https://youtube.com/watch?v="
              />

              {!!errors.link && (
                <FormErrorMessage fontSize="lg" fontWeight="semibold">
                  {errors.link.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <Button
              w={{ base: '100%', sm: 'fit-content' }}
              type="submit"
              colorScheme="purple"
              isLoading={isSubmitting || isLoading}
            >
              Download
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Home
