(function () {
  'use strict';

  angular
    .module("scenarioModule")
    .component("planManager", planManager());

  function planManager() {
    var component = {
      templateUrl: "/static/scenario/plan-manager/plan-manager.component.html",
      controller: PlanManagerComponentController,
    };

    return component;
  }


  /****************************************************************
   Controller
   ****************************************************************/

  PlanManagerComponentController.$inject = [
    'commonService',
    'scenarioService',
    'budgetService',
    '$state',
    '$window',
    "$uibModal",
    '$interval',
  ];

  function PlanManagerComponentController(
    commonService,
    scenarioService,
    budgetService,
    $state,
    $window,
    $uibModal,
    $interval) {
    var $ctrl = this;

    /****************************************************************
     Bindable Members
     ****************************************************************/

    // Methods
    $ctrl.$onInit = $onInit;
    $ctrl.newPlan = newPlan;
    $ctrl.editPlan = editPlan;
    $ctrl.copyPlan = copyPlan;
    $ctrl.viewSummary = viewSummary;
    $ctrl.removePlan = removePlan;

    // Plans
    $ctrl.plan_list;

    // User
    $ctrl.user;
    $ctrl.module;

    // Misc
    $ctrl.progress = 100;
    $ctrl.back = back;


    /****************************************************************
     Methods
     ****************************************************************/

    function $onInit() {
      var scenario_id = $state.params['scenario'];
        if($state.params['module'] == null){
          $ctrl.module = 'profit';
        } else{
          $ctrl.module = $state.params['module'];
        }
        commonService.retrieveCurrentUser()
        .then(function(user_response) {
          $ctrl.user = user_response.data;

          return scenarioService.listPlans($ctrl.user.username, "all", ["id", "title", "notes", "created_date", "modified_date","scenario_list","full_title"]);
        })
        .then(function (plan_list_response) {
          $ctrl.plan_list = plan_list_response.data;
          console.log(  $ctrl.plan_list);
        });
    }

    function back() {
      window.location.replace("/dashboard");
    }

    function newPlan() {
      startProgress(1);
      var new_plan = {
        'title': "New Plan",
        'notes': "",
        'discount_rate': 0,
        'beginning_investment': 0,
        'ending_investment': 0,
        'lease_type': "Default",
        'land_market_value': 0,
        'annual_land_rate': 0,
        'required_roi': 0,
        'investment_inflation': 0,
      };

      scenarioService.createPlan(new_plan)
        .then(function (new_plan_response) {
          commonService.pushStorage(new_plan_response.data);
          if ($ctrl.module === undefined) {
            $ctrl.module = 'profit';
          }
          $state.go("planCreate", {
            'plan': new_plan_response.data.id,
            'module': $ctrl.module,
            'new': true,
          });
        });
    }

    function copyPlan(type) {
      openCopyPlanModal(type);
    }

    function openCopyPlanModal(type) {
      $uibModal.open({
        animation: true,
        size: "lg",
        templateUrl: "/static/scenario/plan-manager/copy-plan-modal/copy-plan-modal.html",
        controller: "CopyPlanModalController",
        controllerAs: "$ctrl",
        resolve: {
          plan_list: function () {
            return $ctrl.plan_list;
          },
          type: function () {
            return type;
          },
        },
      });
    }


    function editPlan(plan) {
      if (plan !== undefined && plan.id !== undefined) {

        if ($ctrl.module === undefined) {
          $ctrl.module = 'profit';
        }

        $state.go("planSummary", {
          'plan': plan.id,
          'module': $ctrl.module,
        });
      }
    }


    function viewSummary(plan) {
      if (plan !== undefined && plan.id !== undefined) {

        if ($ctrl.module === undefined) {
          $ctrl.module = 'profit';
        }

        $state.go("planSummary", {
          'plan': plan.id,
          'module': $ctrl.module,
        });
      }
    }


    function removePlan(plan) {
      startProgress(1);

      angular.forEach(plan.plan_budgets, function (plan_budget) {
        budgetService.destroyBudget(plan_budget.budget);
      });

      scenarioService.destroyPlan(plan.id)
        .then(function () {
          return scenarioService.listPlans($ctrl.user.username, "original", ["id", "title", "notes", "created_date", "modified_date"]);
        })
        .then(function (plan_list_response) {
          $ctrl.plan_list = plan_list_response.data;
        });
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

  }

})();
