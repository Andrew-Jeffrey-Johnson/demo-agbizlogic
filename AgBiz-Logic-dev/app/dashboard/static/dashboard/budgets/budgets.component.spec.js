(function() {
  'use strict';

  describe("DashboardComponent->BudgetsComponent: BudgetsComponentController", function() {
    var controller,
        $scope;

    beforeEach(module("dashboardModule"));
    beforeEach(module("budgetModule"));

    beforeEach(inject(function($injector) {
      var $componentController = $injector.get("$componentController");
      $scope = $injector.get("$rootScope");

      controller = $componentController("budgets", {});
    }));


    describe("$onInit", function() {

      it('sets the inactive class to true by default', function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toBeTruthy();
      });


      it("should set inactive class based on inactive flag", function() {
        controller.inactive = false;
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toEqual(false);
        expect(controller.is_inactive).toEqual(false);

        controller.inactive = true;
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toEqual(true);
        expect(controller.is_inactive).toEqual(true);
      });
    });

  });

})();
