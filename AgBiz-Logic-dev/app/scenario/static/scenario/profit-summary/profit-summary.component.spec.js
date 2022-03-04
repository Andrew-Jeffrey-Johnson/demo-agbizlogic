(function() {
  'use strict';

  describe("Scenario Summary Component", function() {
    var $scope,
        $q,
        $state,
        lineChartColors,
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
      lineChartColors = $injector.get("lineChartColors");

      var $componentController = $injector.get("$componentController");
      controller = $componentController("profitSummary", {
        scenarioService: scenarioServiceMock,
        commonService: commonServiceMock,
      });

      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {

      it("goes to manager state if scenario id is not in state parameters", function () {
        $state.params = {};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioManager"]);
      });


      it("initializes 'module' to 'profit' if not in state parameters", function () {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.module).toEqual("profit");
      });


      it("initializes 'module' to equal state parameter", function () {
        var module = "lease";
        $state.params = {
          'module': module,
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.module).toEqual(module);
      });


      it("initializes 'summary_title' when 'module' equals 'profit'", function () {
        $state.params = {
          'scenario': 1,
          'module': "profit",
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.summary_title).toEqual("AgBizProfit Analysis");
      });


      it("initializes 'summary_title' when 'module' equals 'lease'", function () {
        $state.params = {
          'scenario': 1,
          'module': "lease",
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.summary_title).toEqual("AgBizLease Analysis");
      });


      it("initializes 'summary_title' when 'module' equals 'finance'", function () {
        $state.params = {
          'scenario': 1,
          'module': "finance",
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.summary_title).toEqual("AgBizFinance Analysis");
      });


      it("initializes 'summary_title' when 'module' equals 'environment'", function () {
        $state.params = {
          'scenario': 1,
          'module': "environment",
        };
        controller.$onInit();
        $scope.$digest();

        expect(controller.summary_title).toEqual("AgBizEnvironment Analysis");
      });


      it("initializes 'results_format' to 'graph'", function () {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.results_format).toEqual("graph");
      });


      it("initializes 'current_analysis_type' to 'net_present_value'", function () {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.current_analysis_type).toEqual("net_present_value");
      });


      it("calls data service to retrieve scenario with id in state parameters", function () {
        var scenario_id = 1;
        $state.params = {'scenario': scenario_id};
        spyOn(scenarioServiceMock, "retrieveScenario").and.callThrough();
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.retrieveScenario.calls.argsFor(0)).toEqual([scenario_id]);
        expect(controller.scenario).toBeDefined();
      });


      it("calls data service to retrieve IRR for each plan in retrieved scenario", function() {
        spyOn(scenarioServiceMock, "calculatePlanIRR").and.callThrough();
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(scenarioServiceMock.calculatePlanIRR.calls.count()).toEqual(controller.plans.length);
      });


      it("initializes 'chart'", function () {
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect(controller.chart.width).toEqual(1000);
        //expect(controller.chart.line_chart_colors).toEqual(lineChartColors["no_fill"]);
      });


      // it("initializes 'chart_data'", function () {
      //   $state.params = {'scenario': 1, 'plans':1};
      //   controller.$onInit();
      //   $scope.$digest();
      //
      //   expect(controller.chart_data).toBeDefined();
      //   expect(controller.chart_data["net_present_value"]).toBeDefined();
      //   //expect(controller.chart_data["internal_rate_of_return"]).toBeDefined();
      //   expect(controller.chart_data["cash_flow_breakeven"]).toBeDefined();
      //   expect(controller.chart_data["net_returns"]).toBeDefined();
      // });

      // TODO: More tests on chart data

    });



    describe("proceed", function () {

      var module = 'profit';
      beforeEach(function() {
        controller.scenario = {
          'id': 43
        };
      });
      it("goes to scenario manager state", function () {
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioCreate",{'scenario': controller.scenario.id, 'module' : module} ]);
      });

    });



    describe("back", function () {
      var module = 'profit';
      beforeEach(function() {
        controller.scenario = {
          'id': 43
        };
      });


      it("goes to scenario manager with scenario id in state parameters", function () {
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toEqual(["scenarioManager", {
          'module':module
        }]);
      });

    });

  });

}());
