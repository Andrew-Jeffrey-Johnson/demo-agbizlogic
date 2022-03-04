(function() {
  'use strict';

  angular
    .module("registrationModule", [])
    .config(registrationConfig);

    registrationConfig.$inject = [
      '$httpProvider',
    ];

    function registrationConfig($httpProvider) {
      // CSRF configuration
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }


})();
