describe("Route Component: ClimateBudgetEditorRoute", function() {
  var controller,
    $scope,
    $state,
    $httpBackend,
    $q,
    $window,
    budgetServiceMock,
    climateServiceMock;

  beforeEach(module('climateModule'));
  beforeEach(module('mockModule'));

  beforeEach(inject(function($injector) {
    $scope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q')
    $window = $injector.get('$window');
    budgetServiceMock = $injector.get("budgetServiceMock");
    climateServiceMock = $injector.get("climateServiceMock");

    var $componentController = $injector.get('$componentController');
    controller = $controller = $componentController('climateBudgetEditorRoute', {
      budgetService: budgetServiceMock,
      climateService: climateServiceMock,
      $scope: $scope
    });

    spyOn($state, "go").and.returnValue();
    spyOn($window.history, "back").and.returnValue();
    spyOn(budgetServiceMock, "destroyBudget").and.callThrough();
  }));



  describe("$onInit", function() {
    var budget_id,
        climate_budget,
        climate_scenario,
        is_original;

    beforeEach(function() {
      budget_id = 32;
      climate_budget = 4;
      climate_scenario = 6;
      is_original = 'original';
      $state.params = {
        'budget': budget_id,
        'climate_budget': climate_budget,
        'scenario': climate_scenario,
        'original': is_original,
      };
    });


    it("goes to manager state if state query parameters do not contain budget id", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      delete $state.params['budget'];
      controller.$onInit();
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
    });


    it("goes to manager state if state query parameters do not contain climate budget id", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      delete $state.params['climate_budget'];
      controller.$onInit();
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
    });


    it("goes to manager state if state query parameters do not contain climate scenario id", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      delete $state.params['scenario'];
      controller.$onInit();
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
    });


    it("goes to manager state if state query parameters do not contain original flag", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      delete $state.params['original'];
      controller.$onInit();
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["manager"]);
    });


    it("does not change state if query parameters are valid", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      controller.$onInit();
      $scope.$digest();

      expect($state.go).not.toHaveBeenCalled();
    });


    it("initializes 'budget' with budget id in state query parameters", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      controller.$onInit();

      expect(controller.budget.id).toEqual(budget_id);
    });

    it("initializes 'climate_budget' with climate budget id in state query parameters", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
        controller.$onInit();

        expect(controller.climate_budget.id).toEqual(climate_budget);        
    });

    it("initializes 'climate_scenario' with climate scenario id in state query parameters", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      controller.$onInit();
      $scope.$digest();

      expect(controller.climate_scenario.id).toEqual(climate_scenario);
    });

    it("initializes 'is_original' with original flag from state parameters", function() {
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {'id': 6}}));
      controller.$onInit();

      expect(controller.is_original).toEqual(true);
    });

    it("redirects to the manager if the scenario doesn't get loaded correctly", function(){
      spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': {}}));
      controller.$onInit();
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["manager"]);

    });

  });



  describe("onDiscard", function() {
    var budget;

    beforeEach(function() {
      budget = {id: 3};
    });


    it("calls $window service to go back", function() {
      controller.onDiscard({budget: budget});
      $scope.$digest();

      expect($window.history.back).toHaveBeenCalled();
    });

  });


  describe("onSave", function() {
    var budget;

    beforeEach(function() {
      budget = {id: 2};
      controller.climate_scenario = {
        'id': 1
      };
      controller.climate_budget = {
        'id': 4,
      };
    });


    //TODO: Write tests for short term scenario.

    it("sets expecting state change flag to true", function() {
      $state.params = {'original': "original"};
      controller.onSave({budget: budget});
      $scope.$digest();

      expect(controller.expected_change).toBe(true);
    });


    it("calls $window service to go back if 'is_original' is true", function() {
      controller.is_original = true;
      controller.onSave({budget: budget});
      $scope.$digest();

      expect($window.history.back).toHaveBeenCalled();
    });


    it("goes to variable select state parameter if 'is_original' is false", function() {
      controller.is_original = false;
      controller.onSave({budget: budget});
      $scope.$digest();

      expect($state.go.calls.argsFor(0)).toEqual(["variableSelect", {
        'original': "post-impact",
        'scenario': controller.climate_scenario.id,
        'climate_budget': controller.climate_budget.id,
        'state': controller.state,
        'region': controller.region,
      }]);
    });

  });

});