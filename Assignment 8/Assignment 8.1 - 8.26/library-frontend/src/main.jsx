import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

import App from './App.jsx'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

// ✅ WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = localStorage.getItem('library-user-token')
      return {
        authorization: token ? `Bearer ${token}` : null,
      }
    },
  })
)

// ✅ Use split to route subscription operations through wsLink, others through http
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

// ✅ Apollo Client setup
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

// ✅ Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
