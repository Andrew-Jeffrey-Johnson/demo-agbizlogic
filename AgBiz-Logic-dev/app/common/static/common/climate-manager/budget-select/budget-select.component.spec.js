(function() {
  'use strict';

  describe("Common: Budget Select Component", function() {
    var $scope,
        controller;

    beforeEach(module("commonModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("budgetSelect", {});
    }));



    describe("$onInit()", function() {

      it("initializes items allowed flag to true", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.items_allowed).toBe(true);
      });


      it("initializes editable attribute to true if undefined", function() {
        controller.editable = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.editable).toBe(true);
      });


      it("initializes editable attribute to the component input", function() {
        controller.editable = false;
        controller.$onInit();
        $scope.$digest();

        expect(controller.editable).toBe(false);
      });


      it("initializes 'showNotes' to true if undefined", function () {
        controller.showNotes = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.showNotes).toBe(true);
      });


      it("initializes 'ordered' to false if undefined", function() {
        controller.ordered = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.ordered).toBe(false);
      });

    });



    describe("$onChanges", function() {

      beforeEach(function() {
        controller.itemList = [1, 1, 1];
      });


      it("handles empty list", function() {
        controller.itemList = [];
        controller.itemLimit = 1;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(true);
      });


      it("sets items allowed flag to false if item list length equals limit", function() {
        controller.itemLimit = controller.itemList.length;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(false);
      });


      it("sets items allowed flag to true if item list length is less than limit", function() {
        controller.itemLimit = controller.itemList.length + 1;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(true);
      });
    });



    describe("selectBudget", function () {
      var budget;

      beforeEach(function() {
        budget = {
          'id': 43,
          'title': "Some Budget",
        };
      });


      it("sets 'new_budget' to equal given budget argument", function () {
        controller.selectBudget(budget);
        $scope.$digest();

        expect(controller.new_budget).toEqual(budget);
      });

    });


  });

}());
