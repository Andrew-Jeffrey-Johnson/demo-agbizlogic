(function() {
  'use strict';

  angular
  .module("scenarioModule")
  .component("scenarioContributions", {
    templateUrl: "/static/scenario/scenario-contributions/scenario-contributions.component.html",
    controller: ScenarioContributionsComponentController,
  });


  /****************************************************************
                         Controller
  ****************************************************************/

  ScenarioContributionsComponentController.$inject = [
    "$state",
    "scenarioService",
    "commonService",
    "$interval",
    "$q",
  ];

  function ScenarioContributionsComponentController(
    $state,
    scenarioService,
    commonService,
    $interval,
    $q) {
    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.updatePlan = updatePlan;
    $ctrl.proceed = proceed;
    $ctrl.back = back;

    // Scenario
    $ctrl.scenario;
    $ctrl.plans;
    $ctrl.role;

    // Misc
    $ctrl.current_user;
    $ctrl.progress = 0;

    // Errors
    $ctrl.is_error = false;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      if ($state.params['scenario'] === undefined ||
          $state.params['scenario'] < 1 ||
          $state.params['role'] === undefined ||
          ['landowner', 'tenant'].indexOf($state.params['role']) == -1) {
        $state.go("scenarioManager");
      }
      else {
        startProgress(1);

        scenarioService.retrieveScenario($state.params['scenario'])
        .then(function(scenario_response) {
          if (scenario_response === undefined ||
            scenario_response.data === undefined ||
            scenario_response.data.id === undefined ||
            scenario_response.data.id < 1) {
            $state.go("scenarioManager");
          }
          else {
            $ctrl.scenario = scenario_response.data;
            scenarioService.listPlansByScenario($ctrl.scenario.id)
            .then(function (plan_response){
              $ctrl.plans = plan_response.data;

              $ctrl.plans.sort(function (a, b) {
                return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
              });

            });
            $ctrl.role = $state.params['role'];

            return commonService.retrieveCurrentUser();
          }
        })
        .then(function(current_user_response) {
          if (current_user_response !== undefined &&
            current_user_response.data !== undefined) {
            $ctrl.current_user = current_user_response.data;
          }
        });
      }
    }


    function updatePlan(plan_id, discount_rate, beginning_investment, ending_investment) {
      if (plan_id !== undefined &&
        plan_id > 0 &&
        !isNaN(discount_rate) &&
        !isNaN(beginning_investment) &&
        !isNaN(ending_investment)) {
        angular.forEach($ctrl.plans, function(plan) {
          if (plan.id == plan_id) {
            plan.discount_rate = discount_rate;
            plan.beginning_investment = beginning_investment;
            plan.ending_investment = ending_investment;
          }
          $ctrl.is_error = false;
        });
      }
      else {
        $ctrl.is_error = true;
      }
    }


    function proceed() {
      if ($ctrl.is_error == false) {
        var requests = [];
        angular.forEach($ctrl.plans, function(plan) {
          requests.push(scenarioService.updatePlan(plan));
        });

        $q.all(requests)
        .then(function(responses) {
          switch ($ctrl.role) {
            case 'landowner':
              $state.go('scenarioContributions', {
                'scenario': $ctrl.scenario.id,
                'role': 'tenant',
              });
              break;

            case 'tenant':
              $state.go('scenarioManager');
              break;
          }
        });
      }
    }


    function back() {
      if(!$ctrl.module){
        $ctrl.module = 'profit';
      }
      $state.go("scenarioCreate", {'scenario': $ctrl.scenario.id, 'module': $ctrl.module});
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

  }

}());
