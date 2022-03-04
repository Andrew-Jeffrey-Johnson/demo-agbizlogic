(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("scenarioDiscountRate", {
      templateUrl: "/static/scenario/scenario-discount-rate/scenario-discount-rate.component.html",
      controller: ScenarioDiscountRateComponentController,
    });


  /****************************************************************
                         Controller
  ****************************************************************/

  ScenarioDiscountRateComponentController.$inject = [
    "$state",
    "scenarioService",
    "commonService",
    "$interval",
    "$q",
  ];

  function ScenarioDiscountRateComponentController(
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
    $ctrl.from_profit;
    $ctrl.plans;
    $ctrl.module;

    // Misc
    $ctrl.current_user;
    $ctrl.progress = 0;

    // Errors
    $ctrl.is_error = false;
    $ctrl.loading = true;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'];
      $ctrl.module = $state.params['module'];
      $ctrl.from_profit=$state.params['from_profit'];
      if (scenario_id === undefined || scenario_id < 1) {
        $state.go("scenarioManager");
      }
      else {
        startProgress(1);

        scenarioService.retrieveScenario(scenario_id)
        .then(function(scenario_response) {
          if (scenario_response === undefined ||
              scenario_response.data === undefined ||
              scenario_response.data.id === undefined ||
              scenario_response.data.id < 1) {
            $state.go("scenarioManager");
          }
          else {
            $ctrl.scenario = scenario_response.data;
            scenarioService.listPlansByScenario(scenario_id)
            .then(function (plan_response){
              $ctrl.plans = plan_response.data;

              $ctrl.plans.sort(function (a, b) {
                return new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
              });

            });

            return commonService.retrieveCurrentUser();
          }
        })
        .then(function(current_user_response) {
          if (current_user_response !== undefined &&
              current_user_response.data !== undefined) {
            $ctrl.current_user = current_user_response.data;
            $ctrl.loading = false;
          }
        });
      }

    }


    function updatePlan(plan_id, discount_rate, beginning_investment, ending_investment, use_investment_values) {
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
            plan.use_investment_values = use_investment_values;
          }
          $ctrl.is_error = false;
        });
      }
      else {
        $ctrl.is_error = true;
      }
    }


    function proceed() {
      startProgress(5);
      if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }

      if ($ctrl.is_error == false) {
        var requests = [];
        angular.forEach($ctrl.plans, function(plan) {
          requests.push(scenarioService.updatePlan(plan));
        });

        $q.all(requests)
        .then(function(responses) {
        if($ctrl.module!="profit"){

          $state.go("scenarioSummary", {
             'edited':"true",
            'scenario': $ctrl.scenario.id,
            'module' : $ctrl.module
          });
      }
      else {
          if ($ctrl.from_profit==undefined){
            $state.go("profitSummary", {
                'edited':"true",
              'scenario': $ctrl.scenario.id,
              'module' : $ctrl.module
            });
          }
          else{
            $state.go("profitSummary", {
                'edited':"true",
              'scenario': $ctrl.scenario.id,
              'module' : $ctrl.module,
              'from_profit':"true"
            });

          }
      }
        });

      }
    }


    function back() {
       if($ctrl.module === undefined){
        $ctrl.module = 'profit';
      }
      if ($ctrl.from_profit=="true"){
        $state.go("scenarioCreate", {'scenario': $ctrl.scenario.id,'module':$ctrl.module,'from_profit':"true"});
      }
      else{
        $state.go("scenarioCreate", {'scenario': $ctrl.scenario.id,'module':$ctrl.module});
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

  }

}());
