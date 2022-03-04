(function() {
  'use strict';


  describe("Climate Create Scenario Component", function() {
    var $scope,
        controller,
        $q,
        $state,
        user,
        budgets,
        budgetServiceMock,
        climateServiceMock,
        commonServiceMock,
        climate_budgets,
        scenario;

    beforeEach(module("climateModule"));
    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      budgetServiceMock = $injector.get("budgetServiceMock");
      climateServiceMock = $injector.get("climateServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("climateCreateScenario", {
        $scope: $scope,
        budgetService: budgetServiceMock,
        climateService: climateServiceMock,
        commonService: commonServiceMock,
      });

      scenario = {
          'id': 1,
          'title': "Scenario 1",
          'notes': "Notes here",
          'climate_budgets': [
            {
              'id': 1,
              'title': "Budget 1 (Climate)",
              'budget': 2,
            },
            {
              'id': 2,
              'title': "Budget 2 (Climate)",
              'budget': 3,
            }
          ]
        };
        climate_budgets = [
          {
            'title': "Budget 1 (Climate)"
          },
          {
            'title': "Budget 2 (Climate)"
          }
        ];
        budgets = [
          {
            'id': 1,
            'title': "Budget 1",
            'notes': "Notes",
            'income_items': [
              {
                'id': 1,
              }
            ],
            'cost_items': [
              {
                'id': 1,
              }
            ],
          },
          {
            'title': "Budget 2"
          },
          {
            'title': "Budget 3"
          },
          {
            'title': "Budget 4"
          },
          {
            'title': "Budget 5"
          },
        ];
        user = {
          'id': 1,
          'username': "Monty Python",
        };

        spyOn($state, "go").and.returnValue();

    }));



    describe("$onInit", function() {

      it("initializes 'confirm_cancel' to false", function () {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.confirm_cancel).toBe(false);
      });


      it("checks state parameters for scenario id and calls data service to retrieve scenario", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.callThrough();
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(climateServiceMock.retrieveScenario.calls.argsFor(0)).toContain(1);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no scenario in state query parameters", function() {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });


      it("goes to manager state if retrieved scenario is empty", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {}}));
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });


      it("checks state parameters for new flag and sets 'is_new'", function () {
        $state.params = {'new': "true", 'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.is_new).toBe(true);
      });


      it("sets 'is_new' to false if new flag state parameter is undefined", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.is_new).toBe(false);
      });


      it("sets budgets_allowed flag to 0 if over limit", function() {
        $state.params = {'scenario': 1};
        var full_scenario = {
          'id': 1,
          'title': "My Scenario",
          'climate_budgets': [1,1,1,1,1]
        };
        spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': full_scenario}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.budgets_allowed).toEqual(0);
      });


      it("calls data service to retrieve current user", function() {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).not.toHaveBeenCalled();
      });

    });



    describe("updateScenario", function() {
      var updated_scenario;

      beforeEach(function() {
        updated_scenario = {
          'id': 1,
          'title': "Super Cool New Scenario",
        };
      });


      it("calls data service to update the climate scenario", function () {
        spyOn(climateServiceMock, "updateScenario").and.returnValue($q.when({'data': updated_scenario}));
        controller.climate_scenario = scenario;
        controller.updateScenario();
        $scope.$digest();

        expect(climateServiceMock.updateScenario.calls.argsFor(0)).toEqual([scenario]);
        expect(controller.climate_scenario).not.toEqual(scenario);
      });
    });



    describe("addBudget", function() {

      it("will set error flags if budget is not selected", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = climate_budgets;
        spyOn(budgetServiceMock, "createBudget").and.callThrough();
        controller.addBudget({});
        $scope.$digest();

        expect(controller.is_error).not.toEqual(0);
        expect(budgetServiceMock.createBudget).not.toHaveBeenCalled();
      });


      it("will set error flag if over scenario budget limit", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = budgets;
        controller.budgets_allowed = 0;
        spyOn(budgetServiceMock, "createBudget").and.callThrough();
        controller.addBudget(budgets[0]);
        $scope.$digest();

        expect(budgetServiceMock.createBudget).not.toHaveBeenCalled();
        expect(controller.is_error).not.toEqual(0);
      });


      it("calls data service to generate new climate budget", function () {
        spyOn(climateServiceMock, "generateClimateBudget").and.callThrough();
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = climate_budgets;
        controller.addBudget(budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.generateClimateBudget).toHaveBeenCalled();
      });


      it('calls data service to update scenario', function() {
        controller.climate_scenario = scenario;
        spyOn(climateServiceMock, "updateScenario").and.callThrough();
        controller.addBudget(budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.updateScenario).toHaveBeenCalled();
        expect(controller.climate_scenario).toBeDefined();
      });


      it("sets the scenario title to default if blank", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.title = "";
        spyOn(climateServiceMock, "updateScenario");
        controller.addBudget(budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.updateScenario.calls.argsFor(0)[0].title).toContain('New Climate Scenario');
      });


      it("should set budgets_allowed flag if over limit", function() {
        controller.climate_scenario = scenario;
        for (var i = 0; i < 3; i++) { controller.climate_scenario.climate_budgets.push({}); }
        controller.addBudget(budgets[0]);
        $scope.$digest();

        expect(controller.budgets_allowed).not.toEqual(1);
      });
    });



    describe("removeBudget", function() {

      beforeEach(function() {
        spyOn(controller, "$onInit").and.returnValue();
      });


      it("should call data service to delete budget", function() {
        controller.climate_scenario = scenario;
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
        controller.removeBudget(scenario.climate_budgets[0]);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget).toHaveBeenCalled();
      });


      it("calls data service to retrieve updated ClimateScenario", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.callThrough();
        controller.climate_scenario = scenario;
        controller.removeBudget(scenario.climate_budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.retrieveScenario).toHaveBeenCalled();
      });


      it("should set budgets_allowed to 1 if under limit", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': scenario}));
        controller.budgets_allowed = 0;
        controller.climate_scenario = scenario;
        controller.removeBudget(scenario.climate_budgets[0]);
        $scope.$digest();

        expect(controller.budgets_allowed).toEqual(1);
      });


      it("should set budgets_allowed to 0 if over limit", function() {
        controller.budgets_allowed = 1;
        controller.climate_scenario = {'climate_budgets': [1,1,1,1,1,1]};
        controller.removeBudget(scenario.climate_budgets[0]);
        $scope.$digest();

        expect(controller.budgets_allowed).toEqual(0);
      });
    });



    describe("editBudget", function() {
      var stored_scenario,
          climate_budget;

      beforeEach(function() {
        controller.climate_scenario = {
          'id': 1,
        };
        climate_budget = {
          'id': 2,
          'budget': 45,
        };
      });


      it("calls data service to generate new climate budget", function () {
        spyOn(climateServiceMock, "generateClimateBudget").and.callThrough();
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = climate_budgets;
        controller.addBudget(budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.generateClimateBudget).toHaveBeenCalled();
      });


      it("calls data service to update scenario with defualt title if blank", function() {
        controller.climate_scenario = {'title': ""};
        spyOn(climateServiceMock, "updateScenario").and.callThrough();
        controller.editBudget(budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.updateScenario.calls.argsFor(0)[0].title).toContain("New Climate Scenario");
      });


      it("calls data service to update scenario with title if not blank", function() {
        controller.climate_scenario = {'title': "Title"};
        spyOn(climateServiceMock, "updateScenario").and.callThrough();
        controller.editBudget(budgets[0]);
        $scope.$digest();

        expect(climateServiceMock.updateScenario.calls.argsFor(0)[0].title).toContain("Title");
      });


      it("sets 'budgets_allowed' to 0 if scenario's climate budgets are equal to limit", function () {
        var climate_scenario = {
          'id': 3,
          'climate_budgets': [{}, {}, {}, {}, {}],
        };
        spyOn(climateServiceMock, "updateScenario").and.returnValue($q.when({'data': climate_scenario}));
        controller.editBudget(budgets[0]);
        $scope.$digest();

        expect(controller.budgets_allowed).toEqual(0);
      });


      it("should go to the budget editor state with correct state parameters", function() {
        spyOn(climateServiceMock, "generateClimateBudget").and.returnValue($q.when({'data': climate_budget}));
        controller.editBudget(budgets[0]);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("budgetEditor");
        expect($state.go.calls.argsFor(0)[1]).toEqual({
          'module': "climate",
          'original': "original",
          'scenario': controller.climate_scenario.id,
          'climate_budget': climate_budget.id,
          'budget': climate_budget.budget
        });
      });

    });



    describe("proceed", function() {

      it("sets error flag if scenario title is blank", function() {
        controller.climate_scenario = {'title': ""};
        controller.climate_scenario.climate_budgets = climate_budgets;

        controller.proceed();
        $scope.$digest();

        expect(controller.is_error).not.toEqual(0);
      });


      it("sets error flag if not at least one budget", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = [];

        controller.proceed();
        $scope.$digest();

        expect(controller.is_error).not.toEqual(0);
      });


      it("calls data service to update the current scenario", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = climate_budgets;
        spyOn(climateServiceMock, "updateScenario").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(climateServiceMock.updateScenario).toHaveBeenCalled();
        expect(controller.is_error).toEqual(0);
      });


      it("goes to region select state with scenario id in state parameters", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = climate_budgets;
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("regionSelect", {'scenario': controller.climate_scenario.id});
      });

    });



    describe("cancel", function() {

      it("should destroy climate scenario", function() {
        controller.climate_scenario = scenario;
        spyOn(climateServiceMock, "destroyScenario").and.callThrough();
        controller.cancel();
        $scope.$digest();

        expect(climateServiceMock.destroyScenario).toHaveBeenCalled();
      });


      it("should destroy associated budget objects", function() {
        controller.climate_scenario = scenario;
        controller.climate_scenario.climate_budgets = climate_budgets;
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
        controller.cancel();
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget).toHaveBeenCalled();
      });


      it("should go to the manager state", function() {
        controller.climate_scenario = scenario;
        controller.cancel();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });

    });



    describe("back", function () {

      it("goes to manager state", function () {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
      });


      it("does not call data service to destroy current scenario", function () {
        spyOn(climateServiceMock, "destroyScenario").and.callThrough();
        controller.back();
        $scope.$digest();

        expect(climateServiceMock.destroyScenario).not.toHaveBeenCalled();
      });

    });

  });

})();
