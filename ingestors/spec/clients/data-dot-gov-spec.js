'use strict'

const mockery = require('mockery')

describe('lib/clients/data-dot-gov', () => {
  let client, ckanMockClient

  beforeEach(() => {
    const responseBody = {
      result: {
        results: [1,2,3]
      }
    }

    const ckanMock = {
      Client: function Client(url) {
        ckanMockClient = this
        this.url = url
        this.action = function(actionName, actionArgs, actionCallback) {
          this.actionName = actionName
          this.actionArgs = actionArgs
          actionCallback(null, responseBody)
        }
      }
    }

    mockery.registerAllowable('../../lib/clients/data-dot-gov')
    mockery.registerMock('ckan', ckanMock)

    client = require('../../lib/clients/data-dot-gov')
  })

  describe('searchPackagesByTags', () => {
    it('creates a data.gov client', () => {
      return client.searchPackagesByTags(['foo']).then(() => {
        expect(ckanMockClient.url).to.eq('https://data.gov.au')
      })
    })

    it('searches for packages by a single tag', () => {
      return client.searchPackagesByTags(['cat']).then(pkgs => {
        expect(ckanMockClient.actionArgs).to.eql({ fq: `tags:(cat)` })
      })
    })

    it('searches for multiple tags by ANDing them', () => {
      return client.searchPackagesByTags(['cat', 'cat-walking']).then(pkgs => {
        expect(ckanMockClient.actionArgs).to.eql({ fq: `tags:(cat AND cat-walking)` })
      })
    })

    it('returns a list of results', () => {
      return client.searchPackagesByTags(['cat cat-walking']).then(pkgs => {
        expect(pkgs).to.eql([1,2,3])
      })
    })
  })
})
