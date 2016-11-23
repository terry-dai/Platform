const CKAN = require('ckan')

exports.searchPackagesByTags = function searchPackagesByTags(tags) {
  return new Promise((resolve, reject) => {
    const client = new CKAN.Client('https://data.gov.au');

    const filterQuery = tags.join(' AND ')

    client.action('package_search', { fq: `tags:(${filterQuery})` }, function(err, body) {
      if(err) {
        reject(err)
      } else {
        resolve(body.result.results)
      }
    })
  })
}
