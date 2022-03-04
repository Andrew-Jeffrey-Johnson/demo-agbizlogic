(function() {
  'use strict';

  describe("ClimateManagerController", function() {
    var $scope,
        $state,
        $q,
        user,
        controller,
        climateServiceMock,
        commonServiceMock,
        budgetServiceMock;

    // Load modules, including mock module for services
    beforeEach(module('climateModule'));
    beforeEach(module('commonModule'));
    beforeEach(module('mockModule'));

    // Set up controller with mocked services
    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      var $componentController = $injector.get("$componentController");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      budgetServiceMock = $injector.get("budgetServiceMock");
      climateServiceMock = $injector.get("climateServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");

      controller = $componentController('climateManager', {
        climateService: climateServiceMock,
        budgetService: budgetServiceMock,
        commonService: commonServiceMock
      });

    }));

    beforeEach(function() {
      user = {
        'id': 1,
        'username': "Monty Python",
      };
      spyOn($state, "go").and.returnValue();
    });



    describe("$onInit", function() {

      it("calls the data service to retrieve the current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
        expect(controller.current_user).toBeDefined();
      });


      it("does not call data service to list climate scenarios if retrieved user is undefined", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.returnValue($q.when({'data': {}}));
        spyOn(climateServiceMock, "listScenarios").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.listScenarios).not.toHaveBeenCalled();
      });


      it("calls data service to list current user's climate scenarios", function() {
        spyOn(climateServiceMock, "listScenarios").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.listScenarios).toHaveBeenCalled();
      });


      it("should initialize confirm attribute array elements to 0", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.confirm).not.toContain(1);
        expect(controller.confirm.length).toEqual(controller.scenario_list.length);
      });

    });



    describe("removeScenario", function() {
      var scenario_list;

      beforeEach(function() {
        scenario_list = [
          {
            'id': 1,
            'title': "Scenario 1",
            'climate_budgets': [
              {
                'id': 1,
                'climate_factors': [
                  {
                    'id': 1,
                  },
                ],
              },
            ],
          },
          {
            'id': 2,
            'title': "Scenario 2",
          },
        ];
      });


      it("should call data service to destroy associated budgets", function() {
        controller.scenario_list = scenario_list;
        spyOn(budgetServiceMock, "destroyBudget");
        controller.removeScenario(scenario_list[0]);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget).toHaveBeenCalled();
      });


      it("should call the data service to destroy the scenario", function() {
        controller.scenario_list = scenario_list;
        spyOn(climateServiceMock, "destroyScenario").and.callThrough();
        controller.removeScenario(scenario_list[0]);
        $scope.$digest();

        expect(climateServiceMock.destroyScenario.calls.argsFor(0)).toContain(scenario_list[0].id);
      });


      it("calls data service to list climate scenarios", function() {
        spyOn(climateServiceMock, "listScenarios").and.returnValue();
        controller.scenario_list = scenario_list;
        controller.removeScenario(scenario_list[0]);
        $scope.$digest();

        expect(climateServiceMock.listScenarios).toHaveBeenCalled();
      });
    });



    describe("newScenario", function() {

      it("should save a new scenario object using data service", function() {
        spyOn(climateServiceMock, "createScenario").and.callThrough();
        controller.newScenario();
        $scope.$digest();

        expect(climateServiceMock.createScenario).toHaveBeenCalled();
      });


      it("goes to create scenario state with new scenario id and new scenario flag in state parameters", function() {
        var climate_scenario = {'id': 1};
        spyOn(climateServiceMock, "createScenario").and.returnValue($q.when({'data': climate_scenario}));
        controller.newScenario();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["create", {
          'scenario': climate_scenario.id,
          'new': true,
        }]);
      });


      it("does nothing if data service returns invalid object", function() {
        spyOn(climateServiceMock, "createScenario").and.returnValue($q.when({}));
        controller.newScenario();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });
    });



    describe("editScenario", function() {
      var climate_scenario;

      beforeEach(function() {
        climate_scenario = {
          'id': 1,
        };
      });


      it("does nothing if passed scenario is invalid", function() {
        controller.editScenario({});
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to create state with scenario id in state parameters", function() {
        controller.editScenario(climate_scenario);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["create", {
          'scenario': climate_scenario.id,
          'new': false,
        }]);
      });
    });

  });


})();
