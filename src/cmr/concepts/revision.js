import Concept from './concept'

export default class Revision extends Concept {
  /**
   * Instantiates an Revision object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    // This concept uses the "-" character to delineate spaces in CMR we must pass it
    // in this form to fetch order option concepts from CMR
    super('tools', headers, requestInfo, params)
  }

  /**
   * Parse and return the array of data from the nested response body
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   */
  parseJsonBody(jsonResponse) {
    console.log('REVISON CONCEPT PARSEJSON')
    const { data } = jsonResponse

    const { items } = data

    return items
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} headers Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    // TODO: When generics support versioning we need to update this concept
    const ummHeaders = {
      ...headers,
      Accept: 'application/vnd.nasa.cmr.umm_results+json'
    }
    const ummResponse = super.fetchUmm(searchParams, ummKeys, ummHeaders)

    return ummResponse
  }
}
