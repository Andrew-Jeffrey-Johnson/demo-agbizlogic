(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("modalServiceMock", modalServiceMock);

  modalServiceMock.$inject = [
    '$q',
  ];

  function modalServiceMock($q) {
    return {
      alert: alert,
      confirm: confirm,
      allocation_next: allocation_next,
      displayConfirmation: displayConfirmation,
    };


    /****************************************************************
                         Methods
    ****************************************************************/

    function alert(message, confirmCallback, denyCallback) {
      return true;
    }


    function confirm(message, confirmCallback, denyCallback) {
      return true;
    }

    function allocation_next(confirm_event){
        return true;
    }


    function displayConfirmation(message) {
      return $q.when({});
    }
  }

}());
