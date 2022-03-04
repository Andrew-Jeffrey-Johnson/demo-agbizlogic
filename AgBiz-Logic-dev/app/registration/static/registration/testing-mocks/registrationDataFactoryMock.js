(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("registrationServiceMock", registrationServiceMock);

  registrationServiceMock.$inject = [
    '$q',
  ];

  function registrationServiceMock($q) {
    var registrationServiceMock = {
      listScheduleF: listScheduleF,
    };

    return registrationServiceMock;

    /****************************************************************
                         Methods
    ****************************************************************/

    function listScheduleF(username) {
      return $q.when({'data': []});
    }
  }



}());
