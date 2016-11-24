const scrape = require('./scraper').scrape
const transform = require('./transformer').transform
const load = require('./loader').load

function run() {
  return scrape().then(transform).then(load).catch(err => {
    console.log('Failed to ETL dog-walking-zones: ', err)
    return Promise.reject(err)
  })
}

exports.run = run
