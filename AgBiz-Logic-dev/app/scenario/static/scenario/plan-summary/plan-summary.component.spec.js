(function() {
  'use strict';

  describe("Plan Summary Component", function() {
    var controller,
        $scope,
        $state,
        $q,
        budgetServiceMock,
        scenarioServiceMock;

    beforeEach(module("scenarioModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");
      var $componentController = $injector.get("$componentController");

      controller = $componentController("planSummary", {
        scenarioService: scenarioServiceMock,
        budgetService: budgetServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 1,
          'title': "Plan Title",
          'notes': "Notes about this plan",
        };
      });


      it("checks state parameters for plan id and calls data service to retrieve plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        $state.params = {'plan': 1};
        controller.$onInit();
        $scope.$digest();
        console.log("here");

        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[0]).toEqual(1);
        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[1]).toEqual(["id", "scenario", "title", "notes", "plan_budgets"]);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no plan in state query parameters", function() {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();
        console.log("here");

        expect($state.go.calls.argsFor(0)).toEqual(["planManager"]);
      });


      it("goes to manager state if plan is undefined", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["planManager"]);
      });
    });



    describe("loadBudget", function() {

      beforeEach(function() {
        controller.plan = {
          'plan_budgets': [
            {
              'budget': 1,
              'income_item_inflation_rates': [
                {
                  'income_item': 1,
                  'inflation_rate': 22.00,
                },
                {
                  'income_item': 2,
                  'inflation_rate': 12.43,
                },
              ],
              'cost_item_inflation_rates': [
                {
                  'cost_item': 1,
                  'inflation_rate': 76.00,
                },
                {
                  'cost_item': 2,
                  'inflation_rate': 54.32,
                },
              ]
            },
          ]
        };
      });


      it("calls data service to retrieve the given budget if not already stored", function() {
        controller.stored_budgets = [];
        spyOn(budgetServiceMock, "retrieveBudget").and.callThrough();
        controller.loadBudget(controller.plan.plan_budgets[0]);
        $scope.$digest();
        console.log("here2");
        console.log(budgetServiceMock.retrieveBudget.calls.argsFor(0));

        expect(budgetServiceMock.retrieveBudget.calls.argsFor(0)).toContain(controller.plan.plan_budgets[0].budget);
        expect(controller.current_budget).toBeDefined();
      });


      it("stores budget after calling data service", function() {
        controller.stored_budgets = [];
        spyOn(budgetServiceMock, "retrieveBudget").and.callThrough();
        controller.loadBudget(controller.plan.plan_budgets[0]);
        $scope.$digest();
        console.log("here3");

        expect(controller.stored_budgets.length).toEqual(1);
      });


      it("does not call data service if budget is already stored", function() {
        var budget = {
          'id': 1,
          'income_items': [],
          'cost_items': [],
        };
        controller.stored_budgets = [budget];
        spyOn(budgetServiceMock, "retrieveBudget").and.callThrough();
        controller.loadBudget(controller.plan.plan_budgets[0]);
        $scope.$digest();

        expect(budgetServiceMock.retrieveBudget).not.toHaveBeenCalled();
      });


      it("assigns the correct inflation rate to each income item in the budget", function() {
        var budget = {
          'id': 1,
          'income_items': [
            {
              'id': 1,
            },
            {
              'id': 2,
            }
          ],
          'cost_items': [
            {
              'id': 1,
            },
            {
              'id': 2,
            }
          ]
        };
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({'data': budget}));
        controller.loadBudget(controller.plan.plan_budgets[0]);
        $scope.$digest();
        console.log("here");

        controller.current_budget.income_items.forEach(function(income_item) {
          controller.plan.plan_budgets[0].income_item_inflation_rates.forEach(function(income_item_inflation_rate) {
            if (income_item.id == income_item_inflation_rate.income_item) {
              expect(income_item.inflation_rate).toEqual(income_item_inflation_rate.inflation_rate);
            }
          });
        });
      });


      it("assigns the correct inflation rate to each cost item in the budget", function() {
        var budget = {
          'id': 1,
          'income_items': [
            {
              'id': 1,
            },
            {
              'id': 2,
            },
          ],
          'cost_items': [
            {
              'id': 1,
            },
            {
              'id': 2,
            }
          ]
        };
        spyOn(budgetServiceMock, "retrieveBudget").and.returnValue($q.when({'data': budget}));
        controller.loadBudget(controller.plan.plan_budgets[0]);
        $scope.$digest();
        console.log("here");

        controller.current_budget.cost_items.forEach(function(cost_item) {
          controller.plan.plan_budgets[0].cost_item_inflation_rates.forEach(function(cost_item_inflation_rate) {
            if (cost_item.id == cost_item_inflation_rate.cost_item) {
              expect(cost_item.inflation_rate).toEqual(cost_item_inflation_rate.inflation_rate);
            }
          });
        });
      });
    });



    describe("back", function() {
      var module = 'profit';

      it("goes to plan total space state with plan id in state parameters", function() {
        controller.plan = {
          'id': 1,
        };
        controller.back();
        $scope.$digest();

        console.log("here1");

        expect($state.go.calls.argsFor(0)).toEqual(["planTotalSpace", {'plan': controller.plan.id, 'module': module}]);
      });
    });



    describe("proceed", function() {

      var module = 'profit';
      beforeEach(function() {
        controller.plan = {
          'id': 41,
        };
      });


      it("goes to scenario create state if plan's 'scenario' is defined", function() {
        controller.plan.scenario = 4;
        controller.proceed();
        $scope.$digest();

        console.log("here");
        console.log($state.go.calls.argsFor(0));

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioCreate", {'scenario': controller.plan.scenario, 'module' : module}]);
      });

    });

  });

}());
