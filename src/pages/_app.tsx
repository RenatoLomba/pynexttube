import type { AppProps } from 'next/app'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        background: 'gray.900',
        color: 'gray.100',
        lineHeight: 'tall',
        fontSize: 'lg',
      },

      '::selection': {
        color: 'white',
        background: 'purple.500',
      },
    },
  },
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp
