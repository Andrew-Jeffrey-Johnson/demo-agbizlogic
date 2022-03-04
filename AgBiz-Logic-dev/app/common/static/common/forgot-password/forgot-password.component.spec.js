(function() {
  'use strict';

  describe("Common: Forgot Password Component", function () {
    var $scope,
        $window,
        userServiceMock,
        modalServiceMock,
        controller;

    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(function() {
      $window = {
        'location': {
          'search': jasmine.createSpy(),
          'href': jasmine.createSpy(),
        },
      };

      module(function($provide) {
        $provide.value("$window", $window);
      });

      inject(function($injector) {
        $scope = $injector.get("$rootScope");
        userServiceMock = $injector.get("userServiceMock");
        modalServiceMock = $injector.get("modalServiceMock");

        var $componentController = $injector.get("$componentController");
        controller = $componentController("forgotPassword", {
          $window: $window,
          userService: userServiceMock,
          modalService: modalServiceMock,
        });
      });
    });



    describe("$onInit", function () {

      it("sets 'show_form' to false if URL query parameters do not contain valid 'code'", function () {
        $window.location.search = "?l;ajsfd=;lasjdf";
        controller.$onInit();
        $scope.$digest();

        expect(controller.show_form).toBe(false);
      });


      it("sets 'show_form' to true if URL query parameters contain valid 'code'", function () {
        $window.location.search = "?code=1234";
        controller.$onInit();
      });

    });



    describe("submit", function () {

      beforeEach(function() {
        controller.username = "johncleese";
        controller.new_password = "newPassword4";
        controller.code = "423jsd23";
      });


      it("does nothing if 'form' is invalid", function () {
        spyOn(userServiceMock, "setPassword").and.callThrough();
        controller.form.$invalid = true;
        controller.submit();

        expect(userServiceMock.setPassword).not.toHaveBeenCalled();
      });


      it("calls data service to set user's password with 'username', 'new_password', and 'code'", function () {
        var user = {
          'username': controller.username,
        };
        spyOn(userServiceMock, "setPassword").and.callThrough();
        controller.form.$invalid = false;
        controller.submit();
        $scope.$digest();

        expect(userServiceMock.setPassword.calls.argsFor(0)).toEqual([user, controller.new_password, controller.code])
      });


      it("calls modal service to display success message", function () {
        spyOn(modalServiceMock, "alert").and.callThrough();
        controller.form.$invalid = false;
        controller.submit();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });


      it("calls $window service to redirect to login page", function () {
        controller.form.$invalid = false;
        controller.submit();
        $scope.$digest();

        expect($window.location.href).toEqual("/login");
      });

    });



    describe("sendVerification", function () {

      beforeEach(function() {
        controller.username = "johncleese";
      });


      it("calls data service to send password reset verification", function () {
        var user = {
          'username': controller.username,
        };
        spyOn(userServiceMock, "requestPasswordReset").and.callThrough();
        controller.sendVerification();
        $scope.$digest();

        expect(userServiceMock.requestPasswordReset.calls.argsFor(0)).toEqual([user]);
      });


      it("calls modal service to display success message", function () {
        spyOn(modalServiceMock, "alert").and.callThrough();
        controller.sendVerification();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });

    });

  });

}());
