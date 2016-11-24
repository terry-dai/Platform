const scrape = require('./scraper').scrape
const transform = require('./transformer').transform
const load = require('./loader').load

function run() {
  return scrape().then(transform).then(load).then(() => {
    console.log('Successfully ETL\'d garbage-collection-zones:')
  }).catch(err => {
    console.log('Failed to ETL garbage-collection-zones: ', err)
    return Promise.reject(err)
  })
}

exports.run = run
