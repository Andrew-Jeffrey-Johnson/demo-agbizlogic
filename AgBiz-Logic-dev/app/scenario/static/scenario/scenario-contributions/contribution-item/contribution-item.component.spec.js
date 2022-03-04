(function() {
  'use strict';

  describe("Contribution Item Component", function() {
    var controller,
        $scope;

    beforeEach(module("scenarioModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("contributionItem", {});
    }));



    describe("$onInit", function() {

      it("initializes all form variables to zero", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.discount_rate).toEqual(0);
        expect(controller.beginning_land).toEqual(0);
        expect(controller.appreciation).toEqual(0);
        expect(controller.roi).toEqual(0);
        expect(controller.beginning_capital).toEqual(0);
        expect(controller.ending_capital).toEqual(0);
        expect(controller.inflation_rate).toEqual(0);
      });

    });

  });

}());
