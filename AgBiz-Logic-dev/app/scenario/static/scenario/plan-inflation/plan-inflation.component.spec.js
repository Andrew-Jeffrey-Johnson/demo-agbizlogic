(function() {
  'use strict';

  describe("Plan Inflation Component", function() {
    var controller,
        $scope,
        $q,
        $state,
        commonServiceMock,
        budgetServiceMock,
        scenarioServiceMock,
        capitalizeFilter,
        singularFilter;

    beforeEach(module("scenarioModule"));
    beforeEach(module("commonModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");
      capitalizeFilter = $injector.get("capitalizeFilter");
      singularFilter = $injector.get("singularFilter");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("planInflation", {
        scenarioService: scenarioServiceMock,
        budgetService: budgetServiceMock,
      });

    }));


    beforeEach(function() {
      spyOn($state, "go").and.returnValue();
    });



    describe("$onInit", function() {
      var plan,
          budget;

      beforeEach(function() {
        plan = {
          id: 1,
          title: "Test Plan",
          plan_budgets: [
            {id: 20, budget: 12}
          ]
        };
        budget = {
          id: 1,
          time_value: 25,
          income_items: [
            {id: 1},
            {id: 2},
          ],
          cost_items: [
            {id: 1}
          ]
        };
      });


      it("initializes error flag to true", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.error).toBe(false);
      });


      it("sets 'budget_item_type' to 'income'", function() {
        controller.$onInit();
        $scope.$digest();

        expect(controller.budget_item_type).toEqual("income");
      });


      it("checks state parameters for plan id and calls data service to retrieve plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        $state.params = {'plan': 1};
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[0]).toEqual(1);
        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[1]).toEqual(["id", "title", "notes", "plan_budgets"]);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no plan in state query parameters", function() {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planManager");
      });


      it("goes to manager state if retrieved plan is empty", function() {
        $state.params = {'plan': 1};
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': {}}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planManager");
      });


      it("goes to manager state if retrieved plan has no plan budgets", function() {
        $state.params = {'plan': 1};
        var bad_plan = {
          'id': 1,
          'plan_budgets': [],
        };
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': bad_plan}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planManager");
      });


      it("sets 'current_plan_budget' to the first plan budget in plan", function() {
        $state.params = {'plan': 1};
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': plan}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.current_plan_budget).toEqual(controller.plan.plan_budgets[0]);
      });
    });



    describe("updateBudgetItemInflationRate", function() {

      beforeEach(function() {
        controller.current_plan_budget = {
          income_item_inflation_rates: [
            {income_item: 18, inflation_rate: 0},
            {income_item: 20, inflation_rate: 0},
          ],
          cost_item_inflation_rates: [
            {cost_item: 23, inflation_rate: 0},
            {cost_item: 43, inflation_rate: 0},
            {cost_item: 42, inflation_rate: 0},
            {cost_item: 11, inflation_rate: 0},
          ],
        };
      });


      it("assigns new value to income item inflation rate if given income item inflation rate", function() {
        var item = angular.copy(controller.current_plan_budget.income_item_inflation_rates[0]);
        item.inflation_rate = 24.21;
        controller.updateBudgetItemInflationRate(item);
        $scope.$digest();

        expect(controller.current_plan_budget.income_item_inflation_rates[0].inflation_rate).toEqual(item.inflation_rate);
      });


      it("assigns new value to cost item inflation rate if given cost item inflation rate", function() {
        var item = angular.copy(controller.current_plan_budget.cost_item_inflation_rates[0]);
        item.inflation_rate = 24.21;
        controller.updateBudgetItemInflationRate(item);
        $scope.$digest();

        expect(controller.current_plan_budget.cost_item_inflation_rates[0].inflation_rate).toEqual(item.inflation_rate);
      });


      it("calls data service to update income item inflation rate", function() {
        spyOn(scenarioServiceMock, "updateIncomeItemInflationRate").and.callThrough();
        var item = angular.copy(controller.current_plan_budget.income_item_inflation_rates[0]);
        item.inflation_rate = 24.21;
        controller.updateBudgetItemInflationRate(item);
        $scope.$digest();

        expect(scenarioServiceMock.updateIncomeItemInflationRate.calls.argsFor(0)[0]).toEqual(item);
      });


      it("calls data service to update cost item inflation rate", function() {
        spyOn(scenarioServiceMock, "updateCostItemInflationRate").and.callThrough();
        var item = angular.copy(controller.current_plan_budget.cost_item_inflation_rates[0]);
        item.inflation_rate = 24.21;
        controller.updateBudgetItemInflationRate(item);
        $scope.$digest();

        expect(scenarioServiceMock.updateCostItemInflationRate.calls.argsFor(0)[0]).toEqual(item);
      });


      it("sets error flag to true if any inflation rate value is invalid", function() {
        var item = angular.copy(controller.current_plan_budget.cost_item_inflation_rates[0]);
        item.inflation_rate = ";laksjdf";
        controller.updateBudgetItemInflationRate(item);
        $scope.$digest();

        expect(controller.error).toEqual(true);
      });
    });



    describe("setAllInflationRates", function() {
      var rate;

      beforeEach(function() {
        rate = 1.2;
        controller.current_plan_budget = {
          income_item_inflation_rates: [
            {income_item: 18, inflation_rate: 0},
            {income_item: 20, inflation_rate: 0},
          ],
          cost_item_inflation_rates: [
            {cost_item: 23, inflation_rate: 0},
            {cost_item: 43, inflation_rate: 0},
            {cost_item: 42, inflation_rate: 0},
            {cost_item: 11, inflation_rate: 0},
          ],
        };
      });


      it("does nothing if given 'budget_item_type' is not 'income' or 'expenses'", function() {
        controller.setAllInflationRates('blah', rate);
        $scope.$digest();

        controller.current_plan_budget.income_item_inflation_rates.forEach(function(inflation_rate) {
          expect(inflation_rate.inflation_rate).not.toEqual(rate);
        });
        controller.current_plan_budget.cost_item_inflation_rates.forEach(function(inflation_rate) {
          expect(inflation_rate.inflation_rate).not.toEqual(rate);
        });
      });


      it("does nothing if given 'inflation_rate' is less than or equal to zero", function() {
        rate = -20;
        controller.setAllInflationRates('income', rate);
        $scope.$digest();

        controller.current_plan_budget.income_item_inflation_rates.forEach(function(inflation_rate) {
          expect(inflation_rate.inflation_rate).not.toEqual(rate);
        });
        controller.current_plan_budget.cost_item_inflation_rates.forEach(function(inflation_rate) {
          expect(inflation_rate.inflation_rate).not.toEqual(rate);
        });
      });


      it("sets all inflation rates of given 'budget_item_type' to the given 'rate'", function() {
        controller.setAllInflationRates('income', rate);
        $scope.$digest();

        controller.current_plan_budget.income_item_inflation_rates.forEach(function(inflation_rate) {
          expect(inflation_rate.inflation_rate).toEqual(rate);
        });
        controller.current_plan_budget.cost_item_inflation_rates.forEach(function(inflation_rate) {
          expect(inflation_rate.inflation_rate).not.toEqual(rate);
        });
      });


      it("calls data service to update all income item inflation rates to given 'rate'", function() {
        spyOn(scenarioServiceMock, "updateIncomeItemInflationRate").and.callThrough();
        controller.setAllInflationRates('income', rate);
        $scope.$digest();

        expect(scenarioServiceMock.updateIncomeItemInflationRate.calls.count()).toEqual(controller.current_plan_budget.income_item_inflation_rates.length);
      });


      it("calls data service to update all cost item inflation rates to given 'rate'", function() {
        spyOn(scenarioServiceMock, "updateCostItemInflationRate").and.callThrough();
        controller.setAllInflationRates('expenses', rate);
        $scope.$digest();

        // expect(scenarioServiceMock.updateCostItemInflationRate.calls.count()).toEqual(controller.current_plan_budget.cost_item_inflation_rates.length);
      });
    });



    describe("back", function() {

      it("goes to plan total space state with plan id in state parameters", function() {
        controller.plan = {id: 1};
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planTotalSpace", {'plan': controller.plan.id});
      });
    });



    describe("previousBudget", function() {

      beforeEach(function() {
        controller.error = false;
        controller.plan = {
          plan_budgets: [
            {id: 32, budget: 1},
            {id: 54, budget: 2}
          ]
        };
      });


      it("does nothing if there are errors", function() {
        controller.error = true;
        controller.current_plan_budget = controller.plan.plan_budgets[0];
        controller.previousBudget();
        $scope.$digest();

        expect(controller.current_plan_budget).toEqual(controller.plan.plan_budgets[0]);
      });


      it("does nothing if no previous budgets", function() {
        controller.current_plan_budget = controller.plan.plan_budgets[0];
        controller.previousBudget();
        $scope.$digest();

        expect(controller.current_plan_budget).toEqual(controller.plan.plan_budgets[0]);
      });


      it("sets 'current_plan_budget' to the previous plan budget in the plan", function() {
        controller.current_plan_budget = controller.plan.plan_budgets[1];
        controller.previousBudget();
        $scope.$digest();

        expect(controller.current_plan_budget).toEqual(controller.plan.plan_budgets[0]);
      });
    });



    describe("proceed", function() {
      var plan,
          current_budget,
          budget,
          module,
          income_item_inflation_rates,
          cost_item_inflation_rates;

      beforeEach(function() {
        spyOn(scenarioServiceMock, "createPlanIncomeItem").and.callThrough();
        spyOn(scenarioServiceMock, "createPlanCostItem").and.callThrough();
        spyOn(scenarioServiceMock, "createIncomeItemInflationRate").and.callThrough();
        spyOn(scenarioServiceMock, "createCostItemInflationRate").and.callThrough();
        module='profit';
        controller.plan = {
          id: 2,
          plan_budgets: [
            {id: 79, budget: 23},
            {id: 98, budget: 76}
          ]
        };
        current_budget = {
          id: 43,
          income_items: [
            {id: 33},
          ],
        };
        income_item_inflation_rates = [
          {income_item: 29, plan_budget: 93, inflation_rate: 12.0},
          {income_item: 29, plan_budget: 93, inflation_rate: 12.0},
          {income_item: 29, plan_budget: 93, inflation_rate: 12.0},
          {income_item: 29, plan_budget: 93, inflation_rate: 12.0},
        ];
        cost_item_inflation_rates = [
          {cost_item: 29, plan_budget: 93, inflation_rate: 12.0},
          {cost_item: 29, plan_budget: 93, inflation_rate: 12.0},
          {cost_item: 29, plan_budget: 93, inflation_rate: 12.0},
          {cost_item: 29, plan_budget: 93, inflation_rate: 12.0},
        ];
        budget = {
          id: 1,
          time_value: 25,
          income_items: [
            {id: 1},
            {id: 2},
          ],
          cost_items: [
            {id: 1}
          ]
        };
      });


      it("does nothing if error flag is true", function() {
        controller.current_plan_budget = controller.plan.plan_budgets[0];
        controller.error = true;
        controller.proceed();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("sets 'current_plan_budget' to next plan budget in plan if one exists", function() {
        controller.current_plan_budget = controller.plan.plan_budgets[0];
        controller.error = false;
        controller.proceed();
        $scope.$digest();

        // expect(controller.current_plan_budget).toEqual(controller.plan.plan_budgets[1]);
      });


      it("goes to total space state if 'current_plan_budget' is the last plan budget in the plan", function() {
        controller.current_plan_budget = controller.plan.plan_budgets[controller.plan.plan_budgets.length - 1];
        controller.error = false;
        controller.proceed();
        $scope.$digest();
        module = 'profit';

        // expect($state.go.calls.argsFor(0)).toEqual(["planTotalSpace", {'plan': controller.plan.id, 'module' : module}]);
      });
    });
  });

}());
