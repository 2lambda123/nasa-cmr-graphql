import nock from 'nock'

import granuleDatasource from '../granule'

let requestInfo

describe('granule', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'granules',
      alias: 'granules',
      args: {},
      fieldsByTypeName: {
        GranuleList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Granule: {
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
                  args: {},
                  fieldsByTypeName: {}
                }
              }
            }
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('cursor', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {}
            },
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  dayNightFlag: {
                    name: 'dayNightFlag',
                    alias: 'dayNightFlag',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns a cursor', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-29834750'
        })
        .post(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC',
              day_night_flag: 'UNSPECIFIED'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-98726357'
        })
        .post(/granules\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        })

      const response = await granuleDatasource({ cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=',
        items: [{
          conceptId: 'G100000-EDSC',
          dayNightFlag: 'UNSPECIFIED',
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
    })

    describe('when a cursor is requested', () => {
      test('requests a cursor', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-29834750'
          })
          .post(/granules\.json/, 'scroll=true')
          .reply(200, {
            feed: {
              entry: [{
                id: 'G100000-EDSC',
                day_night_flag: 'UNSPECIFIED'
              }]
            }
          })

        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/granules\.umm_json/, 'scroll=true')
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'G100000-EDSC'
              },
              umm: {
                GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
              }
            }]
          })

        const response = await granuleDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=',
          items: [{
            conceptId: 'G100000-EDSC',
            dayNightFlag: 'UNSPECIFIED',
            granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
          }]
        })
      })
    })

    describe('when a cursor returns no results', () => {
      test('calls CMR to clear the scroll session', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 0,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-29834750'
          })
          .post(/granules\.json/, 'scroll=true')
          .reply(200, {
            feed: {
              entry: []
            }
          })

        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 0,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/granules\.umm_json/, 'scroll=true')
          .reply(200, {
            items: []
          })

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-29834750' })
          .reply(204)

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-98726357' })
          .reply(204)

        const response = await granuleDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

        expect(response).toEqual({
          count: 0,
          cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=',
          items: []
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed granule results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        })

      const response = await granuleDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'G100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed granule results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        })

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'G100000-EDSC'
        }]
      })
    })
  })

  describe('with linkTypes parameter', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  links: {
                    name: 'links',
                    alias: 'links',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns filtered links', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              links: [{
                href: 'https://example.com/data_link',
                hreflang: 'en-US',
                rel: 'https://example.com/data#',
                type: 'application/x-hdf5'
              }, {
                href: 'https://example.com/metadata_link',
                hreflang: 'en-US',
                rel: 'https://example.com/metadata#',
                type: 'application/x-hdf5'
              }, {
                href: 'https://example.com/s3_link',
                hreflang: 'en-US',
                rel: 'https://example.com/s3#',
                type: 'application/x-hdf5'
              }]
            }]
          }
        })

      const response = await granuleDatasource(
        {
          collectionConceptId: 'C100000-EDSC',
          linkTypes: ['data', 's3']
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        requestInfo,
        'granule'
      )

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          links: [{
            href: 'https://example.com/data_link',
            hreflang: 'en-US',
            rel: 'https://example.com/data#',
            type: 'application/x-hdf5'
          }, {
            href: 'https://example.com/s3_link',
            hreflang: 'en-US',
            rel: 'https://example.com/s3#',
            type: 'application/x-hdf5'
          }]
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  browseFlag: {
                    name: 'browseFlag',
                    alias: 'browseFlag',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns the parsed granule results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC',
              browse_flag: true
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        })

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'G100000-EDSC',
          browseFlag: true,
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  temporalExtent: {
                    name: 'temporalExtent',
                    alias: 'temporalExtent',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns the parsed granule results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        })

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
    })
  })

  test('catches errors received from queryCmrGranules', async () => {
    nock(/example/)
      .post(/granules/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      granuleDatasource({ conceptId: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')
    ).rejects.toThrow(Error)
  })
})
