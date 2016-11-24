'use strict';

const nodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap'
};
const geocoder = nodeGeocoder(options);

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

const main = input => {
  const address = cleanAddress(input);
  return geocoder.geocode(address).then(res => res[0])
}

module.exports = main;

// DEBUG
[
  '511+Church+St%2C+Richmond%2C+VIC+3121',
  '1%2F511+Church+St%2C+Richmond%2C+VIC+3121'
]
  .map(main)
  .forEach(promise => {
    promise
      .then(console.log)
      .catch(console.error);
  });
