(function() {
  'use strict';

  angular
    .module('commonModule')
    .service('configService', configServiceFactory);

  configServiceFactory.$inject = [
    '$window',
    '$q',
  ];

  function configServiceFactory(
    $window,
    $q) {
    return {
      retrieveConfig: retrieveConfig,
    };


    /****************************************************************
                           Methods
    ****************************************************************/

    function retrieveConfig() {
      return $q(function(resolve, reject) {
        if ($window.__config != undefined) {
          resolve($window.__config);
        }
        else {
          reject({'error': "config object not found"});
        }
      });
    }
  }

})();