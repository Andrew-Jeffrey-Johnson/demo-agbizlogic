(function() {
  'use strict';

  angular
    .module("commonModule", [
      'ui.bootstrap',
      'ngMaterial',
    ])
    .config(commonConfig);

    commonConfig.$inject = [
      "$interpolateProvider",
      "$httpProvider",
    ];

    function commonConfig(
      $interpolateProvider,
      $httpProvider) {
      $interpolateProvider.startSymbol('{$');
      $interpolateProvider.endSymbol('$}');

      // CSRF configuration
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

      // HTTP interceptors
      $httpProvider.interceptors.push("errorService");
    }

})();
