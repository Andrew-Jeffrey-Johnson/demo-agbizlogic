(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateRegionSelect", {
      templateUrl: "/static/climate/climate-region-select/climate-region-select.component.html",
      controller: ClimateRegionSelectController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateRegionSelectController.$inject = [
    "$scope",
    "$state",
    "$interval",
    "climateService",
    "commonService",
  ];

  function ClimateRegionSelectController(
    $scope,
    $state,
    $interval,
    climateService,
    commonService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.proceed = proceed;
    $ctrl.back = back;
    $ctrl.setCountyOptions = setCountyOptions;

    // ClimateScenario object
    $ctrl.climate_scenario;
    $ctrl.state;
    $ctrl.region;
    $ctrl.type;

    // Misc
    $ctrl.region_data;
    $ctrl.region_options = [];
    $ctrl.progress = 100;
    $ctrl.type_data;
    $ctrl.state_valid = true;
    $ctrl.region_valid = true;
    $ctrl.type_valid = true;

    // Errors
    $ctrl.errors = 0;


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {

      var scenario_id = $state.params['scenario'];

      if (scenario_id === undefined || scenario_id < 1) {
        $state.go("manager");
      }
      else {
        startProgress(1);
        //TODO ABC: Get these constants from the back end.
        $ctrl.type_data =["Future Climate Projection (2030s compared to historical baseline)", "Seasonal Climate Forecast (six-month outlook)"];
        climateService.retrieveScenario(scenario_id)
        .then(function(climate_scenario_response) {
          if (climate_scenario_response === undefined ||
              climate_scenario_response.data === undefined ||
              climate_scenario_response.data.id === undefined ||
              climate_scenario_response.data.id < 1) {
            $state.go("manager");
          }
          else {
            $ctrl.climate_scenario = climate_scenario_response.data;
            setting();


            return commonService.retrieveRegionData();
          }
        })
        .then(function(region_data_response) {
            if (region_data_response !== undefined &&
            region_data_response.data !== undefined &&
            Object.keys(region_data_response.data).length > 0) {
              $ctrl.region_data = region_data_response.data;
            }
            else {
                $state.go("manager");
            }
        });
      }
    }

    function proceed() {
      $ctrl.errors = 0;
      if ($ctrl.state !== undefined && $ctrl.region !== undefined && $ctrl.type !== undefined) {
          if($ctrl.climate_scenario !== undefined && $ctrl.type === "Seasonal Climate Forecast (six-month outlook)"){
            $ctrl.climate_scenario.climate_budgets.forEach(function(budget){
              var factor = {
                'climate_budget': budget.id,
                'name': "Seasonal Climate Forecast (six-month outlook)",
                'state': $ctrl.state,
                'region': $ctrl.region,
                'user_estimate': 0,
              };
              climateService.createFactor(factor)

            });
            $ctrl.climate_scenario.projection_type = "short";
            return climateService.updateScenario($ctrl.climate_scenario)
            .then(function(update_scenario_response){
              if( update_scenario_response !== undefined &&
                  update_scenario_response.data !== undefined &&
                  update_scenario_response.data.id !== undefined &&
                  update_scenario_response.data.id > 0){
                $state.go("climateDataImpact", {
                  'scenario': update_scenario_response.data.id,
                  'state': $ctrl.state,
                  'region': $ctrl.region,
                  'climate_budget': update_scenario_response.data.climate_budgets[0].id
                });
              } else {
                $state.go("manager");
              }
            });

         } else{
           console.log($ctrl.climate_scenario.climate_budgets);
            $state.go("variableSelect", {
            'scenario': $ctrl.climate_scenario.id,
            'state': $ctrl.state,
            'region': $ctrl.region,
            'climate_budget': $ctrl.climate_scenario.climate_budgets[0].id
            });
        }
      }
      else {
        $ctrl.state_valid = !($ctrl.state === undefined);
        $ctrl.region_valid = !($ctrl.region === undefined);
        $ctrl.type_valid = !($ctrl.type === undefined);
        $ctrl.errors = 1;
      }

    }


    function back() {
      $state.go("create", {'scenario': $ctrl.climate_scenario.id});
    }


    function setCountyOptions(us_state) {
      var counties = [];
      angular.forEach($ctrl.region_data, function(region) {
        if (region.state == us_state) {
          counties = region.counties;
        }
      });

      return counties;
    }

    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    /*
        Faux progress method. Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

    function setting() {
      if($ctrl.climate_scenario.climate_budgets[0].climate_factors){
        var existing_factors = $ctrl.climate_scenario.climate_budgets[0].climate_factors;
      } else {
        var existing_factors = [];
      }


      if (existing_factors.length !== 0) {
        if ($ctrl.climate_scenario.projection_type === "long") {
          $ctrl.type = "Future Climate Projection (2030s compared to historical baseline)";
        } else {
          $ctrl.type = "Seasonal Climate Forecast (six-month outlook)";
        }
        $ctrl.state = existing_factors[0].state;
        $ctrl.region = existing_factors[0].region;
      } else {
        $ctrl.type = "";
        $ctrl.state = "Select";
        $ctrl.region = "Select";
      }
    }

  }


})();
