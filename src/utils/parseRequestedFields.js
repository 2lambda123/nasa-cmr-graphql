import { difference, isEmpty, upperFirst } from 'lodash'

/**
 * Construct an object defining UMM key information
 * @param {Array} requestedFields Fields requested
 * @param {Object} keyMap Mappings of UMM fields to requestable fields
 * @param {String} conceptName Name of the concept () to lookup requested fields in the query
 */
export const parseRequestedFields = (parsedInfo, keyMap, conceptName) => {
  let { fieldsByTypeName } = parsedInfo
  const { name } = parsedInfo

  let isList = false
  const metaKeys = []
  let requestedFields = []

  // Name will match the query, if the query is plural we have a slightly different
  // response and we need to handle it
  if (name.slice(-1) === 's') {
    isList = true

    const {
      [`${upperFirst(conceptName.toLowerCase())}List`]: conceptListKeysRequested
    } = fieldsByTypeName
    const { count, items = {} } = conceptListKeysRequested

    fieldsByTypeName = items.fieldsByTypeName

    // If the user requested `count` and no other fields, default the requested fields
    // to convince graph that it should still make a request
    if (count && isEmpty(items)) {
      requestedFields = ['conceptId']
    }

    // Track meta keys for analytics on how often they are requested
    if (count) metaKeys.push(`${conceptName.toLowerCase()}Count`)
  }

  // If a plural query is being performed, and the user has not requested any
  // fields (e.g. only count) then fieldsByTypeName will be undefined and we can ignore it
  if (fieldsByTypeName) {
    const {
      [upperFirst(conceptName.toLowerCase())]: conceptKeysRequested
    } = fieldsByTypeName

    requestedFields = Object.keys(conceptKeysRequested)
  }

  const ummTypes = ['collections', 'granules', 'services', 'variables']
  requestedFields = requestedFields.filter((field) => ummTypes.indexOf(field) === -1)

  const { sharedKeys, ummKeyMappings } = keyMap

  // Gather keys that the user requested that only exist in umm
  let ummKeys = requestedFields.filter((x) => (
    Object.keys(ummKeyMappings).includes(x)
  ))

  // If all requested keys are available in json, use json because its all indexed in CMR
  if (difference(ummKeys, sharedKeys).length === 0) {
    return {
      jsonKeys: requestedFields,
      metaKeys,
      ummKeys: [],
      ummKeyMappings,
      isList
    }
  }

  // Requested keys that are not UMM must be json
  const jsonKeys = requestedFields.filter((x) => !ummKeys.includes(x))

  // If we already have to go to the json endpoint get as much info from there as possible
  if (jsonKeys.length > 0) {
    // Move any requested key that is shared over to the jsonKeys
    ummKeys.forEach((ummKey) => {
      const keyLocation = sharedKeys.indexOf(ummKey)

      if (keyLocation > -1) jsonKeys.push(ummKey)
    })

    // Remove any keys that we moved over to jsonKeys
    ummKeys = ummKeys.filter((x) => !jsonKeys.includes(x))
  }

  // Sort the keys to prevent fragility in testing
  return {
    jsonKeys: jsonKeys.sort(),
    metaKeys,
    ummKeys: ummKeys.sort(),
    ummKeyMappings,
    isList
  }
}
