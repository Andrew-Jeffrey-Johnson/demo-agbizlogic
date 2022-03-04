(function() {
  'use strict';

  describe("Plan Create Component", function() {
    var controller,
        $scope,
        $q,
        $state,
        $uibModal,
        commonServiceMock,
        modalServiceMock,
        budgetServiceMock,
        scenarioServiceMock;

    beforeEach(module("scenarioModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      $uibModal = $injector.get("$uibModal");
      commonServiceMock = $injector.get("commonServiceMock");
      modalServiceMock = $injector.get("modalServiceMock");
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("planCreate", {
        commonService: commonServiceMock,
        modalService: modalServiceMock,
        scenarioService: scenarioServiceMock,
        budgetService: budgetServiceMock
      });

      spyOn($uibModal, "open").and.returnValue({'result': $q.when()});
      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 1,
          'plan_budgets': [],
        };
      });


      it("checks state parameters for plan id and calls data service to retrieve plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        $state.params = {'plan': 1};
        //console.log($scope);
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[0]).toEqual(1);
        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[1]).toEqual(["id", "title", "notes", "plan_budgets", 'created_date', 'modified_date']);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no plan in state query parameters", function() {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planManager");
      });


      it("sets budgets_needed flag if plan budget list is empty", function() {
        $state.params = {'plan': plan.id};
        spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': plan}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.budgets_needed).toEqual(true);
      });


      it("sets budgets_allowed flag if plan budget list is under limit", function() {
        $state.params = {'plan': plan.id};
        controller.$onInit();
        $scope.$digest();

        expect(controller.budgets_allowed).toEqual(true);
      });


      it("calls data service to retrieve current logged in user", function() {
        $state.params = {'plan': plan.id};
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
        expect(controller.user).toBeDefined();
      });


      it("calls data service to retrieve budget list for current user", function() {
        $state.params = {'plan': plan.id};
        spyOn(budgetServiceMock, "listBudgets").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.listBudgets).toHaveBeenCalled();
        expect(controller.user_budgets).toBeDefined();
      });


      it("calls data service to retrieve university budget list", function() {
        $state.params = {'plan': plan.id};
        spyOn(budgetServiceMock, "listUniversityBudgets").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(budgetServiceMock.listUniversityBudgets).toHaveBeenCalled();
        expect(controller.university_budget_list).toBeDefined();
      });


      it("calls modal service to alert user that they do not have any budgets if returned list is empty", function () {
        spyOn(modalServiceMock, "alert").and.callThrough();
        $state.params = {'plan': plan.id};
        spyOn(budgetServiceMock, "listBudgets").and.returnValue($q.when({'data': []}));
        controller.$onInit();
        $scope.$digest();

        expect(modalServiceMock.alert).toHaveBeenCalled();
      });

    });



    describe("updatePlan", function() {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 23,
          'title': "New Plan",
          'notes': "Some notes",
          'plan_budgets': [],
        };
      });


      it("does nothing if given 'plan' is undefined", function() {
        spyOn(scenarioServiceMock, "updatePlan").and.callThrough();
        controller.updatePlan();
        $scope.$digest();

        expect(scenarioServiceMock.updatePlan).not.toHaveBeenCalled();
      });


      it("calls data service to update plan", function() {
        spyOn(scenarioServiceMock, "updatePlan").and.callThrough();
        controller.updatePlan(plan);
        $scope.$digest();

        expect(scenarioServiceMock.updatePlan.calls.argsFor(0)[0]).toEqual(plan);
      });


      it("sets 'plan' to equal the returned updated plan", function() {
        controller.plan = plan;
        var updated_plan = {
          'id': 23,
          'title': "Updated Title",
          'plan_budgets': [],
        };
        spyOn(scenarioServiceMock, "updatePlan").and.returnValue($q.when({'data': updated_plan}));
        controller.updatePlan(updated_plan);
        $scope.$digest();

        expect(controller.plan).toEqual(updated_plan);
      });

    });



    describe("updatePlanBudgets", function() {
      var plan_budgets,
          plan;

      beforeEach(function() {
        plan_budgets = [
          {
            'id': 3,
            'position': 1,
          },
          {
            'id': 4,
            'position': 2,
          },
        ];
        plan = {
          'id': 32,
          'plan_budgets': [
            {
              'id': 3,
              'position': 2,
            },
            {
              'id': 4,
              'position': 1,
            },
          ],
        };
        controller.plan = plan;
        spyOn(scenarioServiceMock, "updatePlanBudget").and.callThrough();
      });


      it("does nothing if given plan budget list is invalid", function() {
        controller.updatePlanBudgets();
        $scope.$digest();

        expect(scenarioServiceMock.updatePlanBudget).not.toHaveBeenCalled();
      });


      it("calls data service to update each plan budget in the plan", function() {
        controller.updatePlanBudgets(plan_budgets);
        $scope.$digest();

        expect(scenarioServiceMock.updatePlanBudget.calls.count()).toEqual(plan_budgets.length);
      });


      it("calls data service to retrieve updated plan if plan budgets were updated", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.updatePlanBudgets(plan_budgets);
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[0]).toEqual(plan.id);
        expect(scenarioServiceMock.retrievePlan.calls.argsFor(0)[1]).toEqual(["id", "title", "notes", "plan_budgets"]);
      });

    });



    describe("addPlanBudget", function() {
      var new_budget;

      beforeEach(function() {
        spyOn(budgetServiceMock, "createBudget").and.callThrough();
        spyOn(scenarioServiceMock, "createPlanBudget").and.callThrough();
        spyOn(scenarioServiceMock, "updatePlan").and.callThrough();
        controller.plan = {
          'plan_budgets': [
            {
              'budget': 1,
            },
          ],
        };
        controller.max_budgets = controller.plan.plan_budgets.length + 1;
        new_budget = {
          'id': 1,
          'title': "New Plan Budget",
        };
      });


      it("does nothing if passed budget does not have id", function() {
        controller.addPlanBudget({});
        $scope.$digest();

        expect(budgetServiceMock.createBudget).not.toHaveBeenCalled();
        expect(scenarioServiceMock.createPlanBudget).not.toHaveBeenCalled();
      });


      it("does nothing if budgets_allowed flag is false", function() {
        controller.budgets_allowed = false;
        controller.addPlanBudget(new_budget);
        $scope.$digest();

        expect(budgetServiceMock.createBudget).not.toHaveBeenCalled();
        expect(scenarioServiceMock.createPlanBudget).not.toHaveBeenCalled();
      });


      it("calls data service to generate plan budget associated with plan and provided budget", function() {
          spyOn(scenarioServiceMock, "generatePlanBudget").and.callThrough();
          controller.addPlanBudget(new_budget);
          $scope.$digest();

          expect(scenarioServiceMock.generatePlanBudget).toHaveBeenCalled();
          expect(controller.plan).toBeDefined();
      });


      it("calls data service to retrieve updated plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.addPlanBudget(new_budget);
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan).toHaveBeenCalled();
      });

    });



    describe("addUniversityBudget", function() {

      beforeEach(function() {
        spyOn(budgetServiceMock, "createFromUniversityBudget").and.callThrough();
        spyOn(controller, "addPlanBudget").and.returnValue();
      });


      it("does nothing if passed invalid 'id'", function() {
        controller.addUniversityBudget();
        $scope.$digest();

        expect(budgetServiceMock.createFromUniversityBudget).not.toHaveBeenCalled();
      });


      it("calls data service to create budget from given university budget 'id'", function() {
        var id = 1;
        controller.addUniversityBudget(id);
        $scope.$digest();

        expect(budgetServiceMock.createFromUniversityBudget.calls.argsFor(0)[0]).toEqual(id);
      });


      it("calls controller method to add plan budget using newly created budget id", function() {
        var id = 1;
        controller.addUniversityBudget(id);
        $scope.$digest();

        expect(controller.addPlanBudget.calls.argsFor(0)[0].id).toEqual(id);
      });

    });



    describe("removePlanBudget", function() {
      var plan_budget;

      beforeEach(function() {
        controller.user = {
          'username': "johncleese",
        };
        controller.plan = {
          'id': 1,
        };
        plan_budget = {
          'id': 1,
          'title': "Some Plan",
          'budget': 1,
        };
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
      });


      it("calls data service to destroy budget associated with provided plan budget", function() {
        controller.removePlanBudget(plan_budget);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget.calls.argsFor(0)).toContain(plan_budget.budget);
      });


      it("calls the data service to update the current plan", function() {
        spyOn(scenarioServiceMock, "retrievePlan").and.callThrough();
        controller.removePlanBudget(plan_budget);
        $scope.$digest();

        expect(scenarioServiceMock.retrievePlan).toHaveBeenCalled();
        expect(controller.plan).toBeDefined();
      });
    });



    describe("editBudget", function() {
      var budget;

      beforeEach(function() {
        controller.plan = {
          'id': 1,
        };
        budget = {
          'id': 1,
          'title': "Budget 1",
          'income_items': [
            {
              'id': 1,
            },
          ],
          'cost_items': [
            {
              'id': 1,
            },
          ],
        }
      });


      it("does nothing if provided budget does not have id", function() {
        spyOn(scenarioServiceMock, "generatePlanBudget").and.callThrough();
        budget = {};

        controller.editBudget(budget);
        $scope.$digest();

        expect(scenarioServiceMock.generatePlanBudget).not.toHaveBeenCalled();
      });


      it("calls data service to generate plan budget associated with plan and provided budget", function() {
          spyOn(scenarioServiceMock, "generatePlanBudget").and.callThrough();
          controller.editBudget(budget);
          $scope.$digest();

          expect(scenarioServiceMock.generatePlanBudget).toHaveBeenCalled();
      });


      it("calls data service to retrieve the new budget", function () {
        spyOn(budgetServiceMock, "retrieveBudget").and.callThrough();
        controller.editBudget(budget);
        $scope.$digest();

        expect(budgetServiceMock.retrieveBudget).toHaveBeenCalled();
      });


      it("goes to budget editor state with budget id in query parameters", function() {
        controller.editBudget(budget);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["budgetEditor", {
          'budget': budget.id,
        }]);
      });
    });



    describe("proceed", function() {

      beforeEach(function() {
        spyOn(scenarioServiceMock, "updatePlan").and.callThrough();

        controller.plan = {
          'id': 1,
          'title': "My Awesome Plan",
          'notes': "Some notes",
          'plan_budgets': [
            {
              'id': 1,
            },
          ],
        };
      });


      it("does nothing if budgets_needed flag is true", function() {
        controller.plan.plan_budgets = [];
        controller.proceed();
        $scope.$digest();

        expect(scenarioServiceMock.updatePlan).not.toHaveBeenCalled();
      });


      it("calls data service to save plan title and notes", function() {
        controller.proceed();
        $scope.$digest();

        expect(scenarioServiceMock.updatePlan.calls.argsFor(0)[0]).toEqual(controller.plan);
      });


      it("goes to plan time period state with query parameter of plan id", function() {
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planTimePeriod", {'plan': controller.plan.id});
      });

    });



    describe("cancel", function() {

      beforeEach(function() {
        controller.plan = {
          'id': 1,
          'plan_budgets': [
            {
              'id': 1,
              'budget': 12,
            },
            {
              'id': 2,
              'budget': 13,
            },
          ],
        };
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
        spyOn(scenarioServiceMock, "destroyPlan").and.callThrough();
      });


      it("calls data service to delete all budgets associated with plan budgets", function() {
        controller.cancel();
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget.calls.count()).toEqual(controller.plan.plan_budgets.length);
      });


      it("calls data service to delete the plan", function() {
        controller.cancel();
        $scope.$digest();

        expect(scenarioServiceMock.destroyPlan).toHaveBeenCalled();
      });


      it("goes to manager state", function() {
        controller.cancel();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planManager");
      });
    });



  });


}());
