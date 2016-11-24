(function() {
  'use strict';

  const apiUrl = document.getElementById('api-url');
  const location = document.getElementById('location');
  const searchButton = document.getElementById('search-button');
  const result = document.getElementById('result-text');

  searchButton.onclick = e => {
    e.preventDefault();

    const resourceUrl = `${apiUrl.value}/data/address/${location.value}`;
    fetch(resourceUrl)
      .then(res => {
        if (res.ok) return res.json()
        else throw res
      })
      .then(res => {
        result.innerText = JSON.stringify(res, null, 2);
      })
      .catch(err => {
        console.error(err);
        result.innerText = `Status: ${err.status}.`;
      });
  };
}());
