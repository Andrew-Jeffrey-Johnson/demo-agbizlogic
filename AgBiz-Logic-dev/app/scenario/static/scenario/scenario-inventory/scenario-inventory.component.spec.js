(function() {
  'use strict';

  describe("Scenario Inventory Component", function() {
    var $scope,
        $q,
        $state,
        $window,
        commonServiceMock,
        scenarioServiceMock,
        budgetServiceMock,
        controller;

    beforeEach(module("scenarioModule"));
    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      commonServiceMock = $injector.get("commonServiceMock");
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      $window = $injector.get("$window");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("scenarioManager", {
        scenarioService: scenarioServiceMock,
        commonService: commonServiceMock,
        budgetService: budgetServiceMock
      });

      spyOn($state, "go").and.returnValue();
      spyOn($window.location, "assign").and.returnValue();
    }));


    describe("$onInit", function() {
      var module;

      beforeEach(function() {
        module = "profit";
        $state.params = {'module': module};
      });


      it("initializes 'module' to state query parameter 'module'", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.module).toEqual(module);
      });


      it("calls data service to retrieve current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
        expect(controller.user).toBeDefined();
      });


      it("calls data service to list scenarios for current user and specified fields", function() {
        spyOn(scenarioServiceMock, "listScenarios").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.listScenarios.calls.argsFor(0)[0]).toEqual(controller.user.username);
        expect(scenarioServiceMock.listScenarios.calls.argsFor(0)[1]).toEqual(["id", "title", "notes", "created_date", "modified_date", "type"]);
        expect(controller.scenario_list).toBeDefined();
      });

    });
  });
}());
