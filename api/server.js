var restify = require('restify');
var pg = require('pg');

const io25Geocoding = require('./io25Geocoding.js');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.gzipResponse());


server.get('/data/address/:address', function(req, res, next){
  next('all-zones');
});

server.get('/data/address/:address/:zone', function respond(req, res, next) {
  if(req.params.zone === 'garbage-collection-zones')
    next('garbage-collection-zones');
  if(req.params.zone === 'dog-walking-zones')
    next('dog-walking-zones');
});

server.get({
  name: 'garbage-collection-zones',
  path: '/data/address/:address/:zone'
}, function (req, res, next) {
  console.log('garbage-collection-zones');
  getGarbageCollectionZones(req.params.address, res, next);
});

server.get({
  name: 'dog-walking-zones',
  path: '/data/address/:address/:zone'
}, function (req, res, next) {
  console.log('dog-walking-zones');
  getDogWalkingZones(req.params.address, res, next);
});

server.get({
  name: 'all-zones',
  path: '/data/address/:address/:zone'
}, function (req, res, next) {
  console.log('all-zones');
  getAllZones(req.params.address, res, next);
});

server.get('/data/point/:lat/:long/garbage-collection-zones', function respond(req, res, next) {
  // var type = 'garbage-collection-zones'
  var type = 'test-bins';
  var point = req.params.long + ", " + req.params.lat;
  queryPGContains(type, point, res, next);
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});


function handlePGError(err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
}

function queryPG(type, point, res, next) {
  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var sql = 'select * from data';
    if(type)
      sql = sql + ` where type='${type}'`;
    sql = sql + ` order by ST_Distance(geometry, ST_MakePoint(${point}))`
              + ' limit 5;'
    console.log('sql query: ' + sql);

    client.query(sql, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      console.log('query returns row count: ' + result.rows.length);

      res.send(result.rows);
      next();
    });
  });

  pool.on('error', handlePGError);
}

function queryPGContains(type, point, res, next) {
  // to run a query we can acquire a client from the pool,
  // run a query on the client, and then return the client to the pool
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var sql = 'select ST_AsGeoJSON(geometry) as GeoJSON, payload from data';
    if(type)
      sql = sql + ` where type='${type}'`;
    sql = sql + ` and ST_Contains(geometry, ST_SetSRID(ST_MakePoint(${point}), 4326))`
              + ' limit 5;'
    console.log('sql query: ' + sql);

    client.query(sql, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      console.log('query returns row count: ' + result.rows.length);

      res.send(result.rows.map(row => {
        return { "geojson": JSON.parse(row.geojson), "payload": row.payload };
      }));
      next();
    });
  });

  pool.on('error', handlePGError);
}

function getGarbageCollectionZones(address, res, next) {
  console.log(address);

  io25Geocoding(address)
      .then(result => {
        console.log(result);
        var point = result.longitude + ', ' + result.latitude;
        var type = 'test-bins';
        queryPGContains(type, point, res, next);
      })
      .catch(error => {
        console.error(error);
        res.send(404);
        next();
      });
}

function getDogWalkingZones(address, res, next) {
  console.log(address);
  var point = '-37.94474, 145.22076';
  var type = 'dog-walking-zones'
  queryPG(type, point, res, next);
}

function getAllZones(address, res, next) {
  console.log(address);
  var point = '-37.94474, 145.22076';
  var type = ''
  queryPG(type, point, res, next);
}
