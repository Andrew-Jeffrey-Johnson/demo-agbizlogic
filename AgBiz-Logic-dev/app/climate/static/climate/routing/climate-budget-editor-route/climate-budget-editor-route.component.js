(function() {
  'use strict';

  angular
  .module('climateModule')
  .component('climateBudgetEditorRoute', {
    templateUrl: "/static/climate/routing/climate-budget-editor-route/climate-budget-editor-route.component.html",
    controller: ClimateBudgetEditorRouteComponentController
  });


  /****************************************************************
   Controller
   ****************************************************************/

  ClimateBudgetEditorRouteComponentController.$inject = [
    '$scope',
    '$state',
    '$window',
    'budgetService',
    'climateService'
  ];

  function ClimateBudgetEditorRouteComponentController(
    $scope,
    $state,
    $window,
    budgetService,
    climateService) {
    var $ctrl = this;

    /****************************************************************
                       Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.onDiscard = onDiscard;
    $ctrl.onSave = onSave;

    // Climate Budget
    $ctrl.budget;
    $ctrl.climate_budget;
    $ctrl.climate_scenario;
    $ctrl.is_original;
    $ctrl.state;
    $ctrl.region;

    // Routing
    $ctrl.expected_change = false;


    /****************************************************************
                       Controller Methods
    ****************************************************************/

    function $onInit() {
      if (checkStateParameters($state.params) == false) {
        $ctrl.expected_change = true;
        $state.go("manager");
      }
      else {
        $ctrl.budget = {
          'id': $state.params["budget"]
        };
        if ($state.params['original'] == 'original') {
          $ctrl.is_original = true;
        }
        else if ($state.params['original'] == 'post_impact') {
          $ctrl.is_original = false;
        }
        climateService.retrieveScenario($state.params['scenario'])
        .then(function(scenario_response){
          if(scenario_response !== undefined &&
             scenario_response.data !== undefined &&
             scenario_response.data.id !== undefined &&
             scenario_response.data.id > 0){
            $ctrl.climate_scenario = scenario_response.data;
          } else {
            $state.go("manager");
          }
        });
        $ctrl.climate_budget = {
          'id': $state.params['climate_budget'],
        };
      }
    }


    function onDiscard(budget) {
      $ctrl.expected_change = true;
      $window.history.back();
    }


    function onSave(budget) {
      $ctrl.expected_change = true;
      if ($ctrl.is_original == true) {
        $window.history.back();
      }

      else {
        if($ctrl.climate_scenario.projection_type === "short"){
            $state.go("climateDataImpact", {
              'original': "post-impact",
              'scenario': $ctrl.climate_scenario.id,
              'climate_budget': $ctrl.climate_budget.id,
              'state': $state.params['state'],
              'region': $state.params['region']
           });
          } else {
            $state.go("variableSelect", {
             'original': "post-impact",
              'scenario': $ctrl.climate_scenario.id,
             'climate_budget': $ctrl.climate_budget.id,
              'state': $state.params['state'],
              'region': $state.params['region'],
           });
          }
      }
    }


    /****************************************************************
                       Private Helper Functions
    ****************************************************************/

    // TODO: Move to service in common module and refactor query parameter checks
    function checkStateParameters(state_params) {
      var is_valid = true;
      try {
        if (state_params['budget'] == undefined ||
            state_params['budget'] < 1 ||
            state_params['climate_budget'] == undefined ||
            state_params['climate_budget'] < 1 ||
            state_params['scenario'] == undefined ||
            state_params['scenario'] < 1 ||
            state_params['original'] == undefined) {
          is_valid = false;
        }
      } catch (error) {
        is_valid = false;
      }

      return is_valid;
    }
  }

})();
