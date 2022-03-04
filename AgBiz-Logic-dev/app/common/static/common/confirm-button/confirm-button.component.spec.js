(function() {
  'use strict';

  describe("Common: Confirm Button Component", function() {
    var $scope,
        controller;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("confirmButton", {});
    }));



    describe("$onInit()", function() {

      it("sets 'type' to 'danger' if undefined", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.type).toEqual("danger");
      });


      it("sets 'disabled' to false if undefined", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.disabled).toBe(false);
      });

    });

  });

}());
