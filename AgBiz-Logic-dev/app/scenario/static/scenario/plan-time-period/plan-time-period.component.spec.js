(function() {
  'use strict';

  describe("Component: Plan Time Period", function() {
    var controller,
        $scope,
        $q,
        $state,
        commonServiceMock,
        scenarioServiceMock;

    beforeEach(module("scenarioModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("planTimePeriod", {
        scenarioService: scenarioServiceMock,
      });
    }));


    beforeEach(function() {
      spyOn($state, "go").and.returnValue();
    });


    describe("$onInit", function() {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 1,
          'title': "Test Plan",
          'plan_budgets': [
            {
              'id': 1,
            }
          ],
        };
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
        spyOn(commonServiceMock, "accessStorage").and.returnValue($q.when({'data': plan}));
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

    });



    describe("duplicatePlanBudget", function() {
      var plan_budget,
          plan;

      beforeEach(function() {
        plan_budget = {
          'id': 32,
          'budget': 100,
        };
        plan = {
          'id': 23,
          'plan_budgets': [

          ],
        };
        controller.plan = plan;
        spyOn(scenarioServiceMock, "generatePlanBudget").and.callThrough();
        spyOn(scenarioServiceMock, "updatePlanBudget").and.callThrough();
      });


      it("does nothing if given 'plan_budget' is invalid", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.duplicatePlanBudget();
        $scope.$digest();

        expect(scenarioServiceMock.generatePlanBudget).not.toHaveBeenCalled();
        expect(scenarioServiceMock.updatePlanBudget).not.toHaveBeenCalled();
        expect(scenarioServiceMock.retrievePlan).not.toHaveBeenCalled();
      });


      it("calls data service to generate new PlanBudget based on given 'plan_budget'", function() {
        controller.duplicatePlanBudget(plan_budget);
        $scope.$digest();

        expect(scenarioServiceMock.generatePlanBudget.calls.argsFor(0)[0]).toEqual(plan.id);
        expect(scenarioServiceMock.generatePlanBudget.calls.argsFor(0)[1]).toEqual(plan_budget.budget);
      });


      it("calls data service to update new PlanBudget's position field to 1 higher than given 'plan_budget'", function() {
        controller.duplicatePlanBudget(plan_budget);
        $scope.$digest();

        expect(scenarioServiceMock.updatePlanBudget.calls.argsFor(0)[0].position).toEqual(plan_budget.position + 1);
      });


      it("calls data service to retrieve updated Plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.duplicatePlanBudget(plan_budget);
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[0]).toEqual(plan.id);
        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[1]).toEqual([
          "id", "title", "notes", "time_period_unit", "time_period_value", "plan_budgets",
        ]);
      });


      it("sets 'plan' to the retrieved plan response", function() {
        var updated_plan = {
          'id': 23,
          'time_period_unit': "Day",
        };
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': updated_plan}));
        controller.duplicatePlanBudget(plan_budget);
        $scope.$digest();

        expect(controller.plan).toEqual(updated_plan);
      });

    });



    describe("removePlanBudget", function() {
      var plan_budget,
          plan;

      beforeEach(function() {
        plan_budget = {
          'id': 32,
          'budget': 100,
        };
        plan = {
          'id': 23,
          'plan_budgets': [

          ],
        };
        controller.plan = plan;
        spyOn(scenarioServiceMock, "destroyPlanBudget").and.callThrough();
      });


      it("does nothing if given 'plan_budget' is invalid", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.removePlanBudget();
        $scope.$digest();

        expect(scenarioServiceMock.destroyPlanBudget).not.toHaveBeenCalled();
        expect(scenarioServiceMock.retrievePlan).not.toHaveBeenCalled();
      });


      it("calls data service to destroy given 'plan_budget'", function() {
        controller.removePlanBudget(plan_budget);
        $scope.$digest();

        expect(scenarioServiceMock.destroyPlanBudget.calls.argsFor(0)[0]).toEqual(plan_budget.id);
      });


      it("calls data service to retrieve updated Plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.removePlanBudget(plan_budget);
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[0]).toEqual(plan.id);
        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[1]).toEqual([
          "id", "title", "notes", "time_period_unit", "time_period_value", "plan_budgets",
        ]);
      });


      it("sets 'plan' to the retrieved plan response", function() {
        var updated_plan = {
          'id': 23,
          'time_period_unit': "Day",
        };
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': updated_plan}));
        controller.removePlanBudget(plan_budget);
        $scope.$digest();

        expect(controller.plan).toEqual(updated_plan);
      });

    });



    describe("proceed", function() {

      beforeEach(function() {
        controller.plan = {
          'id': 1,
        };
      });


      it("goes to plan total space state", function() {
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planTotalSpace", {'plan': controller.plan.id});
      });
    });



    describe("back", function() {

      it("goes to plan create state with plan id in state parameters", function() {
        controller.plan = {
          'id': 1,
        };
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planCreate", {'plan': controller.plan.id});
      });
    });
  });

}());
