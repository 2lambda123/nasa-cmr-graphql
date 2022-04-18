import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { v4 as uuidv4 } from 'uuid'

import resolvers from '../resolvers'
import typeDefs from '../types'

import collectionDraftProposalSource from '../datasources/collectionDraftProposal'
import collectionDraftSource from '../datasources/collectionDraft'
import collectionSource from '../datasources/collection'
import granuleSource from '../datasources/granule'
import graphDbDuplicateCollectionsSource from '../datasources/graphDbDuplicateCollections'
import graphDbSource from '../datasources/graphDb'
import serviceSource from '../datasources/service'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../datasources/subscription'
import toolSource from '../datasources/tool'
import variableSource from '../datasources/variable'

import { downcaseKeys } from '../utils/downcaseKeys'

// Creating the server
const server = new ApolloServer({
  // Passing types and resolvers to the server
  typeDefs,
  resolvers,

  // Initial context state, will be available in resolvers
  context: ({ event }) => {
    const { headers } = event

    const {
      authorization: bearerToken,
      'client-id': clientId,
      'echo-token': echoToken,
      'x-request-id': requestId
    } = downcaseKeys(headers)

    const requestHeaders = {
      'CMR-Request-Id': requestId || uuidv4()
    }

    // If the client has provided an EDL token supply it to CMR
    if (bearerToken) requestHeaders.Authorization = bearerToken

    // If the client has identified themselves using Client-Id supply it to CMR
    if (clientId) requestHeaders['Client-Id'] = clientId

    // If the client has provided an EDL token supply it to CMR
    if (echoToken) requestHeaders['Echo-Token'] = echoToken

    // add the user to the context
    return {
      headers: requestHeaders
    }
  },

  // An object that goes to the 'context' argument when executing resolvers
  dataSources: () => ({
    collectionDraftProposalSource,
    collectionDraftSource,
    collectionSource,
    granuleSource,
    graphDbDuplicateCollectionsSource,
    graphDbSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolSource,
    variableSource
  }),

  // Show the landing page (which has a link to Apollo Studio Sandbox) in all environments
  plugins: [ApolloServerPluginLandingPageLocalDefault({
    // But hide the footer, it just shows a link to docs about the landing page
    footer: false
  })]
})

export default server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: true,
      credentials: true,
      allowedHeaders: [
        'Accept',
        'Authorization',
        'Client-Id',
        'Content-Type',
        'X-Request-Id'
      ]
    }
  }
})
