(function() {
  'use strict';

  describe("Scenario Create Component", function() {
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
      controller = $componentController("scenarioCreate", {
        scenarioService: scenarioServiceMock,
        commonService: commonServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {

      it("initializes 'max_plans' to 5", function () {
        controller.$onInit();
        $scope.$digest();

        expect(controller.max_plans).toEqual(5);
      });


      it("checks state parameters for scenario id and calls data service to retrieve scenario", function() {
        spyOn(scenarioServiceMock, "retrieveScenario").and.callThrough();
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.retrieveScenario.calls.argsFor(0)).toEqual([1]);
        expect($state.go).not.toHaveBeenCalled();
      });


      it("changes to manager state if no scenario in state query parameters", function() {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
      });


      it("goes to manager state if retrieved scenario is empty", function() {
        spyOn(scenarioServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {}}));
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
      });

      it("sets 'plans_allowed' to true if scenario's plans list is less than 'max_plans'", function () {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.plans_allowed).toBe(true);
      });


      it("calls data service to retrieve current user", function () {
        spyOn(commonServiceMock, "retrieveCurrentUser").and.callThrough();
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveCurrentUser).toHaveBeenCalled();
      });


      it("calls data service to retrieve current user's plans", function () {
        spyOn(scenarioServiceMock, "listPlans").and.callThrough();
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.listPlans).toHaveBeenCalled();
      });

    });



    describe("updateScenario", function () {
      var scenario;

      beforeEach(function() {
        scenario = {
          'id': 32,
          'title': "My Scenario",
        };
        controller.form = {};
        //controller.form.name = 'My Scenario';
      });


      it("does nothing if scenario 'title' is empty string", function () {
        spyOn(scenarioServiceMock, "updateScenario").and.callThrough();
        controller.scenario = {};
        controller.updateScenario();
        $scope.$digest();

        expect(scenarioServiceMock.updateScenario).not.toHaveBeenCalled();
      });


      it("calls data service to update scenario", function () {
        spyOn(scenarioServiceMock, "updateScenario").and.callThrough();
        controller.scenario = scenario;
        controller.updateScenario();
        $scope.$digest();

        expect(scenarioServiceMock.updateScenario.calls.argsFor(0)).toEqual([controller.scenario]);
      });


      it("sets 'scenario' to equal updated scenario", function () {
        var updated_scenario = {
          'id': 32,
          'title': "Updated Scenario",
        };
        spyOn(scenarioServiceMock, "updateScenario").and.returnValue($q.when({'data': updated_scenario}));
        controller.scenario = updated_scenario;
        controller.updateScenario();
        $scope.$digest();

        expect(controller.scenario).toEqual(updated_scenario);
      });

    });



    describe("addPlan", function () {
      var plan;

      beforeEach(function() {
        controller.scenario = {
          'id': 74,
        };
        plan = {
          'id': 32,
          'scenario': 1,
        };
      });


      it("does nothing if given plan is invalid", function () {
        spyOn(scenarioServiceMock, "copyPlan").and.callThrough();
        controller.addPlan({});
        $scope.$digest();

        expect(scenarioServiceMock.copyPlan).not.toHaveBeenCalled();
      });

      //TODO: fix state reload breaking tests
      // it("calls data service to copy a new plan based on the given plan", function () {
      //   var scenario_id = controller.scenario.id;
      //   spyOn(scenarioServiceMock, "copyPlan").and.callThrough();
      //   console.log(plan);
      //   controller.addPlan(plan);
      //   $scope.$digest();
      //
      //   expect(scenarioServiceMock.copyPlan.calls.argsFor(0)).toEqual([plan.id, scenario_id]);
      // });
      //
      //
      // it("calls data service to retrieve current scenario if data service returns valid plan", function () {
      //   spyOn(scenarioServiceMock, "listPlansByScenario").and.callThrough();
      //   controller.addPlan(plan);
      //   $scope.$digest();
      //
      //   expect(scenarioServiceMock.listPlansByScenario).toHaveBeenCalled();
      //   expect(controller.scenario).toBeDefined();
      // });

    });


    describe("removePlan", function () {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 72,
        };
        controller.scenario = {
          'id': 80,
        };
      });


      it("does nothing if given scenario is invalid", function () {
        spyOn(scenarioServiceMock, "destroyPlan").and.callThrough();
        controller.removePlan({});
        $scope.$digest();

        expect(scenarioServiceMock.destroyPlan).not.toHaveBeenCalled();
      });

      it("calls data service to retrieve current scenario", function () {
        spyOn(scenarioServiceMock, "listPlansByScenario").and.callThrough();
        controller.removePlan(plan);
        $scope.$digest();

        expect(scenarioServiceMock.listPlansByScenario).toHaveBeenCalled();
      });

    });



    describe("newPlan", function () {

      var module = 'profit';

      beforeEach(function() {
        controller.scenario = {
          'id': 43,
        };
      });


      it("calls data service to create new plan", function () {
        spyOn(scenarioServiceMock, "createPlan").and.callThrough();
        controller.newPlan();
        $scope.$digest();

        expect(scenarioServiceMock.createPlan).toHaveBeenCalled();
      });


      it("goes to plan create state with new plan id in state parameters", function () {
        var plan = {
          'id': 32,
        };
        spyOn(scenarioServiceMock, "createPlan").and.returnValue($q.when({'data': plan}));
        controller.newPlan();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["planCreate", {
          'plan': plan.id, 'module' : module
        }]);
      });

    });



    describe("proceed", function () {
      var scenario;
      var module = 'profit';

      beforeEach(function() {
        scenario = {
          'id': 35,
          'title': "Cool Scenario",
        };
      });


      it("calls data service to update scenario", function () {
        controller.scenario = scenario;
        spyOn(scenarioServiceMock, "updateScenario").and.callThrough();
        controller.proceed();
        $scope.$digest();

        expect(scenarioServiceMock.updateScenario).toHaveBeenCalled();
      });


      it("goes to scenario discount rate state", function () {
        controller.scenario = scenario;
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioDiscountRate", {'scenario': controller.scenario.id , 'module' : 'profit'}]);
      });

    });



    describe("cancel", function () {
      var module = 'profit';
      beforeEach(function () {
        controller.scenario = {
          'id': 43
        };
      });


      it("calls data service to destroy current scenario", function () {
        spyOn(scenarioServiceMock, "destroyScenario").and.callThrough();
        controller.cancel();
        $scope.$digest();

        expect(scenarioServiceMock.destroyScenario.calls.argsFor(0)).toEqual([controller.scenario.id,]);
      });


      it("goes to manager state with scenario id in state parameters", function () {
        controller.cancel();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioManager",{'module': module}]);
      });

    });

  });

}());
