const expect = require('chai').expect
const mockery = require('mockery')

global.expect = expect

before(() => {
  mockery.enable();
})

afterEach(() => {
  mockery.deregisterAll();
})

after(() => {
  mockery.disable();
})
