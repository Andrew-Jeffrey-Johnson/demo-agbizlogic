(function() {
  'use strict';

  angular
    .module('scenarioModule', [
      'ui.router',
      'ui.bootstrap',
      'ngAnimate',
      'commonModule',
      'chart.js',
      'ngAnimate',
      'budgetModule',
      'ngMaterial',
    ])
    .config(scenarioConfig);

  scenarioConfig.$inject = [
    "$interpolateProvider",
    "$httpProvider",
    "ChartJsProvider",
  ];

  function scenarioConfig(
    $interpolateProvider,
    $httpProvider,
    ChartJsProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    // CSRF configuration
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // ChartJS options
    ChartJsProvider.setOptions({
      colors: [

      ]
    });
  }

})();
