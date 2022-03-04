(function() {
  'use strict';

  describe("Plan Manager Component", function() {
    var $scope,
        $q,
        $state,
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

      var $componentController = $injector.get("$componentController");
      controller = $componentController("planManager", {
        scenarioService: scenarioServiceMock,
        commonService: commonServiceMock,
        budgetService: budgetServiceMock
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {
      var scenario;

      it("checks state parameters for Scenario id and calls data service to retrieve scenario", function() {
        scenario = {
          'id': 1,
          'plans': [
            {
              'id': 1,
              'title': "Test Plan",
              'notes': "Some plan notes here",

              'time_period_unit': "years",
              'time_period_value': 1,

              'discount_rate': 19.0,

              'beginning_investment': 100.00,
              'ending_investment': 200.00,

              'lease_type': "Default",
              'land_market_value': 1000.00,
              'annual_land_rate': 32.0,
              'required_roi': 20.0,
              'investment_inflation': 10.0,

              'plan_budgets': [
                {
                  'id': 1,
                  'plan': 1,
                  'budget': 12,
                  'title': "Winter Wheat",
                  'space_units': "",
                  'total_space_available': 0,
                  'total_space_used': 0,
                },
                {
                  'id': 2,
                  'plan': 1,
                  'budget': 13,
                  'title': "Canola Oil",
                  'space_units': "",
                  'total_space_available': 0,
                  'total_space_used': 0,
                },
                {
                  'id': 3,
                  'plan': 1,
                  'budget': 14,
                  'title': "Bison",
                  'space_units': "",
                  'total_space_available': 0,
                  'total_space_used': 0,
                },
                {
                  'id': 4,
                  'plan': 1,
                  'budget': 15,
                  'title': "Red Apples",
                  'space_units': "",
                  'total_space_available': 0,
                  'total_space_used': 0,
                },
              ]
            }
          ]
        };
        spyOn(scenarioServiceMock, "retrieveScenario").and.returnValue($q.when({'data': scenario}));
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        //expect(scenarioServiceMock.retrieveScenario.calls.argsFor(0)).toContain(1);
        expect(controller.plan_list).toEqual(scenario.plans);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls data service to retrieve current user if no Scenario id in state parameters", function() {
        $state.params = {};
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
        expect(controller.user).toBeDefined();
      });


      it("calls data service to list all plans with specific fields for current user if no Scenario id in state paramaters", function() {
        $state.params = {};
        spyOn(scenarioServiceMock, "listPlans").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.listPlans.calls.argsFor(0)[0]).toEqual(controller.user.username);
        expect(scenarioServiceMock.listPlans.calls.argsFor(0)[1]).toEqual("all");
        expect(scenarioServiceMock.listPlans.calls.argsFor(0)[2]).toEqual(["id", "title", "notes", "created_date", "modified_date", "scenario_list", "full_title"]);
        expect(controller.plan_list).toBeDefined();
      });

    });



    describe("newPlan", function() {
      var default_new_plan;

      beforeEach(function() {
        default_new_plan = {
          'title': "New Plan",
        };
      });


      it("creates and stores a new plan with default values using data services", function() {
        spyOn(scenarioServiceMock, "createPlan").and.callThrough();
        controller.newPlan();
        $scope.$digest();

        expect(scenarioServiceMock.createPlan).toHaveBeenCalled();
      });


      it("stores the newly created plan using data service", function() {
        spyOn(commonServiceMock, "pushStorage").and.callThrough();
        controller.newPlan();
        $scope.$digest();

        expect(commonServiceMock.pushStorage.calls.argsFor(0)[0].title).toContain(default_new_plan.title);
      });


      it("changes to next state", function() {
        controller.newPlan();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planCreate");
        // expect($state.go.calls.argsFor(0)).toContain({'plan': 1});
      });
    });



    describe("editPlan", function() {
      var item;

      it("does nothing if given plan is invalid", function() {
        controller.editPlan();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to plan summart view with given plan id in state parameters", function() {
        item = {
          'id': 1,
        };
        controller.editPlan(item);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planSummary", {'plan': item.id});
      });

    });



    describe("viewSummary", function() {
      var item;

      it("does nothing if given plan is invalid", function() {
        controller.viewSummary();
        $scope.$digest();

        expect($state.go).not.toHaveBeenCalled();
      });


      it("goes to plan summary state with the plan id in state parameters", function() {
        item = {
          'id': 1,
        };
        controller.viewSummary(item);
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("planSummary", {'plan': item.id});
      });

    });



    describe("removePlan", function() {
      var plan_to_delete,
          response;

      beforeEach(function() {
        response = $q.defer();

        controller.user = {
          'username': "johncleese",
        };
        plan_to_delete = {
          'id': 1,
          'title': "Existing Plan",
          'plan_budgets': [
            {
              'id': 1,
            },
          ],
        };
      });


      it("calls data service to delete associated budgets", function() {
        spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
        controller.removePlan(plan_to_delete);
        $scope.$digest();

        expect(budgetServiceMock.destroyBudget.calls.count()).toEqual(plan_to_delete.plan_budgets.length);
      });


      it("calls data service to delete given plan", function() {
        spyOn(scenarioServiceMock, "destroyPlan").and.callThrough();
        controller.removePlan(plan_to_delete);
        $scope.$digest();

        expect(scenarioServiceMock.destroyPlan.calls.argsFor(0)).toContain(plan_to_delete.id);
      });


      it("calls data service to reload plan list", function() {
        controller.plan_list = [{}, {}, {}];
        var initial_length = controller.plan_list.length;
        response.resolve({'data': [{}, {}]});
        spyOn(scenarioServiceMock, "listPlans").and.returnValue(response.promise);
        controller.removePlan(plan_to_delete);
        $scope.$digest();

        expect(scenarioServiceMock.listPlans).toHaveBeenCalled();
        expect(controller.plan_list.length).toEqual(initial_length - 1);
      });
    });
  });

}());
