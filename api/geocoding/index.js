'use strict';

const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(options);


const inputs = [
  '511+Church+St%2C+Richmond%2C+VIC+3121',
  '1%2F511+Church+St%2C+Richmond%2C+VIC+3121'
];

const cleanAddress = input => {
  let address = input;

  address = decodeURIComponent(address);

  // Clean "+" instead of space usage
  address = address.replace(/\+/g, ' ');

  // Remove house number
  if (address.match(/\d+\/\d+/)) {
    address = address.split('/')[1];
  }

  // Remove suburb, which confuses OSM
  address = address.split(',');
  address = address[0] + ',' + address[2];

  return address;
};

inputs.forEach(input => {
  const address = cleanAddress(input);

  geocoder.geocode(address)
    .then(function(res) {
      console.log('geocode: ' + address);
      console.log(res);
      console.log('-------');
    })
    .catch(function(err) {
      console.log(err);
    });
});

// geocoder.geocode({
//     state: 'Victoria',
//     postalcode: '3121',
//     street: '511 Church Street',
//   })
//   .then(function(res) {
//     console.log('geocode object');
//     console.log(res);
//     console.log('-------');
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

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
