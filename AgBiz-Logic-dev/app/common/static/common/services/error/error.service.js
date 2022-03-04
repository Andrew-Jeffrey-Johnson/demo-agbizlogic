(function() {
  'use strict';

  angular
    .module("commonModule")
    .factory("errorService", errorServiceFactory);

  errorServiceFactory.$inject = [
    "$rootScope",
  ];

  function errorServiceFactory(
    $scope) {
    var errorService = {
      responseError: responseError,
    };

    return errorService;


    /****************************************************************
                         Methods
    ****************************************************************/

    function responseError(error_response) {
      var status = error_response.status,
          error_message = "";

      if (status == 400 || status == 404 || status == 405 || status == 500) {
        error_message = "Something was wrong with the request. Status code: " + status;

        $scope.$emit("httpError", error_message);
      }
    }

  }

})();
