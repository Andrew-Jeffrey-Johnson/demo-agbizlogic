(function() {
  'use strict';

  angular
      .module('inventoryModule', [
          'ui.router',
          'ui.bootstrap',
          'ngAnimate',
          'commonModule',
          'budgetModule',
          'scenarioModule',
      ]).config(inventoryConfig);

  inventoryConfig.$inject = [
      "$interpolateProvider",
      "$httpProvider",
  ];

  function inventoryConfig(
      $interpolateProvider,
      $httpProvider) {
      $interpolateProvider.startSymbol('{$');
      $interpolateProvider.endSymbol('$}');

      // CSRF configuration
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  }

})();
