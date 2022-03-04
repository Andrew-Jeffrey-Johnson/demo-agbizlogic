(function() {
  'use strict';

    describe("Plan Total Space Component", function() {
      var $scope,
          $q,
          $state,
          commonServiceMock,
          scenarioServiceMock,
          controller;

      beforeEach(module("scenarioModule"));
      beforeEach(module("commonModule"));
      beforeEach(module("mockModule"));

      beforeEach(inject(function($injector) {
        var $componentController = $injector.get("$componentController");
        commonServiceMock = $injector.get("commonServiceMock");
        scenarioServiceMock = $injector.get("scenarioServiceMock");
        $scope = $injector.get("$rootScope");
        $q = $injector.get("$q");
        $state = $injector.get("$state");

        controller = $componentController("planTotalSpace", {
          scenarioService: scenarioServiceMock,
          commonService: commonServiceMock
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
            ]
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
          $state.params = {};
          var bad_plan = {
            'id': 1,
            'plan_budgets': [],
          };

          spyOn(commonServiceMock, "accessStorage").and.returnValue($q.when({'data': plan}));
          spyOn(scenarioServiceMock, "retrievePlan").and.returnValue($q.when({'data': bad_plan}));
          controller.$onInit();
          $scope.$digest();

          expect($state.go.calls.argsFor(0)).toContain("planManager");
        });
      });



      describe("updateData", function() {
        var space_units,
            total_space_available,
            total_space_used;

        beforeEach(function() {
          controller.plan = {
            'plan_budgets': [
              {
                'id': 1,
                'space_units': "acres",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 2,
                'space_units': "sq. miles",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 3,
                'space_units': "sq. ft.",
                'total_space_available': 0,
                'total_space_used': 0,
              },
            ]
          };
        });


        it("sets the space_units attribute of the budget with the passed id", function() {
          space_units = "acres";
          total_space_available = 200;
          total_space_used = 80;
          controller.updateData(controller.plan.plan_budgets[0].id, space_units, total_space_available, total_space_used);
          $scope.$digest();

          expect(controller.plan.plan_budgets[0].space_units).toEqual(space_units);
        });


        it("sets the total_space_available attribute of the budget with the passed id", function() {
          space_units = "acres";
          total_space_available = 200;
          total_space_used = 80;
          controller.updateData(controller.plan.plan_budgets[0].id, space_units, total_space_available, total_space_used);
          $scope.$digest();

          expect(controller.plan.plan_budgets[0].total_space_available).toEqual(total_space_available);
        });


        it("sets the total_space_used attribute of the budget with the passed id", function() {
          space_units = "acres";
          total_space_available = 200;
          total_space_used = 80;
          controller.updateData(controller.plan.plan_budgets[0].id, space_units, total_space_available, total_space_used);
          $scope.$digest();

          expect(controller.plan.plan_budgets[0].total_space_used).toEqual(total_space_used);
        });

      });



      describe("back", function() {

        it("goes to plan inflation rate state with plan id in state parameters", function() {
          controller.plan = {
            'id': 1,
          };
          controller.back();
          $scope.$digest();

          expect($state.go.calls.argsFor(0)).toContain("planTimePeriod", {'plan': controller.plan.id});
        });
      });



      describe("proceed", function() {
        var empty_plan,
            valid_plan;

        beforeEach(function() {
          empty_plan = {
            'plan_budgets': [
              {
                'id': 1,
                'space_units': "acres",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 2,
                'space_units': "sq. miles",
                'total_space_available': 0,
                'total_space_used': 0,
              },
              {
                'id': 3,
                'space_units': "sq. ft.",
                'total_space_available': 0,
                'total_space_used': 0,
              },
            ]
          };
          valid_plan = {
            'plan_budgets': [
              {
                'id': 1,
                'space_units': "acres",
                'total_space_available': 100,
                'total_space_used': 10,
              },
              {
                'id': 2,
                'space_units': "sq. miles",
                'total_space_available': 100,
                'total_space_used': 10,
              },
              {
                'id': 3,
                'space_units': "sq. ft.",
                'total_space_available': 100,
                'total_space_used': 10,
              },
            ]
          };
        });


        it("does nothing if any values are zero", function() {
          controller.plan = empty_plan;
          controller.proceed();
          $scope.$digest();

          expect($state.go).not.toHaveBeenCalled();
        });


        it("calls data service to update each plan budget", function() {
          spyOn(scenarioServiceMock, "updatePlanBudget").and.callThrough();
          controller.plan = valid_plan;
          controller.proceed();
          $scope.$digest();

          expect(scenarioServiceMock.updatePlanBudget.calls.count()).toEqual(controller.plan.plan_budgets.length);
        });


        it("goes to plan budget inflation state if all values are valid", function() {
          controller.plan = valid_plan;
          controller.proceed();
          $scope.$digest();

          expect($state.go.calls.argsFor(0)).toContain("planInflation", {'plan': controller.plan.id});
        });

      });

    });

}());
