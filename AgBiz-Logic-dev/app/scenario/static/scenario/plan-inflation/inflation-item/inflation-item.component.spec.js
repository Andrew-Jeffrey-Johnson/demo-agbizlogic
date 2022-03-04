(function() {
  'use strict';

  describe("Plan Inflation Item Component", function() {
    var controller,
        $scope;

    beforeEach(module("scenarioModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      var $componentController = $injector.get("$componentController");

      controller = $componentController("inflationItem", {});
    }));



    describe("$onInit", function() {

      it("initializes 'budget_item_type' to 'income' if item has 'income_item' attribute", function() {
        controller.item = {
          'income_item': 2,
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget_item_type).toEqual('income');
      });


      it("initializes 'budget_item_type' to 'expense' if item has 'cost_item' attribute", function() {
        controller.item = {
          'cost_item': 2,
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget_item_type).toEqual('expense');
      });

    });



    describe("$onChanges", function() {

    });
  });

}());
