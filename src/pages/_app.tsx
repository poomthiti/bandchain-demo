import "../styles/globals.css"
import type { AppProps } from "next/app"
import { MainContainer } from "../components"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { RecoilRoot } from "recoil"

const graphqlEndpoint = "graphql-lt4.bandchain.org/v1/graphql"

const client = new ApolloClient({
  uri: "https://" + graphqlEndpoint,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <MainContainer>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </MainContainer>
    </ApolloProvider>
  )
}

export default MyApp
