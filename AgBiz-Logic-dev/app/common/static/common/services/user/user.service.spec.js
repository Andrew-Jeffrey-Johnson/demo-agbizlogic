(function() {
  'use strict';

  describe("Service: userService", function() {
    var $httpBackend,
        url_base_users,
        user,
        userService;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get("$httpBackend");
      userService = $injector.get("userService");

      url_base_users = "/common/api/users/";
      user = {
        'id': 1,
        'username': "johncleese",
      };
    }));



    describe("setPassword", function () {
      var success_response;

      beforeEach(function() {
        success_response = {'status': "Password set successfully"};
        $httpBackend.expectPOST(url_base_users + user.username + "/set_password/")
        .respond(200, success_response);
      });


      it("makes POST request to API to change user's password", function () {
        var new_password = "coolPassword3",
            code = "324ed2";
        userService.setPassword(user, new_password, code)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(success_response);
        });

        $httpBackend.flush();
      });

    });



    describe("requestPasswordReset", function () {
      var success_response;

      beforeEach(function() {
        success_response = {'message': "Success"};
        $httpBackend.expectPOST(url_base_users + user.username + "/reset_password/")
        .respond(200, success_response);
      });


      it("makes POST request to API to request password reset", function () {
        userService.requestPasswordReset(user)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(success_response);
        });

        $httpBackend.flush();
      });
    });

  });

}());
