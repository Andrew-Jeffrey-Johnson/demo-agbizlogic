(function() {
  'use strict';

  angular
    .module('mockModule')
    .factory('climateServiceMock', climateServiceMock);

  climateServiceMock.$inject = [
    '$q'
  ];


  function climateServiceMock($q) {
    var climateServiceMock = {
      retrieveAvailableFactors: retrieveAvailableFactors,
      retrieveVariableDefinitions: retrieveVariableDefinitions,
      retrieveFactorProjections: retrieveFactorProjections,

      getClimateData: getClimateData,

      listScenarios: listScenarios,
      createScenario: createScenario,
      retrieveScenario: retrieveScenario,
      updateScenario: updateScenario,
      destroyScenario: destroyScenario,
      retrieveNextClimateBudget: retrieveNextClimateBudget,
      retrieveMostRecentScenario: retrieveMostRecentScenario,

      listBudgets: listBudgets,
      createBudget: createBudget,
      retrieveBudget: retrieveBudget,
      updateBudget: updateBudget,
      destroyBudget: destroyBudget,
      generateClimateBudget: generateClimateBudget,

      listFactors: listFactors,
      listFactorsByBudget: listFactorsByBudget,
      createFactor: createFactor,
      retrieveFactor: retrieveFactor,
      updateFactor: updateFactor,
      destroyFactor: destroyFactor,
    }

    return climateServiceMock;


    /****************************************************************
                    Methods
    ****************************************************************/

    function retrieveAvailableFactors(state, regions) {
      return $q.when({'data': []});
    }

    function retrieveVariableDefinitions(userVariableOptions){
      return userVariableOptions;
    }


    function retrieveFactorProjections(factor) {
      var projection_data = new Object();
      var chart_type;

      // Match chart type and data format with factor
      angular.forEach(variable_options, function(chart, name) {
        if (factor.name == name) {

          var chart_type = chart;
        }
      });

      // Mocked data
      if (chart_type == 'bar') {
        projection_data = {
          'name': factor.name,
          'chart_type': chart_type,
          'series': ['1'],
          'labels': ['Modeled Historic Baseline', 'Modeled Low Future', 'Modeled High Future'],
          'data': [
            [Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60)],
          ],
        };
      }
      else if (chart_type == 'line') {
        projection_data = {
          'name': "",
          'chart_type': chart_type,
          'series': ['Modeled Historic Baseline', 'Modeled Low Future', 'Modeled High Future'],
          'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
          'data': [
            [0, 13, 20, 25, 34, 68, 75, 80, 88, 90, 100, 120],
            [12, 20, 25, 25, 32, 50, 68, 77, 90, 92, 98, 100],
            [3, 10, 22, 26, 34, 47, 54, 60, 68, 75, 80, 102]
          ],
        };
      }
      var defer = $q.defer();
      defer.resolve({'data': projection_data});

      return defer.promise;
    }

    function getClimateData(state, region){
      defer = {
        temp: 5,
        temp_anom: 6,
        precip: 7,
        precip_anom: 8,
        labels: 9
      };
      return defer.promise;
    }

    // ClimateScenario CRUD

    function listScenarios(username) {
      var defer = $q.defer();
      defer.resolve({'data': scenarios});
      return defer.promise;
    }

    function createScenario(scenario) {
      var defer = $q.defer();
      if (scenario.title != "") {
        scenario['id'] = 1;
        defer.resolve({'data': scenario});
      }
      else {
        defer.reject({'data': "Error: need title"});
      }
      return defer.promise;
    }

    function retrieveScenario(id) {
      var defer = $q.defer();
      defer.resolve({'data': scenarios[0]});

      return defer.promise;
    }

    function updateScenario(scenario) {
      var defer = $q.defer();
      defer.resolve({'data': scenario});
      return defer.promise;
    }

    function destroyScenario(id) {
      var defer = $q.defer();
      defer.resolve({'data': "Not found."});
      return defer.promise;
    }

    function retrieveNextClimateBudget(climate_scenario_id, climate_budget_id) {
      var climate_budget = {
        'id': 2,
        'position': 2,
        'title': "Test Climate Budget",
      };

      return $q.when({'data': climate_budget});
    }

    function retrieveMostRecentScenario() {
      return $q.when({'data': scenarios[0]});
    }


    // ClimateBudget CRUD

    function listBudgets(username) {
      var defer = $q.defer();
      defer.resolve({'data': climate_budgets});
      return defer.promise;
    }

    function createBudget(budget) {
      return $q.when({'data': scenarios[0].climate_budgets[0]});
    }

    function retrieveBudget(id) {
      var budget = {
        'id': id,
        'climate_factors': [
          {
            'id': 1,
          },
          {
            'id': 2,
          },
          {
            'id': 3,
          }
        ],
      };

      return $q.when({'data': budget});
    }

    function updateBudget(budget) {
      var defer = $q.defer();
      defer.resolve({'data': budget});
      return defer.promise;
    }

    function destroyBudget(id) {
      var defer = $q.defer();
      defer.resolve({'data': "Not found."});
      return defer.promise;
    }

    function generateClimateBudget(budget_id, scenario_id) {
      return $q.when({'data': scenarios[0].climate_budgets[0]});
    }

    // ClimateFactor CRUD

    function listFactors(username) {
      var defer = $q.defer();
      defer.resolve({'data': climate_factors});
      return defer.promise;
    }

    function listFactorsByBudget(budget) {
      var defer = $q.defer();
      defer.resolve({'data': climate_factors});
      return defer.promise;
    }

    function createFactor(factor) {
      var defer = $q.defer();
      defer.resolve({'data': factor});
      return defer.promise;
    }

    function retrieveFactor(id) {
      var factor = {
        'id': 1,
        'name': "Test Factor",
      };
      return $q.when({'data': factor});
    }

    function updateFactor(factor) {
      var defer = $q.defer();
      defer.resolve({'data': factor});
      return defer.promise;
    }

    function destroyFactor(id) {
      var defer = $q.defer();
      defer.resolve({'data': "Not found."});
      return defer.promise;
    }

    var climate_budgets = [
      {
        'id': 1,
        'title': "Climate Budget 1",
      }
    ];

    var climate_factors = [
      {
        'id': 1,
        'title': "Climate Factor 1",
      }
    ]
  }


  var url_base_scenarios = "/climate/api/climate_scenarios/",
      url_base_current_user = "/api/current_user/",
      stored_budgets = [],
      stored_scenarios = [],
      stored_factors = [],
      stored_us_state = "",
      stored_region = "",
      variable_options = {
        'Seasonal Mean Temperature': "line",
        'Number of Days Above Freezing': "bar",
        'Number of Nights Below Freezing': "bar",
        'Number of Warm Nights': "bar",
        'Number of Consecutive Extremely Hot Days': "bar",
        'Number of Consecutive Extremely Cold Days': "bar",
        'Accumulated Growing Degree Days': "line",
        'Accumulated Chilling Hours': "line",
        '24-Hour Temperature Range (Night vs. Day)': "bar",
        'Number of Consecutive Wet Days': "line",
        'Number of Consecutive Dry Days': "line",
        'Accumulated Seasonal Precipitation': "line",
        'Snowpack': "line",
      },
      scenarios = [
        {
          'id': 1,
          'title': "Climate Scenario",
          'climate_budgets': [
            {
              'id': 1,
              'title': "Budget 1",
              'budget': 11,
              'net_returns': 100.00,
              'total_yields': 50
            },
            {
              'id': 2,
              'title': "Budget 1 - After",
              'budget': 65,
              'net_returns': 200.00,
              'total_yields': 100
            },
            {
              'id': 3,
              'title': "Budget 2",
              'budget': 22,
              'net_returns': 50.00,
              'total_yields': 20
            },
            {
              'id': 4,
              'title': "Budget 2 - After",
              'budget': 73,
              'net_returns': 60.00,
              'total_yields': 25
            },
            {
              'id': 5,
              'title': "Budget 3",
              'budget': 98,
              'net_returns': 20.00,
              'total_yields': 5
            },
            {
              'id': 6,
              'title': "Budget 3 - After",
              'budget': 23,
              'net_returns': 50.00,
              'total_yields': 20
            },
            {
              'id': 7,
              'title': "Budget 4",
              'budget': 82,
              'net_returns': 83.00,
              'total_yields': 30
            },
            {
              'id': 8,
              'title': "Budget 4 - After",
              'budget': 87,
              'net_returns': 30.00,
              'total_yields': 10
            },
            {
              'id': 9,
              'title': "Budget 5",
              'budget': 89,
              'net_returns': 28.00,
              'total_yields': 8
            },
            {
              'id': 10,
              'title': "Budget 5 - After",
              'budget': 90,
              'net_returns': 14.00,
              'total_yields': 4
            }
          ]
        }
      ],
      test_budget = {
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
            "name": "Wheat - Soft White Winter",
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
      };

})();
