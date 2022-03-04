(function() {
  'use strict';

  describe("Info Component", function () {
    var $scope,
        controller;

    beforeEach(module("dashboardModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("info", {});
    }));


    describe("$onInit", function () {

      it("initializes 'user' to input binding", function () {
        var user = {
          'id': 1,
          'username': "johncleese",
        };
        controller.user = user;
        controller.$onInit();
        $scope.$digest();

        expect(controller.user).toEqual(user);
      });

      it("calls controller method 'randomFact' to initialize 'random_fact'", function () {
        spyOn(controller, "randomFact").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(controller.randomFact).toHaveBeenCalled();
        expect(controller.random_fact).toBeDefined();
      });

    });


    describe("randomFact", function () {

      it("returns a string from random facts map", function () {
        var fact = controller.randomFact();
        $scope.$digest();

        expect(typeof fact).toEqual("string");
      });

    });

  });

}());
