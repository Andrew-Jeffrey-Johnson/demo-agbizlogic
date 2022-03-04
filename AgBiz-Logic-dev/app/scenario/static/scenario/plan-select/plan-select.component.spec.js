(function() {
  'use strict';

  describe("Plan Select Component", function() {
    var $scope,
        $state,
        controller,
        commonServiceMock,
        scenarioServiceMock;

    beforeEach(module("commonModule"));
    beforeEach(module("scenarioModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      commonServiceMock = $injector.get("commonServiceMock");
      scenarioServiceMock = $injector.get("scenarioServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("planSelect", {
        commonService: commonServiceMock,
        scenarioService: scenarioServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit()", function() {

      it("initializes items allowed flag to true", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(true);
      });


      it("initializes editable attribute to true if undefined", function() {
        controller.editable = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.editable).toEqual(true);
      });


      it("initializes editable attribute to the component input", function() {
        controller.editable = false;
        controller.$onInit();
        $scope.$digest();

        expect(controller.editable).toEqual(false);
      });


      it("initializes 'showNotes' to true if undefined", function () {
        controller.showNotes = undefined;
        controller.$onInit();
        $scope.$digest();

        expect(controller.showNotes).toEqual(true);
      });

    });



    describe("$onChanges", function() {

      beforeEach(function() {
        controller.planList = [1, 1, 1];
      });


      it("handles empty list", function() {
        controller.planList = [];
        controller.itemLimit = 1;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(true);
      });


      it("sets items allowed flag to false if item list length equals limit", function() {
        controller.itemLimit = controller.planList.length;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(false);
      });


      it("sets items allowed flag to true if item list length is less than limit", function() {
        controller.itemLimit = controller.planList.length + 1;
        controller.$onChanges();
        $scope.$digest();

        expect(controller.items_allowed).toEqual(true);
      });
    });



    describe("selectPlan", function () {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 43,
          'title': "Some Budget",
        };
      });


      it("sets 'new_plan' to equal given plan argument", function () {
        controller.selectPlan(plan);
        $scope.$digest();

        expect(controller.new_plan).toEqual(plan);
      });

    });

  });

}());
