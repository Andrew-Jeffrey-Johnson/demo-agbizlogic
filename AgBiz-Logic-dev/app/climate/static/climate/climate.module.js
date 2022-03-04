(function() {
  'use strict';

  angular
    .module('climateModule', [
      'ui.router',
      'ui.bootstrap',
      'ngAnimate',
      'budgetModule',
      'commonModule',
      'chart.js',
    ])
    .config(climateConfig);

  climateConfig.$inject = [
    "$interpolateProvider",
    "$httpProvider",
  ];

  function climateConfig(
    $interpolateProvider,
    $httpProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    // CSRF configuration
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  }

})();
