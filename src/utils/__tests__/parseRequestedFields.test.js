import { parseRequestedFields } from '../parseRequestedFields'

const ummKeyMappings = {
  conceptId: 'meta.concept-id',
  keyOne: 'umm.KeyOne',
  keyTwo: 'umm.KeyTwo'
}

const keyMap = {
  sharedKeys: [
    'conceptId',
    'keyOne'
  ],
  ummKeyMappings
}

describe('parseRequestedFields', () => {
  describe('only json keys requested', () => {
    test('returns only json keys', () => {
      const requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Collection: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyThree: {
                    name: 'keyThree',
                    alias: 'keyThree',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId', 'keyThree'],
        metaKeys: [],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('only umm keys requested', () => {
    test('returns only umm keys', () => {
      const requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Collection: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyTwo: {
                    name: 'keyTwo',
                    alias: 'keyTwo',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: [],
        metaKeys: [],
        ummKeys: ['conceptId', 'keyTwo'],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('both json and umm keys requested', () => {
    test('returns both json and umm keys optimized for json', () => {
      const requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Collection: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyOne: {
                    name: 'keyOne',
                    alias: 'keyOne',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyTwo: {
                    name: 'keyTwo',
                    alias: 'keyTwo',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyThree: {
                    name: 'keyThree',
                    alias: 'keyThree',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId', 'keyOne', 'keyThree'],
        metaKeys: [],
        ummKeys: ['keyTwo'],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('only count', () => {
    test('returns only conceptId', () => {
      const requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            count: {
              name: 'count',
              alias: 'count',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId'],
        metaKeys: ['collectionCount'],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('nested with only count', () => {
    test('returns only the concept for the child and not conceptId', () => {
      const requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            count: {
              name: 'count',
              alias: 'count',
              args: {},
              fieldsByTypeName: {}
            },
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Collection: {
                  granules: {
                    name: 'granules',
                    alias: 'granules',
                    args: {},
                    fieldsByTypeName: {
                      GranuleList: {
                        count: {
                          name: 'count',
                          alias: 'count',
                          args: {},
                          fieldsByTypeName: {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId', 'granules'],
        metaKeys: ['collectionCount'],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('only cursor', () => {
    test('returns only conceptId', () => {
      const requestInfo = {
        name: 'tests',
        alias: 'tests',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId'],
        metaKeys: ['collectionCursor'],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('when granules are requested from within a collection without conceptId', () => {
    test('requestedFields includes conceptId', () => {
      const requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Collection: {
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  granules: {
                    name: 'granules',
                    alias: 'granules',
                    args: {},
                    fieldsByTypeName: {
                      GranuleList: {
                        count: {
                          name: 'count',
                          alias: 'count',
                          args: {},
                          fieldsByTypeName: {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'collection')

      expect(requestedFields).toEqual({
        jsonKeys: ['title', 'granules', 'conceptId'],
        metaKeys: [],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })
})
