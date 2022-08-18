import type { AppProps } from 'next/app'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        background: 'gray.900',
        color: 'gray.100',
        lineHeight: 'tall',
        fontSize: '2xl',

        '@media screen and (max-width: 480px)': {
          fontSize: 'lg',
        },
      },

      '::selection': {
        color: 'white',
        background: 'purple.500',
        '-webkit-text-stroke': '0',
      },
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
