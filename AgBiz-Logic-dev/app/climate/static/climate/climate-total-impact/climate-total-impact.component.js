(function() {
  'use strict';

  angular
    .module("climateModule")
    .component("climateTotalImpact", {
      templateUrl: "/static/climate/climate-total-impact/climate-total-impact.component.html",
      controller: ClimateTotalImpactController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  ClimateTotalImpactController.$inject = [
    '$state',
    '$interval',
    'modalService',
    'climateService',
    'budgetService'
  ];

  function ClimateTotalImpactController(
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


    /****************************************************************
                         Controller Methods
    ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'],
          climate_budget = $state.params['climate_budget'];

      if (scenario_id === undefined ||
          scenario_id < 1 ||
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

            return climateService.retrieveBudget(climate_budget);
          }
        })
        .then(function(climate_budget_response) {
          if (climate_budget_response === undefined ||
              climate_budget_response.data === undefined ||
              climate_budget_response.data.id === undefined ||
              climate_budget_response.data.id < 1 ||
              climate_budget_response.data.climate_factors === undefined ||
              climate_budget_response.data.climate_factors.length < $ctrl.num_required_variables) {
            $state.go("manager");
          }
          else {
            $ctrl.climate_budget = climate_budget_response.data;
            $ctrl.climate_budget.user_estimate = $ctrl.climate_budget.user_estimate;
          }
        });
      }
    }


    function back() {
      $state.go("variableImpact", {
        'scenario': $ctrl.climate_scenario.id,
        'climate_budget': $ctrl.climate_budget.id,
      });
    }


    function proceed() {
      if ($ctrl.climate_budget.user_estimate !== undefined) {
        var post_impact_budget;

        startProgress(2);
        openClimateModal();

        climateService.updateBudget($ctrl.climate_budget)
        .then(function() {
          return budgetService.copyBudgetByID($ctrl.climate_budget.budget);
        })
        .then(function(post_impact_budget_response) {
          if (post_impact_budget_response !== undefined &&
              post_impact_budget_response.data !== undefined &&
              post_impact_budget_response.data.id !== undefined &&
              post_impact_budget_response.data.id > 0) {
            post_impact_budget = post_impact_budget_response.data;
            post_impact_budget.title += " - After";
            post_impact_budget.is_original = false;
            post_impact_budget.modified_date = new Date();

            return budgetService.updateBudget(post_impact_budget);
          }
        })
        .then(function(updated_post_budget_response) {
          if (updated_post_budget_response !== undefined) {
            var post_impact_climate_budget = {
              'is_original': false,
              'climate_scenario': $ctrl.climate_scenario.id,
              'budget': post_impact_budget.id,
              'user_estimate': $ctrl.climate_budget.user_estimate,
            };

            return climateService.createBudget(post_impact_climate_budget);
          }
        })
        .then(function(post_impact_climate_budget_response) {
          if (post_impact_climate_budget_response !== undefined) {
            return budgetService.adjustNetReturns(post_impact_budget.id, $ctrl.climate_budget.user_estimate);
          }
        })
        .then(function(response) {
          if (response !== undefined) {
            $state.go("budgetEditor", {
              'module': "climate",
              'original': 'post-impact',
              'budget': post_impact_budget.id,
              'scenario': $ctrl.climate_scenario.id,
              'climate_budget': $ctrl.climate_budget.id,
              'state': $state.params['state'],
              'region': $state.params['region'],
            });
          }
        });
      }
    }


    /****************************************************************
                         Private Helper Functions
    ****************************************************************/

    // FIXME: Use modalService
    function openClimateModal() {
      var message = "Short-term:\r\n" +
                    "The income in your initial budget will now be modified as a result of the estimated change to yield or quality of product sold. You may now also modify cash costs that could vary with changes to production (or yields or quality of products sold)." +

                    "\r\nLong-term:\r\n" +
                    "The income in your initial budget will now be modified as a result of the estimated change to yield or quality of product sold based on projected changes to selected long-term climate variables. You may now also modify cash costs that could vary with changes to production (or yields or quality of products sold)."
      modalService.alert(message);
    }


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

  }


})();
