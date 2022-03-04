(function() {
  'use strict';

  angular
    .module("mockModule")
    .factory("userServiceMock", userServiceMock);

    userServiceMock.$inject = [
      '$q',
    ];

    function userServiceMock($q) {
      var userServiceMock = {
        setPassword: setPassword,
        requestPasswordReset: requestPasswordReset,
      };

      return userServiceMock;


      /****************************************************************
                           Methods
      ****************************************************************/

      function setPassword(user, new_password, code) {
        return $q.when({'data': {'status': "Password set successfully"}});
      }


      function requestPasswordReset(user) {
        return $q.when({'data': {'message': "Someone has requested password reset"}});
      }
    }

})();
