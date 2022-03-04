(function() {
  'use strict';

  describe("ClimateRegionSelectController", function() {
    var $scope,
        $httpBackend,
        $state,
        $q,
        controller,
        climateServiceMock,
        commonServiceMock,
        scenario;

    beforeEach(module('climateModule'));
    beforeEach(module('mockModule'));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $q = $injector.get("$q");
      $state = $injector.get("$state");
      climateServiceMock = $injector.get("climateServiceMock");
      commonServiceMock = $injector.get("commonServiceMock");


      var $componentController = $injector.get("$componentController");
      controller = $componentController("climateRegionSelect", {
        climateService: climateServiceMock,
        commonService: commonServiceMock,
      });

      // Set up testing objects
      scenario = {
          'id': 1,
          'title': "Scenario 1",
          'notes': "Notes here",
          'projection_type': 'long',
          'climate_budgets': [
            {
              'id': 1,
            },
          ],
      },


      spyOn($state, "go").and.returnValue();
    }));



    describe("$onInit", function() {

      it("checks state parameters for scenario id and calls data service to retrieve scenario", function() {
        spyOn(climateServiceMock, "retrieveScenario").and.callThrough();
        $state.params = {'scenario': 1};
        var existing_factors = [];
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


      it("calls data service to retreieve region list", function() {
        spyOn(commonServiceMock, "retrieveRegionData").and.callThrough();
        $state.params = {'scenario': 1};
        expect(controller.region_data).toBeUndefined();
        controller.$onInit();
        $scope.$digest();

        expect(commonServiceMock.retrieveRegionData).toHaveBeenCalled();
        expect(controller.region_data).toBeDefined();
      });


      it("goes to manager state if retrieved region list is invalid", function() {
        spyOn(commonServiceMock, "retrieveRegionData").and.returnValue($q.when({'data': {}}));
        $state.params = {'scenario': 1};
        controller.$onInit();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });
    });



    describe("proceed", function() {

      it("sets error and does not change state if US State not selected", function() {
        controller.climate_scenario = scenario;
        controller.proceed();

        expect($state.go).not.toHaveBeenCalled();
        expect(controller.errors).not.toEqual(0);
      });


      it("goes to variable select state with scenario id, region data, and first budget id in state parameters", function() {
        controller.climate_scenario = scenario;
        controller.state = "Oregon";
        controller.region = "Benton";
        controller.type = "Future Climate Projection (2030s compared to historical baseline)";
        controller.proceed();

        expect($state.go.calls.argsFor(0)).toContain("variableSelect", {
          'scenario': controller.climate_scenario.id,
          'state': controller.state,
          'region': controller.region,
          'climate_budget': controller.climate_scenario.climate_budgets[0].id,
        });
      });

      it("goes to the data-impact page when a short term scenario is selected", function(){
        spyOn(climateServiceMock, "createFactor").and.callThrough();
        spyOn(climateServiceMock, "updateScenario").and.returnValue($q.when({'data': {
          "id": 2,
          "climate_budgets": [{"id": 1}],
        }}));
        controller.climate_scenario = scenario;
        controller.state = "Oregon";
        controller.region = "Benton";
        controller.type = "Seasonal Climate Forecast (six-month outlook)";
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("climateDataImpact", {
          'scenario': 2,
          'state': controller.state,
          'region': controller.region,
          'climate_budget': 1,
        });
      });

      it("Goes to the manager if the update scenario response is undefined", function (){
        spyOn(climateServiceMock, "createFactor").and.callThrough();
        spyOn(climateServiceMock, "updateScenario").and.returnValue($q.when({'data': {}}));

        controller.climate_scenario = scenario;
        controller.state = "Oregon";
        controller.region = "Benton";
        controller.type = "Seasonal Climate Forecast (six-month outlook)";
        controller.proceed();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("manager");
      });
    });



    describe("back", function() {
      it("goes to climate create state with scenario id in state parameters", function() {
        controller.climate_scenario = {'id': 1};
        controller.back();
        $scope.$digest();

        expect($state.go.calls.argsFor(0)).toContain("create", {'scenario': controller.climate_scenario.id});
      });
    });



    describe("setCountyOptions", function () {

      beforeEach(function() {
        controller.region_data = [
          {
            "state": "Oregon",
            "counties": [
              'Washington',
              'Portland'
            ]
          },
          {
            "state": "Arizona",
            "counties": [
              'Someplace',
              'Albacore'
            ]
          }
        ];
      });


      it("returns county option list of the matching 'state' in region data", function () {
        var county_options = controller.setCountyOptions("Oregon");
        $scope.$digest();

        expect(county_options).toEqual(controller.region_data[0].counties);
      });

    });

  });


})();
