describe("budgetService", function() {
  var budgetService,
      $httpBackend,
      url_base_budgets,
      url_base_budgets_generate,
      url_base_university_budgets,
      url_base_fixed_costs,
      url_base_variable_costs,
      url_base_general_costs,
      url_base_income,
      url_base_states_list,
      url_base_crop_cost_categories,
      url_base_livestock_cost_categories,
      url_base_crop_cost_data,
      url_base_livestock_cost_data,
      url_base_nursery_cost_data;

  beforeEach(module('budgetModule'));

  beforeEach(inject(function($injector) {
    budgetService = $injector.get("budgetService");
    $httpBackend = $injector.get("$httpBackend");
    url_base_budgets = '/budget/api/budgets/';
    url_base_budgets_generate = url_base_budgets + "generate/";
    url_base_university_budgets = '/university_budget/api/university_budgets/';
    url_base_fixed_costs = '/budget/api/fixed_cost_items/';
    url_base_variable_costs = '/budget/api/variable_cost_items/';
    url_base_general_costs = '/budget/api/general_cost_items/';
    url_base_income = '/budget/api/income_items/';
    url_base_states_list = '/static/json/states.json';
    url_base_crop_cost_categories = '/static/budget/json/crop_cost_categories.json';
    url_base_livestock_cost_categories = '/static/budget/json/livestock_cost_categories.json';
    url_base_crop_cost_data = '/static/budget/json/crop_cost_data.json';
    url_base_livestock_cost_data = '/static/budget/json/livestock_cost_data.json';
    url_base_nursery_cost_data = '/static/budget/json/nursery_cost_data.json';
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  describe("listBudgets", function() {
    var test_username,
        budget_list,
        fields;

    beforeEach(function() {
      fields = "";
      test_username = "johncleese";
      budget_list = [
        {
          'title': "Test Budget"
        }
      ];
    });


    it("accepts 'username' and undefined 'fields' arguments", function() {
      $httpBackend.expectGET(url_base_budgets + "?username=" + test_username + "&module=allocate")
      .respond(200, budget_list);

      budgetService.listBudgets(test_username, fields)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(1);
      });

      $httpBackend.flush();
    });


    it("accepts 'username' and empty string 'fields' arguments", function() {
      $httpBackend.expectGET(url_base_budgets + "?username=" + test_username  + "&module=allocate")
      .respond(200, budget_list);

      budgetService.listBudgets(test_username, fields)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(1);
      });

      $httpBackend.flush();
    });


    it("accepts a comma-seperated string of model fields as 'fields' argument and adds it to query parameters", function() {
      fields = "enterprise,descriptor1";

      $httpBackend.expectGET(url_base_budgets + "?username=" + test_username + "&fields=" + fields  + "&module=allocate")
      .respond(200, budget_list);

      budgetService.listBudgets(test_username, fields)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(budget_list);
      });

      $httpBackend.flush();
    });


    it("accepts a 'module_name' string argument and adds it to query parameters", function () {
      var module_name = "climate";

      $httpBackend.expectGET(url_base_budgets + "?username=" + test_username + "&module=" + module_name)
      .respond(200, budget_list);

      budgetService.listBudgets(test_username, fields, module_name)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(budget_list);
      });

      $httpBackend.flush();
    });


    it("uses 'allocate' as default 'module_name' string argument and adds it to query parameters", function () {
      $httpBackend.expectGET(url_base_budgets + "?username=" + test_username + "&module=allocate")
      .respond(200, budget_list);

      budgetService.listBudgets(test_username, fields)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(budget_list);
      });

      $httpBackend.flush();
    });

  });


  describe("listUniversityBudgets", function() {
    var university_budget_list;

    beforeEach(function() {
      university_budget_list = [
        {
          'title': "University Budget"
        }
      ];

      $httpBackend.expectGET(url_base_university_budgets)
      .respond(200, university_budget_list);
    });


    it("returns a list of University Budgets", function() {
      budgetService.listUniversityBudgets()
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(1);
      });

      $httpBackend.flush();
    });

  });



  describe("retrieveUniversityBudget", function () {
    var university_budget;

    beforeEach(function() {
      university_budget = {
        'id': 23,
        'title': "University Budget",
      };

      $httpBackend.expectGET(url_base_university_budgets + university_budget.id + "/")
      .respond(200, university_budget);
    });


    it("makes API call to retrieve UniversityBudget", function () {
      budgetService.retrieveUniversityBudget(university_budget.id)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(university_budget);
      });

      $httpBackend.flush();
    });

  });



  describe("createFromUniversityBudget", function () {
    var university_budget,
        budget;

    beforeEach(function () {
      university_budget = {
        'id': 21,
      };
      budget = {
        'id': 43,
        'title': "Budget 43",
      };

      $httpBackend.expectPOST(url_base_university_budgets + university_budget.id + "/create_budget/")
      .respond(201, budget);
    });


    it("makes API call to create a Budget given a UniversityBudget id", function () {
      budgetService.createFromUniversityBudget(university_budget.id)
      .then(function(response) {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual(budget);
      });

      $httpBackend.flush();
    });

  });



  describe("retrieveBudget", function() {
    var budget_id,
        budget;

    beforeEach(function() {
      budget_id = 1;
      budget = {
        'title': "Test Budget"
      };

      $httpBackend.expectGET(url_base_budgets + budget_id + "/")
      .respond(200, budget);
    });


    it("returns a specific budget using provided id", function() {
      budgetService.retrieveBudget(budget_id)
      .then(function(response) {
        expect(response.data).toEqual(budget);
      });

      $httpBackend.flush();
    });
  });



  describe("createBudget", function() {
    var budget;

    beforeEach(function() {
      budget = {
        'title': "Test Budget"
      };

      $httpBackend.expectPOST(url_base_budgets, budget)
      .respond(201, budget);
    });


    it("responds with HTTP 201 status", function() {
      budgetService.createBudget(budget)
      .then(function(response) {
        expect(response.status).toEqual(201);
      });

      $httpBackend.flush();
    });
  });



  describe("updateBudget", function() {
    var updated_budget;

    beforeEach(function() {
      updated_budget = {
        'id': 1,
        'title': "Updated Budget"
      };

      $httpBackend.expectPUT(url_base_budgets + updated_budget.id + "/", updated_budget)
      .respond(200, updated_budget);
    });


    it("responds with HTTP 200 status", function() {
      budgetService.updateBudget(updated_budget)
      .then(function(response) {
        expect(response.status).toEqual(200);
      });

      $httpBackend.flush();
    });
  });



  describe("destroyBudget", function() {
    var budget_id;

    beforeEach(function() {
      budget_id = 1;

      $httpBackend.expectDELETE(url_base_budgets + budget_id + "/")
      .respond(204, {});
    });


    it("responds with HTTP 204 status", function() {
      budgetService.destroyBudget(budget_id)
      .then(function(response) {
        expect(response.status).toEqual(204);
      });

      $httpBackend.flush();
    });
  });



  describe("combineBudgets", function() {
    var budgets;

    beforeEach(function() {
      budgets = [1, 2, 3];
      $httpBackend.expectPOST(url_base_budgets + "combine/", {'budgets': budgets})
      .respond(201, {});
    });


    it("responds with 201 status", function() {
      budgetService.combineBudgets(budgets)
      .then(function(response) {
        expect(response.status).toEqual(201);
      });

      $httpBackend.flush();
    });
  });



  describe("copyBudget", function () {
    var budget;

    beforeEach(function() {
      budget = {
        'id': 1,
      };
      $httpBackend.expectPOST(url_base_budgets + budget.id + "/copy/", {})
      .respond(201, budget);
    });


    it("responds with 201 status", function () {
      budgetService.copyBudget(budget)
      .then(function(response) {
        expect(response.status).toEqual(201);
      });

      $httpBackend.flush();
    });
  });



  describe("copyBudgetByID", function () {
    var budget;

    beforeEach(function() {
      budget = {
        'id': 1,
      };
      $httpBackend.expectPOST(url_base_budgets + budget.id + "/copy/", {})
      .respond(201, budget);
    });


    it("responds with 201 status", function () {
      budgetService.copyBudgetByID(budget.id)
      .then(function(response) {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual(budget);
      });

      $httpBackend.flush();
    });
  });



  describe("generateBudgets", function () {

    beforeEach(function() {
      $httpBackend.expectPOST(url_base_budgets_generate, {})
      .respond(201, []);
    });


    it("responds with 201 status", function () {
      budgetService.generateBudgets()
      .then(function(response) {
        expect(response.status).toEqual(201);
      });

      $httpBackend.flush();
    });
  });



  describe("adjustNetReturns", function () {
    var payload,
        percent,
        budget_id;

    beforeEach(function() {
      budget_id = 12;
      percent = 12.4;
      payload = {
        'percent': percent,
      };
      $httpBackend.expectPOST(url_base_budgets + budget_id + "/adjust_net_returns/", payload)
      .respond(200, {});
    });


    it("responds with 200 status", function () {
      budgetService.adjustNetReturns(budget_id, percent)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({});
      });

      $httpBackend.flush();
    });
  });



  describe("scaleFarmUnitQuantity", function() {
    var budget_id,
        new_farm_unit_quantity,
        payload;

    beforeEach(function() {
      budget_id = 43;
      new_farm_unit_quantity = 30;
      payload = {
        'new_farm_unit_quantity': new_farm_unit_quantity,
      };
      $httpBackend.expectPOST(url_base_budgets + budget_id + "/scale_farm_unit_quantity/", payload)
      .respond(200, {'status': "farm_unit_quantity updated"});
    });


    it("calls API endpoint to scale farm unit quantity", function() {
      budgetService.scaleFarmUnitQuantity(budget_id, new_farm_unit_quantity)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({'status': "farm_unit_quantity updated"});
      });

      $httpBackend.flush();
    });

  });



  describe("createBudgetItem", function() {
    var variable_cost_item,
        fixed_cost_item,
        income_item;

    beforeEach(function() {
      variable_cost_item = {
        'name': "Variable Cost"
      };
      fixed_cost_item = {
        'name': "Fixed Cost"
      };
      general_cost_item = {
        'name': "General Cost"
      };
      income_item = {
        'name': "Income"
      };
    });


    it("creates a variable cost item", function() {
      $httpBackend.expectPOST(url_base_variable_costs, variable_cost_item)
      .respond(201, variable_cost_item);

      budgetService.createBudgetItem("variable", variable_cost_item)
      .then(function(response) {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual(variable_cost_item);
      });

      $httpBackend.flush();
    });


    it("creates a fixed cost item", function() {
      $httpBackend.expectPOST(url_base_fixed_costs, fixed_cost_item)
      .respond(201, fixed_cost_item);

      budgetService.createBudgetItem("fixed", fixed_cost_item)
      .then(function(response) {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual(fixed_cost_item);
      });

      $httpBackend.flush();
    });


    it("creates a general cost item", function() {
      $httpBackend.expectPOST(url_base_general_costs, general_cost_item)
      .respond(201, general_cost_item);

      budgetService.createBudgetItem("general", general_cost_item)
      .then(function(response) {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual(general_cost_item);
      });

      $httpBackend.flush();
    });


    it("creates an income item", function() {
      $httpBackend.expectPOST(url_base_income, income_item)
      .respond(201, income_item);

      budgetService.createBudgetItem("income", income_item)
      .then(function(response) {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual(income_item);
      });

      $httpBackend.flush();
    });
  });



  describe("updateBudgetItem", function() {
    var variable_cost_item,
        fixed_cost_item,
        income_item;

    beforeEach(function() {
      variable_cost_item = {
        'id': 1,
        'name': "Updated Variable Cost"
      };
      fixed_cost_item = {
        'id': 1,
        'name': "Updated Fixed Cost"
      };
      income_item = {
        'id': 1,
        'name': "Updated Income"
      };
    });


    it("updates a variable cost item", function() {
      $httpBackend.expectPUT(url_base_variable_costs + variable_cost_item.id + "/", variable_cost_item)
      .respond(200, variable_cost_item);

      budgetService.updateBudgetItem("variable", variable_cost_item)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(variable_cost_item);
      });

      $httpBackend.flush();
    });


    it("updates a fixed cost item", function() {
      $httpBackend.expectPUT(url_base_fixed_costs + fixed_cost_item.id + "/", fixed_cost_item)
      .respond(200, fixed_cost_item);

      budgetService.updateBudgetItem("fixed", fixed_cost_item)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(fixed_cost_item);
      });

      $httpBackend.flush();
    });


    it("updates an income item", function() {
      $httpBackend.expectPUT(url_base_income + income_item.id + "/", income_item)
      .respond(200, income_item);

      budgetService.updateBudgetItem("income", income_item)
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(income_item);
      });

      $httpBackend.flush();
    });
  });



  describe("destroyBudgetItem", function() {
    var variable_cost_item,
        fixed_cost_item,
        income_item;

    beforeEach(function() {
      variable_cost_item = {
        'id': 1,
        'name': "Variable Cost"
      };
      fixed_cost_item = {
        'id': 1,
        'name': "Fixed Cost"
      };
      income_item = {
        'id': 1,
        'name': "Income"
      };
    });


  it("deletes a variable cost item", function() {
      $httpBackend.expectDELETE(url_base_variable_costs + variable_cost_item.id + "/")
      .respond(204, {});

      budgetService.destroyBudgetItem("variable", variable_cost_item.id)
      .then(function(response) {
        expect(response.status).toEqual(204);
      });

      $httpBackend.flush();
    });


    it("deletes a fixed cost item", function() {
      $httpBackend.expectDELETE(url_base_fixed_costs + fixed_cost_item.id + "/")
      .respond(204, {});

      budgetService.destroyBudgetItem("fixed", fixed_cost_item.id)
      .then(function(response) {
        expect(response.status).toEqual(204);
      });

      $httpBackend.flush();
    });


    it("deletes a general cost item", function() {
      $httpBackend.expectDELETE(url_base_general_costs + general_cost_item.id + "/")
      .respond(204, {});

      budgetService.destroyBudgetItem("general", general_cost_item.id)
      .then(function(response) {
        expect(response.status).toEqual(204);
      });

      $httpBackend.flush();
    });


    it("deletes an income item", function() {
      $httpBackend.expectDELETE(url_base_income + income_item.id + "/")
      .respond(204, {});

      budgetService.destroyBudgetItem("income", income_item.id)
      .then(function(response) {
        expect(response.status).toEqual(204);
      });

      $httpBackend.flush();
    });
  });



  describe("retrieveStatesList", function() {
    var states_list;

    beforeEach(function() {
      states_list = [
        {
          'name': "Oregon",
          'abbreviation': "OR"
        }
      ];
      $httpBackend.expectGET(url_base_states_list)
      .respond(200, states_list);
    });


    it("returns the list of U.S. states", function() {
      budgetService.retrieveStatesList()
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(states_list);
      });

      $httpBackend.flush();
    });
  });



  describe("retrieveBudgetCostCategories", function() {
    var crop_cost_categories,
        livestock_cost_categories;

    beforeEach(function() {
      crop_cost_categories = [
        {
          'name': "Pre-Plant",
          'value': "pre_plant"
        }
      ];
      livestock_cost_categories = [
        {
          "descriptor1": "Swine",
          "categories": [
            "Feed Costs",
            "Non-Feed Costs",
            "Pigs to 45 Pounds",
            "Grower Pigs",
            "Finishing Pigs",
            "Sows, Gilts, and Boars"
          ]
        },
        {
          "descriptor1": "Other",
          "categories": [
            "Feed Costs"
          ]
        }
      ];
    });


    it("returns correct list of cost categories when given 'Crop' and a budget descriptor1", function() {
      $httpBackend.expectGET(url_base_crop_cost_categories).respond(200, crop_cost_categories);

      budgetService.retrieveBudgetCostCategories('Crop', "Cereal Grains")
      .then(function(response) {
        expect(response.data).toEqual(crop_cost_categories);
      });

      $httpBackend.flush();
    });


    it("returns correct list of cost categories when given 'Livestock' and a budget descriptor1", function() {
      $httpBackend.expectGET(url_base_livestock_cost_categories).respond(200, livestock_cost_categories);

      budgetService.retrieveBudgetCostCategories('Livestock', "Swine")
      .then(function(response) {
        expect(response.data).toEqual(livestock_cost_categories[0]["categories"]);
      });

      $httpBackend.flush();
    });
  });



  describe("retrieveBudgetCostData", function() {
    var crop_cost_data;

    beforeEach(function() {
      crop_cost_data = [
        'crop_cost_data'
      ];
      livestock_cost_data = [
        'livestock_cost_data'
      ]
    });


    it("returns the list of crop cost data", function() {
      $httpBackend.expectGET(url_base_crop_cost_data).respond(200, crop_cost_data);

      budgetService.retrieveBudgetCostData('Crop')
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(crop_cost_data);
      });

      $httpBackend.flush();
    });


    it("returns the list of livestock cost data", function() {
      $httpBackend.expectGET(url_base_livestock_cost_data).respond(200, livestock_cost_data);

      budgetService.retrieveBudgetCostData('Livestock')
      .then(function(response) {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(livestock_cost_data);
      });

      $httpBackend.flush();
    });
  });
});
