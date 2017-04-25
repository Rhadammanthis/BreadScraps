function OnRun($rootScope, AppSettings) {
  'ngInject';

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', (event, toState) => {
    $rootScope.pageTitle = '';

    $rootScope.pageTitle = AppSettings.appTitle;
  });

}

export default OnRun;
