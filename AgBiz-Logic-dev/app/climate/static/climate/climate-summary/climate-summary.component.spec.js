(function() {
  'use strict';

  describe("ClimateSummaryController", function() {
    var $scope,
        $q,
        $state,
        controller,
        scenario,
        pre,
        post,
        climateServiceMock,
        budgetServiceMock;

    beforeEach(module("climateModule"));
    beforeEach(module("mockModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $state = $injector.get("$state");
      $q = $injector.get("$q");
      climateServiceMock = $injector.get("climateServiceMock");
      budgetServiceMock = $injector.get("budgetServiceMock");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("climateSummary", {
        climateService: climateServiceMock,
        budgetService: budgetServiceMock
      });

      scenario = {
        'id': 1,
        'title': "Climate Scenario",
        'notes': "Notes for Climate Scenario",
        'climate_budgets': [
          {
            'title': "Budget 1",
            'is_original': true,
            'notes': "Notes here",
            'net_returns': 100.00,
            'total_yields': 50
          },
          {
            'title': "Budget 1",
            'is_original': false,
            'notes': "Notes here",
            'net_returns': 200.00,
            'total_yields': 100
          },
          {
            'title': "Budget 2",
            'is_original': true,
            'notes': "Notes here",
            'net_returns': 50.00,
            'total_yields': 20
          },
          {
            'title': "Budget 2",
            'is_original': false,
            'notes': "Notes here",
            'net_returns': 60.00,
            'total_yields': 25
          },
          {
            'title': "Budget 3",
            'is_original': true,
            'notes': "Notes here",
            'net_returns': 20.00,
            'total_yields': 5
          },
          {
            'title': "Budget 3",
            'is_original': false,
            'notes': "Notes here",
            'net_returns': 50.00,
            'total_yields': 20
          },
          {
            'title': "Budget 4",
            'is_original': true,
            'notes': "Notes here",
            'net_returns': 83.00,
            'total_yields': 30
          },
          {
            'title': "Budget 4",
            'is_original': false,
            'notes': "Notes here",
            'net_returns': 30.00,
            'total_yields': 10
          },
          {
            'title': "Budget 5",
            'is_original': true,
            'notes': "Notes here",
            'net_returns': 28.00,
            'total_yields': 8
          },
          {
            'title': "Budget 5",
            'is_original': false,
            'notes': "Notes here",
            'net_returns': 14.00,
            'total_yields': 4
          }
        ]
      };
    }));

    beforeEach(function() {
      spyOn($state, "go").and.returnValue();
    });

    beforeEach(function() {
      // Chart data to test against
      pre = {
        labels: [],
        net_returns: [],
        total_yields: [],
      };
      post = {
        labels: [],
        net_returns: [],
        total_yields: [],
      };
      // Sort data into pre-climate impact and post-climate impact based on flag field
      angular.forEach(scenario.climate_budgets, function(budget, key) {
        if (budget.is_original) {
          pre.labels.push(budget.title);
          pre.net_returns.push(budget.net_returns);
          pre.total_yields.push(budget.total_yields);
        }
        else {
          post.net_returns.push(budget.net_returns);
          post.total_yields.push(budget.total_yields);
        }
      });
    });



    describe('$onInit', function() {

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


      it("goes to create state with climate scenario id in state parameters if retrieved scenario has no climate budgets", function() {
        $state.params = {'scenario': 1};
        var bad_scenario = {
          'id': 1,
          'climate_budgets': [],
        };
        spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': bad_scenario}));
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["create", {
          'scenario': bad_scenario.id,
        }]);
      });


      it('sets the chart data', function() {
        $state.params = {'scenario': 1};
        spyOn(climateServiceMock, "retrieveScenario").and.returnValue($q.when({'data': scenario}));
        controller.$onInit();
        $scope.$digest();

        expect(controller.chart_data['net_returns'].data[0]).toEqual(pre.net_returns);
        expect(controller.chart_data['net_returns'].data[1]).toEqual(post.net_returns);

        expect(controller.chart_data['total_yields'].labels).toEqual(pre.labels);
        expect(controller.chart_data['total_yields'].data[0]).toEqual(pre.total_yields);
        expect(controller.chart_data['total_yields'].data[1]).toEqual(post.total_yields);
      });

    });



    describe("back", function () {

      beforeEach(function() {
        controller.climate_scenario = {
          'id': 1,
        };
      });


      it("goes to scenario create state with climate scenario id in state parameters", function () {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["create", {
          'scenario': controller.climate_scenario.id,
        }]);
      });
    });



    describe("proceed", function() {

      it("should go to manager state", function() {
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });
    });


  });



})();
