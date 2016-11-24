var restify = require('restify');


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
    console.log('garbage-collection-zones')
    res.send([{
      rub_day: 'monday'
    }]);
    next();
});

server.get({
    name: 'dog-walking-zones',
    path: '/data/address/:address/:zone'
}, function (req, res, next) {
    console.log('dog-walking-zones')
    res.send([{
      status: 'offleash'
    }]);
    next();
});

server.get({
    name: 'all-zones',
    path: '/data/address/:address/:zone'
}, function (req, res, next) {
    console.log('all-zones');
    res.send({
      garbage_collection_zones: [],
      dog_walking_zones: []
    });
    next();
});


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
