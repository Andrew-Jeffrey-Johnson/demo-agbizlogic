(function() {
  'use strict';

  describe("ClimateTotalImpactController", function() {
    var $scope,
        $state,
        $q,
        controller,
        modalServiceMock,
        climateServiceMock,
        budgetServiceMock,
        climate_budget,
        scenario;

    beforeEach(module('climateModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      modalServiceMock = $injector.get("modalServiceMock");
      climateServiceMock = $injector.get("climateServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("climateTotalImpact", {
        climateService: climateServiceMock,
        budgetService: budgetServiceMock,
        modalService: modalServiceMock,
      });

      // Set up testing objects
      climate_budget = {
        'id': 1,
        'title': "Climate Budget 1",
        'budget': 2,
        'climate_factors': [
          {
            'id': 1,
            'name': "Climate Factor 1",
            'user_estimate': 20.4
          },
          {
            'id': 2,
            'name': "Climate Factor 2",
            'user_estimate': 90.1
          }
        ]
      };
      scenario = {
        'id': 1,
        'title': "Scenario Title"
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
    });



    describe("back", function () {

      beforeEach(function() {
        controller.climate_scenario = {
          'id': 1,
        };
        controller.climate_budget = {
          'id': 2,
        };
      });


      it("goes to variable impact state with climate scenario id and climate budget id in state parameters", function () {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["variableImpact", {
          'scenario': controller.climate_scenario.id,
          'climate_budget': controller.climate_budget.id,
        }]);
      });
    });



    describe("proceed", function() {
      var state,
          region;

      beforeEach(function() {
        spyOn(climateServiceMock, "retrieveBudget").and.returnValue($q.when(climate_budget));
        controller.climate_scenario = scenario;
        state = "Oregon";
        region = "Clackamas";
      });


      it("does nothing if user estimate is undefined", function() {
        controller.climate_budget = climate_budget;
        spyOn(climateServiceMock, "updateBudget").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(climateServiceMock.updateBudget).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls modal service to alert user", function () {
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = 10.0;
        spyOn(modalServiceMock, "alert").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });


      it("calls the data service to update climate_budget with user estimate", function() {
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = 10.0;
        spyOn(climateServiceMock, "updateBudget").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(climateServiceMock.updateBudget).toHaveBeenCalled();
      });


      it("calls data service to create a copy of the climate budget's budget", function () {
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = 10.0;
        spyOn(budgetServiceMock, "copyBudgetByID").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(budgetServiceMock.copyBudgetByID.calls.argsFor(0)).toEqual([climate_budget.budget]);
      });


      it("updates the post impact budget 'title' and sets 'is_original' to false", function () {
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = 10.0;
        spyOn(budgetServiceMock, "updateBudget").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(budgetServiceMock.updateBudget.calls.argsFor(0)[0].title).toContain("After");
      });


      it("sets 'is_original' attribute on climate budget to indicate made after climate impacts", function() {
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = 10.0;
        spyOn(climateServiceMock, "createBudget").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(climateServiceMock.createBudget.calls.argsFor(0)[0].is_original).toEqual(false);
        expect(climateServiceMock.createBudget.calls.argsFor(0)[0].climate_scenario).toEqual(controller.climate_scenario.id);
      });


      it("calls data service to adjust new budget's net returns using total climate impact", function() {
        var budget = {
          'id': 43,
        };
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = -10.4;
        spyOn(budgetServiceMock, "copyBudgetByID").and.returnValue($q.when({'data': budget}));
        spyOn(budgetServiceMock, "adjustNetReturns").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(budgetServiceMock.adjustNetReturns.calls.argsFor(0)).toEqual([budget.id, controller.climate_budget.user_estimate]);
      });


      it("goes to budget editor state if user estimate is valid with budget id in state parameters", function() {
        var budget = {
          'id': 1,
        };
        $state.params = {
          'state': state,
          'region': region,
        };
        spyOn(budgetServiceMock, "createBudget").and.returnValue($q.when({'data': budget}));
        controller.climate_budget = climate_budget;
        controller.climate_budget.user_estimate = 10.0;
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["budgetEditor", {
          'module': "climate",
          'original': "post-impact",
          'budget': budget.id,
          'scenario': controller.climate_scenario.id,
          'climate_budget': controller.climate_budget.id,
          'state': state,
          'region': region,
        }]);
      });

    });

  });


})();
