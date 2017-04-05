function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider) {
  'ngInject';

  if (process.env.NODE_ENV === 'production') {
    $compileProvider.debugInfoEnabled(false);
  }

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $stateProvider
  .state('Home', {
    url: '/',
    controller: 'HomeCtrl as home',
    templateUrl: 'home.html',
    title: 'Home'
  });

    $stateProvider
  .state('Auth', {
    url: '/auth',
    controller: 'AuthCtrl as auth',
    templateUrl: 'auth.html',
    title: 'Auth'
  });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
