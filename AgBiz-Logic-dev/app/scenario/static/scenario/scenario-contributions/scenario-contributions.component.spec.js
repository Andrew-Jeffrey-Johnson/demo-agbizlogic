(function() {
  'use strict';

  describe("Scenario Contributions Component", function() {
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
      commonServiceMock = $injector.get("commonServiceMock");
      scenarioServiceMock = $injector.get("scenarioServiceMock");
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("scenarioContributions", {
        scenarioService: scenarioServiceMock,
        commonService: commonServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {

      it("initializes 'is_error' flag to false", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.is_error).toBe(false);
      });


      it("checks state parameters for scenario id and calls data service to retrieve scenario", function() {
        spyOn(scenarioServiceMock, "retrieveScenario").and.callThrough();
        $state.params = {'scenario': 1, 'role': "landowner"};
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.retrieveScenario.calls.argsFor(0)).toContain(1);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no scenario in state query parameters", function() {
        $state.params = {'role': "landowner"};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("scenarioManager");
      });


      it("goes to manager state if retrieved scenario is empty", function() {
        spyOn(scenarioServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {}}));
        $state.params = {'scenario': 1, 'role': "landowner"};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("scenarioManager");
      });


      it("goes to manager state if no 'role' in state query parameters", function() {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("scenarioManager");
      });


      it("goes to manager state if 'role' state query parameter is not 'landowner' or 'tenant", function() {
        $state.params = {'scenario': 1, 'role': "farmer"};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("scenarioManager");
      });


      it("initializes 'role' to state query parameter", function() {
        var role = "landowner";
        $state.params = {'scenario': 1, 'role': role};
        controller.$onInit();
        $scope.$digest();

        expect(controller.role).toEqual(role);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls data service to retrieve current user", function () {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        $state.params = {'scenario': 1, 'role': "tenant"};
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });

    });



    describe("updatePlan", function () {
      var plans;

      beforeEach(function() {
        controller.plans = [
          {
            'id': 32,
          },
          {
            'id': 89,
          },
        ];
        controller.scenario = {
          'id': 32,
        };
      });


      it("does nothing if 'plan_id' is undefined", function () {
        controller.updatePlan();
        $scope.$digest();

        expect(controller.plans[0]).not.toEqual(controller.plans[1]);
      });


      it("sets 'is_error' flag if 'discount_rate', 'beginning_investment', or 'ending_investment' are invalid", function () {
        var discount_rate = 100.000,
          beginning_investment = "lajds",
          ending_investment = "loqiwerc";
        controller.updatePlan(controller.plans[0].id, discount_rate, beginning_investment, ending_investment);
        $scope.$digest();

        expect(controller.is_error).toBe(true);
      });


      it("sets 'discount_rate', 'beginning_investment', and 'ending_investment' fields of plan with 'plan_id'", function () {
        var discount_rate = 12.2,
          beginning_investment = 5432.09,
          ending_investment = 32.11;
        controller.updatePlan(controller.plans[0].id, discount_rate, beginning_investment, ending_investment);
        $scope.$digest();

        expect(controller.plans[0].discount_rate).toEqual(discount_rate);
        expect(controller.plans[0].beginning_investment).toEqual(beginning_investment);
        expect(controller.plans[0].ending_investment).toEqual(ending_investment);
      });


      it("sets 'is_error' flag to false", function () {
        var discount_rate = 12.2,
          beginning_investment = 5432.09,
          ending_investment = 32.11;
        controller.updatePlan(controller.plans[0].id, discount_rate, beginning_investment, ending_investment);
        $scope.$digest();

        expect(controller.is_error).toBe(false);
      });

    });



    describe("proceed", function () {

      beforeEach(function() {
        controller.scenario = {
          'id': 76,
        };
        controller.plans = [
          {
            'id': 32,
          },
          {
            'id': 63,
          },
        ];
      });


      it("does nothing if 'is_error' flag is true", function () {
        spyOn(scenarioServiceMock, "updatePlan").and.callThrough();
        controller.is_error = true;
        controller.proceed();
        $scope.$digest();

        expect(scenarioServiceMock.updatePlan).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });


      it("calls data service to update each plan in scenario", function () {
        spyOn(scenarioServiceMock, "updatePlan").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(scenarioServiceMock.updatePlan.calls.count()).toEqual(controller.plans.length);
      });


      it("goes to scenario contributions state with 'tenant' and scenario id in state parameters if 'role' is 'landowner'", function () {
        controller.role = 'landowner';
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioContributions", {
          'scenario': controller.scenario.id,
          'role': 'tenant',
        }]);
      });


      it("goes to scenario manager state with if 'role' is 'tenant'", function () {
        controller.role = 'tenant';
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioManager"]);
      });

    });



    describe("back", function () {
      var module = 'profit';
      beforeEach(function() {
        controller.scenario = {
          'id': 32,
        };
      });


      it("goes to scenario create state with scenario id in state parameters", function () {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioCreate", {'scenario': controller.scenario.id,'module':module}])
      });
    });

  });

}());
