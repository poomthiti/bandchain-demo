import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MainContainer } from './components'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainContainer>
      <Component {...pageProps} />
    </MainContainer>
  )
}

export default MyApp
