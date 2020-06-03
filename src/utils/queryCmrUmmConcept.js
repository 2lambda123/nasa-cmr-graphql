import { pick } from 'lodash'

import { queryCmr } from './queryCmr'

export const queryCmrUmmConcept = (
  conceptType,
  permittedSearchParams,
  headers,
  requestInfo
) => {
  // Default an array to hold the promises we need to make depending on the requested fields
  const promises = []
  const {
    jsonKeys,
    metaKeys = [],
    ummKeys
  } = requestInfo
  const { 'CMR-Request-ID': requestId } = headers

  metaKeys.forEach((param) => {
    console.log(`Request ${requestId} to [concept: ${conceptType}] requested [format: meta, key: ${param}]`)
  })

  if (jsonKeys.length > 0) {
    // Construct the promise that will request data from the json endpoint
    promises.push(
      queryCmr(conceptType, permittedSearchParams, headers)
    )

    jsonKeys.forEach((param) => {
      console.log(`Request ${requestId} to [concept: ${conceptType}] requested [format: json, key: ${param}]`)
    })
  } else {
    // Push a null promise to the array so that the umm promise always exists as
    // the second element of the promise array
    promises.push(
      new Promise((resolve) => resolve(null))
    )
  }

  // If any requested keys are umm keys, we need to make an additional request to cmr
  if (ummKeys.length > 0) {
    const ummPermittedKeys = pick(permittedSearchParams, ['concept_id'])

    // Construct the promise that will request data from the umm endpoint
    promises.push(
      queryCmr(conceptType, ummPermittedKeys, headers, {
        format: 'umm_json'
      })
    )

    ummKeys.forEach((param) => {
      console.log(`Request ${requestId} to [concept: ${conceptType}] requested [format: umm, key: ${param}]`)
    })
  } else {
    promises.push(
      new Promise((resolve) => resolve(null))
    )
  }

  return Promise.all(promises)
}
