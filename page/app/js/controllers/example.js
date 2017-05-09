import request from 'request';
import firebase from 'firebase';

function HomeCtrl($q, $cookies, $scope, $anchorScroll, $mdToast, $window, $mdDialog, $mdMedia) {
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

  vm.bigScreen;

  var accesToken;
  var refreshToken;
  var sadRequest = { id: '', name: '' }

  var endpointURL;
  var pageURL;

  vm.$onInit = () => {

    if (process.env.NODE_ENV === 'production') {
      endpointURL = 'https://bs.hugomedina.me';
      pageURL = 'https://bread-scraps.firebaseapp.com';
    }
    else {
      endpointURL = 'http://localhost:8080';
      pageURL = 'http://localhost:3000';
    }

    accesToken = $cookies.get('bs.spotify_acces_token') ? $cookies.get('bs.spotify_acces_token') : null
    refreshToken = $cookies.get('bs.spotify_refresh_token') ? $cookies.get('bs.spotify_refresh_token') : null
    vm.accesToken = accesToken

    vm.smallScreen = !$mdMedia('gt-sm')
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

    if (accesToken === null) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('You forgot to login with Spotify! Go back to step 1 and do it.')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
      );

      return;
    }

    sadRequest.id = id;
    sadRequest.name = name

    vm.loading = true;
    vm.sadSongs = [];

    var options = {
      method: 'POST',
      url: endpointURL + '/api/getSaddestSongs',
      form: {
        spotifyToken: accesToken,
        artistId: id,
        artistName: name,
        // factor_no_lyrics: true,
        // thorough_analysis: true,
        // analyse_set_size: 20
      },
      headers: {
        'Origin': pageURL
      }
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);

      if (JSON.parse(body).error) {
        if (JSON.parse(body).error.status == 401) {
          $scope.$apply(() => {
            vm.loading = false;
            vm.showRefreshButton = true;
          })
        }
        else {
          $scope.$apply(() => {
            vm.loading = false;
            console.log('My name is error', JSON.parse(body).error)
          })
        }
      }
      else {
        $scope.$apply(() => {
          vm.sadSongs = JSON.parse(body)
          vm.loading = false;
          vm.showRefreshButton = false;
        })
      }

    });
  }

  vm.logToSpotify = () => {
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent('749748f5ea93499ea4177c896e6adef8');
    url += '&redirect_uri=' + encodeURIComponent(pageURL + '/auth');
    url += '&state=' + encodeURIComponent('q897yeo');

    window.location.replace(url);
  }

  vm.refreshToken = () => {

    vm.showRefreshButton = true;
    vm.loading = true;

    var options = {
      method: 'POST',
      url: endpointURL + '/api/refresh',
      form: {
        token: refreshToken
      },
      headers: {
        'Origin': pageURL
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
