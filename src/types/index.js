import { mergeTypeDefs } from '@graphql-tools/merge'

import collection from './collection.graphql'
import collectionDraft from './collectionDraft.graphql'
import collectionDraftProposal from './collectionDraftProposal.graphql'
import granule from './granule.graphql'
import grid from './grid.graphql'
import json from './json.graphql'
import service from './service.graphql'
import subscription from './subscription.graphql'
import tool from './tool.graphql'
import variable from './variable.graphql'
import orderOption from './orderOption.graphql'

export default mergeTypeDefs(
  [
    collection,
    collectionDraft,
    collectionDraftProposal,
    granule,
    grid,
    json,
    orderOption,
    service,
    subscription,
    tool,
    variable
  ],
  { all: true },
)
