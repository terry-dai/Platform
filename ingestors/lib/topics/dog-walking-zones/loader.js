const _ = require('lodash')

const host = 'db-open-council-data-platform.cjcfydfeltyw.ap-southeast-2.rds.amazonaws.com'
const port = 5432
const user = 'master'
const database = 'db_open_council_data'
const password = process.env.PGPASSWORD

const postgres = require('pg-promise')();
const config = {
  user: user,
  password: password,
  host: host,
  database: database,
  port: port
}

const insertQuery = `
  INSERT INTO DATA(type, geometry, date, payload, source_uri)
  VALUES ($1::text, ST_transform(ST_GeomFromGeoJSON($2::text), 4326), $3::timestamp, $4::json, $5::text)
`

function insertFeature(db, pkg, resource, geoJson, feature) {
  const geometryWithFormat = _.assign({}, feature.geometry, { crs: geoJson.crs })

  const args = [
    'dog-walking-zones',
    JSON.stringify(geometryWithFormat),
    resource.last_modified,
    JSON.stringify(feature.properties),
    resource.url
  ]

  console.log("INSERT:", args)

  return db.none(insertQuery, args)
}

function insertFeatures(db, pkg, resource, geoJson) {
  const p = Promise.resolve(null)

  geoJson.features.forEach(feature => {
    p = p.then(() => {
      console.log(`Inserting feature ${feature.id}`)
      return insertFeature(db, pkg, resource, geoJson, feature)
    })
  })

  return p
}

// TODO: Upsert / Duplicate detection

exports.load = function(results) {
  const db = postgres(config)

  const p = Promise.resolve(null)

  results.forEach(result => {
    p = p.then(() => {
      console.log(`Inserting resource ${result.resource.id} for package ${result.package.id}`)
      return insertFeatures(db, result.package, result.resource, result.geoJson)
    })
  })

  return p
}
