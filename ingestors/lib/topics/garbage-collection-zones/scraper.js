const gov = require('../../clients/data-dot-gov')
const request = require('request-promise')

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
  const keywords = ['collection', 'zones']

  return fields.some(field =>
    keywords.some(keyword =>
      pkg[field].toLowerCase().indexOf(keyword.toLowerCase()) > -1
    )
  )
}

function getGeoJson(pair) {
  return request({ uri: pair.resource.url, json: true }).then(geoJson => ({
    package: pair.package,
    resource: pair.resource,
    geoJson: geoJson
  }))
}

exports.scrape = function scrape() {
  return gov.searchPackagesByTags(['garbage'])
    .then(pkgs => pkgs
      .filter(isUsefulPackage)
      .map(pkg => ({ package: pkg, resource: selectResourceForPackage(pkg) }))
      .filter(pair => !!pair.resource)
      .map(pair => getGeoJson(pair)))
    .then(promises => Promise.all(promises))
}
