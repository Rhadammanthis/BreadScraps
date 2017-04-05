import request from 'request'

function HomeCtrl($q, $cookies) {
  'ngInject';

  // ViewModel
  const vm = this;

  var accesToken;

  vm.$onInit = () => {
    accesToken = $cookies.get('bs.spotify_acces_token') ? $cookies.get('bs.spotify_acces_token') : null
    console.log('token',accesToken)
  }

  vm.loadPatients = () => {
    const deferred = $q.defer();

    var options = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/search',
      qs: { q: vm.search, type: 'artist' }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      vm.artists = JSON.parse(body).artists.items

      console.log(JSON.parse(body).artists.items);
      deferred.resolve();
    });

    // deferred.resolve();

    return deferred.promise;
  }

  vm.logToSpotify = () => {
    console.log('yey!')
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent('749748f5ea93499ea4177c896e6adef8');
    url += '&redirect_uri=' + encodeURIComponent('http://localhost:3000/auth');
    url += '&state=' + encodeURIComponent('q897yeo');

    window.location.replace(url);
  }

}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
