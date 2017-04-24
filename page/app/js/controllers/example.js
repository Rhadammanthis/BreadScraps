import request from 'request';
import firebase from 'firebase';

function HomeCtrl($q, $cookies, $scope, $anchorScroll, $mdToast, $window) {
  'ngInject';

  // ViewModel
  const vm = this;
  vm.artists;
  vm.sadSongs;
  vm.artistRequested = true
  vm.loading = false;
  vm.showRefreshButton = false
  vm.showPlayer = false
  vm.accesToken = null
  vm.counter = 0

  vm.songId = "63hHlajVLQnlFMAqSyePxO"

  var accesToken;
  var refreshToken;
  var sadRequest = { id: '', name: '' }

  vm.$onInit = () => {
    accesToken = $cookies.get('bs.spotify_acces_token') ? $cookies.get('bs.spotify_acces_token') : null
    refreshToken = $cookies.get('bs.spotify_refresh_token') ? $cookies.get('bs.spotify_refresh_token') : null
    vm.accesToken = accesToken
  }

  vm.searchArtist = () => {
    const deferred = $q.defer();

    var options = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/search',
      qs: { q: vm.search, type: 'artist' }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      $scope.$apply(() => {

        vm.artists = JSON.parse(body).artists.items
        vm.artistRequested = true;
        $anchorScroll('songs-container');

        deferred.resolve();

      })


    });

    return deferred.promise;
  }

  vm.loadSaddestSongs = (id, name) => {

    sadRequest.id = id;
    sadRequest.name = name

    vm.loading = true;
    vm.sadSongs = [];

    var options = {
      method: 'POST',
      url: 'https://bs.hugomedina.me/api/getSaddestSongs',
      form: {
        spotifyToken: accesToken,
        artistId: id,
        artistName: name,
        // factor_no_lyrics: true,
        // thorough_analysis: true,
        // analyse_set_size: 20
      },
      headers: {
        'Origin': 'https://bread-scraps.firebaseapp.com'
      }
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);

      console.log(JSON.parse(body))
      if (JSON.parse(body).error) {
        if (JSON.parse(body).error.status == 401) {
          console.log('no no')
          $scope.$apply(() => {
            vm.loading = false;
            vm.showRefreshButton = true;
          })
        }
      }
      else {
        $scope.$apply(() => {
          console.log(body)
          vm.sadSongs = JSON.parse(body)
          vm.loading = false;
          vm.showRefreshButton = false;
        })
      }

    });
  }

  vm.logToSpotify = () => {
    console.log('yey!')
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent('749748f5ea93499ea4177c896e6adef8');
    url += '&redirect_uri=' + encodeURIComponent('https://bread-scraps.firebaseapp.com/auth');
    url += '&state=' + encodeURIComponent('q897yeo');

    window.location.replace(url);
  }

  vm.refreshToken = () => {

    vm.showRefreshButton = true;
    vm.loading = true;

    var options = {
      method: 'POST',
      url: 'https://bs.hugomedina.me/api/refresh',
      form: {
        token: refreshToken
      },
      headers: {
        'Origin': 'https://bread-scraps.firebaseapp.com'
      }
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);

      $scope.$apply(() => {

        var parsedResponse = JSON.parse(body)
        $cookies.put('bs.spotify_acces_token', parsedResponse.access_token)
        accesToken = parsedResponse.access_token

        vm.loadSaddestSongs(sadRequest.id, sadRequest.name)
      })

    });
  }

  vm.playSong = (song) => {
    // vm.showPlayer = true;
    // vm.songId = "https://embed.spotify.com/?uri=spotify%3Atrack%3A" + song.id;
    $window.open(song.externalUrl);
  }

  vm.getImageURL = (artist) => {

    return artist.images[2] ? artist.images[2].url : "https://assets.audiomack.com/default-artist-image.jpg"

  }

  vm.getContainerWidth = () => {
    return document.getElementById('result').clientWidth
  }

}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
