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

### Folder Structure

- Ingestors contains one folder for each ingestor and one `index.js` that triggers all of them
  - Ingestors load data from a specific source into the PostGIS in [Open Council Data Standard](http://standards.opencouncildata.org/) format
- API contains the code to run the API which serves the data form that PostGIS

### PostGIS Table Structure

`| type | geometry | date | payload |`

- Type: Type of the data (e.g. "dogs", "bins")
- Geometry: PostGIS-format geometry data
- Date: Date Last Updated (in order to perform "updateded since" queries)
- Payload: Data in Open Council Data Standard Format

## License

Read [LICENSE](LICENSE) file
