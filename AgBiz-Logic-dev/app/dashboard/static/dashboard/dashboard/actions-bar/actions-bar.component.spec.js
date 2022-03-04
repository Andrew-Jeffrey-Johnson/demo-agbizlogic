(function() {
  'use strict';

  describe("Actions Bar Component", function() {
    var controller,
        $scope,
        $window,
        $q;

    beforeEach(module("dashboardModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $window = $injector.get("$window");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("actionsBar", {

      });

    }));



    describe("$onInit", function() {

    });



    describe("go", function() {

      beforeEach(function() {
        spyOn($window.location, "assign").and.returnValue();
      });


      xit("calls $window service to go to allocate summary when given 'allocate'", function() {
        controller.go("allocate");
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/allocate/#/allocate-summary"]);
      });


      it("calls $window service to go to budget manager when given 'budget'", function() {
        controller.go("budget");
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/budget/#/budget-manager"]);
      });


      it("calls $window service to go to climate manager when given 'climate'", function() {
        controller.go("climate");
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/climate/#/climate-manager"]);
      });


      xit("calls $window service to go to plan manager when given 'plan'", function() {
        controller.go("plan");
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/scenario/#/plan-manager"]);
      });


      xit("calls $window service to go to plan manager when given 'scenario'", function() {
        controller.go("scenario");
        $scope.$digest();

        expect($window.location.assign.calls.argsFor(0)).toEqual(["/scenario/#/scenario-manager"]);
      });

    });

  });

}());
