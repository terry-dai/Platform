const gov = require('../../clients/data-dot-gov')
const request = require('request-promise')

const keywords = ['walk', 'zones', 'off leash']

function isDefinitelyGeoJson(resource) {
  return resource.format.toLowerCase() == 'geojson'
}

function isProbablyGeoJson(resource) {
  const isJson = resource.format.toLowerCase() == 'json'
  const geoName = resource.name.toLowerCase().indexOf('geojson') > -1
  const geoDescription = resource.description.toLowerCase().indexOf('geojson') > -1

  return isJson && (geoName || geoDescription)
}

function isUsefulResource(resource) {
  return isDefinitelyGeoJson(resource) || isProbablyGeoJson(resource)
}

function selectResourceForPackage(pkg) {
  const useful = pkg.resources.filter(resource => isUsefulResource(resource))

  return useful.length ? useful[0] : null
}

function isUsefulPackage(pkg) {
  const fields = ['name', 'notes', 'title']

  return fields.some(field =>
    keywords.some(keyword =>
      pkg[field].toLowerCase().indexOf(keyword.toLowerCase()) > -1
    )
  )
}

function logAcquiredResources(pairs) {
  pairs.forEach(pair => {
    console.log(`Aquired "${pair.resource.name}" for "${pair.package.title}"`)
  })
  return pairs;
}

function getGeoJson(pair) {
  return request({ uri: pair.resource.url, json: true }).then(geoJson => ({
    package: pair.package,
    resource: pair.resource,
    geoJson: geoJson
  }))
}

/*
 * Returns a promise of a list of { package, resource, geoJson }
 */
function scrape() {
  return gov.searchPackagesByTags(['dog'])
    .then(pkgs => pkgs.filter(pkg => isUsefulPackage(pkg)))
    .then(pkgs => pkgs
      .map(pkg => ({ package: pkg, resource: selectResourceForPackage(pkg) }))
      .filter(pair => !!pair.resource)
      .map(pair => getGeoJson(pair)))
    .then(promises => Promise.all(promises))
}

exports.scrape = scrape
