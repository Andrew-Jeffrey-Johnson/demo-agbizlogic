(function() {
  'use strict';

  describe("DashboardComponent->profitComponent: profitComponentController", function() {
    var controller,
        $scope;

    beforeEach(module("dashboardModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("profit", {});
    }));


    describe("$onInit", function() {

      it('sets the inactive class to false by default', function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.css_classes['panel-inactive']).toEqual(false);
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
