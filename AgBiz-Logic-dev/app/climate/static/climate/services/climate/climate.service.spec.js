(function() {
  'use strict';

  describe("Service: climateService", function() {
    var climateService,
        url_base_scenarios,
        url_base_climate_budgets,
        url_base_climate_data,
        $scope,
        $httpBackend;


    beforeEach(module('climateModule'));

    beforeEach(inject(function($injector) {
      climateService = $injector.get('climateService');
      $httpBackend = $injector.get("$httpBackend");
      $scope = $injector.get("$rootScope");

      url_base_scenarios = "/climate/api/climate_scenarios/";
      url_base_climate_budgets = "/climate/api/climate_budgets/";
      url_base_climate_data = "/static/climate/json/";
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });



    describe("listScenarios", function() {
      var test_username,
          scenario_list;

      beforeEach(function() {
        test_username = "johncleese";
        scenario_list = [
          {
            'title': "Test Scenario"
          }
        ];
      });


      it("returns a list of scenarios associated with the provided username argument", function() {
        $httpBackend.expectGET(url_base_scenarios + "?username=" + test_username)
        .respond(200, scenario_list);

        climateService.listScenarios(test_username)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data.length).toEqual(1);
        });

        $httpBackend.flush();
      });


      it("returns an empty list if no username is provided", function() {
        $httpBackend.expectGET(url_base_scenarios + "?username=")
        .respond(200, []);

        climateService.listScenarios("")
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data.length).toEqual(0);
        });

        $httpBackend.flush();
      });
    });



    describe("ClimateScenario CRUD operations", function() {
      var scenario_list;

      beforeEach(function() {
        scenario_list = [
          {
            'id': 1,
            'title': "Test Scenario 1",
            'climate_budgets': [
              {
                'id': 1,
              },
            ]
          },
          {
            'id': 2,
            'title': "Test Scenario 2"
          }
        ];
      });


      it("should create using createScenario", function() {
        var new_scenario = {
          'title': "New Scenario",
        };

        $httpBackend.expectPOST(url_base_scenarios, new_scenario)
        .respond(201, new_scenario);

        climateService.createScenario(new_scenario)
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(new_scenario);
        });

        $httpBackend.flush();
      });


      it("should retrieve using retrieveScenario", function() {
        $httpBackend.expectGET(url_base_scenarios + scenario_list[0].id + "/")
        .respond(200, scenario_list[0]);

        climateService.retrieveScenario(scenario_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list[0]);
        });

        $httpBackend.flush();
      });


      it("should update using updateScenario", function() {
        var updated_scenario = {
          'id': 1,
          'title': "Updated Title",
        };

        $httpBackend.expectPUT(url_base_scenarios + updated_scenario.id + "/")
        .respond(200, updated_scenario);

        climateService.updateScenario(updated_scenario)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(updated_scenario);
        });

        $httpBackend.flush();
      });


      it("should destroy using destroyScenario", function() {
        $httpBackend.expectDELETE(url_base_scenarios + scenario_list[0].id + "/")
        .respond(204, "No Content");

        climateService.destroyScenario(scenario_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(204);
          expect(response.data).toEqual("No Content");
        });

        $httpBackend.flush();
      });


      it("can POST to scenario endpoint to retrieve next ClimateBudget", function () {
        $httpBackend.expectPOST(url_base_scenarios + scenario_list[0].id + "/next/", {
          'climate_budget': scenario_list[0].climate_budgets[0].id
        })
        .respond(200, scenario_list[0].climate_budgets[0]);

        climateService.retrieveNextClimateBudget(scenario_list[0].id, scenario_list[0].climate_budgets[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list[0].climate_budgets[0]);
        });

        $httpBackend.flush();
      });


      it("can GET to '/most_recent/' endpoint to retrieve the most recently edited ClimateScenario", function () {
        $httpBackend.expectGET(url_base_scenarios + "most_recent/")
        .respond(200, scenario_list[0]);

        climateService.retrieveMostRecentScenario()
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list[0]);
        });

        $httpBackend.flush();
      });

    });


    // TODO: Write CRUD unit tests
    describe("ClimateBudget REST API operations", function() {
      var climate_budget;

      beforeEach(function() {
        climate_budget = {
          'id': 2,
          'budget': 89,
          'scenario': 80,
        };
      });


      it("makes POST request to API endpoint to generate new climate budget", function () {
        var payload = {
          'budget': 2,
          'climate_scenario': 33,
        };
        $httpBackend.expectPOST(url_base_climate_budgets + "generate/", payload)
        .respond(201, climate_budget);

        climateService.generateClimateBudget(2, 33)
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(climate_budget);
        });

        $httpBackend.flush();
      });

    });


    // TODO: Write unit tests
    describe("ClimateFactor REST API operations", function() {

    });



    describe("retrieveAvailableFactors", function () {
      var projection_data,
          state,
          region;

      beforeEach(function() {
        state = "Alabama";
        region = "Autauga";
        projection_data = {
          "Warm Days Frequency": {
              "name": "Warm Days Frequency",
              "historic-max": [137.0],
              "historic-mean": [113.0],
              "historic-min": [135.0]
          },
        };

        $httpBackend.expectGET(url_base_climate_data+state+'/'+region+'.json')
        .respond(200, projection_data);
      });


      it("makes GET request to retrieve climate data JSON", function () {
        climateService.retrieveAvailableFactors(state, region)
        .then(function(response) {
          expect(response.data.length).toEqual(Object.keys(projection_data).length);
        });

        $httpBackend.flush();
      });

    });



    describe("retrieveFactorProjections", function() {
      var factor,
          projection_data,
          state,
          region;

      beforeEach(function() {
        state = "Alabama";
        region = "Autauga";

        factor = {
          "name": "Warm Days Frequency",
          "state": state,
          "region": region
        };
        projection_data = {
          "Warm Days Frequency": {
              "name": "Warm Days Frequency",
              "historic-max": [137.0],
              "historic-mean": [113.0],
              "historic-min": [135.0]
          },
        };

        $httpBackend.expectGET(url_base_climate_data+state+'/'+region+'.json')
        .respond(200, projection_data);
      });


      it("makes GET request to retrieve climate data JSON", function () {
        climateService.retrieveFactorProjections(factor)
        .then(function(response) {
          expect(response.data.name).toEqual(projection_data[factor['name']]['name']);
        });

        $httpBackend.flush();
      });

    });


  });


})();
