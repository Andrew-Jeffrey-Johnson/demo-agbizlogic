(function() {
  'use strict';

  describe('Service: scenarioService', function() {
    var scenarioService,
        $scope,
        $http,
        $httpBackend,
        test_username,
        delete_response,
        url_base_plan_budgets,
        url_base_scenarios,
        url_base_plans,
        url_base_plan_income_items,
        url_base_plan_cost_items,
        url_base_income_item_inflation_rates,
        url_base_cost_item_inflation_rates;

    beforeEach(module("scenarioModule"));

    beforeEach(inject(function($injector) {
      $scope = $injector.get("$rootScope");
      $http = $injector.get("$http");
      $httpBackend = $injector.get("$httpBackend");
      scenarioService = $injector.get("scenarioService");
      test_username = "johncleese";
      delete_response = "no content found";
      url_base_plan_budgets = "/scenario/api/plan_budgets/";
      url_base_plans = "/scenario/api/plans/";
      url_base_scenarios = "/scenario/api/scenarios/";
      url_base_plan_income_items = "/scenario/api/plan_income_items/";
      url_base_plan_cost_items = "/scenario/api/plan_cost_items/";
      url_base_income_item_inflation_rates = "/scenario/api/income_item_inflation_rates/";
      url_base_cost_item_inflation_rates = "/scenario/api/cost_item_inflation_rates";

      spyOn($http, "get").and.callThrough();
      spyOn($http, "post").and.callThrough();
      spyOn($http, "put").and.callThrough();
      spyOn($http, "delete").and.callThrough();
    }));



    describe("setTimePeriod", function() {
      var plan;

      beforeEach(function() {
        plan = {
          'id': 1,
        };
      });


      it("makes HTTP call to API endpoint", function() {
        $httpBackend.expectPUT(url_base_plans + plan.id + "/set_time_period/")
        .respond(200, plan);

        scenarioService.setTimePeriod(plan)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan);
        });
      });

    });



    describe("Scenario CRUD operations", function() {
      var scenario_list;

      beforeEach(function() {
        scenario_list = [
          {
            'id': 1,
            'title': "Scenario 1",
          },
          {
            'id': 2,
            'title': "Scenario 2",
          },
        ];
      });


      it("can list scenarios associated with the provided username argument", function() {
        $httpBackend.expectGET(url_base_scenarios + "?username=" + test_username)
        .respond(200, scenario_list);

        scenarioService.listScenarios(test_username)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list);
        });

        $httpBackend.flush();
      });


      it("can list scenarios with the given 'fields' in query parameters", function() {
        var fields = ["plans", "id"];
        $httpBackend.expectGET(url_base_scenarios + "?username=" + test_username + "&fields=" + fields)
        .respond(200, scenario_list);

        scenarioService.listScenarios(test_username, fields)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list);
        });

        $httpBackend.flush();
      });


      it("can create a new scenario", function() {
        $httpBackend.expectPOST(url_base_scenarios, scenario_list[0])
            .respond(201, scenario_list[0]);

        scenarioService.createScenario(scenario_list[0])
            .then(function(response) {
              expect(response.status).toEqual(201);
              expect(response.data).toEqual(scenario_list[0]);
            });

        $httpBackend.flush();
      });


      it("can retrieve a scenario by id with the given 'fields' in query parameters", function() {
        var fields = ["id", "notes"];
        $httpBackend.expectGET(url_base_scenarios + scenario_list[0].id + "/?fields=" + fields)
            .respond(scenario_list[0]);

        scenarioService.retrieveScenario(scenario_list[0].id, fields)
            .then(function(response) {
              expect(response.status).toEqual(200);
              expect(response.data).toEqual(scenario_list[0]);
            });

        $httpBackend.flush();
      });


      it('can retrieve a scenario by id', function() {
        $httpBackend.expectGET(url_base_scenarios + scenario_list[0].id + "/")
        .respond(scenario_list[0]);

        scenarioService.retrieveScenario(scenario_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list[0]);
        });


        $httpBackend.flush();
      });


      it('can update a scenario by id', function() {
        $httpBackend.expectPUT(url_base_scenarios + scenario_list[0].id + "/", scenario_list[0])
        .respond(scenario_list[0]);

        scenarioService.updateScenario(scenario_list[0])
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(scenario_list[0]);
        });

        $httpBackend.flush();
      });


      it('can destroy a scenario by id', function() {
        $httpBackend.expectDELETE(url_base_scenarios + scenario_list[0].id + "/")
        .respond(204, delete_response);

        scenarioService.destroyScenario(scenario_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(204);
          expect(response.data).toEqual(delete_response);
        });

        $httpBackend.flush();
      });

    });



    describe('Plan CRUD operations', function() {
      var plan_list;

      beforeEach(function() {
        plan_list = [
          {
            'id': 1,
            'title': "Plan 1",
          },
        ];

      });


      it("can list plans associated with the provided username argument", function() {
        $httpBackend.expectGET(url_base_plans + "?username=" + test_username + "&module=original")
        .respond(200, plan_list);

        scenarioService.listPlans(test_username)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list);
        });

        $httpBackend.flush();
      });


      it("can list plans with the given 'module_name' in the query parameters", function () {
        var module_name = "original";
        $httpBackend.expectGET(url_base_plans + "?username=" + test_username + "&module=" + module_name)
        .respond(200, plan_list);

        scenarioService.listPlans(test_username, module_name)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list);
        });

        $httpBackend.flush();
      });


      it("can list plans with 'original' for the default 'module' argument if 'module_name' is undefined", function () {
        $httpBackend.expectGET(url_base_plans + "?username=" + test_username + "&module=original")
        .respond(200, plan_list);

        scenarioService.listPlans(test_username)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list);
        });

        $httpBackend.flush();
      });


      it("can list plans with the given 'fields' in query parameters", function() {
        var fields = ["id", "title", "created_date", "modified_date"];
        $httpBackend.expectGET(url_base_plans + "?username=" + test_username + "&module=original" + "&fields=" + fields)
        .respond(200, plan_list);

        scenarioService.listPlans(test_username, "original", fields)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list);
          expect($http.get.calls.argsFor(0)[0]).toContain(fields);
        });

        $httpBackend.flush();
      });


      it("can create a new plan", function() {
        $httpBackend.expectPOST(url_base_plans, plan_list[0])
            .respond(201, plan_list[0]);

        scenarioService.createPlan(plan_list[0])
            .then(function(response) {
              expect(response.status).toEqual(201);
              expect(response.data).toEqual(plan_list[0]);
            });

        $httpBackend.flush();
      });


      it('can retrieve a plan by id', function() {
        $httpBackend.expectGET(url_base_plans + plan_list[0].id + "/")
        .respond(plan_list[0]);

        scenarioService.retrievePlan(plan_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list[0]);
        });

        $httpBackend.flush();
      });


      it("can retrieve a plan by id with given 'fields' in query parameters", function() {
        var fields = ["id", "title", "created_date", "modified_date"];
        $httpBackend.expectGET(url_base_plans + plan_list[0].id + "/?fields=" + fields)
        .respond(200, plan_list[0]);

        scenarioService.retrievePlan(plan_list[0].id, fields)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list[0]);
          expect($http.get.calls.argsFor(0)[0]).toContain(fields);
        });

        $httpBackend.flush();
      });


      it('can update a plan by id', function() {
        $httpBackend.expectPUT(url_base_plans + plan_list[0].id + "/", plan_list[0])
        .respond(200, plan_list[0]);

        scenarioService.updatePlan(plan_list[0])
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_list[0]);
        });

        $httpBackend.flush();
      });


      it('can destroy a plan by id', function() {
        $httpBackend.expectDELETE(url_base_plans + plan_list[0].id + "/")
        .respond(204, delete_response);

        scenarioService.destroyPlan(plan_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(204);
          expect(response.data).toEqual(delete_response);
        });

        $httpBackend.flush();
      });


      it("calls API call to create copy of given plan", function () {
        var scenario_id = 15;
        $httpBackend.expectPOST(url_base_plans + plan_list[0].id + "/copy/")
        .respond(201, plan_list[0]);

        scenarioService.copyPlan(plan_list[0].id, scenario_id)
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(plan_list[0]);
        });

        $httpBackend.flush();
      });

    });



    describe("PlanBudget CRUD operations", function() {
      var plan_budget_list,
          parent_scenario;

      beforeEach(function() {
        test_username = "johncleese";
        delete_response = "no content found";
        plan_budget_list = [
          {
            'id': 1,
            'title': "Plan Budget",
          },
        ];
        parent_scenario = {
          'id': 1,
        };
      });


      it("can list plan budgets associated with the provided scenario id", function() {
        $httpBackend.expectGET(url_base_plan_budgets + "?scenario=" + parent_scenario.id)
        .respond(200, plan_budget_list);

        scenarioService.listPlanBudgets(parent_scenario.id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_budget_list);
        });

        $httpBackend.flush();
      });


      it("can create a new plan budget", function() {
        $httpBackend.expectPOST(url_base_plan_budgets, plan_budget_list[0])
        .respond(201, plan_budget_list[0]);

        scenarioService.createPlanBudget(plan_budget_list[0])
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(plan_budget_list[0]);
        });

        $httpBackend.flush();
      });


      it("can retrieve a plan budget by id", function() {
        $httpBackend.expectGET(url_base_plan_budgets + plan_budget_list[0].id + "/")
        .respond(200, plan_budget_list[0]);

        scenarioService.retrievePlanBudget(plan_budget_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_budget_list[0]);
        });

        $httpBackend.flush();
      });


      it("can update a plan budget by id", function() {
        $httpBackend.expectPUT(url_base_plan_budgets + plan_budget_list[0].id + "/")
        .respond(200, plan_budget_list[0]);

        scenarioService.updatePlanBudget(plan_budget_list[0])
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_budget_list[0]);
        });

        $httpBackend.flush();
      });


      it("can destroy a plan budget by id", function() {
        $httpBackend.expectDELETE(url_base_plan_budgets + plan_budget_list[0].id + "/")
        .respond(204, delete_response);

        scenarioService.destroyPlanBudget(plan_budget_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(204);
          expect(response.data).toEqual(delete_response);
        });

        $httpBackend.flush();
      });


      it("can generate a plan budget when given a plan id and budget id", function () {
        var plan_id = 1,
            budget_id = 3;

        $httpBackend.expectPOST(url_base_plan_budgets + "generate/")
        .respond(201, plan_budget_list[0]);

        scenarioService.generatePlanBudget(plan_id, budget_id)
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(plan_budget_list[0]);
        });

        $httpBackend.flush();
      });

    });



    describe("PlanBudget CRUD operations", function() {
      var plan_budget_list,
          parent_scenario;

      beforeEach(function() {
        test_username = "johncleese";
        delete_response = "no content found";
        plan_budget_list = [
          {
            'id': 1,
            'title': "Plan Budget",
          },
        ];
        parent_scenario = {
          'id': 1,
        };
      });


      it("can list plan budgets associated with the provided scenario id", function() {
        $httpBackend.expectGET(url_base_plan_budgets + "?scenario=" + parent_scenario.id)
        .respond(200, plan_budget_list);

        scenarioService.listPlanBudgets(parent_scenario.id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_budget_list);
        });
      });


      it("can create a new plan budget", function() {
        $httpBackend.expectPOST(url_base_plan_budgets, plan_budget_list[0])
        .respond(201, plan_budget_list[0]);

        scenarioService.createPlanBudget(plan_budget_list[0])
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(plan_budget_list[0]);
        });
      });


      it("can retrieve a plan budget by id", function() {
        $httpBackend.expectGET(url_base_plan_budgets + plan_budget_list[0].id)
        .respond(200, plan_budget_list[0]);

        scenarioService.retrievePlanBudget(plan_budget_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_budget_list[0]);
        });
      });


      it("can update a plan budget by id", function() {
        $httpBackend.expectPUT(url_base_plan_budgets + plan_budget_list[0].id)
        .respond(200, plan_budget_list[0]);

        scenarioService.updatePlanBudget(plan_budget_list[0])
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_budget_list[0]);
        });
      });


      it("can destroy a plan budget by id", function() {
        $httpBackend.expectDELETE(url_base_plan_budgets + plan_budget_list[0].id)
        .respond(204, delete_response);

        scenarioService.destroyPlanBudget(plan_budget_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(204);
          expect(response.data).toEqual(delete_response);
        });
      });

    });



    describe("PlanCostItem CRUD operations", function() {
      var plan_budget_id,
          plan_cost_item_list;

      beforeEach(function() {
        plan_budget_id = 1;
        plan_cost_item_list = [
          {
            'id': 1,
            'plan_budget': 1,
            'cost_item': 1,
          },
        ];
      });


      it("can list plan cost items associated with the provided plan budget id", function() {
        $httpBackend.expectGET(url_base_plan_cost_items + "?plan_budget=" + plan_budget_id)
        .respond(200, plan_cost_item_list);

        scenarioService.listPlanCostItems(plan_budget_id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_cost_item_list);
        });
      });


      it("can create a new plan cost item", function() {
        $httpBackend.expectPOST(url_base_plan_cost_items, plan_cost_item_list[0])
        .respond(201, plan_cost_item_list[0]);

        scenarioService.createPlanCostItem(plan_cost_item_list[0])
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(plan_cost_item_list[0]);
        });
      });


      it("can retrieve a plan cost item by id", function() {
        $httpBackend.expectGET(url_base_plan_cost_items + plan_cost_item_list[0].id)
        .respond(200, plan_cost_item_list[0]);

        scenarioService.retrievePlanCostItem(plan_cost_item_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_cost_item_list[0]);
        });
      });


      it("can update a plan cost item by id", function() {
        $httpBackend.expectPUT(url_base_plan_cost_items + plan_cost_item_list[0].id)
        .respond(200, plan_cost_item_list[0]);

        scenarioService.updatePlanCostItem(plan_cost_item_list[0])
        .then(function(response) {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual(plan_cost_item_list[0]);
        });
      });


      it("can destroy a plan cost item by id", function() {
        $httpBackend.expectDELETE(url_base_plan_cost_items + plan_cost_item_list[0].id)
        .respond(204, delete_response);

        scenarioService.destroyPlanCostItem(plan_cost_item_list[0].id)
        .then(function(response) {
          expect(response.status).toEqual(204);
          expect(response.data).toEqual(delete_response);
        });
      });

    });



    describe("createIncomeItemInflationRates", function() {
      var income_item_inflation_rate;

      it("can create a new IncomeItemInflationRate object", function() {
        income_item_inflation_rate = {
          'plan_budget': 1,
          'income_item': 2,
          'inflation_rate': 22.0,
        };
        $httpBackend.expectPOST(url_base_income_item_inflation_rates, income_item_inflation_rate)
        .respond(201, income_item_inflation_rate);

        scenarioService.createIncomeItemInflationRate(income_item_inflation_rate)
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(income_item_inflation_rate);
        });
      });
    });



    describe("createCostItemInflationRates", function() {
      var cost_item_inflation_rate;

      it("can create a new CostItemInflationRate object", function() {
        cost_item_inflation_rate = {
          'plan_budget': 1,
          'cost_item': 2,
          'inflation_rate': 12.2,
        };
        $httpBackend.expectPOST(url_base_cost_item_inflation_rates, cost_item_inflation_rate)
        .respond(201, cost_item_inflation_rate);

        scenarioService.createIncomeItemInflationRate(cost_item_inflation_rate)
        .then(function(response) {
          expect(response.status).toEqual(201);
          expect(response.data).toEqual(cost_item_inflation_rate);
        });
      });
    });


  });

})();
