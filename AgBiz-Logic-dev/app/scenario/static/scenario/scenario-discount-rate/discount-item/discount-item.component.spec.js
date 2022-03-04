(function() {
  'use strict';

  describe("Scenario Discount Item Component", function() {
    var controller,
        $scope;

    beforeEach(module("scenarioModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("discountItem", {});
    }));



    describe("$onInit", function() {

      /*FixMe: new plan would be set as 0, but 'Edit/View' should show the previous settings
      it("initializes 'discount_rate', 'beginning_investment', and 'ending_investment' to zero", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.discount_rate).toEqual(0);
        expect(controller.beginning_investment).toEqual(0);
        expect(controller.ending_investment).toEqual(0);
      });
      */
    });

  });

}());
