(function() {
  'use strict';

  angular
    .module('mockModule')
    .factory("budgetServiceMock", budgetServiceMock);

  budgetServiceMock.$inject = [
    "$q"
  ];


  function budgetServiceMock($q) {
    var budgetServiceMock = {
      budgets: budgets,

      listUniversityBudgets: listUniversityBudgets,
      retrieveUniversityBudget: retrieveUniversityBudget,
      createFromUniversityBudget: createFromUniversityBudget,

      listBudgets: listBudgets,
      createBudget: createBudget,
      retrieveBudget: retrieveBudget,
      updateBudget: updateBudget,
      destroyBudget: destroyBudget,
      combineBudgets: combineBudgets,
      copyBudget: copyBudget,
      copyBudgetByID: copyBudgetByID,
      generateBudgets: generateBudgets,
      adjustNetReturns: adjustNetReturns,
      scaleFarmUnitQuantity: scaleFarmUnitQuantity,

      createBudgetItem: createBudgetItem,
      updateBudgetItem: updateBudgetItem,
      destroyBudgetItem: updateBudgetItem,

      retrieveStatesList: retrieveStatesList,
      retrieveBudgetCostCategories: retrieveBudgetCostCategories,
      retrieveBudgetCostData: retrieveBudgetCostData,
    };

    return budgetServiceMock;


    /****************************************************************
                         Mocked Methods
    ****************************************************************/

    // UniversityBudget API

    function listUniversityBudgets() {
      return $q.when({'data': university_budget_list});
    }

    function retrieveUniversityBudget(university_budget_id) {
      return $q.when({'data': university_budget_list[0]});
    }

    function createFromUniversityBudget(university_budget_id) {
      return $q.when({'data': budgets[0]});
    }


    // Budget CRUD


    function listBudgets(username, fields, module_name) {
      return $q.when({'data': budgets});
    }


    function createBudget(budget) {
      return $q.when({'data': budgets[0]});
    }


    function retrieveBudget(id) {
      return $q.when({'data': budgets[0]});
    }


    function updateBudget(budget) {
      angular.forEach(budgets, function(value, key) {
        if (value.id == budget.id) {
          budgets[key] = budget;
        }
      });
      return $q.when({'data': budget});
    }


    function destroyBudget(id) {
      return $q.when({'data': "No item found."});
    }


    function combineBudgets(budget_ids) {
      return $q.when({'data': {'id': 1}});
    }


    function copyBudget(budget) {
      budget.id += 1;
      return $q.when({'data': budget});
    }


    function copyBudgetByID(budget_id) {
      return $q.when({'data': budgets[0]});
    }


    function generateBudgets() {
      return $q.when({'data': []});
    }


    function adjustNetReturns(budget_id, percent) {
      return $q.when({'data': {}});
    }


    function scaleFarmUnitQuantity(budget_id, new_farm_unit_quantity) {
      return $q.when({'data': {'status': "farm_unit_quantity updated"}});
    }


    // Budget Item CRUD


    function createBudgetItem(item_type, item) {
      if (item_type == 'income') {
        this.budgets[0].income_items.push(item);
      }
      else if (item_type == "variable" || item_type == "fixed" || item_type == "general") {
        this.budgets[0].cost_items.push(item);
      }
      return $q.when({'data': item});
    }


    function updateBudgetItem(item_type, item) {
      var instance = this;

      if (item_type == 'income') {
        angular.forEach(instance.budgets[0].income_items, function(value, key) {
          if (value.id == item.id) {
            instance.budgets[0].income_items[key] = item;
          }
        });
      }
      else if (item_type == "variable" || item_type == "fixed" || item_type == "general") {
        angular.forEach(instance.budgets[0].cost_items, function(value, key) {
          if (value.id == item.id) {
            instance.budgets[0].cost_items[key] = item;
          }
        });
      }
      return $q.when({'data': item});
    }


    function destroyBudgetItem(item_type, id) {
      var instance = this;

      if (item_type == 'income') {
        angular.forEach(this.budgets[0].income_items, function(value, key) {
          if (value.id == id) {
            instance.budgets[0].income_items.splice(key, 1);
          }
        });
      }
      else if (item_type == "variable" || item_type == "fixed" || item_type == "general") {
        angular.forEach(this.budgets[0].cost_items, function(value, key) {
          if (value.id == id) {
            instance.budgets[0].cost_items.splice(key, 1);
          }
        });
      }
      return $q.when({'data': "No item found"})
    }


    function retrieveStatesList() {
      return $q.when({'data': ['Oregon', 'Washington', 'California']});
    }


    function retrieveBudgetCostCategories() {
      return $q.when({'data': ['pre_plant', 'plant', 'post_plant']});
    }


    function retrieveBudgetCostData(enterprise_type) {
      switch(enterprise_type) {
        case "Crop":
          return $q.when({'data': ['lots', 'of', 'data']});
          break;
        case "Livestock":
          return $q.when({'data': ['livestock', 'data', 'test']});
          break;
      }
    }
  }

  var university_budget_list = [
    {
      'title': 'Test Budget',
      'notes': "This is a test budget for Crop - Cereal Grains - Wheat - Soft White Club",
      'enterprise': 'Crop',
      'descriptor1': 'Cereal Grains',
      'descriptor2': 'Wheat',
      'market': 'GMO',

      'state': 'OR',
      'region': 'Benton County',

      'time_unit': 'years',
      'time_value': 1,
      'farm_unit': 'acres',
      'farm_unit_quantity': 1,

      'income_items': [
        {
          'name': 'Test Income Item',
          'notes': "Test income item notes",

          'farm_unit': 'acres',
          'farm_unit_quantity': 10,
          'sale_unit': 'tons',
          'sale_unit_quantity': 100,
          'return_total': 100.00,
        }
      ],
      'cost_items': [
        {
          'name': "Test Fixed Cost Item",
          'parent_category': "Insurance (other than health)",
          'category': 'post_harvest',
          'sub_category': 'insurance',
          'cost_type': 'fixed',

          'unit': 'acres',
          'unit_quantity': 10,
          'cost_total': 100.00,
        }
      ],
    }
  ],
  budgets = [
    {
      'id': 1,
      'title': "Budget 1",
      'enterprise': "Crop",
      'time_unit': "months",
      'time_value': 3,
      'income_items': [
        {
          'id': 1,
          'name': "Income Item 1",
          'return_total': 100.00
        }
      ],
      'cost_items': [
        {
          'id': 1,
          'name': "Variable Cost Item",
          'cost_type': "variable",
          'cost_total': 10.00
        },
        {
          'id': 2,
          'name': "Chemicals",
          'cost_type': "general",
          'cost_total': 20.00
        },
        {
          'id': 3,
          'name': "Fixed Cost Item",
          'cost_type': "fixed",
          'cost_total': 10.00
        },
      ]
    },
    {
      'id': 2,
      'title': "Budget 2",
      'enterprise': "Crop",
      'income_items': [
        {
          'id': 2,
          'name': "Income Item 2",
          'return_total': 100.00
        }
      ],
      'cost_items': [
        {
          'id': 4,
          'name': "Variable Cost Item",
          'cost_type': "variable",
          'cost_total': 10.00
        },
        {
          'id': 5,
          'name': "Chemicals",
          'cost_type': "general",
          'cost_total': 20.00
        },
        {
          'id': 6,
          'name': "Fixed Cost Item",
          'cost_type': "fixed",
          'cost_total': 10.00
        },
      ]
    },
    {
      'id': 3,
      'title': "Budget 3",
      'enterprise': "Crop",
      'income_items': [
        {
          'id': 3,
          'return_total': 100.00
        }
      ],
      'cost_items': [
        {
          'id': 7,
          'name': "Variable Cost Item",
          'cost_type': "variable",
          'cost_total': 10.00
        },
        {
          'id': 8,
          'name': "Chemicals",
          'cost_type': "general",
          'cost_total': 20.00
        },
        {
          'id': 9,
          'name': "Fixed Cost Item",
          'cost_type': "fixed",
          'cost_total': 10.00
        },
      ]
    },
    {
      'id': 4,
      'title': "Budget 4",
      'enterprise': "Crop",
      'income_items': [
        {
          'id': 4,
          'return_total': 100.00
        }
      ],
      'cost_items': [
        {
          'id': 10,
          'name': "Variable Cost Item",
          'cost_type': "variable",
          'cost_total': 10.00
        },
        {
          'id': 11,
          'name': "Chemicals",
          'cost_type': "general",
          'cost_total': 20.00
        },
        {
          'id': 12,
          'name': "Fixed Cost Item",
          'cost_type': "fixed",
          'cost_total': 10.00
        },
      ]
    },
    {
      'id': 5,
      'title': "Budget 5",
      'enterprise': "Crop",
      'income_items': [
        {
          'id': 5,
          'return_total': 100.00
        }
      ],
      'cost_items': [
        {
          'id': 13,
          'name': "Variable Cost Item",
          'cost_type': "variable",
          'cost_total': 10.00
        },
        {
          'id': 14,
          'name': "Chemicals",
          'cost_type': "general",
          'cost_total': 20.00
        },
        {
          'id': 15,
          'name': "Fixed Cost Item",
          'cost_type': "fixed",
          'cost_total': 10.00
        },
      ]
    },
    {
      "id": 18,
      "title": "Cereal Grains - Wheat - Soft White Winter",
      "notes": "Enter notes here",
      "enterprise": "Crop",
      "descriptor1": "Cereal Grains",
      "descriptor2": "Wheat",
      "descriptor3": "Soft White Winter",
      "descriptor4": "",
      "descriptor5": "",
      "descriptor6": "",
      "market": "GMO",
      "state": "OR",
      "region": "",
      "time_unit": "years",
      "time_value": 1,
      "farm_unit": "acres",
      "farm_unit_quantity": 1,
      "total_costs": 300.0,
      "total_variable_costs": 0,
      "total_fixed_costs": 0,
      "total_general_costs": 300.0,
      "total_income_less_variable_costs": 1100.0,
      "total_gross_returns": 1100.0,
      "profit": 800.0,
      "breakeven_yield": 0.2727272727272727,
      "breakeven_price": 300.0,
      "cost_items": [
        {
          "id": 34,
          "parent_budget": 18,
          "name": "Chemicals",
          "notes": "",
          "parent_category": "",
          "category": "",
          "sub_category": "",
          "cost_type": "general",
          "unit": "acres",
          "unit_quantity": "1.00",
          "cost_total": "100.00",
          "cost_per_unit": 100.0,
          "cost_per_farm_unit": 100.0
        },
        {
          "id": 35,
          "parent_budget": 18,
          "name": "Gasoline, Fuel, and Oil",
          "notes": "",
          "parent_category": "",
          "category": "",
          "sub_category": "",
          "cost_type": "general",
          "unit": "acres",
          "unit_quantity": "1.00",
          "cost_total": "100.00",
          "cost_per_unit": 100.0,
          "cost_per_farm_unit": 100.0
        },
        {
          "id": 36,
          "parent_budget": 18,
          "name": "Labor Hired (less employment credits)",
          "notes": "",
          "parent_category": "",
          "category": "",
          "sub_category": "",
          "cost_type": "general",
          "unit": "acres",
          "unit_quantity": "1.00",
          "cost_total": "100.00",
          "cost_per_unit": 100.0,
          "cost_per_farm_unit": 100.0
        }
      ],
      "income_items": [
        {
          "id": 12,
          "parent_budget": 18,
          "name": "WheatSoft White Winter",
          "enterprise": "Crop",
          "descriptor1": "Cereal Grains",
          "descriptor2": "Wheat",
          "descriptor3": "Soft White Winter",
          "descriptor4": "",
          "descriptor5": "",
          "descriptor6": "",
          "notes": "",
          "farm_unit": "acres",
          "farm_unit_quantity": 1,
          "sale_unit": "tons",
          "sale_unit_quantity": 1,
          "return_total": "1100.00",
          "price_per_farm_unit": 1100.0,
          "price_per_sale_unit": 1100.0
        }
      ]
    }
  ];

  var commodities = [
    {
      "name": "Livestock",
      "label": "Enterprise Type",
      "market_label": "Market",
      "markets": [
        {
          "name": "Conventional"
        }
      ],
      "category_1": [
        {
          "name": "Beef Cattle",
          "label": "Type of Production",
          "category_2": [
            {
              "name": "Weaning - owned grazing"
            }
          ]
        }
      ]
    }
  ];

})();
