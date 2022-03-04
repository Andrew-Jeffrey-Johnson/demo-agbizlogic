(function() {
  'use strict';

  angular
    .module('mockModule')
    .factory('configServiceMock', configServiceMockFactory);

  configServiceMockFactory.$inject = [
    '$q',
  ];

  function configServiceMockFactory($q) {
    return {
      retrieveConfig: retrieveConfig,
    };


    /****************************************************************
                           Methods
    ****************************************************************/

    function retrieveConfig() {
      return $q.when({
        environment: "local",
      });
    }
  }

})();