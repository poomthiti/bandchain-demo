import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MainContainer } from '../components'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const graphqlEndpoint = "graphql-lt4.bandchain.org/v1/graphql"

const client = new ApolloClient({
  uri: 'https://' + graphqlEndpoint,
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <MainContainer>
        <Component {...pageProps} />
      </MainContainer>
    </ApolloProvider>
  )
}

export default MyApp
