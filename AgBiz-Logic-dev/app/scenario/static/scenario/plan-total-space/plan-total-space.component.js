(function() {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planTotalSpace", {
      templateUrl: "/static/scenario/plan-total-space/plan-total-space.component.html",
      controller: PlanTotalSpaceComponentController,
    });


  /****************************************************************
                       Controller
  ****************************************************************/

  PlanTotalSpaceComponentController.$inject = [
    "$q",
    "$state",
    "$interval",
    "scenarioService",
  ];

  function PlanTotalSpaceComponentController(
      $q,
      $state,
      $interval,
      scenarioService) {

    var $ctrl = this;

    /****************************************************************
                         Bindable Members
    ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.updateData = updateData;
    $ctrl.back = back;
    $ctrl.proceed = proceed;

    // User
    $ctrl.user;

    // Plan
    $ctrl.plan;
    $ctrl.module;
    $ctrl.space_error;


    /****************************************************************
                         Methods
    ****************************************************************/

    function $onInit() {
      var plan_id = $state.params['plan'];
      $ctrl.module = $state.params['module'];


      if (plan_id === undefined || plan_id < 1) {
        $state.go("planManager");
      }
      else {
        scenarioService.retrievePlan(plan_id, ["id", "title", "notes", "plan_budgets"])
        .then(function(plan_response) {
          if (plan_response == undefined ||
              plan_response.data == undefined ||
              plan_response.data.id == undefined ||
              plan_response.data.plan_budgets == undefined ||
              plan_response.data.plan_budgets.length < 1) {
            $state.go("planManager");
          }
          else {

            $ctrl.plan = plan_response.data;

            $ctrl.plan.plan_budgets.sort(function (a, b) {
              return a.position - b.position
            });
            console.log($ctrl.plan.plan_budgets)

            angular.forEach($ctrl.plan.plan_budgets,function(plan_budget){
                plan_budget.total_space_used = plan_budget.farm_unit_quantity;
                plan_budget.total_space_available = plan_budget.farm_unit_quantity;
                plan_budget.space_valid = true;
              }
            );
          }
        });
      }



    }



    function updateData(budget_id, space_units, total_space_available, total_space_used, valid) {

      angular.forEach($ctrl.plan.plan_budgets, function(plan_budget) {
        if (plan_budget.id == budget_id) {
          plan_budget.space_units = space_units;
          plan_budget.total_space_available = total_space_available;
          plan_budget.total_space_used = total_space_used;
          plan_budget.space_valid = valid;
        }
      });

      checkSpaceError();
    }

    function checkSpaceError(){
      console.log($ctrl.forms);
      var keepGoing = true;

      angular.forEach($ctrl.plan.plan_budgets, function(plan_budget) {
            if(!(plan_budget.space_valid && keepGoing)){
              keepGoing = false;
            }
      });

      if(!keepGoing){
        $ctrl.space_error = true;
      }
      else{
        $ctrl.space_error = false;
      }
    }

    function back() {
      $state.go("planTimePeriod", {'plan': $ctrl.plan.id,'module': $ctrl.module});
    }



    function proceed() {
      var requests = [];

      angular.forEach($ctrl.plan.plan_budgets, function(plan_budget) {
        if (plan_budget.space_units != "" && plan_budget.total_space_available != 0 && plan_budget.total_space_used != 0) {
          requests.push(scenarioService.updatePlanBudget(plan_budget));
        }
      });
      // Resolve all requests
      if (requests.length > 0) {
        startProgress(1);

        $q.all(requests)
        .then(function() {
          $state.go("planInflation", {'plan': $ctrl.plan.id,  'module':$ctrl.module,'edited':"true"});
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

  }

}());
