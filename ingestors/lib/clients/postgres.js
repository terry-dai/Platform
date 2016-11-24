const pgp = require('pg-promise')();
const config = {
  user: 'master',
  password: process.env.PGPASSWORD,
  host: 'db-open-council-data-platform.cjcfydfeltyw.ap-southeast-2.rds.amazonaws.com',
  database: 'db_open_council_data',
  port: 5432
}

exports.connect = function connect() {
  return pgp(config)
}
