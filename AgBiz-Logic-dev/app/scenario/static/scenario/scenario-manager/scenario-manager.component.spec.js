(function() {
  'use strict';

  describe("Scenario Manager Component", function() {
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



    describe("addNewScenario", function () {
      var default_scenario;
      var module = 'profit';
      beforeEach(function() {
        default_scenario = {
          'title': "New Scenario",
        };
      });


      it("calls data service to create a new scenario with default values", function () {
        spyOn(scenarioServiceMock, "createScenario").and.callThrough();
        controller.addNewScenario('new');
        $scope.$digest();

        expect(scenarioServiceMock.createScenario).toHaveBeenCalled();
      });


      it("goes to scenario create state if returned scenario is valid", function () {
        var scenario = {
          'id': 23,
          'title': "New Scenario",
          'module': 'profit',
          'scenario_type': 'new',
        };
        spyOn(scenarioServiceMock, "createScenario").and.returnValue($q.when({'data': scenario}));
        controller.addNewScenario('new');
        $scope.$digest();

        console.log($state.go.calls.argsFor(0));

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioCreate", {
          'scenario': scenario.id, 'module': module, 'new': scenario.scenario_type,
        }]);
      });


      it("does nothing if returned scenario is invalid", function () {
        spyOn(scenarioServiceMock, "createScenario").and.returnValue($q.when({'data': {}}));
        controller.addNewScenario('new');
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });

    });



    describe("editScenario", function () {
      var scenario;
      var module = 'profit';

      beforeEach(function() {
        $state.params = {'module': module};
        controller.module = module;
        scenario = {
          'id': 32,
          'type': 'profit',
        };
      });


      it("does nothing if given invalid scenario", function () {
        controller.editScenario({});
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to scenario summary state with given scenario id in state parameters", function () {
        controller.editScenario(scenario);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["profitSummary", {
          'scenario': scenario.id,
          'module' : module,
          'from_profit' : 'true'
        }]);
      });
    });



    describe("removeScenario", function () {
      var scenario;

      beforeEach(function() {
        controller.user = {
          'username': "johncleese",
        };
        scenario = {
          'id': 45,
        };
      });


      it("does nothing if given invalid scenario", function () {
        spyOn(scenarioServiceMock, "destroyScenario").and.callThrough();
        controller.removeScenario({});
        $scope.$digest();

        expect(scenarioServiceMock.destroyScenario).not.toHaveBeenCalled();
      });


      it("calls data service to destroy given scenario", function () {
        spyOn(scenarioServiceMock, "destroyScenario").and.callThrough();
        controller.removeScenario(scenario);
        $scope.$digest();

        expect(scenarioServiceMock.destroyScenario.calls.argsFor(0)).toEqual([scenario.id]);
      });


      it("calls data service to get updated scenario list", function () {
        spyOn(scenarioServiceMock, "listScenarios").and.callThrough();
        controller.removeScenario(scenario);
        $scope.$digest();

        expect(scenarioServiceMock.listScenarios).toHaveBeenCalled();
        expect(controller.scenario_list).toBeDefined();
      });

    });



    describe("viewSummary", function () {
      var scenario;

      beforeEach(function() {
        scenario = {
          'id': 12,
        };
      });


      it("does nothing if given 'scenario' is invalid", function () {
        controller.viewSummary();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to scenario summary state with scenario id and module in state parameters", function () {
        controller.module = "lease";
        controller.viewSummary(scenario);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioSummary", {
          'scenario': scenario.id,
          'module': controller.module,
        }]);
      });

    });

  });

}());
