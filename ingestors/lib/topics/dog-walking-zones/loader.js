const pg = require('pg')

const host = 'db-open-council-data-platform.cjcfydfeltyw.ap-southeast-2.rds.amazonaws.com'
const port = 5432
const user = 'master'
const database = 'db_open_council_data'
const password = process.env.PGPASSWORD

const config = {
  user: user,
  password: password,
  host: host,
  database: database,
  port: port
}

const insertQuery = `
  INSERT INTO DATA(type, geometry, date, payload)
  VALUES ($1::text, ST_GeomFromGeoJSON($2::text), $3::timestamp, $4::text)
`

function insertResult(client, package, resource, geoJson) {
  geoJson.features.forEach(feature => {
    const args = [
      'dog-walking-zones',
      JSON.stringify(feature.geometry),
      resource.last_modified,
      JSON.stringify(feature.properties)
    ]

    console.log("INSERT:", args)

    client.query(insertQuery, args, (err, result) => {
      if (err) throw err
    })
  })
}

exports.load = function(results) {
  const client = new pg.Client(config)

  client.connect(err => {
    if (err) throw err

    results.forEach(result => {
      insertResult(client, result.package, result.resource, result.geoJson)
    })

    client.end(err => {
      if (err) throw err
    })
  })
}
