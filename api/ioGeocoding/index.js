'use strict';

/*

  # Sample Usage:

  const ioGeocoding = require('ioGeocoding');
  ioGeocoding
    .then(result => console.log(result))
    .catch(error => console.error(error));


  # Result Format Sample:

  {
    latitude: -37.828392885,
    longitude: 144.997581858333,
    country: 'Australia',
    city: undefined,
    state: 'Victoria',
    zipcode: '3131',
    streetName: 'Church Street',
    streetNumber: '511',
    countryCode: 'AU',
    provider: 'openstreetmap'
  }

*/

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
