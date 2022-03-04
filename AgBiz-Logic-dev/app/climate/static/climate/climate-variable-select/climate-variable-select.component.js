(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateVariableSelect", {
      templateUrl: "/static/climate/climate-variable-select/climate-variable-select.component.html",
      controller: ClimateVariableSelectController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateVariableSelectController.$inject = [
    '$scope',
    '$state',
    '$uibModal',
    '$q',
    '$interval',
    'climateService',
    'modalService',
    'budgetService',
    'commonService'
  ];

  function ClimateVariableSelectController(
    $scope,
    $state,
    $uibModal,
    $q,
    $interval,
    climateService,
    modalService,
    budgetService,
    commonService) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.addFactor = addFactor;
    $ctrl.removeFactor = removeFactor;
    $ctrl.proceed = proceed;
    $ctrl.back = back;
    $ctrl.viewClimateVariableSelectHelp = viewClimateVariableSelectHelp;

    // ClimateScenario object
    $ctrl.climate_scenario;
    $ctrl.climate_budget;
    $ctrl.state;
    $ctrl.region;
    $ctrl.variables;
    $ctrl.climate_factors = [];

    // Misc
    $ctrl.variable_options;
    $ctrl.modal_helper_variables;
    $ctrl.variable_divs = [];
    $ctrl.num_required_variables = 3;
    $ctrl.progress = 100;


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
          else if (climate_budget_response.data.id == climate_budget &&
                   original == "post-impact") {
            openClimateModal()
            $state.go("summary", {
              'scenario': scenario_id,
            });
          }
          else {
            $ctrl.climate_budget = climate_budget_response.data;
            $ctrl.state = state;
            $ctrl.region = region || "";

            return climateService.retrieveAvailableFactors($ctrl.state, $ctrl.region);
          }
        })
        .then(function(available_factors_response) {
          if (available_factors_response !== undefined &&
              available_factors_response.data !== undefined) {
            $ctrl.variable_options = available_factors_response.data;
            $ctrl.variable_options.sort();

            // Get variables for help modal
            var climate_variables = climateService.retrieveVariableDefinitions($ctrl.variable_options);
            $ctrl.modal_helper_variables = climate_variables;

            // Remove factors from list
            $ctrl.climate_budget.climate_factors.forEach(function(climate_factor) {
              $ctrl.variable_options.forEach(function(variable_option, index) {
                if (variable_option == climate_factor.name) {
                  $ctrl.variable_options.splice(index, 1);
                }
              });
            });
          }
        });
      }


    }
    function openClimateModal() {
      var message = "If you wish to save the newly created climate budgets, use the 'Save Budgets' button at the bottom of the Climate Summary page."
      modalService.alert(message);
    }

    function addFactor() {
      if ($ctrl.climate_budget.climate_factors.length < $ctrl.num_required_variables) {
        startProgress(1);

        var factor = {
          'climate_budget': $ctrl.climate_budget.id,
          'name': $ctrl.new_factor,
          'state': $ctrl.state,
          'region': $ctrl.region,
          'user_estimate': 0,
        }
        climateService.createFactor(factor)
        .then(function() {
          return climateService.retrieveBudget($ctrl.climate_budget.id);
        })
        .then(function(updated_climate_budget_response) {
          $ctrl.climate_budget = updated_climate_budget_response.data;

          // Remove factor from list
          if($ctrl.new_factor !== 'Climate Focus Groups' && $ctrl.new_factor !== 'Crop Models'){
            $ctrl.variable_options.forEach(function(variable_option, index) {
              if (variable_option == $ctrl.new_factor) {
                $ctrl.variable_options.splice(index, 1);
                $ctrl.new_factor = "";
              }
            });
          }

        });
      }
    }


    function removeFactor(factor) {
      startProgress(1);

      climateService.destroyFactor(factor.id)
      .then(function() {
        $ctrl.variable_options.push(factor.name);
        // FIXME: Don't call $onInit()
        $ctrl.$onInit();
      });
    }


    function proceed() {
      var requests = [];
      var lst = [];
      $ctrl.climate_budget.climate_factors.forEach(function(factor){
        lst.push(factor.name);
      });

      if ($ctrl.climate_budget.climate_factors.length < 3){
        //do nothing, button disabled

      } else if ($ctrl.climate_budget.climate_factors.length == $ctrl.num_required_variables) {

        /*if(lst.indexOf("Climate Focus Groups") == -1) {
          $ctrl.new_factor = "Climate Focus Groups";
          addFactor();
        }
        if(lst.indexOf("Crop Models") == -1) {
          $ctrl.new_factor = "Crop Models";
          addFactor();
        }*/

        $state.go("variableImpact", {
          'scenario': $ctrl.climate_scenario.id,
          'climate_budget': $ctrl.climate_budget.id,
          'factor': $ctrl.climate_budget.climate_factors[0].id,
          'state': $state.params['state'],
          'region': $state.params['region'],
        });

      }
      /*else if ($ctrl.climate_budget.climate_factors.length === $ctrl.num_required_variables+2) {
        $state.go("variableImpact", {
          'scenario': $ctrl.climate_scenario.id,
          'climate_budget': $ctrl.climate_budget.id,
          'factor': $ctrl.climate_budget.climate_factors[0].id,
          'state': $state.params['state'],
          'region': $state.params['region'],
        });
      }*/

    }


    function viewClimateVariableSelectHelp() {
      openClimateVariableSelectHelp();
    }


    function back() {
      $state.go("regionSelect", {'scenario': $ctrl.climate_scenario.id,});
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    function getNextBudget(original, scenario_id, climate_budget) {
      if (original !== undefined &&
          original == "post-impact") {
        return climateService.retrieveNextClimateBudget(scenario_id, climate_budget);
      }
      else {
        return climateService.retrieveBudget(climate_budget);
      }
    }

    /*
        Faux progress method.  Takes the number of async calls in a method and
        increments progress to 100 according to time estimate (time_per_call * num_calls).
    */
    function startProgress(num_calls) {
      $ctrl.progress = 0;
      var time_per_call = 500;

      $interval(function() {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }



    function openClimateVariableSelectHelp(){
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'static/climate/climate-variable-select/climate-variable-select-help-modal/climate-variable-select-help-modal.html',
        controller: 'ClimateModalController',
        controllerAs: '$ctrl',
        resolve: {
          help_items: function () {
            return $ctrl.modal_helper_variables;
          },
        },
      });
    }


  }
})();
