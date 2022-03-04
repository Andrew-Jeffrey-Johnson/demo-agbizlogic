(function() {
  'use strict';

  describe("ClimateVariableImpactController", function() {
    var $scope,
        $state,
        $q,
        controller,
        percentageFilter,
        climateServiceMock,
        factor;

    beforeEach(module('climateModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      percentageFilter = {};
      climateServiceMock = $injector.get("climateServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("climateVariableImpact", {
        climateService: climateServiceMock,
        percentageFilter: percentageFilter
      });

      factor = {
        'id': 1,
        'name': "Test Climate Factor",
        'state': "OR",
        'region': "Corvallis",
        'user_estimate': 0.0,
      };

      spyOn($state, "go").and.returnValue();
    }));


    describe("$onInit", function() {
      var scenario,
          climate_budget,
          factor;

      beforeEach(function() {
        scenario = 1;
        climate_budget = 2;
      });


      it("checks state parameters for scenario id and calls data service to retrieve scenario", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.callThrough();
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
          'factor': factor,
        };
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.retrieveScenario.calls.argsFor(0)).toContain(1);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no scenario in state query parameters", function() {
        $state.params = {
          'climate_budget': climate_budget,
          'factor': factor,
        };
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });


      it("goes to manager state if retrieved scenario is empty", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {}}));
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
        };
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });


      it("checks state parameters for climate budget id and calls data service to retrieve climate budget", function() {
        spyOn(climateServiceMock, "retrieveBudget").and.callThrough();
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
        };
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.retrieveBudget.calls.argsFor(0)).toContain(climate_budget);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to manager state if no climate budget id in state query parameters", function() {
        $state.params = {
          'scenario': scenario,
        };
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });


      it("goes to manager state if retrieved climate budget is empty", function() {
        spyOn(climateServiceMock, "retrieveBudget").and.returnValue($q.when({'data': {}}));
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
        };
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });


      it("sets 'current_factor' to first factor in climate budget factor list and calls data service to retrieve factor", function() {
        spyOn(climateServiceMock, "retrieveFactor").and.callThrough();
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
        };
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.retrieveFactor.calls.argsFor(0)).toContain(controller.climate_budget.climate_factors[0].id);
      });


      it("retrieves the climate projection data for current factor", function() {
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
        };
        spyOn(climateServiceMock, "retrieveFactorProjections").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.retrieveFactorProjections).toHaveBeenCalled();
      });


      it("sets chart info using projection data", function() {
        $state.params = {
          'scenario': scenario,
          'climate_budget': climate_budget,
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.projection_data).toBeDefined();
      });
    });



    describe("proceed", function() {
      var user_estimate,
          state,
          region,
          next_factor;

      beforeEach(function() {
        user_estimate = 10.0;
        controller.climate_scenario = {
          'id': 1,
        };
        controller.climate_budget = {
          'id': 1,
          'climate_factors': [
            {
              'id': 1,
              'name': 'test1',
            },
            {
              'id': 2,
              'name': 'test2',
            },
            {
              'id': 3,
              'name': 'test3',
            },
          ]
        };
        next_factor = controller.climate_budget.climate_factors[2];
        state = "Oregon";
        region = "Umatilla";
        $state.params['state'] = state;
        $state.params['region'] = region;
      });
    });



    describe("back", function() {
      var scenario,
          climate_budget,
          state,
          region;

      beforeEach(function() {
        scenario = {
          'id': 1,
        };
        climate_budget = {
          'id': 2,
        };
        state = "Oregon";
        region = "Clackamas";
        $state.params = {
          'state': state,
          'region': region,
        };
      });


      it("goes to variable select state with climate scenario id and climate budget id in state parameters", function() {
        controller.climate_scenario = scenario;
        controller.climate_budget = climate_budget;
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["variableSelect", {
          'scenario': controller.climate_scenario.id,
          'climate_budget': controller.climate_budget.id,
          'state': state,
          'region': region,
        }]);

      });
    });

  });

})()
