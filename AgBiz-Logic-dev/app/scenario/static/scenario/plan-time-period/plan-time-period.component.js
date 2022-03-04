(function () {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planTimePeriod", {
      templateUrl: "/static/scenario/plan-time-period/plan-time-period.component.html",
      controller: PlanTimePeriodComponentController,
    });


  /****************************************************************
   Controller
   ****************************************************************/

  PlanTimePeriodComponentController.$inject = [
    '$state',
    '$interval',
    'scenarioService',
  ];

  function PlanTimePeriodComponentController(
    $state,
    $interval,
    scenarioService) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.duplicatePlanBudget = duplicatePlanBudget;
    $ctrl.removePlanBudget = removePlanBudget;
    $ctrl.proceed = proceed;
    $ctrl.back = back;

    // Plan
    $ctrl.plan;
    $ctrl.module;

    //
    $ctrl.recalculate;

    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      startProgress(3);

      var plan_id = $state.params['plan'];

      $ctrl.module = $state.params['module'];

      if (plan_id === undefined || plan_id < 1) {
        $state.go("planManager");
      }
      else {
        scenarioService.retrievePlan(plan_id, ["id", "title", "notes", "plan_budgets"])
          .then(function (plan_response) {
            if (plan_response === undefined ||
              plan_response.data === undefined ||
              plan_response.data.id === undefined ||
              plan_response.data.plan_budgets === undefined ||
              plan_response.data.plan_budgets.length < 1) {
                $state.go("planManager");
              }
          })
          .then(function () {
            scenarioService.retrievePlan(plan_id, ["id", "title", "notes", "plan_budgets"])
              .then(function (updated_plan_response) {
                if (updated_plan_response === undefined ||
                  updated_plan_response.data === undefined ||
                  updated_plan_response.data.id === undefined ||
                  updated_plan_response.data.plan_budgets === undefined ||
                  updated_plan_response.data.plan_budgets.length < 1) {
                  console.log(3);
                  $state.go("planManager");
                }
                else {
                  $ctrl.plan = updated_plan_response.data;
                  recalculate($ctrl.plan);
                }
              });
          });
      }
    }


    function duplicatePlanBudget(plan_budget) {
      startProgress(1);

      if (plan_budget !== undefined && plan_budget.budget !== undefined) {
        scenarioService.generatePlanBudget($ctrl.plan.id, plan_budget.budget, $ctrl.module)
          .then(function (plan_budget_response) {
            if (plan_budget_response !== undefined && plan_budget_response.data !== undefined) {
              var new_plan_budget = plan_budget_response.data;
              new_plan_budget.position = plan_budget.position + 1;

              return scenarioService.updatePlanBudget(new_plan_budget);
            }
          })
          .then(function (updated_plan_budget_response) {
            if (updated_plan_budget_response !== undefined && updated_plan_budget_response.data !== undefined) {
              return scenarioService.retrievePlan($ctrl.plan.id, [
                "id", "title", "notes", "time_period_unit", "time_period_value", "plan_budgets",
              ]);
            }
          })
          .then(function (updated_plan_response) {
            if (updated_plan_response !== undefined && updated_plan_response.data !== undefined) {
              $ctrl.plan = updated_plan_response.data;
              recalculate($ctrl.plan);
            }
          });
      }
    }


    function removePlanBudget(plan_budget) {
      startProgress(1);

      if (plan_budget !== undefined && plan_budget.budget !== undefined) {
        scenarioService.destroyPlanBudget(plan_budget.id)
          .then(function (response) {
            if (response !== undefined && response.data !== undefined) {
              return scenarioService.retrievePlan($ctrl.plan.id, [
                "id", "title", "notes", "time_period_unit", "time_period_value", "plan_budgets",
              ]);
            }
          })
          .then(function (updated_plan_response) {
            if (updated_plan_response !== undefined && updated_plan_response.data !== undefined) {
              $ctrl.plan = updated_plan_response.data;
              recalculate($ctrl.plan);
            }
          });
      }
    }


    function proceed() {
      $state.go("planTotalSpace", {'plan': $ctrl.plan.id, 'module': $ctrl.module});
    }


    function back() {
      $state.go("planCreate", {'plan': $ctrl.plan.id, 'module': $ctrl.module});
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

      $interval(function () {
        $ctrl.progress++;
      }, ((time_per_call * num_calls) / 100), 100)
    }

    function recalculate(plan) {
      var RECORD_TABLE = {
        'Day': 0, 'Week': 0, 'Month': 0, 'Year': 0,
      };

      var CONVERSION_TABLE = {
        'Day': {'value': 1, 'Day': 1, 'Week': 0.14, 'Month': 0.03, 'Year': 0.003, 'unit': 'Day', 'n': 365},
        'Week': {'value': 2, 'Day': 7, 'Week': 1, 'Month': 0.25, 'Year': 0.019230769, 'unit': 'Week', 'n': 52},
        'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 0.08, 'unit': 'Month', 'n': 12},
        'Year': {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year', 'n': 1},
      };

      angular.forEach(plan.plan_budgets, function (budget) {
        RECORD_TABLE[budget.time_unit] += budget.time_value;
      });

      var new_unit = 'Day';
      var new_time_period_value = RECORD_TABLE['Day'] + (RECORD_TABLE['Week'] * 7) + (RECORD_TABLE['Month'] * 30) + (RECORD_TABLE['Year'] * 365);

      if (RECORD_TABLE['Day'] % 7 === 0) {
        new_unit = 'Week';
        new_time_period_value = (RECORD_TABLE['Day'] / 7) + RECORD_TABLE['Week'] + (RECORD_TABLE['Month'] * 4) + (RECORD_TABLE['Year'] * 52);
      }
      if (RECORD_TABLE['Day'] % 30 === 0 && RECORD_TABLE['Week'] % 4 === 0) {
        new_unit = 'Month';
        new_time_period_value = (RECORD_TABLE['Day'] / 30) + (RECORD_TABLE['Week'] / 4) + RECORD_TABLE['Month'] + (RECORD_TABLE['Year'] * 12);
      }
      if (RECORD_TABLE['Day'] % 365 === 0 && RECORD_TABLE['Week'] % 52 === 0 && RECORD_TABLE['Month'] % 12 === 0) {
        new_unit = 'Year';
        new_time_period_value = (RECORD_TABLE['Day'] / 365) + (RECORD_TABLE['Week'] / 52) + (RECORD_TABLE['Month'] / 12) + RECORD_TABLE['Year'];
      }

      angular.forEach(CONVERSION_TABLE, function (content, key) {
        if (content['value'] > CONVERSION_TABLE[new_unit]['value']) {
          if (new_time_period_value % content[new_unit] === 0) {
            new_time_period_value = new_time_period_value / content[new_unit];
            new_unit = key;
          }
        }
      });

      plan.time_period_unit = new_unit;
      plan.time_period_value = new_time_period_value;

      scenarioService.updatePlan(plan);

    }


  }

}());
