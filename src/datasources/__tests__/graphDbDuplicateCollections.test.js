import nock from 'nock'

import graphDbDuplicateCollectionsDatasource from '../graphDbDuplicateCollections'

import duplicatedCollectionsGraphdbResponseMocks from './__mocks__/duplicateCollections.graphdbResponse.mocks'
import duplicateCollectionsRelatedUrlTypeResponseMocks from './__mocks__/duplicateCollections.response.mocks'

describe('graphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('duplicate collections', () => {
    test('returns the parsed graphDb response', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/graphdb/)
        .reply(200, duplicatedCollectionsGraphdbResponseMocks)

      const response = await graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: {
            doi: 'mock doi'
          }
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )

      expect(response).toEqual(duplicateCollectionsRelatedUrlTypeResponseMocks)
    })

    test('returns 0 collections when doi doesn\'t exist', async () => {
      const response = await graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: null
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )

      expect(response).toEqual({
        count: 0,
        items: []
      })
    })
  })

  test('catches errors received from queryCmrTools', async () => {
    nock(/example/)
      .post(/tools/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: {
            doi: 'mock doi'
          }
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )
    ).rejects.toThrow(Error)
  })
})
