# Open Council

**Work in Progress**

Provide a unified view on open council data of Australian government.

This project aims to provide a unified view on open government data provided by the Australian government. It reads data from various sources and hosts them in a unified format off a single API endpoint.

## API

Documentation to follow...

## Deploy

This project runs on AWS.

### Infrastructure

- Ingestor EC2 Instance
- API EC2 Instance
- PostgreSQL Database with GIS extension
 - `psql --host=db-open-council-data-platform.cjcfydfeltyw.ap-southeast-2.rds.amazonaws.com --username=master  --dbname=db_open_council_data`

### Folder Structure

- `ingestors` contains a nodejs project for scraping data, and an `index.js` file that triggers all of the scrapers sequentially
  - The scrapers/loaders are categorised by topic (eg: dog walking)
  - For each topic, the scrapers pull data from one or more data sources, and pass them to the loaders, which save the data into the PostGIS database in a common format, using [Open Council Data Standards](http://standards.opencouncildata.org/) where possible
- API contains the code to run the API which serves the data from that PostGIS database

### PostGIS Table Structure

`| type | geometry | date | payload |`

- Type: Type of the data (e.g. "dogs", "bins")
- Geometry: PostGIS-format geometry data
- Date: Date Last Updated (in order to perform "updateded since" queries)
- Payload: Data in Open Council Data Standard Format

## License

Read [LICENSE](LICENSE) file
