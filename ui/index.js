(function() {
  'use strict';

  const apiUrl = document.getElementById('api-url');
  const location = document.getElementById('location');
  const searchButton = document.getElementById('search-button');
  const result = document.getElementById('result-text');

  searchButton.onclick = e => {
    e.preventDefault();
    result.innerText = `${apiUrl.value}/data/address/${location.value}`;
  };
}());
