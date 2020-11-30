import nock from 'nock'

import { cmrDelete } from '../cmrDelete'

describe('cmrDelete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('deletes a record from cmr', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example/, {
      reqheaders: {
        Accept: 'application/json',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .delete(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
      .reply(201, {
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

    const response = await cmrDelete(
      'subscriptions',
      {
        conceptId: 'SUB100000-EDSC',
        nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
      },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
    )

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = headers

    expect(data).toEqual({
      'concept-id': 'SUB100000-EDSC',
      'revision-id': 1
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 to [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a token via the Echo-Token header', () => {
    test('queries cmr using the Echo-Token header', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'Echo-Token': 'test-token'
        }
      })
        .delete(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrDelete(
        'subscriptions',
        {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678', 'Echo-Token': 'test-token' }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = headers

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries cmr using the Authorization header', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
        }
      })
        .delete(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrDelete(
        'subscriptions',
        {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
        }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = headers

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Authorization header and the Echo-Token header', () => {
    test('queries cmr using the Authorization header', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'authorization-token'
        }
      })
        .delete(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrDelete(
        'subscriptions',
        {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'authorization-token',
          'Echo-Token': 'echo-token'
        }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = headers

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .delete(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrDelete(
        'subscriptions',
        {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )

      await expect(response).rejects.toThrow()
    })
  })
})
