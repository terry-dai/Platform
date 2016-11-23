const gov = require('../../clients/data-dot-gov')

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

function acquireResource(pkg, resource) {
  console.log(`Aquired "${resource.name}" for "${pkg.title}"`)
}

gov.searchPackagesByTags(['dog'])
  .then(pkgs => pkgs.filter(pkg => isUsefulPackage(pkg)))
  .then(pkgs => pkgs
    .map(pkg => ({ package: pkg, resource: selectResourceForPackage(pkg) }))
    .filter(pair => !!pair.resource))
  .then(pairs => {
    pairs.forEach(pair => {
      acquireResource(pair.package, pair.resource)
    })
  }).catch(error => {
    console.log(error)
  })
