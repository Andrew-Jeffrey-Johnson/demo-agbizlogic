(function() {
  'use strict';

  angular
    .module("registrationModule")
    .factory("registrationService", registrationServiceFactory);

  registrationServiceFactory.$inject = [
    '$http',
  ];

  function registrationServiceFactory($http) {
    var url_base_schedulef = "/registration/api/schedule_f/";

    var registrationService = {
      listScheduleF: listScheduleF,
    };

    return registrationService;


    /****************************************************************
                         Methods
    ****************************************************************/

    function listScheduleF(username) {
      return $http.get(url_base_schedulef + "?username=" + username);
    }
  }

})();
