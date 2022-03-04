(function() {
  'use strict';

  angular
    .module("climateModule")
    .factory("climateService", climateServiceFactory);

  climateServiceFactory.$inject = [
    '$http',
    '$q'
  ];

  function climateServiceFactory(
    $http,
    $q) {
    var climateService = {
      retrieveAvailableFactors: retrieveAvailableFactors,
      retrieveFactorProjections: retrieveFactorProjections,
      retrieveVariableDefinitions: retrieveVariableDefinitions,

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

    return climateService;


    /****************************************************************
                         Methods
    ****************************************************************/

    function retrieveAvailableFactors(state, region) {

      return $http.get(url_base_climate_data+state+"/"+region+".json")
      .then(function(climate_data_response) {
        if (climate_data_response !== undefined &&
            climate_data_response.data !== undefined) {
          var climate_data_list = climate_data_response.data;
          var available_factors = [];

          Object.keys(climate_data_list).forEach(function(key){
            available_factors.push(key);
          });

          return $q.when({'data': available_factors});
        }
      });
    }

    function retrieveVariableDefinitions(current_variables) {
      return $http.get(url_base_climate_data+"variable_factors.json")
      .then(function(climate_specific_variables) {
        var climate_variables = climate_specific_variables.data;
        //console.log("Climate Variables in retrieve function:", climate_variables);
        var climate_variables_list = climate_variables["variables"];
        var available_climate_variables = {};

        current_variables.forEach(function(item, index){
          available_climate_variables[String(item)] = String(current_variables[index]);
        });

        return $q.when(available_climate_variables);
      });
    }


    function retrieveFactorProjections(climate_factor) {
      if (climate_factor.name != 'Climate Focus Groups' && climate_factor.name != 'Crop Models') {
        return $http.get(url_base_climate_data+climate_factor["state"]+'/'+climate_factor["region"]+'.json')
        .then(function(climate_data_response) {
          if (climate_data_response !== undefined &&
              climate_data_response.data !== undefined) {
            var climate_data_list = climate_data_response.data;

            var climate_variable = climate_data_list[climate_factor.name];
            var data = [];

            if (climate_variable['chart-type'] == "bar") {
              climate_variable['historic-mean'][0] = climate_variable['historic-mean'][0].toFixed(2);
              climate_variable['historic-min'][0] = climate_variable['historic-min'][0].toFixed(2);
              climate_variable['historic-max'][0] = climate_variable['historic-max'][0].toFixed(2);

              data = [
                climate_variable['historic-mean'].concat(climate_variable['historic-min'], climate_variable['historic-max']),
              ];
            }
            else if (climate_variable['chart-type'] == "line") {
              if (climate_variable["labels"].length > 50) {
                climate_variable["labels"] = climate_variable["labels"].filter(function(label, index) {
                  return index % 7 == 0;
                });
                var historic_mean = climate_variable["historic-mean"].filter(function(label, index) {
                    return index % 7 == 0;
                });
                var low_mean = climate_variable["historic-min"].filter(function(label, index) {
                    return index % 7 == 0;
                });
                var high_mean = climate_variable["historic-max"].filter(function(label, index) {
                    return index % 7 == 0;
                });
              }
              else if (climate_variable["labels"].length < 50) {
                var historic_mean = climate_variable["historic-mean"];
                var low_mean = climate_variable["historic-min"];
                var high_mean = climate_variable["historic-max"];
              }

              for( var i = 0; i<historic_mean.length; i++) {
                historic_mean[i] = historic_mean[i].toFixed(2);
                low_mean[i]      = low_mean[i].toFixed(2);
                high_mean[i]     = high_mean[i].toFixed(2);
              }

              data = [
                historic_mean, low_mean, high_mean
              ];
            }

            var projection_data = {
              'name': climate_variable['name'],
              'chart_type': climate_variable['chart-type'],
              'series': climate_variable['series'],
              'labels': climate_variable['labels'],
              'data': data,
              'label_unit': climate_variable['label_unit'],
            };

            return $q.when({'data': projection_data});
          }
        });
      }
    }


    function getClimateData(state, region){
      return $http.get(url_base_climate_short_term_data + "/" + state + "/" + region + "/");
    }

    // ClimateScenario CRUD

    function listScenarios(username) {
      return $http.get(url_base_scenarios + "?username=" + username);
    }

    function createScenario(scenario) {
      return $http.post(url_base_scenarios, scenario);
    }

    function retrieveScenario(id) {
      return $http.get(url_base_scenarios + id + "/");
    }

    function updateScenario(scenario) {
      return $http.put(url_base_scenarios + scenario.id + "/", scenario)
    }

    function destroyScenario(id) {
      return $http.delete(url_base_scenarios + id + "/");
    }

    function retrieveNextClimateBudget(climate_scenario_id, climate_budget_id) {
      return $http.post(url_base_scenarios + climate_scenario_id + "/next/", {'climate_budget': climate_budget_id});
    }

    function retrieveMostRecentScenario() {
      return $http.get(url_base_scenarios + "most_recent/");
    }


    // ClimateBudget CRUD

    function listBudgets(username) {
      return $http.get(url_base_budget + "?username=" + username);
    }

    function createBudget(budget) {
      return $http.post(url_base_budget, budget);
    }

    function retrieveBudget(id) {
      return $http.get(url_base_budget + id + "/");
    }

    function updateBudget(budget) {
      return $http.put(url_base_budget + budget.id + "/", budget)
    }

    function destroyBudget(id) {
      return $http.delete(url_base_budget + id + "/");
    }


    function generateClimateBudget(budget_id, scenario_id) {
      var payload = {
        'budget': budget_id,
        'climate_scenario': scenario_id,
      };

      return $http.post(url_base_budget + "generate/", payload);
    }


    // ClimateFactor CRUD

    function listFactors(username) {
      return $http.get(url_base_factor + "?username=" + username);
    }

    function listFactorsByBudget(budget) {
      return $http.get(url_base_factor + "?climate_budget=" + budget);
    }

    function createFactor(factor) {
      return $http.post(url_base_factor, factor);
    }

    function retrieveFactor(id) {
      return $http.get(url_base_factor + id + "/");
    }

    function updateFactor(factor) {
      return $http.put(url_base_factor + factor.id + "/", factor)
    }

    function destroyFactor(id) {
      return $http.delete(url_base_factor + id + "/");
    }

  }


  var url_base_scenarios = "/climate/api/climate_scenarios/",
      url_base_budget = "/climate/api/climate_budgets/",
      url_base_factor = "/climate/api/climate_factors/",
      url_base_climate_data = "/static/climate/json/",
      url_base_climate_short_term_data = "/climate/climate_data",
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
      };

})();
