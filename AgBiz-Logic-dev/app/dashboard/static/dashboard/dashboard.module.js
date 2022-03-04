(function() {
  'use strict';

  angular
    .module('dashboardModule', [
      'ui.router',
      'ui.bootstrap',
      'chart.js',
      'ngAnimate',
      'commonModule',
      'climateModule',
      'ngSanitize',
    ])
    .config(dashboardConfig);

    dashboardConfig.$inject = [
      "$interpolateProvider",
      "$httpProvider",
      "$locationProvider",
      "$stateProvider",
      "$urlRouterProvider"
    ];

    function dashboardConfig(
      $interpolateProvider,
      $httpProvider,
      $locationProvider,
      $stateProvider,
      $urlRouterProvider) {
      $interpolateProvider.startSymbol('{$');
      $interpolateProvider.endSymbol('$}');

      // CSRF configuration
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

      $locationProvider.html5Mode(false);

      // Client side routing
      $urlRouterProvider.otherwise('/');

      $stateProvider
        // Home state
        .state('dashboard', {
          url: '/',
          template: "<dashboard></dashboard>"
        });
    }

})();
