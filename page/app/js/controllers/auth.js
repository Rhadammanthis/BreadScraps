import request from 'request';
import firebase from 'firebase';

function AuthCtrl($location, $cookies, $scope) {
  'ngInject';

  // ViewModel
  const vm = this;

  vm.userId;
  vm.fromApp = false
  vm.loading = false

  var clipboard = new Clipboard('.btn');

  vm.$onInit = () => {

    const code = $location.search().code;
    const state = $location.search().state;

    var options = {
      method: 'POST',
      url: 'http://localhost:8080/api/auth',
      form: {
        code: code
      },
      headers: {
        'Origin': 'http://localhost:3000'
      }
    };

    if (state === 'q897yeo') {

      request(options, (error, response, body) => {

        var parsedResponse = JSON.parse(body)
        console.log(parsedResponse)
        $cookies.put('bs.spotify_acces_token', parsedResponse.access_token)
        $cookies.put('bs.spotify_refresh_token', parsedResponse.refresh_token)

        window.location.replace('http://localhost:3000');
      });
    }
    else {

      console.log('From app')
      vm.fromApp = true
      vm.userId = 'MBPL3'
      // vm.loading = true

      request(options, (error, response, body) => {

        var parsedResponse = JSON.parse(body)
        console.log(parsedResponse)
        $cookies.put('bs.spotify_acces_token', parsedResponse.access_token)
        $cookies.put('bs.spotify_refresh_token', parsedResponse.refresh_token)

        var config = {
          apiKey: "AIzaSyB42xJH08TpCmIorfCtcIv_q4mdB5DqrIo",
          authDomain: "bread-scraps.firebaseapp.com",
          databaseURL: "https://bread-scraps.firebaseio.com",
          projectId: "bread-scraps",
          storageBucket: "bread-scraps.appspot.com",
          messagingSenderId: "502353067063"
        };

        if (firebase.apps.length === 0) {
          firebase.initializeApp(config);
        }

        var user = {};
        user.access_token = parsedResponse.access_token
        user.refresh_token = parsedResponse.refresh_token
        user.trackId = randomString(5)

        console.log(user)

        firebase.database().ref(`/users`)
          .push(user)
          .then(() => {
            $scope.$apply(() => {
              vm.loading = false
              vm.userId = user.trackId
            })
          });
      });
    }
  }

  var randomString = (length) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

}

export default {
  name: 'AuthCtrl',
  fn: AuthCtrl
};
