import { ApolloServer } from '@apollo/server'

import resolvers from '../..'
import typeDefs from '../../../types'

import {
  createAcl as aclSourceCreate,
  deleteAcl as aclSourceDelete,
  fetchAcl as aclSourceFetch,
  updateAcl as aclSourceUpdate
} from '../../../datasources/acl'
import {
  createAssociation as associationSourceCreate,
  deleteAssociation as associationSourceDelete
} from '../../../datasources/association'
import collectionDraftProposalSource from '../../../datasources/collectionDraftProposal'
import collectionDraftSource from '../../../datasources/collectionDraft'
import collectionVariableDraftsSource from '../../../datasources/collectionVariableDrafts'
import dataQualitySummarySource from '../../../datasources/dataQualitySummary'
import granuleSource from '../../../datasources/granule'
import graphDbDuplicateCollectionsSource from '../../../datasources/graphDbDuplicateCollections'
import graphDbSource from '../../../datasources/graphDb'
import gridSource from '../../../datasources/grid'
import maxItemsPerOrderSource from '../../../datasources/maxItemsPerOrder'
import permissionSource from '../../../datasources/permission'
import providerSource from '../../../datasources/provider'
import serviceDraftSource from '../../../datasources/serviceDraft'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../../datasources/subscription'
import tagDefinitionSource from '../../../datasources/tagDefinition'
import {
  deleteTool as toolSourceDelete,
  fetchTools as toolSourceFetch
} from '../../../datasources/tool'
import {
  deleteService as serviceSourceDelete,
  fetchServices as serviceSourceFetch
} from '../../../datasources/service'
import {
  deleteVariable as variableSourceDelete,
  fetchVariables as variableSourceFetch
} from '../../../datasources/variable'
import toolDraftSource from '../../../datasources/toolDraft'
import variableDraftSource from '../../../datasources/variableDraft'

import {
  deleteDraft as draftSourceDelete,
  fetchDrafts as draftSourceFetch,
  ingestDraft as draftSourceIngest,
  publishDraft as draftSourcePublish
} from '../../../datasources/draft'

import {
  deleteCollection as collectionSourceDelete,
  fetchCollections as collectionSourceFetch
} from '../../../datasources/collection'

import {
  deleteOrderOption as orderOptionSourceDelete,
  fetchOrderOption as orderOptionSourceFetch,
  ingestOrderOption as orderOptionSourceIngest
} from '../../../datasources/orderOption'

export const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const buildContextValue = (extraContext) => ({
  dataSources: {
    aclSourceCreate,
    aclSourceDelete,
    aclSourceFetch,
    aclSourceUpdate,
    associationSourceCreate,
    associationSourceDelete,
    collectionDraftProposalSource,
    collectionDraftSource,
    collectionSourceDelete,
    collectionSourceFetch,
    collectionVariableDraftsSource,
    dataQualitySummarySource,
    draftSourceDelete,
    draftSourceFetch,
    draftSourceIngest,
    draftSourcePublish,
    granuleSource,
    graphDbDuplicateCollectionsSource,
    graphDbSource,
    gridSource,
    maxItemsPerOrderSource,
    orderOptionSourceDelete,
    orderOptionSourceFetch,
    orderOptionSourceIngest,
    permissionSource,
    providerSource,
    serviceDraftSource,
    serviceSourceDelete,
    serviceSourceFetch,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    tagDefinitionSource,
    toolDraftSource,
    toolSourceDelete,
    toolSourceFetch,
    variableDraftSource,
    variableSourceDelete,
    variableSourceFetch
  },
  headers: {
    'Client-Id': 'eed-test-graphql',
    'CMR-Request-Id': 'abcd-1234-efgh-5678'
  },
  ...extraContext
})
