(function() {
  'use strict';

  angular
    .module("commonModule")
    .factory("userService", userServiceFactory);

    userServiceFactory.$inject = [
      '$http',
      '$q',
    ];

    function userServiceFactory(
      $http,
      $q) {

      // URL's
      var url_base_users = "/common/api/users/";

      var userService = {
        setPassword: setPassword,
        requestPasswordReset: requestPasswordReset,
      };

      return userService;


      /****************************************************************
                           Methods
      ****************************************************************/

      function requestPasswordReset(user) {
        if (user !== undefined &&
            user.username !== undefined) {
          return $http.post(url_base_users + user.username + "/reset_password/", {});
        }
      }


      function setPassword(user, new_password, code) {
        if (user !== undefined &&
            user.username !== undefined &&
            new_password !== undefined &&
            new_password.length > 0 &&
            code !== undefined &&
            code.length > 0) {
          var payload = {
            'code': code,
            'new_password': new_password,
          };

          return $http.post(url_base_users + user.username + "/set_password/", payload)
        }
      }

    }

})();
