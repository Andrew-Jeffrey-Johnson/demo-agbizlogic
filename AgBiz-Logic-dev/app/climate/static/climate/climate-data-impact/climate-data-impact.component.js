(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateDataImpact", {
      templateUrl: "/static/climate/climate-data-impact/climate-data-impact.component.html",
      controller: ClimateDataImpactController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateDataImpactController.$inject = [
    '$state',
    '$interval',
    'modalService',
    'climateService',
    'budgetService'
  ];

  function ClimateDataImpactController(
    $state,
    $interval,
    modalService,
    climateService,
    budgetService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.back = back;
    $ctrl.proceed = proceed;

    // ClimateScenario objects
    $ctrl.climate_scenario;
    $ctrl.climate_budget;
    $ctrl.current_factor;
    $ctrl.num_required_variables = 3;

    // Chart
    $ctrl.projection_data;
    $ctrl.optionsPrecip = {
      scaleLabel: function (valuePayload) {
        var value = valuePayload.value.toString();
        if( valuePayload.value > 999 ) {
  				value = value.split(/(?=(?:...)*$)/);
  				value = value.join(',');
        }
  			return value;
      },
      multiTooltipTemplate: function(valuePayload) {
        return valuePayload.datasetLabel + ': ' + parseFloat(valuePayload.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      },
      //TODO: FIGURE OUT HOW TO SET FUNCTIONALLY
      scales:{
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Inches"
            }
          }]
        }
    };

    $ctrl.optionsTemp = {
      scaleLabel: function (valuePayload) {
        var value = valuePayload.value.toString();
        if( valuePayload.value > 999 ) {
  				value = value.split(/(?=(?:...)*$)/);
  				value = value.join(',');
        }
  			return value;
      },
      multiTooltipTemplate: function(valuePayload) {
        return valuePayload.datasetLabel + ': ' + parseFloat(valuePayload.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      },
      //TODO: FIGURE OUT HOW TO SET FUNCTIONALLY
      scales:{
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Degrees Fahrenheit"
            }
          }]
        }
    };




    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {

      var original = $state.params['original'],
          scenario_id = $state.params['scenario'],
          climate_budget = $state.params['climate_budget'],
          state = $state.params['state'],
          region = $state.params['region'];

        if (scenario_id === undefined ||
            scenario_id < 1 ||
            state === undefined ||
            climate_budget === undefined ||
            state === undefined ||
            climate_budget < 1) {
          $state.go("manager");
        }
        else {
        startProgress(1);

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

                return getNextBudget(original, scenario_id, climate_budget);
             }
        })
        .then(function(climate_budget_response) {
            if (climate_budget_response === undefined ||
                 climate_budget_response.data === undefined ||
                 climate_budget_response.data.id === undefined ||
                 climate_budget_response.data.id < 1 ||
                 climate_budget_response.data.climate_factors === undefined) {
              $state.go("manager");
            }
            else if(climate_budget_response.data.id == climate_budget &&
                      original === "post-impact"){
              $state.go("summary", {
                "scenario": scenario_id,
              });
            }
            else {
                $ctrl.state = state;
                $ctrl.region = region || "";
                $ctrl.climate_budget = climate_budget_response.data;
                $ctrl.current_factor = $ctrl.climate_budget.climate_factors[0];
                return climateService.getClimateData($ctrl.state, $ctrl.region);
            }
        })
        .then(function(climate_data_response){
          console.log("here");
          console.log(climate_data_response);
          if(climate_data_response !== undefined &&
            climate_data_response.data !== undefined &&
            climate_data_response.data.labels !== undefined &&
            climate_data_response.data.temp !== undefined &&
            climate_data_response.data.temp_anom !== undefined &&
            climate_data_response.data.precip !== undefined &&
            climate_data_response.data.precip_anom !== undefined) {
              $ctrl.projection_data = climate_data_response.data;
              console.log($ctrl.projection_data);
          }
        });
      }
    }



    function back() {
      $state.go("regionSelect", {
        'scenario': $ctrl.climate_scenario.id,
      });
    }


  function proceed() {
    if($ctrl.climate_budget.user_estimate !== undefined){
      var post_impact_budget;
      startProgress(2);
      openClimateModal();
      budgetService.copyBudgetByID($ctrl.climate_budget.budget)
      .then(function(post_impact_budget_response){
        if(post_impact_budget_response !== undefined &&
           post_impact_budget_response.data !== undefined &&
           post_impact_budget_response.data.id !== undefined &&
           post_impact_budget_response.data.id > 0){
          post_impact_budget = post_impact_budget_response.data;
          post_impact_budget.title += " - After";
          post_impact_budget.modified_date = new Date();
          post_impact_budget.user_estimate = $ctrl.climate_budget.user_estimate;
          return budgetService.updateBudget(post_impact_budget);
       }
      })
      .then(function(updated_post_budget_response){
        if(updated_post_budget_response !== undefined &&
           updated_post_budget_response.data !== undefined &&
           updated_post_budget_response.data.id !== undefined &&
           updated_post_budget_response.data.id > 0){
          var post_impact_climate_budget = {
            'is_original': false,
            'climate_scenario': $ctrl.climate_scenario.id,
            'budget': updated_post_budget_response.data.id,
            'user_estimate': $ctrl.climate_budget.user_estimate,
          };
          return climateService.createBudget(post_impact_climate_budget);

        }
      })
      .then(function(post_impact_climate_budget_response){
        if(post_impact_climate_budget_response !== undefined &&
           post_impact_climate_budget_response.data !== undefined &&
           post_impact_climate_budget_response.data.id !== undefined &&
           post_impact_climate_budget_response.data.id > 0){
          return budgetService.adjustNetReturns(post_impact_budget.id,  $ctrl.climate_budget.user_estimate)
        }
      })
      .then(function(response){
        if(response !== undefined){
          $state.go("budgetEditor", {
            'module': "climate",
            'original': 'post-impact',
            'budget': post_impact_budget.id,
            'scenario': $ctrl.climate_scenario.id,
            'climate_budget': $ctrl.climate_budget.id,
            'state': $ctrl.state,
            'region': $ctrl.region,
          });
        }
      });
    }
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

    function openClimateModal() {
      var message = "Short-term:\n" +
                    "The income in your initial budget will now be modified as a result of the estimated change to yield or quality of product sold. You may now also modify cash costs that could vary with changes to production (or yields or quality of products sold)." +

                    "\nLong-term:\n" +
                    "The income in your initial budget will now be modified as a result of the estimated change to yield or quality of product sold based on projected changes to selected long-term climate variables. You may now also modify cash costs that could vary with changes to production (or yields or quality of products sold)."

      modalService.alert(message);
    }

    function getNextBudget(original, scenario_id, climate_budget){
      if(original !== undefined &&
         original === "post-impact"){
        return climateService.retrieveNextClimateBudget(scenario_id, climate_budget);
      } else {
         return climateService.retrieveBudget(climate_budget);
      }
    }
  }
})();
