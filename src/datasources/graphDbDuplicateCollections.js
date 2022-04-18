import {
  chunk,
  isObject
} from 'lodash'

import { cmrGraphDb } from '../utils/cmrGraphDb'

/**
 * Queries CMR GraphDB for duplicate collections.
 * @param {String} collection Collection metadata for the initial collection to find duplicates.
 * @param {String} headers Headers to be passed to CMR.
 */
export default async (
  collection,
  headers
) => {
  const {
    conceptId,
    doi,
    shortName
  } = collection

  const { doi: doiDescription } = doi || {}

  // If doi or shorName don't exist, return 0 duplicateCollections
  if (!doiDescription || !shortName) {
    return {
      count: 0,
      items: []
    }
  }

  const query = JSON.stringify({
    gremlin: `
    g
    .V()
    .not(
      __.has('collection', 'id', '${conceptId}')
    )
    .has('collection', 'shortName', '${shortName}')
    .has('collection', 'doi', '${doiDescription}')
    .valueMap(true)
    `
  })

  const { data } = await cmrGraphDb({
    conceptId,
    headers,
    query
  })

  const { result } = data

  // Useful for debugging!
  // console.log('GraphDB query', JSON.parse(query))
  // console.log('GraphDB Response result: ', JSON.stringify(result, null, 2))

  const duplicateCollections = []

  const { data: resultData } = result
  const { '@value': dataValues } = resultData

  const duplicateCollectionsCount = dataValues.length

  dataValues.forEach((dataValue) => {
    const duplicateCollectionValues = {}

    const { '@value': dataValueMap } = dataValue

    const collectionVertexPairs = chunk(dataValueMap, 2)
    collectionVertexPairs.forEach((pair) => {
      const [key, value] = pair

      if (isObject(key)) {
        return
      }

      const { '@value': collectionVertexValueMap } = value

      const [collectionVertexValue] = collectionVertexValueMap
      duplicateCollectionValues[key] = collectionVertexValue
    })

    duplicateCollections.push(duplicateCollectionValues)
  })

  const returnObject = {
    count: duplicateCollectionsCount,
    items: duplicateCollections
  }

  // Useful for debugging!
  // console.log('graphDb.js response', JSON.stringify(returnObject, null, 2))

  return returnObject
}
