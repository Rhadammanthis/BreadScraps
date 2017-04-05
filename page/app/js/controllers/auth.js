import request from 'request'

function AuthCtrl($location, $cookies) {
  'ngInject';

  // ViewModel
  const vm = this;


  vm.$onInit = () => {

    const code = $location.search().code;

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

    request(options, (error, response, body) => {
      // if (error) throw new Error(error);

      // console.log('error', error);
      // console.log('response', response);
      // console.log('body', body);
      var parsedResponse = JSON.parse(body)
      // console.log(parsedResponse.access_token)
      $cookies.put('bs.spotify_acces_token', parsedResponse.access_token)
      window.location.replace('http://localhost:3000');
    });

    // console.log(code, state)
  }

}

export default {
  name: 'AuthCtrl',
  fn: AuthCtrl
};
