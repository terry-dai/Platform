const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

geocoder.geocode('511 Church St, VIC 3121')
  .then(function(res) {
    console.log('geocode lazy');
    console.log(res);
    console.log('-------');
  })
  .catch(function(err) {
    console.log(err);
  });

geocoder.geocode({
    state: 'Victoria',
    postalcode: '3121',
    street: '511 Church Street',
  })
  .then(function(res) {
    console.log('geocode object');
    console.log(res);
    console.log('-------');
  })
  .catch(function(err) {
    console.log(err);
  });

// geocoder.reverse({lat:-37.8288688, lon:144.9973862})
//   .then(function(res) {
//     console.log('reverse');
//     console.log(res);
//     console.log('-------');
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
// =>
// country: 'Australia',
// city: undefined,
// state: 'Victoria',
// zipcode: '3131',
// streetName: 'Church Street',
// streetNumber: '527',
// countryCode: 'AU',
