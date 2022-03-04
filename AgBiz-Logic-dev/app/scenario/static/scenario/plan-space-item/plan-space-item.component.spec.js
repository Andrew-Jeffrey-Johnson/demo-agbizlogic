(function() {
  'use strict';

  describe("Plan Space Item Component", function() {
    var $scope,
        controller;

    beforeEach(module("scenarioModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      var $componentController = $injector.get("$componentController");

      controller = $componentController("planSpaceItem", {});

      controller.onChange = function(targets, status) {};
      controller.planBudget = {
        'id': 1,
        'space_units': "acres",
        'total_space_available': 0,
        'total_space_used': 0,
        'farm_unit_quantity': 0,
      };
      spyOn(controller, "onChange").and.returnValue();
    }));



    describe("$onInit", function() {
      it("initializes unit attribute to percent", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.unit).toEqual("percent");
      });


      it("initializes starting values to zero", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.total_space_used_unit).toEqual(0);
        expect(controller.total_space_used_percent).toEqual(100);
      });
    });



    describe("recalculate", function() {

      beforeEach(function() {
        controller.planBudget = {
          'id': 1,
          'space_units': "acres",
          'total_space_available': 0,
          'total_space_used': 0,
          'farm_unit_quantity': 0,
        };
      });


      it("removes error", function() {
        controller.error = "over";
        controller.planBudget.total_space_available = 1000;
        controller.total_space_used_unit = 200;
        controller.recalculate('percent');
        $scope.$digest();

        expect(controller.error).toEqual("");
      });


      it("calculates 'percent' value when called with 'percent' argument", function() {
        controller.planBudget.total_space_available = 1000;
        controller.total_space_used_unit = 200;
        controller.recalculate('percent');
        $scope.$digest();

        expect(controller.total_space_used_percent).toEqual(20);
      });


      it("sets error if unit value entered is over total_space_available", function() {
        controller.planBudget.total_space_available = 100;
        controller.total_space_used_unit = 200;
        controller.recalculate('percent');
        $scope.$digest();

        expect(controller.error).toEqual("Over!");
      });


      it("sets error if unit value entered is under 0", function() {
        controller.planBudget.total_space_available = 100;
        controller.total_space_used_unit = -100;
        controller.recalculate('percent');
        $scope.$digest();

        expect(controller.error).toEqual("Under!");
      });


      it("calculates 'unit' value when called with 'unit' argument", function() {
        controller.planBudget.total_space_available = 100;
        controller.total_space_used_percent = 20;
        controller.recalculate('unit');
        $scope.$digest();

        expect(controller.total_space_used_unit).toEqual(20);
      });


      it("sets error if percent value entered is over 100 percent", function() {
        controller.planBudget.total_space_available = 100;
        controller.total_space_used_percent = 200;
        controller.recalculate('unit');
        $scope.$digest();

        expect(controller.error).toEqual("Over!");
      });


      it("sets error if percent value entered is under 0", function() {
        controller.planBudget.total_space_available = 100;
        controller.total_space_used_percent = -100;
        controller.recalculate('unit');
        $scope.$digest();

        expect(controller.error).toEqual("Under!");
      });


      it("calls bound output method with plan budget id, units, total available, and total used space if valid", function() {
        controller.planBudget.total_space_available = 1000;
        controller.total_space_used_unit = 200;
        controller.recalculate('percent');
        $scope.$digest();

        expect(controller.onChange).toHaveBeenCalled();
      });

    });


  });

}());
