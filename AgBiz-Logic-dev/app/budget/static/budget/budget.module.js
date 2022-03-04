(function() {
  "use strict";

  angular
    .module('budgetModule', [
      'ui.router',
      'ui.bootstrap',
      'ngAnimate',
      'angular.filter',
      'commonModule',
    ])
    .config(budgetConfig);

  budgetConfig.$inject = [
    "$interpolateProvider",
    "$httpProvider",
  ];

  function budgetConfig(
    $interpolateProvider,
    $httpProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    // CSRF configuration
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  }

})();
